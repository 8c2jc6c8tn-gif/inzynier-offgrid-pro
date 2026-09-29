/**
 * M14 — the „Ścieżka przejścia” wizard (`app/kalkulatory/sciezka-przejscia/page.tsx`): step
 * titles, descriptions and the names of the screens each step links to.
 */
export const pl = {
  "UI-SCZ-RACHUNEK-T": "Mój rachunek",
  "UI-SCZ-RACHUNEK-O":
    "Ile płacisz dziś i ile z tego to „cena trzymania sieci” — koszty stałe, które znikną po odejściu.",
  "UI-SCZ-L-RACHUNEK-DOM": "Mój rachunek dziś",
  "UI-SCZ-L-TARYFA-G": "Która taryfa G",
  "UI-SCZ-L-DEPOZYT": "Co tracę jako prosument",
  "UI-SCZ-L-RACHUNEK-FIRMA": "Mój rachunek dziś (C)",
  "UI-SCZ-L-TARYFY-C": "Porównywarka taryf C",
  "UI-SCZ-L-MOC-UMOWNA": "Moc umowna",
  "UI-SCZ-ZUZYCIE-T": "Moje zużycie",
  "UI-SCZ-ZUZYCIE-O": "Zużycie miesiąc po miesiącu — zima decyduje o wszystkim, średnia roczna nie wystarczy.",
  "UI-SCZ-L-ZUZYCIE-DOM": "Moje zużycie miesięcznie",
  "UI-SCZ-L-ZUZYCIE-FIRMA": "Zużycie firmy miesięcznie (ekran PV w firmie)",
  "UI-SCZ-PV-T": "Ile PV i magazynu",
  "UI-SCZ-PV-O": "Instalacja, która pokryje zużycie bez sieci, i jej koszt.",
  "UI-SCZ-L-PV-FIRMA": "PV w firmie i autokonsumpcja",
  "UI-SCZ-L-BESS": "Magazyn (BESS) — strumienie korzyści",
  "UI-SCZ-ZIMA-T": "Zima i agregat",
  "UI-SCZ-ZIMA-O": "Czy najgorszy miesiąc się domyka i ile godzin musi pracować agregat.",
  "UI-SCZ-L-ZIMA": "Zima bez sieci",
  "UI-SCZ-L-AGREGAT-ZAPAS": "Agregat jako zapas",
  "UI-SCZ-L-BILANS-D": "Bilans bez sieci — scenariusz D",
  "UI-SCZ-L-AGREGAT": "Agregat prądotwórczy",
  "UI-SCZ-SCEN-T": "Scenariusze A–D",
  "UI-SCZ-SCEN-O":
    "Zostaję jak jest, dokładam PV, dokładam magazyn, odchodzę od sieci — koszt w latach i niezależność.",
  "UI-SCZ-L-SCEN-DOM": "Porównanie scenariuszy A–D",
  "UI-SCZ-L-SCEN-FIRMA": "Scenariusze A–D dla firmy",
  "UI-SCZ-RYZYKA-T": "Ryzyka i procedura",
  "UI-SCZ-RYZYKA-O": "Co może pójść źle, czego nie da się odwrócić i jak bezpiecznie połączyć sieć, wyspę i agregat.",
  "UI-SCZ-L-RYZYKA": "Ryzyka odłączenia",
  "UI-SCZ-L-REZYGNACJA": "Jak zrezygnować z przyłącza",
  "UI-SCZ-L-PRZELACZNIK": "Przełącznik sieć/wyspa",
  "UI-SCZ-L-RYZYKA-FIRMA": "Ryzyka odłączenia firmy",
  "UI-SCZ-L-PROCEDURA-B2B": "Procedura i umowy B2B",
  "UI-SCZ-TYTUL": "Ścieżka przejścia",
  "UI-SCZ-OPIS":
    "Sześć kroków od rachunku za prąd do decyzji o odejściu od sieci. Każdy krok otwiera ekrany, które go liczą — Twoje dane z nich przechodzą dalej automatycznie. Postęp zapisuje się na tym urządzeniu.",
  "UI-SCZ-ZROBIONE": "Zrobione",
  "UI-SCZ-PODSUMOWANIE": "Podsumowanie — {zrobione} z {wszystkie} kroków",
  "UI-SCZ-NASTEPNY": "Następny krok:",
  "UI-SCZ-NASTEPNY-UWAGA":
    "Decyzję o odejściu od sieci podejmuj dopiero po przejściu wszystkich kroków — zwłaszcza zimy i ryzyk.",
  "UI-SCZ-WSZYSTKIE":
    "Wszystkie kroki przejrzane. Wynik porównania i warunki bezpieczeństwa są na ekranie scenariuszy — tam jest werdykt.",
  "UI-SCZ-DRUKUJ": "Drukuj / zapisz jako PDF",
} as const

type Klucz = keyof typeof pl

export const en: Record<Klucz, string> = {
  "UI-SCZ-RACHUNEK-T": "My bill",
  "UI-SCZ-RACHUNEK-O":
    "How much you pay today and how much of it is the “cost of keeping the grid” — fixed costs that disappear once you leave.",
  "UI-SCZ-L-RACHUNEK-DOM": "My bill today",
  "UI-SCZ-L-TARYFA-G": "Which G tariff",
  "UI-SCZ-L-DEPOZYT": "What I lose as a prosumer",
  "UI-SCZ-L-RACHUNEK-FIRMA": "My bill today (C)",
  "UI-SCZ-L-TARYFY-C": "C tariff comparison",
  "UI-SCZ-L-MOC-UMOWNA": "Contracted capacity",
  "UI-SCZ-ZUZYCIE-T": "My consumption",
  "UI-SCZ-ZUZYCIE-O": "Consumption month by month — winter decides everything, the yearly average is not enough.",
  "UI-SCZ-L-ZUZYCIE-DOM": "My monthly consumption",
  "UI-SCZ-L-ZUZYCIE-FIRMA": "Business monthly consumption (PV in a business screen)",
  "UI-SCZ-PV-T": "How much PV and storage",
  "UI-SCZ-PV-O": "An installation that covers consumption without the grid, and its cost.",
  "UI-SCZ-L-PV-FIRMA": "PV in a business and self-consumption",
  "UI-SCZ-L-BESS": "Storage (BESS) — benefit streams",
  "UI-SCZ-ZIMA-T": "Winter and the generator",
  "UI-SCZ-ZIMA-O": "Whether the worst month balances and how many hours the generator has to run.",
  "UI-SCZ-L-ZIMA": "Winter without the grid",
  "UI-SCZ-L-AGREGAT-ZAPAS": "Generator as backup",
  "UI-SCZ-L-BILANS-D": "Balance without the grid — scenario D",
  "UI-SCZ-L-AGREGAT": "Power generator",
  "UI-SCZ-SCEN-T": "Scenarios A–D",
  "UI-SCZ-SCEN-O": "Stay as I am, add PV, add storage, leave the grid — cost over the years and independence.",
  "UI-SCZ-L-SCEN-DOM": "Comparison of scenarios A–D",
  "UI-SCZ-L-SCEN-FIRMA": "Scenarios A–D for a business",
  "UI-SCZ-RYZYKA-T": "Risks and procedure",
  "UI-SCZ-RYZYKA-O":
    "What can go wrong, what cannot be undone and how to safely connect the grid, the island system and the generator.",
  "UI-SCZ-L-RYZYKA": "Disconnection risks",
  "UI-SCZ-L-REZYGNACJA": "How to give up the grid connection",
  "UI-SCZ-L-PRZELACZNIK": "Grid/island switch",
  "UI-SCZ-L-RYZYKA-FIRMA": "Business disconnection risks",
  "UI-SCZ-L-PROCEDURA-B2B": "Procedure and B2B contracts",
  "UI-SCZ-TYTUL": "Transition path",
  "UI-SCZ-OPIS":
    "Six steps from the electricity bill to the decision to leave the grid. Each step opens the screens that calculate it — your data from them carries forward automatically. Progress is saved on this device.",
  "UI-SCZ-ZROBIONE": "Done",
  "UI-SCZ-PODSUMOWANIE": "Summary — {zrobione} of {wszystkie} steps",
  "UI-SCZ-NASTEPNY": "Next step:",
  "UI-SCZ-NASTEPNY-UWAGA":
    "Decide on leaving the grid only after going through all the steps — especially winter and risks.",
  "UI-SCZ-WSZYSTKIE":
    "All steps reviewed. The comparison result and safety conditions are on the scenarios screen — that is where the verdict is.",
  "UI-SCZ-DRUKUJ": "Print / save as PDF",
}

export const ru: Record<Klucz, string> = {
  "UI-SCZ-RACHUNEK-T": "Мой счёт",
  "UI-SCZ-RACHUNEK-O":
    "Сколько вы платите сегодня и сколько из этого — «цена сохранения сети», постоянные расходы, которые исчезнут после ухода.",
  "UI-SCZ-L-RACHUNEK-DOM": "Мой счёт сегодня",
  "UI-SCZ-L-TARYFA-G": "Какой тариф G",
  "UI-SCZ-L-DEPOZYT": "Что я теряю как просьюмер",
  "UI-SCZ-L-RACHUNEK-FIRMA": "Мой счёт сегодня (C)",
  "UI-SCZ-L-TARYFY-C": "Сравнение тарифов C",
  "UI-SCZ-L-MOC-UMOWNA": "Договорная мощность",
  "UI-SCZ-ZUZYCIE-T": "Моё потребление",
  "UI-SCZ-ZUZYCIE-O": "Потребление по месяцам — всё решает зима, среднегодового значения недостаточно.",
  "UI-SCZ-L-ZUZYCIE-DOM": "Моё потребление по месяцам",
  "UI-SCZ-L-ZUZYCIE-FIRMA": "Потребление фирмы по месяцам (экран «PV в фирме»)",
  "UI-SCZ-PV-T": "Сколько PV и накопителя",
  "UI-SCZ-PV-O": "Установка, которая покроет потребление без сети, и её стоимость.",
  "UI-SCZ-L-PV-FIRMA": "PV в фирме и самопотребление",
  "UI-SCZ-L-BESS": "Накопитель (BESS) — потоки выгод",
  "UI-SCZ-ZIMA-T": "Зима и генератор",
  "UI-SCZ-ZIMA-O": "Сходится ли худший месяц и сколько часов должен работать генератор.",
  "UI-SCZ-L-ZIMA": "Зима без сети",
  "UI-SCZ-L-AGREGAT-ZAPAS": "Генератор как резерв",
  "UI-SCZ-L-BILANS-D": "Баланс без сети — сценарий D",
  "UI-SCZ-L-AGREGAT": "Электрогенератор",
  "UI-SCZ-SCEN-T": "Сценарии A–D",
  "UI-SCZ-SCEN-O":
    "Оставить как есть, добавить PV, добавить накопитель, уйти от сети — стоимость по годам и независимость.",
  "UI-SCZ-L-SCEN-DOM": "Сравнение сценариев A–D",
  "UI-SCZ-L-SCEN-FIRMA": "Сценарии A–D для фирмы",
  "UI-SCZ-RYZYKA-T": "Риски и процедура",
  "UI-SCZ-RYZYKA-O":
    "Что может пойти не так, что нельзя отменить и как безопасно соединить сеть, автономную систему и генератор.",
  "UI-SCZ-L-RYZYKA": "Риски отключения",
  "UI-SCZ-L-REZYGNACJA": "Как отказаться от подключения к сети",
  "UI-SCZ-L-PRZELACZNIK": "Переключатель сеть/автономия",
  "UI-SCZ-L-RYZYKA-FIRMA": "Риски отключения фирмы",
  "UI-SCZ-L-PROCEDURA-B2B": "Процедура и договоры B2B",
  "UI-SCZ-TYTUL": "Путь перехода",
  "UI-SCZ-OPIS":
    "Шесть шагов от счёта за электроэнергию до решения об уходе от сети. Каждый шаг открывает экраны, которые его рассчитывают, — ваши данные из них переходят дальше автоматически. Прогресс сохраняется на этом устройстве.",
  "UI-SCZ-ZROBIONE": "Готово",
  "UI-SCZ-PODSUMOWANIE": "Итог — {zrobione} из {wszystkie} шагов",
  "UI-SCZ-NASTEPNY": "Следующий шаг:",
  "UI-SCZ-NASTEPNY-UWAGA":
    "Принимайте решение об уходе от сети только после прохождения всех шагов — особенно зимы и рисков.",
  "UI-SCZ-WSZYSTKIE":
    "Все шаги просмотрены. Результат сравнения и условия безопасности — на экране сценариев, там и вердикт.",
  "UI-SCZ-DRUKUJ": "Печать / сохранить как PDF",
}
