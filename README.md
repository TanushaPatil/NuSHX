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
