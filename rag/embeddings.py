"""
NUSHX — TF-IDF Embeddings
Converts document chunks and questions into numerical vectors.
"""

from sklearn.feature_extraction.text import TfidfVectorizer


class TfidfEmbedder:
    """Creates TF-IDF vectors for document chunks."""

    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            lowercase=True,
            stop_words="english",
            ngram_range=(1, 2),
            max_features=10000
        )

    def fit_transform(self, chunks):
        """
        Fit the TF-IDF vectorizer and transform document chunks.

        Args:
            chunks (list): List of text chunks.

        Returns:
            TF-IDF matrix.
        """

        if not chunks:
            return None

        return self.vectorizer.fit_transform(chunks)

    def transform(self, text):
        """
        Transform a new question using the fitted vectorizer.

        Args:
            text (str): User question.

        Returns:
            TF-IDF vector.
        """

        if not text or not text.strip():
            return None

        return self.vectorizer.transform([text])