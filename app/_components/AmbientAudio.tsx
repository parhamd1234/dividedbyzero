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
  // Set once the user deliberately mutes, so we don't auto-restart on them.
  const optedOut = useRef(false);

  function start() {
    if (optedOut.current) return;
    if (!engine.current) {
      const e = buildEngine();
      const now = e.ctx.currentTime;
      e.master.gain.setValueAtTime(0, now);
      e.master.gain.linearRampToValueAtTime(0.55, now + 2.5);
      engine.current = e;
    }
    const { ctx } = engine.current;
    // resume() only produces sound once the browser trusts the page (a prior
    // interaction, or high media-engagement). Reflect "playing" only if it took.
    const mark = () => {
      if (ctx.state === "running") setPlaying(true);
    };
    ctx.resume?.().then(mark).catch(() => {});
    mark();
  }

  function stopEngine() {
    engine.current?.stop();
    engine.current = null;
    setPlaying(false);
  }

  useEffect(() => {
    const t = setTimeout(() => setHint(false), 9000);
    return () => clearTimeout(t);
  }, []);

  // Try to start the moment the page loads. Browsers block audio before any
  // interaction, so this only makes sound for visitors the browser already
  // trusts (repeat visitors / high media-engagement); everyone else falls
  // through to the first-interaction handler below.
  useEffect(() => {
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Default to "on": browsers forbid sound before the user interacts with the
  // page, so the soundscape fades in on the first click / tap / key / scroll
  // anywhere — the closest thing to autoplay the platform permits.
  useEffect(() => {
    const onFirst = (e: Event) => {
      if (
        e.target instanceof Element &&
        e.target.closest("[data-audio-toggle]")
      ) {
        return; // the toggle button manages itself
      }
      if (optedOut.current || engine.current?.ctx.state === "running") {
        detach();
        return;
      }
      setHint(false);
      start();
    };
    const events = ["pointerdown", "keydown", "click", "touchend"];
    const detach = () =>
      events.forEach((ev) => window.removeEventListener(ev, onFirst));
    events.forEach((ev) =>
      window.addEventListener(ev, onFirst, { passive: true })
    );
    return detach;
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
      optedOut.current = true;
      stopEngine();
    } else {
      optedOut.current = false;
      start();
    }
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
        data-audio-toggle
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? "Mute ambient sound" : "Play ambient sound"}
        className="group w-11 h-11 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm flex items-center justify-center hover:border-white/50 transition-colors"
      >
        {/* Speaker icon — waves when playing, slash when muted */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 text-white/80 group-hover:text-white transition-colors"
          aria-hidden
        >
          <path d="M11 5 6.5 9H3v6h3.5L11 19V5z" fill="currentColor" stroke="none" />
          {playing ? (
            <>
              <path d="M14.5 9.5a4 4 0 0 1 0 5" />
              <path d="M17 7a8 8 0 0 1 0 10" />
            </>
          ) : (
            <path d="M15 9.5l5 5M20 9.5l-5 5" />
          )}
        </svg>
      </button>
    </div>
  );
}
