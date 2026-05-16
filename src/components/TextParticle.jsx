import { useEffect, useRef, useState } from 'react'

export function TextParticle({
  text,
  fontSize = 80,
  fontFamily = 'Arial, sans-serif',
  particleSize = 2,
  particleColor = '#ffffff',
  particleDensity = 8,
  backgroundColor = 'transparent',
}) {
  const canvasRef    = useRef(null)
  const [particles, setParticles] = useState([])
  const [mouse, setMouse]         = useState({ x: null, y: null })
  const animationRef = useRef(null)

  // Build particles from the rendered text shape
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const build = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.font         = `bold ${fontSize}px ${fontFamily}`
      ctx.fillStyle    = '#ffffff'
      ctx.textAlign    = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(text, canvas.width / 2, canvas.height / 2)

      const data   = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const result = []

      for (let y = 0; y < data.height; y += particleDensity) {
        for (let x = 0; x < data.width; x += particleDensity) {
          const alpha = data.data[(y * data.width + x) * 4 + 3]
          if (alpha > 128) {
            result.push({
              x, y,
              baseX: x,
              baseY: y,
              size: particleSize,
              density: Math.random() * 30 + 1,
              color: particleColor,
            })
          }
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      setParticles(result)
    }

    window.addEventListener('resize', build)
    build()
    return () => {
      window.removeEventListener('resize', build)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [text, fontSize, fontFamily, particleSize, particleColor, particleDensity])

  // Animation loop
  useEffect(() => {
    if (particles.length === 0) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (backgroundColor !== 'transparent') {
        ctx.fillStyle = backgroundColor
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      for (const p of particles) {
        let fx = 0, fy = 0
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p.x
          const dy = mouse.y - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            fx = (dx / dist) * 3
            fy = (dy / dist) * 3
          }
        }
        p.x += fx + (p.baseX - p.x) * 0.05
        p.y += fy + (p.baseY - p.y) * 0.05

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.fill()
      }

      animationRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current) }
  }, [particles, mouse, backgroundColor])

  const onMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }
  const onMouseLeave = () => setMouse({ x: null, y: null })

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  )
}
