# StudyPilot: Your Adaptive AI Study Companion

## Inspiration
Students today juggle multiple formats of study materials: 2-hour lecture videos, dense 500-page textbook PDFs, and messy slide decks. Synthesizing this into an actionable study plan is overwhelming. We built StudyPilot to act as a personalized, 24/7 tutor that instantly unifies these materials and adapts to the student's unique learning pace.

## What it does
StudyPilot is an end-to-end adaptive learning platform. It allows users to upload any combination of MP4s, PDFs, and PPTXs. It extracts the knowledge (transcribing audio via Whisper and describing images via Gemini Vision) and builds a searchable Vector Database. 
Students can:
1. Chat with a tutor that **strictly grounds** answers in the source material, providing exact citations (page numbers or video timestamps).
2. Take auto-generated, cross-validated MCQs.
3. Track their real-time mastery via a Bayesian Knowledge Tracing (BKT) dashboard.
4. Utilize spaced-repetition schedules, flashcards, and knowledge maps.

## How we built it
- **Backend:** Python, FastAPI, and SQLAlchemy.
- **AI / LLMs:** LangChain orchestration with Google Gemini 1.5 Pro (for generation) and Gemini 1.5 Flash (for vision and verification).
- **RAG Pipeline:** ChromaDB / Pinecone vector storage. PyMuPDF for PDFs and OpenAI Whisper for video transcription.
- **Frontend:** React, Vite, TailwindCSS, and Recharts.
- **Evaluation:** Rigorously tested using the RAGAS framework (faithfulness, relevancy) and simulated student profiles.

## Challenges we ran into
Preventing hallucinations was our biggest challenge. We implemented a strict grounding prompt, but LLMs sometimes still guessed. We solved this by using a dual-model approach: a generator model creates questions/answers, and a separate evaluator model strictly verifies correctness against the context before showing it to the user.

## Accomplishments that we're proud of
Implementing the **Bayesian Knowledge Tracing (BKT)** algorithm natively in Python to mathematically track the probability that a student understands a concept, and tying that directly into a spaced-repetition forgetting curve on the frontend.

## What's next for StudyPilot
We plan to add multiplayer/collaborative study rooms, real-time voice conversations with the tutor using WebRTC, and direct integration with Canvas and Blackboard LMS systems.
