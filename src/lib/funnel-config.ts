// Configuración central del funnel: pixel, VSL y enlace de compra.
// Rellena estos valores (o define las variables VITE_* en el entorno).

const env = import.meta.env as Record<string, string | undefined>;

export const funnelConfig = {
  /** ID del Meta (Facebook) Pixel. Ej: "123456789012345" */
  metaPixelId: env["VITE_META_PIXEL_ID"] ?? "",
  /** ID de Google Analytics 4. Ej: "G-XXXXXXX" */
  ga4Id: env["VITE_GA4_ID"] ?? "",
  /** ID del TikTok Pixel. */
  tiktokPixelId: env["VITE_TIKTOK_PIXEL_ID"] ?? "",

  /**
   * VSL: pega aquí el embed de la plataforma de video
   * (VTurb / Panda / YouTube / Vimeo).
   * - "iframe": url del embed
   * - "script": url del script de la plataforma + id del contenedor
   * - "none": muestra el reproductor provisional con la imagen
   */
  vsl: {
    mode: (env["VITE_VSL_MODE"] ?? "script") as "none" | "iframe" | "script",
    iframeUrl: env["VITE_VSL_IFRAME_URL"] ?? "",
    scriptUrl: env["VITE_VSL_SCRIPT_URL"] ?? "https://scripts.converteai.net/a5e18b5b-cadf-493a-90ca-c64211c2a5d5/players/6ab09f972be938f2b08c54f6/v4/player.js",
    containerId: env["VITE_VSL_CONTAINER_ID"] ?? "vid-6ab09f972be938f2b08c54f6",
  },

  /** Enlace de pago del botón final. Vacío = el botón no navega. */
  checkoutUrl: env["VITE_CHECKOUT_URL"] ?? "https://pay.hotmart.com/X107662105Q?bid=1789960657915",

  /**
   * true  = usar el botón propio del sitio (actual)
   * false = ocultar el botón y dejar que el CTA lo muestre la plataforma de video
   */
  useOwnCta: (env["VITE_USE_OWN_CTA"] ?? "true") !== "false",
} as const;
