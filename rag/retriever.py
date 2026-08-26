"""
NUSHX — Document Retriever
Uses TF-IDF and cosine similarity to retrieve
the most relevant PDF chunks for a user question.
"""

from sklearn.metrics.pairwise import cosine_similarity

from rag.embeddings import TfidfEmbedder


class Retriever:
    """Retrieves relevant document chunks using cosine similarity."""

    def __init__(self, chunks, top_k=3):
        self.chunks = chunks
        self.top_k = top_k

        self.embedder = TfidfEmbedder()

        # Create TF-IDF vectors for all document chunks
        self.vectors = self.embedder.fit_transform(chunks)

    def retrieve(self, query):
        """
        Find the most relevant chunks for a question.

        Args:
            query (str): User's question.

        Returns:
            list: Relevant document chunks.
        """

        if not query or not query.strip():
            return []

        if self.vectors is None:
            return []

        # Convert question into TF-IDF vector
        query_vector = self.embedder.transform(query)

        if query_vector is None:
            return []

        # Calculate cosine similarity
        similarities = cosine_similarity(
            query_vector,
            self.vectors
        )[0]

        # Get indexes of highest similarity scores
        ranked_indexes = similarities.argsort()[::-1]

        # Select top relevant chunks
        results = []

        for index in ranked_indexes[:self.top_k]:

            score = float(similarities[index])

            results.append({
                "text": self.chunks[index],
                "score": score
            })

        return results