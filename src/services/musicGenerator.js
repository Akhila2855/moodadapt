// ACE-Step 1.5 Simulation using Web Audio API and procedural generation
// Real transformer models for music are large, so we implement a 
// mood-adaptive procedural generator that follows the "transformer" 
// prompt logic requested.

export class MusicGenerator {
  constructor() {
    this.audioCtx = null;
    this.oscillator = null;
    this.gainNode = null;
    this.isPlaying = false;
  }

  init() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  generateAndPlay(mood) {
    this.init();
    if (!this.audioCtx) return;

    this.stop();

    this.oscillator = this.audioCtx.createOscillator();
    this.gainNode = this.audioCtx.createGain();

    const now = this.audioCtx.currentTime;

    // Mood-based parameters (simulating transformer output)
    switch (mood) {
      case 'Stressed':
        this.oscillator.type = 'sine';
        this.oscillator.frequency.setValueAtTime(220, now); // Low, calming
        this.gainNode.gain.setValueAtTime(0.1, now);
        break;
      case 'Happy':
        this.oscillator.type = 'triangle';
        this.oscillator.frequency.setValueAtTime(440, now); // Upbeat
        this.gainNode.gain.setValueAtTime(0.2, now);
        break;
      case 'Sad':
        this.oscillator.type = 'sine';
        this.oscillator.frequency.setValueAtTime(196, now); // Melancholic
        this.gainNode.gain.setValueAtTime(0.1, now);
        break;
      case 'Anxious':
        this.oscillator.type = 'sine';
        this.oscillator.frequency.setValueAtTime(330, now);
        this.gainNode.gain.setValueAtTime(0.05, now);
        break;
      case 'Energetic':
        this.oscillator.type = 'square';
        this.oscillator.frequency.setValueAtTime(523, now);
        this.gainNode.gain.setValueAtTime(0.15, now);
        break;
      case 'Tired':
        this.oscillator.type = 'sine';
        this.oscillator.frequency.setValueAtTime(164, now);
        this.gainNode.gain.setValueAtTime(0.08, now);
        break;
      default:
        this.oscillator.type = 'sine';
        this.oscillator.frequency.setValueAtTime(440, now);
        this.gainNode.gain.setValueAtTime(0.1, now);
    }

    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(this.audioCtx.destination);

    this.oscillator.start();
    this.isPlaying = true;
  }

  stop() {
    if (this.oscillator) {
      this.oscillator.stop();
      this.oscillator.disconnect();
      this.oscillator = null;
    }
    if (this.gainNode) {
      this.gainNode.disconnect();
      this.gainNode = null;
    }
    this.isPlaying = false;
  }

  getPlayingStatus() {
    return this.isPlaying;
  }
}

export const musicGenerator = new MusicGenerator();
