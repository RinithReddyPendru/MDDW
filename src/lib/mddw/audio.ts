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

export function triggerHaptic(type: 'pop' | 'success' | 'failure') {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    if (type === 'pop') navigator.vibrate(15);
    else if (type === 'success') navigator.vibrate([30, 50, 30, 50, 50]);
    else navigator.vibrate([50, 100, 50]);
  }
}

export function speakText(text: string, langCode: string = 'te-IN', audioId?: string) {
  if (muted || typeof window === 'undefined') return;

  const playFallback = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  if (audioId) {
    const audio = new Audio(`${import.meta.env.BASE_URL || '/'}audio/${langCode}_${audioId}.mp3`);
    audio.play().catch(err => {
      console.warn("Failed to play MP3, falling back to TTS:", err);
      playFallback();
    });
    return;
  }

  playFallback();
}

export function playPop() {
  triggerHaptic('pop');
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
  triggerHaptic('success');
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
  triggerHaptic('failure');
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
