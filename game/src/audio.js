// Kaki Lima Midnight — all sound is WebAudio generated in code, no files.
// First draft of this module was produced with the Beastfarmer model
// (deepseek-v4.1-flash-uncensored) for this build, then integrated and tuned
// here: a looping filtered-noise sizzle tied to the wok, a knife chop burst,
// a two-tone service bell, a coin arpeggio, an error buzz and a plating pop.

export function createAudio() {
  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  let ctx = null;
  let master = null;
  let noiseBuffer = null;
  let muted = false;
  let sizzleSource = null;
  let sizzleGain = null;

  function ensureContext() {
    if (ctx || !AudioCtor) return ctx;
    ctx = new AudioCtor();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.42;
    master.connect(ctx.destination);
    const length = Math.floor(ctx.sampleRate * 2);
    noiseBuffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;
    return ctx;
  }

  function now() {
    if (!ensureContext()) return 0;
    if (ctx.state === 'suspended') ctx.resume();
    return ctx.currentTime;
  }

  function tone(freq, type, at, dur, peak, slideTo) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, at);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, at + dur);
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(peak, at + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    osc.connect(gain).connect(master);
    osc.start(at);
    osc.stop(at + dur + 0.03);
  }

  function noiseBurst(at, dur, freq, q, peak) {
    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    source.buffer = noiseBuffer;
    filter.type = 'bandpass';
    filter.frequency.value = freq;
    filter.Q.value = q;
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(peak, at + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    source.connect(filter).connect(gain).connect(master);
    source.start(at);
    source.stop(at + dur + 0.03);
  }

  return {
    unlock() {
      if (ensureContext() && ctx.state === 'suspended') ctx.resume();
    },
    setMuted(value) {
      muted = !!value;
      if (master && ctx) master.gain.setTargetAtTime(muted ? 0 : 0.42, ctx.currentTime, 0.02);
    },
    isMuted() {
      return muted;
    },
    chop() {
      const at = now();
      if (ctx) noiseBurst(at, 0.07, 1700, 1.1, 0.32);
    },
    pop() {
      const at = now();
      if (ctx) tone(520, 'sine', at, 0.09, 0.22, 180);
    },
    ding() {
      const at = now();
      if (!ctx) return;
      tone(1046.5, 'sine', at, 0.5, 0.22);
      tone(1568, 'sine', at + 0.09, 0.55, 0.18);
    },
    buzz() {
      const at = now();
      if (ctx) tone(96, 'square', at, 0.18, 0.1);
    },
    coin() {
      const at = now();
      if (!ctx) return;
      tone(1318.5, 'sine', at, 0.07, 0.16);
      tone(1760, 'sine', at + 0.055, 0.08, 0.16);
      tone(2349.3, 'sine', at + 0.11, 0.12, 0.13);
    },
    sizzleStart(level = 0.1) {
      const at = now();
      if (!ctx) return;
      if (!sizzleSource) {
        const source = ctx.createBufferSource();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();
        source.buffer = noiseBuffer;
        source.loop = true;
        filter.type = 'highpass';
        filter.frequency.value = 1500;
        gain.gain.value = 0;
        source.connect(filter).connect(gain).connect(master);
        source.start();
        sizzleSource = source;
        sizzleGain = gain;
      }
      sizzleGain.gain.setTargetAtTime(Math.max(0, Math.min(0.22, level)), at, 0.05);
    },
    sizzleStop() {
      if (!sizzleSource || !ctx) return;
      const at = ctx.currentTime;
      const source = sizzleSource;
      const gain = sizzleGain;
      sizzleSource = null;
      sizzleGain = null;
      gain.gain.setTargetAtTime(0.0001, at, 0.03);
      source.stop(at + 0.2);
    },
  };
}
