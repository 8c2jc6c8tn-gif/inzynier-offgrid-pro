// Russian texts of ./m14-zima.ts — the same keys as `pl` (a missing or an extra key is a compile error).
import type { pl } from "./m14-zima"

type Klucz = keyof typeof pl

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
