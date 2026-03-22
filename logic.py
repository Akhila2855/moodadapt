import sys
import json
import random

def get_q_value(q_table, state, action):
    return q_table.get(f"{state}:{action}", 0.0)

def update_q_value(q_table, state, action, reward, alpha=0.1):
    current_q = get_q_value(q_table, state, action)
    new_q = current_q + alpha * (reward - current_q)
    q_table[f"{state}:{action}"] = new_q
    return q_table

def get_recommendations(mood, all_activities, q_table, epsilon=0.2):
    mood_activities = [a for a in all_activities if mood in a.get('moodTags', [])]
    
    if not mood_activities:
        return []

    # Exploration vs Exploitation
    if random.random() < epsilon:
        # Explore: Randomly pick 5
        selected = random.sample(mood_activities, min(len(mood_activities), 5))
    else:
        # Exploit: Pick based on Q-values
        activities_with_q = []
        for a in mood_activities:
            q_val = get_q_value(q_table, mood, a['id'])
            activities_with_q.append((a, q_val))
        
        # Sort by Q-value descending
        activities_with_q.sort(key=lambda x: x[1], reverse=True)
        selected = [item[0] for item in activities_with_q[:5]]
    
    return selected

def main():
    try:
        # Read input from stdin
        input_data = json.load(sys.stdin)
        
        task = input_data.get('task')
        payload = input_data.get('payload', {})
        
        if task == 'recommend':
            mood = payload.get('mood')
            all_activities = payload.get('all_activities', [])
            q_table = payload.get('q_table', {})
            
            recommendations = get_recommendations(mood, all_activities, q_table)
            
            result = {
                'status': 'success',
                'recommendations': recommendations
            }
        elif task == 'update_q':
            mood = payload.get('mood')
            activity_id = payload.get('activity_id')
            reward = payload.get('reward')
            q_table = payload.get('q_table', {})
            
            updated_q_table = update_q_value(q_table, mood, activity_id, reward)
            
            result = {
                'status': 'success',
                'q_table': updated_q_table
            }
        else:
            result = {
                'status': 'error',
                'message': f'Unknown task: {task}'
            }
            
        # Output JSON to stdout
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({
            'status': 'error',
            'message': str(e)
        }))

if __name__ == '__main__':
    main()
