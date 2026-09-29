/**
 * M14 — D5 „Zima bez sieci” (`app/kalkulatory/zima-bez-sieci/page.tsx`).
 */
export const pl = {
  "UI-ZIMA-TYTUL": "Zima bez sieci",
  "UI-ZIMA-OPIS":
    "Ta sama instalacja co na ekranie „Ile PV i magazynu”, ale bez sieci: czego zabraknie w grudniu i styczniu i kto to pokryje. M14 „Dom – sieć”, ekran D5.",
  "UI-ZIMA-NAJPIERW": "Najpierw wpisz zużycie i instalację",
  "UI-ZIMA-NIE-DA-SIE": "Nie da się policzyć — uzupełnij dane na ekranie „Ile PV i magazynu”",
  "UI-ZIMA-BILANS": "Bilans bez sieci",
  "UI-ZIMA-BRAKUJE": "Grudzień + styczeń: brakuje {kwh} kWh",
  "UI-ZIMA-BEZ-NIEDOBORU": "Grudzień i styczeń bez niedoboru",
  "UI-ZIMA-ROK":
    "Cały rok bez sieci brakuje {brak} kWh, a {nadwyzka} kWh produkcji się marnuje (nie ma gdzie jej oddać).",
  "UI-ZIMA-WARUNEK": "Warunek konieczny przed odłączeniem — stress-test zimowy (Moduł 7)",
  "UI-ZIMA-WARUNEK-OPIS":
    "Bilans miesięczny zakłada, że magazyn codziennie się napełnia. Zimą bywa inaczej — kilka pochmurnych dni pod rząd, niska temperatura magazynu, pompa ciepła pracująca dłużej. Sprawdź to przed decyzją:",
  "UI-ZIMA-L-ZACHMURZENIE": "Symulacja miesiąca zachmurzenia",
  "UI-ZIMA-I": " i ",
  "UI-ZIMA-L-DNI-BEZ-SLONCA": "dni bez słońca",
  "UI-ZIMA-L-DNI-AUTONOMII": "Dni autonomii",
  "UI-ZIMA-MODUL-2-I": " (Moduł 2) i ",
  "UI-ZIMA-L-TEMPERATURA": "wpływ temperatury na magazyn",
  "UI-ZIMA-MODUL-4": " (Moduł 4)",
  "UI-ZIMA-L-POMPA": "Zimowe zużycie pompy ciepła",
  "UI-ZIMA-MODUL-6": " (Moduł 6)",
  "UI-ZIMA-NIEDOBOR-AGREGAT": "Niedobór pokryje agregat:",
  "UI-ZIMA-L-AGREGAT": "Agregat jako zapas",
} as const

type Klucz = keyof typeof pl

export const en: Record<Klucz, string> = {
  "UI-ZIMA-TYTUL": "Winter without the grid",
  "UI-ZIMA-OPIS":
    "The same installation as on the “How much PV and storage” screen, but without the grid: what will be missing in December and January and what will cover it. M14 “Home – grid”, screen D5.",
  "UI-ZIMA-NAJPIERW": "First enter consumption and the installation",
  "UI-ZIMA-NIE-DA-SIE": "Cannot be calculated — fill in the data on the “How much PV and storage” screen",
  "UI-ZIMA-BILANS": "Balance without the grid",
  "UI-ZIMA-BRAKUJE": "December + January: {kwh} kWh short",
  "UI-ZIMA-BEZ-NIEDOBORU": "December and January without a shortfall",
  "UI-ZIMA-ROK":
    "Over the whole year without the grid {brak} kWh is missing, and {nadwyzka} kWh of production is wasted (there is nowhere to export it).",
  "UI-ZIMA-WARUNEK": "Necessary condition before disconnecting — the winter stress test (Module 7)",
  "UI-ZIMA-WARUNEK-OPIS":
    "The monthly balance assumes the storage fills up every day. Winter can be different — several cloudy days in a row, a low storage temperature, a heat pump running longer. Check this before deciding:",
  "UI-ZIMA-L-ZACHMURZENIE": "Cloudy-month simulation",
  "UI-ZIMA-I": " and ",
  "UI-ZIMA-L-DNI-BEZ-SLONCA": "days without sun",
  "UI-ZIMA-L-DNI-AUTONOMII": "Days of autonomy",
  "UI-ZIMA-MODUL-2-I": " (Module 2) and ",
  "UI-ZIMA-L-TEMPERATURA": "effect of temperature on storage",
  "UI-ZIMA-MODUL-4": " (Module 4)",
  "UI-ZIMA-L-POMPA": "Winter heat pump consumption",
  "UI-ZIMA-MODUL-6": " (Module 6)",
  "UI-ZIMA-NIEDOBOR-AGREGAT": "The generator will cover the shortfall:",
  "UI-ZIMA-L-AGREGAT": "Generator as backup",
}

export const ru: Record<Klucz, string> = {
  "UI-ZIMA-TYTUL": "Зима без сети",
  "UI-ZIMA-OPIS":
    "Та же установка, что на экране «Сколько PV и накопителя», но без сети: чего не хватит в декабре и январе и что это покроет. M14 «Дом – сеть», экран D5.",
  "UI-ZIMA-NAJPIERW": "Сначала введите потребление и установку",
  "UI-ZIMA-NIE-DA-SIE": "Невозможно рассчитать — заполните данные на экране «Сколько PV и накопителя»",
  "UI-ZIMA-BILANS": "Баланс без сети",
  "UI-ZIMA-BRAKUJE": "Декабрь + январь: не хватает {kwh} кВт·ч",
  "UI-ZIMA-BEZ-NIEDOBORU": "Декабрь и январь без дефицита",
  "UI-ZIMA-ROK":
    "За весь год без сети не хватает {brak} кВт·ч, а {nadwyzka} кВт·ч выработки пропадает (её некуда отдать).",
  "UI-ZIMA-WARUNEK": "Необходимое условие перед отключением — зимний стресс-тест (модуль 7)",
  "UI-ZIMA-WARUNEK-OPIS":
    "Месячный баланс предполагает, что накопитель заполняется каждый день. Зимой бывает иначе — несколько пасмурных дней подряд, низкая температура накопителя, тепловой насос работает дольше. Проверьте это перед решением:",
  "UI-ZIMA-L-ZACHMURZENIE": "Моделирование пасмурного месяца",
  "UI-ZIMA-I": " и ",
  "UI-ZIMA-L-DNI-BEZ-SLONCA": "дни без солнца",
  "UI-ZIMA-L-DNI-AUTONOMII": "Дни автономии",
  "UI-ZIMA-MODUL-2-I": " (модуль 2) и ",
  "UI-ZIMA-L-TEMPERATURA": "влияние температуры на накопитель",
  "UI-ZIMA-MODUL-4": " (модуль 4)",
  "UI-ZIMA-L-POMPA": "Зимнее потребление теплового насоса",
  "UI-ZIMA-MODUL-6": " (модуль 6)",
  "UI-ZIMA-NIEDOBOR-AGREGAT": "Дефицит покроет генератор:",
  "UI-ZIMA-L-AGREGAT": "Генератор как резерв",
}
