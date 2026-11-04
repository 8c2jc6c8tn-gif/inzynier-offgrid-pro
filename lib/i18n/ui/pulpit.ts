/**
 * Dashboard text: the presets section in the settings (`app/ustawienia/page.tsx`, presets from
 * `lib/pulpit/presety.ts`) and the wide M14 tiles on the dashboard (`app/page.tsx`).
 */
// English: ./pulpit.en.ts, Russian: ./pulpit.ru.ts (one language per file, so each is its own lazy chunk — lib/i18n/rejestr-slownikow.ts).
export const pl = {
  "UI-PULPIT-PRESETY-TYTUL": "Co chcesz teraz zrobić?",
  "UI-PULPIT-PRESETY-OPIS":
    "Zaznacz jedną lub kilka kategorii i zastosuj — pulpit pokaże tylko potrzebne moduły, w pasującej kolejności. Kilka kategorii = suma ich modułów. Kafle „Dom – sieć” i „Firma – sieć” zostają zawsze. Wszystko da się potem zmienić niżej.",
  "UI-PULPIT-PRESETY-ZASTOSUJ": "Zastosuj do pulpitu",
  "UI-PULPIT-PRESETY-ZASTOSOWANO": "Pulpit ustawiony. Ukryte moduły przywrócisz przyciskiem „Pokaż”.",
  "UI-PULPIT-PRESET-CALY-SYSTEM": "Cały system off-grid",
  "UI-PULPIT-PRESET-CALY-SYSTEM-OPIS": "Wszystkie moduły w kolejności domyślnej.",
  "UI-PULPIT-PRESET-PV": "Instalacja PV",
  "UI-PULPIT-PRESET-PV-OPIS": "Panele i ich otoczenie; ukrywa ogrzewanie, bezpieczeństwo, elektronikę ESP32, montaż baterii, tryb mobilny i Live.",
  "UI-PULPIT-PRESET-MAGAZYN": "Magazyn energii / baterie",
  "UI-PULPIT-PRESET-MAGAZYN-OPIS": "Magazyn z montażem baterii; ukrywa ogrzewanie, bezpieczeństwo, elektronikę ESP32, AI, tryb mobilny i Live.",
  "UI-PULPIT-PRESET-ZAPOTRZEBOWANIE": "Zapotrzebowanie energetyczne",
  "UI-PULPIT-PRESET-ZAPOTRZEBOWANIE-OPIS": "Bilans potrzeb z panelami, magazynem i szybkim kalkulatorem; resztę ukrywa.",
  "UI-PULPIT-PRESET-OGRZEWANIE": "Ogrzewanie / pompa ciepła",
  "UI-PULPIT-PRESET-OGRZEWANIE-OPIS": "Ogrzewanie z bilansem, stress-testem i AI; resztę ukrywa.",
  "UI-PULPIT-PRESET-ELEKTRYKA": "Instalacja elektryczna",
  "UI-PULPIT-PRESET-ELEKTRYKA-OPIS": "Okablowanie i zabezpieczenia z panelami, magazynem i bezpieczeństwem; resztę ukrywa.",
  "UI-PULPIT-PRESET-ANALIZA": "Analiza / stress-test",
  "UI-PULPIT-PRESET-ANALIZA-OPIS": "Stress-test z danymi, które go zasilają, i z AI; ukrywa okablowanie, bezpieczeństwo, elektronikę ESP32, montaż baterii, tryb mobilny i Live.",
  "UI-PULPIT-PRESET-AUTOMATYKA": "Automatyka i AI",
  "UI-PULPIT-PRESET-AUTOMATYKA-OPIS": "Elektronika ESP32, AI, tryb Live i bezpieczeństwo; resztę ukrywa.",
  "UI-PULPIT-PRESET-MIKRO": "Kamper, altana lub garaż",
  "UI-PULPIT-PRESET-MIKRO-OPIS": "Lokalizacja, tryb mobilny, panele, akumulator, okablowanie i bezpieczeństwo; ukrywa ogrzewanie budynku, stress-test, ESP32, AI, montaż baterii i Live.",
  "UI-PULPIT-PRESET-SIEC": "Jestem podłączony do sieci",
  "UI-PULPIT-PRESET-SIEC-OPIS":
    "Na początku „Dom – sieć” i „Firma – sieć”, za nimi moduły potrzebne do przejścia na off-grid; ukrywa okablowanie, elektronikę ESP32, AI, montaż baterii, tryb mobilny i Live.",
} as const
