import { useState, useRef, useEffect } from 'react'
import { ArrowUpRight, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import openfoodImg from '../assets/openfood.png'
import midiImg from '../assets/midi.png'
import unoImg from '../assets/uno.png'
import scannerImg from '../assets/3D-Scanner.png'
import letuscookImg from '../assets/LetusCook.png'
import './ProjectShowcase.css'

const projects = [
  {
    title: 'OpenFoodFacts Analysis',
    description: 'Data science pipeline combining 4M+ OpenFoodFacts products with WHO and World Bank health datasets to uncover global nutritional trends and correlations.',
    details: 'A data science pipeline that combines more than 4 million products from the OpenFoodFacts database with WHO and World Bank health datasets. The analysis cleans and merges heterogeneous data sources to uncover global nutritional trends — for example how product composition correlates with public health indicators across countries.',
    year: 'Fall 2025',
    tech: ['Python', 'Pandas', 'Data Science'],
    link: 'https://github.com/elagkian/openfoodfacts-analysis',
    image: openfoodImg,
  },
  {
    title: 'Iroh MIDI/OSC',
    description: 'Peer-to-peer music collaboration tool in Rust that routes MIDI and OSC messages over the internet via the Iroh protocol for low-latency remote jamming sessions.',
    details: 'A peer-to-peer music collaboration tool written in Rust. It routes MIDI and OSC messages between machines over the internet using the Iroh protocol, enabling low-latency remote jamming sessions without any central server — musicians connect directly and play together in real time.',
    year: 'Fall 2025',
    tech: ['Rust', 'Iroh', 'MIDI', 'OSC'],
    link: 'https://github.com/elagkian/iroh-midi-osc',
    image: midiImg,
  },
  {
    title: 'Tremuno',
    description: 'Cheat-proof peer-to-peer Uno for Android built on the Tremola Bluetooth mesh network, using Mental Poker cryptographic protocols to guarantee fair play without a central server.',
    details: 'A cheat-proof, fully peer-to-peer implementation of Uno for Android, built on top of the Tremola Bluetooth mesh network. Mental Poker cryptographic protocols guarantee that no player can peek at or manipulate cards — fair play is enforced by cryptography instead of a central server.',
    year: 'Spring 2025',
    tech: ['Android', 'P2P', 'Cryptography'],
    link: 'https://github.com/thechnet/tremuno',
    image: unoImg,
  },
  {
    title: 'Linux Kernel Driver',
    description: 'Custom kernel-mode Linux driver in C that exposes a self-built Arduino device as a standard file interface, handling interrupt-driven data transfer through the kernel subsystem.',
    details: 'A custom kernel-mode Linux driver written in C. It exposes a self-built Arduino device to userspace as a standard file interface and handles interrupt-driven data transfer through the kernel subsystem — covering the full path from hardware signal to system call.',
    year: 'Spring 2025',
    tech: ['C', 'Linux Kernel', 'Arduino'],
    link: 'https://github.com/thechnet/rl3ds',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: '3D Scanner',
    description: 'Arduino-controlled 3D scanner using stepper motors and time-of-flight distance sensors to capture object geometry and produce reconstructed point-cloud models.',
    details: 'An Arduino-controlled 3D scanner built from stepper motors and time-of-flight distance sensors. The firmware sweeps the sensor around an object, captures its geometry layer by layer and produces reconstructed point-cloud models of the scanned object.',
    year: 'Fall 2024',
    tech: ['Arduino', 'C', 'Electronics'],
    link: 'https://github.com/thechnet/rl3ds',
    image: scannerImg,
  },
  {
    title: 'LetUsCook!',
    description: 'Real-time multiplayer Java game with a client-server architecture, featuring synchronised game state and a fast-paced co-op cooking loop.',
    details: 'An Overcooked-inspired real-time multiplayer game written in Java with a client-server architecture. The server keeps the game state synchronised across all clients while players race through a fast-paced co-op cooking loop — chopping, cooking and serving orders together.',
    year: 'Spring 2024',
    tech: ['Java', 'JavaFX', 'Networking'],
    link: 'https://github.com/cookkings/letuscook',
    image: letuscookImg,
  },
]

function GithubIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.05-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22 0 1.61-.01 2.9-.01 3.29 0 .32.21.7.82.58C20.57 21.8 24 17.31 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

const infoStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.18 } },
}

const infoItem = {
  hidden: { opacity: 0, x: 32 },
  show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}

export function ProjectShowcase() {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [selected, setSelected] = useState(null)
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

  // Escape closes the detail view, body scroll locked while open
  useEffect(() => {
    if (selected === null) return
    const onKey = (e) => { if (e.key === 'Escape') setSelected(null) }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [selected])

  const handleMouseMove = (e) => {
    syncRect()
    if (containerRef.current) {
      const r = containerRef.current.getBoundingClientRect()
      setMousePos({ x: e.clientX - r.left, y: e.clientY - r.top })
    }
  }

  const openProject = (i) => {
    setSelected(i)
    setVisible(false)
    setHoveredIndex(null)
  }

  const project = selected !== null ? projects[selected] : null

  return (
    <section ref={containerRef} onMouseMove={handleMouseMove} className="ps">
      <p className="ps__label">Portfolio</p>
      <h2 className="ps__heading">Selected Work</h2>
      <p className="ps__hint">Click a project for details</p>

      {/* floating image preview */}
      <div
        className="ps__preview"
        style={{
          left:      rectLeft,
          top:       rectTop,
          transform: `translate3d(${smoothPos.x + 28}px, ${smoothPos.y - 160}px, 0)`,
          opacity:   visible && selected === null ? 1 : 0,
          scale:     visible && selected === null ? 1 : 0.85,
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
        {projects.map((p, i) => (
          <motion.div
            key={p.title}
            role="button"
            tabIndex={0}
            className="ps__item"
            initial={{ opacity: 0, y: 42 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -40px 0px' }}
            transition={{ duration: 0.55, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            whileTap={{ scale: 0.985 }}
            onMouseEnter={() => { setHoveredIndex(i); setVisible(true)  }}
            onMouseLeave={() => { setHoveredIndex(null); setVisible(false) }}
            onClick={() => openProject(i)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openProject(i) } }}
          >
            <div className={`ps__item-bg${hoveredIndex === i ? ' ps__item-bg--on' : ''}`} />

            <div className="ps__item-inner">
              <div className="ps__item-left">
                <div className="ps__title-row">
                  <h3 className="ps__title">
                    <span className="ps__title-text">
                      {p.title}
                      <span className={`ps__underline${hoveredIndex === i ? ' ps__underline--on' : ''}`} />
                    </span>
                  </h3>
                  <ArrowUpRight
                    size={22}
                    className={`ps__arrow${hoveredIndex === i ? ' ps__arrow--on' : ''}`}
                  />
                </div>
                <p className={`ps__desc${hoveredIndex === i ? ' ps__desc--on' : ''}`}>
                  {p.description}
                </p>
              </div>
              <span className={`ps__year${hoveredIndex === i ? ' ps__year--on' : ''}`}>
                {p.year}
              </span>
            </div>
          </motion.div>
        ))}
        <div className="ps__end-border" />
      </div>

      {/* detail overlay — image left, description right */}
      <AnimatePresence>
        {project && (
          <motion.div
            className="ps__detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="ps__detail-panel"
              initial={{ y: 64, scale: 0.95, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 40, scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="ps__detail-close"
                onClick={() => setSelected(null)}
                aria-label="Close"
              >
                <X size={20} />
              </button>

              <div className="ps__detail-media">
                <motion.img
                  src={project.image}
                  alt={project.title}
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                />
                <div className="ps__detail-media-overlay" />
              </div>

              <motion.div
                className="ps__detail-info"
                variants={infoStagger}
                initial="hidden"
                animate="show"
              >
                <motion.span className="ps__detail-year" variants={infoItem}>
                  {project.year}
                </motion.span>
                <motion.h3 className="ps__detail-title" variants={infoItem}>
                  {project.title}
                </motion.h3>
                <motion.ul className="ps__detail-tags" variants={infoItem}>
                  {project.tech.map(t => (
                    <li key={t} className="ps__detail-tag">{t}</li>
                  ))}
                </motion.ul>
                <motion.p className="ps__detail-text" variants={infoItem}>
                  {project.details}
                </motion.p>
                <motion.a
                  className="ps__detail-github"
                  variants={infoItem}
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  <GithubIcon size={18} />
                  <span>View on GitHub</span>
                  <ArrowUpRight size={16} className="ps__detail-github-arrow" />
                </motion.a>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
