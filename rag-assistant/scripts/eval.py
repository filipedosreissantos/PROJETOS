#!/usr/bin/env python3
"""
Evaluation script for RAG Assistant.

This script runs a set of test questions against the API and collects metrics.

Usage:
    python scripts/eval.py [--api-url URL] [--output FILE]

Example:
    python scripts/eval.py --api-url http://localhost:8000 --output results.csv
"""

import argparse
import csv
import json
import sys
import time
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path

import httpx


@dataclass
class EvalResult:
    """Result of evaluating a single question."""

    question: str
    answer: str
    expected_abstain: bool
    actual_abstain: bool
    top1_similarity: float
    citation_count: int
    latency_ms: float
    cost_usd: float
    abstain_correct: bool


def load_questions(filepath: str) -> list[dict]:
    """Load questions from JSONL file."""
    questions = []
    with open(filepath, "r", encoding="utf-8") as f:
        for line in f:
            if line.strip():
                questions.append(json.loads(line))
    return questions


def run_evaluation(
    api_url: str,
    questions: list[dict],
) -> list[EvalResult]:
    """Run evaluation against the API."""
    results = []

    with httpx.Client(timeout=60.0) as client:
        for i, q in enumerate(questions, 1):
            print(f"[{i}/{len(questions)}] Evaluating: {q['question'][:50]}...")

            start_time = time.time()

            try:
                response = client.post(
                    f"{api_url}/api/chat",
                    json={"message": q["question"]},
                )
                response.raise_for_status()
                data = response.json()

                latency = (time.time() - start_time) * 1000

                result = EvalResult(
                    question=q["question"],
                    answer=data["answer"][:200] + "..." if len(data["answer"]) > 200 else data["answer"],
                    expected_abstain=q.get("expected_abstain", False),
                    actual_abstain=data["confidence"]["should_abstain"],
                    top1_similarity=data["confidence"]["top1_similarity"],
                    citation_count=len(data["citations"]),
                    latency_ms=latency,
                    cost_usd=data["metrics"]["cost_usd_estimated"],
                    abstain_correct=q.get("expected_abstain", False) == data["confidence"]["should_abstain"],
                )
                results.append(result)

            except Exception as e:
                print(f"  Error: {e}")
                results.append(
                    EvalResult(
                        question=q["question"],
                        answer=f"ERROR: {e}",
                        expected_abstain=q.get("expected_abstain", False),
                        actual_abstain=False,
                        top1_similarity=0.0,
                        citation_count=0,
                        latency_ms=0.0,
                        cost_usd=0.0,
                        abstain_correct=False,
                    )
                )

            # Small delay between requests
            time.sleep(0.5)

    return results


def print_summary(results: list[EvalResult]) -> None:
    """Print evaluation summary."""
    total = len(results)
    abstain_count = sum(1 for r in results if r.actual_abstain)
    abstain_rate = (abstain_count / total * 100) if total > 0 else 0
    abstain_accuracy = sum(1 for r in results if r.abstain_correct) / total * 100 if total > 0 else 0

    avg_latency = sum(r.latency_ms for r in results) / total if total > 0 else 0
    avg_citations = sum(r.citation_count for r in results) / total if total > 0 else 0
    total_cost = sum(r.cost_usd for r in results)

    print("\n" + "=" * 60)
    print("EVALUATION SUMMARY")
    print("=" * 60)
    print(f"Total questions:        {total}")
    print(f"Abstention rate:        {abstain_rate:.1f}% ({abstain_count}/{total})")
    print(f"Abstention accuracy:    {abstain_accuracy:.1f}%")
    print(f"Average latency:        {avg_latency:.0f}ms")
    print(f"Average citations:      {avg_citations:.1f}")
    print(f"Total cost:             ${total_cost:.5f}")
    print("=" * 60)


def save_results_csv(results: list[EvalResult], filepath: str) -> None:
    """Save results to CSV file."""
    with open(filepath, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "question",
            "answer",
            "expected_abstain",
            "actual_abstain",
            "abstain_correct",
            "top1_similarity",
            "citation_count",
            "latency_ms",
            "cost_usd",
        ])
        for r in results:
            writer.writerow([
                r.question,
                r.answer,
                r.expected_abstain,
                r.actual_abstain,
                r.abstain_correct,
                r.top1_similarity,
                r.citation_count,
                r.latency_ms,
                r.cost_usd,
            ])
    print(f"\nResults saved to: {filepath}")


def save_results_json(results: list[EvalResult], filepath: str) -> None:
    """Save results to JSON file."""
    data = {
        "timestamp": datetime.now().isoformat(),
        "total_questions": len(results),
        "results": [
            {
                "question": r.question,
                "answer": r.answer,
                "expected_abstain": r.expected_abstain,
                "actual_abstain": r.actual_abstain,
                "abstain_correct": r.abstain_correct,
                "top1_similarity": r.top1_similarity,
                "citation_count": r.citation_count,
                "latency_ms": r.latency_ms,
                "cost_usd": r.cost_usd,
            }
            for r in results
        ],
    }
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"Results saved to: {filepath}")


def main():
    parser = argparse.ArgumentParser(
        description="Evaluate RAG Assistant with test questions"
    )
    parser.add_argument(
        "--api-url",
        default="http://localhost:8000",
        help="Base URL of the RAG Assistant API",
    )
    parser.add_argument(
        "--questions",
        default="data/eval_questions.jsonl",
        help="Path to questions JSONL file",
    )
    parser.add_argument(
        "--output",
        default="data/eval_results.csv",
        help="Output file path (CSV or JSON based on extension)",
    )

    args = parser.parse_args()

    # Check questions file exists
    questions_path = Path(args.questions)
    if not questions_path.exists():
        print(f"Error: Questions file not found: {args.questions}")
        sys.exit(1)

    print(f"Loading questions from: {args.questions}")
    questions = load_questions(args.questions)
    print(f"Loaded {len(questions)} questions")

    print(f"\nRunning evaluation against: {args.api_url}")
    results = run_evaluation(args.api_url, questions)

    print_summary(results)

    # Save results
    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    if args.output.endswith(".json"):
        save_results_json(results, args.output)
    else:
        save_results_csv(results, args.output)


if __name__ == "__main__":
    main()
