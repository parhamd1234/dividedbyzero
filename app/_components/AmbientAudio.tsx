"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Generative ambient soundscape, synthesized live with the Web Audio API —
 * no audio file. A deep detuned drone breathes under slow, sparse chimes
 * that ring out through a feedback delay. Starts only on user gesture
 * (browser policy) via the floating sound toggle.
 */
export default function AmbientAudio() {
  const [playing, setPlaying] = useState(false);
  const [hint, setHint] = useState(true);
  const engine = useRef<{
    ctx: AudioContext;
    master: GainNode;
    stop: () => void;
  } | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setHint(false), 9000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    return () => {
      engine.current?.stop();
      engine.current = null;
    };
  }, []);

  function buildEngine() {
    const ctx = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)();

    const master = ctx.createGain();
    master.gain.value = 0;
    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = -20;
    limiter.knee.value = 24;
    limiter.ratio.value = 8;
    master.connect(limiter).connect(ctx.destination);

    const stops: Array<() => void> = [];

    // --- Drone: three detuned sine pairs through a slowly sweeping lowpass
    const droneFilter = ctx.createBiquadFilter();
    droneFilter.type = "lowpass";
    droneFilter.frequency.value = 320;
    droneFilter.Q.value = 0.7;
    const droneGain = ctx.createGain();
    droneGain.gain.value = 0.16;
    droneFilter.connect(droneGain).connect(master);

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.04;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 140;
    lfo.connect(lfoGain).connect(droneFilter.frequency);
    lfo.start();
    stops.push(() => lfo.stop());

    for (const f of [55, 110, 164.81]) {
      for (const detune of [-4, 4]) {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = f;
        osc.detune.value = detune;
        const g = ctx.createGain();
        g.gain.value = f < 100 ? 0.5 : 0.22;
        const pan = ctx.createStereoPanner();
        pan.pan.value = detune / 10;
        osc.connect(g).connect(pan).connect(droneFilter);
        osc.start();
        stops.push(() => osc.stop());
      }
    }

    // --- Air: faint filtered noise
    const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuf;
    noise.loop = true;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.value = 900;
    noiseFilter.Q.value = 0.4;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.012;
    noise.connect(noiseFilter).connect(noiseGain).connect(master);
    noise.start();
    stops.push(() => noise.stop());

    // --- Chimes: sparse pentatonic pings through a feedback delay
    const delay = ctx.createDelay(2);
    delay.delayTime.value = 0.55;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.4;
    const delayMix = ctx.createGain();
    delayMix.gain.value = 0.5;
    delay.connect(feedback).connect(delay);
    delay.connect(delayMix).connect(master);

    const scale = [220, 261.63, 329.63, 392, 440, 523.25, 659.26];
    let chimeTimer: ReturnType<typeof setTimeout>;
    let alive = true;

    function scheduleChime() {
      if (!alive) return;
      const note = scale[Math.floor(Math.random() * scale.length)];
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = note;
      const g = ctx.createGain();
      const pan = ctx.createStereoPanner();
      pan.pan.value = Math.random() * 1.6 - 0.8;
      const now = ctx.currentTime;
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.05 + Math.random() * 0.04, now + 0.4);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 5);
      osc.connect(g).connect(pan);
      pan.connect(master);
      pan.connect(delay);
      osc.start(now);
      osc.stop(now + 5.2);
      chimeTimer = setTimeout(scheduleChime, 3500 + Math.random() * 6000);
    }
    chimeTimer = setTimeout(scheduleChime, 1200);

    const stop = () => {
      alive = false;
      clearTimeout(chimeTimer);
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(0, now + 0.8);
      setTimeout(() => {
        stops.forEach((s) => {
          try {
            s();
          } catch {}
        });
        ctx.close().catch(() => {});
      }, 1000);
    };

    return { ctx, master, stop };
  }

  function toggle() {
    setHint(false);
    if (playing) {
      engine.current?.stop();
      engine.current = null;
      setPlaying(false);
      return;
    }
    const e = buildEngine();
    engine.current = e;
    const now = e.ctx.currentTime;
    e.master.gain.setValueAtTime(0, now);
    e.master.gain.linearRampToValueAtTime(0.55, now + 2.5);
    setPlaying(true);
  }

  return (
    <div className="fixed bottom-6 right-6 z-30 flex items-center gap-3">
      {hint && !playing && (
        <span className="text-[11px] tracking-[0.25em] uppercase text-white/40 dbz-hint select-none">
          Sound on
        </span>
      )}
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? "Mute ambient sound" : "Play ambient sound"}
        className="group w-11 h-11 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm flex items-center justify-center hover:border-white/50 transition-colors"
      >
        <span className="flex items-end gap-[3px] h-4" aria-hidden>
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={`w-[2.5px] rounded-full bg-white/80 ${
                playing ? "dbz-eq" : ""
              }`}
              style={{
                height: playing ? undefined : "3px",
                animationDelay: `${i * 180}ms`,
              }}
            />
          ))}
        </span>
      </button>
    </div>
  );
}
