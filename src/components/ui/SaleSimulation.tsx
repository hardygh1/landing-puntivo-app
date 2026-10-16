"use client";

import { useEffect, useRef, useState } from "react";
import {
  Archive,
  ArrowLeft,
  Banknote,
  Bell,
  Check,
  ChevronRight,
  CircleCheck,
  CreditCard,
  HandCoins,
  History,
  House,
  LayoutGrid,
  MessageSquare,
  Minus,
  Pause,
  Plus,
  Settings,
  Share2,
  Smartphone,
  Split,
  Trash2,
  UserSearch,
  Zap,
} from "lucide-react";
import { PhoneFrame } from "@/components/decor/PhoneFrame";

// Simulación animada de una venta en Puntivo POS (escanear → cobrar con Yape → venta exitosa), en bucle.
// Todo se dibuja con HTML/CSS en unidades cqw para escalar con el marco del celular.

const products = [
  { name: "Inca Kola 500 ml", code: "7751271000012", price: 3.5, stock: 21, emoji: "🥤" },
  { name: "Billetera RC", code: "200000000001", price: 38, stock: 8, emoji: "👛" },
];

// Fases del guion y cuánto dura cada una (ms)
const phases = [
  { id: "scan", ms: 1500 },
  { id: "item1", ms: 1500 },
  { id: "item2", ms: 1700 },
  { id: "tapCobrar", ms: 750 },
  { id: "pay", ms: 900 },
  { id: "yape", ms: 1700 },
  { id: "received", ms: 1500 },
  { id: "success", ms: 3400 },
] as const;

// Fase que se muestra sin JS y con movimiento reducido: carrito completo
const STATIC_PHASE = 2;

const money = (n: number) => `S/ ${n.toFixed(2)}`;

function useCountUp(target: number, ms = 450) {
  const [value, setValue] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const start = performance.now();
    const origin = from.current;
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / ms);
      const v = origin + (target - origin) * (1 - (1 - k) ** 3);
      from.current = v;
      setValue(v);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return value;
}

// QR decorativo 21×21 determinista (no codifica nada)
const QR_N = 21;
const qrCells = (() => {
  const cells: [number, number][] = [];
  let seed = 7;
  const finder = (x: number, y: number) =>
    [0, QR_N - 7].some((ox) => [0, QR_N - 7].some((oy) => !(ox && oy) && x >= ox && x < ox + 7 && y >= oy && y < oy + 7));
  for (let y = 0; y < QR_N; y++)
    for (let x = 0; x < QR_N; x++) {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      if (!finder(x, y) && seed % 100 < 48) cells.push([x, y]);
    }
  return cells;
})();

function FakeQr() {
  const finder = (x: number, y: number) => (
    <g key={`${x}-${y}`}>
      <rect x={x} y={y} width={7} height={7} />
      <rect x={x + 1} y={y + 1} width={5} height={5} fill="white" />
      <rect x={x + 2} y={y + 2} width={3} height={3} />
    </g>
  );
  return (
    <svg viewBox={`0 0 ${QR_N} ${QR_N}`} className="h-full w-full" shapeRendering="crispEdges">
      {qrCells.map(([x, y]) => (
        <rect key={`${x}.${y}`} x={x} y={y} width={1} height={1} />
      ))}
      {finder(0, 0)}
      {finder(QR_N - 7, 0)}
      {finder(0, QR_N - 7)}
    </svg>
  );
}

function StatusBar({ light = false }: { light?: boolean }) {
  return (
    <div className={`flex items-center justify-between px-[6cqw] pt-[2.5cqw] text-[3.6cqw] font-semibold ${light ? "text-white" : "text-navy"}`}>
      <span>10:30</span>
      <span className="size-[3.6cqw] rounded-full bg-navy/90" />
      <span className="flex items-end gap-[0.6cqw]">
        {[1.4, 2.2, 3].map((h) => (
          <span key={h} className={`w-[0.9cqw] rounded-sm ${light ? "bg-white" : "bg-navy"}`} style={{ height: `${h}cqw` }} />
        ))}
        <span className={`ml-[0.8cqw] h-[2.6cqw] w-[4.6cqw] rounded-[0.6cqw] ${light ? "bg-white" : "bg-navy"}`} />
      </span>
    </div>
  );
}

function Tap({ className }: { className: string }) {
  return (
    <span aria-hidden="true" className={`pointer-events-none absolute z-20 ${className}`}>
      <span className="sim-tap block size-[11cqw] rounded-full bg-navy/25 ring-[0.8cqw] ring-white/80" />
    </span>
  );
}

export function SaleSimulation({ className = "" }: { className?: string }) {
  const [phase, setPhase] = useState<number>(STATIC_PHASE);
  const [visible, setVisible] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setPhase((p) => (p + 1) % phases.length), phases[phase].ms);
    return () => clearTimeout(t);
  }, [phase, visible]);

  const id = phases[phase].id;
  const items = phase >= 2 ? 2 : phase >= 1 ? 1 : 0;
  const cart = products.slice(0, items);
  const total = cart.reduce((s, p) => s + p.price, 0);
  const shownTotal = useCountUp(total);
  const screen = phase <= 3 ? "venta" : phase <= 6 ? "cobrar" : "exito";
  // Al reiniciar el bucle (y mientras la pantalla de éxito tapa todo) las pantallas se reubican sin deslizar
  const snap = phase === 0 || phase === phases.length - 1 ? "transition-none" : "transition-transform duration-500 ease-out";
  const yapeOn = phase >= 5;

  return (
    <div ref={root} className={className}>
      <PhoneFrame>
        <div
          role="img"
          aria-label="Simulación de una venta en Puntivo POS: se escanean una Inca Kola y una billetera, el total llega a S/ 41.50, se cobra con Yape y aparece la venta exitosa"
          className="@container absolute inset-0 overflow-hidden bg-[#f5f6fb] text-navy select-none"
        >
          <div aria-hidden="true" className="contents">
            {/* ===== Pantalla Venta ===== */}
            <div className={`absolute inset-0 flex flex-col ${snap} ${screen === "venta" ? "translate-x-0" : "-translate-x-full"}`}>
              <StatusBar />
              <div className="flex items-center gap-[2cqw] px-[4.5cqw] pt-[3cqw]">
                <span className="font-display text-[7cqw] font-extrabold">Venta</span>
                <span className="rounded-[1.5cqw] bg-accent/20 px-[2cqw] py-[0.6cqw] text-[2.6cqw] leading-tight font-bold text-[#0a8a4a]">
                  CAJA ABIERTA
                  <br />
                  <span className="font-semibold">Ana</span>
                </span>
                <Bell className="ml-auto size-[5.5cqw]" strokeWidth={2} />
              </div>

              {/* Cámara */}
              <div className="relative mx-[3.5cqw] mt-[3cqw] h-[36cqw] overflow-hidden rounded-[4cqw] bg-[#1c2230]">
                <span className="absolute top-[2.5cqw] left-[2.5cqw] flex items-center gap-[1.2cqw] rounded-full bg-black/45 px-[2cqw] py-[0.8cqw] text-[2.6cqw] text-white">
                  <span className="size-[1.6cqw] rounded-full bg-accent" /> Cámara lista para escanear
                </span>
                <span className="absolute top-[2.5cqw] right-[2.5cqw] flex gap-[1.5cqw] text-white/80">
                  <Zap className="size-[4.5cqw]" />
                  <Pause className="size-[4.5cqw]" />
                </span>
                <div className="absolute top-1/2 left-1/2 h-[19cqw] w-[48cqw] -translate-x-1/2 -translate-y-[45%] -rotate-3 rounded-[1.5cqw] bg-[#f4f1e8] p-[1.6cqw] shadow-lg">
                  <div className="h-[12cqw] bg-[repeating-linear-gradient(90deg,#111_0_2px,transparent_2px_4px,#111_4px_5px,transparent_5px_8px,#111_8px_11px,transparent_11px_12px)]" />
                  <p className="mt-[0.4cqw] text-center font-mono text-[2.6cqw] leading-none">{products[Math.min(items, 1)].code}</p>
                </div>
                {/* Marco y láser */}
                <div className={`absolute inset-x-[14cqw] inset-y-[7cqw] rounded-[2cqw] border-[0.7cqw] transition-colors duration-200 ${id === "item1" || id === "item2" ? "sim-flash border-accent" : "border-accent/70"}`}>
                  <span className="sim-laser absolute inset-x-[1cqw] h-[0.6cqw] rounded-full bg-accent shadow-[0_0_8px_2px_rgb(0_230_118/0.7)]" />
                </div>
                <span className="absolute inset-x-0 bottom-[1.8cqw] text-center text-[2.7cqw] text-white/90">Alinea el código de barras en el marco</span>
              </div>

              {/* Carrito */}
              <div className="flex items-center gap-[2cqw] px-[4.5cqw] pt-[3.5cqw]">
                <span className="text-[4.3cqw] font-bold">Carrito actual</span>
                <span className="rounded-full bg-brand/10 px-[2cqw] py-[0.3cqw] text-[2.8cqw] font-bold text-brand">{items} items</span>
                <span className="ml-auto flex items-center gap-[1cqw] text-[3.2cqw] font-semibold text-danger">
                  <Trash2 className="size-[3.6cqw]" /> Vaciar
                </span>
              </div>
              <div className="flex min-h-0 flex-1 flex-col gap-[2.5cqw] px-[3.5cqw] pt-[2.5cqw]">
                {cart.length === 0 && (
                  <div className="grid h-[22cqw] place-items-center rounded-[3cqw] border-[0.4cqw] border-dashed border-navy/15 text-[3.2cqw] text-ink-soft">
                    Escanea un producto para empezar
                  </div>
                )}
                {cart.map((p) => (
                  <div key={p.code} className="sim-pop flex items-center gap-[2.5cqw] rounded-[3cqw] bg-white p-[2.5cqw] shadow-[0_2px_8px_-4px_rgb(11_18_32/0.2)]">
                    <span className="grid size-[11cqw] shrink-0 place-items-center rounded-[2cqw] bg-surface text-[7cqw]">{p.emoji}</span>
                    <div className="min-w-0 flex-1 leading-tight">
                      <p className="truncate text-[3.6cqw] font-bold">{p.name}</p>
                      <p className="text-[2.7cqw] text-ink-soft">{p.code}</p>
                      <p className="mt-[0.8cqw] flex items-center gap-[1.5cqw] text-[3cqw] font-semibold">
                        {money(p.price)}
                        <span className="rounded-[1cqw] bg-accent/20 px-[1.4cqw] text-[2.5cqw] text-[#0a8a4a]">Stock {p.stock}</span>
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-[1.2cqw]">
                      <span className="flex items-center gap-[1.5cqw] text-[3.4cqw] font-bold">
                        <Minus className="size-[5cqw] rounded-[1.2cqw] bg-surface p-[0.8cqw]" />1
                        <Plus className="size-[5cqw] rounded-[1.2cqw] bg-brand/10 p-[0.8cqw] text-brand" />
                      </span>
                      <span className="text-[3.6cqw] font-bold">{money(p.price)}</span>
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-[2.5cqw] rounded-[3cqw] bg-brand/8 px-[3cqw] py-[3cqw] text-[3.4cqw] font-semibold text-brand">
                  <Plus className="size-[5cqw] rounded-full bg-brand p-[0.8cqw] text-white" /> Agregar producto
                </div>
              </div>

              {/* Totales */}
              <div className="relative rounded-t-[5cqw] bg-white px-[4.5cqw] pt-[3cqw] pb-[2cqw] shadow-[0_-6px_16px_-10px_rgb(11_18_32/0.25)]">
                <div className="flex items-end justify-between">
                  <span className="text-[3cqw] text-ink-soft">{items} productos</span>
                  <span className="text-[3.2cqw] font-semibold">
                    Total <span className="font-display text-[6.5cqw] font-extrabold tabular-nums">{money(shownTotal)}</span>
                  </span>
                </div>
                <div className={`relative mt-[2cqw] flex h-[11cqw] items-center justify-center rounded-[3.5cqw] bg-brand text-[3.8cqw] font-bold text-white transition-transform duration-150 ${id === "tapCobrar" ? "scale-95" : ""}`}>
                  Cobrar {money(total)}
                  <ChevronRight className="absolute right-[3cqw] size-[4.5cqw]" />
                </div>
                {id === "tapCobrar" && <Tap className="right-[50%] bottom-[7.5cqw]" />}
                <div className="mt-[2.5cqw] flex justify-between px-[1cqw] text-[2.5cqw] text-ink-soft">
                  {[
                    [House, "Venta"],
                    [LayoutGrid, "Catálogo"],
                    [Archive, "Inventario"],
                    [History, "Historial"],
                    [Settings, "Ajustes"],
                  ].map(([Icon, label], i) => {
                    const I = Icon as typeof House;
                    return (
                      <span key={label as string} className={`flex flex-col items-center gap-[0.5cqw] ${i === 0 ? "font-semibold text-brand" : ""}`}>
                        <I className="size-[4.8cqw]" />
                        {label as string}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ===== Pantalla Cobrar ===== */}
            <div className={`absolute inset-0 flex flex-col ${snap} ${screen === "venta" ? "translate-x-full" : "translate-x-0"}`}>
              <StatusBar />
              <div className="flex items-center gap-[4cqw] px-[4.5cqw] pt-[3.5cqw]">
                <ArrowLeft className="size-[5.5cqw]" />
                <span className="font-display text-[5.8cqw] font-extrabold">Cobrar</span>
              </div>
              <p className="px-[4.5cqw] pt-[3cqw] text-[3.6cqw] font-bold">Cliente</p>
              <div className="flex items-center gap-[2cqw] px-[4.5cqw] pt-[1.5cqw]">
                <span className="flex items-center gap-[1.5cqw] rounded-[2.5cqw] bg-white px-[2.5cqw] py-[1.8cqw] text-[3cqw] font-semibold text-brand shadow-sm">
                  <UserSearch className="size-[4cqw]" /> Seleccionar cliente
                </span>
                <span className="flex items-center gap-[1cqw] rounded-full bg-accent/15 px-[2cqw] py-[1cqw] text-[2.7cqw] font-semibold text-[#0a8a4a]">
                  <CircleCheck className="size-[3.2cqw]" /> Cliente ocasional
                </span>
              </div>
              <p className="px-[4.5cqw] pt-[3.5cqw] text-[3.6cqw] font-bold">Método de pago</p>
              <div className="relative grid grid-cols-3 gap-[2.5cqw] px-[4.5cqw] pt-[2cqw]">
                {[
                  [Banknote, "Efectivo"],
                  [Smartphone, "Yape / Plin"],
                  [CreditCard, "Tarjeta"],
                  [Split, "Mixto"],
                  [HandCoins, "Crédito"],
                ].map(([Icon, label]) => {
                  const I = Icon as typeof House;
                  const on = label === "Yape / Plin" && yapeOn;
                  return (
                    <span
                      key={label as string}
                      className={`flex h-[17cqw] flex-col items-center justify-center gap-[1.2cqw] rounded-[3cqw] text-[3cqw] font-semibold transition-colors duration-200 ${on ? "bg-brand/10 text-brand ring-[0.5cqw] ring-brand" : "bg-white shadow-sm"}`}
                    >
                      <I className="size-[5.5cqw] text-brand" />
                      {label as string}
                    </span>
                  );
                })}
                {id === "yape" && <Tap className="top-[11cqw] left-[50%]" />}
              </div>
              <div className="mx-[4.5cqw] mt-[3.5cqw] rounded-[3cqw] bg-white/60 px-[3cqw] py-[2cqw]">
                <p className="text-[3cqw] text-ink-soft">Total a pagar</p>
                <p className="font-display text-[6.5cqw] font-extrabold">{money(total)}</p>
              </div>
              <div
                className={`mx-[4.5cqw] mt-[3cqw] origin-top rounded-[3.5cqw] bg-white p-[3cqw] text-center ring-[0.4cqw] ring-yape/25 transition-all duration-500 ${yapeOn ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
              >
                <p className="text-[3.2cqw] font-bold text-yape">QR de Yape</p>
                <div className="mx-auto mt-[2cqw] size-[30cqw] rounded-[2cqw] bg-white p-[1.5cqw] ring-[0.3cqw] ring-navy/10">
                  <FakeQr />
                </div>
                <p className="mt-[1.5cqw] text-[2.9cqw] text-ink-soft">Yapea exactamente</p>
                <p className="font-display text-[6cqw] font-extrabold text-yape">{money(total)}</p>
              </div>
              <div
                className={`absolute inset-x-[3.5cqw] bottom-[18cqw] flex items-center gap-[2cqw] rounded-[3cqw] bg-[#12b76a] px-[3cqw] py-[2.5cqw] text-[3.1cqw] font-semibold text-white shadow-lg transition-all duration-400 ${id === "received" ? "translate-y-0 opacity-100" : "translate-y-[6cqw] opacity-0"}`}
              >
                <CircleCheck className="size-[4.8cqw] shrink-0" /> Yape recibido: {money(total)} de Cliente
              </div>
              <div
                className={`absolute inset-x-[3.5cqw] bottom-[4cqw] flex h-[11cqw] items-center justify-center gap-[1.5cqw] rounded-[3.5cqw] text-[3.8cqw] font-bold text-white transition-colors duration-300 ${yapeOn ? "bg-whatsapp" : "bg-whatsapp/50"}`}
              >
                <Check className="size-[4.5cqw]" /> Confirmar venta
              </div>
            </div>

            {/* ===== Pantalla Venta exitosa ===== */}
            <div className={`absolute inset-0 z-10 flex flex-col bg-[#f5f6fb] transition-opacity duration-500 ${screen === "exito" ? "opacity-100" : "pointer-events-none opacity-0"}`}>
              <div className="rounded-b-[7cqw] bg-[linear-gradient(160deg,#1f2bd6,#2b3bff_55%,#4f5bff)] pb-[12cqw] text-center text-white">
                <StatusBar light />
                <div className={`mx-auto mt-[7cqw] grid size-[17cqw] place-items-center rounded-full border-[1.2cqw] border-accent ${screen === "exito" ? "sim-pop" : ""}`}>
                  <svg viewBox="0 0 24 24" className="size-[9cqw]" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12.5l4.5 4.5L19 7.5" className={screen === "exito" ? "sim-draw" : ""} />
                  </svg>
                </div>
                <p className="mt-[4cqw] font-display text-[6cqw] font-extrabold">¡Venta exitosa!</p>
                <p className="font-display text-[9cqw] leading-tight font-black">{money(41.5)}</p>
                <p className="text-[3.2cqw] text-white/85">Yape / Plin</p>
              </div>
              <div className={`mx-[6cqw] -mt-[7cqw] bg-white px-[4cqw] py-[3.5cqw] font-mono text-[2.8cqw] leading-relaxed shadow-md transition-transform delay-200 duration-700 ${screen === "exito" ? "translate-y-0" : "-translate-y-[10cqw]"}`}>
                <p className="text-center text-[3.3cqw] font-bold">MI BODEGA</p>
                <p className="text-center text-ink-soft">NOTA DE VENTA N° NV-000444</p>
                <div className="my-[1.5cqw] border-t border-dashed border-navy/30" />
                {products.map((p) => (
                  <p key={p.code} className="flex justify-between">
                    <span>1 x {p.name}</span>
                    <span>{p.price.toFixed(2)}</span>
                  </p>
                ))}
                <div className="my-[1.5cqw] border-t border-dashed border-navy/30" />
                <p className="flex justify-between text-[3.3cqw] font-bold">
                  <span>TOTAL</span>
                  <span>{money(41.5)}</span>
                </p>
                <p className="flex justify-between text-ink-soft">
                  <span>Pago</span>
                  <span>Yape / Plin</span>
                </p>
                <p className="mt-[1.5cqw] text-center">¡Gracias por su compra!</p>
              </div>
              <div className="mt-auto grid grid-cols-2 gap-[2.5cqw] px-[3.5cqw]">
                <span className="flex flex-col items-center gap-[0.5cqw] rounded-[3cqw] bg-white py-[2cqw] text-[2.9cqw] font-semibold text-brand shadow-sm">
                  <Share2 className="size-[4.5cqw]" /> Compartir PDF
                </span>
                <span className="flex flex-col items-center gap-[0.5cqw] rounded-[3cqw] bg-white py-[2cqw] text-[2.9cqw] font-semibold text-whatsapp shadow-sm">
                  <MessageSquare className="size-[4.5cqw]" /> WhatsApp
                </span>
              </div>
              <div className="mx-[3.5cqw] mt-[2.5cqw] mb-[4cqw] flex h-[11cqw] items-center justify-center rounded-[3.5cqw] bg-brand text-[3.8cqw] font-bold text-white">
                Nueva venta
              </div>
            </div>
          </div>
        </div>
      </PhoneFrame>
    </div>
  );
}
