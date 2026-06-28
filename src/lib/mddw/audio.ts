let muted = false;

if (typeof window !== "undefined") {
  muted = localStorage.getItem("mddw_audio_muted") === "true";
}

export function isMuted(): boolean {
  return muted;
}

export function toggleMute(): boolean {
  muted = !muted;
  if (typeof window !== "undefined") {
    localStorage.setItem("mddw_audio_muted", String(muted));
  }
  return muted;
}

let sharedCtx: AudioContext | null = null;
function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (sharedCtx) return sharedCtx;
  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioCtx) return null;
  sharedCtx = new AudioCtx();
  return sharedCtx;
}

export function playPop() {
  if (muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = "sine";
  const now = ctx.currentTime;
  osc.frequency.setValueAtTime(400, now);
  osc.frequency.exponentialRampToValueAtTime(150, now + 0.1);

  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

  osc.start(now);
  osc.stop(now + 0.1);
}

export function playSuccess() {
  if (muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  
  // Arpeggio notes: C5 (523.25 Hz), E5 (659.25 Hz), G5 (783.99 Hz), C6 (1046.50 Hz)
  const notes = [523.25, 659.25, 783.99, 1046.50];
  notes.forEach((freq, index) => {
    const time = now + index * 0.08;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.1, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);

    osc.start(time);
    osc.stop(time + 0.4);
  });
}

export function playFailure() {
  if (muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = "sawtooth";
  const now = ctx.currentTime;
  osc.frequency.setValueAtTime(180, now);
  osc.frequency.linearRampToValueAtTime(80, now + 0.3);

  gain.gain.setValueAtTime(0.08, now);
  gain.gain.linearRampToValueAtTime(0.001, now + 0.3);

  osc.start(now);
  osc.stop(now + 0.3);
}
