import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ProjectShowcase } from '../components/ProjectShowcase'
import './SubPage.css'
import './Projects.css'

export default function Projects() {
  const navigate = useNavigate()

  return (
    <motion.div
      className="subpage projects"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.35 }}
    >
      <button className="subpage__back projects__back" onClick={() => navigate('/')}>
        ← Back
      </button>
      <ProjectShowcase />
    </motion.div>
  )
}
