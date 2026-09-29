/**
 * M14 — D6 „Agregat jako zapas” (`app/kalkulatory/agregat-jako-zapas/page.tsx`).
 */
export const pl = {
  "UI-AGZ-TYTUL": "Agregat jako zapas",
  "UI-AGZ-OPIS":
    "Ile godzin i paliwa potrzeba, żeby agregat pokrył niedobór najgorszego miesiąca bez sieci — i jak go bezpiecznie podłączyć. Ten sam silnik co ekran „Agregat prądotwórczy” (Moduł 2). M14 „Dom – sieć”, ekran D6.",
  "UI-AGZ-NAJPIERW": "Najpierw policz zimę bez sieci",
  "UI-AGZ-L-ZIMA": "Zima bez sieci →",
  "UI-AGZ-BEZ-NIEDOBORU": "Bez niedoboru",
  "UI-AGZ-BEZ-NIEDOBORU-OPIS":
    "W bilansie miesięcznym nie brakuje energii w żadnym miesiącu. Seria pochmurnych dni i tak może wymagać zapasu — sprawdź stress-test zimowy (Moduł 7).",
  "UI-AGZ-NAJGORSZY": "Najgorszy miesiąc bez sieci:",
  "UI-AGZ-BRAKUJE": ", brakuje {kwh} kWh.",
  "UI-AGZ-MOC": "Moc agregatu",
  "UI-AGZ-ZUZYCIE": "Zużycie paliwa przy obciążeniu 80%",
  "UI-AGZ-CENA": "Cena paliwa",
  "UI-AGZ-BMS": "BMS / falownik ma wyjście do automatycznego startu agregatu",
  "UI-AGZ-SPRAWDZ": "Sprawdź wpisane dane",
  "UI-AGZ-BEZPIECZENSTWO": "Bezpieczeństwo agregatu",
  "UI-AGZ-W-MIESIACU": "Agregat w miesiącu {miesiac}",
  "UI-AGZ-GODZINY": "{h} h pracy",
  "UI-AGZ-PALIWO": "Paliwo {litry} l, koszt {koszt}. Przełącznik sieć/wyspa i agregat:",
  "UI-AGZ-L-STYK": "bezpieczeństwo styku →",
} as const

type Klucz = keyof typeof pl

export const en: Record<Klucz, string> = {
  "UI-AGZ-TYTUL": "Generator as backup",
  "UI-AGZ-OPIS":
    "How many hours and how much fuel the generator needs to cover the shortfall of the worst month without the grid — and how to connect it safely. The same engine as the “Power generator” screen (Module 2). M14 “Home – grid”, screen D6.",
  "UI-AGZ-NAJPIERW": "First calculate winter without the grid",
  "UI-AGZ-L-ZIMA": "Winter without the grid →",
  "UI-AGZ-BEZ-NIEDOBORU": "No shortfall",
  "UI-AGZ-BEZ-NIEDOBORU-OPIS":
    "The monthly balance shows no energy shortfall in any month. A series of cloudy days may still require a backup — check the winter stress test (Module 7).",
  "UI-AGZ-NAJGORSZY": "Worst month without the grid:",
  "UI-AGZ-BRAKUJE": ", {kwh} kWh short.",
  "UI-AGZ-MOC": "Generator power",
  "UI-AGZ-ZUZYCIE": "Fuel consumption at 80% load",
  "UI-AGZ-CENA": "Fuel price",
  "UI-AGZ-BMS": "The BMS / inverter has an output for automatic generator start",
  "UI-AGZ-SPRAWDZ": "Check the entered data",
  "UI-AGZ-BEZPIECZENSTWO": "Generator safety",
  "UI-AGZ-W-MIESIACU": "Generator in month {miesiac}",
  "UI-AGZ-GODZINY": "{h} h of running",
  "UI-AGZ-PALIWO": "Fuel {litry} l, cost {koszt}. Grid/island switch and generator:",
  "UI-AGZ-L-STYK": "safety of the connection point →",
}

export const ru: Record<Klucz, string> = {
  "UI-AGZ-TYTUL": "Генератор как резерв",
  "UI-AGZ-OPIS":
    "Сколько часов и топлива нужно, чтобы генератор покрыл дефицит худшего месяца без сети, — и как его безопасно подключить. Тот же расчёт, что на экране «Электрогенератор» (модуль 2). M14 «Дом – сеть», экран D6.",
  "UI-AGZ-NAJPIERW": "Сначала рассчитайте зиму без сети",
  "UI-AGZ-L-ZIMA": "Зима без сети →",
  "UI-AGZ-BEZ-NIEDOBORU": "Без дефицита",
  "UI-AGZ-BEZ-NIEDOBORU-OPIS":
    "В месячном балансе ни в одном месяце не хватает энергии. Серия пасмурных дней всё равно может потребовать резерва — проверьте зимний стресс-тест (модуль 7).",
  "UI-AGZ-NAJGORSZY": "Худший месяц без сети:",
  "UI-AGZ-BRAKUJE": ", не хватает {kwh} кВт·ч.",
  "UI-AGZ-MOC": "Мощность генератора",
  "UI-AGZ-ZUZYCIE": "Расход топлива при нагрузке 80%",
  "UI-AGZ-CENA": "Цена топлива",
  "UI-AGZ-BMS": "BMS / инвертор имеет выход для автоматического запуска генератора",
  "UI-AGZ-SPRAWDZ": "Проверьте введённые данные",
  "UI-AGZ-BEZPIECZENSTWO": "Безопасность генератора",
  "UI-AGZ-W-MIESIACU": "Генератор в месяце {miesiac}",
  "UI-AGZ-GODZINY": "{h} ч работы",
  "UI-AGZ-PALIWO": "Топливо {litry} л, стоимость {koszt}. Переключатель сеть/автономия и генератор:",
  "UI-AGZ-L-STYK": "безопасность точки соединения →",
}
