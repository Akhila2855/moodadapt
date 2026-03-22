import { activities } from '../data/activities';
import { initDB, getQValue, updateQValue } from './db';

export async function getRecommendations(mood) {
  const db = await initDB();
  const allQEntries = await db.getAll('q_table');
  
  // Convert IndexedDB q_table to a simple object for Python
  const qTableObj = {};
  allQEntries.forEach(entry => {
    qTableObj[`${entry.state}:${entry.action}`] = entry.value;
  });

  try {
    const response = await fetch('/api/ai/logic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        task: 'recommend',
        payload: {
          mood,
          all_activities: activities,
          q_table: qTableObj
        }
      })
    });

    const result = await response.json();
    if (result.status === 'success') {
      return result.recommendations;
    }
    throw new Error(result.message || 'AI Recommendation failed');
  } catch (error) {
    console.error('Python AI Logic Error, falling back to JS:', error);
    // Fallback to simple JS logic if Python fails
    return activities.filter(a => a.moodTags.includes(mood)).slice(0, 5);
  }
}

export async function learnFromActivity(mood, activityId, reward) {
  const db = await initDB();
  const allQEntries = await db.getAll('q_table');
  
  const qTableObj = {};
  allQEntries.forEach(entry => {
    qTableObj[`${entry.state}:${entry.action}`] = entry.value;
  });

  try {
    const response = await fetch('/api/ai/logic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        task: 'update_q',
        payload: {
          mood,
          activity_id: activityId,
          reward,
          q_table: qTableObj
        }
      })
    });

    const result = await response.json();
    if (result.status === 'success') {
      // Update IndexedDB with the new Q-table from Python
      const updatedQTable = result.q_table;
      for (const [key, value] of Object.entries(updatedQTable)) {
        const [state, action] = key.split(':');
        await updateQValue(state, action, value);
      }
    }
  } catch (error) {
    console.error('Python AI Logic Error during learning:', error);
  }
}
