// Convierte las pantallas reales de la app (assets-src/screens/, ver extract-screens.mjs) en WebP/AVIF
// livianos para public/img/, y genera poster del video, imagen OG, íconos y favicon.
// Uso: npm run optimize:images
import { mkdir, readFile, writeFile, stat } from "node:fs/promises";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, "$1")), "..");
const src = (...f) => path.join(root, "assets-src", ...f);
const pub = (...f) => path.join(root, "public", ...f);

// Todas las pantallas se publican con la misma proporción (9 : 19,5) para que encajen en el marco de celular
export const SCREEN_W = 720;
export const SCREEN_H = 1560;
const SCREEN_WIDTHS = [320, 480, 720];

async function kb(file) {
  return `${Math.round((await stat(file)).size / 1024)} KB`;
}

async function variants(input, name, widths, { webpQ = 72, avifQ = 52 } = {}) {
  for (const w of widths) {
    const base = sharp(input).resize({ width: w, withoutEnlargement: true });
    const webp = pub("img", `${name}-${w}.webp`);
    const avif = pub("img", `${name}-${w}.avif`);
    await base.clone().webp({ quality: webpQ, effort: 6 }).toFile(webp);
    await base.clone().avif({ quality: avifQ, effort: 6 }).toFile(avif);
    console.log(`  ${name}-${w}: webp ${await kb(webp)} · avif ${await kb(avif)}`);
  }
}

/** Pantalla normalizada a 720×1560, recortando por abajo si sobra (la parte superior es la importante). */
function normalizedScreen(file) {
  return sharp(file).resize(SCREEN_W, SCREEN_H, { fit: "cover", position: "top" }).png().toBuffer();
}

/** Celular dibujado (bisel oscuro + esquinas redondeadas) con una pantalla dentro, para la imagen OG. */
async function phoneMockup(screen, height) {
  const width = Math.round((height * SCREEN_W) / SCREEN_H) + 24;
  const inner = await sharp(screen).resize(width - 24, height - 24).png().toBuffer();
  const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width - 24}" height="${height - 24}"><rect width="100%" height="100%" rx="34" fill="#fff"/></svg>`);
  const rounded = await sharp(inner).ensureAlpha().composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
  const body = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" rx="44" fill="#0B1220"/></svg>`);
  return sharp(body).composite([{ input: rounded, left: 12, top: 12 }]).png().toBuffer();
}

// ICO con un único PNG embebido (formato válido desde Windows Vista)
function pngToIco(png, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size >= 256 ? 0 : size, 0);
  entry.writeUInt8(size >= 256 ? 0 : size, 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(22, 12);
  return Buffer.concat([header, entry, png]);
}

async function main() {
  await mkdir(pub("img"), { recursive: true });
  await mkdir(pub("video"), { recursive: true });
  await mkdir(pub("og"), { recursive: true });

  console.log("Pantallas de la app:");
  const screensDir = src("screens");
  const screens = existsSync(screensDir) ? readdirSync(screensDir).filter((f) => f.endsWith(".png")) : [];
  if (screens.length === 0) console.warn('  TODO: no hay pantallas en assets-src/screens/ — ejecuta "node scripts/extract-screens.mjs"');
  for (const file of screens) {
    await variants(await normalizedScreen(src("screens", file)), `pantalla-${file.replace(/\.png$/, "")}`, SCREEN_WIDTHS);
  }

  const portada = src("video-portada.png");
  if (existsSync(portada)) {
    console.log("Poster del video:");
    await sharp(portada).resize({ width: 540 }).webp({ quality: 68, effort: 6 }).toFile(pub("video", "puntivo-video-poster.webp"));
    console.log(`  puntivo-video-poster.webp ${await kb(pub("video", "puntivo-video-poster.webp"))}`);
  }

  const venta = src("screens", "venta.png");
  if (existsSync(portada) && existsSync(venta)) {
    console.log("Imagen OG 1200×630:");
    const W = 1200, H = 630;
    // Fondo: el degradado de la portada, desenfocado, para que el titular recortado no deje bordes
    const bgBase = await sharp(portada).extract({ left: 0, top: 0, width: 1080, height: 160 }).resize(W, H, { fit: "fill" }).blur(30).png().toBuffer();
    const overlay = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
      <rect x="64" y="528" width="330" height="64" rx="32" fill="#00E676"/>
      <text x="229" y="570" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700" fill="#0B1220" text-anchor="middle">Prueba gratis 3 días</text>
      <g stroke="#00E676" stroke-width="9" stroke-linecap="round"><path d="M1150 70 l20 -26"/><path d="M1158 104 l32 -6"/><path d="M1140 40 l-2 -30"/></g>
    </svg>`);
    // Logo + titular (con la pastilla verde) recortados de la portada, que ya usa la tipografía de marca
    const hw = 760, hh = Math.round((503 * hw) / 890);
    const feather = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${hw}" height="${hh}">
      <defs><filter id="f"><feGaussianBlur stdDeviation="11"/></filter></defs>
      <rect x="22" y="22" width="${hw - 44}" height="${hh - 30}" rx="30" fill="#fff" filter="url(#f)"/></svg>`);
    const headline = await sharp(portada)
      .extract({ left: 40, top: 150, width: 890, height: 503 })
      .resize(hw, hh)
      .ensureAlpha()
      .composite([{ input: feather, blend: "dest-in" }])
      .png()
      .toBuffer();
    const phone = await phoneMockup(await normalizedScreen(venta), 580);
    await sharp(bgBase)
      .composite([
        { input: overlay, left: 0, top: 0 },
        { input: headline, left: 40, top: 50 },
        { input: phone, left: 880, top: 25 },
      ])
      .png({ compressionLevel: 9, palette: true, quality: 90 })
      .toFile(pub("og", "puntivo-og.png"));
    console.log(`  og/puntivo-og.png ${await kb(pub("og", "puntivo-og.png"))}`);
  } else {
    console.warn("  TODO: faltan assets-src/video-portada.png o assets-src/screens/venta.png (poster y OG)");
  }

  console.log("Íconos:");
  const icon = await readFile(pub("brand", "puntivo-app-icon.svg"));
  for (const [file, size] of [["icon-192.png", 192], ["icon-512.png", 512], ["apple-touch-icon.png", 180], ["brand/puntivo-logo-512.png", 512]]) {
    await sharp(icon, { density: 300 }).resize(size, size).png().toFile(pub(file));
    console.log(`  ${file}`);
  }
  const fav = await readFile(pub("favicon.svg"));
  const fav32 = await sharp(fav, { density: 300 }).resize(32, 32).png().toBuffer();
  await writeFile(pub("favicon.ico"), pngToIco(fav32, 32));
  console.log("  favicon.ico");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
