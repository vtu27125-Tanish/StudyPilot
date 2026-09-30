import json
import os
import pandas as pd
from backend.learner_model.bkt import BKTModel

def simulate_students():
    print("Running Simulated Students Evaluation...")
    
    profiles = {
        "weak_student": {"p_known": 0.05, "p_slip": 0.3, "p_guess": 0.1, "correct_prob": 0.3},
        "avg_student": {"p_known": 0.2, "p_slip": 0.1, "p_guess": 0.2, "correct_prob": 0.6},
        "strong_student": {"p_known": 0.5, "p_slip": 0.05, "p_guess": 0.2, "correct_prob": 0.85},
    }
    
    results = []
    
    for name, params in profiles.items():
        bkt = BKTModel(p_known=params["p_known"], p_slip=params["p_slip"], p_guess=params["p_guess"])
        
        mastery_history = [bkt.p_known]
        import random
        
        for session in range(1, 6): # 5 sessions
            # Simulate a quiz with 5 questions
            for q in range(5):
                is_correct = random.random() < params["correct_prob"]
                bkt.update_mastery(is_correct)
            
            mastery_history.append(bkt.p_known)
            
        results.append({
            "student_profile": name,
            "initial_mastery": mastery_history[0],
            "final_mastery": mastery_history[-1],
            "history": mastery_history
        })
        
    df = pd.DataFrame(results)
    os.makedirs("../../eval/results", exist_ok=True)
    df.to_csv("../../eval/results/simulated_students.csv", index=False)
    print("Simulation complete. Results saved.")

if __name__ == "__main__":
    simulate_students()
