import os
from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_core.documents import Document

class VectorStoreManager:
    def __init__(self):
        self.use_local = os.getenv("USE_LOCAL_CHROMADB", "true").lower() == "true"
        self.embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
        
        if self.use_local:
            self.vectorstore = Chroma(
                collection_name="studypilot",
                embedding_function=self.embeddings,
                persist_directory="./chroma_db"
            )
        else:
            from pinecone import Pinecone
            from langchain_community.vectorstores import Pinecone as PineconeLangchain
            api_key = os.getenv("PINECONE_API_KEY")
            index_name = os.getenv("PINECONE_INDEX_NAME")
            pc = Pinecone(api_key=api_key)
            index = pc.Index(index_name)
            self.vectorstore = PineconeLangchain(index, self.embeddings, "text")

    def add_documents(self, documents: list[Document]):
        self.vectorstore.add_documents(documents)

    def similarity_search(self, query: str, k: int = 5):
        return self.vectorstore.similarity_search(query, k=k)

    def similarity_search_with_score(self, query: str, k: int = 5):
        return self.vectorstore.similarity_search_with_score(query, k=k)

vector_store = VectorStoreManager()
