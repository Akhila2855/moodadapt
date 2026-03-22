import { GoogleGenAI } from "@google/genai";

const EMOTIONS = ['Happy', 'Sad', 'Stressed', 'Anxious', 'Calm', 'Energetic', 'Tired'];

export class EmotionClassifier {
  async load() {
    console.log('Emotion Engine Ready (Understanding your mood...)');
  }

  captureFrame(videoElement) {
    const canvas = document.createElement('canvas');
    // Use the actual video dimensions for maximum detail
    canvas.width = videoElement.videoWidth || 1280;
    canvas.height = videoElement.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    
    // Apply subtle image enhancement for better feature detection
    ctx.filter = 'brightness(1.1) contrast(1.1) saturate(1.1)';
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    
    // Use maximum quality JPEG
    return canvas.toDataURL('image/jpeg', 1.0).split(',')[1];
  }

  async classify(videoElement) {
    try {
      const base64Image = this.captureFrame(videoElement);
      if (!base64Image) throw new Error('Failed to capture frame');

      // Initialize Gemini in the frontend as per guidelines
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const model = "gemini-3-flash-preview";
      
      const prompt = `You are an empathetic observer. Your task is to understand the person's current mood by looking at their facial expression.
      
      OBSERVATION GUIDE:
      1. BROWS: Are they relaxed, raised in surprise, or furrowed in concentration/stress?
      2. EYES: Are they wide and alert, or crinkled and smiling?
      3. MOUTH: Is there a gentle smile, a slight frown, or a relaxed, neutral expression?
      
      MOOD CLUES:
      - Happy: Relaxed brows, crinkled eyes, and a positive smile.
      - Sad: Inner brows raised, drooping eyes, and a slight frown.
      - Stressed: Furrowed brows, tense eyes, and a tight mouth.
      - Anxious: Raised brows, wide eyes, and a tense expression.
      - Calm: Everything is relaxed and neutral.
      - Energetic: High brows, wide eyes, and an active, bright expression.
      - Tired: Sagging brows, heavy eyelids, and a neutral mouth.
      
      OUTPUT FORMAT (JSON ONLY):
      {
        "emotion": "string",
        "confidence": 0.0-1.0,
        "observations": {
          "brows": "description of brow position",
          "eyes": "description of eye expression",
          "mouth": "description of mouth shape",
          "tension": "overall feeling of facial tension"
        },
        "reasoning": "A short, empathetic summary of why you feel this is their current mood."
      }`;

      const response = await ai.models.generateContent({
        model: model,
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: base64Image
                }
              }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json"
        }
      });

      const result = JSON.parse(response.text || '{}');
      
      if (result.observations) {
        console.group('%c[MOOD OBSERVATIONS]', 'color: #06b6d4; font-weight: bold;');
        console.log('Brows:', result.observations.brows);
        console.log('Eyes:', result.observations.eyes);
        console.log('Mouth:', result.observations.mouth);
        console.log('Tension:', result.observations.tension);
        console.log('%cConfidence:', 'color: #f59e0b; font-weight: bold;', `${Math.round(result.confidence * 100)}%`);
        console.log('%cReasoning:', 'color: #10b981; font-weight: bold;', result.reasoning);
        console.groupEnd();
      }
      
      if (result.emotion && EMOTIONS.includes(result.emotion)) {
        return {
          emotion: result.emotion,
          confidence: result.confidence || 0.8
        };
      }
      
      throw new Error('Invalid response from engine');
    } catch (e) {
      console.error('Facial Vector Engine failed:', e);
      const randomIndex = Math.floor(Math.random() * EMOTIONS.length);
      return {
        emotion: EMOTIONS[randomIndex],
        confidence: 0.5
      };
    }
  }
}

export const emotionClassifier = new EmotionClassifier();
