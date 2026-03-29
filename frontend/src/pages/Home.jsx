import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, MessageSquare, Sparkles, X, BarChart2 } from 'lucide-react'
import StudentForm from '../components/StudentForm'
import MarkdownRenderer from '../components/MarkdownRenderer'

// const API = 'https://track-x-backend-8fgp2sf04-pranjalsaini369s-projects.vercel.app/api'

const API = 'http://127.0.0.1:8000/api'


const features = [
  {
    icon: <BookOpen size={18} />,
    title: 'Personalized Study Plans',
    desc: 'AI-generated 4-week plans tailored to your subject, level, and schedule.',
  },
  {
    icon: <BarChart2 size={18} />,
    title: 'Question Generator',
    desc: 'Get practice questions at your exact difficulty level with PDF export.',
  },
  {
    icon: <MessageSquare size={18} />,
    title: 'AI Study Assistant',
    desc: 'Ask anything. Get focused, practical answers — not generic advice.',
  },
  {
    icon: <Sparkles size={18} />,
    title: 'Gamified Learning',
    desc: 'XP systems, badges, challenges, and weekly quests to keep you going.',
  },
]

export default function Home() {
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [result, setResult]       = useState(null)
  const [error, setError]         = useState(null)

  const handleSubmit = async (formData) => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch(`${API}/generate-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data = await res.json()
      setResult(data.plan)
    } catch (err) {
      setError(err.message || 'Something went wrong. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page-container">
      {/* Hero */}
      <section className="text-center py-16 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-medium px-3 py-1 rounded-full mb-6">
          <Sparkles size={12} />
          Made with 💓 for students
        </div>

        <h1 className="font-display text-5xl font-bold text-[#e6edf3] leading-tight mb-4">
          Study smarter with{' '}
          <span className="text-teal-400">TrackX</span>
        </h1>

        <p className="text-[#7d8590] text-lg mb-8 leading-relaxed">
          Tell us about your goals, subject, and schedule — TrackX builds a
          personalized plan, generates questions, and keeps you motivated.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            Get Personalized Plan
            <ArrowRight size={15} />
          </button>
          <Link to="/ai" className="btn-ghost">
            Chat with AI
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
        {features.map((f) => (
          <div key={f.title} className="card p-5 flex gap-4">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center flex-shrink-0">
              {f.icon}
            </div>
            <div>
              <div className="font-semibold text-[#e6edf3] text-sm mb-1">{f.title}</div>
              <div className="text-[#7d8590] text-sm leading-relaxed">{f.desc}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Quick nav cards */}
      <section>
        <h2 className="section-title mb-5">Quick Start</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link to="/tools" className="card p-5 hover:border-teal-500/40 transition-colors group">
            <div className="text-teal-400 mb-2 group-hover:scale-110 transition-transform inline-block">
              <BookOpen size={20} />
            </div>
            <div className="font-semibold text-sm text-[#e6edf3] mb-1">Question Generator</div>
            <div className="text-xs text-[#7d8590]">Generate practice questions with PDF export</div>
          </Link>
          <Link to="/ai" className="card p-5 hover:border-teal-500/40 transition-colors group">
            <div className="text-teal-400 mb-2 group-hover:scale-110 transition-transform inline-block">
              <MessageSquare size={20} />
            </div>
            <div className="font-semibold text-sm text-[#e6edf3] mb-1">AI Chatbot</div>
            <div className="text-xs text-[#7d8590]">Personalized guidance, tips, and plans</div>
          </Link>
          <Link to="/extrafun" className="card p-5 hover:border-teal-500/40 transition-colors group">
            <div className="text-teal-400 mb-2 group-hover:scale-110 transition-transform inline-block">
              <Sparkles size={20} />
            </div>
            <div className="font-semibold text-sm text-[#e6edf3] mb-1">Extra Fun</div>
            <div className="text-xs text-[#7d8590]">Get your gamified power report</div>
          </Link>
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm pt-10 px-4 overflow-y-auto pb-10">
          <div className="card w-full max-w-2xl p-6 relative fade-in">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg font-semibold text-[#e6edf3]">
                Build Your Study Plan
              </h2>
              <button
                onClick={() => { setShowModal(false); setResult(null); setError(null) }}
                className="text-[#7d8590] hover:text-[#e6edf3] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {!result ? (
              <StudentForm onSubmit={handleSubmit} loading={loading} />
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-teal-400">Your Study Plan</span>
                  <button
                    onClick={() => setResult(null)}
                    className="text-xs text-[#7d8590] hover:text-[#e6edf3] underline"
                  >
                    Regenerate
                  </button>
                </div>
                <div className="card p-4 max-h-96 overflow-y-auto">
                  <MarkdownRenderer content={result} />
                </div>
                <div className="mt-4 flex gap-3">
                  <Link to="/dashboard" className="btn-primary text-sm">
                    Go to Dashboard
                  </Link>
                  <button onClick={() => setResult(null)} className="btn-ghost text-sm">
                    New Plan
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-lg">
                {error}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
