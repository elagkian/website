import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import './SubPage.css'

export default function About() {
  const navigate = useNavigate()

  return (
    <motion.div
      className="subpage"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.35 }}
    >
      <button className="subpage__back" onClick={() => navigate('/')}>← Back</button>
      <h1 className="subpage__title">About Me</h1>
      <p className="subpage__placeholder">About section coming soon.</p>
    </motion.div>
  )
}
