"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { track } from "@/lib/track";

type Props = { src: string; poster: string; title: string };

// Video vertical: no descarga nada hasta entrar en pantalla, arranca en silencio,
// se pausa al salir. Con "reducir movimiento" no se reproduce solo.
export function VideoPlayer({ src, poster, title }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const userPaused = useRef(false);
  const tracked = useRef(false);

  useEffect(() => {
    const video = ref.current;
    if (!video || !("IntersectionObserver" in window)) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (reduce || userPaused.current) return;
          if (!video.getAttribute("src")) video.setAttribute("src", src);
          void video.play().catch(() => {});
        } else if (!video.paused) {
          video.pause();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [src]);

  function play(video: HTMLVideoElement) {
    // El archivo solo se asigna (y descarga) cuando hace falta
    if (!video.getAttribute("src")) video.setAttribute("src", src);
    userPaused.current = false;
    void video.play().catch(() => {});
  }

  function togglePlay() {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      play(video);
    } else {
      userPaused.current = true;
      video.pause();
    }
  }

  function toggleSound() {
    const video = ref.current;
    if (!video) return;
    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setMuted(nextMuted);
    if (!nextMuted) {
      track("video_unmute");
      if (video.paused) play(video);
    }
  }

  return (
    <div className="relative h-full w-full">
      {/* Poster como imagen diferida: no compite con la imagen del hero al cargar la página */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={poster} alt="" width={540} height={960} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
      <video
        ref={ref}
        className="relative h-full w-full object-cover"
        muted
        playsInline
        loop
        preload="none"
        aria-label={title}
        onPlay={() => {
          setPlaying(true);
          if (!tracked.current) {
            tracked.current = true;
            track("video_play");
          }
        }}
        onPause={() => setPlaying(false)}
      >
        {/* TODO cliente: si entregas subtítulos, añade aquí <track kind="captions" src="/video/puntivo-tiktok.es.vtt" srcLang="es" label="Español" default /> */}
      </video>

      <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? "Pausar video" : "Reproducir video"}
          className="inline-flex size-12 items-center justify-center rounded-full bg-navy/80 text-white"
        >
          {playing ? <Pause className="size-5" aria-hidden="true" /> : <Play className="size-5" aria-hidden="true" />}
        </button>
        <button
          type="button"
          onClick={toggleSound}
          aria-label={muted ? "Activar sonido del video" : "Silenciar video"}
          className="inline-flex min-h-12 items-center gap-2 rounded-full bg-accent px-4 text-[15px] font-extrabold text-navy shadow-accent"
        >
          {muted ? <Volume2 className="size-5" aria-hidden="true" /> : <VolumeX className="size-5" aria-hidden="true" />}
          <span aria-hidden="true">{muted ? "Activar sonido" : "Silenciar"}</span>
        </button>
      </div>
    </div>
  );
}
