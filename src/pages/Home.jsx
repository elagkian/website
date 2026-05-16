import { motion } from 'framer-motion'
import ASMRBackground from '../components/ASMRBackground'
import FallingStars from '../components/FallingStars'
import { RevealText } from '../components/RevealText'
import OrbitalNav from '../components/OrbitalNav'
import './Home.css'

export default function Home() {
  return (
    <motion.div
      className="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="home__bg">
        <ASMRBackground />
        <FallingStars />
      </div>

      <div className="home__content">
        <motion.div
          className="home__name"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <RevealText
            text="Elagkian Rajendram"
            overlayColor="#ef4444"
            fontSize="clamp(28px, 4vw, 56px)"
            letterDelay={0.06}
            overlayDelay={0.04}
            overlayDuration={0.4}
            springDuration={500}
          />
        </motion.div>

        <motion.div
          className="home__orbital"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <OrbitalNav />
        </motion.div>
      </div>
    </motion.div>
  )
}
