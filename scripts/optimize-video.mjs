// Comprime el video vertical para la web (≈ 6–8 MB) usando ffmpeg.
// Usa el ffmpeg del sistema si existe; si no, el binario de la devDependency ffmpeg-static.
// Uso: npm run optimize:video  [ruta-entrada]   (por defecto assets-src/Puntivo_TikTok.mp4)
import { spawnSync } from "node:child_process";
import { mkdirSync, statSync } from "node:fs";
import path from "node:path";
import ffmpegStatic from "ffmpeg-static";

const input = process.argv[2] ?? "assets-src/Puntivo_TikTok.mp4";
const output = "public/video/puntivo-tiktok.mp4";
mkdirSync(path.dirname(output), { recursive: true });

const hasSystem = spawnSync("ffmpeg", ["-version"], { stdio: "ignore" }).status === 0;
const bin = hasSystem ? "ffmpeg" : ffmpegStatic;

const args = [
  "-y", "-i", input,
  "-vf", "scale=720:-2",
  "-c:v", "libx264", "-preset", "slow", "-crf", "28", "-profile:v", "main", "-pix_fmt", "yuv420p",
  "-movflags", "+faststart",
  "-c:a", "aac", "-b:a", "96k",
  output,
];
console.log(`${bin} ${args.join(" ")}`);
const r = spawnSync(bin, args, { stdio: "inherit" });
if (r.status !== 0) process.exit(r.status ?? 1);
console.log(`Listo: ${output} (${(statSync(output).size / 1048576).toFixed(1)} MB)`);
