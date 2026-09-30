import whisper
from langchain_core.documents import Document

def transcribe_video(file_path: str, filename: str, model_name: str = "base") -> list[Document]:
    """
    Transcribes video/audio using Whisper and chunks by timestamp segments.
    """
    model = whisper.load_model(model_name)
    result = model.transcribe(file_path)
    
    documents = []
    for segment in result['segments']:
        start_time = segment['start']
        end_time = segment['end']
        text = segment['text']
        
        documents.append(Document(
            page_content=text,
            metadata={
                "source": filename,
                "start_time": start_time,
                "end_time": end_time,
                "file_type": "video"
            }
        ))
        
    return documents
