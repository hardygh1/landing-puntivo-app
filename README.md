# Landing de Puntivo POS

Landing de una sola página para **Puntivo POS** (app Android de ventas e inventario para bodegas en Perú).
Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS 4, exportada como sitio **100 % estático** (`out/`).


```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # genera out/ (listo para cualquier hosting estático o Vercel)
npm start        # sirve out/ en local (npx serve)
npm run lint
```

---

## 1. Todo lo editable está en `src/config/site.ts`

| Qué quieres cambiar | Dónde |
|---|---|
| Número de WhatsApp y mensajes de cada botón | `site.whatsapp` |
| URL, nombre, peso y versión del APK | `site.demoApk` |
| Demo de restaurante | `site.demoApkRestaurante.url` (vacío = el botón no aparece) |
| Dominio | `site.siteUrl` (⚠️ cámbialo antes de publicar: canonical, OG, sitemap y JSON-LD salen de aquí) |
| Redes sociales | `site.social` (solo se muestran las que tengan URL) |
| Bloque "Próximamente: boletas y facturas" | `site.features.showEInvoicingTeaser` |
| Mostrar/ocultar video | `site.features.showVideo` |
| Variante del titular (A/B) | `site.heroVariant` |
| Datos de LocalBusiness (dirección, horario) | `site.localBusiness` (null = no se publica) |

Textos de las secciones: `src/content/copy.ts`. Preguntas frecuentes (acordeón **y** JSON-LD): `src/content/faq.ts`.

## 2. El APK de la demo

Todos los botones leen **una sola constante**:

```ts
// src/config/site.ts
demoApk: {
  url: "/descargas/Puntivo-demo.apk", // ← ESTA es la línea que cambias
  sizeLabel: "≈ 83 MB",              // ← peso que se muestra en el botón
  version: "0.3.0",
}
```

**Opción A — dentro del proyecto (configuración actual).** El archivo está en `public/descargas/Puntivo-demo.apk`
(copia de `emite-ya-app/dist/Puntivo-demo-release.apk`, 87,4 MB ≈ 83 MiB) y se publica en
`https://TU-DOMINIO/descargas/Puntivo-demo.apk`. Para actualizarlo, reemplaza el archivo y ajusta `sizeLabel`/`version`.

> GitHub acepta archivos de hasta 100 MB (avisa desde 50 MB). Si el APK crece o los despliegues se vuelven lentos, usa la Opción B.
> `vercel.json` ya envía `Content-Type: application/vnd.android.package-archive` y `Content-Disposition: attachment` para los `.apk`.

**Opción B — alojado fuera** (recomendado: GitHub Releases, acepta hasta 2 GB). Pega la URL directa:

```ts
demoApk: { url: "https://github.com/USUARIO/REPO/releases/download/v0.3.0/Puntivo-demo.apk", sizeLabel: "≈ 83 MB", version: "0.3.0", ... }
```

Con una URL externa el sitio no usa el atributo `download` (los navegadores lo ignoran entre dominios); el servidor externo debe enviar
`Content-Disposition: attachment` (GitHub Releases lo hace; en Cloudflare R2 configúralo en el objeto). Luego borra `public/descargas/`.

## 3. Bloque de boletas y facturas electrónicas

Viene **desactivado**. Con `showEInvoicingTeaser: false` no aparece ninguna mención a boletas, facturas ni SUNAT en el HTML.
Para anunciarlo: `features.showEInvoicingTeaser: true` y `npm run build`. El bloque siempre dice "Próximamente".

## 4. Imágenes y video

La landing usa **solo pantallas reales de la app** (sin piezas publicitarias): el texto lo pone la página.
Las pantallas se sacan de dos fuentes y quedan en `assets-src/screens/`:

- **Del video** (`assets-src/Puntivo_TikTok.mp4`): un fotograma por escena, recortando solo el interior del celular
  (venta, catálogo, cobro con QR, inventario, stock, clientes/fiado, historial, selección de etiquetas).
- **Del manual** (`emite-ya-app/docs/manual/img/`): capturas 1080×2400 (Yape recibido, ¡Venta exitosa!, ajustes de Yape, bienvenida).

```bash
node scripts/extract-screens.mjs   # vuelve a sacar las pantallas → assets-src/screens/
npm run optimize:images            # pantallas en WebP + AVIF (320/480/720 px) → public/img/, poster, imagen OG, íconos
npm run optimize:video             # comprime el video → public/video/puntivo-tiktok.mp4 (720p, ~3,4 MB)
```

Para cambiar una pantalla: pon tu captura (vertical, del celular) en `assets-src/screens/<nombre>.png` con el mismo nombre
(p. ej. `venta.png` para el hero) y corre `npm run optimize:images`. Los segundos del video que se usan están en
`scripts/extract-screens.mjs` (`fromVideo`).

El script de video usa el `ffmpeg` del sistema o, si no hay, el de la dependencia `ffmpeg-static`. Comando equivalente:

```bash
ffmpeg -i Puntivo_TikTok.mp4 -vf "scale=720:-2" -c:v libx264 -preset slow -crf 28 -profile:v main -pix_fmt yuv420p \
  -movflags +faststart -c:a aac -b:a 96k public/video/puntivo-tiktok.mp4
```

Si falta una imagen, el build no se rompe: muestra un espacio reservado y avisa con un `TODO` en consola.

Notas:
- Subtítulos del video: si los tienes, añade el `<track>` indicado en `src/components/sections/VideoPlayer.tsx`.

## 5. Analítica (opcional)

Copia `.env.example` a `.env.local` (o configúralas en Vercel):

| Variable | Efecto |
|---|---|
| `NEXT_PUBLIC_GA_ID` | Carga GA4 y envía los eventos |
| `NEXT_PUBLIC_META_PIXEL_ID` | Carga Meta Pixel (`trackCustom` + `Lead` en descargas y WhatsApp) |
| `NEXT_PUBLIC_VERCEL_ANALYTICS=1` | Activa Vercel Web Analytics |

Sin variables no se carga ningún script de terceros (en desarrollo los eventos se ven con `console.debug`).
Eventos: `download_demo`, `download_demo_restaurante`, `whatsapp_click`, `install_guide_open`, `video_play`, `video_unmute`, `faq_open`,
todos con su `location` y los UTM de llegada (`utm_source`, `utm_campaign`…) guardados en la sesión.
Las variables se leen en el build: después de cambiarlas, vuelve a construir.

## 6. Pruebas A/B del titular

Tres variantes en `src/content/copy.ts` (`heroHeadlines`). Por defecto se usa `site.heroVariant`; para forzar otra usa `?v=b` o `?v=c`
en el enlace (se recuerda durante la sesión). Se aplica antes de pintar, sin parpadeo ni JS de terceros. Combínalo con UTM:
`https://puntivoperu.com/?v=b&utm_source=tiktok&utm_campaign=lanzamiento&utm_content=video-yape`.

## 7. Despliegue

- **Vercel:** importa el repo y despliega; no hace falta configurar nada (`output: "export"` y `vercel.json` incluidos).
- **Otro hosting estático** (Netlify, Cloudflare Pages, cPanel…): sube el contenido de `out/`. Configura en el servidor
  el `Content-Type`/`Content-Disposition` del APK si quieres asegurar la descarga directa.

## 8. SEO local Perú — después de publicar

1. Da de alta el dominio en **Google Search Console**, envía `https://TU-DOMINIO/sitemap.xml` y pide la indexación.
2. Crea u optimiza tu **Google Business Profile** (categoría "Empresa de software" o "Servicio de software", zona de servicio Perú)
   con enlace a la landing y el WhatsApp.
3. Pon el enlace en la bio de **TikTok, Instagram y Facebook** con UTM: `?utm_source=tiktok&utm_medium=bio&utm_campaign=lanzamiento`
   (y `utm_source=instagram`, `facebook`, `whatsapp`…). En cada video usa un `utm_content` distinto.
4. Publica el video también en **YouTube Shorts** con el enlace en la descripción.
5. Consigue enlaces de directorios de emprendimiento peruanos y grupos de bodegueros (sin comprar enlaces).
6. Revisa cada mes en Search Console qué búsquedas traen visitas y ajusta las preguntas frecuentes y los H2.
7. Valida los datos estructurados en el [Rich Results Test](https://search.google.com/test/rich-results) y en
   [validator.schema.org](https://validator.schema.org/) con el dominio final.

## 9. Pendiente del cliente

- Dominio final (`siteUrl`). El QR del aviso de escritorio y la imagen OG apuntan a ese dominio.
- Precio: no se muestra ni se publica en JSON-LD (`offers` está comentado en `src/lib/jsonld.ts`).
- "Sin mensualidad": no se usa en ningún texto hasta que lo confirmes.
- Testimonios: no hay sección de prueba social; agrégala solo con testimonios reales.
- Yape y Plin: la confirmación automática de Yape se anuncia solo para la app activada (no en la demo); con Plin solo se muestra el QR.
- Demo de restaurante: hoy solo existe en *debug* (≈ 230 MB); compílala en *release* y súbela fuera (Opción B).

## Estructura

```
public/            descargas/ (APK) · brand/ · img/ · video/ · og/ · íconos y favicon
assets-src/        originales (no se publican)
scripts/           optimize-images.mjs · optimize-video.mjs
src/config/site.ts única fuente de configuración
src/content/       copy.ts · faq.ts
src/lib/           links.ts (waLink) · track.ts · jsonld.ts · ui-events.ts
src/components/    ui/ · cta/ · sections/ · decor/
src/app/           layout.tsx · page.tsx · globals.css · sitemap.ts · robots.ts · manifest.ts
```
