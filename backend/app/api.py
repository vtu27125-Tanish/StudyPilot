from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app import models
from backend.ingestion.parser import parse_pdf
from backend.ingestion.whisper_transcriber import transcribe_video
from backend.ingestion.chunker import chunk_and_tag_documents
from backend.ingestion.vector_store import vector_store
from backend.tutor.chat import generate_chat_response
from backend.assessment.quiz_gen import generate_quiz
from pydantic import BaseModel
import shutil
import os

router = APIRouter()

UPLOAD_DIR = "./uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def process_file_background(file_path: str, filename: str, doc_id: int, db: Session):
    try:
        if filename.endswith(".pdf"):
            docs = parse_pdf(file_path, filename)
        elif filename.endswith(".mp4"):
            docs = transcribe_video(file_path, filename)
        else:
            return
            
        chunks = chunk_and_tag_documents(docs)
        vector_store.add_documents(chunks)
        
        db_doc = db.query(models.Document).filter(models.Document.id == doc_id).first()
        db_doc.status = "done"
        db.commit()
    except Exception as e:
        print(f"Error processing {filename}: {e}")
        db_doc = db.query(models.Document).filter(models.Document.id == doc_id).first()
        db_doc.status = "error"
        db.commit()

@router.post("/upload")
async def upload_file(background_tasks: BackgroundTasks, file: UploadFile = File(...), db: Session = Depends(get_db)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    db_doc = models.Document(filename=file.filename, file_type=file.filename.split('.')[-1], status="processing")
    db.add(db_doc)
    db.commit()
    db.refresh(db_doc)
    
    background_tasks.add_task(process_file_background, file_path, file.filename, db_doc.id, db)
    return {"status": "processing", "document_id": db_doc.id}

class ChatRequest(BaseModel):
    query: str
    
@router.post("/chat")
async def chat_endpoint(req: ChatRequest):
    return generate_chat_response(req.query)

class QuizRequest(BaseModel):
    topic: str
    difficulty: str = "medium"
    count: int = 5
    user_id: int

@router.post("/quiz/generate")
async def generate_quiz_endpoint(req: QuizRequest, db: Session = Depends(get_db)):
    questions = generate_quiz(req.topic, req.difficulty, req.count)
    
    assessment = models.Assessment(user_id=req.user_id, topic_scope=req.topic)
    db.add(assessment)
    db.commit()
    db.refresh(assessment)
    
    for q in questions:
        db_q = models.Question(
            assessment_id=assessment.id,
            question_text=q["question_text"],
            question_type=q["question_type"],
            options=q["options"],
            correct_answer=q["correct_answer"],
            explanation=q["explanation"],
            difficulty=q["difficulty"],
            source_location=q["source_location"]
        )
        db.add(db_q)
    db.commit()
    
    return {"assessment_id": assessment.id, "questions": questions}
