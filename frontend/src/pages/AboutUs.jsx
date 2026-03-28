import { Github, Zap } from 'lucide-react'

const team = [
  {
    name: 'Pranjal',
    role: 'Backend Developer',
    bio: 'CSE student, ML enthusiast, learner. Building TrackX to solve  problems students face with unstructured studying.',
    initials: 'P',
  },
  {
    name: 'Gyanendra Pandey',
    role: 'Frontend Developer',
    bio: 'CSE student, UI/UX and React.js Developer. Building TrackX to solve real problems students face with unstructured studying.',
    initials: 'P',
  },
]

const highlights = [
  { label: 'Built with',   value: 'React + FastAPI' },
  { label: 'AI backend',   value: 'Claude (Anthropic)' },
  { label: 'Purpose',      value: 'Student productivity' },
  { label: 'Status',       value: 'Active development' },
]

export default function AboutUs() {
  return (
    <main className="page-container max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-[#e6edf3] mb-2">About Us</h1>
        <p className="text-[#7d8590] text-sm leading-relaxed">
          TrackX is a student-built project — made by someone who actually went through the pain of unstructured studying
          and wanted a smarter way to plan, track, and stay motivated.
        </p>
      </div>

      {/* Mission */}
      <div className="card p-5 mb-8 border-l-2 border-l-teal-500">
        <div className="text-sm font-semibold text-[#e6edf3] mb-2">Mission</div>
        <p className="text-sm text-[#7d8590] leading-relaxed">
          To give every student access to a personalized, AI-powered study system — without paying for an expensive tutor
          or drowning in generic YouTube advice.
        </p>
      </div>

      {/* Team */}
      <div className="mb-8 ">
        <h2 className="text-base font-semibold text-[#e6edf3] mb-4">Team</h2>
        {team.map((member) => (
          <div key={member.name} className="card p-5 flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-500/20 text-teal-400 font-display font-bold text-lg flex items-center justify-center flex-shrink-0">
              {member.initials}
            </div>
            <div>
              <div className="font-semibold text-[#e6edf3] text-sm">{member.name}</div>
              <div className="text-xs text-teal-400 mb-2">{member.role}</div>
              <p className="text-xs text-[#7d8590] leading-relaxed">{member.bio}</p>
            </div>
          </div>
        ))}
      </div>


      {/* Open source note */}
      <div className="card p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#21262d] text-[#e6edf3] flex items-center justify-center flex-shrink-0">
          <Zap size={18} className="text-teal-400" />
        </div>
        <div>
          <div className="text-sm font-medium text-[#e6edf3] mb-1">Open Source & Extensible</div>
          <p className="text-xs text-[#7d8590] leading-relaxed">
            TrackX is built to be forked, extended, and improved. The backend is modular — new endpoints
            can be added cleanly. Frontend routes are straightforward to extend.
          </p>
        </div>
      </div>
    </main>
  )
}
