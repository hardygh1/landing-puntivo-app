import { Section, SectionTitle } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Highlight } from "@/components/ui/Highlight";
import { PhoneFrame } from "@/components/decor/PhoneFrame";
import { Squiggles } from "@/components/decor/Squiggles";
import { VideoPlayer } from "./VideoPlayer";

export function VideoSection() {
  return (
    <Section id="video" className="bg-hero text-white">
      <div className="grid items-center gap-10 md:grid-cols-[minmax(0,360px)_1fr] md:gap-16">
        <div className="relative mx-auto w-full max-w-[320px] md:order-none md:max-w-[360px]">
          <Squiggles className="absolute -top-6 -left-8 size-14 text-accent" flip />
          <PhoneFrame video>
            <VideoPlayer
              src="/video/puntivo-tiktok.mp4"
              poster="/video/puntivo-video-poster.webp"
              title="Video de 40 segundos: cómo vender, cobrar con Yape y Plin, controlar stock, fiado y caja con Puntivo POS"
            />
          </PhoneFrame>
        </div>
        <Reveal>
          <SectionTitle id="video-titulo" dark>
            Mira Puntivo en <Highlight>40 segundos</Highlight>
          </SectionTitle>
          <p className="mt-5 text-lg text-white/95 md:text-xl">Vender, cobrar con Yape, controlar el stock y el fiado, de principio a fin.</p>
        </Reveal>
      </div>
    </Section>
  );
}
