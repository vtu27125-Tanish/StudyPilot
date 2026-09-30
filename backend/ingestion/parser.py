import fitz # PyMuPDF
import google.generativeai as genai
from langchain_core.documents import Document
import os
import io
from PIL import Image

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
vision_model = genai.GenerativeModel('gemini-1.5-flash')

def get_image_description(image_bytes: bytes) -> str:
    try:
        img = Image.open(io.BytesIO(image_bytes))
        response = vision_model.generate_content(["Describe this educational diagram or figure in detail. Extract any text and explain the concepts visually represented.", img])
        return response.text
    except Exception as e:
        print(f"Vision error: {e}")
        return ""

def parse_pdf(file_path: str, filename: str) -> list[Document]:
    doc = fitz.open(file_path)
    documents = []
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        text = page.get_text("text")
        
        # Extract images
        image_list = page.get_images(full=True)
        img_texts = []
        for img_index, img in enumerate(image_list):
            xref = img[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            desc = get_image_description(image_bytes)
            if desc:
                img_texts.append(f"[Image {img_index+1} Description: {desc}]")
        
        full_content = text + "\n" + "\n".join(img_texts)
        
        documents.append(Document(
            page_content=full_content,
            metadata={
                "source": filename,
                "page": page_num + 1,
                "file_type": "pdf"
            }
        ))
        
    return documents
