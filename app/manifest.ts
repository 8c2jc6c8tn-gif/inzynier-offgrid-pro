import type { MetadataRoute } from "next"

/**
 * Next.js Metadata File convention — generuje /manifest.webmanifest, link w <head> dołączany
 * automatycznie (bez wpisu w `app/layout.tsx`). docs/standards/05-baza-danych-offline.md, 5.3.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Inżynier Offgrid Pro",
    short_name: "Offgrid Pro",
    description:
      "Kalkulator/doradca inżynierski dla systemów off-grid PV (panele, magazyn energii, ogrzewanie, bezpieczeństwo).",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  }
}
