import type { MetadataRoute } from 'next'

// Web App Manifest (D109, P0.1 of docs/silnik/pwa-plan-v1_0.md).
// Served by Next as a static route at /manifest.webmanifest.
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Inżynier Szkieletowy Pro',
    short_name: 'Szkielet Pro',
    description: 'Kalkulator konstrukcji domów szkieletowych dla samodzielnych budowniczych.',
    lang: 'pl',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#12151c',
    theme_color: '#12151c',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
