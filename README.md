# NUSHX — AI PDF Assistant 📄

NUSHX is an AI-powered PDF Assistant that lets users upload a PDF and ask questions about its content. It uses a simple **Retrieval-Augmented Generation (RAG)** pipeline to retrieve the most relevant information from the document and generate an answer using an LLM.

## 🚀 Features

* 📄 Upload PDF documents
* 🔍 Extract text from PDFs
* ✂️ Split document text into chunks
* 🧠 TF-IDF based text vectorization
* 📊 Cosine similarity based document retrieval
* 🎯 Retrieve the most relevant chunks
* 🤖 Generate answers using Groq LLM
* 💬 Simple web-based chat interface
* 🌐 Built using Flask

## 🔄 How It Works

```text
Upload PDF
    ↓
Extract Text
    ↓
Create Text Chunks
    ↓
TF-IDF Vectorization
    ↓
Cosine Similarity
    ↓
Retrieve Relevant Chunks
    ↓
Send Context + Question to Groq LLM
    ↓
Generate Answer
    ↓
Display Answer
```

## 🛠️ Tech Stack

### Frontend

* HTML
* CSS
* JavaScript

### Backend

* Python
* Flask

### AI / RAG

* Groq API
* TF-IDF
* Cosine Similarity

### Python Libraries

* Flask
* PyPDF2
* scikit-learn
* NumPy
* Groq

## 📁 Project Structure

```text
NUSHX/
│
├── app.py
├── requirements.txt
├── README.md
│
├── uploads/
│
├── rag/
│   ├── chunking.py
│   ├── retrieval.py
│   └── llm.py
│
├── templates/
│   └── index.html
│
└── static/
    ├── css/
    │   └── style.css
    └── js/
        └── script.js
```

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone <your-github-repository-url>
cd NUSHX
```

### 2. Create a virtual environment

```bash
python -m venv venv
```

### 3. Activate the environment

**Windows:**

```bash
venv\Scripts\activate
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

### 5. Add your Groq API Key

Create an environment variable:

**Windows PowerShell:**

```powershell
$env:GROQ_API_KEY="your_api_key_here"
```

⚠️ **Never upload your API key to GitHub.**

### 6. Run the application

```bash
python app.py
```

Open the local URL shown by Flask in your browser.

## 🧪 Usage

1. Open NUSHX.
2. Upload a PDF.
3. Wait for the document to be processed.
4. Enter your question.
5. NUSHX retrieves the most relevant parts of the PDF.
6. The retrieved context is sent to the Groq LLM.
7. The generated answer is displayed in the chat interface.

## 🧠 RAG Approach

NUSHX uses a lightweight RAG implementation without a vector database.

The system uses:

* **TF-IDF** to convert text into numerical vectors.
* **Cosine Similarity** to measure how relevant each chunk is to the user's question.
* The highest-relevance chunks are selected as context.
* The selected context and question are sent to the Groq LLM.

This keeps the project simple, transparent, and easy to understand.

## 🔐 Security

* API keys should be stored as environment variables.
* Do not commit `.env` files or API keys.
* Uploaded documents should be handled carefully.

Add sensitive files to `.gitignore`:

```text
.env
venv/
__pycache__/
uploads/*
```

## 🔮 Future Improvements

* Support for multiple PDFs
* Conversation memory
* Better document chunking
* Support for more file formats
* Improved retrieval methods
* Authentication
* Cloud deployment
* Streaming AI responses

## 👩‍💻 Project

**NUSHX — AI PDF Assistant**

Built with Python, Flask, TF-IDF, and Groq.

---

⭐ If you find this project useful, consider giving it a star!
