/**
 * M14 — FAQ texts: D14 „FAQ” (dom) and F13 „FAQ firm” (`components/siec/tresci-faq.ts` holds the
 * order, ids and links). Source and corrections as described there — prices from the material are
 * 🔎B and are NOT stated as facts, in any language.
 */
export const pl = {
  "UI-FAQ-DOM-CENA-TRZYMANIA-P": "Ile płacę za samo to, że mam przyłącze?",
  "UI-FAQ-DOM-CENA-TRZYMANIA-O":
    "To „cena trzymania sieci”: opłata sieciowa stała, abonamentowa, handlowa sprzedawcy i mocowa (w G ryczałt wg progu zużycia), razem z VAT — płacisz je, dopóki istnieją umowa i licznik, nawet przy zerowym zużyciu. PV i magazyn obniżają tylko składniki zmienne. Rachunek rozbity na stałe i zmienne pokaże, ile to w Twoim przypadku.",
  "UI-FAQ-DOM-CENA-TRZYMANIA-L": "Mój rachunek dziś",
  "UI-FAQ-DOM-NET-METERING-P": "Czym różni się net-metering od net-billingu?",
  "UI-FAQ-DOM-NET-METERING-O":
    "Net-metering (instalacje z wniosków sprzed 1.04.2022): z 1 kWh oddanej odbierasz 0,8 kWh (do 10 kW) albo 0,7 kWh (powyżej), przez 15 lat. Net-billing: nadwyżka jest wyceniana ceną rynkową (RCEm albo godzinowa RCE), a wartość trafia na depozyt prosumencki ważny 12 miesięcy.",
  "UI-FAQ-DOM-NET-METERING-L": "Depozyt prosumencki",
  "UI-FAQ-DOM-1-23-P": "Skąd współczynnik 1,23 w depozycie?",
  "UI-FAQ-DOM-1-23-O":
    "Z ustawy o OZE (art. 4c ust. 4): wartość depozytu z danego miesiąca jest zwiększana o 1,23 — dla każdego prosumenta, od 1.02.2025.",
  "UI-FAQ-DOM-ZWROT-DEPOZYTU-P": "Co się dzieje z niewykorzystanym depozytem?",
  "UI-FAQ-DOM-ZWROT-DEPOZYTU-O":
    "Po 12 miesiącach możesz dostać zwrot, ale najwyżej 20% wartości energii z danego miesiąca przy rozliczeniu RCEm albo 30% przy RCE. Reszta jest umarzana. Ujemna cena RCE liczy się jako zero.",
  "UI-FAQ-DOM-JEDNOKIERUNKOWE-P": "Czy mogę wrócić z RCE na RCEm albo z net-billingu na net-metering?",
  "UI-FAQ-DOM-JEDNOKIERUNKOWE-O":
    "Nie. Oba przejścia są jednokierunkowe (art. 4b ust. 2b i art. 4d ust. 1 ustawy o OZE).",
  "UI-FAQ-DOM-ODLACZENIE-P": "Czy opłaca się całkiem odłączyć od sieci?",
  "UI-FAQ-DOM-ODLACZENIE-O":
    "To zależy od Twojego zużycia zimą, lokalizacji i cen sprzętu. Porównanie A–D pokazuje obok siebie najtańszy i najbardziej niezależny scenariusz. Stary prosument w net-meteringu zwykle wygrywa scenariuszem A — aplikacja powie to uczciwie, nawet jeśli wynik brzmi „zostań”.",
  "UI-FAQ-DOM-ODLACZENIE-L": "Porównanie scenariuszy A–D",
  "UI-FAQ-DOM-NAJPIERW-P": "Od czego zacząć, jeśli myślę o odłączeniu?",
  "UI-FAQ-DOM-NAJPIERW-O":
    "Od odwracalnych kroków: policz scenariusze, zbuduj system wyspowy i przetestuj go przy wciąż podłączonej sieci przez pełną zimę. Wypowiedzenie umowy to dopiero krok 5 z 7.",
  "UI-FAQ-DOM-NAJPIERW-L": "Jak zrezygnować z przyłącza",
  "UI-FAQ-DOM-AGREGAT-P": "Czy mogę podłączyć agregat do gniazdka?",
  "UI-FAQ-DOM-AGREGAT-O":
    "Nie. Agregat zasila instalację budynku wyłącznie przez przełącznik z pozycją 0 i blokadą — inaczej może podać napięcie do sieci albo na bolce wtyczki. Agregat spalinowy nigdy w pomieszczeniu mieszkalnym (czad).",
  "UI-FAQ-DOM-AGREGAT-L": "Przełącznik sieć/wyspa",
  "UI-FAQ-DOM-LICZNIK-P": "Podejrzewam, że licznik zawyża. Co zrobić?",
  "UI-FAQ-DOM-LICZNIK-O":
    "Zrób test diody, potem złóż reklamację. 14 dni to termin odpowiedzi przedsiębiorstwa, a nie termin na złożenie reklamacji. Badanie laboratoryjne licznika OSD przeprowadza w 14 dni od zgłoszenia.",
  "UI-FAQ-DOM-LICZNIK-L": "Test licznika i reklamacja",
  "UI-FAQ-FIRMA-REGULOWANE-P": "Czy ceny w taryfach C są nieregulowane?",
  "UI-FAQ-FIRMA-REGULOWANE-O":
    "Nieregulowana jest sprzedaż energii. Stawki dystrybucji dla grup C co roku zatwierdza Prezes URE — to one są w pliku taryf OSD.",
  "UI-FAQ-FIRMA-BIERNA-KTO-P": "Czy firma w taryfie C płaci za moc bierną?",
  "UI-FAQ-FIRMA-BIERNA-KTO-O":
    "Tylko jeśli wynika to z warunków przyłączenia albo umowy — w praktyce głównie odbiorcy powyżej 40 kW. Sprawdź, czy na fakturze jest pozycja za energię bierną. Opłata dotyczy nadwyżki ponad tgφ₀ (domyślnie 0,4, nigdy poniżej 0,2).",
  "UI-FAQ-FIRMA-BIERNA-KTO-L": "Moc bierna",
  "UI-FAQ-FIRMA-BIERNA-JAK-P": "Jak uniknąć opłat za moc bierną?",
  "UI-FAQ-FIRMA-BIERNA-JAK-O":
    "Kompensacja (bateria kondensatorów) i regularne sprawdzanie tgφ. Kalkulator liczy, jaką moc kompensacji potrzebujesz do docelowego tgφ; kwotę opłaty — dopiero gdy wpiszesz cenę C_rk.",
  "UI-FAQ-FIRMA-MOCOWA-P": "Ile wynosi opłata mocowa dla firm w 2026 roku?",
  "UI-FAQ-FIRMA-MOCOWA-O":
    "0,2194 zł/kWh netto za energię pobraną w dni robocze w godzinach 7:00–22:00 (Informacja Prezesa URE nr 58/2025). To +55,3% wobec 0,1413 zł/kWh w 2025.",
  "UI-FAQ-FIRMA-MOCOWA-L": "Opłata mocowa",
  "UI-FAQ-FIRMA-NET-BILLING-P": "Czy net-billing dla firm się opłaca?",
  "UI-FAQ-FIRMA-NET-BILLING-O":
    "Kluczowa jest autokonsumpcja: kWh zużyta od razu jest warta pełną cenę zakupu, a oddana — tylko cenę rynkową. Współczynnik bilansowania nie jest stałą 0,3–0,4; aplikacja wylicza go z Twoich danych (wartość nadwyżki ÷ pełny koszt kWh pobranej).",
  "UI-FAQ-FIRMA-NET-BILLING-L": "PV w firmie i autokonsumpcja",
  "UI-FAQ-FIRMA-DEPOZYT-P": "Czym jest depozyt prosumencki firmy?",
  "UI-FAQ-FIRMA-DEPOZYT-O":
    "Wirtualne konto z wartością oddanej energii, zwiększaną o 1,23 (każdy prosument, od 1.02.2025) i ważną 12 miesięcy. Skutki podatkowe po stronie firmy zależą od formy opodatkowania — skonsultuj z księgowym.",
  "UI-FAQ-FIRMA-DEPOZYT-L": "Depozyt prosumencki",
  "UI-FAQ-FIRMA-BESS-CENA-P": "Ile kosztuje magazyn energii dla firmy i kiedy się zwraca?",
  "UI-FAQ-FIRMA-BESS-CENA-O":
    "Aplikacja nie podaje cen z pamięci — ceny zmieniają się szybko. Wpisz ceny z ofert, a kalkulator policzy zwrot z Twoich strumieni korzyści.",
  "UI-FAQ-FIRMA-BESS-CENA-L": "Magazyn (BESS) w firmie",
  "UI-FAQ-FIRMA-DOTACJE-P": "Czy są dotacje na magazyny energii dla firm?",
  "UI-FAQ-FIRMA-DOTACJE-O":
    "„Przydomowe Magazyny Energii” i ulga termomodernizacyjna dotyczą osób fizycznych, nie firm. Regionalny nabór FEPK.02.03-IZ.00-002/26 zakończył się 31.03.2026. Sprawdzaj aktualne nabory w programach regionalnych.",
  "UI-FAQ-FIRMA-DOTACJE-L": "Dotacje i podatki",
  "UI-FAQ-FIRMA-LICZNIK-TEST-P": "Jak sprawdzić, czy licznik działa poprawnie?",
  "UI-FAQ-FIRMA-LICZNIK-TEST-O":
    "Test diody: wyłącz, co się da, i zmierz czas n impulsów. P [kW] = 3600 · n ÷ (czas [s] · stała licznika [imp/kWh]). Przykład: 15 impulsów w 60 s przy 1000 imp/kWh to 0,9 kW.",
  "UI-FAQ-FIRMA-LICZNIK-TEST-L": "Test licznika",
  "UI-FAQ-FIRMA-LICZNIK-REKLAMACJA-P": "Co zrobić, jeśli licznik zawyża?",
  "UI-FAQ-FIRMA-LICZNIK-REKLAMACJA-O":
    "Złóż reklamację — 14 dni to termin odpowiedzi przedsiębiorstwa. Potem możesz zażądać badania laboratoryjnego (OSD ma 14 dni od zgłoszenia). Dodatkową ekspertyzę opłaca odbiorca, chyba że wykaże nieprawidłowości — wtedy koszt ponosi przedsiębiorstwo. Kwoty badania różnią się między OSD — sprawdź cennik swojego operatora.",
  "UI-FAQ-FIRMA-ZMIANA-TARYFY-P": "Czy mogę zmienić taryfę, np. z C11 na C12a?",
  "UI-FAQ-FIRMA-ZMIANA-TARYFY-O":
    "Tak. Najpierw porównaj koszt w każdej dostępnej taryfie dla swojego profilu zużycia — grupy C1x są dla mocy umownej do 40 kW, C2x powyżej.",
  "UI-FAQ-FIRMA-ZMIANA-TARYFY-L": "Porównywarka taryf C",
} as const

type Klucz = keyof typeof pl

export const en: Record<Klucz, string> = {
  "UI-FAQ-DOM-CENA-TRZYMANIA-P": "How much do I pay just for having a grid connection?",
  "UI-FAQ-DOM-CENA-TRZYMANIA-O":
    "This is the “cost of keeping the grid”: the fixed network charge, the subscription charge, the supplier's trading fee and the capacity charge (in G tariffs a flat rate by consumption band), all with VAT — you pay them as long as the contract and the meter exist, even at zero consumption. PV and storage only reduce the variable components. A bill split into fixed and variable parts shows how much that is in your case.",
  "UI-FAQ-DOM-CENA-TRZYMANIA-L": "My bill today",
  "UI-FAQ-DOM-NET-METERING-P": "What is the difference between net-metering and net-billing?",
  "UI-FAQ-DOM-NET-METERING-O":
    "Net-metering (installations with applications filed before 1.04.2022): for 1 kWh exported you take back 0.8 kWh (up to 10 kW) or 0.7 kWh (above), for 15 years. Net-billing: the surplus is valued at the market price (RCEm or the hourly RCE), and the value goes to a prosumer deposit valid for 12 months.",
  "UI-FAQ-DOM-NET-METERING-L": "Prosumer deposit",
  "UI-FAQ-DOM-1-23-P": "Where does the 1.23 factor in the deposit come from?",
  "UI-FAQ-DOM-1-23-O":
    "From the Renewable Energy Sources Act (art. 4c sec. 4): the deposit value for a given month is increased by 1.23 — for every prosumer, from 1.02.2025.",
  "UI-FAQ-DOM-ZWROT-DEPOZYTU-P": "What happens to an unused deposit?",
  "UI-FAQ-DOM-ZWROT-DEPOZYTU-O":
    "After 12 months you can get a refund, but at most 20% of the value of the energy from a given month with RCEm settlement or 30% with RCE. The rest is written off. A negative RCE price counts as zero.",
  "UI-FAQ-DOM-JEDNOKIERUNKOWE-P": "Can I go back from RCE to RCEm, or from net-billing to net-metering?",
  "UI-FAQ-DOM-JEDNOKIERUNKOWE-O":
    "No. Both transitions are one-way (art. 4b sec. 2b and art. 4d sec. 1 of the Renewable Energy Sources Act).",
  "UI-FAQ-DOM-ODLACZENIE-P": "Does it pay to disconnect from the grid completely?",
  "UI-FAQ-DOM-ODLACZENIE-O":
    "It depends on your winter consumption, location and equipment prices. The A–D comparison shows the cheapest and the most independent scenario side by side. An old prosumer on net-metering usually wins with scenario A — the app will say so honestly, even if the result sounds like “stay”.",
  "UI-FAQ-DOM-ODLACZENIE-L": "Comparison of scenarios A–D",
  "UI-FAQ-DOM-NAJPIERW-P": "Where do I start if I am thinking about disconnecting?",
  "UI-FAQ-DOM-NAJPIERW-O":
    "With reversible steps: calculate the scenarios, build an island system and test it for a full winter while the grid is still connected. Terminating the contract is only step 5 of 7.",
  "UI-FAQ-DOM-NAJPIERW-L": "How to give up the grid connection",
  "UI-FAQ-DOM-AGREGAT-P": "Can I plug a generator into a socket?",
  "UI-FAQ-DOM-AGREGAT-O":
    "No. A generator supplies the building installation only through a changeover switch with a 0 position and an interlock — otherwise it can feed voltage into the grid or onto the pins of a plug. A combustion generator never in a living space (carbon monoxide).",
  "UI-FAQ-DOM-AGREGAT-L": "Grid/island changeover switch",
  "UI-FAQ-DOM-LICZNIK-P": "I suspect the meter over-reads. What should I do?",
  "UI-FAQ-DOM-LICZNIK-O":
    "Do the LED test, then file a complaint. 14 days is the company's deadline to reply, not the deadline for filing the complaint. The DSO carries out a laboratory test of the meter within 14 days of the request.",
  "UI-FAQ-DOM-LICZNIK-L": "Meter test and complaint",
  "UI-FAQ-FIRMA-REGULOWANE-P": "Are prices in C tariffs unregulated?",
  "UI-FAQ-FIRMA-REGULOWANE-O":
    "Energy sales are unregulated. Distribution rates for C groups are approved every year by the President of URE (the Energy Regulatory Office) — those are in the DSO tariff file.",
  "UI-FAQ-FIRMA-BIERNA-KTO-P": "Does a business on a C tariff pay for reactive power?",
  "UI-FAQ-FIRMA-BIERNA-KTO-O":
    "Only if it follows from the connection conditions or the contract — in practice mainly customers above 40 kW. Check whether your invoice has an item for reactive energy. The charge applies to the excess above tgφ₀ (0.4 by default, never below 0.2).",
  "UI-FAQ-FIRMA-BIERNA-KTO-L": "Reactive power",
  "UI-FAQ-FIRMA-BIERNA-JAK-P": "How do I avoid reactive power charges?",
  "UI-FAQ-FIRMA-BIERNA-JAK-O":
    "Compensation (a capacitor bank) and regular checks of tgφ. The calculator computes the compensation power you need for the target tgφ; the charge amount only once you enter the price C_rk.",
  "UI-FAQ-FIRMA-MOCOWA-P": "How much is the capacity charge for businesses in 2026?",
  "UI-FAQ-FIRMA-MOCOWA-O":
    "0.2194 PLN/kWh net for energy drawn on working days between 7:00 and 22:00 (Information of the President of URE no. 58/2025). That is +55.3% compared with 0.1413 PLN/kWh in 2025.",
  "UI-FAQ-FIRMA-MOCOWA-L": "Capacity charge",
  "UI-FAQ-FIRMA-NET-BILLING-P": "Does net-billing pay off for businesses?",
  "UI-FAQ-FIRMA-NET-BILLING-O":
    "Self-consumption is the key: a kWh used immediately is worth the full purchase price, one exported — only the market price. The balancing factor is not a constant 0.3–0.4; the app calculates it from your data (surplus value ÷ full cost of a kWh drawn).",
  "UI-FAQ-FIRMA-NET-BILLING-L": "PV in a business and self-consumption",
  "UI-FAQ-FIRMA-DEPOZYT-P": "What is a business prosumer deposit?",
  "UI-FAQ-FIRMA-DEPOZYT-O":
    "A virtual account holding the value of exported energy, increased by 1.23 (every prosumer, from 1.02.2025) and valid for 12 months. The tax consequences for the business depend on its form of taxation — consult your accountant.",
  "UI-FAQ-FIRMA-DEPOZYT-L": "Prosumer deposit",
  "UI-FAQ-FIRMA-BESS-CENA-P": "How much does energy storage for a business cost and when does it pay back?",
  "UI-FAQ-FIRMA-BESS-CENA-O":
    "The app does not quote prices from memory — prices change quickly. Enter prices from offers, and the calculator will compute the payback from your benefit streams.",
  "UI-FAQ-FIRMA-BESS-CENA-L": "Storage (BESS) in a business",
  "UI-FAQ-FIRMA-DOTACJE-P": "Are there subsidies for energy storage for businesses?",
  "UI-FAQ-FIRMA-DOTACJE-O":
    "“Przydomowe Magazyny Energii” (home energy storage programme) and the thermal-modernisation tax relief apply to individuals, not businesses. The regional call FEPK.02.03-IZ.00-002/26 ended on 31.03.2026. Check current calls in regional programmes.",
  "UI-FAQ-FIRMA-DOTACJE-L": "Subsidies and taxes",
  "UI-FAQ-FIRMA-LICZNIK-TEST-P": "How do I check that the meter works correctly?",
  "UI-FAQ-FIRMA-LICZNIK-TEST-O":
    "LED test: switch off whatever you can and time n pulses. P [kW] = 3600 · n ÷ (time [s] · meter constant [imp/kWh]). Example: 15 pulses in 60 s at 1000 imp/kWh is 0.9 kW.",
  "UI-FAQ-FIRMA-LICZNIK-TEST-L": "Meter test",
  "UI-FAQ-FIRMA-LICZNIK-REKLAMACJA-P": "What should I do if the meter over-reads?",
  "UI-FAQ-FIRMA-LICZNIK-REKLAMACJA-O":
    "File a complaint — 14 days is the company's deadline to reply. Then you can request a laboratory test (the DSO has 14 days from the request). An additional expert examination is paid by the customer, unless it shows irregularities — then the company bears the cost. Test fees differ between DSOs — check your operator's price list.",
  "UI-FAQ-FIRMA-ZMIANA-TARYFY-P": "Can I change tariff, e.g. from C11 to C12a?",
  "UI-FAQ-FIRMA-ZMIANA-TARYFY-O":
    "Yes. First compare the cost in every available tariff for your consumption profile — C1x groups are for contracted capacity up to 40 kW, C2x above.",
  "UI-FAQ-FIRMA-ZMIANA-TARYFY-L": "C tariff comparison",
}

export const ru: Record<Klucz, string> = {
  "UI-FAQ-DOM-CENA-TRZYMANIA-P": "Сколько я плачу только за то, что у меня есть подключение к сети?",
  "UI-FAQ-DOM-CENA-TRZYMANIA-O":
    "Это «цена удержания сети»: постоянная сетевая плата, абонентская плата, торговая плата продавца и плата за мощность (в тарифах G — фиксированная сумма по порогу потребления), всё с НДС — вы платите их, пока существуют договор и счётчик, даже при нулевом потреблении. PV и накопитель снижают только переменные составляющие. Счёт, разбитый на постоянную и переменную части, покажет, сколько это в вашем случае.",
  "UI-FAQ-DOM-CENA-TRZYMANIA-L": "Мой счёт сегодня",
  "UI-FAQ-DOM-NET-METERING-P": "Чем net-metering отличается от net-billing?",
  "UI-FAQ-DOM-NET-METERING-O":
    "Net-metering (установки с заявками до 1.04.2022): за 1 кВт·ч, отданный в сеть, вы забираете 0,8 кВт·ч (до 10 кВт) или 0,7 кВт·ч (свыше), в течение 15 лет. Net-billing: излишек оценивается по рыночной цене (RCEm или почасовая RCE), а стоимость поступает на депозит просьюмера, действующий 12 месяцев.",
  "UI-FAQ-DOM-NET-METERING-L": "Депозит просьюмера",
  "UI-FAQ-DOM-1-23-P": "Откуда коэффициент 1,23 в депозите?",
  "UI-FAQ-DOM-1-23-O":
    "Из закона о ВИЭ (ст. 4c п. 4): стоимость депозита за данный месяц увеличивается на 1,23 — для каждого просьюмера, с 1.02.2025.",
  "UI-FAQ-DOM-ZWROT-DEPOZYTU-P": "Что происходит с неиспользованным депозитом?",
  "UI-FAQ-DOM-ZWROT-DEPOZYTU-O":
    "Через 12 месяцев можно получить возврат, но не более 20% стоимости энергии за данный месяц при расчёте по RCEm или 30% при RCE. Остальное списывается. Отрицательная цена RCE считается как ноль.",
  "UI-FAQ-DOM-JEDNOKIERUNKOWE-P": "Можно ли вернуться с RCE на RCEm или с net-billing на net-metering?",
  "UI-FAQ-DOM-JEDNOKIERUNKOWE-O":
    "Нет. Оба перехода односторонние (ст. 4b п. 2b и ст. 4d п. 1 закона о ВИЭ).",
  "UI-FAQ-DOM-ODLACZENIE-P": "Выгодно ли полностью отключиться от сети?",
  "UI-FAQ-DOM-ODLACZENIE-O":
    "Это зависит от вашего зимнего потребления, местоположения и цен на оборудование. Сравнение A–D показывает рядом самый дешёвый и самый независимый сценарий. Старый просьюмер на net-metering обычно выигрывает со сценарием A — приложение честно это скажет, даже если результат звучит как «оставайтесь».",
  "UI-FAQ-DOM-ODLACZENIE-L": "Сравнение сценариев A–D",
  "UI-FAQ-DOM-NAJPIERW-P": "С чего начать, если я думаю об отключении?",
  "UI-FAQ-DOM-NAJPIERW-O":
    "С обратимых шагов: рассчитайте сценарии, постройте автономную систему и испытайте её в течение полной зимы при ещё подключённой сети. Расторжение договора — только шаг 5 из 7.",
  "UI-FAQ-DOM-NAJPIERW-L": "Как отказаться от подключения",
  "UI-FAQ-DOM-AGREGAT-P": "Можно ли подключить генератор к розетке?",
  "UI-FAQ-DOM-AGREGAT-O":
    "Нет. Генератор питает электроустановку здания только через переключатель с положением 0 и блокировкой — иначе он может подать напряжение в сеть или на штыри вилки. Бензиновый/дизельный генератор — никогда в жилом помещении (угарный газ).",
  "UI-FAQ-DOM-AGREGAT-L": "Переключатель сеть/остров",
  "UI-FAQ-DOM-LICZNIK-P": "Подозреваю, что счётчик завышает показания. Что делать?",
  "UI-FAQ-DOM-LICZNIK-O":
    "Сделайте тест светодиода, затем подайте жалобу. 14 дней — это срок ответа компании, а не срок подачи жалобы. Лабораторную проверку счётчика ОСР проводит в течение 14 дней с момента заявки.",
  "UI-FAQ-DOM-LICZNIK-L": "Тест счётчика и жалоба",
  "UI-FAQ-FIRMA-REGULOWANE-P": "Цены в тарифах C нерегулируемые?",
  "UI-FAQ-FIRMA-REGULOWANE-O":
    "Нерегулируемой является продажа энергии. Ставки распределения для групп C ежегодно утверждает Председатель URE (Управление регулирования энергетики) — именно они находятся в файле тарифов ОСР.",
  "UI-FAQ-FIRMA-BIERNA-KTO-P": "Платит ли фирма на тарифе C за реактивную мощность?",
  "UI-FAQ-FIRMA-BIERNA-KTO-O":
    "Только если это следует из условий подключения или договора — на практике в основном потребители свыше 40 кВт. Проверьте, есть ли в счёте позиция за реактивную энергию. Плата касается превышения сверх tgφ₀ (по умолчанию 0,4, никогда не ниже 0,2).",
  "UI-FAQ-FIRMA-BIERNA-KTO-L": "Реактивная мощность",
  "UI-FAQ-FIRMA-BIERNA-JAK-P": "Как избежать платы за реактивную мощность?",
  "UI-FAQ-FIRMA-BIERNA-JAK-O":
    "Компенсация (конденсаторная батарея) и регулярная проверка tgφ. Калькулятор рассчитывает, какая мощность компенсации нужна для целевого tgφ; сумму платы — только после ввода цены C_rk.",
  "UI-FAQ-FIRMA-MOCOWA-P": "Сколько составляет плата за мощность для фирм в 2026 году?",
  "UI-FAQ-FIRMA-MOCOWA-O":
    "0,2194 зл/кВт·ч нетто за энергию, потреблённую в рабочие дни с 7:00 до 22:00 (Информация Председателя URE № 58/2025). Это +55,3% по сравнению с 0,1413 зл/кВт·ч в 2025 году.",
  "UI-FAQ-FIRMA-MOCOWA-L": "Плата за мощность",
  "UI-FAQ-FIRMA-NET-BILLING-P": "Выгоден ли net-billing для фирм?",
  "UI-FAQ-FIRMA-NET-BILLING-O":
    "Ключевое — самопотребление: кВт·ч, использованный сразу, стоит полную цену покупки, а отданный в сеть — только рыночную цену. Коэффициент баланса — не постоянная 0,3–0,4; приложение рассчитывает его из ваших данных (стоимость излишка ÷ полная стоимость потреблённого кВт·ч).",
  "UI-FAQ-FIRMA-NET-BILLING-L": "PV в фирме и самопотребление",
  "UI-FAQ-FIRMA-DEPOZYT-P": "Что такое депозит просьюмера фирмы?",
  "UI-FAQ-FIRMA-DEPOZYT-O":
    "Виртуальный счёт со стоимостью отданной энергии, увеличенной на 1,23 (каждый просьюмер, с 1.02.2025) и действующей 12 месяцев. Налоговые последствия для фирмы зависят от формы налогообложения — проконсультируйтесь с бухгалтером.",
  "UI-FAQ-FIRMA-DEPOZYT-L": "Депозит просьюмера",
  "UI-FAQ-FIRMA-BESS-CENA-P": "Сколько стоит накопитель энергии для фирмы и когда он окупается?",
  "UI-FAQ-FIRMA-BESS-CENA-O":
    "Приложение не называет цены по памяти — цены быстро меняются. Введите цены из предложений, и калькулятор рассчитает окупаемость по вашим потокам выгод.",
  "UI-FAQ-FIRMA-BESS-CENA-L": "Накопитель (BESS) в фирме",
  "UI-FAQ-FIRMA-DOTACJE-P": "Есть ли субсидии на накопители энергии для фирм?",
  "UI-FAQ-FIRMA-DOTACJE-O":
    "«Przydomowe Magazyny Energii» (программа домашних накопителей) и налоговая льгота на термомодернизацию касаются физических лиц, а не фирм. Региональный набор FEPK.02.03-IZ.00-002/26 завершился 31.03.2026. Следите за текущими наборами в региональных программах.",
  "UI-FAQ-FIRMA-DOTACJE-L": "Субсидии и налоги",
  "UI-FAQ-FIRMA-LICZNIK-TEST-P": "Как проверить, правильно ли работает счётчик?",
  "UI-FAQ-FIRMA-LICZNIK-TEST-O":
    "Тест светодиода: выключите всё, что можно, и измерьте время n импульсов. P [кВт] = 3600 · n ÷ (время [с] · постоянная счётчика [имп/кВт·ч]). Пример: 15 импульсов за 60 с при 1000 имп/кВт·ч — это 0,9 кВт.",
  "UI-FAQ-FIRMA-LICZNIK-TEST-L": "Тест счётчика",
  "UI-FAQ-FIRMA-LICZNIK-REKLAMACJA-P": "Что делать, если счётчик завышает показания?",
  "UI-FAQ-FIRMA-LICZNIK-REKLAMACJA-O":
    "Подайте жалобу — 14 дней — это срок ответа компании. Затем можно потребовать лабораторную проверку (у ОСР есть 14 дней с момента заявки). Дополнительную экспертизу оплачивает потребитель, если только она не выявит нарушений — тогда расходы несёт компания. Стоимость проверки у разных ОСР разная — проверьте прейскурант своего оператора.",
  "UI-FAQ-FIRMA-ZMIANA-TARYFY-P": "Можно ли сменить тариф, например с C11 на C12a?",
  "UI-FAQ-FIRMA-ZMIANA-TARYFY-O":
    "Да. Сначала сравните стоимость во всех доступных тарифах для своего профиля потребления — группы C1x предназначены для договорной мощности до 40 кВт, C2x — свыше.",
  "UI-FAQ-FIRMA-ZMIANA-TARYFY-L": "Сравнение тарифов C",
}
