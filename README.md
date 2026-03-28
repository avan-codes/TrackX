# TrackX — Smart Student Planner

AI-powered study planner for students. Generates personalized plans, practice questions, and fun engagement content using the Claude API.

---

## Project Structure

```
trackx/
├── backend/
│   ├── main.py              # FastAPI app — all endpoints
│   ├── requirements.txt
│   └── data/
│       └── students.json    # JSON storage (auto-created)
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx         # "/" — Hero + plan modal
│   │   │   ├── Dashboard.jsx    # "/dashboard"
│   │   │   ├── Tools.jsx        # "/tools" — Question generator
│   │   │   ├── AIChat.jsx       # "/ai" — Chatbot
│   │   │   ├── ExtraFun.jsx     # "/extrafun" — Power report
│   │   │   ├── About.jsx        # "/about"
│   │   │   └── AboutUs.jsx      # "/aboutus"
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── StudentForm.jsx  # Shared form
│   │   │   └── MarkdownRenderer.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── run_backend.sh
├── run_frontend.sh
└── README.md
```

---

## Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- Anthropic API key

### 1. Set your API key

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
```

Add this to `~/.bashrc` or `~/.zshrc` for persistence.

### 2. Start the backend

```bash
chmod +x run_backend.sh
./run_backend.sh
```

This creates a virtual environment, installs dependencies, and starts FastAPI on **port 8000**.

### 3. Start the frontend

```bash
chmod +x run_frontend.sh
./run_frontend.sh
```

Opens on **http://localhost:5173**. The Vite dev server proxies `/api/*` to `localhost:8000`.

---

## API Endpoints

| Method | Endpoint                   | Description                             |
|--------|----------------------------|-----------------------------------------|
| GET    | `/`                        | Health check                            |
| GET    | `/api/stats`               | App usage stats (for dashboard)         |
| POST   | `/api/generate-plan`       | Generate 4-week study plan (Markdown)   |
| POST   | `/api/generate-questions`  | Generate 15 questions (JSON + PDF)      |
| POST   | `/api/chat`                | AI chatbot with student context         |
| POST   | `/api/extra-fun`           | Generate gamified power report + PDF    |

### POST Body (all endpoints except `/api/chat`)

```json
{
  "name": "Pranjal",
  "age": "20",
  "class_semester": "4th Sem",
  "subject": "Machine Learning",
  "current_level": "intermediate",
  "goal": "Get ML job-ready in 6 months",
  "weak_topics": "Backpropagation, PCA",
  "study_style": "mixed",
  "time_per_day": "4",
  "gamification": true,
  "notes": ""
}
```

### POST Body for `/api/chat`

```json
{
  "message": "Create a 1-week revision plan for me",
  "student_data": { ... },
  "history": [
    {"role": "user", "content": "..."},
    {"role": "assistant", "content": "..."}
  ]
}
```

---

## Features

- **Personalized Study Plans** — 4-week structured plans with daily schedules, resources, and milestones
- **Question Generator** — 15 questions (conceptual / application / challenge) with hints and PDF export
- **AI Chatbot** — Context-aware, multi-turn chat with student profile memory per session
- **Power Report** — Gamified PDF with learner archetype, XP, quests, badges, and battle cry
- **Dashboard** — Usage stats and recent activity
- **Responsive** — Works on mobile and desktop

---

## Notes

- All form submissions call the backend. The frontend never calls the AI directly.
- PDFs are generated server-side with ReportLab and returned as base64 strings.
- Student data is stored in `backend/data/students.json`. No database needed.
- The Vite proxy (`/api → :8000`) means you don't need to handle CORS manually in dev.
- For production, serve the built frontend via a static host and point the API calls to your deployed backend URL.

---

## Tech Stack

| Layer     | Tech                     |
|-----------|--------------------------|
| Frontend  | React 18, React Router 6, Tailwind CSS 3 |
| Backend   | FastAPI, Pydantic v2     |
| AI        | Claude API (Anthropic)   |
| PDF       | ReportLab                |
| Storage   | JSON file                |
| Dev server| Vite 5                   |
