export const activities = [
  {
    id: 'box-breathing',
    name: 'Box Breathing',
    description: 'A simple technique to calm the nervous system.',
    duration: 5,
    energy: 'Low',
    moodTags: ['Stressed', 'Anxious', 'Tired'],
    steps: [
      'Inhale for 4 seconds.',
      'Hold for 4 seconds.',
      'Exhale for 4 seconds.',
      'Hold for 4 seconds.',
      'Repeat 4 times.'
    ]
  },
  {
    id: 'power-walk',
    name: 'Power Walk',
    description: 'A quick burst of energy to clear your mind.',
    duration: 15,
    energy: 'High',
    moodTags: ['Sad', 'Tired', 'Calm'],
    steps: [
      'Step outside or find a clear space.',
      'Walk at a brisk pace for 10 minutes.',
      'Focus on your breathing and the movement of your arms.',
      'Cool down for 5 minutes.'
    ]
  },
  {
    id: 'gratitude-journal',
    name: 'Gratitude Journaling',
    description: 'Reflect on the positive aspects of your day.',
    duration: 10,
    energy: 'Low',
    moodTags: ['Sad', 'Anxious', 'Stressed'],
    steps: [
      'Find a quiet spot with a pen and paper.',
      'Write down three things you are grateful for today.',
      'Explain why each one makes you feel good.',
      'Read them back to yourself slowly.'
    ]
  },
  {
    id: 'dance-party',
    name: 'Solo Dance Party',
    description: 'Shake off the stress with your favorite tunes.',
    duration: 5,
    energy: 'High',
    moodTags: ['Sad', 'Tired', 'Energetic'],
    steps: [
      'Put on an upbeat song.',
      'Move your body freely without judgment.',
      'Dance like nobody is watching!',
      'Continue for at least one full song.'
    ]
  },
  {
    id: 'mindful-tea',
    name: 'Mindful Tea Drinking',
    description: 'Focus entirely on the sensory experience of tea.',
    duration: 10,
    energy: 'Low',
    moodTags: ['Anxious', 'Stressed', 'Tired'],
    steps: [
      'Brew a cup of your favorite herbal tea.',
      'Feel the warmth of the cup in your hands.',
      'Smell the aroma deeply.',
      'Take small sips, noticing the flavor and temperature.'
    ]
  },
  {
    id: 'progressive-muscle-relaxation',
    name: 'Muscle Relaxation',
    description: 'Tense and release muscle groups to reduce physical stress.',
    duration: 15,
    energy: 'Low',
    moodTags: ['Stressed', 'Anxious'],
    steps: [
      'Lie down in a comfortable position.',
      'Starting from your toes, tense each muscle group for 5 seconds.',
      'Release suddenly and feel the tension melt away.',
      'Work your way up to your face.'
    ]
  },
  {
    id: 'nature-sounds',
    name: 'Nature Sound Immersion',
    description: 'Listen to high-quality recordings of nature.',
    duration: 20,
    energy: 'Low',
    moodTags: ['Stressed', 'Anxious', 'Tired'],
    steps: [
      'Put on headphones.',
      'Close your eyes.',
      'Listen to sounds of rain, forest, or ocean waves.',
      'Visualize yourself in that environment.'
    ]
  },
  {
    id: 'stretching-flow',
    name: 'Gentle Stretching',
    description: 'Release physical tension in your body.',
    duration: 10,
    energy: 'Medium',
    moodTags: ['Tired', 'Stressed', 'Calm'],
    steps: [
      'Reach for the sky and hold.',
      'Touch your toes gently.',
      'Roll your shoulders back and forth.',
      'Twist your torso slowly from side to side.'
    ]
  },
  {
    id: 'visualization',
    name: 'Happy Place Visualization',
    description: 'Mentally visit a place where you feel safe and happy.',
    duration: 10,
    energy: 'Low',
    moodTags: ['Sad', 'Anxious', 'Stressed'],
    steps: [
      'Close your eyes and breathe deeply.',
      'Imagine a place where you feel completely at peace.',
      'Notice the colors, sounds, and smells of this place.',
      'Stay there for a few minutes.'
    ]
  },
  {
    id: 'quick-clean',
    name: '5-Minute Tidy',
    description: 'Organize a small part of your environment.',
    duration: 5,
    energy: 'Medium',
    moodTags: ['Anxious', 'Stressed', 'Sad'],
    steps: [
      'Pick one small area (like a desk or a drawer).',
      'Set a timer for 5 minutes.',
      'Clean and organize as much as you can.',
      'Notice the sense of accomplishment.'
    ]
  },
  ...Array.from({ length: 140 }).map((_, i) => ({
    id: `activity-${i + 11}`,
    name: `Activity ${i + 11}`,
    description: 'A helpful activity to improve your mood.',
    duration: 10 + (i % 20),
    energy: (['Low', 'Medium', 'High'][i % 3]),
    moodTags: ['Happy', 'Sad', 'Stressed', 'Anxious', 'Calm', 'Energetic', 'Tired', 'Focused', 'Relaxed', 'Inspired', 'Lonely', 'Bored', 'Angry', 'Peaceful', 'Grateful'].slice(i % 10, (i % 10) + 5),
    steps: [`Step 1 for activity ${i + 11}`, `Step 2 for activity ${i + 11}`, `Step 3 for activity ${i + 11}`]
  }))
];
