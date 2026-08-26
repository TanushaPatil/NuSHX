"""
NUSHX — Groq LLM
Handles communication with the Groq API.
"""

from groq import Groq


def generate_answer(api_key, question, context):
    """
    Generate an answer using Groq based on retrieved PDF context.

    Args:
        api_key (str): Groq API key provided by the user.
        question (str): User's question.
        context (str): Relevant PDF context.

    Returns:
        str: AI-generated answer.
    """

    if not api_key or not api_key.strip():
        raise ValueError("Groq API key is required.")

    if not question or not question.strip():
        raise ValueError("Question cannot be empty.")

    if not context or not context.strip():
        raise ValueError("No relevant context was found in the document.")

    client = Groq(api_key=api_key.strip())

    prompt = f"""
You are NUSHX, an AI PDF assistant.

Answer the user's question using ONLY the information
provided in the document context below.

If the answer cannot be found in the context, clearly say:

"I couldn't find the answer in the uploaded document."

Do not invent facts or use information that is not present
in the provided context.

Keep the answer clear, accurate, and easy to understand.

DOCUMENT CONTEXT:
{context}

USER QUESTION:
{question}
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a helpful AI assistant that answers "
                    "questions about uploaded documents."
                )
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2,
        max_tokens=700
    )

    return response.choices[0].message.content.strip()