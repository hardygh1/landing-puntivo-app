import { site } from "@/config/site";
import { nav } from "@/content/copy";
import { waAriaLabel, waLink } from "@/lib/links";
import { WhatsAppIcon } from "@/components/decor/WhatsAppIcon";

const socialLabels = { tiktok: "TikTok", instagram: "Instagram", facebook: "Facebook" } as const;

export function Footer() {
  const socials = (Object.keys(site.social) as (keyof typeof site.social)[]).filter((k) => site.social[k]);
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy px-4 pt-14 pb-28 text-white sm:px-6 md:pb-12">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/puntivo-logo-white.svg" alt={site.name} width={165} height={40} loading="lazy" className="h-10 w-auto" />
          <p className="mt-4 text-white/80">{site.tagline}</p>
          <a
            href={waLink("consulta")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={waAriaLabel}
            className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-full bg-white/10 px-4 font-bold hover:bg-white/15"
          >
            <WhatsAppIcon className="size-5 text-accent" />
            {site.whatsapp.display}
          </a>
          {socials.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {socials.map((k) => (
                <li key={k}>
                  <a
                    href={site.social[k]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 items-center rounded-full px-3 font-semibold text-white/90 underline decoration-accent underline-offset-4"
                  >
                    {socialLabels[k]}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav aria-label="Enlaces del pie de página">
          <p className="font-display text-lg font-black">Explora</p>
          <ul className="mt-3 grid gap-1">
            {[...nav, { href: "#descargar", label: "Descargar demo" }].map((item) => (
              <li key={item.href}>
                <a href={item.href} className="inline-flex min-h-11 items-center text-white/85 hover:text-accent">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="text-[15px] text-white/80">
          <p className="font-display text-lg font-black text-white">
            Hecho en Perú <span aria-hidden="true">🇵🇪</span>
          </p>
          <p className="mt-3">
            © {year} {site.owner}. Todos los derechos reservados.
          </p>
          <p className="mt-1">{site.name} es un producto de {site.owner}.</p>
          <p className="mt-1">Versión de la demo v{site.demoApk.version}</p>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-6xl border-t border-white/10 pt-6 text-sm text-white/70">
        Yape es una marca de BCP y Plin de sus respectivos titulares. {site.name} no está afiliado a ellas.
      </p>
    </footer>
  );
}
