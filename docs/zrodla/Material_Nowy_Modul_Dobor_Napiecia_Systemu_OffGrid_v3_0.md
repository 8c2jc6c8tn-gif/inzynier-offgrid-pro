# Materiał źródłowy — propozycja nowego modułu: Dobór napięcia systemu Off-Grid (v3.0)

**Status:** materiał surowy, zapisany 1:1 od właściciela projektu (13.09.2026), **bez zmian
treści** — zgodnie z zasadą `docs/zrodla/README.md` ("pliki tu trafiają bez zmian treści").
To pierwszy krok trzyetapowego procesu ustalonego z właścicielem: **(1) zapisać jak jest** (ten
plik) → **(2) wnieść poprawki** (kolejna iteracja, do ustalenia) → **(3) zbudować moduł** na
bazie poprawionej wersji.

**Przypisanie do numeru modułu Off-Grid: NIEROZSTRZYGNIĘTE.** Właściciel projektu wprost
zaznaczył, że nie wie, gdzie ten moduł najlepiej pasuje w istniejącej strukturze 13 modułów
(`docs/rejestr-pokrycia.md`, `mapa-wdrozenia.md`). Kandydaci widoczni z samej treści (do
potwierdzenia z właścicielem, nie do rozstrzygnięcia samodzielnie): Moduł 4 (Magazyn energii/
baterie — zawiera już `napiecie-systemowe`, ten materiał go rozszerza/zastępuje?), Moduł 2
(Zapotrzebowanie — Etapy A-B dot. bilansu odbiorników), Moduł 5 (Okablowanie — Etap C dot.
przekrojów/prądów). Możliwe, że to nie jeden moduł, a materiał do rozdzielenia między kilka
istniejących ekranów, albo osobny, nowy 14. moduł. **Nie decydować samodzielnie — czekać na
ustalenie z właścicielem po etapie poprawek.**

---

## Treść dostarczona przez właściciela projektu (13.09.2026), wersja 3.0

MODUŁ APLIKACJI: DOBÓR NAPIĘCIA SYSTEMU OFF-GRID (Wersja 3.0)

### 1. Cel i filozofia modułu (bez zmian)

Moduł ma za zadanie edukować i chronić użytkownika przed pochopnym wyborem napięcia systemu (12 V / 24 V / 48 V). Główny problem: użytkownicy wybierają 12 V, bo „taniej", a dopiero po zakupie okazuje się, że przewody muszą być grubsze niż ich ramię, falownik kosztuje fortunę, a system nie jest w stanie zasilić czajnika.

Kluczowa zasada: Nie wybieramy napięcia na podstawie ceny BMS-a. Wybieramy je na podstawie maksymalnego jednorazowego poboru mocy, dziennego zużycia energii, kontekstu zastosowania oraz możliwości rozbudowy w przyszłości.

---

### 2. Struktura modułu (zaktualizowany przepływ użytkownika)

#### ETAP A: Kontekst zastosowania (bez zmian)

Zanim użytkownik poda jakiekolwiek dane o odbiornikach, moduł musi zapytać o kontekst. Od tego zależy cała dalsza logika.

**A.1. Pytanie startowe:**

„Gdzie będzie używany ten system?"

| Opcja | Opis | Domyślna filozofia |
|---|---|---|
| Nowy budynek (projektowany od zera) | Dom, domek letniskowy, warsztat – instalacja elektryczna jeszcze nie istnieje | Maksymalna zgodność z filozofią Off-Grid: niskie napięcie DC, minimalne straty, dedykowane gniazda DC |
| Budynek z istniejącą instalacją 230 V | Dom już stoi, instalacja 230 V jest | Kompromis: falownik 230 V, ale z możliwością częściowego zasilania DC |
| Kamper / van | Przestrzeń ograniczona, system 12 V lub 24 V | Priorytet: niskie napięcie, małe straty, kompatybilność z urządzeniami 12 V |
| Mała łódź | Małe jednostki, system 12 V | Priorytet: 12 V, standard w małych łodziach, łatwy dostęp do urządzeń |
| Duża łódź / jacht | Duże jednostki, system 24 V | Priorytet: 24 V lub 48 V (bezpieczeństwo, mniejsze prądy, korozja) |
| Budynek Off-Grid (całkowicie poza siecią) | Dom całoroczny, brak przyłącza | Maksymalna zgodność z filozofią Off-Grid: 48 V, dedykowane DC, minimalizacja strat |

**A.2. Pytanie o priorytet:**

„Co jest dla Ciebie ważniejsze?"

- Minimalizacja kosztów początkowych → system może być 12 V (jeśli zapotrzebowanie jest małe)
- Minimalizacja strat energii i grubości przewodów → 48 V
- Kompatybilność z istniejącymi urządzeniami 12 V → 12 V lub 24 V
- Możliwość rozbudowy w przyszłości → 48 V

**A.3. Pytanie o ogrzewanie (NOWY – kluczowy element):**

„Czy w budynku jest ogrzewanie? Jeśli tak, jakie i jakie jest jego zapotrzebowanie na moc?"

| Opcja | Opis | Wpływ na system |
|---|---|---|
| Nie dotyczy | Brak ogrzewania (np. kamper, mała łódź, domek letniskowy używany sezonowo) | Ogrzewanie nie jest wliczane do bilansu energii |
| Ogrzewanie podłogowe elektryczne | Mata grzewcza, kabel grzejny | Bardzo wysokie zapotrzebowanie (100–150 W/m²). Wymaga 48 V. |
| Ogrzewanie powietrzne elektryczne | Promienniki, farelki, klimatyzacja z funkcją grzania | Wysokie zapotrzebowanie (1000–3000 W). Wymaga 48 V. |
| Ogrzewanie wodne (kocioł elektryczny) | Kocioł elektryczny, bojler | Bardzo wysokie zapotrzebowanie (2000–6000 W). Wymaga 48 V. |
| Ogrzewanie gazowe / olejowe / na paliwo stałe | Kocioł gazowy, kominek, piec | Brak obciążenia elektrycznego (poza pompami obiegowymi ~100–200 W) |
| Pompa ciepła (powietrzna) | Klimatyzacja inwertorowa z funkcją grzania | Umiarkowane zapotrzebowanie (500–1500 W). Możliwe na 24 V, zalecane 48 V |

Moduł pyta dodatkowo:

„Ile kW zapotrzebowania na ogrzewanie? (Jeśli nie wiesz, podaj przybliżoną powierzchnię ogrzewaną i typ izolacji)."

Przykład obliczeń:

- Dom 100 m², dobrze izolowany, ogrzewanie podłogowe elektryczne: 100 m² × 80 W/m² = 8000 W zapotrzebowania szczytowego.
- Wniosek: System 12 V jest całkowicie nieodpowiedni (prąd 667 A). System 24 V jest niepraktyczny (prąd 333 A). System 48 V wymaga prądu 167 A – wciąż wysokiego, ale możliwego do obsłużenia przy przewodach 35–50 mm².

---

#### ETAP B: Wprowadzanie danych o odbiornikach

**B.1. Kreator odbiorników (ulepszony)**

Użytkownik zaznacza, co posiada w domu/kamperze/łodzi. Moduł sam dobiera typowe moce i domyślne godziny pracy. Użytkownik może je nadpisać.

Kategorie odbiorników:

| Kategoria | Typowe odbiorniki | Moc [W] | Uwagi |
|---|---|---|---|
| Oświetlenie | LED 230 V (żarówka) | 8–15 W | Wymaga falownika |
|  | LED 12 V (żarówka) | 3–8 W | Zasilane bezpośrednio z DC |
|  | LED 24 V (żarówka) | 5–10 W | Zalecane w systemach DC |
|  | Taśma LED (1 m) | 5–15 W | Dostępna w wersjach 12 V, 24 V, 230 V |
| Chłodzenie | Lodówka 12 V DC | 40–60 W (ciągły) | Kompresor DC, bardzo wydajna |
|  | Lodówka 230 V AC | 80–120 W (cykl) | Wymaga falownika |
|  | Zamrażarka 230 V | 100–150 W | Wymaga falownika |
| Elektronika | Router WiFi | 10–20 W | Można zasilać z dedykowanego gniazda DC |
|  | Telewizor 32" | 50–80 W | Zasilacz często 12 V/19 V DC |
|  | Laptop | 45–90 W | Zasilacz 19 V DC |
|  | Ładowarki USB | 5–20 W | Gniazda USB 5 V DC |
| AGD (wysokie moce) | Czajnik elektryczny | 1500–2200 W | Tylko przez falownik |
|  | Mikrofalówka | 800–1200 W | Tylko przez falownik |
|  | Pralka | 500–2000 W | Tylko przez falownik |
|  | Zmywarka | 1000–2000 W | Tylko przez falownik |
|  | Piekarnik elektryczny | 2000–3500 W | Tylko przez falownik |
|  | Airfryer | 1400–2000 W | Tylko przez falownik |
|  | Grill elektryczny | 2000–3000 W | Tylko przez falownik |
| Ciepła woda | Bojler elektryczny | 1500–3000 W | Tylko przez falownik |
|  | Podgrzewacz przepływowy | 3500–6000 W | Tylko przez falownik, wymaga 48 V |
| Narzędzia | Wiertarka | 500–1000 W | Przez falownik lub DC |
|  | Szlifierka | 800–1200 W | Przez falownik |
|  | Spawarka inwerterowa | 2000–4000 W | Tylko przez falownik, wymaga 48 V |
| Klimatyzacja | Klimatyzacja 230 V | 700–1500 W | Przez falownik |
|  | Klimatyzacja 24 V DC | 400–800 W | Możliwa bez falownika |
| Pompy | Pompa wodna 230 V | 500–1500 W | Przez falownik |
|  | Pompa wodna 24 V DC | 200–500 W | Bez falownika |
| Ogrzewanie | Promiennik elektryczny | 1000–2000 W | Tylko przez falownik, 48 V |
|  | Kocioł elektryczny | 2000–6000 W | Tylko przez falownik, 48 V |
|  | Pompa ciepła | 500–1500 W | Przez falownik |

**B.2. Automatyczna analiza jednoczesności (bez zmian)**

Moduł nie pozwala użytkownikowi samodzielnie sumować mocy. Zamiast tego analizuje, które odbiorniki mogą pracować jednocześnie i ostrzega przed konfliktami.

Przykład analizy:

Użytkownik zaznaczył: Czajnik (2000 W), Piekarnik (3000 W), Airfryer (1800 W), Bojler (2000 W), Oświetlenie (200 W), Lodówka (100 W).

Moduł analizuje:

- Konflikt 1: Czajnik + Piekarnik = 5000 W → Falownik 48 V 5000 W na granicy możliwości, ale praca jednoczesna przez kilka minut jest możliwa.
- Konflikt 2: Czajnik + Airfryer + Bojler = 5800 W → Przekroczenie możliwości większości falowników 48 V. Ryzyko przeciążenia.
- Konflikt 3: Piekarnik + Bojler = 5000 W → Długotrwała obciążenie (piekarnik 1 h, bojler 2 h) – przewody i falownik będą się mocno nagrzewać.

Moduł generuje ostrzeżenie:

„⚠️ Uwaga! Zaznaczyłeś odbiorniki, które w połączeniu pobierają 5800 W. To przekracza możliwości większości falowników 48 V (typowo 4000–5000 W ciągłej mocy). Nie będziesz mógł jednocześnie korzystać z czajnika, airfryera i bojlera. Aby to było możliwe, potrzebujesz falownika 8 kW lub rozłożenia obciążenia w czasie."

**B.3. Analiza długotrwałego obciążenia (bez zmian)**

Moduł identyfikuje odbiorniki, które pracują długotrwale (powyżej 30 minut) i ostrzega przed nagrzewaniem przewodów oraz koniecznością stosowania grubszych kabli.

| Odbiornik | Czas pracy | Wpływ na system |
|---|---|---|
| Bojler elektryczny | 1–3 h | Ciągłe obciążenie 1500–3000 W → przewody muszą być dobrane na prąd ciągły, nie chwilowy |
| Piekarnik | 0,5–1,5 h | Ciągłe obciążenie 2000–3500 W → wymaga 48 V |
| Grill elektryczny | 0,5–2 h | Ciągłe obciążenie 2000–3000 W → wymaga 48 V |
| Klimatyzacja | 4–12 h | Ciągłe obciążenie 700–1500 W → może pracować na 24 V, ale 48 V jest bezpieczniejsze |
| Pralka (grzanie wody) | 0,5–1 h | Chwilowe obciążenie 2000 W → wymaga falownika o odpowiedniej mocy szczytowej |
| Ogrzewanie podłogowe | 2–12 h | Ciągłe obciążenie 1000–8000 W → tylko 48 V |
| Kocioł elektryczny | 2–6 h | Ciągłe obciążenie 2000–6000 W → tylko 48 V |

Moduł ostrzega:

„⚠️ Bojler elektryczny pracuje długotrwale (1–3 h). Przy mocy 2000 W i napięciu 12 V prąd wynosi 167 A. Przewody o przekroju 16 mm² będą się nagrzewać do temperatury, która może uszkodzić izolację. System 12 V jest nieodpowiedni dla bojlera elektrycznego. Zalecany system 48 V (prąd 42 A, przewody 6–10 mm²)."

---

#### ETAP C: Analiza wymaganego napięcia systemu (zaktualizowana)

**C.1. Progi decyzyjne – z uwzględnieniem kontekstu**

| Kryterium | 12 V | 24 V | 48 V |
|---|---|---|---|
| Dzienne zużycie energii | < 1 000 Wh | 1 000–3 000 Wh | > 3 000 Wh |
| Maks. moc ciągła falownika | ≤ 1 500 W | 1 500–3 000 W | > 3 000 W |
| Maks. szczytowa moc | ≤ 2 500 W | 2 500–5 000 W | > 5 000 W |
| Maks. prąd przy szczytowej mocy | do 208 A | do 208 A | do 104 A |
| Kontekst: kamper | ✅ Zalecany | ⚠️ Możliwy (przy większych potrzebach) | ❌ Rzadko stosowany |
| Kontekst: mała łódź | ✅ Zalecany | ⚠️ Możliwy | ❌ Niezalecany |
| Kontekst: duża łódź | ⚠️ Możliwy | ✅ Zalecany | ⚠️ Możliwy |
| Kontekst: dom Off-Grid | ❌ Niezalecany | ⚠️ Tylko małe domki | ✅ Zalecany |
| Kontekst: nowy budynek | ❌ Niezalecany | ✅ Dobry kompromis | ✅ Najlepszy |
| Ogrzewanie elektryczne | ❌ Niezalecany | ❌ Niezalecany | ✅ Zalecany |

**C.2. Analiza prądu i nagrzewania przewodów (bez zmian)**

Moduł oblicza nie tylko przekrój przewodu, ale także przewidywany wzrost temperatury w zależności od długotrwałego obciążenia.

Wzór na moc wydzielaną w przewodzie:

```
P_strat = I² × R
```

gdzie:

- I = prąd [A]
- R = rezystancja przewodu [Ω] = (ρ × 2 × L) / A
- ρ = 0,0172 Ω·mm²/m (rezystywność miedzi)
- L = długość przewodu w jedną stronę [m]
- A = przekrój przewodu [mm²]

Przykład dla 2000 W, 3 m przewodu:

| Napięcie | Prąd | Przekrój | Rezystancja | Straty mocy | Wzrost temperatury (orientacyjny) |
|---|---|---|---|---|---|
| 12 V | 167 A | 16 mm² | 0,0065 Ω | 181 W | Bardzo wysoki (ryzyko przegrzania) |
| 24 V | 83 A | 10 mm² | 0,0103 Ω | 71 W | Wysoki |
| 48 V | 42 A | 6 mm² | 0,0172 Ω | 30 W | Umiarkowany |

Wniosek modułu:

„System 12 V przy 2000 W generuje w przewodach straty mocy rzędu 181 W. To oznacza, że przewody będą się bardzo mocno nagrzewać. System 12 V jest niebezpieczny dla ciągłego obciążenia 2000 W. System 48 V generuje tylko 30 W strat – przewody pozostają chłodne."

**C.3. Bezpieczeństwo prądu 100 A przy 12 V (bez zmian)**

Moduł musi uświadamiać użytkownikom, że 100 A przy 12 V to ekstremalnie wysokie prądy, które stwarzają realne zagrożenie.

„⚠️ Ostrzeżenie: Prąd 100 A przy 12 V to prąd spawalniczy. Przewody o przekroju 25 mm² (standard dla 100 A) nagrzewają się do temperatury 70–90°C przy długotrwałym obciążeniu. Każde poluzowane złącze, każde stykowe połączenie, każdy bezpiecznik – to potencjalne miejsce przegrzania i pożaru. Systemy 12 V o prądach powyżej 100 A są niebezpieczne i niezalecane."

Dlaczego 100 A przy 12 V jest niebezpieczne:

1. Prąd spawalniczy: 100 A to prąd, przy którym spawarki pracują. Każde zwarcie w instalacji 12 V o takim prądzie może spowodować łuk elektryczny i pożar.
2. Nagrzewanie złączek: Każde połączenie (śruba, złączka oczkowa, bezpiecznik) ma rezystancję stykową. Przy 100 A nawet 0,01 Ω daje 100 W strat mocy w jednym punkcie – to wystarczy do stopienia izolacji.
3. Spadki napięcia: Przy 100 A i przewodzie 25 mm² o długości 3 m spadek napięcia wynosi ~1,2 V (10% napięcia systemu!). Falownik może się wyłączać z powodu zbyt niskiego napięcia wejściowego.
4. Ryzyko pożaru: Wibracje (kamper, łódź) powodują luzowanie się połączeń. Poluzowane złącze przy 100 A to hotspot o temperaturze kilkuset stopni.

Porównanie z 48 V:

- 100 A przy 48 V = 4800 W mocy. Ten sam prąd, ale 4× więcej mocy przy tych samych stratach cieplnych.
- 100 A przy 12 V = 1200 W mocy. Aby uzyskać 4800 W, potrzebujesz 400 A – to absurdalne i skrajnie niebezpieczne.

---

#### ETAP D: Rekomendacja oświetlenia i odbiorników DC (ROZBUDOWANY)

**D.1. Oświetlenie LED: 24 V vs 230 V vs 48 V**

Moduł rekomenduje oświetlenie 24 V w systemach Off-Grid, nawet jeśli użytkownik rozważa 230 V.

| Cecha | LED 230 V | LED 24 V | LED 48 V |
|---|---|---|---|
| Pobór mocy | 8–15 W | 5–10 W | 5–10 W |
| Grzejność | Wyższa (zasilacz w każdej żarówce) | Niższa (brak przetwornicy) | Niższa (brak przetwornicy) |
| Żywotność | Krótsza (ciepło skraca życie LED) | Dłuższa (mniejsze ciepło) | Dłuższa (mniejsze ciepło) |
| Jakość światła | Dobra | Lepsza (2× jaśniejsza przy tym samym poborze) | Lepsza |
| Kompatybilność z Off-Grid | Wymaga falownika 230 V | Bezpośrednie zasilanie z DC | Bezpośrednie zasilanie z DC |
| Straty | Przetwornica 230 V→DC w każdej żarówce | Brak przetwornicy | Brak przetwornicy |
| Koszt | Niższy początkowy | Wyższy początkowy (ale niższy eksploatacyjny) | Wyższy początkowy |
| Dostępność | Powszechna | Dobra | Ograniczona |
| Koszt przetwornicy DC-DC | – | – | 48V→24V: ~350–400 zł/szt. |

Kluczowy problem z oświetleniem 48 V:

„⚠️ Uwaga! W systemie 48 V oświetlenie 24 V nie może być zasilane bezpośrednio. Potrzebujesz przetwornicy DC-DC 48V→24V. Koszt takiej przetwornicy to ~350–400 zł za sztukę (480 W, 20 A). Jeśli masz wiele oddzielnych linii oświetleniowych, potrzebujesz wielu przetwornic – to generuje dodatkowe koszty i straty."

Przykład:

- Dom z 3 liniami oświetleniowymi (parter, piętro, zewnętrzne).
- Każda linia wymaga oddzielnej przetwornicy 48V→24V.
- Koszt: 3 × 400 zł = 1200 zł tylko na przetwornice.
- Straty: każda przetwornica ma sprawność ~93%, więc tracisz 7% energii na każdej linii.

Zalecenie modułu:

„W systemie Off-Grid zawsze wybieraj oświetlenie 24 V. LEDy 24 V mniej się grzeją, dwa razy lepiej świecą przy tym samym poborze prądu i nie wymagają falownika. W systemie 48 V rozważ oświetlenie 48 V (jeśli dostępne) lub zaakceptuj koszt przetwornic DC-DC."

**D.2. Dedykowane gniazda DC dla elektroniki (bez zmian)**

Moduł proponuje, aby w nowym budynku lub kamperze nie zasilać elektroniki przez falownik 230 V, ale przez dedykowane gniazda DC z wyregulowanym napięciem.

| Urządzenie | Napięcie zasilania | Zalecane rozwiązanie |
|---|---|---|
| Router WiFi | 12 V DC | Gniazdo DC 12 V (bezpośrednio z pakietu) |
| Telewizor | 19 V DC | Przetwornica DC-DC 24 V→19 V |
| Laptop | 19 V DC | Przetwornica DC-DC 24 V→19 V |
| Telefon/tablet | 5 V DC (USB) | Gniazdo USB 5 V z przetwornicą DC-DC |
| Radio | 12 V DC | Gniazdo DC 12 V |

Zaleta: Unikasz podwójnej konwersji (DC → AC → DC), która generuje straty rzędu 15–25%.

---

#### ETAP E: Porównanie kosztów (ROZBUDOWANE – z uwzględnieniem EVE 314Ah i VEVOR)

**E.1. Założenia kalkulacyjne**

- Ogniwa: EVE MB31 3,2 V 314 Ah, cena: 75,50 USD/szt. (przy zakupie 4–15 szt.)
- Przelicznik: 1 USD ≈ 4,00 PLN (orientacyjnie)
- BMS: Daly 4S/8S/16S 200A (ceny orientacyjne)
- Falowniki VEVOR:
  - 12 V 1500 W: 700 zł
  - 24 V 3000 W: 1100 zł
  - 48 V 5000 VA / 4000 W: 1500 zł
- MPPT: Wbudowany w falowniki VEVOR (bez dodatkowego kosztu)

**E.2. Tabela porównawcza kosztów – dla tego samego zapotrzebowania**

Załóżmy dzienne zużycie 3000 Wh i szczytową moc 3000 W.

| Komponent | 12 V | 24 V | 48 V |
|---|---|---|---|
| Ogniwa | 4 × EVE 314Ah | 8 × EVE 314Ah | 16 × EVE 314Ah |
| Koszt ogniw (75,50 USD/szt.) | 4 × 302 zł = 1208 zł | 8 × 302 zł = 2416 zł | 16 × 302 zł = 4832 zł |
| BMS | 4S 200A (~150 zł) | 8S 200A (~250 zł) | 16S 200A (~600 zł) |
| Falownik VEVOR | 12 V 1500W (~700 zł) | 24 V 3000W (~1100 zł) | 48 V 5000VA/4000W (~1500 zł) |
| Przekrój przewodów | 25–35 mm² | 16–25 mm² | 6–10 mm² |
| Koszt przewodów (5 m) | ~400–600 zł | ~250–400 zł | ~100–200 zł |
| Bezpieczniki | 300 A (~150 zł) | 150 A (~100 zł) | 80 A (~80 zł) |
| Przetwornice DC-DC (48V→24V) | – | – | ~400 zł (jeśli oświetlenie 24 V) |
| RAZEM (orientacyjnie) | ~2600–2800 zł | ~4100–4500 zł | ~7500–8100 zł |

**E.3. Analiza porównawcza – kluczowe wnioski**

„Uwaga! System 48 V z 16 ogniwami EVE 314Ah jest znacznie droższy od systemu 12 V z 4 ogniwami. Różnica wynika z faktu, że system 48 V wymaga 4× więcej ogniw dla tej samej pojemności energetycznej."

Ale:

„System 12 V z 4 ogniwami EVE 314Ah ma pojemność 4 × 3,2 V × 314 Ah = 4019 Wh = ~4 kWh. System 48 V z 16 ogniwami ma pojemność 16 × 3,2 V × 314 Ah = 16 076 Wh = ~16 kWh. To nie są systemy o tej samej pojemności!"

Poprawne porównanie – ta sama pojemność energetyczna (16 kWh):

| Parametr | 12 V | 24 V | 48 V |
|---|---|---|---|
| Liczba ogniw EVE 314Ah | 4 | 8 | 16 |
| Pojemność energetyczna | 4 kWh | 8 kWh | 16 kWh |
| Aby uzyskać 16 kWh | 16 ogniw (4 równolegle × 4S) | 16 ogniw (2 równolegle × 8S) | 16 ogniw (16S) |
| Koszt ogniw (16 szt.) | 4832 zł | 4832 zł | 4832 zł |
| BMS | 4S 200A (~150 zł) | 8S 200A (~250 zł) | 16S 200A (~600 zł) |
| Falownik | 12 V 1500W (~700 zł) | 24 V 3000W (~1100 zł) | 48 V 5000VA/4000W (~1500 zł) |
| Przewody | 25–35 mm² (~500 zł) | 16–25 mm² (~300 zł) | 6–10 mm² (~150 zł) |
| Bezpieczniki | 300 A (~150 zł) | 150 A (~100 zł) | 80 A (~80 zł) |
| RAZEM | ~6332 zł | ~6582 zł | ~7162 zł |

Wniosek:

„Przy tej samej pojemności energetycznej (16 kWh) system 12 V jest najtańszy (~6332 zł), ale ma największe ograniczenia (max moc 1500 W, prądy do 300 A, grube przewody). System 48 V jest droższy o ~830 zł, ale oferuje 4× większą moc (4000 W vs 1500 W), znacznie mniejsze prądy i możliwość rozbudowy. Różnica w cenie jest niewielka w porównaniu z różnicą w możliwościach."

**E.4. Ukryte koszty 12 V – rozbudowane**

1. Koszt miedzi: Przy 12 V zużyjesz nawet 6× więcej miedzi niż przy 48 V dla tej samej mocy.
2. Grubość przewodów: Przewód 35 mm² jest trudny do ułożenia w ciasnych przestrzeniach, wymaga specjalnych złączek i większych promieni gięcia.
3. Ograniczenia falownika: Falowniki 12 V o mocach >1500 W są rzadkie i drogie. VEVOR oferuje 12 V tylko do 1500 W.
4. Straty cieplne: Wysokie prądy = wysokie straty I²R = ciepło = szybsze starzenie się izolacji i złączek.
5. Skalowalność: Rozbudowa systemu 12 V o kolejne 1000 W często wymaga wymiany całego okablowania i BMS-a.
6. Koszt bezpieczeństwa: Bezpieczniki DC 300 A są droższe niż 80 A. Przekaźniki i styczniki dla wysokich prądów są droższe i bardziej awaryjne.
7. Koszt przetwornic DC-DC (48V→24V): W systemie 48 V z oświetleniem 24 V dochodzi koszt ~400 zł za każdą linię.

---

#### ETAP F: Równoległe łączenie pakietów akumulatorów (bez zmian)

**F.1. Problem: Nierównomierny rozpływ prądu**

Podczas gdy równoległe łączenie akumulatorów LiFePO4 wydaje się proste (połączyć wszystkie plusy i minusy), w praktyce prąd nie rozkłada się równomiernie.

Przykład:

- 4 akumulatory 51,2 V 100 Ah połączone równolegle.
- Falownik pobiera 160 A.
- Oczekiwanie: każdy akumulator daje 40 A.
- Rzeczywistość: Akumulator 1: 47 A, Akumulator 2: 43 A, Akumulator 3: 38 A, Akumulator 4: 32 A.

Przyczyna: Różnice w rezystancji kabli, złączek, bezpieczników i szyn zbiorczych. Prąd zawsze płynie ścieżką o najmniejszym oporze.

**F.2. Skutki nierównomiernego rozpływu:**

- Akumulator najbliżej falownika (z najkrótszymi kablami) pracuje najciężej – nagrzewa się szybciej, osiąga limit BMS szybciej, starzeje się szybciej.
- Akumulator najdalej – niedoładowany, niedociążony, ma inne SOC.
- Cały bank – zmniejszona pojemność użytkowa, przedwczesne zużycie.

**F.3. Rozwiązania:**

1. Szyna zbiorcza (busbar): Każdy akumulator podłączony osobno do wspólnej szyny dodatniej i ujemnej. To najlepsza metoda dla 3+ akumulatorów.
2. Identyczne kable: Wszystkie odgałęzienia muszą mieć taką samą długość, przekrój, typ kabla, typ złączek i metodę zaciskania.
3. Unikanie połączenia „łańcuszkowego" (daisy-chain): Podłączanie falownika do pierwszego akumulatora w łańcuchu jest najgorszym rozwiązaniem – powoduje największe nierównomierności.
4. Połączenie diagonalne: Dla 2–3 akumulatorów – plus do jednego końca, minus do drugiego. Lepsze niż łańcuszek, ale gorsze niż busbar.

**F.4. Ładowanie wielu pakietów przez jeden falownik**

Pytanie: Czy jeden falownik poprawnie naładuje 3 zestawy akumulatorów przez szynę zbiorczą?

Odpowiedź: Tak, ale tylko jeśli system jest w pełni zsynchronizowany.

Warunki poprawnego ładowania:

- Wszystkie pakiety muszą mieć ten sam typ ogniw, tę samą pojemność i ten sam BMS.
- Wszystkie pakiety muszą być podłączone do wspólnej szyny zbiorczej z identycznymi kablami.
- Falownik musi mieć wystarczający prąd ładowania, aby naładować wszystkie pakiety jednocześnie.
- BMS muszą się komunikować – w konfiguracji równoległej jeden BMS pełni rolę master, pozostałe slave.

Problemy przy braku synchronizacji:

- Przepływ wyrównawczy: Jeśli pakiety mają różne napięcia, wyższy pakiet będzie ładował niższy – to generuje straty i ciepło.
- Przeciążenie jednego pakietu: Jeśli jeden pakiet ma niższą rezystancję, przyjmie więcej prądu ładowania.
- Błędy BMS: BMS może zgłaszać fałszywe alarmy, jeśli nie widzi pełnego obrazu.

Zalecenie modułu:

„Dla 3 pakietów akumulatorów zalecamy szynę zbiorczą z identycznymi kablami. Upewnij się, że wszystkie pakiety mają ten sam typ ogniw i pojemność. Jeśli to możliwe, wybierz BMS, które komunikują się ze sobą (master-slave). Nie łącz pakietów o różnych pojemnościach ani różnych typach BMS."

**F.5. Alternatywa: Wiele falowników**

Zamiast jednego falownika i wielu pakietów, można zastosować wiele falowników, każdy z własnym pakietem.

| Kryterium | Jeden falownik + szyna | Wiele falowników |
|---|---|---|
| Koszt | Niższy | Wyższy |
| Złożoność | Średnia | Wysoka |
| Niezawodność | Awaria falownika = brak zasilania | Awaria jednego = reszta działa |
| Skalowalność | Łatwa | Trudna (synchronizacja faz) |
| Zalecenie | Domyślne dla domów | Dla systemów o wysokiej niezawodności |

---

#### ETAP G: Panele fotowoltaiczne – dobór do falownika (ROZBUDOWANY)

**G.1. Specyfikacja paneli JA Solar 500W JAM60D41-500/LB Full Black Bifacial**

| Parametr | Wartość |
|---|---|
| Moc STC | 500 Wp |
| Sprawność | 22,6% |
| Wymiary | 1953 × 1134 × 30 mm |
| Waga | 27,3 kg |
| Typ ogniw | N-type, monokrystaliczne, bifacjalne |
| Liczba ogniw | 120 |
| Złącza | MC4-EVO2 |
| Długość kabla | 1200 mm |

**G.2. Dobór paneli do falowników VEVOR – 3 modele**

**Model 1: VEVOR 12 V 1500 W (falownik bez MPPT)**

Uwaga: Ten falownik nie posiada wbudowanego MPPT. Do ładowania akumulatorów potrzebujesz oddzielnego regulatora MPPT.

| Parametr | Wartość |
|---|---|
| Moc ciągła | 1500 W |
| Moc szczytowa | 3000 W |
| Napięcie DC | 12 V |
| MPPT | ❌ Brak (wymagany zewnętrzny) |
| Maks. napięcie PV | – |

Zalecany regulator MPPT dla 12 V:

- MPPT 40–60 A, maks. napięcie PV: 100–150 V.
- Koszt: ~400–500 zł.

Maks. liczba paneli JA Solar 500W:

- Maks. liczba paneli w szeregu: 2 panele (Voc ~50 V × 2 = 100 V, poniżej 150 V).
- Maks. liczba stringów równolegle: 2–3 stringi (zależnie od prądu MPPT).
- Maks. łączna moc PV: ~2000–3000 W (ograniczenie przez prąd MPPT).

**Model 2: VEVOR 24 V 3000 W Hybrid (z MPPT 80 A)**

| Parametr | Wartość |
|---|---|
| Moc ciągła | 3000 W |
| Moc szczytowa | 6000 W |
| Napięcie DC | 24 V |
| MPPT | ✅ Wbudowany, 80 A |
| Maks. moc PV | 4000 W |
| Zakres napięcia MPPT | 60–500 V DC |

Maks. liczba paneli JA Solar 500W:

- Maks. liczba paneli w szeregu: 500 V / 50 V = 10 paneli (z marginesem na zimno: 8–9 paneli).
- Maks. liczba stringów równolegle: 1 string (przy 8–9 panelach w szeregu).
- Maks. łączna moc PV: 4000 W = 8 paneli × 500 W.
- Zalecana konfiguracja: 8 paneli połączonych szeregowo (Voc ~400 V, poniżej 500 V).

**Model 3: VEVOR 48 V 5000 VA / 4000 W (MPS-5K, z MPPT 60–87 A)**

| Parametr | Wartość |
|---|---|
| Moc ciągła | 4000 W |
| Moc szczytowa | 5000 VA |
| Napięcie DC | 48 V |
| MPPT | ✅ Wbudowany, 60–87 A |
| Maks. napięcie PV | 145 V DC |
| Zakres napięcia MPPT | 60–145 V DC |

Maks. liczba paneli JA Solar 500W:

- Maks. liczba paneli w szeregu: 145 V / 50 V = 2 panele (z marginesem na zimno: 2 panele).
- Maks. liczba stringów równolegle: 3–4 stringi (zależnie od prądu MPPT).
- Maks. łączna moc PV: 2 panele/string × 4 stringi = 8 paneli × 500 W = 4000 W.
- Zalecana konfiguracja: 2 panele w szeregu × 4 stringi równolegle (Voc ~100 V, poniżej 145 V).

**G.3. Tabela zbiorcza – dobór paneli do falowników VEVOR**

| Falownik | MPPT | Maks. napięcie PV | Maks. liczba paneli (szeregowo) | Maks. liczba stringów | Maks. łączna moc PV |
|---|---|---|---|---|---|
| VEVOR 12 V 1500 W | ❌ Brak (zewnętrzny) | 150 V (zewnętrzny) | 2 | 2–3 | ~2000–3000 W |
| VEVOR 24 V 3000 W | ✅ 80 A | 500 V | 8–9 | 1 | 4000 W (8 paneli) |
| VEVOR 48 V 5000 VA | ✅ 60–87 A | 145 V | 2 | 3–4 | 4000 W (8 paneli) |

---

#### ETAP H: Problem konwersji 24 V → 48 V (NOWY – kluczowy element)

**H.1. Dlaczego nie można „po prostu" połączyć dwóch pakietów 24 V w jeden 48 V?**

Wielu użytkowników zakłada, że mogą kupić dwa akumulatory 24 V LiFePO4, połączyć je szeregowo i uzyskać system 48 V. To jest błędne i niebezpieczne.

Dlaczego:

1. Rozjazd ogniw: Każdy pakiet 24 V ma własny BMS, który balansuje ogniwa wewnątrz pakietu. Po połączeniu szeregowym dwóch pakietów, BMSy nie komunikują się ze sobą. Pakiet A może mieć ogniwa na 3,40 V, a pakiet B na 3,20 V. Po połączeniu szeregowym różnica napięć między pakietami wynosi 0,2 V × 8 ogniw = 1,6 V. To powoduje przepływ wyrównawczy i nierównomierne obciążenie.
2. Różnice rezystancji: Nawet jeśli pakiety są nowe i z tej samej partii, ich rezystancja wewnętrzna może się różnić o 5–10%. Po połączeniu szeregowym, pakiet o niższej rezystancji będzie pracował ciężej, nagrzewał się bardziej i starzał się szybciej.
3. BMS nie jest przystosowany do pracy szeregowej: BMS 8S (24 V) nie jest zaprojektowany do pracy w konfiguracji 16S. Nie ma funkcji komunikacji z drugim BMS, nie ma wspólnego balansowania.
4. Ryzyko uszkodzenia: W skrajnych przypadkach różnica napięć między pakietami może przekroczyć napięcie przebicia MOSFET-ów w BMS, co prowadzi do ich uszkodzenia.

**H.2. Co się stanie, jeśli połączysz dwa pakiety 24 V szeregowo?**

- Krótkoterminowo: System będzie działał. Falownik 48 V zobaczy 48 V (dwa pakiety 24 V połączone szeregowo).
- Średnioterminowo: Pakiety zaczną się rozjeżdżać. Jeden pakiet będzie się ładował do 100%, drugi tylko do 80%. BMSy będą się wyłączać w różnym czasie.
- Długoterminowo: Jeden pakiet ulegnie przedwczesnemu zużyciu. Może dojść do uszkodzenia BMS lub ogniw.

**H.3. Prawidłowe rozwiązanie – budowa pakietu 48 V od podstaw**

„Nie łącz dwóch pakietów 24 V w system 48 V. Zamiast tego zbuduj pakiet 48 V od podstaw z 16 ogniw EVE 314Ah połączonych szeregowo (16S) i jednego BMS 16S."

Zalety:

- Jeden BMS balansuje wszystkie 16 ogniw.
- Brak problemów z rozjazdem między pakietami.
- Pełna kontrola nad każdym ogniwem.
- Możliwość rozbudowy o kolejne pakiety 48 V równolegle.

**H.4. Koszt „przejścia" z 24 V na 48 V**

Jeśli masz już system 24 V i chcesz przejść na 48 V, nie możesz użyć ponownie:

- BMS 8S (24 V) – musisz kupić BMS 16S.
- Falownika 24 V – musisz kupić falownik 48 V.
- Przewodów – musisz wymienić na cieńsze (choć to akurat zaleta).
- Ogniwa – możesz użyć ponownie, ale musisz je rozbalansować i połączyć w nową konfigurację 16S.

Koszt przejścia:

- BMS 16S: ~600 zł
- Falownik 48 V: ~1500 zł
- Przewody: ~150 zł
- RAZEM: ~2250 zł (plus robocizna)

Wniosek:

„Decyzja o napięciu systemu jest decyzją długoterminową. Jeśli planujesz rozbudowę w przyszłości, od razu wybierz 48 V. Przejście z 24 V na 48 V jest kosztowne i wymaga wymiany większości komponentów."

---

#### ETAP I: Rekomendacja końcowa (zaktualizowana)

Moduł generuje jednoznaczną rekomendację na podstawie kontekstu, zapotrzebowania i priorytetów.

**Przykład dla domu Off-Grid, 5000 Wh/dzień, 4000 W szczytowo, z ogrzewaniem elektrycznym:**

Rekomendacja: System 48 V

Uzasadnienie:

- Przy 4000 W szczytowo, prąd w systemie 12 V wyniósłby 333 A – to skrajnie niebezpieczne (prąd spawalniczy).
- System 48 V ogranicza prąd do 83 A – wciąż wysokiego, ale bezpiecznego przy przewodach 10–16 mm².
- Ogrzewanie elektryczne (nawet 2000 W) wymaga 48 V – system 24 V byłby na granicy możliwości.
- Oszczędność na przewodach: ~400 zł.
- Możliwość zasilania piekarnika, bojlera i klimatyzacji bez przeciążenia.

Rekomendowane komponenty:

- Falownik: VEVOR 48 V 5000 VA / 4000 W (MPS-5K) – ~1500 zł
- BMS: Daly 16S 200A (~600 zł) lub JK BMS 16S 200A (z aktywnym balansowaniem)
- Akumulatory: 16S LiFePO4 (EVE MB31 314Ah) – ~4832 zł
- Przewody: 6–10 mm²
- Panele PV: 8 × JA Solar 500W (2 w szeregu × 4 stringi) – ~4000 W
- Przetwornice DC-DC 48V→24V: ~400 zł/linia (dla oświetlenia 24 V)

**Przykład dla kampera, 1500 Wh/dzień, 2000 W szczytowo:**

Rekomendacja: System 24 V

Uzasadnienie:

- Kamper ma ograniczoną przestrzeń – 24 V pozwala na cieńsze przewody niż 12 V.
- Przy 2000 W prąd w 24 V to 83 A – akceptowalne przy przewodach 10 mm².
- Większość urządzeń 12 V (lodówka, oświetlenie) można zasilać przez przetwornicę DC-DC 24 V→12 V.
- System 48 V w kamperze jest rzadko stosowany (mało urządzeń 48 V, wyższy koszt BMS).

Rekomendowane komponenty:

- Falownik: VEVOR 24 V 3000 W Hybrid (z MPPT 80A) – ~1100 zł
- BMS: Daly 8S 200A (~250 zł)
- Akumulatory: 8S LiFePO4 (EVE MB31 314Ah) – ~2416 zł
- Przewody: 10–16 mm²
- Panele PV: 8 × JA Solar 500W (szeregowo) – ~4000 W

**Przykład dla małej łodzi, 500 Wh/dzień, 800 W szczytowo:**

Rekomendacja: System 12 V

Uzasadnienie:

- Mała łódź ma standardowe wyposażenie 12 V (światła nawigacyjne, radio, pompy).
- Przy 800 W prąd w 12 V to 67 A – akceptowalne przy przewodach 16 mm².
- System 24 V wymagałby przetwornic dla urządzeń 12 V – dodatkowy koszt i straty.
- System 48 V jest całkowicie niepraktyczny dla małej łodzi.

Rekomendowane komponenty:

- Falownik: VEVOR 12 V 1500 W – ~700 zł
- BMS: Daly 4S 200A (~150 zł)
- Akumulatory: 4S LiFePO4 (EVE MB31 314Ah) – ~1208 zł
- Przewody: 16–25 mm²
- Panele PV: 2–4 × JA Solar 500W (z zewnętrznym MPPT) – ~1000–2000 W

**Przykład dla dużej łodzi, 2000 Wh/dzień, 3000 W szczytowo:**

Rekomendacja: System 24 V

Uzasadnienie:

- Duża łódź ma więcej odbiorników (klimatyzacja, kuchnia, elektronika).
- Przy 3000 W prąd w 24 V to 125 A – akceptowalne przy przewodach 16–25 mm².
- System 48 V jest możliwy, ale wymaga przetwornic dla urządzeń 24 V.
- System 12 V byłby na granicy możliwości (250 A).

Rekomendowane komponenty:

- Falownik: VEVOR 24 V 3000 W Hybrid (z MPPT 80A) – ~1100 zł
- BMS: Daly 8S 200A (~250 zł)
- Akumulatory: 8S LiFePO4 (EVE MB31 314Ah) – ~2416 zł
- Przewody: 16–25 mm²
- Panele PV: 8 × JA Solar 500W – ~4000 W

---

### 3. Tabela decyzyjna – skrót dla użytkownika (zaktualizowana)

| Kontekst | Zapotrzebowanie | Rekomendowane napięcie | Dlaczego |
|---|---|---|---|
| Mała łódź | < 1000 Wh/dzień, < 1500 W | 12 V | Standard, najwięcej urządzeń 12 V |
| Duża łódź | 1000–3000 Wh/dzień, 1500–3000 W | 24 V | Kompromis: cieńsze przewody, dostępność urządzeń |
| Kamper | < 1000 Wh/dzień, < 1500 W | 12 V | Standard, najwięcej urządzeń 12 V |
| Kamper | 1000–3000 Wh/dzień, 1500–3000 W | 24 V | Kompromis: cieńsze przewody, dostępność urządzeń |
| Domek letniskowy | 1000–3000 Wh/dzień | 24 V | Dobry kompromis |
| Dom Off-Grid (całoroczny) | > 3000 Wh/dzień, > 3000 W | 48 V | Najniższe straty, najcieńsze przewody, skalowalność |
| Nowy budynek (projektowany) | Dowolne | 48 V (dla domu) / 24 V (dla małego domu) | Filozofia Off-Grid: DC, minimalizacja strat |
| Budynek z instalacją 230 V | Dowolne | 48 V | Falownik 230 V, ale z możliwością częściowego DC |
| Ogrzewanie elektryczne | Dowolne | 48 V | Tylko 48 V obsłuży wysokie moce bez absurdalnie grubych przewodów |

---

### 4. Podsumowanie – co dodać do aplikacji (zaktualizowane)

1. Kalkulator kontekstu – pytanie o typ zastosowania (dom, kamper, mała łódź, duża łódź, nowy budynek).
2. Kreator odbiorników – z automatyczną analizą jednoczesności i długotrwałego obciążenia.
3. Pytanie o ogrzewanie – typ, zapotrzebowanie na moc, opcja „nie dotyczy".
4. Analiza bezpieczeństwa prądowego – ostrzeżenia o wysokich prądach przy 12 V.
5. Trzy kosztorysy równoległe – 12 V, 24 V, 48 V z rozbiciem na komponenty (EVE 314Ah, VEVOR).
6. Kalkulator przekroju przewodów – z analizą nagrzewania i strat mocy.
7. Rekomendacja oświetlenia – 24 V vs 230 V vs 48 V, z uwzględnieniem kosztu przetwornic DC-DC.
8. Dedykowane gniazda DC – dla routera, TV, laptopa.
9. Analiza równoległego łączenia pakietów – szyna zbiorcza, równomierny rozpływ, ładowanie przez jeden falownik.
10. Dobór paneli PV – dla 3 modeli falowników VEVOR (12 V, 24 V, 48 V) z panelami JA Solar 500W.
11. Problem konwersji 24 V → 48 V – dlaczego nie można łączyć dwóch pakietów 24 V szeregowo, koszt przejścia.
12. Sekcja ostrzeżeń i mitów – edukacja użytkownika.
13. Możliwość wpisania własnych cen – użytkownik może dostosować kosztorys.
14. Eksport do PDF – podsumowanie rekomendacji.
