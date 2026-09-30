from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean, Text
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    masteries = relationship("Mastery", back_populates="user")
    assessments = relationship("Assessment", back_populates="user")

class Topic(Base):
    __tablename__ = "topics"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, unique=True)
    parent_id = Column(Integer, ForeignKey("topics.id"), nullable=True)
    
    masteries = relationship("Mastery", back_populates="topic")

class Document(Base):
    __tablename__ = "documents"
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    file_type = Column(String) # pdf, pptx, mp4
    status = Column(String) # uploading, processing, done, error
    created_at = Column(DateTime, default=datetime.utcnow)

class Assessment(Base):
    __tablename__ = "assessments"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    topic_scope = Column(String) # comma separated topic names or "all"
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="assessments")
    questions = relationship("Question", back_populates="assessment")

class Question(Base):
    __tablename__ = "questions"
    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"))
    topic_id = Column(Integer, ForeignKey("topics.id"), nullable=True)
    question_text = Column(Text)
    question_type = Column(String) # mcq, short_answer, numerical
    options = Column(Text, nullable=True) # JSON string for mcq
    correct_answer = Column(Text)
    explanation = Column(Text)
    difficulty = Column(String) # easy, medium, hard
    source_location = Column(String) # exact location citation
    
    assessment = relationship("Assessment", back_populates="questions")
    attempts = relationship("Attempt", back_populates="question")

class Attempt(Base):
    __tablename__ = "attempts"
    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"))
    user_answer = Column(Text)
    is_correct = Column(Boolean)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    question = relationship("Question", back_populates="attempts")

class Mastery(Base):
    __tablename__ = "mastery"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    topic_id = Column(Integer, ForeignKey("topics.id"))
    mastery_level = Column(Float, default=0.0)
    p_known = Column(Float, default=0.1) # Bayesian Knowledge Tracing parameters
    p_slip = Column(Float, default=0.1)
    p_guess = Column(Float, default=0.2)
    p_transit = Column(Float, default=0.1)
    last_updated = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="masteries")
    topic = relationship("Topic", back_populates="masteries")
