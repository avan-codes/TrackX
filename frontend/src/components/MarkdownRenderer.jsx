import ReactMarkdown from 'react-markdown'

export default function MarkdownRenderer({ content }) {
  if (!content) return null
  return (
    <div className="md-content fade-in">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  )
}
