import { useState, useRef, useEffect } from 'react'
import { Send, MessageSquare, Settings, X, Bot, User } from 'lucide-react'
import MarkdownRenderer from '../components/MarkdownRenderer'

// const API = 'https://track-x-backend-8fgp2sf04-pranjalsaini369s-projects.vercel.app/api'
const API = 'http://127.0.0.1:8000/api'

const SUGGESTIONS = [
  'Create a 1-week revision plan for me',
  'How do I improve in my weak topics?',
  'Give me a daily study schedule',
  'Explain backpropagation simply',
  'What should I focus on this week?',
  'Give me a motivational challenge',
]

export default function AIChat() {
  const [messages, setMessages]   = useState([])
  const [input, setInput]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [showContext, setShowCtx] = useState(false)
  const [studentCtx, setStudCtx]  = useState({
    name: '', subject: '', current_level: 'beginner', goal: '', weak_topics: '',
  })
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return
    const userMsg = { role: 'user', content: text }
    setMessages((p) => [...p, userMsg])
    setInput('')
    setLoading(true)

    try {
      const body = {
        message: text,
        history: messages,
        student_data: studentCtx.name ? studentCtx : null,
      }
      const res = await fetch(`${API}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      setMessages((p) => [...p, { role: 'assistant', content: data.response }])
    } catch {
      setMessages((p) => [...p, {
        role: 'assistant',
        content: '⚠️ Could not connect to the Server. Please make sure the server is running.',
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <main className="page-container max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MessageSquare size={20} className="text-teal-400" />
          <h1 className="font-display text-2xl font-bold text-[#e6edf3]">AI Study Chat</h1>
        </div>
        <button
          onClick={() => setShowCtx(!showContext)}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors ${
            showContext
              ? 'border-teal-500/40 text-teal-400 bg-teal-500/5'
              : 'border-[#30363d] text-[#7d8590] hover:text-[#e6edf3]'
          }`}
        >
          <Settings size={13} />
          {studentCtx.name ? studentCtx.name : 'Set Context'}
        </button>
      </div>

      {/* Student context panel */}
      {showContext && (
        <div className="card p-4 mb-5 fade-in">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-[#e6edf3]">Student Context (optional)</span>
            <button onClick={() => setShowCtx(false)} className="text-[#7d8590] hover:text-[#e6edf3]">
              <X size={15} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              ['name',          'Name',          'text',   ''],
              ['subject',       'Subject',       'text',   ''],
              ['current_level', 'Level',         'select', ['beginner','intermediate','advanced']],
              ['goal',          'Goal',          'text',   ''],
              ['weak_topics',   'Weak Topics',   'text',   ''],
            ].map(([key, label, type, opts]) => (
              <div key={key}>
                <label className="label">{label}</label>
                {type === 'select' ? (
                  <select
                    className="input"
                    value={studentCtx[key]}
                    onChange={(e) => setStudCtx((p) => ({ ...p, [key]: e.target.value }))}
                  >
                    {opts.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input
                    className="input"
                    value={studentCtx[key]}
                    onChange={(e) => setStudCtx((p) => ({ ...p, [key]: e.target.value }))}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chat window */}
      <div className="card flex flex-col" style={{ height: '520px' }}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                <Bot size={24} />
              </div>
              <div>
                <div className="text-[#e6edf3] font-medium text-sm mb-1">TrackX AI is ready</div>
                <div className="text-[#7d8590] text-xs">Ask anything about your studies, or try a suggestion below.</div>
              </div>
              <div className="flex flex-wrap gap-2 justify-center max-w-sm">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="text-xs border border-[#30363d] hover:border-teal-500/40 text-[#7d8590] hover:text-teal-400 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${
                m.role === 'user'
                  ? 'bg-teal-500 text-white'
                  : 'bg-[#21262d] text-teal-400 border border-[#30363d]'
              }`}>
                {m.role === 'user' ? <User size={13} /> : <Bot size={13} />}
              </div>
              <div className={`max-w-[80%] px-4 py-3 rounded-xl text-sm ${
                m.role === 'user'
                  ? 'bg-teal-500/15 border border-teal-500/20 text-[#e6edf3]'
                  : 'bg-[#161b22] border border-[#30363d]'
              }`}>
                {m.role === 'assistant'
                  ? <MarkdownRenderer content={m.content} />
                  : <p>{m.content}</p>
                }
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-[#21262d] border border-[#30363d] flex items-center justify-center text-teal-400">
                <Bot size={13} />
              </div>
              <div className="bg-[#161b22] border border-[#30363d] px-4 py-3 rounded-xl">
                <div className="flex gap-1 items-center">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-[#30363d] p-3 flex gap-2">
          <textarea
            rows={1}
            className="input flex-1 resize-none py-2.5"
            placeholder="Ask anything…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="w-10 h-10 bg-teal-500 hover:bg-teal-600 disabled:opacity-40 text-white rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
          >
            <Send size={15} />
          </button>
        </div>
      </div>

      {messages.length > 0 && (
        <button
          onClick={() => setMessages([])}
          className="mt-3 text-xs text-[#7d8590] hover:text-[#e6edf3] transition-colors"
        >
          Clear chat
        </button>
      )}
    </main>
  )
}
