// Extrae pantallas LIMPIAS de la app (sin textos publicitarios) desde el video y desde las capturas del manual.
// Del video toma un fotograma por escena y recorta solo el interior del celular (la pantalla real de la app).
// Uso: node scripts/extract-screens.mjs   → assets-src/screens/*.png  (luego: npm run optimize:images)
import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import ffmpegStatic from "ffmpeg-static";

const VIDEO = "assets-src/Puntivo_TikTok.mp4";
const MANUAL = "../emite-ya-app/docs/manual/img";
const OUT = "assets-src/screens";
const TMP = path.join(OUT, ".tmp");
mkdirSync(TMP, { recursive: true });

// Fotogramas sin globos ni zoom encima del celular
const fromVideo = {
  catalogo: 4.0,
  venta: 8.9, // escáner + carrito con 2 productos y "Cobrar S/ 41.50"
  metodos: 9.2,
  "qr-yape": 10.6,
  inventario: 19.0,
  stock: 21.0,
  "etiquetas-seleccion": 23.0,
  clientes: 26.3,
  historial: 30.0,
};

// Capturas reales 1080×2400 del manual
const fromManual = {
  "yape-recibido": "yape/12_recibido.png",
  "venta-exitosa": "yape/13_ticket.png",
  "yape-ajustes": "yape/10_estado.png",
  bienvenida: "07_bienvenida.png",
  configura: "08_configura.png",
};

// Bisel: gris oscuro neutro (el fondo del video es azul, con mucho más azul que rojo)
const isDark = (d, i) => Math.max(d[i], d[i + 1], d[i + 2]) < 80 && d[i + 2] - d[i] < 30;

/** Busca el borde (bisel oscuro) del celular y devuelve el rectángulo de la pantalla. */
async function screenRect(file) {
  const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  const at = (x, y) => (y * W + x) * C;
  const run = 4; // píxeles oscuros seguidos para considerar que es bisel

  // 1) bordes izquierdo/derecho sobre una línea horizontal a ~78 % de alto
  const y0 = Math.round(H * 0.78);
  const scanX = (from, step) => {
    let x = from, count = 0;
    while (x >= 0 && x < W) {
      count = isDark(data, at(x, y0)) ? count + 1 : 0;
      if (count >= run) break;
      x += step;
    }
    while (x >= 0 && x < W && isDark(data, at(x, y0))) x += step; // atraviesa el bisel
    return x;
  };
  const left = scanX(0, 1);
  const right = scanX(W - 1, -1);

  // 2) bordes superior/inferior sobre una línea vertical a 1/4 del ancho de la pantalla (evita la cámara)
  const x0 = Math.round(left + (right - left) * 0.25);
  const scanY = (from, step, limit) => {
    let y = from, count = 0;
    while (y !== limit) {
      count = isDark(data, at(x0, y)) ? count + 1 : 0;
      if (count >= run) break;
      y += step;
    }
    if (y === limit) return null;
    while (y !== limit && isDark(data, at(x0, y))) y += step;
    return y;
  };
  const bottom = scanY(H - 1, -1, 0) ?? H;
  // Mientras el celular entra animado, el borde superior puede confundirse con el titular:
  // la pantalla de la app mide ~1 : 2,14, así que se calcula desde el borde inferior.
  const SCREEN_RATIO = 2.143;
  const detectedTop = scanY(Math.round(H * 0.1), 1, H - 1) ?? 0;
  const top = bottom < H ? Math.max(detectedTop, bottom - Math.round((right - left) * SCREEN_RATIO)) : detectedTop;
  const inset = 3; // quita el antialias del borde
  return { left: left + inset, top: top + inset, width: right - left - inset * 2, height: bottom - top - inset * 2 };
}

const ff = spawnSync("ffmpeg", ["-version"], { stdio: "ignore" }).status === 0 ? "ffmpeg" : ffmpegStatic;

for (const [name, t] of Object.entries(fromVideo)) {
  const frame = path.join(TMP, `${name}.png`);
  const r = spawnSync(ff, ["-v", "error", "-y", "-ss", String(t), "-i", VIDEO, "-frames:v", "1", frame]);
  if (r.status !== 0 || !existsSync(frame)) {
    console.warn(`  TODO: no se pudo extraer ${name}`);
    continue;
  }
  const rect = await screenRect(frame);
  await sharp(frame).extract(rect).png().toFile(path.join(OUT, `${name}.png`));
  console.log(`  ${name}: ${rect.width}×${rect.height} @ ${rect.left},${rect.top}`);
}

for (const [name, file] of Object.entries(fromManual)) {
  const src = path.join(MANUAL, file);
  if (!existsSync(src)) {
    console.warn(`  TODO: falta ${src}`);
    continue;
  }
  copyFileSync(src, path.join(OUT, `${name}.png`));
  console.log(`  ${name}: copia de ${file}`);
}

rmSync(TMP, { recursive: true, force: true });
