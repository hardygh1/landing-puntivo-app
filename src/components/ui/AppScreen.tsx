import { PhoneFrame } from "@/components/decor/PhoneFrame";
import { Picture } from "./Picture";

export type ScreenName =
  | "venta"
  | "catalogo"
  | "metodos"
  | "qr-yape"
  | "yape-recibido"
  | "yape-ajustes"
  | "venta-exitosa"
  | "inventario"
  | "stock"
  | "clientes"
  | "historial"
  | "etiquetas-seleccion"
  | "bienvenida"
  | "configura";

// Captura real de la app dentro de un marco de celular.
export function AppScreen({
  name,
  alt,
  sizes = "(min-width: 768px) 300px, 260px",
  priority = false,
  className = "",
}: {
  name: ScreenName;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <PhoneFrame className={className}>
      <Picture
        name={`pantalla-${name}`}
        widths={[320, 480, 720]}
        width={720}
        height={1560}
        alt={alt}
        sizes={sizes}
        priority={priority}
        className="h-full w-full object-cover object-top"
      />
    </PhoneFrame>
  );
}
