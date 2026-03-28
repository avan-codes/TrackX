import { Link } from 'react-router-dom'
import { Zap, BookOpen, MessageSquare, Sparkles, BarChart2, ArrowRight } from 'lucide-react'

const features = [
  {
    icon: <BarChart2 size={16} />,
    title: 'Personalized Study Plans',
    desc: 'Enter your subject, level, goals, and schedule. TrackX generates a structured 4-week plan with resources, milestones, and daily breakdowns.',
  },
  {
    icon: <BookOpen size={16} />,
    title: 'Question Generator',
    desc: 'Get 15 practice questions tailored to your current level — easy to hard — organized by category. Export as a clean PDF in one click.',
  },
  {
    icon: <MessageSquare size={16} />,
    title: 'AI Study Assistant',
    desc: 'A chatbot that knows your subject, level, and weak areas. Ask anything — it gives you focused, practical answers, not generic fluff.',
  },
  {
    icon: <Sparkles size={16} />,
    title: 'Power Report',
    desc: 'A fun, gamified report with your learner archetype, XP level, weekly quests, and badges. Motivating without being childish.',
  },
]

export default function About() {
  return (
    <main className="page-container max-w-2xl">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center">
          <Zap size={18} className="text-white" strokeWidth={2.5} />
        </div>
        <div>
          <div className="font-display text-2xl font-bold text-[#e6edf3]">TrackX</div>
          <div className="text-xs text-[#7d8590]">Smart Student Planner</div>
        </div>
      </div>

      {/* What it is */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-[#e6edf3] mb-3">What is TrackX?</h1>
        <p className="text-[#7d8590] leading-relaxed text-sm">
          TrackX is an AI-powered study planner built for students who want structured, personalized guidance
          without the noise. You tell it your subject, goal, weak areas, and available time — it does the rest.
        </p>
        <p className="text-[#7d8590] leading-relaxed text-sm mt-3">
          It's not another generic study app. Every output is generated fresh based on your exact inputs,
          using a capable AI backend (Claude API) that understands context and gives real, useful advice.
        </p>
      </div>

      {/* Features */}
      <div className="mb-8">
        <h2 className="text-base font-semibold text-[#e6edf3] mb-4">What TrackX Can Do</h2>
        <div className="space-y-3">
          {features.map((f) => (
            <div key={f.title} className="card p-4 flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center flex-shrink-0">
                {f.icon}
              </div>
              <div>
                <div className="text-sm font-medium text-[#e6edf3] mb-1">{f.title}</div>
                <div className="text-xs text-[#7d8590] leading-relaxed">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Link to="/" className="btn-primary inline-flex items-center gap-2">
        Get Started
        <ArrowRight size={14} />
      </Link>
    </main>
  )
}
