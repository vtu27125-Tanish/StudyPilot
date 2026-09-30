import math

class BKTModel:
    """
    Bayesian Knowledge Tracing (BKT) Model implementation.
    Updates the probability that a student knows a skill based on their response.
    """
    def __init__(self, p_known=0.1, p_slip=0.1, p_guess=0.2, p_transit=0.1):
        self.p_known = p_known
        self.p_slip = p_slip
        self.p_guess = p_guess
        self.p_transit = p_transit

    def update_mastery(self, is_correct: bool) -> float:
        """
        Updates the probability of knowing the skill given a correct or incorrect response.
        """
        if is_correct:
            # P(L | correct) = (P(correct | L) * P(L)) / P(correct)
            p_correct = (1 - self.p_slip) * self.p_known + self.p_guess * (1 - self.p_known)
            p_known_given_obs = ((1 - self.p_slip) * self.p_known) / p_correct
        else:
            # P(L | incorrect) = (P(incorrect | L) * P(L)) / P(incorrect)
            p_incorrect = self.p_slip * self.p_known + (1 - self.p_guess) * (1 - self.p_known)
            p_known_given_obs = (self.p_slip * self.p_known) / p_incorrect

        # P(L_t) = P(L_{t-1} | obs) + (1 - P(L_{t-1} | obs)) * P(transit)
        new_p_known = p_known_given_obs + (1 - p_known_given_obs) * self.p_transit
        self.p_known = new_p_known
        return self.p_known

def calculate_forgetting_curve(mastery: float, days_since_review: int, memory_strength: float = 1.0) -> float:
    """
    Applies the forgetting curve: R = e^(-t/S)
    t is time (days), S is memory strength.
    """
    return mastery * math.exp(-days_since_review / memory_strength)
