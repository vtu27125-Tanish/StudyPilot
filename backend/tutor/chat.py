from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from backend.ingestion.vector_store import vector_store

def generate_chat_response(query: str, history: list = []):
    """
    Generates a grounded chat response with inline citations.
    """
    # 1. Retrieve context
    docs = vector_store.similarity_search(query, k=5)
    
    if not docs:
        return {
            "response": "I cannot answer this as I don't have relevant information in the provided course materials.",
            "citations": []
        }
        
    context_text = ""
    citations = []
    
    for i, doc in enumerate(docs):
        source = doc.metadata.get("source", "Unknown")
        page = doc.metadata.get("page", "")
        start_time = doc.metadata.get("start_time", "")
        
        loc = f"Page {page}" if page else f"Timestamp {start_time}s"
        ref_id = f"[{i+1}]"
        
        context_text += f"\n{ref_id} Source: {source}, {loc}\nText: {doc.page_content}\n"
        citations.append({
            "id": i+1,
            "source": source,
            "location": loc,
            "text_snippet": doc.page_content[:100] + "..."
        })
        
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an AI study tutor. Answer the user's question ONLY using the provided context excerpts. "
                   "If the context does not contain the answer, explicitly decline and state that it's outside the course scope. "
                   "Include inline citations like [1], [2] corresponding to the sources used."),
        ("user", "Context excerpts:\n{context}\n\nQuestion: {query}")
    ])
    
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro", temperature=0.2)
    chain = prompt | llm
    
    response = chain.invoke({"context": context_text, "query": query})
    
    return {
        "response": response.content,
        "citations": citations
    }
