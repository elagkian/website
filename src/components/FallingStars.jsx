import { useEffect, useRef } from 'react';

const STAR_COUNT      = 12;
const MAGNETIC_RADIUS = 320;
const TRAIL_LEN       = 300; // frames of position history

const COLORS = [
  [100, 180, 255],
  [80,  220, 180],
  [120, 160, 255],
  [60,  200, 220],
  [140, 120, 255],
];

export default function FallingStars() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width, height, frameId;
    let stars = [];
    const mouse = { x: -1000, y: -1000 };

    class Star {
      constructor() { this.reset(true); }

      reset(initial = false) {
        this.speed = Math.random() * 0.4 + 0.15;
        this.vx    = this.speed * 0.75;
        this.vy    = this.speed;

        if (initial) {
          this.x = Math.random() * width;
          this.y = Math.random() * height;
        } else if (Math.random() < 0.5) {
          this.x = Math.random() * width;
          this.y = -160;
        } else {
          this.x = -160;
          this.y = Math.random() * height;
        }

        this.headSize    = Math.random() * 4 + 3;
        this.alpha       = Math.random() * 0.55 + 0.35;
        this.lineWidth   = Math.random() * 2.5 + 1.5;
        this.pulseOffset = Math.random() * Math.PI * 2;
        const c = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.r = c[0]; this.g = c[1]; this.b = c[2];

        // Position history — this is what the trail is drawn through
        this.trail = [];
      }

      update() {
        // Record position BEFORE this frame's movement so the trail lags behind
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > TRAIL_LEN) this.trail.shift();

        const dx   = mouse.x - this.x;
        const dy   = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MAGNETIC_RADIUS && dist > 0) {
          const force = (MAGNETIC_RADIUS - dist) / MAGNETIC_RADIUS;
          this.vx += (dy / dist) * force * 0.055;
          this.vy -= (dx / dist) * force * 0.055;
          this.vx += (dx / dist) * force * 0.018;
          this.vy += (dy / dist) * force * 0.018;
          this.vx *= 0.96;
          this.vy *= 0.96;
        }

        this.x += this.vx;
        this.y += this.vy;

        if (
          this.x > width  + 200 ||
          this.y > height + 200 ||
          this.x < -200         ||
          this.y < -200
        ) this.reset();
      }

      draw(time) {
        if (this.trail.length < 2) return;

        const pulse = 0.85 + 0.15 * Math.sin(time * 2 + this.pulseOffset);
        // All points: stored history + current head position
        const pts = this.trail;
        const n   = pts.length;

        ctx.save();

        // ── Pass 1: single glow stroke along the full path ──
        ctx.shadowBlur  = 12;
        ctx.shadowColor = `rgba(${this.r},${this.g},${this.b},0.7)`;
        ctx.strokeStyle = `rgba(${this.r},${this.g},${this.b},${this.alpha * 0.25 * pulse})`;
        ctx.lineWidth   = this.lineWidth;
        ctx.lineJoin    = 'round';
        ctx.lineCap     = 'round';
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < n; i++) ctx.lineTo(pts[i].x, pts[i].y);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();

        // ── Pass 2: per-segment fade (no shadow — already applied above) ──
        ctx.shadowBlur = 0;
        for (let i = 1; i < n; i++) {
          const t = i / n; // 0 = oldest/dim, 1 = newest/bright
          ctx.beginPath();
          ctx.moveTo(pts[i - 1].x, pts[i - 1].y);
          ctx.lineTo(pts[i].x, pts[i].y);
          ctx.strokeStyle = `rgba(${this.r},${this.g},${this.b},${t * this.alpha * pulse})`;
          ctx.lineWidth   = this.lineWidth * (0.2 + 0.8 * t);
          ctx.stroke();
        }
        // Final segment from last history point to current head
        ctx.beginPath();
        ctx.moveTo(pts[n - 1].x, pts[n - 1].y);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = `rgba(${this.r},${this.g},${this.b},${this.alpha * pulse})`;
        ctx.lineWidth   = this.lineWidth;
        ctx.stroke();

        // ── Pass 3: glowing head ──
        const r     = this.headSize * 3.5;
        const hGrad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, r);
        hGrad.addColorStop(0,   `rgba(255,255,255,${this.alpha * pulse})`);
        hGrad.addColorStop(0.3, `rgba(${this.r},${this.g},${this.b},${this.alpha * 0.8 * pulse})`);
        hGrad.addColorStop(1,   `rgba(${this.r},${this.g},${this.b},0)`);
        ctx.shadowBlur  = 14;
        ctx.shadowColor = `rgba(${this.r},${this.g},${this.b},0.9)`;
        ctx.fillStyle   = hGrad;
        ctx.beginPath();
        ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    }

    const init = () => {
      width  = canvas.width  = window.innerWidth;
      height = canvas.height = window.innerHeight;
      stars  = Array.from({ length: STAR_COUNT }, () => new Star());
    };

    let time = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.016;
      stars.forEach(s => { s.update(); s.draw(time); });
      frameId = requestAnimationFrame(render);
    };

    const onMouseMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onTouchMove = (e) => {
      if (e.touches[0]) { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; }
    };

    window.addEventListener('resize', init);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    init();
    render();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', init);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        display: 'block',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
}
