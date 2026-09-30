# StudyPilot Architecture

## Overview
StudyPilot is a full-stack web application designed as an AI study companion.

## Tech Stack
- **Backend:** Python, FastAPI, SQLAlchemy
- **Vector DB:** Pinecone (or local ChromaDB)
- **Database:** SQLite
- **LLM:** Google Gemini API (1.5 Flash for Vision/Verification, 1.5 Pro for Generation)
- **Frontend:** React, Vite, Tailwind CSS, Recharts

## Core Modules
1. **Ingestion Pipeline (`/backend/ingestion`)**
   - Transcribes MP4s via Whisper.
   - Parses PDFs using PyMuPDF and extracts image descriptions via Gemini Vision.
   - Chunks text using `RecursiveCharacterTextSplitter`.
   - Embeds and stores in Vector DB.

2. **Grounded Tutor (`/backend/tutor`)**
   - Performs similarity search on Vector DB.
   - Injects citations with specific file and location context.
   - Refuses off-topic questions.

3. **Adaptive Assessment (`/backend/assessment`)**
   - Retrieves topic context and generates MCQs.
   - Uses a second Gemini model call to cross-validate correctness.

4. **Learner Model (`/backend/learner_model`)**
   - Implements Bayesian Knowledge Tracing (BKT) to track $P(\text{known})$ for each topic.
   - Employs a forgetting curve for spaced repetition.

5. **Evaluation (`/backend/eval`)**
   - Uses RAGAS to compute faithfulness and answer relevancy.
   - Simulates students (weak, average, strong) to measure BKT mastery progression.
