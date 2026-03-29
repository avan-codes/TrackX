import { useState } from 'react'
import { Download, Eye, BookOpen, ChevronDown, ChevronUp } from 'lucide-react'
import StudentForm from '../components/StudentForm'

const API = 'https://track-x-backend-8fgp2sf04-pranjalsaini369s-projects.vercel.app/api'

const DIFF_COLORS = {
  easy:   'text-emerald-400 bg-emerald-400/10',
  medium: 'text-amber-400  bg-amber-400/10',
  hard:   'text-rose-400   bg-rose-400/10',
}
const CAT_COLORS = {
  conceptual: 'text-blue-400   bg-blue-400/10',
  practical:  'text-purple-400 bg-purple-400/10',
  challenge:  'text-orange-400 bg-orange-400/10',
}

function QuestionCard({ q }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="card p-4">
      <div className="flex items-start gap-3">
        <span className="font-mono text-xs text-[#7d8590] mt-0.5 flex-shrink-0">Q{q.id}</span>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`text-xs px-2 py-0.5 rounded font-medium ${CAT_COLORS[q.category] || 'text-teal-400 bg-teal-400/10'}`}>
              {q.category}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded font-medium ${DIFF_COLORS[q.difficulty] || 'text-[#7d8590] bg-[#21262d]'}`}>
              {q.difficulty}
            </span>
            <span className="text-xs text-[#7d8590]">{q.marks} marks</span>
          </div>
          <p className="text-sm text-[#e6edf3] leading-relaxed">{q.question}</p>
          {q.hint && (
            <button
              onClick={() => setOpen(!open)}
              className="mt-2 flex items-center gap-1 text-xs text-[#7d8590] hover:text-teal-400 transition-colors"
            >
              {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              Hint
            </button>
          )}
          {open && q.hint && (
            <div className="mt-2 p-2.5 bg-[#0d1117] rounded-lg text-xs text-[#7d8590] border border-[#30363d]">
              {q.hint}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Tools() {
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState(null)
  const [error, setError]     = useState(null)
  const [pdfUrl, setPdfUrl]   = useState(null)

  const handleSubmit = async (formData) => {
    setLoading(true)
    setError(null)
    setResult(null)
    setPdfUrl(null)
    try {
      const res = await fetch(`${API}/generate-questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data = await res.json()
      setResult(data)

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

  const questions =
    result?.questions?.questions ||
    (Array.isArray(result?.questions) ? result.questions : null)

  return (
    <main className="page-container">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen size={20} className="text-teal-400" />
          <h1 className="font-display text-3xl font-bold text-[#e6edf3]">Question Generator</h1>
        </div>
        <p className="text-[#7d8590] text-sm">
          Fill in your details — get 15 practice questions tailored to your level + a downloadable PDF.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div>
          <div className="card p-6">
            <h2 className="text-sm font-semibold text-[#e6edf3] mb-4">Student Details</h2>
            <StudentForm onSubmit={handleSubmit} loading={loading} compact />
          </div>
        </div>

        {/* Results */}
        <div>
          {error && (
            <div className="card p-4 border-rose-500/20 bg-rose-500/5 text-rose-400 text-sm mb-4">
              {error}
            </div>
          )}

          {loading && (
            <div className="card p-8 text-center">
              <div className="spinner mx-auto mb-3" />
              <div className="text-sm text-[#7d8590]">Generating questions…</div>
            </div>
          )}

          {result && !loading && (
            <div className="fade-in space-y-4">
              {/* Actions bar */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#e6edf3]">
                  {questions?.length || 0} Questions
                  {result.questions?.subject && <span className="text-[#7d8590]"> — {result.questions.subject}</span>}
                </span>
                <div className="flex gap-2">
                  {pdfUrl && (
                    <>
                      <a href={pdfUrl} target="_blank" rel="noreferrer" className="btn-ghost text-xs flex items-center gap-1.5">
                        <Eye size={13} />
                        Preview
                      </a>
                      <a
                        href={pdfUrl}
                        download={`questions-${result.questions?.subject || 'trackx'}.pdf`}
                        className="btn-primary text-xs flex items-center gap-1.5"
                      >
                        <Download size={13} />
                        Download PDF
                      </a>
                    </>
                  )}
                </div>
              </div>

              {/* Question list */}
              {questions ? (
                <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                  {questions.map((q) => (
                    <QuestionCard key={q.id} q={q} />
                  ))}
                </div>
              ) : (
                <div className="card p-4">
                  <pre className="text-xs text-[#7d8590] whitespace-pre-wrap">
                    {typeof result.questions === 'string' ? result.questions : JSON.stringify(result.questions, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {!result && !loading && !error && (
            <div className="card p-8 text-center text-[#7d8590]">
              <BookOpen size={28} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Fill in the form and click Generate.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
