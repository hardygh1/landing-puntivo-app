import { CalendarCheck, MapPin, QrCode, WifiOff } from "lucide-react";
import { trustItems } from "@/content/copy";
import { IconCircle } from "@/components/ui/IconCircle";

const icons = {
  offline: <IconCircle icon={WifiOff} tone="danger" size="sm" />,
  yape: <IconCircle icon={QrCode} tone="yape" size="sm" />,
  peru: <IconCircle icon={MapPin} tone="brand" size="sm" />,
  trial: <IconCircle icon={CalendarCheck} tone="accent" size="sm" />,
} as const;

export function TrustBar() {
  return (
    <section aria-label="Por qué elegir Puntivo POS" className="relative z-10 -mt-8 px-4 sm:px-6">
      <ul className="mx-auto grid max-w-5xl grid-cols-2 gap-x-4 gap-y-5 rounded-3xl bg-white p-5 shadow-soft ring-1 ring-navy/5 lg:grid-cols-4 lg:p-6">
        {trustItems.map((item) => (
          <li key={item.key} className="flex items-center gap-3">
            {icons[item.key]}
            <p className="leading-tight">
              <strong className="block font-display text-base font-black sm:text-[17px]">{item.title}</strong>
              <span className="hidden text-sm text-ink-soft sm:block">{item.text}</span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
