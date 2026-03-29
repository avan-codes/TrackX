import { useState } from 'react'
import { Sparkles, Download, Eye, Zap } from 'lucide-react'
import StudentForm from '../components/StudentForm'
import MarkdownRenderer from '../components/MarkdownRenderer'

// const API = 'https://track-x-backend-8fgp2sf04-pranjalsaini369s-projects.vercel.app/api'
const API = 'http://127.0.0.1:8000/api'


export default function ExtraFun() {
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState(null)
  const [pdfUrl, setPdfUrl]   = useState(null)
  const [error, setError]     = useState(null)

  const handleSubmit = async (formData) => {
    setLoading(true)
    setError(null)
    setResult(null)
    setPdfUrl(null)

    try {
      const res = await fetch(`${API}/extra-fun`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data = await res.json()
      setResult(data.content)

      if (data.pdf) {
        const bytes = Uint8Array.from(atob(data.pdf), (c) => c.charCodeAt(0))
        const blob  = new Blob([bytes], { type: 'application/pdf' })
        setPdfUrl(URL.createObjectURL(blob))
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page-container">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={20} className="text-teal-400" />
          <h1 className="font-display text-3xl font-bold text-[#e6edf3]">ExFun</h1>
        </div>
        <p className="text-[#7d8590] text-sm">
          Get your personalized Power Report — XP level, archetype, badges, quests, and a battle cry. Fun but useful.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-[#e6edf3] mb-1">Your Details</h2>
          <p className="text-xs text-[#7d8590] mb-4">The more you fill, the better your Power Report.</p>
          <StudentForm onSubmit={handleSubmit} loading={loading} compact />
        </div>

        {/* Result */}
        <div>
          {error && (
            <div className="card p-4 border-rose-500/20 bg-rose-500/5 text-rose-400 text-sm mb-4">
              {error}
            </div>
          )}

          {loading && (
            <div className="card p-10 text-center">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mx-auto mb-4">
                <Zap size={22} />
              </div>
              <div className="spinner mx-auto mb-3" />
              <div className="text-sm text-[#7d8590]">Crafting your power report…</div>
            </div>
          )}

          {result && !loading && (
            <div className="fade-in space-y-4">
              {/* PDF actions */}
              {pdfUrl && (
                <div className="flex gap-2">
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-ghost text-xs flex items-center gap-1.5"
                  >
                    <Eye size={13} /> Preview PDF
                  </a>
                  <a
                    href={pdfUrl}
                    download="trackx-power-report.pdf"
                    className="btn-primary text-xs flex items-center gap-1.5"
                  >
                    <Download size={13} /> Download PDF
                  </a>
                </div>
              )}

              {/* Report content */}
              <div className="card p-5 max-h-[600px] overflow-y-auto">
                <MarkdownRenderer content={result} />
              </div>

              <button
                onClick={() => { setResult(null); setPdfUrl(null) }}
                className="text-xs text-[#7d8590] hover:text-[#e6edf3] transition-colors"
              >
                Generate new report
              </button>
            </div>
          )}

          {!result && !loading && !error && (
            <div className="card p-10 text-center">
              <div className="w-14 h-14 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mx-auto mb-4">
                <Sparkles size={26} />
              </div>
              <div className="text-sm text-[#e6edf3] font-medium mb-1">Your Power Report awaits</div>
              <div className="text-xs text-[#7d8590]">
                Fill in the form → get your learner archetype, XP status, weekly quests, and more.
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
