from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.documents import Document
from pydantic import BaseModel, Field
import json
import os

class ChunkTags(BaseModel):
    topics: list[str] = Field(description="List of broad topics covered in this text")
    concepts: list[str] = Field(description="Specific concepts taught in this text")

def chunk_and_tag_documents(documents: list[Document]) -> list[Document]:
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    
    chunks = text_splitter.split_documents(documents)
    
    # Tag chunks using Gemini
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0)
    tagger = llm.with_structured_output(ChunkTags)
    
    for i, chunk in enumerate(chunks):
        try:
            tags = tagger.invoke(chunk.page_content)
            chunk.metadata['topics'] = tags.topics
            chunk.metadata['concepts'] = tags.concepts
            chunk.metadata['chunk_index'] = i
        except Exception as e:
            print(f"Tagging error: {e}")
            chunk.metadata['topics'] = []
            chunk.metadata['concepts'] = []
            
    return chunks
