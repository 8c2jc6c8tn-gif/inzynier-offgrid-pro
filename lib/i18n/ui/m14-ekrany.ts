/**
 * M14 — titles and descriptions of the simple screens (FAQ, dotacje, scenariusze, PV i magazyn) and
 * the subsidy list. The catalogue entries themselves (`lib/core/dane/dotacje`: name, description) are
 * catalogue content and stay Polish for now (`docs/lista-do-zrobienia.md`).
 */
export const pl = {
  "UI-FAQ-DOM-TYTUL": "Najczęstsze pytania — dom i sieć",
  "UI-FAQ-DOM-OPIS":
    "Rachunek, prosument, odłączenie i bezpieczeństwo w krótkich odpowiedziach, z odnośnikami do kalkulatorów. M14 „Dom – sieć”, ekran D14.",
  "UI-FAQ-FIRMA-TYTUL": "Najczęstsze pytania firm",
  "UI-FAQ-FIRMA-OPIS":
    "Taryfy C, moc bierna, opłata mocowa, net-billing, magazyny i licznik — odpowiedzi poprawione względem materiału źródłowego. M14 „Firma – sieć”, ekran F13.",
  "UI-DOT-TYTUL": "Dotacje (stan na dzień)",
  "UI-DOT-OPIS":
    "Informacja, nie porada. Każda pozycja ma datę stanu i znak pewności: ✅ odczyt źródła, 🔎B jedno źródło albo wiedza ekspercka. Po terminie naboru pozycja sama zmienia się na „nabór zakończony”. M14 „Dom – sieć”, ekran D13.",
  "UI-DOT-UWAGA-KOLEJNOSC":
    "Uwaga na kolejność: dotacje na magazyn są dziś powiązane z byciem prosumentem przyłączonym do sieci. Odłączenie w okresie trwałości projektu może oznaczać zwrot dotacji — sprawdź regulamin, zanim wybierzesz scenariusz D.",
  "UI-DOT-FIRMA-TYTUL": "Dotacje i podatki — informacja, nie porada",
  "UI-DOT-FIRMA-OPIS":
    "Nabory dla firm ze stanem na dzień. „Przydomowe Magazyny Energii” i ulga termomodernizacyjna dotyczą osób fizycznych, więc są w części „Dom”. M14 „Firma – sieć”, ekran F12.",
  "UI-DOT-PODATKI": "Podatki",
  "UI-DOT-PODATKI-OPIS":
    "Skutki podatkowe net-billingu w firmie zależą od formy opodatkowania — skonsultuj z księgowym; interpretacje indywidualne wiążą tylko wnioskodawcę.",
  "UI-DOT-STAN-TRWA": "nabór trwa",
  "UI-DOT-STAN-ZAKONCZONY": "nabór zakończony",
  "UI-DOT-STAN-PRZYSZLY": "nabór jeszcze się nie zaczął",
  "UI-DOT-STAN-BEZ-TERMINU": "bez terminu naboru",
  "UI-DOT-STAN-NA": "Stan na {data}.",
  "UI-DOT-REGULAMIN": "Regulamin",
  "UI-DOT-BRAK-REGULAMINU":
    "Regulaminu jeszcze nie odczytaliśmy ze źródła — sprawdź go u operatora programu przed decyzją.",
  "UI-SCEN-DOM-TYTUL": "Porównanie scenariuszy A–D",
  "UI-SCEN-DOM-OPIS":
    "Sieć + PV, sieć + PV + magazyn, off-grid z siecią jako zapasem i pełne odłączenie — koszt całkowity w horyzoncie, okres zwrotu, godziny agregatu i odwracalność obok siebie. Ceny wpisujesz Ty. M14 „Dom – sieć”, ekran D7.",
  "UI-SCEN-FIRMA-TYTUL": "Scenariusze A–D dla firmy",
  "UI-SCEN-FIRMA-OPIS":
    "Te same cztery scenariusze co dla domu, z kontrolą ciągłości działania (RF1): ile godzin firma zniesie bez zasilania i czy magazyn z agregatem to pokrywa. M14 „Firma – sieć”, ekran F8.",
  "UI-PVF-TYTUL": "PV w firmie i autokonsumpcja",
  "UI-PVF-OPIS":
    "Ile energii z paneli firma zużyje od razu, ile przesunie magazyn, a ile odda do sieci (net-billing — im mniej oddajesz, tym lepiej). Nasłonecznienie z lokalizacji (Moduły 1 i 3). M14 „Firma – sieć”, ekran F6.",
  "UI-PVD-TYTUL": "Ile PV i magazynu, żeby uniezależnić się od sieci",
  "UI-PVD-OPIS":
    "Bilans miesiąc po miesiącu: ile energii dadzą panele i magazyn, ile nadal weźmiesz z sieci i ile do niej oddasz. Nasłonecznienie z Twojej lokalizacji (Moduły 1 i 3), magazyn jak w Module 4. M14 „Dom – sieć”, ekran D4.",
} as const

type Klucz = keyof typeof pl

export const en: Record<Klucz, string> = {
  "UI-FAQ-DOM-TYTUL": "Frequently asked questions — home and grid",
  "UI-FAQ-DOM-OPIS":
    "Bill, prosumer, disconnection and safety in short answers, with links to the calculators. M14 “Home – grid”, screen D14.",
  "UI-FAQ-FIRMA-TYTUL": "Frequently asked questions for businesses",
  "UI-FAQ-FIRMA-OPIS":
    "C tariffs, reactive power, capacity fee, net-billing, storage and the meter — answers corrected against the source material. M14 “Business – grid”, screen F13.",
  "UI-DOT-TYTUL": "Subsidies (as of date)",
  "UI-DOT-OPIS":
    "Information, not advice. Every item has an as-of date and a confidence mark: ✅ read from the source, 🔎B a single source or expert knowledge. After the application deadline an item switches to “call closed” by itself. M14 “Home – grid”, screen D13.",
  "UI-DOT-UWAGA-KOLEJNOSC":
    "Mind the order: storage subsidies are currently tied to being a grid-connected prosumer. Disconnecting within the project's durability period may mean paying the subsidy back — check the rules before you choose scenario D.",
  "UI-DOT-FIRMA-TYTUL": "Subsidies and taxes — information, not advice",
  "UI-DOT-FIRMA-OPIS":
    "Calls for businesses with an as-of date. “Przydomowe Magazyny Energii” and the thermal-modernisation tax relief apply to private individuals, so they are in the “Home” part. M14 “Business – grid”, screen F12.",
  "UI-DOT-PODATKI": "Taxes",
  "UI-DOT-PODATKI-OPIS":
    "The tax consequences of net-billing in a business depend on the form of taxation — consult your accountant; individual tax rulings bind only the applicant.",
  "UI-DOT-STAN-TRWA": "call open",
  "UI-DOT-STAN-ZAKONCZONY": "call closed",
  "UI-DOT-STAN-PRZYSZLY": "call not open yet",
  "UI-DOT-STAN-BEZ-TERMINU": "no application deadline",
  "UI-DOT-STAN-NA": "As of {data}.",
  "UI-DOT-REGULAMIN": "Rules",
  "UI-DOT-BRAK-REGULAMINU":
    "We have not read the rules from the source yet — check them with the programme operator before deciding.",
  "UI-SCEN-DOM-TYTUL": "Comparison of scenarios A–D",
  "UI-SCEN-DOM-OPIS":
    "Grid + PV, grid + PV + storage, off-grid with the grid as backup, and full disconnection — total cost over the horizon, payback period, generator hours and reversibility side by side. You enter the prices. M14 “Home – grid”, screen D7.",
  "UI-SCEN-FIRMA-TYTUL": "Scenarios A–D for a business",
  "UI-SCEN-FIRMA-OPIS":
    "The same four scenarios as for a home, with a business-continuity check (RF1): how many hours the business can go without power and whether storage with a generator covers that. M14 “Business – grid”, screen F8.",
  "UI-PVF-TYTUL": "PV in a business and self-consumption",
  "UI-PVF-OPIS":
    "How much panel energy the business uses right away, how much storage shifts, and how much goes to the grid (net-billing — the less you export, the better). Irradiation from the location (Modules 1 and 3). M14 “Business – grid”, screen F6.",
  "UI-PVD-TYTUL": "How much PV and storage to become independent of the grid",
  "UI-PVD-OPIS":
    "Month-by-month balance: how much energy the panels and storage provide, how much you still take from the grid and how much you export. Irradiation from your location (Modules 1 and 3), storage as in Module 4. M14 “Home – grid”, screen D4.",
}

export const ru: Record<Klucz, string> = {
  "UI-FAQ-DOM-TYTUL": "Частые вопросы — дом и сеть",
  "UI-FAQ-DOM-OPIS":
    "Счёт, просьюмер, отключение и безопасность в коротких ответах, со ссылками на калькуляторы. M14 «Дом – сеть», экран D14.",
  "UI-FAQ-FIRMA-TYTUL": "Частые вопросы фирм",
  "UI-FAQ-FIRMA-OPIS":
    "Тарифы C, реактивная мощность, плата за мощность, нет-биллинг, накопители и счётчик — ответы исправлены по сравнению с исходным материалом. M14 «Фирма – сеть», экран F13.",
  "UI-DOT-TYTUL": "Субсидии (по состоянию на дату)",
  "UI-DOT-OPIS":
    "Информация, а не совет. У каждой позиции есть дата состояния и знак уверенности: ✅ прочитано из источника, 🔎B один источник или экспертное знание. После окончания приёма заявок позиция сама меняется на «приём завершён». M14 «Дом – сеть», экран D13.",
  "UI-DOT-UWAGA-KOLEJNOSC":
    "Обратите внимание на порядок: субсидии на накопитель сегодня связаны со статусом просьюмера, подключённого к сети. Отключение в период обязательного сохранения проекта может означать возврат субсидии — проверьте регламент, прежде чем выбирать сценарий D.",
  "UI-DOT-FIRMA-TYTUL": "Субсидии и налоги — информация, а не совет",
  "UI-DOT-FIRMA-OPIS":
    "Программы для фирм с датой состояния. «Przydomowe Magazyny Energii» и налоговая льгота на термомодернизацию касаются физических лиц, поэтому они в части «Дом». M14 «Фирма – сеть», экран F12.",
  "UI-DOT-PODATKI": "Налоги",
  "UI-DOT-PODATKI-OPIS":
    "Налоговые последствия нет-биллинга для фирмы зависят от формы налогообложения — проконсультируйтесь с бухгалтером; индивидуальные разъяснения обязательны только для заявителя.",
  "UI-DOT-STAN-TRWA": "приём заявок идёт",
  "UI-DOT-STAN-ZAKONCZONY": "приём заявок завершён",
  "UI-DOT-STAN-PRZYSZLY": "приём заявок ещё не начался",
  "UI-DOT-STAN-BEZ-TERMINU": "без срока приёма заявок",
  "UI-DOT-STAN-NA": "По состоянию на {data}.",
  "UI-DOT-REGULAMIN": "Регламент",
  "UI-DOT-BRAK-REGULAMINU":
    "Регламент мы ещё не прочитали из источника — проверьте его у оператора программы перед решением.",
  "UI-SCEN-DOM-TYTUL": "Сравнение сценариев A–D",
  "UI-SCEN-DOM-OPIS":
    "Сеть + PV, сеть + PV + накопитель, автономия с сетью как резервом и полное отключение — полная стоимость за горизонт, срок окупаемости, часы генератора и обратимость рядом. Цены вводите вы. M14 «Дом – сеть», экран D7.",
  "UI-SCEN-FIRMA-TYTUL": "Сценарии A–D для фирмы",
  "UI-SCEN-FIRMA-OPIS":
    "Те же четыре сценария, что и для дома, с проверкой непрерывности работы (RF1): сколько часов фирма выдержит без питания и покрывает ли это накопитель с генератором. M14 «Фирма – сеть», экран F8.",
  "UI-PVF-TYTUL": "PV в фирме и самопотребление",
  "UI-PVF-OPIS":
    "Сколько энергии панелей фирма потребит сразу, сколько сдвинет накопитель, а сколько отдаст в сеть (нет-биллинг — чем меньше отдаёте, тем лучше). Инсоляция по местоположению (модули 1 и 3). M14 «Фирма – сеть», экран F6.",
  "UI-PVD-TYTUL": "Сколько PV и накопителя нужно для независимости от сети",
  "UI-PVD-OPIS":
    "Баланс по месяцам: сколько энергии дадут панели и накопитель, сколько вы всё ещё возьмёте из сети и сколько отдадите в неё. Инсоляция по вашему местоположению (модули 1 и 3), накопитель как в модуле 4. M14 «Дом – сеть», экран D4.",
}
