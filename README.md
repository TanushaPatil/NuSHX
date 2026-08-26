# NUSHX — AI PDF Assistant

🔗 Live Demo:https://nushx.onrender.com/

> Ask questions. Understand documents. Get answers.

NUSHX is an AI-powered PDF assistant that allows users to upload a PDF and ask questions about its content.

Instead of sending the entire document to an AI model, NUSHX first finds the most relevant parts of the document and sends only that context to the AI.

---

## ✨ Features

- 📄 Upload PDF documents
- 🔍 Extract text from PDFs
- ✂️ Split documents into smaller chunks
- 🧠 TF-IDF based document representation
- 🎯 Cosine similarity based retrieval
- 🤖 AI-generated answers using Groq
- 💬 Interactive document chat
- ⚡ Fast and lightweight
- 🔐 Users can provide their own Groq API key
- 📱 Responsive interface
- 🌙 Elegant dark UI

---

## 🔄 How NUSHX Works

```text
                ┌───────────────┐
                │   Upload PDF  │
                └───────┬───────┘
                        ↓
                ┌───────────────┐
                │ Extract Text  │
                └───────┬───────┘
                        ↓
                ┌───────────────┐
                │ Create Chunks │
                └───────┬───────┘
                        ↓
                ┌───────────────┐
                │ TF-IDF        │
                │ Vectorization │
                └───────┬───────┘
                        ↓
                ┌───────────────┐
                │ Cosine        │
                │ Similarity    │
                └───────┬───────┘
                        ↓
                ┌───────────────┐
                │ Top Relevant  │
                │ Chunks        │
                └───────┬───────┘
                        ↓
                ┌───────────────┐
                │ Groq LLM      │
                └───────┬───────┘
                        ↓
                ┌───────────────┐
                │ Final Answer  │
                └───────────────┘
                🧠 RAG Pipeline

NUSHX follows a simple Retrieval-Augmented Generation pipeline:

1. PDF Upload

The user uploads a PDF document.

2. Text Extraction

Text is extracted from the PDF using PyPDF2.

3. Chunking

The extracted document is divided into smaller chunks.

4. TF-IDF Vectorization

The chunks are converted into numerical representations using TF-IDF.

5. Similarity Retrieval

Cosine similarity compares the user's question with the document chunks.

6. Context Selection

The most relevant chunks are selected as context.

7. AI Generation

The retrieved context and user question are sent to the Groq-powered LLM.

8. Answer

NUSHX displays the generated answer in the chat interface.

🛠️ Tech Stack
Frontend
HTML
CSS
JavaScript
Backend
Python
Flask
PDF Processing
PyPDF2
Retrieval
NumPy
Scikit-learn
TF-IDF
Cosine Similarity
AI
Groq API
<img width="960" height="564" alt="Screenshot 2026-08-26 173411" src="https://github.com/user-attachments/assets/4c0efd54-a3c5-4bd1-b57b-e2dc99f976ce" />
<img width="960" height="564" alt="Screenshot 2026-08-26 173355" src="https://github.com/user-attachments/assets/4d89482d-b591-46c4-b294-31d71e292689" />
<img width="960" height="564" alt="Screenshot 2026-08-26 173341" src="https://github.com/user-attachments/assets/594a588a-1eec-49c7-8eb8-5904a8681e1d" />
<img width="960" height="564" alt="Screenshot 2026-08-26 173200" src="https://github.com/user-attachments/assets/6f37a36f-1c0a-4a13-a6fe-dc6f0b3332d1" />
<img width="960" height="564" alt="Screenshot 2026-08-26 173103" src="https://github.com/user-attachments/assets/864d9399-a2e0-4287-b529-99b8d9d18aa3" />
<img width="960" height="564" alt="Screenshot 2026-08-26 173044" src="https://github.com/user-attachments/assets/3ba95877-7cb4-4d86-a186-b7fc1371d458" />


