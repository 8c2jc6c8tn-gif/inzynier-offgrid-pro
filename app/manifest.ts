import type { MetadataRoute } from "next"
import { headers } from "next/headers"
import { negocjujJezyk } from "@/lib/i18n/language"
import { t } from "@/lib/i18n/t"

/**
 * Next.js Metadata File convention — generuje /manifest.webmanifest, link w <head> dołączany
 * automatycznie (bez wpisu w `app/layout.tsx`). docs/standards/05-baza-danych-offline.md, 5.3.
 */
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  // Name/description per Accept-Language (reading headers makes the route dynamic, not cached).
  const jezyk = negocjujJezyk((await headers()).get("accept-language"))
  return {
    lang: jezyk,
    name: t(jezyk, "UI-META-NAZWA"),
    short_name: t(jezyk, "UI-META-NAZWA-KROTKA"),
    description: t(jezyk, "UI-META-OPIS"),
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      // Bob on the primary-colour square (D88): the face stays inside the 80% maskable safe zone,
      // so one file serves both the "any" and the "maskable" purpose.
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  }
}
