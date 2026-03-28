import { useState } from 'react'

const LEVELS   = ['beginner', 'intermediate', 'advanced']
const STYLES   = ['visual', 'reading', 'practice-based', 'mixed']

const defaultState = {
  name: '',
  age: '',
  class_semester: '',
  subject: '',
  current_level: 'beginner',
  goal: '',
  weak_topics: '',
  study_style: 'mixed',
  time_per_day: '2',
  gamification: true,
  notes: '',
}

export default function StudentForm({ onSubmit, loading, compact = false }) {
  const [form, setForm] = useState(defaultState)

  const set = (key) => (e) =>
    setForm((p) => ({ ...p, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const handle = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handle} className="space-y-4">
      {/* Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Name *</label>
          <input className="input" placeholder="e.g. Rahul Sharma" value={form.name} onChange={set('name')} required />
        </div>
        <div>
          <label className="label">Subject / Domain *</label>
          <input className="input" placeholder="e.g. Python, ML, Maths" value={form.subject} onChange={set('subject')} required />
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="label">Age</label>
          <input className="input" placeholder="e.g. 20" value={form.age} onChange={set('age')} />
        </div>
        <div>
          <label className="label">Class / Semester</label>
          <input className="input" placeholder="e.g. 4th Sem, 12th" value={form.class_semester} onChange={set('class_semester')} />
        </div>
        <div>
          <label className="label">Daily Time (hrs)</label>
          <input className="input" type="number" min="0.5" max="16" step="0.5" value={form.time_per_day} onChange={set('time_per_day')} />
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Current Level</label>
          <select className="input" value={form.current_level} onChange={set('current_level')}>
            {LEVELS.map((l) => (
              <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Study Style</label>
          <select className="input" value={form.study_style} onChange={set('study_style')}>
            {STYLES.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Goal */}
      <div>
        <label className="label">Goal</label>
        <input className="input" placeholder="e.g. Get job-ready in ML in 6 months" value={form.goal} onChange={set('goal')} />
      </div>

      {/* Weak topics */}
      <div>
        <label className="label">Weak Topics</label>
        <input className="input" placeholder="e.g. Backpropagation, Calculus, CNN" value={form.weak_topics} onChange={set('weak_topics')} />
      </div>

      {!compact && (
        <div>
          <label className="label">Additional Notes</label>
          <textarea
            className="input resize-none"
            rows={2}
            placeholder="Any extra context..."
            value={form.notes}
            onChange={set('notes')}
          />
        </div>
      )}

      {/* Gamification toggle */}
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <div className="relative">
          <input
            type="checkbox"
            className="sr-only"
            checked={form.gamification}
            onChange={set('gamification')}
          />
          <div className={`w-10 h-5 rounded-full transition-colors ${form.gamification ? 'bg-teal-500' : 'bg-[#30363d]'}`} />
          <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${form.gamification ? 'translate-x-5' : ''}`} />
        </div>
        <span className="text-sm text-[#7d8590]">Enable gamification (XP, badges, challenges)</span>
      </label>

      <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2" disabled={loading}>
        {loading ? (
          <>
            <span className="spinner" />
            Generating…
          </>
        ) : (
          'Generate'
        )}
      </button>
    </form>
  )
}
