import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import './NavCard.css'

export default function NavCard({ label, to }) {
  const navigate = useNavigate()

  return (
    <motion.button
      className="nav-card"
      onClick={() => navigate(to)}
      whileHover={{ scale: 1.06, backgroundColor: 'rgba(255,255,255,0.15)' }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {label}
    </motion.button>
  )
}
