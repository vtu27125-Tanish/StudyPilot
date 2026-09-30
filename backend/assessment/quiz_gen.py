from pydantic import BaseModel, Field
from langchain_google_genai import ChatGoogleGenerativeAI
from backend.ingestion.vector_store import vector_store
import json

class QuestionSchema(BaseModel):
    question_text: str = Field(description="The question text")
    options: list[str] = Field(description="4 options for MCQ")
    correct_answer: str = Field(description="The exact correct option from the options list")
    explanation: str = Field(description="Explanation of why this is correct")
    difficulty: str = Field(description="'easy', 'medium', or 'hard'")
    source_location: str = Field(description="Citation of where this came from based on context")

class QuizSchema(BaseModel):
    questions: list[QuestionSchema]

def generate_quiz(topic: str, difficulty: str = "medium", count: int = 5):
    # 1. Retrieve topic context
    docs = vector_store.similarity_search(topic, k=10)
    context_text = "\n\n".join([f"Source: {d.metadata.get('source')} Page: {d.metadata.get('page')} Time: {d.metadata.get('start_time')}\n{d.page_content}" for d in docs])
    
    # 2. Generator LLM
    generator_llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro", temperature=0.4)
    generator = generator_llm.with_structured_output(QuizSchema)
    
    prompt = f"""
    Based on the following educational materials about '{topic}', generate {count} multiple choice questions.
    Target difficulty: {difficulty}.
    Ensure questions test understanding, not just rote memorization.
    
    Context:
    {context_text}
    """
    
    try:
        generated_quiz = generator.invoke(prompt)
    except Exception as e:
        print(f"Generation error: {e}")
        return []
    
    # 3. Cross-Validation LLM (Verification)
    validator_llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0)
    
    verified_questions = []
    for q in generated_quiz.questions:
        val_prompt = f"""
        Verify this question:
        Question: {q.question_text}
        Options: {q.options}
        Proposed Correct Answer: {q.correct_answer}
        
        Is the proposed answer absolutely correct based solely on the question? Reply ONLY 'YES' or 'NO'.
        """
        is_valid = validator_llm.invoke(val_prompt).content.strip().upper()
        if 'YES' in is_valid:
            verified_questions.append({
                "question_text": q.question_text,
                "options": json.dumps(q.options),
                "correct_answer": q.correct_answer,
                "explanation": q.explanation,
                "difficulty": q.difficulty,
                "source_location": q.source_location,
                "question_type": "mcq"
            })
            
    return verified_questions
