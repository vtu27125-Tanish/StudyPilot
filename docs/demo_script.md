# StudyPilot - Demo Video Script
**Target Duration:** 3-4 minutes

## 1. Introduction (0:00 - 0:30)
* **Visual:** Show the StudyPilot Dashboard on screen.
* **Speaker:** "Welcome to StudyPilot, an AI study companion designed for the Multimodal AI Hackathon 2026. We solve the problem of fragmented study materials by unifying videos, textbooks, and slides into one adaptive, personalized learning platform."

## 2. Multimodal Knowledge Ingestion (0:30 - 1:00)
* **Visual:** Navigate to the 'Ingestion' tab. Drag and drop a PDF, PPTX, and MP4.
* **Speaker:** "Here, I'm uploading a lecture video and the corresponding PDF textbook. Behind the scenes, StudyPilot uses Whisper for audio transcription, PyMuPDF for text extraction, and Gemini 1.5 Flash to 'see' and caption diagrams and slides. All of this is chunked and stored in our Pinecone Vector Database."

## 3. Grounded Tutor Chat (1:00 - 1:45)
* **Visual:** Switch to 'Tutor Chat' tab. Ask: "What is backpropagation?" 
* **Speaker:** "Let's ask the tutor a question. Notice how it generates a clear answer, but more importantly, it provides *exact inline citations*. If I click this citation, it points exactly to page 45 of our textbook, or the 14-second mark in our lecture video."
* **Visual:** Turn on "Hindi Mode" toggle and ask another question.
* **Speaker:** "We've also added a Hindi Mode toggle to make learning more accessible."

## 4. Adaptive Quizzes & Learner Model (1:45 - 2:45)
* **Visual:** Go to 'Quizzes'. Generate a quiz on "Gradient Descent".
* **Speaker:** "When I want to test myself, StudyPilot dynamically generates a multiple-choice quiz. Every generated question is cross-validated by a second LLM to ensure correctness. As I answer questions, the backend updates my mastery level using Bayesian Knowledge Tracing (BKT)."
* **Visual:** Switch back to the 'Dashboard'. Show the progression graph and 'Next Steps'.
* **Speaker:** "Our dashboard shows my mastery curve. It uses a spaced-repetition algorithm (the forgetting curve) to tell me exactly what to study next."

## 5. Advanced Features & Conclusion (2:45 - 3:30)
* **Visual:** Quickly flash through 'Knowledge Map', 'Flashcards', and 'Study Schedule'.
* **Speaker:** "Finally, we have advanced tools like visual Knowledge Maps, auto-generated Flashcards for weak topics, and an optimized Study Schedule. We've comprehensively evaluated our RAG pipeline using RAGAS and simulated student profiles. Thank you for watching!"
