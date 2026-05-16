import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import './About.css'

export default function About() {
  const navigate = useNavigate()
  const [isGoldMode, setIsGoldMode] = useState(false)
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const animationRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const createParticle = () => {
      const p = {
        x: 0, y: 0, speed: 0, opacity: 1,
        fadeDelay: 0, fadeStart: 0, fadingOut: false,
        reset() {
          this.x = Math.random() * canvas.width
          this.y = Math.random() * canvas.height
          this.speed = Math.random() / 5 + 0.1
          this.opacity = 1
          this.fadeDelay = Math.random() * 600 + 100
          this.fadeStart = Date.now() + this.fadeDelay
          this.fadingOut = false
        },
        update() {
          this.y -= this.speed
          if (this.y < 0) this.reset()
          if (!this.fadingOut && Date.now() > this.fadeStart) this.fadingOut = true
          if (this.fadingOut) {
            this.opacity -= 0.008
            if (this.opacity <= 0) this.reset()
          }
        },
        draw() {
          ctx.fillStyle = `rgba(${255 - (Math.random() * 255) / 2}, 255, 255, ${this.opacity})`
          ctx.fillRect(this.x, this.y, 0.4, Math.random() * 2 + 1)
        },
      }
      p.reset()
      p.y = Math.random() * canvas.height
      p.fadeStart = Date.now() + Math.random() * 600 + 100
      return p
    }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      const count = Math.floor((canvas.width * canvas.height) / 6000)
      particlesRef.current = Array.from({ length: count }, createParticle)
    }

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particlesRef.current.forEach(p => { p.update(); p.draw() })
      animationRef.current = requestAnimationFrame(tick)
    }

    resize()
    tick()
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return (
    <motion.div
      className={`about${isGoldMode ? ' about--gold' : ''}`}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.35 }}
    >
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="about__canvas" />

      {/* Spotlight beams */}
      <div className="about__spotlights">
        <div className="about__beam about__beam--1" />
        <div className="about__beam about__beam--2" />
        <div className="about__beam about__beam--center" />
      </div>

      {/* Back button */}
      <button className="about__back" onClick={() => navigate('/')}>← Back</button>

      {/* Title */}
      <div className="about__hero">
        <button
          className={`about__midspot${isGoldMode ? ' about__midspot--gold' : ''}`}
          onClick={() => setIsGoldMode(g => !g)}
          aria-label="Toggle gold mode"
        />
        <span className="about__title--glow">About Me</span>
        <h1 className="about__title">About Me</h1>
      </div>
    </motion.div>
  )
}
