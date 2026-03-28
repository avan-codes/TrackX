import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Zap } from 'lucide-react'

const links = [
  { to: '/',          label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/tools',     label: 'Tools' },
  { to: '/ai',        label: 'AI Chat' },
  { to: '/extrafun',  label: 'Extra Fun' },
  { to: '/about',     label: 'About' },
  { to: '/aboutus',   label: 'About Us' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  return (
    <nav className="sticky top-0 z-50 bg-[#0d1117] border-b border-[#30363d]">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg text-[#e6edf3]">
          <div className="w-7 h-7 bg-teal-500 rounded-md flex items-center justify-center">
            <Zap size={14} className="text-white" strokeWidth={2.5} />
          </div>
          TrackX
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                pathname === l.to
                  ? 'text-teal-400 bg-teal-500/10'
                  : 'text-[#7d8590] hover:text-[#e6edf3] hover:bg-[#21262d]'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-[#7d8590] hover:text-[#e6edf3] transition-colors p-1"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-[#30363d] bg-[#161b22] px-4 py-3 flex flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === l.to
                  ? 'text-teal-400 bg-teal-500/10'
                  : 'text-[#7d8590] hover:text-[#e6edf3] hover:bg-[#21262d]'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
