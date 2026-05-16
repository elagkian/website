import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const fragmentShader = `
#define NUM_OCTAVES 3

varying vec2 vUv;
uniform float iTime;
uniform vec2 iResolution;
uniform sampler2D uDataTexture;

float rand(vec2 n) {
  return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 ip = floor(p);
  vec2 u = fract(p);
  u = u * u * (3.0 - 2.0 * u);
  float res = mix(
    mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
    mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x),
    u.y
  );
  return res * res;
}

float fbm(vec2 x) {
  float v = 0.0;
  float a = 0.3;
  vec2 shift = vec2(100.0);
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
  for (int i = 0; i < NUM_OCTAVES; ++i) {
    v += a * noise(x);
    x = rot * x * 2.0 + shift;
    a *= 0.4;
  }
  return v;
}

void main() {
  // Apply mouse-driven grid distortion to UV
  vec4 offset = texture2D(uDataTexture, vUv);
  vec2 distortedUv = vUv + 0.02 * offset.rg;

  // Map distorted UV into aurora coordinate space
  vec2 shake = vec2(sin(iTime * 1.2) * 0.005, cos(iTime * 2.1) * 0.005);
  vec2 p = (distortedUv - 0.5 + shake) * vec2(iResolution.x / iResolution.y, 1.0);
  p = p * mat2(6.0, -4.0, 4.0, 6.0);

  vec2 v;
  vec4 o = vec4(0.0);

  float f = 2.0 + fbm(p + vec2(iTime * 5.0, 0.0)) * 0.5;

  for (float i = 0.0; i < 35.0; i++) {
    v = p + cos(i * i + (iTime + p.x * 0.08) * 0.025 + i * vec2(13.0, 11.0)) * 3.5
          + vec2(sin(iTime * 3.0 + i) * 0.003, cos(iTime * 3.5 - i) * 0.003);
    float tailNoise = fbm(v + vec2(iTime * 0.5, i)) * 0.3 * (1.0 - (i / 35.0));
    vec4 auroraColors = vec4(
      0.1 + 0.3 * sin(i * 0.2 + iTime * 0.4),
      0.3 + 0.5 * cos(i * 0.3 + iTime * 0.5),
      0.7 + 0.3 * sin(i * 0.4 + iTime * 0.3),
      1.0
    );
    vec4 contribution = auroraColors
      * exp(sin(i * i + iTime * 0.8))
      / length(max(v, vec2(v.x * f * 0.015, v.y * 1.5)));
    float thinness = smoothstep(0.0, 1.0, i / 35.0) * 0.6;
    o += contribution * (1.0 + tailNoise * 0.8) * thinness;
  }

  o = tanh(pow(o / 100.0, vec4(1.6)));
  gl_FragColor = o * 1.5;
}
`;

export default function AuroraDistortion({ grid = 10, mouse = 0.1, strength = 0.15, relaxation = 0.9 }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // Use window dimensions — reliable at any point in the render cycle
    const w = window.innerWidth;
    const h = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x020718, 1); // dark blue fallback
    renderer.setSize(w, h);
    container.appendChild(renderer.domElement);

    // Grid distortion data texture
    const size = grid;
    const data = new Float32Array(4 * size * size);
    const dataTexture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.FloatType);
    dataTexture.needsUpdate = true;

    const uniforms = {
      iTime:        { value: 0 },
      iResolution:  { value: new THREE.Vector2(w, h) },
      uDataTexture: { value: dataTexture },
    };

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms });
    scene.add(new THREE.Mesh(geometry, material));

    // Mouse state — listen on window so pointer events over any overlaid element still register
    const ms = { x: 0, y: 0, prevX: 0, prevY: 0, vX: 0, vY: 0 };

    const onMouseMove = (e) => {
      const x = e.clientX / window.innerWidth;
      const y = 1 - e.clientY / window.innerHeight;
      ms.vX = x - ms.prevX;
      ms.vY = y - ms.prevY;
      ms.x = ms.prevX = x;
      ms.y = ms.prevY = y;
    };

    // Attach to window — not container — so overlaid content doesn't block it
    window.addEventListener('mousemove', onMouseMove);

    const onResize = () => {
      const nw = window.innerWidth;
      const nh = window.innerHeight;
      renderer.setSize(nw, nh);
      uniforms.iResolution.value.set(nw, nh);
    };
    window.addEventListener('resize', onResize);

    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      uniforms.iTime.value += 0.016;

      const d = dataTexture.image.data;
      for (let i = 0; i < size * size; i++) {
        d[i * 4]     *= relaxation;
        d[i * 4 + 1] *= relaxation;
      }

      const gx = size * ms.x;
      const gy = size * ms.y;
      const maxDist = size * mouse;

      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const distSq = (gx - i) ** 2 + (gy - j) ** 2;
          if (distSq < maxDist * maxDist) {
            const idx   = 4 * (i + size * j);
            const power = Math.min(maxDist / Math.sqrt(distSq), 10);
            d[idx]     += strength * 100 * ms.vX * power;
            d[idx + 1] -= strength * 100 * ms.vY * power;
          }
        }
      }

      dataTexture.needsUpdate = true;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      dataTexture.dispose();
      renderer.dispose();
    };
  }, [grid, mouse, strength, relaxation]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', overflow: 'hidden' }} />
  );
}
