from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import json
import os
from datetime import datetime
import base64
from io import BytesIO

from google import genai
from google.genai import types

# PDF generation
try:
    from reportlab.pdfgen import canvas
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
    from reportlab.lib.units import cm
    from reportlab.lib import colors
    PDF_AVAILABLE = True
except ImportError:
    PDF_AVAILABLE = False

app = FastAPI(title="TrackX API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Storage ──────────────────────────────────────────────────────────────────

DATA_FILE = "data/students.json"
os.makedirs("data", exist_ok=True)


def load_data() -> dict:
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"students": [], "plans": [], "sessions": []}


def save_data(data: dict):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, default=str, ensure_ascii=False)


# ── AI client (Gemini) ──────────────────────────────────────────────────────

GEMINI_API_KEY="AIzaSyAWlTpINRAyzzt_UWy-mNSgyhVz85ttOPY"
if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY is not set in environment variables.")

client = genai.Client(api_key=GEMINI_API_KEY)

# Stable current model choice
GEMINI_MODEL = "gemini-2.5-flash"


def call_gemini(prompt: str, system: str = "", max_tokens: int = 2500) -> str:
    """
    Helper to call Gemini with system instruction and prompt.
    Returns the generated text.
    """
    config_kwargs = {
        "max_output_tokens": max_tokens,
        "temperature": 0.7,
    }
    if system:
        config_kwargs["system_instruction"] = system

    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(**config_kwargs),
    )
    return (response.text or "").strip()


# ── Models ───────────────────────────────────────────────────────────────────

class StudentData(BaseModel):
    name: str
    age: Optional[str] = ""
    class_semester: Optional[str] = ""
    subject: Optional[str] = ""
    current_level: Optional[str] = "beginner"
    goal: Optional[str] = ""
    weak_topics: Optional[str] = ""
    study_style: Optional[str] = "mixed"
    time_per_day: Optional[str] = "2"
    gamification: Optional[bool] = True
    notes: Optional[str] = ""


class ChatMessage(BaseModel):
    message: str
    student_data: Optional[StudentData] = None
    history: Optional[List[dict]] = None


# ── PDF helper ───────────────────────────────────────────────────────────────

def make_pdf(title: str, content: str, subtitle: str = "") -> str:
    """Generate a PDF and return base64 encoded string."""
    if not PDF_AVAILABLE:
        return ""

    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=2 * cm,
        leftMargin=2 * cm,
        topMargin=2 * cm,
        bottomMargin=2 * cm,
    )
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "CustomTitle",
        parent=styles["Title"],
        fontSize=22,
        textColor=colors.HexColor("#0f172a"),
        spaceAfter=6,
    )
    subtitle_style = ParagraphStyle(
        "Subtitle",
        parent=styles["Normal"],
        fontSize=12,
        textColor=colors.HexColor("#64748b"),
        spaceAfter=20,
    )
    heading_style = ParagraphStyle(
        "Heading",
        parent=styles["Heading2"],
        fontSize=14,
        textColor=colors.HexColor("#0f172a"),
        spaceBefore=14,
        spaceAfter=6,
    )
    body_style = ParagraphStyle(
        "Body",
        parent=styles["Normal"],
        fontSize=11,
        leading=18,
        textColor=colors.HexColor("#334155"),
        spaceAfter=6,
    )

    story = [Paragraph(title, title_style)]
    if subtitle:
        story.append(Paragraph(subtitle, subtitle_style))
    story.append(Spacer(1, 0.3 * cm))

    for line in content.split("\n"):
        stripped = line.strip()
        if not stripped:
            story.append(Spacer(1, 0.2 * cm))
            continue

        if stripped.startswith("### "):
            story.append(Paragraph(stripped[4:], heading_style))
        elif stripped.startswith("## "):
            story.append(Paragraph(stripped[3:], heading_style))
        elif stripped.startswith("# "):
            story.append(Paragraph(stripped[2:], heading_style))
        else:
            clean = (
                stripped.replace("**", "")
                .replace("__", "")
                .replace("`", "")
                .replace("*", "•")
            )
            story.append(Paragraph(clean, body_style))

    doc.build(story)
    return base64.b64encode(buffer.getvalue()).decode("utf-8")


# ── Routes ───────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"status": "ok", "app": "TrackX API", "version": "1.0.0"}


@app.get("/api/stats")
def get_stats():
    data = load_data()
    plans = data.get("plans", [])
    unique_students = len(set(p.get("student_name", "") for p in plans))
    return {
        "total_plans": len(plans),
        "total_students": unique_students,
        "total_sessions": len(data.get("sessions", [])),
        "recent": plans[-3:][::-1] if plans else [],
    }


@app.post("/api/generate-plan")
async def generate_plan(student: StudentData):
    prompt = f"""You are TrackX, a smart student study planner. Create a **detailed, personalized 4-week study plan** for this student.

## Student Profile
- **Name:** {student.name}
- **Age / Class:** {student.age} / {student.class_semester}
- **Subject / Domain:** {student.subject}
- **Current Level:** {student.current_level}
- **Goal:** {student.goal}
- **Weak Topics:** {student.weak_topics}
- **Study Style:** {student.study_style}
- **Time Available:** {student.time_per_day} hours/day
- **Gamification:** {"Yes" if student.gamification else "No"}
- **Notes:** {student.notes or "None"}

Generate a Markdown study plan with:
1. A brief **overview** of the plan
2. **Week-by-week breakdown** (Week 1–4), each with 5-day schedules
3. **Resources** (books, videos, practice sites) specific to the subject
4. **Milestones** at end of each week
5. **Weak topic fixes** with targeted exercises
6. If gamification is on, add a small **XP system** with rewards
7. End with a short **motivational message**

Be specific, practical, and genuinely useful. Avoid generic advice."""

    try:
        plan_text = call_gemini(prompt=prompt, max_tokens=2500)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini plan generation failed: {str(e)}")

    data = load_data()
    data["plans"].append(
        {
            "student_name": student.name,
            "subject": student.subject,
            "timestamp": datetime.now().isoformat(),
            "preview": plan_text[:200],
        }
    )
    save_data(data)

    return {"plan": plan_text, "format": "markdown"}


@app.post("/api/generate-questions")
async def generate_questions(student: StudentData):
    prompt = f"""Generate exactly 15 practice questions for a student.

**Student:** {student.name}  
**Subject:** {student.subject}  
**Level:** {student.current_level}  
**Weak Topics:** {student.weak_topics or "none specified"}  
**Goal:** {student.goal}

Create:
- 5 conceptual/theory questions (easy-medium)
- 5 application/problem-solving questions (medium)
- 5 challenge questions (medium-hard)

Return ONLY this JSON (no markdown, no explanation):
{{
  "student": "{student.name}",
  "subject": "{student.subject}",
  "generated_at": "{datetime.now().strftime('%Y-%m-%d')}",
  "questions": [
    {{
      "id": 1,
      "category": "conceptual",
      "difficulty": "easy",
      "question": "...",
      "hint": "...",
      "marks": 2
    }}
  ]
}}"""

    try:
        raw = call_gemini(prompt=prompt, max_tokens=2500).strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini question generation failed: {str(e)}")

    if raw.startswith("```"):
        raw = raw.split("```", 2)[1]
        if raw.startswith("json"):
            raw = raw[4:]
        raw = raw.strip()

    try:
        questions_data = json.loads(raw)

        pdf_lines = [f"Question Set — {student.subject}", f"Generated for: {student.name}", ""]
        for q in questions_data.get("questions", []):
            pdf_lines.append(
                f"Q{q['id']}. [{q['category'].upper()} | {q['difficulty'].capitalize()} | {q.get('marks', 2)} marks]"
            )
            pdf_lines.append(q["question"])
            pdf_lines.append(f"  Hint: {q['hint']}")
            pdf_lines.append("")

        pdf_b64 = make_pdf(
            f"Question Set — {student.subject}",
            "\n".join(pdf_lines),
            subtitle=f"Prepared for {student.name} | {datetime.now().strftime('%B %d, %Y')}",
        )

        return {"questions": questions_data, "pdf": pdf_b64, "format": "json+pdf"}

    except json.JSONDecodeError:
        return {"questions": raw, "pdf": "", "format": "text"}


@app.post("/api/chat")
async def chat(data: ChatMessage):
    system = """You are TrackX AI — a sharp, motivational, and slightly playful study assistant.
Help students with plans, tips, concept explanations, and motivation.
Be specific and concise. Use markdown formatting.
When relevant, add gamification elements: XP, streaks, daily challenges.
Never be generic — tailor every response to the student's context."""

    ctx = ""
    if data.student_data:
        s = data.student_data
        ctx = (
            f"[Student context: {s.name}, studying {s.subject}, "
            f"level: {s.current_level}, goal: {s.goal}, "
            f"weak topics: {s.weak_topics}]\n\n"
        )

    conversation = ""
    for h in data.history or []:
        if h.get("role") in ("user", "assistant"):
            conversation += f"{h['role'].capitalize()}: {h['content']}\n\n"
    conversation += f"User: {ctx + data.message}"

    try:
        response_text = call_gemini(
            prompt=conversation,
            system=system,
            max_tokens=1200,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini chat failed: {str(e)}")

    db = load_data()
    db["sessions"].append(
        {
            "timestamp": datetime.now().isoformat(),
            "student": data.student_data.name if data.student_data else "anonymous",
        }
    )
    save_data(db)

    return {"response": response_text, "format": "markdown"}


@app.post("/api/extra-fun")
async def extra_fun(student: StudentData):
    prompt = f"""Create a fun, high-energy "Student Power Report" for {student.name}.

**Profile:**
- Subject: {student.subject}
- Goal: {student.goal}
- Level: {student.current_level}
- Daily study: {student.time_per_day} hours
- Style: {student.study_style}

Build a creative power report with these sections:

## ⚡ Power Profile
Give {student.name} a cool "Learner Archetype" title (e.g., "The Code Samurai", "The Math Mage") and a short description.

## 🧠 Learning Superpower
What's their unique learning superpower based on their style?

## 📊 XP Status
Create a fun ASCII-style progress bar and current XP level (make up fun level names).

## 🗡️ Weekly Quests
3 specific, achievable quests for this week based on their subject and weak topics.

## 🏆 Boss Level Unlocked
What big goal/milestone will they unlock by end of month?

## 🎖️ Badges Available
5 badges they can earn (with emoji icons and unlock conditions).

## ⚔️ Battle Cry
A short, punchy, personalized motivational line.

Make it genuinely fun and energetic — not generic. Use the student's actual subject and goals."""

    try:
        content = call_gemini(prompt=prompt, max_tokens=1500)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini extra-fun failed: {str(e)}")

    pdf_b64 = make_pdf(
        f"⚡ TrackX Power Report",
        content,
        subtitle=f"{student.name} • {datetime.now().strftime('%B %Y')}",
    )

    return {"content": content, "pdf": pdf_b64, "format": "markdown+pdf"}