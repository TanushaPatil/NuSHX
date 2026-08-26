# =========================================================
# NUSHX — AI PDF ASSISTANT
# Flask Backend
#
# Pipeline:
# PDF Upload
#     ↓
# Text Extraction
#     ↓
# Chunking
#     ↓
# TF-IDF Vectorization
#     ↓
# Cosine Similarity
#     ↓
# Top Relevant Chunks
#     ↓
# Groq LLM
#     ↓
# Answer
# =========================================================

from flask import Flask, render_template, request, jsonify

import os
import PyPDF2

from rag.chunking import create_chunks
from rag.retriever import Retriever
from rag.llm import generate_answer


# =========================================================
# APP CONFIGURATION
# =========================================================

app = Flask(__name__)

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


# =========================================================
# GLOBAL DOCUMENT STATE
# =========================================================

document_chunks = []

document_pages = 0

document_retriever = None


# =========================================================
# HOME
# =========================================================

@app.route("/")
def index():

    return render_template("index.html")


# =========================================================
# PDF TEXT EXTRACTION
# =========================================================

def extract_pdf_text(filepath):

    text = ""

    pages = 0

    try:

        with open(filepath, "rb") as pdf_file:

            reader = PyPDF2.PdfReader(pdf_file)

            pages = len(reader.pages)

            print(f"Total Pages: {pages}")

            for page_number, page in enumerate(
                reader.pages,
                start=1
            ):

                try:

                    page_text = page.extract_text()

                    if page_text:

                        text += page_text + "\n"

                    print(
                        f"Processed page "
                        f"{page_number}/{pages}"
                    )

                except Exception as error:

                    print(
                        f"Error reading page "
                        f"{page_number}: {error}"
                    )

    except Exception as error:

        print(
            f"PDF extraction error: {error}"
        )

        raise

    return text, pages


# =========================================================
# PDF UPLOAD
# =========================================================

@app.route("/upload", methods=["POST"])
def upload_pdf():

    global document_chunks
    global document_pages
    global document_retriever

    # -----------------------------------------------------
    # CHECK FILE
    # -----------------------------------------------------

    if "pdf" not in request.files:

        return jsonify({
            "error": "No PDF file received."
        }), 400

    file = request.files["pdf"]

    if file.filename == "":

        return jsonify({
            "error": "No file selected."
        }), 400

    if not file.filename.lower().endswith(".pdf"):

        return jsonify({
            "error": "Only PDF files are supported."
        }), 400

    # -----------------------------------------------------
    # SAVE PDF
    # -----------------------------------------------------

    filepath = os.path.join(
        app.config["UPLOAD_FOLDER"],
        file.filename
    )

    try:

        file.save(filepath)

        print(
            f"PDF saved to: {filepath}"
        )

        # -------------------------------------------------
        # EXTRACT TEXT
        # -------------------------------------------------

        text, pages = extract_pdf_text(filepath)

        if not text.strip():

            return jsonify({
                "error":
                    "Could not extract readable text "
                    "from this PDF."
            }), 400

        document_pages = pages

        # -------------------------------------------------
        # CREATE CHUNKS
        # -------------------------------------------------

        document_chunks = create_chunks(
            text,
            chunk_size=800,
            overlap=150
        )

        if not document_chunks:

            return jsonify({
                "error":
                    "No usable text chunks were created."
            }), 400

        print(
            f"Total chunks: {len(document_chunks)}"
        )

        # -------------------------------------------------
        # CREATE RETRIEVER
        # -------------------------------------------------

        try:

            document_retriever = Retriever(
                document_chunks,
                top_k=3
            )

        except ValueError as error:

            print(
                f"Retriever creation error: {error}"
            )

            document_chunks = []
            document_retriever = None

            return jsonify({
                "error":
                    "The PDF does not contain enough "
                    "usable text for searching."
            }), 400

        print(
            "Retriever created successfully."
        )

        # -------------------------------------------------
        # SUCCESS
        # -------------------------------------------------

        return jsonify({

            "success": True,

            "message":
                "PDF processed successfully.",

            "pages":
                document_pages,

            "chunks":
                len(document_chunks)

        })

    except Exception as error:

        print(
            f"Upload error: {error}"
        )

        return jsonify({
            "error": str(error)
        }), 500


# =========================================================
# ASK QUESTION
# =========================================================

@app.route("/ask", methods=["POST"])
def ask_question():

    global document_chunks
    global document_retriever

    # -----------------------------------------------------
    # CHECK DOCUMENT
    # -----------------------------------------------------

    if not document_chunks or document_retriever is None:

        return jsonify({
            "error":
                "Please upload a PDF first."
        }), 400

    # -----------------------------------------------------
    # GET REQUEST DATA
    # -----------------------------------------------------

    data = request.get_json(
        silent=True
    ) or {}

    question = (
        data.get("question") or ""
    ).strip()

    api_key = (
        data.get("api_key") or ""
    ).strip()

    # -----------------------------------------------------
    # VALIDATE QUESTION
    # -----------------------------------------------------

    if not question:

        return jsonify({
            "error":
                "Please enter a question."
        }), 400

    # -----------------------------------------------------
    # VALIDATE GROQ API KEY
    # -----------------------------------------------------

    if not api_key:

        return jsonify({
            "error":
                "Please enter your Groq API key."
        }), 400

    # -----------------------------------------------------
    # RETRIEVE RELEVANT CHUNKS
    # -----------------------------------------------------

    try:

        retrieved_results = (
            document_retriever.retrieve(
                question
            )
        )

        if not retrieved_results:

            return jsonify({
                "error":
                    "No relevant document "
                    "context found."
            }), 400

        # -------------------------------------------------
        # EXTRACT TEXT FROM RESULTS
        # -------------------------------------------------

        relevant_chunks = [
            result["text"]
            for result in retrieved_results
        ]

        # -------------------------------------------------
        # COMBINE CONTEXT
        # -------------------------------------------------

        context = "\n\n---\n\n".join(
            relevant_chunks
        )

        print(
            "Relevant chunks retrieved:",
            len(relevant_chunks)
        )

        # -------------------------------------------------
        # GENERATE GROQ ANSWER
        # -------------------------------------------------

        answer = generate_answer(
            api_key,
            question,
            context
        )

        # -------------------------------------------------
        # RETURN RESPONSE
        # -------------------------------------------------

        return jsonify({

            "success": True,

            "answer":
                answer,

            "context":
                context,

            "chunks_retrieved":
                len(relevant_chunks)

        })

    except Exception as error:

        print(
            f"Question error: {error}"
        )

        error_message = str(error)

        # -------------------------------------------------
        # FRIENDLY API ERROR
        # -------------------------------------------------

        if (
            "authentication" in
            error_message.lower()

            or

            "api key" in
            error_message.lower()

            or

            "401" in
            error_message
        ):

            error_message = (
                "The Groq API key appears to be "
                "invalid. Please check your key "
                "and try again."
            )

        return jsonify({

            "error":
                error_message

        }), 500


# =========================================================
# RUN SERVER
# =========================================================

if __name__ == "__main__":

    print()

    print("=" * 55)

    print(
        " NUSHX — AI PDF ASSISTANT"
    )

    print("=" * 55)

    print(
        " Server: http://127.0.0.1:5000"
    )

    print(
        " Pipeline: PDF → Chunking → "
        "TF-IDF → Retrieval → Groq"
    )

    print("=" * 55)

    print()

    app.run(
        debug=True,
        host="127.0.0.1",
        port=5000
    )