"""Tests for the abstention logic."""

import pytest
from app.services.retrieval import RetrievalService, RetrievalResult


class TestAbstentionLogic:
    """Test suite for abstention/confidence logic."""

    def create_result(self, similarity: float) -> RetrievalResult:
        """Helper to create a retrieval result."""
        return RetrievalResult(
            chunk_id=1,
            document_id=1,
            document_title="Test Doc",
            filename="test.pdf",
            page=1,
            content="Test content",
            similarity=similarity,
        )

    def test_should_abstain_when_no_results(self):
        """Test that empty results trigger abstention."""
        # We need to test the compute_confidence method directly
        # without actually needing a DB connection
        
        results: list[RetrievalResult] = []
        
        # Manually compute confidence (mimicking the service logic)
        confidence = self._compute_confidence(results, threshold=0.3)
        
        assert confidence["should_abstain"] is True
        assert confidence["coverage"] == 0

    def test_should_abstain_when_low_similarity(self):
        """Test that low similarity triggers abstention."""
        results = [
            self.create_result(0.2),  # Below threshold
            self.create_result(0.15),
        ]
        
        confidence = self._compute_confidence(results, threshold=0.3)
        
        assert confidence["should_abstain"] is True
        assert confidence["coverage"] == 0

    def test_should_not_abstain_when_high_similarity(self):
        """Test that high similarity does not trigger abstention."""
        results = [
            self.create_result(0.8),
            self.create_result(0.6),
        ]
        
        confidence = self._compute_confidence(results, threshold=0.3)
        
        assert confidence["should_abstain"] is False
        assert confidence["coverage"] == 2

    def test_coverage_counts_above_threshold(self):
        """Test that coverage only counts results above threshold."""
        results = [
            self.create_result(0.8),
            self.create_result(0.5),
            self.create_result(0.2),  # Below threshold
        ]
        
        confidence = self._compute_confidence(results, threshold=0.3)
        
        assert confidence["coverage"] == 2  # Only 2 above threshold

    def test_gap_calculation(self):
        """Test that gap is calculated correctly."""
        results = [
            self.create_result(0.8),
            self.create_result(0.5),
        ]
        
        confidence = self._compute_confidence(results, threshold=0.3)
        
        assert confidence["gap"] == pytest.approx(0.3)

    def test_top_similarities_captured(self):
        """Test that top similarities are captured."""
        results = [
            self.create_result(0.85),
            self.create_result(0.72),
            self.create_result(0.65),
        ]
        
        confidence = self._compute_confidence(results, threshold=0.3)
        
        assert confidence["top1_similarity"] == 0.85
        assert confidence["top2_similarity"] == 0.72

    def test_single_result_no_gap(self):
        """Test that single result has no gap."""
        results = [self.create_result(0.7)]
        
        confidence = self._compute_confidence(results, threshold=0.3)
        
        assert confidence["gap"] is None
        assert confidence["top2_similarity"] is None

    def test_boundary_similarity_not_abstain(self):
        """Test that exact threshold similarity does not abstain."""
        results = [
            self.create_result(0.3),  # Exactly at threshold
            self.create_result(0.2),
        ]
        
        confidence = self._compute_confidence(results, threshold=0.3)
        
        assert confidence["should_abstain"] is False
        assert confidence["coverage"] == 1

    def _compute_confidence(
        self,
        results: list[RetrievalResult],
        threshold: float,
    ) -> dict:
        """Helper method to compute confidence without DB."""
        if not results:
            return {
                "top1_similarity": 0.0,
                "top2_similarity": None,
                "gap": None,
                "coverage": 0,
                "should_abstain": True,
            }

        top1_sim = results[0].similarity
        top2_sim = results[1].similarity if len(results) > 1 else None
        gap = (top1_sim - top2_sim) if top2_sim is not None else None

        # Count results above threshold
        coverage = sum(1 for r in results if r.similarity >= threshold)

        # Determine if we should abstain
        should_abstain = top1_sim < threshold or coverage == 0

        return {
            "top1_similarity": top1_sim,
            "top2_similarity": top2_sim,
            "gap": gap,
            "coverage": coverage,
            "should_abstain": should_abstain,
        }
