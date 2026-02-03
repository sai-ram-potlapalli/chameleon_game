// Sound utilities for the game
// Using Web Audio API for simple sound effects

class SoundManager {
  constructor() {
    this.audioContext = null;
    this.enabled = true;
  }

  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return this;
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  // Create a simple beep/tone
  playTone(frequency = 440, duration = 0.1, type = 'sine') {
    if (!this.enabled || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Sound effects
  playClick() {
    this.playTone(600, 0.05, 'square');
  }

  playSuccess() {
    this.playTone(523, 0.1, 'sine'); // C5
    setTimeout(() => this.playTone(659, 0.1, 'sine'), 100); // E5
    setTimeout(() => this.playTone(784, 0.15, 'sine'), 200); // G5
  }

  playError() {
    this.playTone(200, 0.2, 'sawtooth');
  }

  playNotification() {
    this.playTone(880, 0.1, 'sine');
    setTimeout(() => this.playTone(1100, 0.1, 'sine'), 100);
  }

  playDiceRoll() {
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        this.playTone(200 + Math.random() * 400, 0.05, 'square');
      }, i * 50);
    }
  }

  playVoteReveal() {
    this.playTone(300, 0.2, 'sine');
    setTimeout(() => this.playTone(400, 0.2, 'sine'), 200);
    setTimeout(() => this.playTone(500, 0.3, 'sine'), 400);
  }

  playWin() {
    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    notes.forEach((note, i) => {
      setTimeout(() => this.playTone(note, 0.2, 'sine'), i * 150);
    });
  }

  playLose() {
    const notes = [400, 350, 300, 250];
    notes.forEach((note, i) => {
      setTimeout(() => this.playTone(note, 0.2, 'sawtooth'), i * 200);
    });
  }

  playTick() {
    this.playTone(800, 0.02, 'square');
  }

  playTimerWarning() {
    this.playTone(600, 0.1, 'square');
  }
}

// Singleton instance
const soundManager = new SoundManager();

export default soundManager;

// Hook for components
export function useSound() {
  const init = () => soundManager.init();
  const setEnabled = (enabled) => soundManager.setEnabled(enabled);

  return {
    init,
    setEnabled,
    playClick: () => soundManager.playClick(),
    playSuccess: () => soundManager.playSuccess(),
    playError: () => soundManager.playError(),
    playNotification: () => soundManager.playNotification(),
    playDiceRoll: () => soundManager.playDiceRoll(),
    playVoteReveal: () => soundManager.playVoteReveal(),
    playWin: () => soundManager.playWin(),
    playLose: () => soundManager.playLose(),
    playTick: () => soundManager.playTick(),
    playTimerWarning: () => soundManager.playTimerWarning(),
  };
}
