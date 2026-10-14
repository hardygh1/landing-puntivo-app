// Textos de la landing. Frases cortas: la información la cuentan las pantallas reales de la app.
import type { HeroVariant } from "@/config/site";
import type { ScreenName } from "@/components/ui/AppScreen";

type HighlightColor = "accent" | "yape" | "plin";

export type HeroHeadline = { before: string; highlight: string; after: string; color: HighlightColor };

// Variantes del H1 para pruebas A/B (?v=a|b|c)
export const heroHeadlines: Record<HeroVariant, HeroHeadline> = {
  a: { before: "Convierte tu celular en un ", highlight: "punto de venta", after: "", color: "accent" },
  b: { before: "Vende, cobra con ", highlight: "Yape", after: " y controla tu bodega desde tu celular", color: "yape" },
  c: { before: "Deja el ", highlight: "cuaderno", after: ": tu bodega ordenada en tu celular", color: "accent" },
};

export const nav = [
  { href: "#funciones", label: "Funciones" },
  { href: "#como-funciona", label: "Cómo empezar" },
  { href: "#video", label: "Video" },
  { href: "#preguntas", label: "Preguntas" },
];

export const trustItems = [
  { key: "offline", title: "Sin internet", text: "Todo se guarda en tu celular" },
  { key: "yape", title: "Yape y Plin", text: "QR con el monto exacto" },
  { key: "peru", title: "Hecho para Perú", text: "Soles, fiado y bodega" },
  { key: "trial", title: "3 días gratis", text: "No pierdes tus datos" },
] as const;

export type TourItem = {
  id: string;
  tab: string;
  title: string;
  text: string;
  bullets: string[];
  screen: ScreenName;
  alt: string;
  /** Segunda pantalla opcional, más pequeña, junto a la principal */
  extra?: { screen: ScreenName; alt: string };
  note?: string;
};

// Recorrido por la app: una pestaña por tarea del día a día
export const tour: TourItem[] = [
  {
    id: "vender",
    tab: "Vender",
    title: "Vende en segundos",
    text: "Escanea el código con la cámara y el producto entra al carrito.",
    bullets: ["Lector de código de barras con bip", "Busca por nombre si no tiene código", "Cantidades y descuentos"],
    screen: "catalogo",
    alt: "Catálogo de productos de Puntivo POS con fotos, precios en soles y stock",
  },
  {
    id: "cobrar",
    tab: "Yape y Plin",
    title: "Cobra como te paguen",
    text: "Efectivo, Yape, Plin, tarjeta, pago mixto o fiado. Con Yape y Plin muestras tu QR con el monto exacto.",
    bullets: ["Calcula el vuelto en efectivo", "QR de Yape o Plin con el monto", "Ticket por WhatsApp o PDF"],
    screen: "qr-yape",
    alt: "Pantalla de cobro de Puntivo POS con el QR de Yape y el monto exacto de S/ 41.50",
    extra: { screen: "yape-recibido", alt: "Pantalla de cobro de Puntivo POS confirmando un Yape recibido automáticamente" },
    note: "La confirmación automática de Yape viene con la app activada (no en la demo): Puntivo lee la notificación de Yape en ese mismo celular y confirma la venta solo. Con Plin muestras el QR y confirmas la venta con un toque.",
  },
  {
    id: "stock",
    tab: "Stock",
    title: "Controla tu stock",
    text: "Sabes qué te queda y qué se está acabando.",
    bullets: ["Alertas de stock bajo y agotado", "Compras a proveedores", "Kardex de cada movimiento"],
    screen: "inventario",
    alt: "Panel de inventario de Puntivo POS con alerta de stock bajo, ingresos y salidas",
  },
  {
    id: "fiado",
    tab: "Fiado",
    title: "Fiado sin cuaderno",
    text: "Quién te debe, cuánto y desde cuándo.",
    bullets: ["Ventas al crédito por cliente", "Abonos parciales", "Clientes desde tus contactos"],
    screen: "clientes",
    alt: "Lista de clientes de Puntivo POS con lo que debe cada uno en soles",
  },
  {
    id: "caja",
    tab: "Caja",
    title: "Tu caja y tus ventas, claras",
    text: "Cierra el día con el resumen por medio de pago.",
    bullets: ["Caja por vendedor", "Historial y anulaciones", "Cuánto vendiste y ganaste"],
    screen: "historial",
    alt: "Historial de ventas de Puntivo POS con el total vendido y la lista de notas de venta",
  },
  {
    id: "etiquetas",
    tab: "Etiquetas",
    title: "¿Sin código? Puntivo le crea uno",
    text: "Imprime etiquetas con código de barras y vende escaneando, como en el súper.",
    bullets: ["Código interno EAN-13", "Rollo de 50×25, 40×30, 60×40 o 30×20 mm", "Imprime o comparte el PDF"],
    screen: "etiquetas-seleccion",
    alt: "Selección de productos en Puntivo POS para imprimir etiquetas con código de barras",
  },
];

export const businesses = [
  { key: "bodega", label: "Bodegas" },
  { key: "minimarket", label: "Minimarkets" },
  { key: "restaurante", label: "Restaurantes" },
  { key: "libreria", label: "Librerías y bazares" },
  { key: "ferreteria", label: "Ferreterías" },
  { key: "botica", label: "Boticas" },
  { key: "ropa", label: "Tiendas de ropa" },
  { key: "delivery", label: "Delivery" },
] as const;

// Funciones reales (JSON-LD featureList)
export const featureList = [
  "Venta con escáner de código de barras por cámara",
  "Cobro en efectivo con cálculo de vuelto, Yape, Plin, tarjeta, pago mixto y crédito (fiado)",
  "QR de Yape y Plin con el monto exacto",
  "Confirmación automática de Yape por notificación (app activada)",
  "Historial de Yapes recibidos",
  "Nota de venta en pantalla y PDF para compartir por WhatsApp",
  "Catálogo con fotos y categorías, clientes y proveedores",
  "Control de fiado y abonos parciales",
  "Inventario con alertas de stock bajo, compras y kardex",
  "Caja por vendedor con apertura, salidas y cierre",
  "Historial de ventas, anulaciones y resumen de ganancias",
  "Etiquetas con código de barras EAN-13 interno",
  "Funciona sin internet",
];
