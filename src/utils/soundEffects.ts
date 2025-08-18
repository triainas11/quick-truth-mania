// Sound and vibration effects system
export class SoundEffects {
  private audioContext: AudioContext | null = null;
  private soundEnabled: boolean = true;

  constructor(enabled: boolean = true) {
    this.soundEnabled = enabled;
    this.initAudioContext();
  }

  private initAudioContext() {
    if (typeof window !== 'undefined' && window.AudioContext) {
      try {
        this.audioContext = new AudioContext();
      } catch (e) {
        console.warn('AudioContext not supported');
      }
    }
  }

  private playTone(frequency: number, duration: number, volume: number = 0.1) {
    if (!this.soundEnabled || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  private vibrate(pattern: number[]) {
    if (!this.soundEnabled || !navigator.vibrate) return;
    
    try {
      navigator.vibrate(pattern);
    } catch (e) {
      console.warn('Vibration not supported');
    }
  }

  // Correct answer sound
  playCorrect() {
    this.playTone(523.25, 0.2); // C5
    this.vibrate([100]);
  }

  // Wrong answer sound
  playWrong() {
    this.playTone(220, 0.4); // A3
    this.vibrate([200, 100, 200]);
  }

  // Streak bonus sound
  playStreak() {
    // Play a chord progression
    setTimeout(() => this.playTone(261.63, 0.15), 0);   // C4
    setTimeout(() => this.playTone(329.63, 0.15), 50);  // E4
    setTimeout(() => this.playTone(392.00, 0.15), 100); // G4
    setTimeout(() => this.playTone(523.25, 0.25), 150); // C5
    this.vibrate([50, 50, 50, 50, 150]);
  }

  // Game start sound
  playGameStart() {
    this.playTone(440, 0.3); // A4
  }

  // Time running out warning
  playTimeWarning() {
    this.playTone(880, 0.1); // A5
    this.vibrate([50]);
  }

  setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }
}

export const soundEffects = new SoundEffects();