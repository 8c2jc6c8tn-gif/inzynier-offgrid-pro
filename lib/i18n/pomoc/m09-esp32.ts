/**
 * Help content — Module 9 (ESP32). Rule-based screens: the snapshot explains the checks the engine
 * really makes; no invented thresholds (Directive #1). The reliability checklist keeps its own
 * per-item hints on `PoleCheckbox`, so it gets a snapshot only.
 */
import type { Tlumaczenie } from "./typy"

const TWOJ = "Twoja instalacja — aplikacja nie przyjmuje typowej wartości za Ciebie."
const KARTA = "Karta katalogowa przetwornicy."

export const pl = {
  "wybor-plytki-esp32": {
    migawka: {
      oCoChodzi: "Nie każdy ESP32 jest taki sam — wybierz płytkę pod swoje potrzeby (liczba czujników, zasilanie), a nie na odwrót.",
      jakDziala: "Każdy wariant z tabeli ma cechę, którą wyróżnia go źródło: DevKit V1 — dużo GPIO, WROOM-32U — gniazdo anteny zewnętrznej, S3 — więcej mocy i szybsze ADC, C3 — małe zużycie (bateria), POE — zasilanie przez Ethernet. Liczę, ile Twoich potrzeb pokrywa każdy wariant, i polecam te z największą liczbą. Gdy żaden nie ma wszystkiego naraz — mówię to wprost.",
      poCo: "Nie kupisz płytki, której zabraknie pinów albo która wyczerpie baterię w kilka dni.",
      fizyka: "rekomendacja = wariant z największą liczbą pokrytych potrzeb.",
    },
    pola: {
      zasilanie: { nazwa: "Zasilanie sterownika", cel: "Praca na baterii wskazuje wariant o małym zużyciu (C3), zasilanie przez Ethernet — wariant POE.", gdzie: "Twój projekt: czy sterownik ma stałe zasilanie (np. z magistrali przez przetwornicę), baterię, czy kabel sieciowy z PoE.", zakres: "Stałe / bateria / PoE." },
    },
  },
  "montaz-obudowa-esp32": {
    migawka: {
      oCoChodzi: "ESP32 to elektronika — potrzebuje suchego, przewiewnego miejsca, z dala od tego, co grzeje i co jest pod napięciem.",
      jakDziala: "Sprawdzam stopień IP obudowy wobec miejsca: w suchej rozdzielni wystarcza IP20; w miejscu wilgotnym poniżej IP55 to błąd (ten sam próg co ochrona baterii przed wilgocią, Moduł 4), a IP55–IP64 — ostrzeżenie z zaleceniem IP65. Ostrzegam też przy odstępie od szyn prądowych mniejszym niż {odstep} cm, braku wentylacji i braku izolacji od części pod napięciem.",
      poCo: "Sterownik nie zawiedzie przez wilgoć, przegrzanie albo przebicie z sąsiedniej szyny.",
      fizyka: "IP_obudowy ≥ IP_min; odstęp od szyn ≥ {odstep} cm.",
    },
    pola: {
      miejsce: { nazwa: "Miejsce montażu", cel: "Od miejsca zależy wymagany stopień IP obudowy.", gdzie: "Gdzie stanie rozdzielnia ze sterownikiem: suche pomieszczenie czy miejsce wilgotne (garaż, komórka, piwnica).", zakres: "Suche / wilgotne." },
      ipKod: { nazwa: "Stopień ochrony obudowy (IP)", cel: "Porównywany z wymaganym dla miejsca montażu.", gdzie: "Tabliczka albo karta katalogowa obudowy (np. „IP65”).", zakres: "IP20…IP68." },
      montaz: { nazwa: "Sposób montażu", cel: "Zalecany jest montaż na szynie DIN albo płycie montażowej.", gdzie: "Twój projekt rozdzielni.", zakres: "Szyna DIN / płyta montażowa / inny." },
      odstepOdSzynCm: { nazwa: "Odstęp od szyn prądowych [cm]", cel: "Porównywany z minimum {odstep} cm.", gdzie: "Zmierz odległość obudowy sterownika od najbliższej szyny albo toru prądowego.", zakres: "≥ 0 cm." },
      wentylacja: { nazwa: "Wentylacja obudowy", cel: "Elektronika potrzebuje odprowadzenia ciepła — brak wentylacji to ostrzeżenie.", gdzie: "Czy obudowa albo rozdzielnia ma otwory, kratki lub wentylator.", zakres: "Tak / nie." },
      izolacja: { nazwa: "Izolacja od części pod napięciem", cel: "ESP32 musi być oddzielony od elementów pod napięciem — brak to ostrzeżenie.", gdzie: "Przegroda, osłona albo osobna obudowa między sterownikiem a torami prądowymi.", zakres: "Tak / nie." },
    },
  },
  "katalog-aktuatorow": {
    migawka: {
      oCoChodzi: "To są „ręce” systemu — przez nie ESP32 realnie coś włącza, wyłącza albo reguluje, nie tylko obserwuje.",
      jakDziala: "Wybierasz typ z katalogu (pod listą widzisz technologię, kluczowe dane doboru i uwagę z Biblii), nadajesz etykietę i miejsce. Liczę, ile wyjść dodałeś i ilu różnych typów.",
      poCo: "Masz jedną listę wyjść sterujących — podstawę do przydziału pinów i zasilania ESP32.",
    },
    pola: {
      typ: { nazwa: "Typ wyjścia", cel: "Wybiera pozycję z katalogu — pod polem widać technologię, dane doboru i uwagę.", gdzie: "Co ESP32 ma załączać albo regulować.", zakres: "Lista katalogu." },
      etykieta: { nazwa: "Etykieta wyjścia", cel: "Twoja nazwa tego egzemplarza — bez niej nie da się go dodać.", gdzie: "Dowolna, np. „SSR — grzałka bojlera”.", zakres: "Tekst, wymagany." },
      lokalizacja: { nazwa: "Miejsce montażu", cel: "Tylko opis — gdzie element jest zamontowany.", gdzie: "Dowolne, np. „rozdzielnia”.", zakres: "Tekst, opcjonalny." },
    },
  },
  "katalog-protokolow": {
    migawka: {
      oCoChodzi: "To sposoby, jak ESP32 „rozmawia” ze światem zewnętrznym — od kabla obok (RS485) po kilometry przez radio (LoRa).",
      jakDziala: "Wybierasz protokół z katalogu (pod listą widzisz zastosowanie, kluczowe dane i uwagę z Biblii), nadajesz etykietę i miejsce. Liczę, ile łączy dodałeś i ilu różnych rodzajów. Połączenia z konkretnymi urządzeniami sprawdza ekran „Architektura komunikacji”.",
      poCo: "Masz jedną listę łączy sterownika — wiesz, jakie transceivery i moduły trzeba kupić.",
    },
    pola: {
      typ: { nazwa: "Protokół", cel: "Wybiera pozycję z katalogu — pod polem widać zastosowanie, dane i uwagę.", gdzie: "Instrukcja urządzenia, z którym ESP32 ma rozmawiać (rozdział o komunikacji).", zakres: "Lista katalogu." },
      etykieta: { nazwa: "Etykieta łącza", cel: "Twoja nazwa tego łącza — bez niej nie da się go dodać.", gdzie: "Dowolna, np. „RS485 — falownik”.", zakres: "Tekst, wymagany." },
      lokalizacja: { nazwa: "Dokąd prowadzi", cel: "Tylko opis — gdzie jest drugi koniec łącza.", gdzie: "Dowolne, np. „BMS w garażu”.", zakres: "Tekst, opcjonalny." },
    },
  },
  "katalog-interfejsu-lokalnego": {
    migawka: {
      oCoChodzi: "To sposób, żeby dowiedzieć się, co się dzieje z systemem, nawet gdy telefon jest w drugim pokoju albo nie ma zasięgu.",
      jakDziala: "Wybierasz element z katalogu (pod listą widzisz opcje, zastosowanie i uwagę z Biblii), nadajesz etykietę i miejsce. Liczę, ile elementów dodałeś i ilu różnych rodzajów.",
      poCo: "Masz jedną listę wyświetlaczy, diod, przycisków i brzęczyków — podstawę do przydziału pinów ESP32.",
    },
    pola: {
      typ: { nazwa: "Element interfejsu", cel: "Wybiera pozycję z katalogu — pod polem widać opcje, zastosowanie i uwagę.", gdzie: "Jak chcesz odczytywać stan systemu albo sterować nim na miejscu.", zakres: "Lista katalogu." },
      etykieta: { nazwa: "Etykieta elementu", cel: "Twoja nazwa tego egzemplarza — bez niej nie da się go dodać.", gdzie: "Dowolna, np. „OLED — drzwi rozdzielni”.", zakres: "Tekst, wymagany." },
      lokalizacja: { nazwa: "Miejsce montażu", cel: "Tylko opis — gdzie element jest zamontowany.", gdzie: "Dowolne, np. „korytarz”.", zakres: "Tekst, opcjonalny." },
    },
  },
  "architektura-komunikacji": {
    migawka: {
      oCoChodzi: "ESP32 to tłumacz między urządzeniami mówiącymi różnymi „językami” elektrycznymi — do każdego potrzebuje odpowiedniego adaptera. Zwykle: RS485 → falownik, CAN → BMS, Wi-Fi → aplikacja.",
      jakDziala: "Dla każdego połączenia sprawdzam: czy RS485 i CAN idą przez transceiver (bez niego port ESP32 zostanie uszkodzony albo magistrala nie ruszy), czy na RS485 nie powtarza się adres Modbus i czy wszystkie urządzenia na tej samej magistrali mają tę samą prędkość. Zakładam, że wszystkie urządzenia RS485 są na jednej magistrali, a CAN na drugiej.",
      poCo: "Wiesz przed lutowaniem, czego brakuje w schemacie — i nie spalisz pinu ESP32, podpinając go wprost do linii RS485.",
      fizyka: "GPIO → transceiver → magistrala.",
    },
    pola: {
      urzadzenie: { nazwa: "Urządzenie", cel: "Nazwa urządzenia po drugiej stronie połączenia — pojawia się w ostrzeżeniach.", gdzie: "Dowolna, np. „Falownik”, „BMS”.", zakres: "Tekst." },
      protokol: { nazwa: "Protokół komunikacji", cel: "Rodzaj połączenia — od niego zależy, czy potrzebny jest transceiver i czy liczy się adres.", gdzie: "Instrukcja urządzenia — rozdział o komunikacji (port RS485/Modbus, CAN, Wi-Fi…).", zakres: "RS485 / CAN / Wi-Fi / Ethernet / Bluetooth / LoRa." },
      transceiver: { nazwa: "Transceiver magistrali", cel: "Układ tłumaczący sygnał pinu ESP32 (3,3 V) na poziomy linii RS485 albo CAN. Bez niego RS485 uszkodzi port, CAN nie zadziała.", gdzie: "Twój schemat — moduł RS485 (np. z układem MAX485) albo CAN (np. SN65HVD230).", zakres: "Tak / nie." },
      adres: { nazwa: "Adres Modbus urządzenia", cel: "Każde urządzenie na jednej magistrali RS485 musi mieć inny adres — sprawdzam powtórzenia.", gdzie: "Menu albo instrukcja urządzenia (ustawienia komunikacji).", zakres: "Liczba całkowita ≥ 1." },
      predkosc: { nazwa: "Prędkość transmisji [bit/s]", cel: "Wszystkie urządzenia na tej samej magistrali muszą mówić z tą samą prędkością — sprawdzam różnice.", gdzie: "Menu albo instrukcja urządzenia (baud rate).", zakres: "Z instrukcji urządzenia." },
    },
  },
  "katalog-czujnikow": {
    migawka: {
      oCoChodzi: "Każdy czujnik to dodatkowe „zmysły” Twojego systemu — dodajesz tyle, ile potrzebujesz, tam, gdzie potrzebujesz.",
      jakDziala: "Wybierasz typ z katalogu (pod listą widzisz model/technologię i kluczowe dane doboru), nadajesz etykietę i miejsce. Liczę, ile czujników dodałeś i ilu różnych typów.",
      poCo: "Masz jedną listę czujników w instalacji — podstawę do przydziału pinów, zasilania i komunikacji ESP32.",
    },
    pola: {
      typ: { nazwa: "Typ czujnika", cel: "Wybiera pozycję z katalogu — pod polem widać technologię i kluczowe dane doboru.", gdzie: "Co chcesz mierzyć albo wykrywać.", zakres: "Lista katalogu." },
      etykieta: { nazwa: "Etykieta czujnika", cel: "Twoja nazwa tego egzemplarza — bez niej czujnika nie da się dodać.", gdzie: "Dowolna, np. „Czujnik dymu — sypialnia”.", zakres: "Tekst, wymagany." },
      lokalizacja: { nazwa: "Miejsce montażu", cel: "Tylko opis — gdzie czujnik jest zamontowany.", gdzie: "Dowolne, np. „kotłownia”.", zakres: "Tekst, opcjonalny." },
    },
  },
  "niezawodnosc-esp32": {
    migawka: {
      oCoChodzi: "„System odpornościowy” ESP32: żeby nie stracił danych przy zaniku prądu, nie zawiesił się na trwałe, nie oberwał przepięciem i dało się go bezpiecznie aktualizować.",
      jakDziala: "Zaznaczasz funkcje, które ma Twój sterownik (opis każdej jest pod przełącznikiem). Liczę, ile jest włączonych. Jeśli masz aktualizację OTA, sprawdzam, czy weryfikuje podpis, sumę kontrolną i umożliwia powrót do poprzedniej wersji — bez tego jedna zła aktualizacja może unieruchomić sterownik.",
      poCo: "Wiesz, której „tarczy” brakuje, zanim sterownik zawiedzie w najgorszym momencie — w nocy, zimą, bez dostępu do niego.",
      fizyka: "OTA ⇒ podpis ∧ suma kontrolna ∧ rollback.",
    },
    pola: {},
  },
  "przydzial-pinow": {
    migawka: {
      oCoChodzi: "Zanim podłączysz kable, rozplanuj piny na mapie — inaczej zrobisz sobie plątaninę, którą trudno będzie rozplątać.",
      jakDziala: "Sprawdzam, czy żaden pin nie ma dwóch różnych funkcji ani dwa razy tej samej funkcji niewspółdzielonej. Linie magistral (I2C SDA/SCL, 1-Wire, SPI MOSI/MISO/SCK) wolno dzielić; każdy układ SPI potrzebuje własnego CS. Przy aktywnym Wi-Fi ostrzegam o ograniczeniu wejść ADC2.",
      poCo: "Wiesz przed lutowaniem, że żaden pin nie jest przydzielony dwa razy — i że pomiary analogowe nie zgasną po włączeniu Wi-Fi.",
      fizyka: "∀ GPIO: jedna funkcja (poza liniami magistral współdzielonych).",
    },
    pola: {
      gpio: { nazwa: "Numer pinu GPIO", cel: "Pin ESP32, do którego coś podłączasz — po nim wykrywam konflikty.", gdzie: "Pinout Twojej płytki ESP32 (karta katalogowa albo nadruk na płytce).", zakres: "Liczba całkowita ≥ 0." },
      funkcja: { nazwa: "Funkcja pinu", cel: "Do czego służy pin — od tego zależy, czy wolno go dzielić z innym urządzeniem.", gdzie: "Interfejs podłączanego czujnika albo modułu (I2C, SPI, UART, ADC…).", zakres: "Lista funkcji." },
      opis: { nazwa: "Opis przypisania", cel: "Co jest podłączone — pojawia się w opisie konfliktu.", gdzie: "Dowolny, np. „DS18B20 bufor”.", zakres: "Tekst." },
      wifi: { nazwa: "Wi-Fi aktywne podczas pomiarów", cel: "Gdy Wi-Fi działa, wejścia ADC2 w ESP32 są niedostępne — ostrzegam, jeśli masz piny ADC.", gdzie: "Czy firmware używa Wi-Fi w czasie, gdy odczytuje wejścia analogowe.", zakres: "Tak / nie." },
    },
  },
  "zasilanie-esp32": {
    migawka: {
      oCoChodzi: "ESP32 potrzebuje 5 V albo 3,3 V — przetwornica to jego osobisty zasilacz, dopasowany do napięcia magistrali.",
      jakDziala: "Prąd po stronie ESP32 = pobór ÷ napięcie wyjściowe. Prąd z magistrali = pobór ÷ (sprawność × napięcie magistrali). Sprawdzam, czy najwyższe napięcie magistrali (np. przy ładowaniu) nie przekracza maks. napięcia wejściowego przetwornicy i czy jej prąd wyjściowy wystarczy. Zasilanie bezpośrednio z magistrali jest oznaczane jako błąd.",
      poCo: "Wiesz, czy przetwornica przeżyje ładowanie baterii i uciągnie ESP32 z czujnikami — i jaki prąd pobierze z magistrali (pod bezpiecznik).",
      fizyka: "I_wy = P / U_wy; I_we = P / (η · U_mag); U_mag,max ≤ U_we,max.",
    },
    pola: {
      sposob: { nazwa: "Sposób zasilania ESP32", cel: "Przez przetwornicę step-down albo wprost z magistrali — to drugie oznacza uszkodzenie ESP32.", gdzie: "Twój schemat zasilania sterownika.", zakres: "Przetwornica / bezpośrednio." },
      napiecieMagistraliV: { nazwa: "Nominalne napięcie magistrali [V]", cel: "Napięcie, z którego przetwornica zasila ESP32 — od niego zależy prąd pobierany z magistrali.", gdzie: "Napięcie systemu bateryjnego: 12, 24 albo 48 V.", zakres: "> 0. " + TWOJ },
      napiecieMagistraliMaxV: { nazwa: "Najwyższe napięcie magistrali [V]", cel: "Porównywane z maks. napięciem wejściowym przetwornicy — przy ładowaniu napięcie rośnie ponad nominalne.", gdzie: "Napięcie końca ładowania baterii — z ustawień ładowarki/BMS (np. dla LiFePO4 48 V ok. 58 V).", zakres: "≥ nominalne. Puste = nominalne." },
      poborMocyW: { nazwa: "Pobór mocy ESP32 z czujnikami [W]", cel: "Z niego liczone są prądy po obu stronach przetwornicy.", gdzie: "Suma z kart katalogowych ESP32 i czujników — wartości szczytowe (np. przy nadawaniu Wi-Fi) — albo pomiar.", zakres: "> 0. " + TWOJ },
      napiecieWyjscioweV: { nazwa: "Napięcie wyjściowe przetwornicy [V]", cel: "Napięcie podawane na ESP32 — dzieli pobór mocy na prąd wyjściowy.", gdzie: "Wejście zasilania Twojej płytki: 5 V (pin 5V/VIN) albo 3,3 V (pin 3V3).", zakres: "5 V albo 3,3 V." },
      napiecieWejscioweMaxV: { nazwa: "Maks. napięcie wejściowe przetwornicy [V]", cel: "Jeśli najwyższe napięcie magistrali je przekroczy, przetwornica zostanie uszkodzona.", gdzie: KARTA, zakres: "Z karty katalogowej." },
      pradWyjsciowyMaxA: { nazwa: "Maks. prąd wyjściowy przetwornicy [A]", cel: "Porównywany z prądem potrzebnym ESP32 — za słaba przetwornica spowoduje resety.", gdzie: KARTA, zakres: "Z karty katalogowej." },
      sprawnoscPct: { nazwa: "Sprawność przetwornicy [%]", cel: "Część mocy traconej w przetwornicy — zwiększa prąd pobierany z magistrali.", gdzie: KARTA + " Wykres sprawności dla Twojego obciążenia i napięcia wejściowego.", zakres: "> 0 i ≤ 100 %." },
    },
  },
}

const EN_YOURS = "Your installation — the app never assumes a typical value for you."
const EN_KARTA = "Converter datasheet."

export const en: Tlumaczenie<typeof pl> = {
  "wybor-plytki-esp32": {
    migawka: {
      oCoChodzi: "Not every ESP32 is the same — choose the board for your needs (number of sensors, power supply), not the other way round.",
      jakDziala: "Each variant in the table has the feature the source highlights: DevKit V1 — many GPIOs, WROOM-32U — external antenna socket, S3 — more power and faster ADC, C3 — low consumption (battery), POE — power over Ethernet. I count how many of your needs each variant covers and recommend those with the most. When none has everything at once, I say so plainly.",
      poCo: "You will not buy a board that runs out of pins or drains the battery in a few days.",
      fizyka: "recommendation = variant covering the most needs.",
    },
    pola: {
      zasilanie: { nazwa: "Controller power supply", cel: "Battery operation points to the low-consumption variant (C3), power over Ethernet — to the POE variant.", gdzie: "Your design: does the controller have a permanent supply (e.g. from the bus through a converter), a battery, or a network cable with PoE.", zakres: "Permanent / battery / PoE." },
    },
  },
  "montaz-obudowa-esp32": {
    migawka: {
      oCoChodzi: "The ESP32 is electronics — it needs a dry, airy place, away from what heats up and what is live.",
      jakDziala: "I check the enclosure IP rating against the place: in a dry distribution board IP20 is enough; in a damp place below IP55 is an error (the same threshold as battery moisture protection, Module 4), and IP55–IP64 is a warning recommending IP65. I also warn when the clearance from busbars is below {odstep} cm, when there is no ventilation and no isolation from live parts.",
      poCo: "The controller will not fail because of moisture, overheating or a flashover from a nearby busbar.",
      fizyka: "IP_enclosure ≥ IP_min; busbar clearance ≥ {odstep} cm.",
    },
    pola: {
      miejsce: { nazwa: "Mounting place", cel: "The required enclosure IP rating depends on the place.", gdzie: "Where the board with the controller will stand: a dry room or a damp place (garage, shed, cellar).", zakres: "Dry / damp." },
      ipKod: { nazwa: "Enclosure protection rating (IP)", cel: "Compared with the rating required for the mounting place.", gdzie: "Rating plate or datasheet of the enclosure (e.g. “IP65”).", zakres: "IP20…IP68." },
      montaz: { nazwa: "Mounting method", cel: "Mounting on a DIN rail or a mounting plate is recommended.", gdzie: "Your distribution board design.", zakres: "DIN rail / mounting plate / other." },
      odstepOdSzynCm: { nazwa: "Clearance from busbars [cm]", cel: "Compared with the {odstep} cm minimum.", gdzie: "Measure the distance from the controller enclosure to the nearest busbar or current path.", zakres: "≥ 0 cm." },
      wentylacja: { nazwa: "Enclosure ventilation", cel: "Electronics need heat removal — no ventilation is a warning.", gdzie: "Does the enclosure or board have openings, grilles or a fan.", zakres: "Yes / no." },
      izolacja: { nazwa: "Isolation from live parts", cel: "The ESP32 must be separated from live parts — none is a warning.", gdzie: "A barrier, cover or separate enclosure between the controller and current paths.", zakres: "Yes / no." },
    },
  },
  "katalog-aktuatorow": {
    migawka: {
      oCoChodzi: "These are the “hands” of the system — through them the ESP32 actually switches on, off or regulates something, not just observes.",
      jakDziala: "You pick a type from the catalogue (below the list you see the technology, key selection data and the note from the Bible), give it a label and a place. I count how many outputs you added and of how many types.",
      poCo: "You have one list of control outputs — the basis for ESP32 pin assignment and power supply.",
    },
    pola: {
      typ: { nazwa: "Output type", cel: "Selects a catalogue item — below the field you see the technology, selection data and note.", gdzie: "What the ESP32 should switch or regulate.", zakres: "Catalogue list." },
      etykieta: { nazwa: "Output label", cel: "Your name for this unit — it cannot be added without it.", gdzie: "Any, e.g. “SSR — boiler heater”.", zakres: "Text, required." },
      lokalizacja: { nazwa: "Mounting place", cel: "Description only — where the element is mounted.", gdzie: "Any, e.g. “distribution board”.", zakres: "Text, optional." },
    },
  },
  "katalog-protokolow": {
    migawka: {
      oCoChodzi: "These are the ways the ESP32 “talks” to the outside world — from a cable next to it (RS485) to kilometres over radio (LoRa).",
      jakDziala: "You pick a protocol from the catalogue (below the list you see its use, key data and the note from the Bible), give it a label and a place. I count how many links you added and of how many kinds. Connections to specific devices are checked on the “Communication architecture” screen.",
      poCo: "You have one list of the controller's links — you know which transceivers and modules to buy.",
    },
    pola: {
      typ: { nazwa: "Protocol", cel: "Selects a catalogue item — below the field you see its use, data and note.", gdzie: "Manual of the device the ESP32 should talk to (communication chapter).", zakres: "Catalogue list." },
      etykieta: { nazwa: "Link label", cel: "Your name for this link — it cannot be added without it.", gdzie: "Any, e.g. “RS485 — inverter”.", zakres: "Text, required." },
      lokalizacja: { nazwa: "Where it leads", cel: "Description only — where the other end of the link is.", gdzie: "Any, e.g. “BMS in the garage”.", zakres: "Text, optional." },
    },
  },
  "katalog-interfejsu-lokalnego": {
    migawka: {
      oCoChodzi: "This is how you find out what is happening with the system even when the phone is in another room or there is no signal.",
      jakDziala: "You pick an element from the catalogue (below the list you see the options, use and the note from the Bible), give it a label and a place. I count how many elements you added and of how many kinds.",
      poCo: "You have one list of displays, LEDs, buttons and buzzers — the basis for ESP32 pin assignment.",
    },
    pola: {
      typ: { nazwa: "Interface element", cel: "Selects a catalogue item — below the field you see the options, use and note.", gdzie: "How you want to read the system state or control it on site.", zakres: "Catalogue list." },
      etykieta: { nazwa: "Element label", cel: "Your name for this unit — it cannot be added without it.", gdzie: "Any, e.g. “OLED — board door”.", zakres: "Text, required." },
      lokalizacja: { nazwa: "Mounting place", cel: "Description only — where the element is mounted.", gdzie: "Any, e.g. “hallway”.", zakres: "Text, optional." },
    },
  },
  "architektura-komunikacji": {
    migawka: {
      oCoChodzi: "The ESP32 is a translator between devices speaking different electrical “languages” — it needs the right adapter for each. Typically: RS485 → inverter, CAN → BMS, Wi-Fi → app.",
      jakDziala: "For each connection I check: whether RS485 and CAN go through a transceiver (without one the ESP32 port gets damaged or the bus won't start), whether a Modbus address repeats on RS485, and whether all devices on the same bus use the same speed. I assume all RS485 devices share one bus and CAN another.",
      poCo: "You know before soldering what the schematic is missing — and you won't burn an ESP32 pin by wiring it straight to an RS485 line.",
      fizyka: "GPIO → transceiver → bus.",
    },
    pola: {
      urzadzenie: { nazwa: "Device", cel: "Name of the device at the other end — shown in warnings.", gdzie: "Any, e.g. “Inverter”, “BMS”.", zakres: "Text." },
      protokol: { nazwa: "Communication protocol", cel: "Type of link — decides whether a transceiver is needed and whether an address counts.", gdzie: "Device manual — communication chapter (RS485/Modbus port, CAN, Wi-Fi…).", zakres: "RS485 / CAN / Wi-Fi / Ethernet / Bluetooth / LoRa." },
      transceiver: { nazwa: "Bus transceiver", cel: "A chip translating the ESP32 pin signal (3.3 V) to RS485 or CAN line levels. Without it RS485 damages the port and CAN won't work.", gdzie: "Your schematic — an RS485 module (e.g. MAX485) or CAN module (e.g. SN65HVD230).", zakres: "Yes / no." },
      adres: { nazwa: "Device Modbus address", cel: "Every device on one RS485 bus needs a different address — I check for repeats.", gdzie: "Device menu or manual (communication settings).", zakres: "Integer ≥ 1." },
      predkosc: { nazwa: "Baud rate [bit/s]", cel: "All devices on the same bus must talk at the same speed — I check for differences.", gdzie: "Device menu or manual (baud rate).", zakres: "From the device manual." },
    },
  },
  "katalog-czujnikow": {
    migawka: {
      oCoChodzi: "Every sensor is an extra “sense” for your system — you add as many as you need, where you need them.",
      jakDziala: "You pick a type from the catalogue (below the list you see the model/technology and key selection data), give it a label and place. I count how many sensors you added and of how many types.",
      poCo: "You have one list of sensors in the installation — the basis for ESP32 pin assignment, power and communication.",
    },
    pola: {
      typ: { nazwa: "Sensor type", cel: "Picks a catalogue entry — the technology and key selection data show below the field.", gdzie: "What you want to measure or detect.", zakres: "Catalogue list." },
      etykieta: { nazwa: "Sensor label", cel: "Your name for this unit — the sensor can't be added without it.", gdzie: "Any, e.g. “Smoke detector — bedroom”.", zakres: "Text, required." },
      lokalizacja: { nazwa: "Mounting place", cel: "Just a note — where the sensor is mounted.", gdzie: "Any, e.g. “boiler room”.", zakres: "Text, optional." },
    },
  },
  "niezawodnosc-esp32": {
    migawka: {
      oCoChodzi: "The ESP32 “immune system”: so it doesn't lose data on power loss, doesn't hang for good, doesn't take a surge and can be updated safely.",
      jakDziala: "You tick the features your controller has (each is described under its switch). I count how many are on. If you have OTA updates, I check that they verify the signature and checksum and allow rollback — without that one bad update can brick the controller.",
      poCo: "You know which “shield” is missing before the controller fails at the worst moment — at night, in winter, out of reach.",
      fizyka: "OTA ⇒ signature ∧ checksum ∧ rollback.",
    },
    pola: {},
  },
  "przydzial-pinow": {
    migawka: {
      oCoChodzi: "Before you connect wires, plan the pins on a map — otherwise you'll create a tangle that's hard to undo.",
      jakDziala: "I check that no pin has two different functions or the same non-shareable function twice. Bus lines (I2C SDA/SCL, 1-Wire, SPI MOSI/MISO/SCK) may be shared; every SPI chip needs its own CS. With Wi-Fi active I warn about the ADC2 input limitation.",
      poCo: "You know before soldering that no pin is assigned twice — and that analogue readings won't die when Wi-Fi turns on.",
      fizyka: "∀ GPIO: one function (except shared bus lines).",
    },
    pola: {
      gpio: { nazwa: "GPIO pin number", cel: "The ESP32 pin you connect something to — conflicts are detected by it.", gdzie: "Pinout of your ESP32 board (datasheet or board silkscreen).", zakres: "Integer ≥ 0." },
      funkcja: { nazwa: "Pin function", cel: "What the pin is for — decides whether it may be shared with another device.", gdzie: "Interface of the connected sensor or module (I2C, SPI, UART, ADC…).", zakres: "Function list." },
      opis: { nazwa: "Assignment description", cel: "What is connected — shown in the conflict description.", gdzie: "Any, e.g. “DS18B20 buffer”.", zakres: "Text." },
      wifi: { nazwa: "Wi-Fi active during measurements", cel: "While Wi-Fi runs, the ESP32's ADC2 inputs are unavailable — I warn if you have ADC pins.", gdzie: "Whether the firmware uses Wi-Fi while reading analogue inputs.", zakres: "Yes / no." },
    },
  },
  "zasilanie-esp32": {
    migawka: {
      oCoChodzi: "The ESP32 needs 5 V or 3.3 V — the converter is its personal power supply, matched to the bus voltage.",
      jakDziala: "Current on the ESP32 side = consumption ÷ output voltage. Current from the bus = consumption ÷ (efficiency × bus voltage). I check that the highest bus voltage (e.g. while charging) does not exceed the converter's max input voltage and that its output current is enough. Powering directly from the bus is flagged as an error.",
      poCo: "You know whether the converter survives battery charging and can carry the ESP32 with sensors — and what current it draws from the bus (for the fuse).",
      fizyka: "I_out = P / U_out; I_in = P / (η · U_bus); U_bus,max ≤ U_in,max.",
    },
    pola: {
      sposob: { nazwa: "How the ESP32 is powered", cel: "Through a step-down converter or straight from the bus — the latter means a damaged ESP32.", gdzie: "Your controller power schematic.", zakres: "Converter / direct." },
      napiecieMagistraliV: { nazwa: "Nominal bus voltage [V]", cel: "The voltage the converter feeds the ESP32 from — sets the current drawn from the bus.", gdzie: "Battery system voltage: 12, 24 or 48 V.", zakres: "> 0. " + EN_YOURS },
      napiecieMagistraliMaxV: { nazwa: "Highest bus voltage [V]", cel: "Compared with the converter's max input voltage — while charging the voltage rises above nominal.", gdzie: "Battery end-of-charge voltage — from charger/BMS settings (e.g. about 58 V for 48 V LiFePO4).", zakres: "≥ nominal. Empty = nominal." },
      poborMocyW: { nazwa: "ESP32 with sensors power draw [W]", cel: "Currents on both sides of the converter are computed from it.", gdzie: "Sum from the ESP32 and sensor datasheets — peak values (e.g. during Wi-Fi transmit) — or a measurement.", zakres: "> 0. " + EN_YOURS },
      napiecieWyjscioweV: { nazwa: "Converter output voltage [V]", cel: "The voltage fed to the ESP32 — divides power draw into output current.", gdzie: "Your board's power input: 5 V (5V/VIN pin) or 3.3 V (3V3 pin).", zakres: "5 V or 3.3 V." },
      napiecieWejscioweMaxV: { nazwa: "Converter max input voltage [V]", cel: "If the highest bus voltage exceeds it, the converter gets damaged.", gdzie: EN_KARTA, zakres: "From the datasheet." },
      pradWyjsciowyMaxA: { nazwa: "Converter max output current [A]", cel: "Compared with the current the ESP32 needs — too weak a converter causes resets.", gdzie: EN_KARTA, zakres: "From the datasheet." },
      sprawnoscPct: { nazwa: "Converter efficiency [%]", cel: "The share of power lost in the converter — raises the current drawn from the bus.", gdzie: EN_KARTA + " Efficiency chart for your load and input voltage.", zakres: "> 0 and ≤ 100 %." },
    },
  },
}

const RU_YOURS = "Ваша установка — приложение не принимает типовое значение за вас."
const RU_KARTA = "Паспорт преобразователя."

export const ru: Tlumaczenie<typeof pl> = {
  "wybor-plytki-esp32": {
    migawka: {
      oCoChodzi: "Не каждый ESP32 одинаков — выбирайте плату под свои задачи (число датчиков, питание), а не наоборот.",
      jakDziala: "У каждого варианта в таблице есть свойство, которое выделяет источник: DevKit V1 — много GPIO, WROOM-32U — разъём внешней антенны, S3 — больше мощности и быстрее АЦП, C3 — малое потребление (батарея), POE — питание по Ethernet. Считаю, сколько ваших потребностей покрывает каждый вариант, и рекомендую варианты с наибольшим числом. Если ни один не имеет всего сразу — говорю об этом прямо.",
      poCo: "Вы не купите плату, которой не хватит выводов или которая разрядит батарею за несколько дней.",
      fizyka: "рекомендация = вариант с наибольшим числом покрытых потребностей.",
    },
    pola: {
      zasilanie: { nazwa: "Питание контроллера", cel: "Работа от батареи указывает на вариант с малым потреблением (C3), питание по Ethernet — на вариант POE.", gdzie: "Ваш проект: у контроллера постоянное питание (например, от шины через преобразователь), батарея или сетевой кабель с PoE.", zakres: "Постоянное / батарея / PoE." },
    },
  },
  "montaz-obudowa-esp32": {
    migawka: {
      oCoChodzi: "ESP32 — это электроника: ему нужно сухое, проветриваемое место подальше от того, что греется и находится под напряжением.",
      jakDziala: "Проверяю степень IP корпуса относительно места: в сухом щите достаточно IP20; во влажном месте ниже IP55 — ошибка (тот же порог, что для защиты батареи от влаги, модуль 4), а IP55–IP64 — предупреждение с рекомендацией IP65. Также предупреждаю, если расстояние от токовых шин меньше {odstep} см, нет вентиляции и изоляции от частей под напряжением.",
      poCo: "Контроллер не откажет из-за влаги, перегрева или пробоя с соседней шины.",
      fizyka: "IP_корпуса ≥ IP_мин; расстояние от шин ≥ {odstep} см.",
    },
    pola: {
      miejsce: { nazwa: "Место монтажа", cel: "От места зависит требуемая степень IP корпуса.", gdzie: "Где будет стоять щит с контроллером: сухое помещение или влажное место (гараж, сарай, подвал).", zakres: "Сухое / влажное." },
      ipKod: { nazwa: "Степень защиты корпуса (IP)", cel: "Сравнивается с требуемой для места монтажа.", gdzie: "Табличка или даташит корпуса (например, «IP65»).", zakres: "IP20…IP68." },
      montaz: { nazwa: "Способ монтажа", cel: "Рекомендуется монтаж на DIN-рейку или монтажную панель.", gdzie: "Ваш проект щита.", zakres: "DIN-рейка / монтажная панель / другой." },
      odstepOdSzynCm: { nazwa: "Расстояние от токовых шин [см]", cel: "Сравнивается с минимумом {odstep} см.", gdzie: "Измерьте расстояние от корпуса контроллера до ближайшей шины или токового пути.", zakres: "≥ 0 см." },
      wentylacja: { nazwa: "Вентиляция корпуса", cel: "Электронике нужен отвод тепла — отсутствие вентиляции даёт предупреждение.", gdzie: "Есть ли у корпуса или щита отверстия, решётки или вентилятор.", zakres: "Да / нет." },
      izolacja: { nazwa: "Изоляция от частей под напряжением", cel: "ESP32 должен быть отделён от частей под напряжением — отсутствие даёт предупреждение.", gdzie: "Перегородка, кожух или отдельный корпус между контроллером и токовыми путями.", zakres: "Да / нет." },
    },
  },
  "katalog-aktuatorow": {
    migawka: {
      oCoChodzi: "Это «руки» системы — через них ESP32 реально что-то включает, выключает или регулирует, а не только наблюдает.",
      jakDziala: "Выбираете тип из каталога (под списком видны технология, ключевые данные подбора и примечание из Библии), задаёте метку и место. Считаю, сколько выходов вы добавили и скольких типов.",
      poCo: "У вас один список управляющих выходов — основа для распределения выводов и питания ESP32.",
    },
    pola: {
      typ: { nazwa: "Тип выхода", cel: "Выбирает позицию каталога — под полем видны технология, данные подбора и примечание.", gdzie: "Что ESP32 должен включать или регулировать.", zakres: "Список каталога." },
      etykieta: { nazwa: "Метка выхода", cel: "Ваше название этого экземпляра — без него добавить нельзя.", gdzie: "Любое, например «SSR — ТЭН бойлера».", zakres: "Текст, обязательно." },
      lokalizacja: { nazwa: "Место монтажа", cel: "Только описание — где установлен элемент.", gdzie: "Любое, например «щит».", zakres: "Текст, необязательно." },
    },
  },
  "katalog-protokolow": {
    migawka: {
      oCoChodzi: "Это способы, которыми ESP32 «разговаривает» с внешним миром — от кабеля рядом (RS485) до километров по радио (LoRa).",
      jakDziala: "Выбираете протокол из каталога (под списком видны применение, ключевые данные и примечание из Библии), задаёте метку и место. Считаю, сколько связей вы добавили и скольких видов. Соединения с конкретными устройствами проверяет экран «Архитектура связи».",
      poCo: "У вас один список связей контроллера — вы знаете, какие трансиверы и модули купить.",
    },
    pola: {
      typ: { nazwa: "Протокол", cel: "Выбирает позицию каталога — под полем видны применение, данные и примечание.", gdzie: "Инструкция устройства, с которым должен общаться ESP32 (раздел о связи).", zakres: "Список каталога." },
      etykieta: { nazwa: "Метка связи", cel: "Ваше название этой связи — без него добавить нельзя.", gdzie: "Любое, например «RS485 — инвертор».", zakres: "Текст, обязательно." },
      lokalizacja: { nazwa: "Куда ведёт", cel: "Только описание — где второй конец связи.", gdzie: "Любое, например «BMS в гараже».", zakres: "Текст, необязательно." },
    },
  },
  "katalog-interfejsu-lokalnego": {
    migawka: {
      oCoChodzi: "Это способ узнать, что происходит с системой, даже когда телефон в другой комнате или нет связи.",
      jakDziala: "Выбираете элемент из каталога (под списком видны варианты, применение и примечание из Библии), задаёте метку и место. Считаю, сколько элементов вы добавили и скольких видов.",
      poCo: "У вас один список дисплеев, светодиодов, кнопок и зуммеров — основа для распределения выводов ESP32.",
    },
    pola: {
      typ: { nazwa: "Элемент интерфейса", cel: "Выбирает позицию каталога — под полем видны варианты, применение и примечание.", gdzie: "Как вы хотите считывать состояние системы или управлять ею на месте.", zakres: "Список каталога." },
      etykieta: { nazwa: "Метка элемента", cel: "Ваше название этого экземпляра — без него добавить нельзя.", gdzie: "Любое, например «OLED — дверца щита».", zakres: "Текст, обязательно." },
      lokalizacja: { nazwa: "Место монтажа", cel: "Только описание — где установлен элемент.", gdzie: "Любое, например «коридор».", zakres: "Текст, необязательно." },
    },
  },
  "architektura-komunikacji": {
    migawka: {
      oCoChodzi: "ESP32 — переводчик между устройствами, говорящими на разных электрических «языках»: для каждого нужен свой адаптер. Обычно: RS485 → инвертор, CAN → BMS, Wi-Fi → приложение.",
      jakDziala: "Для каждого соединения проверяю: идут ли RS485 и CAN через трансивер (без него порт ESP32 будет повреждён или шина не заработает), не повторяется ли адрес Modbus на RS485 и одинакова ли скорость у всех устройств на одной шине. Предполагаю, что все устройства RS485 на одной шине, а CAN — на другой.",
      poCo: "Вы знаете до пайки, чего не хватает в схеме, — и не сожжёте вывод ESP32, подключив его напрямую к линии RS485.",
      fizyka: "GPIO → трансивер → шина.",
    },
    pola: {
      urzadzenie: { nazwa: "Устройство", cel: "Название устройства на другом конце соединения — показывается в предупреждениях.", gdzie: "Любое, напр. «Инвертор», «BMS».", zakres: "Текст." },
      protokol: { nazwa: "Протокол связи", cel: "Тип соединения — от него зависит, нужен ли трансивер и учитывается ли адрес.", gdzie: "Инструкция устройства — раздел о связи (порт RS485/Modbus, CAN, Wi-Fi…).", zakres: "RS485 / CAN / Wi-Fi / Ethernet / Bluetooth / LoRa." },
      transceiver: { nazwa: "Трансивер шины", cel: "Микросхема, переводящая сигнал вывода ESP32 (3,3 В) в уровни линии RS485 или CAN. Без неё RS485 повредит порт, CAN не заработает.", gdzie: "Ваша схема — модуль RS485 (напр. MAX485) или CAN (напр. SN65HVD230).", zakres: "Да / нет." },
      adres: { nazwa: "Адрес Modbus устройства", cel: "У каждого устройства на одной шине RS485 должен быть свой адрес — проверяю повторы.", gdzie: "Меню или инструкция устройства (настройки связи).", zakres: "Целое число ≥ 1." },
      predkosc: { nazwa: "Скорость передачи [бит/с]", cel: "Все устройства на одной шине должны работать с одной скоростью — проверяю различия.", gdzie: "Меню или инструкция устройства (baud rate).", zakres: "Из инструкции устройства." },
    },
  },
  "katalog-czujnikow": {
    migawka: {
      oCoChodzi: "Каждый датчик — дополнительное «чувство» вашей системы: добавляете столько, сколько нужно, там, где нужно.",
      jakDziala: "Выбираете тип из каталога (под списком видны модель/технология и ключевые данные подбора), задаёте метку и место. Считаю, сколько датчиков добавлено и скольких типов.",
      poCo: "У вас один список датчиков установки — основа для распределения выводов, питания и связи ESP32.",
    },
    pola: {
      typ: { nazwa: "Тип датчика", cel: "Выбирает позицию каталога — под полем видны технология и ключевые данные подбора.", gdzie: "Что вы хотите измерять или обнаруживать.", zakres: "Список каталога." },
      etykieta: { nazwa: "Метка датчика", cel: "Ваше название этого экземпляра — без него датчик не добавить.", gdzie: "Любое, напр. «Датчик дыма — спальня».", zakres: "Текст, обязательно." },
      lokalizacja: { nazwa: "Место монтажа", cel: "Только описание — где установлен датчик.", gdzie: "Любое, напр. «котельная».", zakres: "Текст, необязательно." },
    },
  },
  "niezawodnosc-esp32": {
    migawka: {
      oCoChodzi: "«Иммунная система» ESP32: чтобы не терять данные при пропадании питания, не зависать навсегда, не пострадать от перенапряжения и безопасно обновляться.",
      jakDziala: "Отмечаете функции, которые есть у контроллера (описание каждой — под переключателем). Считаю, сколько включено. Если есть обновление OTA, проверяю, что оно проверяет подпись и контрольную сумму и позволяет откат — без этого одно плохое обновление может вывести контроллер из строя.",
      poCo: "Вы знаете, какого «щита» не хватает, прежде чем контроллер откажет в худший момент — ночью, зимой, без доступа к нему.",
      fizyka: "OTA ⇒ подпись ∧ контрольная сумма ∧ откат.",
    },
    pola: {},
  },
  "przydzial-pinow": {
    migawka: {
      oCoChodzi: "Прежде чем подключать провода, распланируйте выводы на карте — иначе получится клубок, который трудно распутать.",
      jakDziala: "Проверяю, что ни у одного вывода нет двух разных функций или дважды одной неразделяемой. Линии шин (I2C SDA/SCL, 1-Wire, SPI MOSI/MISO/SCK) можно делить; каждой микросхеме SPI нужен свой CS. При активном Wi-Fi предупреждаю об ограничении входов ADC2.",
      poCo: "Вы знаете до пайки, что ни один вывод не назначен дважды, — и что аналоговые измерения не пропадут после включения Wi-Fi.",
      fizyka: "∀ GPIO: одна функция (кроме общих линий шин).",
    },
    pola: {
      gpio: { nazwa: "Номер вывода GPIO", cel: "Вывод ESP32, к которому вы что-то подключаете, — по нему выявляю конфликты.", gdzie: "Распиновка вашей платы ESP32 (паспорт или маркировка на плате).", zakres: "Целое число ≥ 0." },
      funkcja: { nazwa: "Функция вывода", cel: "Для чего вывод — от этого зависит, можно ли делить его с другим устройством.", gdzie: "Интерфейс подключаемого датчика или модуля (I2C, SPI, UART, ADC…).", zakres: "Список функций." },
      opis: { nazwa: "Описание назначения", cel: "Что подключено — показывается в описании конфликта.", gdzie: "Любое, напр. «DS18B20 буфер».", zakres: "Текст." },
      wifi: { nazwa: "Wi-Fi активен во время измерений", cel: "Когда работает Wi-Fi, входы ADC2 ESP32 недоступны — предупреждаю, если есть выводы ADC.", gdzie: "Использует ли прошивка Wi-Fi во время чтения аналоговых входов.", zakres: "Да / нет." },
    },
  },
  "zasilanie-esp32": {
    migawka: {
      oCoChodzi: "ESP32 нужно 5 В или 3,3 В — преобразователь это его личный блок питания, подобранный под напряжение шины.",
      jakDziala: "Ток на стороне ESP32 = потребление ÷ выходное напряжение. Ток из шины = потребление ÷ (КПД × напряжение шины). Проверяю, не превышает ли наибольшее напряжение шины (напр. при зарядке) макс. входное напряжение преобразователя и хватает ли его выходного тока. Питание напрямую от шины отмечается как ошибка.",
      poCo: "Вы знаете, переживёт ли преобразователь зарядку батареи и потянет ли ESP32 с датчиками — и какой ток он возьмёт из шины (под предохранитель).",
      fizyka: "I_вых = P / U_вых; I_вх = P / (η · U_шины); U_шины,max ≤ U_вх,max.",
    },
    pola: {
      sposob: { nazwa: "Способ питания ESP32", cel: "Через понижающий преобразователь или напрямую от шины — второе означает повреждение ESP32.", gdzie: "Ваша схема питания контроллера.", zakres: "Преобразователь / напрямую." },
      napiecieMagistraliV: { nazwa: "Номинальное напряжение шины [В]", cel: "Напряжение, от которого преобразователь питает ESP32, — определяет ток из шины.", gdzie: "Напряжение батарейной системы: 12, 24 или 48 В.", zakres: "> 0. " + RU_YOURS },
      napiecieMagistraliMaxV: { nazwa: "Наибольшее напряжение шины [В]", cel: "Сравнивается с макс. входным напряжением преобразователя — при зарядке напряжение выше номинального.", gdzie: "Напряжение конца заряда батареи — из настроек зарядного устройства/BMS (напр. около 58 В для LiFePO4 48 В).", zakres: "≥ номинального. Пусто = номинальное." },
      poborMocyW: { nazwa: "Потребление ESP32 с датчиками [Вт]", cel: "Из него рассчитываются токи по обе стороны преобразователя.", gdzie: "Сумма из паспортов ESP32 и датчиков — пиковые значения (напр. при передаче Wi-Fi) — или измерение.", zakres: "> 0. " + RU_YOURS },
      napiecieWyjscioweV: { nazwa: "Выходное напряжение преобразователя [В]", cel: "Напряжение, подаваемое на ESP32, — делит потребление на выходной ток.", gdzie: "Вход питания вашей платы: 5 В (вывод 5V/VIN) или 3,3 В (вывод 3V3).", zakres: "5 В или 3,3 В." },
      napiecieWejscioweMaxV: { nazwa: "Макс. входное напряжение преобразователя [В]", cel: "Если наибольшее напряжение шины его превысит, преобразователь будет повреждён.", gdzie: RU_KARTA, zakres: "Из паспорта." },
      pradWyjsciowyMaxA: { nazwa: "Макс. выходной ток преобразователя [А]", cel: "Сравнивается с током, нужным ESP32, — слабый преобразователь вызовет перезагрузки.", gdzie: RU_KARTA, zakres: "Из паспорта." },
      sprawnoscPct: { nazwa: "КПД преобразователя [%]", cel: "Доля мощности, теряемой в преобразователе, — увеличивает ток из шины.", gdzie: RU_KARTA + " График КПД для вашей нагрузки и входного напряжения.", zakres: "> 0 и ≤ 100 %." },
    },
  },
}
