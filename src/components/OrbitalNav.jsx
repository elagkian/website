import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FolderGit2, FileText, User } from 'lucide-react'
import Earth from './Earth'
import './OrbitalNav.css'

const NAV_ITEMS = [
  { id: 0, label: 'Projects', icon: FolderGit2, route: '/projects' },
  { id: 1, label: 'CV',       icon: FileText,   route: '/cv'       },
  { id: 2, label: 'About Me', icon: User,        route: '/about'    },
]

export default function OrbitalNav() {
  const [angle,    setAngle]   = useState(0)
  const [paused,   setPaused]  = useState(false)
  const [hoverId,  setHoverId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => setAngle(a => (a + 0.4) % 360), 50)
    return () => clearInterval(id)
  }, [paused])

  const pos = (index) => {
    const deg = ((index / NAV_ITEMS.length) * 360 + angle) % 360
    const rad = (deg * Math.PI) / 180
    const r   = 220
    return {
      x:       r * Math.cos(rad),
      y:       r * Math.sin(rad),
      zIndex:  Math.round(100 + 50 * Math.cos(rad)),
      opacity: Math.max(0.4, Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(rad)) / 2))),
    }
  }

  return (
    <div className="orb-nav">
      {/* center earth */}
      <div className="orb-nav__center">
        <div className="orb-nav__ping" />
        <div className="orb-nav__ping orb-nav__ping--2" />
        <Earth size={110} />
      </div>

      {/* orbit ring */}
      <div className="orb-nav__ring" />

      {NAV_ITEMS.map((item, i) => {
        const p      = pos(i)
        const Icon   = item.icon
        const active = hoverId === item.id

        return (
          <div
            key={item.id}
            className="orb-nav__node"
            style={{
              transform: `translate(${p.x}px, ${p.y}px)`,
              zIndex:    active ? 200 : p.zIndex,
              opacity:   active ? 1   : p.opacity,
              marginLeft: '-26px',
              marginTop:  '-26px',
            }}
            onMouseEnter={() => { setHoverId(item.id); setPaused(true)  }}
            onMouseLeave={() => { setHoverId(null);    setPaused(false) }}
            onClick={() => navigate(item.route)}
          >
            <div className={`orb-nav__btn${active ? ' orb-nav__btn--active' : ''}`}>
              <Icon size={16} />
            </div>
            <span className={`orb-nav__label${active ? ' orb-nav__label--active' : ''}`}>
              {item.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
