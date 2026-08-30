# Moduł 9 (Kafel 9): Elektronika / ESP32 / sensoryka — treść ekranów

**Etap 3 — kontynuacja.** Siódmy w pełni opisany moduł treściowy. Ten moduł najintensywniej wykorzystuje wzorzec **H (Katalog komponentów)** z §22 Zasad UX — większość z 50 funkcji to nie osobne ekrany Doradcy, tylko pozycje w katalogu, z którego user dodaje dowolną liczbę elementów.

---

## Sekwencja startowa (5 ekranów, kroki 1:1, Wzorzec D/F)

### EKRAN 1: Wybór płytki ESP32
*(dawne 11.1 — Wzorzec D)*

**A:** liczba planowanych czujników/wejść, wymagane interfejsy, warunki montażu (bateria vs zasilanie stałe).
**B:** porównanie wariantów: DevKit V1 (klasyczny, dużo GPIO), WROOM-32U (lepsze Wi-Fi, gniazdo U.FL na antenę zewnętrzną), S3 (więcej mocy, szybsze ADC), C3 (małe zużycie, RISC-V), POE (zasilanie przez Ethernet).
**C:** *"Do 10 czujników i komunikacji Modbus wybierz ESP32 DevKit V1. Do pracy na baterii lepszy ESP32 C3 (3× mniejszy pobór)."*
**D:** *"Nie każdy ESP32 jest taki sam — wybierz płytkę pod swoje potrzeby (liczba czujników, zasilanie), a nie na odwrót."*

### EKRAN 2: Zasilanie ESP32 z magistrali systemowej
*(dawne 11.2 — Wzorzec D)*

**A:** napięcie magistrali (12/24/48V), sumaryczny pobór ESP32 + podłączone czujniki.
**B:** dobór przetwornicy step-down (np. MP1584, LM2596) pod zakres wejściowy i wymagany prąd; sprawdzenie potrzeby filtra przeciwzakłóceniowego przy zasilaniu z PV.
**C:** *"Magistrala 48V → przetwornica MP1584 → 5V/3.3V dla ESP32. Bezpiecznik 1A na wejściu."*
🔴 *"Nie podłączaj ESP32 bezpośrednio do 12V — spalisz stabilizator wewnętrzny płytki."*
**D:** *"ESP32 potrzebuje 5V albo 3.3V — przetwornica to jego osobisty zasilacz, dopasowany do napięcia magistrali systemowej."*

### EKRAN 3: Montaż i obudowa w rozdzielni
*(dawne 11.3 — Wzorzec F)*

Ilustracja/przewodnik: obudowa DIN lub natynkowa dobrana do warunków (IP20 w suchej rozdzielni, IP65 w wilgotnym garażu); wymagana wentylacja; minimum 2 cm odstępu od szyn prądowych; izolacja od elementów pod napięciem.
**D:** *"ESP32 to elektronika — potrzebuje suchego, przewiewnego miejsca, z dala od tego, co grzeje i co jest pod napięciem."*

### EKRAN 4: Architektura komunikacji
*(dawne 11.4 — Wzorzec D, ekran-koncentrator dla katalogu protokołów)*

**A:** protokoły obsługiwane przez falownik/BMS/aplikację (z bazy komponentów).
**B:** ustalenie architektury: ESP32↔falownik zwykle Modbus RTU/RS485, ESP32↔BMS CAN lub RS485, ESP32↔aplikacja MQTT/WiFi; dobór transceiverów (MAX485, SN65HVD230).
**C:** *"ESP32 → RS485 → falownik; ESP32 → CAN → BMS; ESP32 → Wi-Fi → aplikacja."*
🔴 *"Nie łącz bezpośrednio GPIO 3.3V z magistralą RS485 — wymagany transceiver, inaczej uszkodzisz port."*
**D:** *"ESP32 to tłumacz między urządzeniami mówiącymi różnymi 'językami' elektrycznymi — musi mieć odpowiedni adapter do każdego z nich."*
**Link:** prowadzi do katalogu protokołów komunikacji poniżej.

### EKRAN 5: Konfiguracja GPIO/ADC/I2C/SPI/UART
*(dawne 11.5 — Wzorzec D)*

**A:** lista podłączonych czujników/modułów (z katalogów poniżej).
**B:** przydział pinów do funkcji (I2C: SDA/SCL, SPI: MOSI/MISO/SCK/CS, UART: TX/RX, ADC: pomiary analogowe); sprawdzenie konfliktów i ograniczeń (np. ADC2 niedostępny przy aktywnym Wi-Fi).
**C:** *"GPIO21 – SDA, GPIO22 – SCL, GPIO34 – ADC pomiar napięcia, GPIO16 – UART TX."*
🔴 konflikt dwóch funkcji przypisanych do tego samego pinu.
**D:** *"Zanim podłączysz kable, rozplanuj piny na mapie — inaczej zrobisz sobie plątaninę, którą trudno będzie później rozplątać."*

---

## KATALOG 1: Czujniki (21 pozycji, Wzorzec H)

Jeden ekran "Dodaj czujnik" z listą typów — user dodaje dowolną liczbę instancji każdego typu (np. 3 czujniki temperatury w różnych miejscach), każda instancja konfigurowana osobno (etykieta, lokalizacja, progi alarmowe).

| Pozycja katalogu | Model/technologia | Kluczowe dane doboru |
|---|---|---|
| Napięcie DC | Dzielnik napięcia + ADS1115 | zakres pomiarowy (np. 0-60V), rezystancja wejściowa |
| Prąd DC | INA219 (do 26V/3,2A) lub INA228 (do 85V/20A, precyzyjny) | zakres prądu, rezystor shunt |
| Prąd AC | SCT-013 (przekładnik, np. 100A/50mA) | montaż na otwieranym rdzeniu, kalibracja |
| Moc AC | PZEM-004T (RS485) lub PZEM-003 (UART) | pomiar mocy czynnej, napięcia, prądu, częstotliwości, energii; wymaga izolacji galwanicznej |
| Prąd rozruchu/zwarć | Czujnik Halla (np. ACS758), czas reakcji <10µs | szybkie próbkowanie ADC |
| Temperatura ogniw/baterii | DS18B20 (cyfrowy, 1-Wire, ±0,5°C) lub NTC 10kΩ (analogowy, tańszy, wymaga kalibracji) | liczba punktów pomiarowych |
| Temperatura otoczenia/wilgotność | BME280 (I2C, +ciśnienie) lub SHT31 (dokładniejsza wilgotność) | lokalizacja montażu |
| Nasłonecznienie | BH1750 (cyfrowy, I2C, 0-65535 lx) lub LDR (tani, analogowy) | przelicznik na przybliżone nasłonecznienie |
| Dym/gaz/wodór | MQ-2 (dym, LPG, metan) lub MQ-8 (wodór) | **24h czasu nagrzewania przy pierwszym uruchomieniu** — krytyczne dla dokładności |
| Zalanie/wyciek wody | czujnik przewodowy lub bezprzewodowy | miejsca montażu: pod zlewem, przy bojlerze, w piwnicy |
| Ciśnienie atmosferyczne | BMP280 (I2C) | dane do prognozy pogody i korekty nasłonecznienia |
| Ruch/obecność | PIR (tani) lub radar mmWave (dokładniejszy, wykrywa obecność statyczną) | zastosowanie w automatyce oświetlenia |
| Otwarcie drzwi/obudowy | kontaktron/czujnik magnetyczny | monitoring obudów falownika, baterii, rozdzielni |
| Zalanie rur/szafy elektrycznej | czujnik wilgoci | przy wykryciu — automatyczne odłączenie zasilania szafy |
| Przegrzanie szyn/połączeń | czujnik kontaktowy (DS18B20 w obudowie termoprzewodzącej) | progi: ostrzeżenie 60°C, alarm 80°C |
| Jakość powietrza (CO2/LZO) | SGP30 lub SCD30 (dokładniejszy, + wilgotność/temp.) | czas nagrzewania, kalibracja |
| Wibracje/wstrząsy | MPU6050 lub ADXL345 | montaż na falowniku, pompie ciepła, agregacie — wczesne wykrycie awarii mechanicznej |
| Deszcz/opady | pojemnościowy (wilgoć na powierzchni) lub wagowy (ilość opadu) | integracja z prognozą i produkcją PV |
| Wiatr — prędkość/kierunek | anemometr impulsowy lub RS485 (cyfrowy) | cross-ref Moduł 3 (aerodynamika), Moduł 7 (turbina) |
| Poziom wody w zbiorniku | ultradźwiękowy (bezkontaktowy) lub hydrostatyczny (ciśnieniowy) | wymiary zbiornika do kalibracji |
| Prąd upływu / ochrona różnicowa | przekładnik różnicowy | uzupełnienie sprzętowego RCD (Moduł 5, Ekran 16) o odczyt cyfrowy |

**Migawka zbiorcza katalogu czujników:** *"Każdy czujnik to dodatkowe 'zmysły' Twojego systemu — dodajesz tyle, ile potrzebujesz, tam gdzie potrzebujesz, a system uczy się o Twojej instalacji więcej z każdym kolejnym."*

---

## KATALOG 2: Aktuatory / wyjścia sterujące (6 pozycji, Wzorzec H)

| Pozycja katalogu | Technologia | Kluczowe dane doboru |
|---|---|---|
| Przekaźniki 230V AC | mechaniczny 10A/250V lub moduł z transoptorem | charakter obciążenia (rezystancyjne/indukcyjne) |
| Obciążenia DC (MOSFET) | np. IRLZ44N (niskie napięcia) lub moduł z driverem | prąd i napięcie obciążenia, rezystancja kanału (straty cieplne) |
| PWM (wentylatory/grzałki/silniki) | sygnał na GPIO, częstotliwość dobrana do odbiornika | 25kHz dla wentylatorów, 1kHz dla grzałek |
| SSR (przekaźnik półprzewodnikowy) | załączanie w zerze napięcia | do obciążeń rezystancyjnych (grzałki, bojler) — cicha praca, mniej zakłóceń |
| Styczniki/rozłączniki | cewka 24V DC lub 230V AC | bezpieczne odłączanie baterii/falownika/dużych odbiorników |
| e-Fuse (zabezpieczenie nadprądowe) | elektroniczny bezpiecznik z pomiarem prądu | próg zadziałania (np. 1,25× prąd znamionowy), czas reakcji |

**Migawka:** *"To są 'ręce' systemu — przez nie ESP32 realnie coś włącza, wyłącza albo reguluje, nie tylko obserwuje."*

---

## KATALOG 3: Protokoły komunikacji (6 pozycji, Wzorzec H)

| Pozycja katalogu | Zastosowanie | Kluczowe dane |
|---|---|---|
| RS485/Modbus RTU | komunikacja z falownikiem i BMS | transceiver MAX485/SP3485, prędkość transmisji, adresy urządzeń |
| CAN BUS | komunikacja z BMS | transceiver SN65HVD230, prędkość 250-500 kbps, kontroler wbudowany (ESP32 S3) lub zewnętrzny (MCP2515) |
| Wi-Fi / Bluetooth | integracja z aplikacją | tryb: WiFi przez router/hotspot do łączności zdalnej, BT do konfiguracji lokalnej |
| LoRa/LoRaWAN | komunikacja dalekiego zasięgu (2-10 km) | moduł SX1276, zastosowanie dla oddalonych budynków/czujników — **tu zaczyna się kierunek na Meshtastic z §15.4** |
| Ethernet (LAN) | połączenie przewodowe, większa niezawodność niż WiFi | moduł W5500, kabel RJ45 |
| MQTT z TLS | bezpieczna transmisja danych do brokera | szyfrowanie TLS, QoS 0/1/2, certyfikaty |

**Migawka:** *"To sposoby, jak ESP32 'rozmawia' ze światem zewnętrznym — od kabla obok (RS485) po kilometry przez radio (LoRa)."*

---

## EKRAN 6: Konfiguracja niezawodności systemu
*(scala dawne: 11.29, 11.30, 11.32, 11.33, 11.34, 11.35, 11.49, 11.50 — Wzorzec D, jeden ekran z przełącznikami funkcji)*

W przeciwieństwie do katalogów powyżej (gdzie dodaje się wiele instancji), to są binarne ustawienia systemowe — włącz/wyłącz, każde ma sens tylko raz.

| Funkcja | Co robi | Kluczowe dane |
|---|---|---|
| Karta SD (dawne 11.29) | lokalne logowanie danych w CSV | interwał zapisu |
| RTC (dawne 11.30) | podtrzymanie czasu bez internetu | moduł DS3231 z baterią podtrzymującą |
| Podtrzymanie zasilania (dawne 11.32) | czas na bezpieczny zapis przy zaniku prądu | superkondensator lub mały akumulator |
| Watchdog (dawne 11.33) | automatyczny reset przy zawieszeniu | wewnętrzny (software) + zewnętrzny (hardware, TPL5010) |
| Izolacja galwaniczna (dawne 11.34) | ochrona ESP32 przed różnicą potencjałów | transoptory dla sygnałów cyfrowych |
| Ochrona przepięciowa linii sygnałowych (dawne 11.35) | ochrona wejść przed przepięciami łączeniowymi | diody TVS lub warystory |
| Aktualizacja OTA (dawne 11.49) | bezprzewodowa aktualizacja firmware | weryfikacja sumy kontrolnej i podpisu cyfrowego przed instalacją |
| Redundancja master/slave (dawne 11.50) | drugi ESP32 przejmuje sterowanie przy awarii głównego | architektura dwóch płytek z synchronizacją |

**D:** *"To nie czujniki ani wyjścia — to 'system odpornościowy' ESP32: żeby nie stracił danych przy zaniku prądu, nie zawiesił się na trwałe, nie oberwał przepięciem, i żeby dało się go bezpiecznie zaktualizować zdalnie."*
🔴 aktualizacja OTA bez weryfikacji podpisu cyfrowego — ryzyko wgrania złośliwego/uszkodzonego firmware.

---

## KATALOG 4: Interfejs lokalny (4 pozycje, Wzorzec H)

| Pozycja katalogu | Opcje | Zastosowanie |
|---|---|---|
| Wyświetlacz | OLED 0.96" (I2C, energooszczędny) lub LCD 16×2 (czytelny, większy pobór) | status systemu: SoC, moc PV, temperatura, alarmy |
| Dioda RGB | kolory: zielony=OK, żółty=uwaga, czerwony=alarm, niebieski=serwis | szybka sygnalizacja stanu bez potrzeby czytania ekranu |
| Przyciski fizyczne | krótkie/długie naciśnięcie = różne funkcje | sterowanie lokalne bez aplikacji (przełączanie widoków, potwierdzenia) |
| Buzzer alarmowy | pasywny, sterowany PWM | sygnały: krótki pik=info, przerywany=ostrzeżenie, ciągły=krytyczny |

**Migawka:** *"To sposób, żeby dowiedzieć się, co się dzieje z systemem, nawet gdy telefon jest w drugim pokoju albo nie ma zasięgu."*

---

## Podsumowanie modułu

**10 ekranów** (5 sekwencyjnych + 3 katalogi + 1 konfiguracja niezawodności + 1 katalog UI lokalnego), pokrywających wszystkie 50 pierwotnych funkcji tego rozdziału. To potwierdza wcześniejszy szacunek strukturalny z §22 Zasad UX.

**Twarde stopy zidentyfikowane w tym module:** podłączenie ESP32 bezpośrednio do napięcia magistrali bez przetwornicy (Ekran 2), bezpośrednie połączenie GPIO 3.3V z magistralą RS485 bez transceivera (Ekran 4), konflikt przypisania pinów GPIO (Ekran 5), aktualizacja OTA bez weryfikacji podpisu cyfrowego (Ekran 6).

**Uwaga integracyjna:** katalog protokołów komunikacji (Katalog 3) to naturalne miejsce na przyszłą integrację Meshtastic/LoRa mesh z §15.4 Zasad UX — pozycja "LoRa/LoRaWAN" już istnieje w tym katalogu i wymaga tylko rozszerzenia o tryb mesh.

---

**Wersja:** 1.0 — pełna treść Modułu 9 (Etap 3)
**Data:** Sierpień 2026
**Status:** Wszystkie 10 ekranów gotowe do przekazania deweloperowi.
**Powiązane dokumenty:** Biblia_Offgrid_v2_0_Architektura_Modulowa.md, Zasady_UX_Doradca_v2_1.md, Tresc_Modul_5_Okablowanie_Ekrany.md, Tresc_Modul_3_PV_Ekrany.md, Tresc_Modul_4_Baterie_Ekrany.md, Tresc_Modul_6_Ogrzewanie_Ekrany.md, Tresc_Modul_7_StressTest_Ekrany.md, Tresc_Modul_8_Bezpieczenstwo_Ekrany.md
