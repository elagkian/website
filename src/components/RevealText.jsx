import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import './RevealText.css'

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2070&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2070&q=80',
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=2070&q=80',
  'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=2070&q=80',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=2070&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2070&q=80',
  'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?auto=format&fit=crop&w=2070&q=80',
  'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?auto=format&fit=crop&w=2070&q=80',
]

export function RevealText({
  text = 'STUNNING',
  overlayColor = '#ef4444',
  fontSize = 'clamp(28px, 4vw, 56px)',
  letterDelay = 0.08,
  overlayDelay = 0.05,
  overlayDuration = 0.4,
  springDuration = 600,
  letterImages = DEFAULT_IMAGES,
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [showOverlay, setShowOverlay] = useState(false)

  useEffect(() => {
    const totalDelay = (text.length - 1) * letterDelay * 1000 + springDuration
    const timer = setTimeout(() => setShowOverlay(true), totalDelay)
    return () => clearTimeout(timer)
  }, [text.length, letterDelay, springDuration])

  return (
    <div className="reveal-text">
      {text.split('').map((letter, index) => {
        if (letter === ' ') {
          return <span key={index} className="reveal-text__space" style={{ fontSize }} />
        }
        return (
          <motion.span
            key={index}
            className="reveal-text__letter"
            style={{ fontSize }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: index * letterDelay,
              type: 'spring',
              damping: 8,
              stiffness: 200,
              mass: 0.8,
            }}
          >
            {/* White base layer */}
            <motion.span
              className="reveal-text__base"
              animate={{ opacity: hoveredIndex === index ? 0 : 1 }}
              transition={{ duration: 0.1 }}
            >
              {letter}
            </motion.span>

            {/* Image fill on hover */}
            <motion.span
              className="reveal-text__image"
              animate={{
                opacity: hoveredIndex === index ? 1 : 0,
                backgroundPosition: hoveredIndex === index ? '10% center' : '0% center',
              }}
              transition={{
                opacity: { duration: 0.1 },
                backgroundPosition: { duration: 3, ease: 'easeInOut' },
              }}
              style={{
                backgroundImage: `url('${letterImages[index % letterImages.length]}')`,
              }}
            >
              {letter}
            </motion.span>

            {/* Color sweep overlay */}
            {showOverlay && (
              <motion.span
                className="reveal-text__overlay"
                style={{ color: overlayColor }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{
                  delay: index * overlayDelay,
                  duration: overlayDuration,
                  times: [0, 0.1, 0.7, 1],
                  ease: 'easeInOut',
                }}
              >
                {letter}
              </motion.span>
            )}
          </motion.span>
        )
      })}
    </div>
  )
}
