/**
 * Rejestr 13 kafli pulpitu (+ Kafel 14 Ustawienia, osobno — `USTAWIENIA_KAFEL` niżej).
 * Kolejność domyślna i uzasadnienie: `docs/pulpit-i-nawigacja.md`, sekcja 2 (przepływ zależności
 * danych między modułami). To jest jedyne miejsce prawdy dla listy modułów i ich ekranów —
 * strona główna (`app/page.tsx`), strona modułu (`app/moduly/[id]/page.tsx`) i ustawienia
 * (`app/ustawienia/page.tsx`) czytają stąd, nie duplikują.
 */

export type EkranEntry = {
  href: string
  label: string
}

export type KafelEntry = {
  id: number
  nazwa: string
  opis: string
  ikona: string
  ekrany: EkranEntry[]
}

export const KAFLE: KafelEntry[] = [
  {
    id: 1,
    nazwa: "Lokalizacja i teren",
    opis: "Fundament: klimat, nasłonecznienie, strefy. Zasila prawie wszystkie pozostałe moduły.",
    ikona: "📍",
    ekrany: [{ href: "/kalkulatory/lokalizacja-i-klimat", label: "Lokalizacja i dane klimatyczne" }],
  },
  {
    id: 2,
    nazwa: "Zapotrzebowanie energetyczne",
    opis: "Bilans obciążeń — ile energii realnie potrzebujesz.",
    ikona: "⚡",
    ekrany: [
      { href: "/kalkulatory/systemy-podtrzymania-zycia", label: "Systemy podtrzymania życia" },
      { href: "/kalkulatory/pomocnicze", label: "Kalkulatory pomocnicze" },
    ],
  },
  {
    id: 3,
    nazwa: "Instalacja PV",
    opis: "Panele, stringi, konfiguracja instalacji fotowoltaicznej.",
    ikona: "☀️",
    ekrany: [
      { href: "/kalkulatory/konfigurator-stringow", label: "Konfigurator stringów" },
      { href: "/kalkulatory/czystosc-i-snieg", label: "Czystość i śnieg na panelach" },
    ],
  },
  {
    id: 4,
    nazwa: "Magazyn energii / baterie",
    opis: "Dobór i bezpieczeństwo magazynu energii.",
    ikona: "🔋",
    ekrany: [
      { href: "/kalkulatory/porownanie-technologii-magazynow", label: "Porównanie technologii magazynów" },
      { href: "/kalkulatory/dobor-bezpiecznika-dc", label: "Dobór bezpiecznika DC" },
      { href: "/kalkulatory/moment-dokrecania-srub", label: "Moment dokręcania śrub" },
    ],
  },
  {
    id: 5,
    nazwa: "Okablowanie i zabezpieczenia",
    opis: "Przekroje, trasy, ochrona instalacji.",
    ikona: "🔌",
    ekrany: [{ href: "/kalkulatory/trasy-kablowe", label: "Trasy kablowe — prowadzenie i separacja" }],
  },
  {
    id: 6,
    nazwa: "Ogrzewanie / pompa ciepła",
    opis: "Termika budynku, pompa ciepła, wentylacja.",
    ikona: "🔥",
    ekrany: [{ href: "/kalkulatory/cop-pompy-ciepla", label: "COP pompy ciepła w funkcji temperatury" }],
  },
  {
    id: 7,
    nazwa: "Stress-test zimowy",
    opis: "Sprawdza cały system w najgorszych warunkach — spina moduły 1–6.",
    ikona: "🧊",
    ekrany: [{ href: "/kalkulatory/procedura-black-start", label: "Procedura Black Start" }],
  },
  {
    id: 8,
    nazwa: "Bezpieczeństwo i sytuacje awaryjne",
    opis: "Pożar, ewakuacja, systemy alarmowe.",
    ikona: "🚨",
    ekrany: [{ href: "/kalkulatory/audyt-pozarowy", label: "Autonomiczny audyt bezpieczeństwa pożarowego" }],
  },
  {
    id: 9,
    nazwa: "Elektronika / ESP32 / sensoryka",
    opis: "Czujniki, sterowanie, komunikacja.",
    ikona: "🧰",
    ekrany: [{ href: "/kalkulatory/katalog-czujnikow", label: "Katalog czujników" }],
  },
  {
    id: 10,
    nazwa: "AI i prognozy",
    opis: "Prognozy produkcji/zużycia, rekomendacje.",
    ikona: "🤖",
    ekrany: [{ href: "/kalkulatory/prognozy", label: "Prognozy" }],
  },
  {
    id: 11,
    nazwa: "Montaż baterii",
    opis: "Procedury montażu — LiFePO4 i kwasowo-ołowiowe.",
    ikona: "🛠️",
    ekrany: [
      { href: "/kalkulatory/weryfikacja-ogniw", label: "Weryfikacja kompletności i kontrola wstępna ogniw" },
      { href: "/kalkulatory/polaczenia-elektryczne", label: "Połączenia elektryczne i kolejność łączenia" },
      { href: "/kalkulatory/podlaczenie-bms", label: "Podłączenie BMS" },
      { href: "/kalkulatory/demontaz-pakietu", label: "Demontaż pakietu" },
      { href: "/kalkulatory/ratowanie-ogniwa", label: "Ratowanie głęboko rozładowanego ogniwa" },
      { href: "/kalkulatory/ocena-zuzycia", label: "Ocena zużycia ogniwa po demontażu" },
      { href: "/kalkulatory/przygotowanie-stanowiska", label: "Przygotowanie stanowiska i narzędzi" },
      { href: "/kalkulatory/przechowywanie-recykling", label: "Przechowywanie / recykling / narzędzia diagnostyczne" },
      { href: "/kalkulatory/weryfikacja-wstepna-olow", label: "Weryfikacja + kontrola wstępna (kwasowo-ołowiowa)" },
      { href: "/kalkulatory/montaz-mechaniczny-olow", label: "Montaż mechaniczny + mocowanie/wentylacja" },
      { href: "/kalkulatory/polaczenia-czyszczenie-olow", label: "Połączenia + czyszczenie biegunów" },
      { href: "/kalkulatory/balansery-zewnetrzne-olow", label: "Balansery zewnętrzne" },
      { href: "/kalkulatory/uruchomienie-testy-olow", label: "Pierwsze uruchomienie i testy" },
      { href: "/kalkulatory/demontaz-olow", label: "Demontaż — procedura, kolejność, zabezpieczenie" },
      { href: "/kalkulatory/bezpieczenstwo-kwas", label: "Bezpieczeństwo pracy z kwasem" },
      { href: "/kalkulatory/gestosc-elektrolitu", label: "Test pojemności i gęstości elektrolitu" },
      { href: "/kalkulatory/ocena-zasiarczenia", label: "Ocena zużycia — siarczanowanie" },
      { href: "/kalkulatory/ratowanie-zasiarczenia", label: "Ratowanie zasiarczonego akumulatora" },
      { href: "/kalkulatory/przechowywanie-recykling-olow", label: "Przechowywanie / recykling / narzędzia (kwasowo-ołowiowa)" },
    ],
  },
  {
    id: 12,
    nazwa: "Szybki kalkulator / tryb mobilny",
    opis: "Proste przeliczniki bez pełnego procesu projektowego.",
    ikona: "📱",
    ekrany: [{ href: "/kalkulatory/tryb-uproszczony", label: "Tryb uproszczony — dobór akumulatora" }],
  },
  {
    id: 13,
    nazwa: "Tryb Live",
    opis: "Monitoring bieżący — ma sens dopiero, gdy reszta jest zbudowana.",
    ikona: "📡",
    ekrany: [{ href: "/kalkulatory/tryb-live", label: "Wejście w tryb Live" }],
  },
]

/** Kafel 14 — poza siatką kafli, dostępny zawsze z paska górnego (docs/pulpit-i-nawigacja.md, 1). */
export const USTAWIENIA_KAFEL = {
  id: 14,
  nazwa: "Ustawienia",
  ikona: "⚙️",
  href: "/ustawienia",
}

export function znajdzKafel(id: number): KafelEntry | undefined {
  return KAFLE.find((k) => k.id === id)
}

/** Odwrotne wyszukiwanie: dla danego href ekranu znajdź jego kafel (do okruszków/przycisku wstecz). */
export function znajdzKafelIEkranPoHref(
  href: string,
): { kafel: KafelEntry; ekran: EkranEntry } | undefined {
  for (const kafel of KAFLE) {
    const ekran = kafel.ekrany.find((e) => e.href === href)
    if (ekran) return { kafel, ekran }
  }
  return undefined
}
