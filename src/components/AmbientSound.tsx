"use client";

import { useEffect, useRef, useCallback } from "react";

export function AmbientSound() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const startedRef = useRef(false);

  const createNoise = useCallback((ctx: AudioContext) => {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }, []);

  const startAmbience = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioCtxRef.current = ctx;

    // Wind-like ambient
    const noise = ctx.createBufferSource();
    noise.buffer = createNoise(ctx);
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 400;

    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.15;
    lfoGain.gain.value = 200;
    lfo.connect(lfoGain).connect(filter.frequency);
    lfo.start();

    const gain = ctx.createGain();
    gain.gain.value = 0.06;

    noise.connect(filter).connect(gain).connect(ctx.destination);
    noise.start();

    // Scroll-mapped volume
    const onScroll = () => {
      const scrollPct =
        window.scrollY / (document.body.scrollHeight - window.innerHeight);
      const vol = 0.03 + scrollPct * 0.06;
      gain.gain.setTargetAtTime(vol, ctx.currentTime, 0.1);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
  }, [createNoise]);

  useEffect(() => {
    const handler = () => startAmbience();
    document.addEventListener("click", handler, { once: true });
    document.addEventListener("touchstart", handler, { once: true });
    return () => {
      document.removeEventListener("click", handler);
      document.removeEventListener("touchstart", handler);
      audioCtxRef.current?.close();
    };
  }, [startAmbience]);

  return null;
}
