import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Lato, Roboto, Source_Sans_3 } from 'next/font/google'
import { LanguageProvider } from '@/lib/i18n/language-context'
import { getServerLanguage } from '@/lib/i18n/server-language'
import './globals.css'

// latin-ext = polskie znaki diakrytyczne (ą ć ę ł ń ó ś ź ż) — bez tego subsetu nie renderują się
// poprawnie. Wagi 400-700 pod przełącznik "pogrubiona" w lib/wyglad/storage.ts.
const inter = Inter({ subsets: ['latin', 'latin-ext'], weight: ['400', '500', '600', '700'], variable: '--font-inter' })
const sourceSans = Source_Sans_3({ subsets: ['latin', 'latin-ext'], weight: ['400', '500', '600', '700'], variable: '--font-source-sans' })
const roboto = Roboto({ subsets: ['latin', 'latin-ext'], weight: ['400', '500', '700'], variable: '--font-roboto' })
const lato = Lato({ subsets: ['latin', 'latin-ext'], weight: ['400', '700'], variable: '--font-lato' })

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

// Ustawia motyw, kolory i czcionkę na <html> synchronicznie, przed pierwszym malowaniem — bez
// tego byłby widoczny błysk domyślnego wyglądu przy odświeżeniu strony (lib/theme/storage.ts,
// lib/wyglad/storage.ts). Mapowanie grup kolorów zduplikowane tu w czystym JS celowo — ten skrypt
// biegnie przed hydracją Reacta, nie może importować modułów TS.
// CSP (next.config.mjs, docs/standards/07-bezpieczenstwo.md 7.3) dopuszcza ten inline <script>
// wyłącznie przez SHA-256 hash jego treści — zmiana treści wymaga przeliczenia hasha tam, inaczej
// produkcyjna CSP zablokuje skrypt po cichu (błysk domyślnego wyglądu, bez widocznego błędu).
const WYGLAD_INIT_SCRIPT = `
(function () {
  try {
    var tryb = window.localStorage.getItem('offgrid.theme.v1');
    if (tryb === 'light' || tryb === 'dark') {
      document.documentElement.classList.add(tryb);
    }
  } catch (e) {}

  try {
    var raw = window.localStorage.getItem('offgrid.wyglad.v1');
    if (raw) {
      var stan = JSON.parse(raw);
      var mapa = {
        tlo: ['--background'],
        karty: ['--card', '--popover'],
        tekst: ['--foreground', '--card-foreground', '--popover-foreground'],
        akcent: ['--primary'],
        sukces: ['--werdykt-ok'],
        uwaga: ['--werdykt-uwaga'],
        blad: ['--werdykt-blad'],
      };
      var root = document.documentElement;
      if (stan.kolory) {
        for (var grupa in mapa) {
          var wartosc = stan.kolory[grupa];
          if (typeof wartosc === 'string' && /^#[0-9a-fA-F]{6}$/.test(wartosc)) {
            mapa[grupa].forEach(function (zmienna) { root.style.setProperty(zmienna, wartosc); });
          }
        }
      }
      var zmienneCzcionek = { inter: '--font-inter', 'source-sans': '--font-source-sans', roboto: '--font-roboto', lato: '--font-lato' };
      if (stan.czcionka && zmienneCzcionek[stan.czcionka]) {
        root.style.setProperty('--font-sans-user', 'var(' + zmienneCzcionek[stan.czcionka] + ')');
      }
      if (stan.waga === 'pogrubiona') root.classList.add('czcionka-pogrubiona');
    }
  } catch (e) {}
})();
`

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Czytane z cookie `jezyk` (middleware.ts ustawia ją na pierwszej wizycie z Accept-Language,
  // docs/standards/17-i18n.md 17.4/17.4a) — server-rendered <html lang> i wartość początkowa
  // LanguageProvider są zgodne od pierwszego bajtu HTML, bez migotania złego języka.
  const language = await getServerLanguage()

  return (
    <html
      lang={language}
      suppressHydrationWarning
      className={`${inter.variable} ${sourceSans.variable} ${roboto.variable} ${lato.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: WYGLAD_INIT_SCRIPT }} />
      </head>
      <body className="antialiased">
        <LanguageProvider language={language}>
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </LanguageProvider>
      </body>
    </html>
  )
}
