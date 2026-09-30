import json
import os
import pandas as pd
from ragas import evaluate
from ragas.metrics import answer_relevancy, faithfulness, context_precision, context_recall
from datasets import Dataset
from backend.tutor.chat import generate_chat_response

def load_test_set():
    with open("../../eval/test_set.json", "r") as f:
        return json.load(f)

def run_ragas_evaluation():
    print("Running RAGAS Evaluation...")
    test_set = load_test_set()
    
    questions = []
    answers = []
    contexts = []
    ground_truths = []
    
    for item in test_set:
        if item["is_in_scope"]:
            res = generate_chat_response(item["question"])
            questions.append(item["question"])
            answers.append(res["response"])
            
            ctxs = [c["text_snippet"] for c in res["citations"]]
            contexts.append(ctxs if ctxs else ["No context retrieved"])
            ground_truths.append(item["expected_answer"])
            
    data = {
        "question": questions,
        "answer": answers,
        "contexts": contexts,
        "ground_truth": ground_truths
    }
    
    dataset = Dataset.from_dict(data)
    
    # RAGAS evaluation
    result = evaluate(
        dataset,
        metrics=[answer_relevancy, faithfulness, context_precision, context_recall],
    )
    
    df = result.to_pandas()
    os.makedirs("../../eval/results", exist_ok=True)
    df.to_csv("../../eval/results/ragas_metrics.csv")
    print(f"RAGAS Evaluation complete. Results saved.")
    
if __name__ == "__main__":
    run_ragas_evaluation()
