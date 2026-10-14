import type { ReactNode } from "react";

type Props = {
  id: string;
  titleId?: string;
  className?: string;
  children: ReactNode;
};

export function Section({ id, titleId = `${id}-titulo`, className = "bg-white", children }: Props) {
  return (
    <section id={id} aria-labelledby={titleId} className={`relative overflow-hidden px-4 py-16 sm:px-6 md:py-24 ${className}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

export function SectionTitle({ id, children, className = "", dark = false }: { id: string; children: ReactNode; className?: string; dark?: boolean }) {
  return (
    <h2
      id={id}
      className={`font-display text-[2rem] leading-[1.08] font-black tracking-tight text-balance sm:text-4xl md:text-5xl ${dark ? "text-white" : "text-navy"} ${className}`}
    >
      {children}
    </h2>
  );
}
