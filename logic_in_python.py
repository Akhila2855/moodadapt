import sys
import json
import random

# This is the actual logic running on the server to power the AI recommendations.
# It uses Q-Learning to adapt to your preferences over time.

def get_q_value(q_table, state, action):
    """Retrieve the Q-value for a specific state-action pair."""
    return q_table.get(f"{state}:{action}", 0.0)

def update_q_value(q_table, state, action, reward, alpha=0.1):
    """Update the Q-value using the Q-Learning formula."""
    current_q = get_q_value(q_table, state, action)
    # Q(s,a) = Q(s,a) + alpha * (reward - Q(s,a))
    new_q = current_q + alpha * (reward - current_q)
    q_table[f"{state}:{action}"] = new_q
    return q_table

def get_recommendations(mood, all_activities, q_table, epsilon=0.2):
    """Get activity recommendations based on the current mood and learned preferences."""
    mood_activities = [a for a in all_activities if mood in a.get('moodTags', [])]
    
    if not mood_activities:
        return []

    # Exploration vs Exploitation (Epsilon-Greedy)
    if random.random() < epsilon:
        # Explore: Randomly pick 5 to discover new preferences
        selected = random.sample(mood_activities, min(len(mood_activities), 5))
    else:
        # Exploit: Pick based on highest learned Q-values
        activities_with_q = []
        for a in mood_activities:
            q_val = get_q_value(q_table, mood, a['id'])
            activities_with_q.append((a, q_val))
        
        # Sort by Q-value descending
        activities_with_q.sort(key=lambda x: x[1], reverse=True)
        selected = [item[0] for item in activities_with_q[:5]]
    
    return selected

# The server calls this script with a JSON payload containing the task and data.
# Example payload: {"task": "recommend", "payload": {"mood": "Stressed", "all_activities": [...], "q_table": {...}}}
