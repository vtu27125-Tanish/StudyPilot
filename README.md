# StudyPilot 🎓

AI study companion for the Multimodal AI Hackathon 2026, Track D (Personalized Tutoring & Adaptive Learning).

StudyPilot unifies lecture videos, textbooks, and slides into a source-cited knowledge base, and uses it to run adaptive assessments and personalized tutoring.

## Features
- **Multimodal Knowledge Base**: Upload PDFs, PPTXs, and MP4s. Information is extracted, chunked, and tagged.
- **Source Grounding**: Chat responses are cited with direct links to the source material (page number, slide, or video timestamp).
- **Adaptive Assessment**: Generates quizzes and mock exams based on student mastery.
- **Learner Model**: Tracks per-topic mastery using Bayesian Knowledge Tracing (BKT) and spaced-repetition.

## Architecture
See [docs/architecture.md](docs/architecture.md) for a detailed overview.

## Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+ & npm
- ffmpeg (required for Whisper audio processing)

### Environment Variables
1. Copy `.env.example` to `.env` in the root directory:
   ```bash
   cp .env.example .env
   ```
2. Fill in your `GEMINI_API_KEY` and `PINECONE_API_KEY`. (Alternatively, leave Pinecone blank and set `USE_LOCAL_CHROMADB="true"`).

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the backend server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Evaluation
Run the evaluation suite (RAGAS + simulated students):
```bash
cd backend
python -m eval.run_evaluation
```
Results will be saved in `/eval/results/`.
