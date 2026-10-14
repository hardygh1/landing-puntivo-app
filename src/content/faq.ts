import { site } from "@/config/site";

export type FaqItem = { q: string; a: string };

// Una sola fuente de verdad: alimenta el acordeón y el JSON-LD FAQPage.
export const faq: FaqItem[] = [
  {
    q: "¿Necesito internet para usar Puntivo?",
    a: "No. Vendes, cobras y controlas tu stock y tu caja sin señal: todo se guarda en tu celular. Solo necesitas conexión para enviar el ticket por WhatsApp o para que Yape te notifique un pago.",
  },
  {
    q: "¿En qué celulares funciona?",
    a: "En celulares Android con cámara para escanear códigos. Por ahora no está disponible para iPhone. Prueba la demo en tu propio celular antes de activarla.",
  },
  {
    q: "¿Es seguro instalar el APK?",
    a: `Sí. Puntivo todavía no está en Play Store, por eso Android te pide permiso para instalarla y Play Protect puede mostrar "app no verificada": es un aviso normal. Descárgala solo desde esta página o desde nuestro WhatsApp (${site.whatsapp.display}).`,
  },
  {
    q: "¿Qué pasa con mis datos cuando termina la demo?",
    a: `A los ${site.demoApk.trialDays} días la demo se bloquea, pero tus datos se quedan en tu celular. Al activarla con tu clave sigues donde te quedaste.`,
  },
  {
    q: "¿Cómo cobro con Yape o Plin?",
    a: "Al cobrar, Puntivo muestra el QR de tu negocio con el monto exacto y confirmas la venta con un toque. En la app activada, la confirmación de Yape es automática: Puntivo lee la notificación de Yape en ese mismo celular. Con Plin siempre confirmas tú.",
  },
  {
    q: "Mis productos no tienen código de barras, ¿igual me sirve?",
    a: "Sí. Los buscas por nombre o Puntivo les crea un código interno para imprimir sus etiquetas (necesitas una impresora de etiquetas).",
  },
  {
    q: "¿Cómo pago y activo la app?",
    a: `Escríbenos por WhatsApp al ${site.whatsapp.display}. Te contamos las opciones y te enviamos tu clave de activación.`,
  },
];
