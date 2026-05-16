import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { FolderGit2, FileText, User } from 'lucide-react'
import { LimelightNav } from './components/LimelightNav'
import Home from './pages/Home'
import Projects from './pages/Projects'
import CV from './pages/CV'
import About from './pages/About'

const NAV_ROUTES = ['/projects', '/cv', '/about']

function AppShell() {
  const location = useLocation()
  const navigate  = useNavigate()

  const activeIndex = NAV_ROUTES.indexOf(location.pathname)

  const navItems = [
    { id: 'projects', icon: <FolderGit2 />, label: 'Projects', onClick: () => navigate('/projects') },
    { id: 'cv',       icon: <FileText />,   label: 'CV',        onClick: () => navigate('/cv')       },
    { id: 'about',    icon: <User />,        label: 'About Me',  onClick: () => navigate('/about')    },
  ]

  return (
    <>
      {/* Global centered dock */}
      <div style={{
        position: 'fixed',
        top: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
      }}>
        <LimelightNav items={navItems} activeIndex={activeIndex} />
      </div>

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/"         element={<Home />}     />
          <Route path="/projects" element={<Projects />} />
          <Route path="/cv"       element={<CV />}       />
          <Route path="/about"    element={<About />}    />
        </Routes>
      </AnimatePresence>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}
