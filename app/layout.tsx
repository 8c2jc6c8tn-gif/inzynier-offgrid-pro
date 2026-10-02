import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { headers } from 'next/headers'
import { Caveat, Inter, JetBrains_Mono, Lato, Roboto, Source_Sans_3, Source_Serif_4 } from 'next/font/google'
import { AsystentAi } from '@/components/asystent-ai'
import { BazaWersjaListener } from '@/components/pwa/baza-wersja-listener'
import { Powiadomienia } from '@/components/pwa/powiadomienia'
import { SwRejestracja } from '@/components/pwa/sw-rejestracja'
import { LanguageProvider } from '@/lib/i18n/language-context'
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '@/lib/i18n/language'
import { STORAGE_KEY } from '@/lib/i18n/storage'
import { generujCssStylow, schematyStylow } from '@/lib/wyglad/style'
import './globals.css'

// latin-ext = polskie znaki diakrytyczne (ą ć ę ł ń ó ś ź ż) — bez tego subsetu nie renderują się
// poprawnie. Wagi 400-700 pod przełącznik "pogrubiona" w lib/wyglad/storage.ts.
const inter = Inter({ subsets: ['latin', 'latin-ext'], weight: ['400', '500', '600', '700'], variable: '--font-inter' })
const sourceSans = Source_Sans_3({ subsets: ['latin', 'latin-ext'], weight: ['400', '500', '600', '700'], variable: '--font-source-sans' })
const roboto = Roboto({ subsets: ['latin', 'latin-ext'], weight: ['400', '500', '700'], variable: '--font-roboto' })
const lato = Lato({ subsets: ['latin', 'latin-ext'], weight: ['400', '700'], variable: '--font-lato' })
// Appearance styles (lib/wyglad/style.ts): serif headings/numbers and mono numbers. Both have Cyrillic
// (D63 open question — Fraunces/Instrument Serif do not, so the RU UI would fall back to Georgia).
// Variable fonts, not preloaded: only a page with such a style active downloads them.
const sourceSerif = Source_Serif_4({ subsets: ['latin', 'latin-ext', 'cyrillic'], variable: '--font-source-serif', preload: false })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin', 'latin-ext', 'cyrillic'], variable: '--font-jetbrains-mono', preload: false })
// Handwriting for „Notatnik inżyniera” headings and result only (D67) — Caveat has Cyrillic. Not preloaded.
const caveat = Caveat({ subsets: ['latin', 'latin-ext', 'cyrillic'], variable: '--font-caveat', preload: false })

// Every style's tokens, generated from the one table (D65/D67) — nothing per style in globals.css.
const STYLE_WYGLADU_CSS = generujCssStylow()

export const metadata: Metadata = {
  title: 'Inżynier Offgrid Pro',
  description:
    'Kalkulator/doradca inżynierski dla systemów off-grid PV (panele, magazyn energii, ogrzewanie, bezpieczeństwo).',
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
  // 5.3 — instalowalna PWA na iOS (Safari nie czyta manifest.webmanifest w pełni, potrzebuje
  // tych meta tagów osobno, żeby aplikacja otwierała się jako "standalone", nie w pasku Safari).
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Offgrid Pro',
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
// CSP (proxy.ts, docs/standards/07-bezpieczenstwo.md 7.3) dopuszcza ten inline <script>
// przez nonce-per-request (atrybut `nonce` niżej) — nie hash, żeby nie kolidować z inline-
// skryptami RSC streaming Next.js, które też potrzebują tego samego nonce'u.
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
      // Appearance style: same logic as lib/wyglad/storage.ts + lib/theme/storage.ts — the style's
      // fixed scheme replaces the light/dark class set above.
      var schematy = ${JSON.stringify(schematyStylow())};
      if (typeof stan.styl === 'string' && schematy.hasOwnProperty(stan.styl)) {
        root.setAttribute('data-styl', stan.styl);
        root.setAttribute('data-schemat-stylu', schematy[stan.styl]);
        root.classList.remove('light', 'dark');
        root.classList.add(schematy[stan.styl]);
      }
    }
  } catch (e) {}

  // Glass styles (lib/wyglad/style.ts, D66): no backdrop blur on a weak device — little memory or
  // cores, or data saver on. Thresholds are an AI choice (to confirm), not a measured limit.
  try {
    var n = window.navigator;
    if ((n.deviceMemory && n.deviceMemory < 4) || (n.hardwareConcurrency && n.hardwareConcurrency < 4) || (n.connection && n.connection.saveData)) {
      document.documentElement.setAttribute('data-bez-rozmycia', '');
    }
  } catch (e) {}
})();
`

// Atrybut <html lang> — docs/standards/17-i18n.md, 17.4 (korekta offline-first, "Rozróżnienie
// atrybut vs treść"): tani wariant, sam wzorzec jak WYGLAD_INIT_SCRIPT wyżej (czysty JS przed
// hydracją, żaden import z lib/i18n — ten skrypt biegnie zanim React się załaduje). Widoczna
// treść UI (tłumaczenia w komponentach) nie jest tu rozwiązywana — koryguje się dopiero po
// hydracji przez lib/i18n/storage.ts (useSyncExternalStore), patrz docs/memory.md, "Znane luki
// do domknięcia" — jawnie ujawniona, zaakceptowana konsekwencja zerowej zależności od serwera.
const JEZYK_INIT_SCRIPT = `
(function () {
  try {
    var OBSLUGIWANE = ${JSON.stringify(SUPPORTED_LANGUAGES)};
    var zapisany = window.localStorage.getItem('${STORAGE_KEY}');
    var jezyk = null;
    if (zapisany && OBSLUGIWANE.indexOf(zapisany) !== -1) {
      jezyk = zapisany;
    } else {
      var listy = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || ''];
      for (var i = 0; i < listy.length; i++) {
        var kod = String(listy[i]).toLowerCase().split('-')[0];
        if (OBSLUGIWANE.indexOf(kod) !== -1) { jezyk = kod; break; }
      }
    }
    if (jezyk) document.documentElement.lang = jezyk;
  } catch (e) {}
})();
`

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Nonce wygenerowany per żądanie w proxy.ts (docs/standards/07-bezpieczenstwo.md, 7.3) —
  // dokładany do WŁASNYCH inline-skryptów tego layoutu; Next.js dokłada go automatycznie do
  // swoich własnych (RSC streaming), bo wykrywa go w nagłówku Content-Security-Policy.
  const nonce = (await headers()).get('x-nonce') ?? undefined

  return (
    <html
      lang={DEFAULT_LANGUAGE}
      suppressHydrationWarning
      className={`${inter.variable} ${sourceSans.variable} ${roboto.variable} ${lato.variable} ${sourceSerif.variable} ${jetbrainsMono.variable} ${caveat.variable}`}
    >
      <head>
        <style id="style-wygladu" dangerouslySetInnerHTML={{ __html: STYLE_WYGLADU_CSS }} />
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: WYGLAD_INIT_SCRIPT }} />
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: JEZYK_INIT_SCRIPT }} />
      </head>
      <body className="antialiased">
        <LanguageProvider>
          {children}
          <AsystentAi />
          <Powiadomienia />
          {/* IndexedDB schema-version conflicts between tabs (standard 5.11) → reload toast. */}
          <BazaWersjaListener />
          {/* Service worker (D59): registers itself in production only and offers updates as a toast. */}
          <SwRejestracja />
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </LanguageProvider>
      </body>
    </html>
  )
}
