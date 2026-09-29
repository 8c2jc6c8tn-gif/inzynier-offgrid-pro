/**
 * M14 — screens of the „Przejście” group: D9/F9 „Ryzyka odłączenia”, D10/F10 „Jak zrezygnować z
 * przyłącza” (the risk and procedure texts themselves: `m14-przejscie.ts`).
 */
export const pl = {
  "UI-RYZ-TYTUL": "Ryzyka odłączenia od sieci",
  "UI-RYZ-OPIS":
    "Dziesięć ryzyk pełnego odłączenia (scenariusz D), a dla firmy trzy kolejne. Odhacz każde, gdy je sprawdzisz. Znak przy pozycji mówi, na ile jest pewna: ✅ prawo, fizyka lub praktyka bez wątpliwości; 🔎A kilka zgodnych źródeł; 🔎B jedno źródło albo wiedza ekspercka. M14, ekran D9 / F9.",
  "UI-RYZ-SKUTEK": "Skutek: {tekst}",
  "UI-RYZ-CO-ZROBIC": "Co zrobić: {tekst}",
  "UI-RYZ-WSZYSTKIE": "Wszystkie ryzyka sprawdzone",
  "UI-RYZ-NASTEPNY": "Następny krok:",
  "UI-RYZ-LINK-PROCEDURA": "procedura rezygnacji z przyłącza",
  "UI-RYZ-KROKI-ODWRACALNE": "— kroki 1–4 są odwracalne, zacznij od testu wyspy przez pełną zimę.",
  "UI-RYZ-SPRAWDZONO": "Sprawdzono {n} z {wszystkie} ryzyk",
  "UI-REZ-TYTUL": "Jak zrezygnować z przyłącza",
  "UI-REZ-OPIS":
    "Siedem kroków w kolejności, która ma znaczenie. Kroki 1–4 możesz cofnąć, 5–7 już nie. Na dole — ile kosztowałby powrót do sieci. M14, ekran D10 / F10.",
  "UI-REZ-ODWRACALNE": "(odwracalne)",
  "UI-REZ-NIEODWRACALNE": "(nieodwracalne)",
  "UI-REZ-FIRMA": "Firma: {tekst}",
  "UI-REZ-KOSZT-POWROTU": "Koszt powrotu do sieci",
  "UI-REZ-KOSZT-OPIS":
    "K ≈ stawka opłaty przyłączeniowej OSD [zł/kW] × moc przyłączeniowa — grupy IV–VI, odległość standardowa. Stawkę znajdziesz w taryfie swojego OSD (rozdział o opłatach za przyłączenie); aplikacja jeszcze jej nie ma.",
  "UI-REZ-STAWKA": "Stawka opłaty przyłączeniowej",
  "UI-REZ-J-ZL-KW": "zł/kW",
  "UI-REZ-MOC": "Moc przyłączeniowa",
  "UI-REZ-ODLEGLOSC": "Odległość od sieci",
  "UI-REZ-ODL-TAK": "W standardowej odległości z taryfy OSD",
  "UI-REZ-ODL-NIE": "Dalej niż standardowa odległość",
  "UI-REZ-UZUPELNIJ": "Uzupełnij dane",
  "UI-REZ-POWROT": "Powrót do sieci",
  "UI-REZ-WYCENA-INDYW": "Wycena indywidualna OSD",
  "UI-REZ-OK-NETTO": "ok. {kwota} netto",
  "UI-REZ-PRZED-KROKIEM-5": "Przed krokiem 5:",
  "UI-REZ-LINK-RYZYKA": "ryzyka odłączenia",
  "UI-REZ-LINK-PRZELACZNIK": "przełącznik sieć/wyspa",
} as const

type Klucz = keyof typeof pl

export const en: Record<Klucz, string> = {
  "UI-RYZ-TYTUL": "Risks of disconnecting from the grid",
  "UI-RYZ-OPIS":
    "Ten risks of full disconnection (scenario D), and three more for a business. Tick each one once you have checked it. The mark next to an item says how certain it is: ✅ law, physics or practice beyond doubt; 🔎A several consistent sources; 🔎B a single source or expert knowledge. M14, screen D9 / F9.",
  "UI-RYZ-SKUTEK": "Consequence: {tekst}",
  "UI-RYZ-CO-ZROBIC": "What to do: {tekst}",
  "UI-RYZ-WSZYSTKIE": "All risks checked",
  "UI-RYZ-NASTEPNY": "Next step:",
  "UI-RYZ-LINK-PROCEDURA": "procedure for giving up the grid connection",
  "UI-RYZ-KROKI-ODWRACALNE": "— steps 1–4 are reversible; start with an island test through a full winter.",
  "UI-RYZ-SPRAWDZONO": "{n} of {wszystkie} risks checked",
  "UI-REZ-TYTUL": "How to give up the grid connection",
  "UI-REZ-OPIS":
    "Seven steps in an order that matters. Steps 1–4 can be undone, 5–7 cannot. At the bottom — what returning to the grid would cost. M14, screen D10 / F10.",
  "UI-REZ-ODWRACALNE": "(reversible)",
  "UI-REZ-NIEODWRACALNE": "(irreversible)",
  "UI-REZ-FIRMA": "Business: {tekst}",
  "UI-REZ-KOSZT-POWROTU": "Cost of returning to the grid",
  "UI-REZ-KOSZT-OPIS":
    "K ≈ DSO connection fee rate [PLN/kW] × connection capacity — groups IV–VI, standard distance. You will find the rate in your DSO's tariff (the chapter on connection fees); the app does not have it yet.",
  "UI-REZ-STAWKA": "Connection fee rate",
  "UI-REZ-J-ZL-KW": "PLN/kW",
  "UI-REZ-MOC": "Connection capacity",
  "UI-REZ-ODLEGLOSC": "Distance from the grid",
  "UI-REZ-ODL-TAK": "Within the standard distance from the DSO tariff",
  "UI-REZ-ODL-NIE": "Further than the standard distance",
  "UI-REZ-UZUPELNIJ": "Complete the data",
  "UI-REZ-POWROT": "Return to the grid",
  "UI-REZ-WYCENA-INDYW": "Individual DSO quote",
  "UI-REZ-OK-NETTO": "approx. {kwota} net",
  "UI-REZ-PRZED-KROKIEM-5": "Before step 5:",
  "UI-REZ-LINK-RYZYKA": "disconnection risks",
  "UI-REZ-LINK-PRZELACZNIK": "grid/island switch",
}

export const ru: Record<Klucz, string> = {
  "UI-RYZ-TYTUL": "Риски отключения от сети",
  "UI-RYZ-OPIS":
    "Десять рисков полного отключения (сценарий D), а для фирмы — ещё три. Отмечайте каждый, когда проверите его. Знак у пункта показывает степень уверенности: ✅ закон, физика или практика без сомнений; 🔎A несколько согласующихся источников; 🔎B один источник или экспертное знание. M14, экран D9 / F9.",
  "UI-RYZ-SKUTEK": "Последствие: {tekst}",
  "UI-RYZ-CO-ZROBIC": "Что делать: {tekst}",
  "UI-RYZ-WSZYSTKIE": "Все риски проверены",
  "UI-RYZ-NASTEPNY": "Следующий шаг:",
  "UI-RYZ-LINK-PROCEDURA": "процедура отказа от подключения",
  "UI-RYZ-KROKI-ODWRACALNE": "— шаги 1–4 обратимы, начните с проверки автономной работы в течение полной зимы.",
  "UI-RYZ-SPRAWDZONO": "Проверено {n} из {wszystkie} рисков",
  "UI-REZ-TYTUL": "Как отказаться от подключения к сети",
  "UI-REZ-OPIS":
    "Семь шагов в порядке, который имеет значение. Шаги 1–4 можно отменить, 5–7 — уже нет. Внизу — сколько стоило бы вернуться к сети. M14, экран D10 / F10.",
  "UI-REZ-ODWRACALNE": "(обратимо)",
  "UI-REZ-NIEODWRACALNE": "(необратимо)",
  "UI-REZ-FIRMA": "Фирма: {tekst}",
  "UI-REZ-KOSZT-POWROTU": "Стоимость возврата к сети",
  "UI-REZ-KOSZT-OPIS":
    "K ≈ ставка платы за подключение ОСР [зл/кВт] × мощность подключения — группы IV–VI, стандартное расстояние. Ставку вы найдёте в тарифе своего ОСР (раздел о плате за подключение); в приложении её пока нет.",
  "UI-REZ-STAWKA": "Ставка платы за подключение",
  "UI-REZ-J-ZL-KW": "зл/кВт",
  "UI-REZ-MOC": "Мощность подключения",
  "UI-REZ-ODLEGLOSC": "Расстояние до сети",
  "UI-REZ-ODL-TAK": "В пределах стандартного расстояния по тарифу ОСР",
  "UI-REZ-ODL-NIE": "Дальше стандартного расстояния",
  "UI-REZ-UZUPELNIJ": "Дополните данные",
  "UI-REZ-POWROT": "Возврат к сети",
  "UI-REZ-WYCENA-INDYW": "Индивидуальная оценка ОСР",
  "UI-REZ-OK-NETTO": "ок. {kwota} нетто",
  "UI-REZ-PRZED-KROKIEM-5": "Перед шагом 5:",
  "UI-REZ-LINK-RYZYKA": "риски отключения",
  "UI-REZ-LINK-PRZELACZNIK": "переключатель сеть/автономия",
}
