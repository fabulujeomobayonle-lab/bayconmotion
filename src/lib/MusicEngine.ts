// Ambient Lo-Fi & Synthwave procedural audio synthesizer for Baycon Motion Studio
// Pure Web Audio API: Zero external MP3 downloads, 0 latency, 0 broken URLs, 0 copyright risk.

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  genre: string;
  bpm: number;
  durationEstimate: string;
}

export const TRACK_LIST: MusicTrack[] = [
  {
    id: "cyber-horizon",
    title: "NEON HORIZON",
    artist: "BAYCON // SOUND LAB",
    genre: "CHILLWAVE // LO-FI",
    bpm: 116,
    durationEstimate: "∞ LOOP",
  },
  {
    id: "midnight-timeline",
    title: "MIDNIGHT TIMELINE",
    artist: "BAYCON // SOUND LAB",
    genre: "SYNTHWAVE PULSE",
    bpm: 124,
    durationEstimate: "∞ LOOP",
  },
  {
    id: "anamorphic-dreams",
    title: "ANAMORPHIC DREAMS",
    artist: "BAYCON // SOUND LAB",
    genre: "AMBIENT CINEMA",
    bpm: 96,
    durationEstimate: "∞ LOOP",
  },
];

type Listener = () => void;

class MusicEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private vinylNode: AudioBufferSourceNode | null = null;
  private vinylGain: GainNode | null = null;

  private isPlaying: boolean = false;
  private currentTrackIndex: number = 0;
  private volume: number = 0.55;
  private isMuted: boolean = false;

  private timerId: number | null = null;
  private step: number = 0;
  private listeners: Set<Listener> = new Set();
  private frequencyData: Uint8Array = new Uint8Array(32);

  constructor() {
    // Audio context initializes on user gesture
  }

  private initCtx() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();

        // Master Gain
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume * 0.45, this.ctx.currentTime);

        // Warm Lowpass Analog Filter
        this.filterNode = this.ctx.createBiquadFilter();
        this.filterNode.type = "lowpass";
        this.filterNode.frequency.setValueAtTime(2800, this.ctx.currentTime);
        this.filterNode.Q.setValueAtTime(1.5, this.ctx.currentTime);

        // Realtime Analyser for Visualizers & 3D Objects
        this.analyserNode = this.ctx.createAnalyser();
        this.analyserNode.fftSize = 64;
        this.analyserNode.smoothingTimeConstant = 0.85;

        // Routing: Synth -> Filter -> Master -> Analyser -> Destination
        this.filterNode.connect(this.masterGain);
        this.masterGain.connect(this.analyserNode);
        this.analyserNode.connect(this.ctx.destination);

        // Pre-generate vinyl crackle texture
        this.initVinylCrackle();
      }
    }

    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  // Generate subtle warm analog vinyl surface noise
  private initVinylCrackle() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Pink noise filter
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      let sample = (b0 + b1 + b2 + white * 0.5362) * 0.04;

      // Occasional gentle vinyl crackle pops
      if (Math.random() < 0.0006) {
        sample += (Math.random() - 0.5) * 0.6;
      }
      output[i] = sample;
    }

    this.vinylGain = this.ctx.createGain();
    this.vinylGain.gain.setValueAtTime(0.015, this.ctx.currentTime);

    this.vinylNode = this.ctx.createBufferSource();
    this.vinylNode.buffer = buffer;
    this.vinylNode.loop = true;
    this.vinylNode.connect(this.vinylGain);
    this.vinylGain.connect(this.masterGain);
    try {
      this.vinylNode.start();
    } catch {}
  }

  // Play a musical synthesizer note with envelope
  private playSynthVoice(
    freq: number,
    startTime: number,
    duration: number,
    type: OscillatorType = "sawtooth",
    gainAmt: number = 0.12,
    detuneCents: number = 0
  ) {
    if (!this.ctx || !this.filterNode) return;

    const osc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    if (detuneCents !== 0) {
      osc.detune.setValueAtTime(detuneCents, startTime);
    }

    // Soft attack, warm sustain, gentle release envelope
    const attack = 0.06;
    const release = Math.max(0.1, duration * 0.5);

    noteGain.gain.setValueAtTime(0.0001, startTime);
    noteGain.gain.linearRampToValueAtTime(gainAmt, startTime + attack);
    noteGain.gain.setValueAtTime(gainAmt * 0.8, startTime + duration - release);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(noteGain);
    noteGain.connect(this.filterNode);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  }

  // Play a mellow 808 sub-bass hit
  private playSubBass(freq: number, startTime: number, duration: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, startTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.8, startTime + duration);

    gain.gain.setValueAtTime(0.22, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  // Soft lo-fi kick drum
  private playKick(startTime: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(130, startTime);
    osc.frequency.exponentialRampToValueAtTime(38, startTime + 0.12);

    gain.gain.setValueAtTime(0.24, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.18);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + 0.18);
  }

  // Shimmering Hi-Hat / Rim click
  private playHiHat(startTime: number, open: boolean = false) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    filter.type = "highpass";
    filter.frequency.setValueAtTime(7000, startTime);

    osc.type = "square";
    osc.frequency.setValueAtTime(800 + Math.random() * 400, startTime);

    const dur = open ? 0.14 : 0.04;
    gain.gain.setValueAtTime(0.04, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0005, startTime + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + dur);
  }

  // Musical Loop Clock
  private scheduler() {
    if (!this.isPlaying || !this.ctx) return;

    const track = TRACK_LIST[this.currentTrackIndex];
    const beatInterval = 60 / track.bpm;
    const sixteenth = beatInterval / 4;

    const now = this.ctx.currentTime;
    const currentStep = this.step % 32;

    // Chord progressions per track
    if (this.currentTrackIndex === 0) {
      // TRACK 1: "NEON HORIZON" (Fm9 -> DbMaj7 -> Eb9 -> Cm7)
      // Chords trigger every 8 steps (half measure)
      const chordNotes = [
        [174.61, 220.00, 261.63, 311.13, 349.23], // Fm9 (F3, A3, C4, Eb4, F4)
        [138.59, 174.61, 207.65, 261.63, 329.63], // DbMaj7
        [155.56, 196.00, 233.08, 293.66, 349.23], // Eb9
        [130.81, 155.56, 196.00, 246.94, 311.13], // Cm7
      ];
      const chordIndex = Math.floor(currentStep / 8);

      if (currentStep % 8 === 0) {
        const chord = chordNotes[chordIndex];
        const chordDuration = beatInterval * 2;
        chord.forEach((freq, idx) => {
          // Dual voices for stereo warmth
          this.playSynthVoice(freq, now, chordDuration, "sawtooth", 0.04, -8 + idx * 3);
          this.playSynthVoice(freq, now, chordDuration, "triangle", 0.06, 8 - idx * 3);
        });

        // Sub bass root
        const bassRoots = [43.65, 34.65, 38.89, 32.70]; // F1, Db1, Eb1, C1
        this.playSubBass(bassRoots[chordIndex], now, chordDuration * 0.9);
      }

      // Drum groove
      if (currentStep % 8 === 0 || currentStep % 8 === 6) {
        this.playKick(now);
      }
      if (currentStep % 2 === 0) {
        this.playHiHat(now, currentStep % 8 === 4);
      }

      // Melodic arpeggio touch
      if (currentStep % 4 === 2) {
        const arps = [523.25, 587.33, 622.25, 698.46, 783.99]; // C5, D5, Eb5, F5, G5
        const note = arps[(currentStep + chordIndex) % arps.length];
        this.playSynthVoice(note, now, sixteenth * 3, "sine", 0.05);
      }
    } else if (this.currentTrackIndex === 1) {
      // TRACK 2: "MIDNIGHT TIMELINE" (Am -> F -> G -> Em @ 124 BPM)
      const bassNotes = [55.00, 43.65, 49.00, 41.20]; // A1, F1, G1, E1
      const arpScales = [
        [220, 261.63, 329.63, 440, 523.25], // Am
        [174.61, 220, 261.63, 349.23, 440], // F
        [196, 246.94, 293.66, 392, 493.88], // G
        [164.81, 196, 246.94, 329.63, 392], // Em
      ];
      const section = Math.floor(currentStep / 8);

      // Driving 16th bass
      if (currentStep % 2 === 0) {
        const root = bassNotes[section];
        this.playSubBass(root, now, sixteenth * 1.8);
      }

      // Fast arpeggiator
      const scale = arpScales[section];
      const arpNote = scale[currentStep % scale.length];
      this.playSynthVoice(arpNote, now, sixteenth * 1.5, "sawtooth", 0.045);

      // Four on the floor kick
      if (currentStep % 4 === 0) {
        this.playKick(now);
      }
      // Crisp 16th hats
      this.playHiHat(now, currentStep % 4 === 2);
    } else {
      // TRACK 3: "ANAMORPHIC DREAMS" (Ethereal Ambient Drone @ 96 BPM)
      if (currentStep % 16 === 0) {
        const ambientChords = [
          [110.00, 164.81, 220.00, 277.18, 329.63], // A major 9
          [98.00, 146.83, 196.00, 246.94, 293.66],  // G major 9
        ];
        const chord = ambientChords[Math.floor(currentStep / 16) % 2];
        const dur = beatInterval * 4;
        chord.forEach((freq) => {
          this.playSynthVoice(freq, now, dur, "triangle", 0.05, Math.random() * 12 - 6);
          this.playSynthVoice(freq * 2, now, dur, "sine", 0.03, Math.random() * 8 - 4);
        });
      }
      // Gentle occasional clicks
      if (currentStep % 8 === 4) {
        this.playHiHat(now, false);
      }
    }

    this.step++;
    const stepDurationMs = sixteenth * 1000;
    this.timerId = window.setTimeout(() => this.scheduler(), stepDurationMs);
  }

  public async play(): Promise<boolean> {
    try {
      this.initCtx();
      if (!this.ctx) return false;
      if (this.ctx.state === "suspended") {
        await this.ctx.resume();
      }
      if (this.isPlaying) return true;

      this.isPlaying = true;
      this.step = 0;
      this.scheduler();
      this.notify();
      return true;
    } catch {
      return false;
    }
  }

  public pause() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.notify();
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      const target = this.isMuted ? 0 : this.volume * 0.45;
      this.masterGain.gain.setValueAtTime(target, this.ctx.currentTime);
    }
    this.notify();
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      const target = this.isMuted ? 0 : this.volume * 0.45;
      this.masterGain.gain.setValueAtTime(target, this.ctx.currentTime);
    }
    this.notify();
    return this.isMuted;
  }

  public nextTrack() {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % TRACK_LIST.length;
    this.step = 0;
    this.notify();
  }

  public prevTrack() {
    this.currentTrackIndex = (this.currentTrackIndex - 1 + TRACK_LIST.length) % TRACK_LIST.length;
    this.step = 0;
    this.notify();
  }

  public setTrack(idx: number) {
    if (idx >= 0 && idx < TRACK_LIST.length) {
      this.currentTrackIndex = idx;
      this.step = 0;
      this.notify();
    }
  }

  // Returns realtime frequency magnitude (0..255) for visualizer & 3D audio-reactive animation
  public getFrequencyData(): Uint8Array {
    if (this.analyserNode && this.isPlaying) {
      this.analyserNode.getByteFrequencyData(this.frequencyData);
    } else {
      this.frequencyData.fill(0);
    }
    return this.frequencyData;
  }

  // Audio energy level 0..1 (reactive pulse magnitude)
  public getAudioEnergy(): number {
    if (!this.isPlaying || !this.analyserNode) return 0;
    this.analyserNode.getByteFrequencyData(this.frequencyData);
    let sum = 0;
    for (let i = 0; i < 16; i++) {
      sum += this.frequencyData[i];
    }
    return Math.min(1, sum / (16 * 190));
  }

  public getState() {
    return {
      isPlaying: this.isPlaying,
      trackIndex: this.currentTrackIndex,
      currentTrack: TRACK_LIST[this.currentTrackIndex],
      volume: this.volume,
      isMuted: this.isMuted,
    };
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }
}

export const musicEngine = new MusicEngine();
