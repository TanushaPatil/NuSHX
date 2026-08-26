"""
NUSHX — Text Chunking
Splits extracted PDF text into manageable chunks.
"""


def create_chunks(text, chunk_size=800, overlap=150):
    """
    Split text into overlapping chunks.

    Args:
        text (str): Extracted PDF text.
        chunk_size (int): Maximum characters per chunk.
        overlap (int): Number of overlapping characters.

    Returns:
        list: List of text chunks.
    """

    if not text or not text.strip():
        return []

    text = " ".join(text.split())

    chunks = []

    start = 0
    text_length = len(text)

    while start < text_length:

        end = start + chunk_size

        chunk = text[start:end].strip()

        if chunk:
            chunks.append(chunk)

        if end >= text_length:
            break

        start = end - overlap

    return chunks