import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, MessageSquare, Sparkles, BarChart2, Users, FileText, Clock } from 'lucide-react'

const API = 'https://track-x-backend-8fgp2sf04-pranjalsaini369s-projects.vercel.app/api'

const quickActions = [
  { to: '/',          icon: <BarChart2 size={16} />,    label: 'New Plan',          desc: 'Generate a study plan' },
  { to: '/tools',     icon: <BookOpen size={16} />,     label: 'Question Generator', desc: 'Practice questions + PDF' },
  { to: '/ai',        icon: <MessageSquare size={16} />, label: 'AI Chat',           desc: 'Ask your study assistant' },
  { to: '/extrafun',  icon: <Sparkles size={16} />,     label: 'Power Report',       desc: 'Get your fun report' },
]

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/stats`)
      .then((r) => r.json())
      .then((d) => setStats(d))
      .catch(() => setStats({ total_plans: 0, total_students: 0, total_sessions: 0, recent: [] }))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="page-container">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-[#e6edf3] mb-1">Dashboard</h1>
        <p className="text-[#7d8590] text-sm">Your study activity overview</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Plans Generated',  value: stats?.total_plans     ?? '—', icon: <FileText size={16} /> },
          { label: 'Unique Students',  value: stats?.total_students  ?? '—', icon: <Users size={16} /> },
          { label: 'Chat Sessions',    value: stats?.total_sessions  ?? '—', icon: <MessageSquare size={16} /> },
        ].map((s) => (
          <div key={s.label} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#7d8590] text-xs font-medium uppercase tracking-wide">{s.label}</span>
              <span className="text-teal-400">{s.icon}</span>
            </div>
            {loading ? (
              <div className="h-7 w-12 bg-[#21262d] rounded animate-pulse" />
            ) : (
              <div className="font-display text-3xl font-bold text-[#e6edf3]">{s.value}</div>
            )}
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <h2 className="text-base font-semibold text-[#e6edf3] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickActions.map((a) => (
            <Link
              key={a.to}
              to={a.to}
              className="card p-4 flex items-center gap-4 hover:border-teal-500/40 transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center flex-shrink-0 group-hover:bg-teal-500/20 transition-colors">
                {a.icon}
              </div>
              <div>
                <div className="font-medium text-sm text-[#e6edf3]">{a.label}</div>
                <div className="text-xs text-[#7d8590]">{a.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div>
        <h2 className="text-base font-semibold text-[#e6edf3] mb-4">Recent Plans</h2>
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-4 h-14 animate-pulse bg-[#21262d]" />
            ))}
          </div>
        ) : stats?.recent?.length ? (
          <div className="space-y-2">
            {stats.recent.map((p, i) => (
              <div key={i} className="card p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-teal-500/10 text-teal-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {p.student_name?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-[#e6edf3]">{p.student_name}</div>
                  <div className="text-xs text-[#7d8590] truncate">{p.subject} · {new Date(p.timestamp).toLocaleDateString()}</div>
                  {p.preview && (
                    <div className="text-xs text-[#7d8590] mt-1 truncate">{p.preview}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center">
            <Clock size={24} className="text-[#30363d] mx-auto mb-2" />
            <div className="text-[#7d8590] text-sm">No plans yet.</div>
            <Link to="/" className="text-teal-400 text-sm underline mt-1 inline-block">Generate your first plan →</Link>
          </div>
        )}
      </div>
    </main>
  )
}
