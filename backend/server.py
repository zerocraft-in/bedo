import os
import uuid
import random
from datetime import datetime, timezone
from typing import Optional

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
from emergentintegrations.llm.chat import LlmChat, UserMessage

MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "fitness_app")
EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY", "")

app = FastAPI(title="FitAI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

FITNESS_COACH_PROMPT = """You are FitAI, an elite personal fitness coach and motivational expert built into the Emergent Fitness app.

Your expertise covers:
- Exercise science and workout programming  
- Nutrition and recovery optimization
- Mental fitness and habit building
- Injury prevention and mobility

Your personality:
- Energetic, supportive, and science-backed
- Celebrates wins (no matter how small)
- Provides actionable, specific advice
- Uses emojis thoughtfully to emphasize key points

Response style:
- Keep responses concise: 2-3 sentences for motivation, 4-6 for detailed advice
- Always end with an encouraging call-to-action when appropriate
- Reference the user's stats when relevant"""

FALLBACK_RESPONSES = [
    "You're absolutely crushing it! 🔥 Every single rep you complete is writing your success story. Champions aren't born—they're built one workout at a time. Now go show up for yourself!",
    "Your consistency is building something powerful that nobody can take away. 💪 Stay the course, trust the process, and remember: progress, not perfection!",
    "The fact that you're here, asking questions, planning workouts—that's what separates achievers from dreamers. 🚀 You've got this!",
    "Recovery is part of the process! 🧘 Make sure you're getting 7-9 hours of sleep, staying hydrated, and eating enough protein to support your gains.",
    "Nutrition tip: Aim for 1g of protein per pound of bodyweight daily. 🥩 Pair that with your training consistency and the results will come!",
]

MOTIVATION_FALLBACKS = [
    "Every rep counts. Every drop of sweat brings you closer to your goals! 🔥",
    "You showed up today - that's already a win. Now make it count! 💪",
    "Your future self is cheering you on. Let's go! 🚀",
    "Champions are made in moments when they want to quit but don't. ⚡",
    "Small daily improvements lead to staggering long-term results. Keep going! 📈",
]


class ChatRequest(BaseModel):
    session_id: str
    message: str
    user_name: str = "Athlete"
    streak: int = 0
    total_workouts: int = 0


class ProfileRequest(BaseModel):
    user_id: str
    name: str
    goal: str
    fitness_level: str
    workout_style: str
    weight: float = 75.0
    target_weight: float = 70.0


@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "FitAI Backend", "timestamp": datetime.now(timezone.utc).isoformat()}


@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        # Fetch recent history for context
        history_docs = await db.chat_messages.find(
            {"session_id": request.session_id},
            {"_id": 0}
        ).sort("timestamp", -1).limit(8).to_list(8)
        history_docs.reverse()

        # Build context with history
        history_context = ""
        for doc in history_docs:
            role = "User" if doc["role"] == "user" else "FitAI"
            history_context += f"{role}: {doc['content']}\n"

        # Compose system message with user context
        system_msg = FITNESS_COACH_PROMPT
        system_msg += f"\n\nUser context: Name={request.user_name}, Streak={request.streak} days, Total workouts={request.total_workouts}"
        if history_context:
            system_msg += f"\n\nRecent conversation:\n{history_context}"

        # Create fresh LlmChat instance
        chat_instance = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=str(uuid.uuid4()),
            system_message=system_msg
        ).with_model("openai", "gpt-5.4")

        response = await chat_instance.send_message(UserMessage(text=request.message))

        # Persist to MongoDB
        now = datetime.now(timezone.utc).isoformat()
        await db.chat_messages.insert_many([
            {"session_id": request.session_id, "role": "user", "content": request.message, "timestamp": now},
            {"session_id": request.session_id, "role": "assistant", "content": response, "timestamp": now},
        ])

        return {"response": response, "session_id": request.session_id}

    except Exception as e:
        # Graceful fallback
        fallback = random.choice(FALLBACK_RESPONSES)
        return {"response": fallback, "session_id": request.session_id}


@app.get("/api/chat/history/{session_id}")
async def get_chat_history(session_id: str):
    messages = await db.chat_messages.find(
        {"session_id": session_id},
        {"_id": 0}
    ).sort("timestamp", 1).to_list(100)
    return {"messages": messages}


@app.get("/api/motivation")
async def get_motivation(user_name: str = "Athlete", streak: int = 0):
    try:
        if not EMERGENT_LLM_KEY:
            return {"message": random.choice(MOTIVATION_FALLBACKS)}

        chat_instance = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"motivation-{uuid.uuid4()}",
            system_message="You are FitAI, an elite fitness motivation coach. Generate punchy, specific motivational messages."
        ).with_model("openai", "gpt-5.4")

        streak_context = f"a {streak}-day" if streak > 0 else "a new"
        prompt = (
            f"Generate a motivational message for {user_name} who has {streak_context} workout streak. "
            "Be specific, energetic, and use 1-2 relevant emojis. Max 2 sentences."
        )
        response = await chat_instance.send_message(UserMessage(text=prompt))
        return {"message": response}
ii
    except Exception:
        return {"message": random.choice(MOTIVATION_FALLBACKS)}


@app.post("/api/user/profile")
async def save_profile(request: ProfileRequest):
    doc = {
        **request.model_dump(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    await db.user_profiles.update_one(
        {"user_id": request.user_id},
        {"$set": doc},
        upsert=True
    )
    return {"success": True}


@app.get("/api/user/profile/{user_id}")
async def get_profile(user_id: str):
    profile = await db.user_profiles.find_one({"user_id": user_id}, {"_id": 0})
    if not profile:
        raise HTTPException(status_code=404, detail="Prole not found")
    return profile


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8001, reload=True)
