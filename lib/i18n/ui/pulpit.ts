/**
 * Dashboard text: the presets section in the settings (`app/ustawienia/page.tsx`, presets from
 * `lib/pulpit/presety.ts`) and the wide M14 tiles on the dashboard (`app/page.tsx`).
 */
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

type Klucz = keyof typeof pl

export const en: Record<Klucz, string> = {
  "UI-PULPIT-PRESETY-TYTUL": "What do you want to do now?",
  "UI-PULPIT-PRESETY-OPIS":
    "Tick one or more categories and apply — the dashboard shows only the modules you need, in a matching order. Several categories = all their modules together. The “Home – grid” and “Business – grid” tiles always stay. You can change everything below later.",
  "UI-PULPIT-PRESETY-ZASTOSUJ": "Apply to the dashboard",
  "UI-PULPIT-PRESETY-ZASTOSOWANO": "Dashboard set. Bring hidden modules back with “Show”.",
  "UI-PULPIT-PRESET-CALY-SYSTEM": "Whole off-grid system",
  "UI-PULPIT-PRESET-CALY-SYSTEM-OPIS": "All modules in the default order.",
  "UI-PULPIT-PRESET-PV": "PV installation",
  "UI-PULPIT-PRESET-PV-OPIS": "Panels and what surrounds them; hides heating, safety, ESP32 electronics, battery assembly, mobile mode and Live.",
  "UI-PULPIT-PRESET-MAGAZYN": "Energy storage / batteries",
  "UI-PULPIT-PRESET-MAGAZYN-OPIS": "Storage with battery assembly; hides heating, safety, ESP32 electronics, AI, mobile mode and Live.",
  "UI-PULPIT-PRESET-ZAPOTRZEBOWANIE": "Energy demand",
  "UI-PULPIT-PRESET-ZAPOTRZEBOWANIE-OPIS": "Demand balance with panels, storage and the quick calculator; hides the rest.",
  "UI-PULPIT-PRESET-OGRZEWANIE": "Heating / heat pump",
  "UI-PULPIT-PRESET-OGRZEWANIE-OPIS": "Heating with the balance, stress test and AI; hides the rest.",
  "UI-PULPIT-PRESET-ELEKTRYKA": "Electrical installation",
  "UI-PULPIT-PRESET-ELEKTRYKA-OPIS": "Cabling and protection with panels, storage and safety; hides the rest.",
  "UI-PULPIT-PRESET-ANALIZA": "Analysis / stress test",
  "UI-PULPIT-PRESET-ANALIZA-OPIS": "Stress test with the data that feeds it, and AI; hides cabling, safety, ESP32 electronics, battery assembly, mobile mode and Live.",
  "UI-PULPIT-PRESET-AUTOMATYKA": "Automation and AI",
  "UI-PULPIT-PRESET-AUTOMATYKA-OPIS": "ESP32 electronics, AI, Live mode and safety; hides the rest.",
  "UI-PULPIT-PRESET-MIKRO": "Camper, garden cabin or garage",
  "UI-PULPIT-PRESET-MIKRO-OPIS": "Location, mobile mode, panels, battery, wiring and safety; hides building heating, stress test, ESP32, AI, battery installation and Live.",
  "UI-PULPIT-PRESET-SIEC": "I am connected to the grid",
  "UI-PULPIT-PRESET-SIEC-OPIS":
    "“Home – grid” and “Business – grid” first, then the modules needed to go off-grid; hides cabling, ESP32 electronics, AI, battery assembly, mobile mode and Live.",
}

export const ru: Record<Klucz, string> = {
  "UI-PULPIT-PRESETY-TYTUL": "Что вы хотите сделать сейчас?",
  "UI-PULPIT-PRESETY-OPIS":
    "Отметьте одну или несколько категорий и примените — на панели останутся только нужные модули в подходящем порядке. Несколько категорий = все их модули вместе. Плитки «Дом – сеть» и «Фирма – сеть» остаются всегда. Всё можно изменить ниже.",
  "UI-PULPIT-PRESETY-ZASTOSUJ": "Применить к панели",
  "UI-PULPIT-PRESETY-ZASTOSOWANO": "Панель настроена. Скрытые модули вернёт кнопка «Показать».",
  "UI-PULPIT-PRESET-CALY-SYSTEM": "Вся автономная система",
  "UI-PULPIT-PRESET-CALY-SYSTEM-OPIS": "Все модули в порядке по умолчанию.",
  "UI-PULPIT-PRESET-PV": "Фотоэлектрическая установка",
  "UI-PULPIT-PRESET-PV-OPIS": "Панели и всё вокруг них; скрывает отопление, безопасность, электронику ESP32, сборку батарей, мобильный режим и Live.",
  "UI-PULPIT-PRESET-MAGAZYN": "Накопитель энергии / батареи",
  "UI-PULPIT-PRESET-MAGAZYN-OPIS": "Накопитель со сборкой батарей; скрывает отопление, безопасность, электронику ESP32, ИИ, мобильный режим и Live.",
  "UI-PULPIT-PRESET-ZAPOTRZEBOWANIE": "Потребность в энергии",
  "UI-PULPIT-PRESET-ZAPOTRZEBOWANIE-OPIS": "Баланс потребления с панелями, накопителем и быстрым калькулятором; остальное скрывает.",
  "UI-PULPIT-PRESET-OGRZEWANIE": "Отопление / тепловой насос",
  "UI-PULPIT-PRESET-OGRZEWANIE-OPIS": "Отопление с балансом, стресс-тестом и ИИ; остальное скрывает.",
  "UI-PULPIT-PRESET-ELEKTRYKA": "Электроустановка",
  "UI-PULPIT-PRESET-ELEKTRYKA-OPIS": "Кабели и защита с панелями, накопителем и безопасностью; остальное скрывает.",
  "UI-PULPIT-PRESET-ANALIZA": "Анализ / стресс-тест",
  "UI-PULPIT-PRESET-ANALIZA-OPIS": "Стресс-тест с данными, которые его питают, и ИИ; скрывает кабели, безопасность, электронику ESP32, сборку батарей, мобильный режим и Live.",
  "UI-PULPIT-PRESET-AUTOMATYKA": "Автоматика и ИИ",
  "UI-PULPIT-PRESET-AUTOMATYKA-OPIS": "Электроника ESP32, ИИ, режим Live и безопасность; остальное скрывает.",
  "UI-PULPIT-PRESET-MIKRO": "Кемпер, дачный домик или гараж",
  "UI-PULPIT-PRESET-MIKRO-OPIS": "Местоположение, мобильный режим, панели, аккумулятор, проводка и безопасность; скрывает отопление здания, стресс-тест, ESP32, ИИ, монтаж батарей и Live.",
  "UI-PULPIT-PRESET-SIEC": "Я подключён к сети",
  "UI-PULPIT-PRESET-SIEC-OPIS":
    "Сначала «Дом – сеть» и «Фирма – сеть», затем модули для перехода на автономное питание; скрывает кабели, электронику ESP32, ИИ, сборку батарей, мобильный режим и Live.",
}
