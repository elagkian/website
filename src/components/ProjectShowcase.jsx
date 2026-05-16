import { useState, useRef, useEffect } from 'react'
import { ArrowUpRight } from 'lucide-react'
import './ProjectShowcase.css'

const projects = [
  {
    title: 'OpenFoodFacts Analysis',
    description: 'Data science pipeline combining 4M+ OpenFoodFacts products with WHO and World Bank health datasets to uncover global nutritional trends and correlations.',
    year: 'Fall 2025',
    link: 'https://github.com/elagkian/openfoodfacts-analysis',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Iroh MIDI/OSC',
    description: 'Peer-to-peer music collaboration tool in Rust that routes MIDI and OSC messages over the internet via the Iroh protocol for low-latency remote jamming sessions.',
    year: 'Fall 2025',
    link: 'https://github.com/elagkian/iroh-midi-osc',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Tremuno',
    description: 'Cheat-proof peer-to-peer Uno for Android built on the Tremola Bluetooth mesh network, using Mental Poker cryptographic protocols to guarantee fair play without a central server.',
    year: 'Spring 2025',
    link: 'https://github.com/thechnet/tremuno',
    image: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Linux Kernel Driver',
    description: 'Custom kernel-mode Linux driver in C that exposes a self-built Arduino device as a standard file interface, handling interrupt-driven data transfer through the kernel subsystem.',
    year: 'Spring 2025',
    link: 'https://github.com/thechnet/rl3ds',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: '3D Scanner',
    description: 'Arduino-controlled 3D scanner using stepper motors and time-of-flight distance sensors to capture object geometry and produce reconstructed point-cloud models.',
    year: 'Fall 2024',
    link: 'https://github.com/thechnet/rl3ds',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'LetUsCook!',
    description: 'Real-time multiplayer Java game with a client-server architecture, featuring synchronised game state and a fast-paced co-op cooking loop.',
    year: 'Spring 2024',
    link: 'https://github.com/cookkings/letuscook',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
  },
]

export function ProjectShowcase() {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [mousePos,     setMousePos]     = useState({ x: 0, y: 0 })
  const [smoothPos,    setSmoothPos]    = useState({ x: 0, y: 0 })
  const [visible,      setVisible]      = useState(false)
  const [rectLeft,     setRectLeft]     = useState(0)
  const [rectTop,      setRectTop]      = useState(0)
  const containerRef = useRef(null)
  const rafRef       = useRef(null)

  useEffect(() => {
    const lerp = (a, b, t) => a + (b - a) * t
    const tick = () => {
      setSmoothPos(prev => ({
        x: lerp(prev.x, mousePos.x, 0.15),
        y: lerp(prev.y, mousePos.y, 0.15),
      }))
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [mousePos])

  const syncRect = () => {
    if (containerRef.current) {
      const r = containerRef.current.getBoundingClientRect()
      setRectLeft(r.left)
      setRectTop(r.top)
    }
  }

  useEffect(() => {
    syncRect()
    window.addEventListener('scroll', syncRect)
    window.addEventListener('resize', syncRect)
    return () => {
      window.removeEventListener('scroll', syncRect)
      window.removeEventListener('resize', syncRect)
    }
  }, [])

  const handleMouseMove = (e) => {
    syncRect()
    if (containerRef.current) {
      const r = containerRef.current.getBoundingClientRect()
      setMousePos({ x: e.clientX - r.left, y: e.clientY - r.top })
    }
  }

  return (
    <section ref={containerRef} onMouseMove={handleMouseMove} className="ps">
      <h2 className="ps__heading">Selected Work</h2>

      {/* floating image preview */}
      <div
        className="ps__preview"
        style={{
          left:      rectLeft,
          top:       rectTop,
          transform: `translate3d(${smoothPos.x + 28}px, ${smoothPos.y - 160}px, 0)`,
          opacity:   visible ? 1 : 0,
          scale:     visible ? 1 : 0.85,
        }}
      >
        {projects.map((p, i) => (
          <img
            key={p.title}
            src={p.image}
            alt={p.title}
            className="ps__preview-img"
            style={{
              opacity: hoveredIndex === i ? 1 : 0,
              scale:   hoveredIndex === i ? 1 : 1.08,
              filter:  hoveredIndex === i ? 'none' : 'blur(8px)',
            }}
          />
        ))}
        <div className="ps__preview-overlay" />
      </div>

      {/* list */}
      <div className="ps__list">
        {projects.map((project, i) => (
          <a
            key={project.title}
            href={project.link}
            className="ps__item"
            onMouseEnter={() => { setHoveredIndex(i); setVisible(true)  }}
            onMouseLeave={() => { setHoveredIndex(null); setVisible(false) }}
          >
            <div className={`ps__item-bg${hoveredIndex === i ? ' ps__item-bg--on' : ''}`} />

            <div className="ps__item-inner">
              <div className="ps__item-left">
                <div className="ps__title-row">
                  <h3 className="ps__title">
                    <span className="ps__title-text">
                      {project.title}
                      <span className={`ps__underline${hoveredIndex === i ? ' ps__underline--on' : ''}`} />
                    </span>
                  </h3>
                  <ArrowUpRight
                    size={22}
                    className={`ps__arrow${hoveredIndex === i ? ' ps__arrow--on' : ''}`}
                  />
                </div>
                <p className={`ps__desc${hoveredIndex === i ? ' ps__desc--on' : ''}`}>
                  {project.description}
                </p>
              </div>
              <span className={`ps__year${hoveredIndex === i ? ' ps__year--on' : ''}`}>
                {project.year}
              </span>
            </div>
          </a>
        ))}
        <div className="ps__end-border" />
      </div>
    </section>
  )
}
