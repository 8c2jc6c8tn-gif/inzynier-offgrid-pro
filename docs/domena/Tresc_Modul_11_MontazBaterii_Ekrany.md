# Moduł 11 (Kafel 11): Montaż baterii — treść ekranów

**Etap 3 — kontynuacja.** Dziewiąty w pełni opisany moduł treściowy. Dwie ścieżki chemii (LiFePO4, kwasowo-ołowiowa) ze wspólnym szkieletem UI, ale różną treścią. Zgodnie z audytem §24 Zasad UX — w większości Wzorzec E (checklist), z kilkoma realnymi Doradcami (D) tam, gdzie chodzi o dobór lub decyzję z werdyktem, nie tylko sekwencję kroków.

**Ekran startowy (wspólny dla obu ścieżek):** *"Jaką masz baterię?"* → LiFePO4 / Kwasowo-ołowiowa (AGM/Żel/Kwasowy/Trakcyjny) → reszta kroków identyczna w układzie, różna w treści.

---

## ŚCIEŻKA A: LiFePO4

### EKRAN A1: Weryfikacja kompletności + kontrola wstępna ogniw
*(scala dawne: 9.1, 9.8 — Wzorzec E)*

| Krok | Sprawdzenie | ☐ |
|---|---|---|
| Liczba ogniw zgodna z napięciem systemu | 12V=4S, 24V=8S, 48V=16S | ☐ |
| BMS ma odpowiednią liczbę przewodów balansujących | np. 17 przewodów dla 16S | ☐ |
| Narzędzia: klucz dynamometryczny, miernik napięcia | — | ☐ |
| Środki ochrony: rękawice, okulary, gaśnica | — | ☐ |
| Napięcie każdego ogniwa zmierzone i zapisane | różnica między ogniwami <0,05V | ☐ |
| Rezystancja wewnętrzna zmierzona (jeśli tester dostępny) | porównanie z wartością fabryczną | ☐ |
| Ocena wizualna: brak wybrzuszeń, przebarwień, uszkodzeń obudowy | — | ☐ |

🔴 *"Nie masz BMS z balanserem — bez tego montaż jest niebezpieczny."*
🔴 różnica napięć między ogniwami >0,05V przed montażem — wymaga wstępnego zbalansowania przed połączeniem w pakiet.

---

### EKRAN A2: Montaż mechaniczny + separacja ogniw
*(scala dawne: 9.2, 9.10 — Wzorzec E)*

| Krok | Sprawdzenie | ☐ |
|---|---|---|
| Docisk ogniw pryzmatycznych wg zaleceń producenta | cross-ref Moduł 4, Ekran 21 (300-400 kgf) | ☐ |
| Separatory między ogniwami zamontowane | żywica epoksydowa lub plastik | ☐ |
| Krawędzie i naroża zabezpieczone | brak ostrych krawędzi mogących uszkodzić izolację kabli | ☐ |
| Obudowa dobrana do liczby i wymiarów ogniw | — | ☐ |

**D:** *"Ogniwa bez separacji mogą się przemieszczać i ocierać o siebie podczas pracy — separator to nie kosmetyka, tylko zabezpieczenie przed przetarciem izolacji."*

---

### EKRAN A3: Połączenia elektryczne + kolejność łączenia
*(scala dawne: 9.3, 9.11 — Wzorzec E)*

| Krok | Sprawdzenie | ☐ |
|---|---|---|
| Kolejność: najpierw połączenia szeregowe (minus do plusa) | — | ☐ |
| Następnie szyny zbiorcze | — | ☐ |
| Styki przetarte przed połączeniem | usunięcie utlenienia | ☐ |
| Moment dokręcenia zgodny z Modułem 4, Ekran 11 | — | ☐ |

**D:** *"Kolejność łączenia ma znaczenie — przypadkowe zwarcie podczas montażu szeregu ogniw to najczęstsza przyczyna wypadków przy budowie własnego pakietu."*

---

### EKRAN A4: Podłączenie BMS
*(scala dawne: 9.4, 9.5, 9.12 — Wzorzec E z elementem D dla pre-charge)*

| Krok | Sprawdzenie | ☐ |
|---|---|---|
| 1. Wtyczka balansująca (pomiarowa) — podłączana pierwsza | — | ☐ |
| 2. Przewody główne: B− do minusa pakietu, P− do odbiornika | **nigdy nie zamieniać kolejności** | ☐ |
| 3. Procedura pre-charge do falownika | patrz sekcja D poniżej | ☐ |
| 4. Sprawdzenie komunikacji BMS↔falownik (CAN/RS485) | poprawny odczyt SoC | ☐ |

**Procedura pre-charge (Wzorzec D, dawne 9.5):**
A: pojemność wejściowa DC falownika, napięcie systemu.
B: `T = 5 × R_pre × C` — dobór rezystora wstępnego (np. 50Ω/50W).
C: *"Podłącz rezystor 50Ω/50W między B+ baterii a wejściem DC falownika (szeregowo). Zaczekaj 3-5 sekund, aż napięcie na kondensatorach wzrośnie. Dopiero wtedy załącz główny bezpiecznik/stycznik. Odłącz rezystor."*
🔴 *"Bez pre-charge zaiskrzy i uszkodzisz styki bezpiecznika."*

---

### EKRAN A5: Pierwsze uruchomienie + test balansowania
*(scala dawne: 9.6, 9.13 — Wzorzec E)*

| Krok | Sprawdzenie | ☐ |
|---|---|---|
| Test ładowania małym prądem (0,1C) przez 30 minut | sprawdzenie balansowania | ☐ |
| Ładowanie do momentu, aż pierwsze ogniwo osiągnie 3,55V | Top Balancing | ☐ |
| Obserwacja, czy BMS zaczyna balansować | — | ☐ |
| Weryfikacja wszystkich parametrów przed pełnym obciążeniem | — | ☐ |

**D:** *"Pierwsze ładowanie to nie jest 'włącz i zapomnij' — to moment, kiedy BMS uczy się Twojego pakietu i wyrównuje różnice między ogniwami z fabryki."*

---

### EKRAN A6: Demontaż — procedura, SoC, odłączanie BMS
*(scala dawne: 9.7, 9.14, 9.15 — Wzorzec E, z pełną, bezwzględnie przestrzeganą kolejnością)*

**Warunek wstępny:** pakiet rozładowany do bezpiecznego poziomu — zalecane 3,0-3,2V/ogniwo (dla 16S: ok. 48-51V), żeby zmniejszyć energię i ryzyko iskrzenia przy demontażu.

| Krok | Działanie | ☐ |
|---|---|---|
| 1 | Zatrzymaj wszystkie obciążenia i ładowarki (falownik, MPPT, agregat) — poczekaj aż przestaną pobierać prąd | ☐ |
| 2 | Wyłącz BMS, poczekaj na rozładowanie kondensatorów wewnętrznych | ☐ |
| 3 | Odłącz wtyczkę balansującą od BMS (nie od ogniw) | ☐ |
| 4a | Odłącz P− (minus do obciążenia/ładowarki) | ☐ |
| 4b | Odłącz B− (minus akumulatora) | ☐ |
| 4c | Odłącz B+ (plus akumulatora) — zaizoluj końcówkę | ☐ |
| 5 | Demontaż ogniw: zaczynając od najwyższego potencjału, schodząc w dół — izoluj każdą odsłoniętą końcówkę na bieżąco | ☐ |

**Wymagane:** izolowane narzędzia, rękawice ochronne, okulary, nieprzewodzące podłoże.
🔴 *"Nie odłączaj ogniw przy pełnym naładowaniu — ryzyko iskrzenia i uszkodzenia terminali."*
**D:** *"Ta kolejność nie jest sugestią — to jest dokładnie odwrotność kolejności montażu, i każde odstępstwo zwiększa ryzyko zwarcia w rękach."*

---

### EKRAN A7: Przygotowanie stanowiska i narzędzi
*(dawne 9.9 — Wzorzec E)*

Checklist: mata izolacyjna na stole, klucz dynamometryczny z nasadkami izolowanymi, rękawice, okulary, gaśnica proszkowa/pianowa w zasięgu ręki, brak metalowych przedmiotów luzem na stanowisku.

---

### EKRAN A8: Ocena zużycia ogniwa po demontażu
*(dawne 9.16 — Wzorzec E)*

Pomiary do wykonania: grubość ogniwa (puchnięcie — porównanie z wymiarem fabrycznym), napięcie po 24h od demontażu (ocena samorozładowania), rezystancja wewnętrzna.
🔴 widoczne puchnięcie obudowy — ogniwo do wycofania z eksploatacji, nie do ponownego montażu.

---

### EKRAN A9: Ratowanie głęboko rozładowanego ogniwa
*(dawne 9.17 — Wzorzec D)*

**A:** zmierzone napięcie ogniwa (0V/1V/2V).
**B:** próg decyzyjny na podstawie napięcia — >1,5V: powolne ładowanie prądem 0,05C pod ścisłą obserwacją; 0V: ryzyko przebicia separatora, próba ratunkowa opcjonalna, nie zalecana.
**C:** *"Jeśli decydujesz się na ratunek przy niskim, ale niezerowym napięciu: ustaw zasilacz na 3,0V i limit prądu 0,5A. Obserwuj temperaturę przez cały czas ładowania."*
🔴 *"Ogniwo ma 0V. Prawdopodobnie doszło do przebicia separatora. Próba ładowania grozi pożarem. Zalecana utylizacja, nie ratunek."*
**D:** *"Głębokie rozładowanie to klinicznie 'śmierć' ogniwa — czasem da się je obudzić, ale zwykle to już nieodwracalne uszkodzenie, i próba ratunku ma swoje realne ryzyko."*

---

### EKRAN A10: Przechowywanie / recykling / narzędzia diagnostyczne
*(dawne 9.18, 9.19, 9.20 — Wzorzec C)*

**Przechowywanie:** 50% SoC (ok. 3,2V/ogniwo), temperatura 10-25°C, sucho, bieguny zaizolowane taśmą kaptonową.
**Recykling:** punkty zbiórki (sklepy specjalistyczne, PSZOK); przed oddaniem rozładować do 0V (np. przez zanurzenie w słonej wodzie — metoda kontrolowana, nie do robienia bez zrozumienia ryzyka).
**Narzędzia diagnostyczne:** tester rezystancji wewnętrznej (np. YR1035), zasilacz laboratoryjny do kontrolowanego balansowania/ratowania.

---

## ŚCIEŻKA B: Kwasowo-ołowiowa (AGM / Żel / Kwasowy / Trakcyjny)

### EKRAN B1: Weryfikacja + kontrola wstępna
*(scala dawne: 10.1, 10.8 — Wzorzec E)*

| Krok | Sprawdzenie | ☐ |
|---|---|---|
| Akumulatory tego samego typu, pojemności i podobnego wieku | mieszanie różnych generacji = przyspieszona degradacja słabszych |
| Napięcie spoczynkowe zmierzone | 12,6-12,8V = pełny |
| Poziom elektrolitu sprawdzony (jeśli z korkami) | — |
| Ocena wizualna: brak pęknięć obudowy, wycieków | — |

---

### EKRAN B2: Montaż mechaniczny + mocowanie/wentylacja
*(scala dawne: 10.2, 10.11 — Wzorzec E)*

| Krok | Sprawdzenie | ☐ |
|---|---|---|
| Nośność podłoża/półki sprawdzona pod wagę zestawu | akumulatory kwasowe są ciężkie |
| Stabilne mocowanie (pasy, obejmy) | szczególnie ważne w pojazdach/łodziach |
| Wentylacja pomieszczenia zapewniona | **akumulatory kwasowe wydzielają gazy podczas ładowania** |
| Montaż z dala od źródeł iskier/otwartego ognia | gazy wybuchowe (wodór) |

🔴 brak wentylacji w zamkniętym pomieszczeniu z akumulatorami kwasowymi — ryzyko wybuchu gromadzącego się wodoru.

---

### EKRAN B3: Połączenia + czyszczenie biegunów
*(scala dawne: 10.3, 10.10 — Wzorzec E)*

| Krok | Sprawdzenie | ☐ |
|---|---|---|
| Bieguny oczyszczone szczotką drucianą/papierem ściernym przed podłączeniem | — |
| Połączenie posmarowane wazeliną techniczną | **nie smarem miedzianym** — reakcja z ołowiem |
| Schemat połączeń zgodny z żądanym napięciem | szeregowo dla napięcia, równolegle dla pojemności |

---

### EKRAN B4: Balansery zewnętrzne
*(scala dawne: 10.4, 10.12 — Wzorzec D)*

**A:** liczba akumulatorów w szeregu, ich napięcia i pojemności.
**B:** akumulatory kwasowe w szeregu z czasem rozjeżdżają się napięciowo (w przeciwieństwie do LiFePO4 z aktywnym BMS) — wymagany balanser zewnętrzny podłączony równolegle do każdego akumulatora.
**C:** *"4 akumulatory 12V w szeregu (48V) — zastosuj balanser napięciowy na każdą parę, sprawdzając zgodność napięcia balansera z napięciem ogniwa (12V do 12V)."*
**D:** *"Akumulatory kwasowe, w przeciwieństwie do LiFePO4, nie mają wbudowanego 'sędziego' pilnującego równowagi — trzeba go dodać z zewnątrz, inaczej najsłabszy ogniowo ograniczy cały zestaw."*

---

### EKRAN B5: Dobór kabli, bezpieczników i zabezpieczeń
*(dawne 10.5 — Wzorzec D)*

**A:** prądy ładowania/rozładowania, długość kabli, napięcie systemu.
**B:** minimalny przekrój wg tego samego wzoru co Moduł 5, Ekran 1 (obciążalność + spadek napięcia); dobór bezpieczników wg prądu zwarciowego zestawu kwasowego (niższy niż LiFePO4, ale nadal wymaga właściwego AIC).
**C:** cross-ref bezpośredni do Moduł 5, Ekran 1 — logika identyczna, tylko inne wartości wejściowe.
**D:** *"Dobór kabla nie zależy od chemii baterii, tylko od prądu i długości — ten sam silnik obliczeniowy co w Module 5, tylko podstawiasz inne liczby."*

---

### EKRAN B6: Pierwsze uruchomienie i testy
*(dawne 10.6 — Wzorzec E)*

| Krok | Sprawdzenie | ☐ |
|---|---|---|
| Pomiar napięcia spoczynkowego każdego akumulatora | — |
| Test ładowania — obserwacja krzywej prądu/napięcia | — |
| Sprawdzenie temperatury podczas pierwszego ładowania | akumulatory kwasowe grzeją się przy ładowaniu bardziej niż LiFePO4 |

---

### EKRAN B7: Demontaż — procedura, kolejność, zabezpieczenie
*(scala dawne: 10.7, 10.14, 10.15 — Wzorzec E)*

| Krok | Działanie | ☐ |
|---|---|---|
| 1 | Najpierw odłącz minus (masa) | ☐ |
| 2 | Potem odłącz plus | ☐ |
| 3 | Przy rozpinaniu szeregu: od końca o najwyższym potencjale | ☐ |
| 4 | Załóż zaślepki na bieguny lub owiń taśmą izolacyjną | ☐ |
| 5 | Sprawdź, czy metalowe narzędzia nie leżą na akumulatorach | zapobiega przypadkowemu zwarciu |

**D:** *"Ta sama zasada co w LiFePO4 — masa (minus) zawsze pierwsza przy odłączaniu, ostatnia przy podłączaniu, żeby zminimalizować ryzyko zwarcia narzędziem o karoserię/obudowę."*

---

### EKRAN B8: Bezpieczeństwo pracy z kwasem
*(dawne 10.9 — Wzorzec E)*

Wymagane: okulary i rękawice kwasoodporne, dostęp do sody oczyszczonej (neutralizator rozlanego kwasu), procedura przy kontakcie ze skórą/oczami (natychmiastowe płukanie dużą ilością wody, konsultacja medyczna przy oczach).
🔴 praca bez okularów ochronnych przy akumulatorach z korkami (ryzyko pryśnięcia kwasu przy sprawdzaniu poziomu elektrolitu).

---

### EKRAN B9: Test pojemności i gęstości elektrolitu
*(dawne 10.13 — Wzorzec D)*

**A:** zmierzona gęstość elektrolitu (areometr, tylko akumulatory z korkami).
**B:** tabela referencyjna: 1,28 g/cm³ = pełny; 1,20 = połowa; 1,12 = rozładowany.
**C:** *"Zmierzona gęstość 1,15 g/cm³ — akumulator naładowany w ok. 35%. Wymagane doładowanie przed dalszym użytkowaniem."*
**D:** *"Gęstość elektrolitu to bezpośredni wskaźnik stanu naładowania akumulatora kwasowego — to jego odpowiednik SoC z BMS, tylko mierzony ręcznie."*

---

### EKRAN B10: Ocena zużycia — siarczanowanie
*(dawne 10.16 — Wzorzec E)*

Objawy do sprawdzenia: długi czas ładowania, szybkie rozładowanie, biały nalot na klemach (siarczan ołowiu), szybki spadek napięcia po naładowaniu (samorozładowanie).

---

### EKRAN B11: Ratowanie zasiarczonego akumulatora
*(dawne 10.17 — Wzorzec D)*

**A:** zdiagnozowane zasiarczenie (z Ekranu B10).
**B:** metoda ładowania impulsowego lub długiego ładowania bardzo niskim prądem, rozpuszczająca kryształy siarczanu ołowiu z powrotem w elektrolicie.
**C:** *"Zastosuj ładowarkę z trybem 'Repair' lub 'Desulfation' — proces może potrwać 24-48h i nie zawsze się udaje przy zaawansowanym zasiarczeniu."*
**D:** *"Odsiarczanie to próba odwrócenia procesu chemicznego, który normalnie jest nieodwracalny — działa czasem przy wczesnym wykryciu, rzadko przy zaniedbanym akumulatorze."*

---

### EKRAN B12: Przechowywanie / recykling / narzędzia
*(dawne 10.18, 10.19, 10.20 — Wzorzec C)*

**Przechowywanie:** **w pełni naładowany** (w przeciwieństwie do LiFePO4!) — zapobiega zamarzaniu elektrolitu i siarczanowaniu; chłodne, suche miejsce.
🔴 przechowywanie rozładowanego akumulatora kwasowego w mrozie — elektrolit o niskiej gęstości zamarza i pęka obudowa.
**Recykling:** punkty zbiórki, sklepy, PSZOK; **kaucja** — zwrot pieniędzy przy oddaniu starego akumulatora przy zakupie nowego.
🔴 kategoryczny zakaz wylewania kwasu do kanalizacji lub gruntu.
**Narzędzia:** areometr, miernik napięcia, klucze izolowane, szczotka do klem, wazelina techniczna, ładowarka z funkcją odsiarczania, woda destylowana (uzupełnianie poziomu elektrolitu).

---

## Kluczowa różnica między ścieżkami (do podkreślenia w UI)

| Aspekt | LiFePO4 | Kwasowo-ołowiowa |
|---|---|---|
| Przechowywanie | 50% SoC | **100% SoC (pełne naładowanie!)** |
| Balansowanie | wbudowane w BMS | wymaga zewnętrznego balansera |
| Wentylacja | nie wymagana (bez gazów) | **wymagana** (wodór podczas ładowania) |
| Diagnostyka stanu | rezystancja wewnętrzna (elektroniczna) | gęstość elektrolitu (mechaniczna, areometr) |
| Główne ryzyko degradacji | głębokie rozładowanie | siarczanowanie, zamarznięcie rozładowanego |

Ta tabela **musi** być widoczna gdzieś w UI (np. na ekranie startowym wyboru chemii) — pomylenie tych zasad (np. przechowanie LiFePO4 w pełni naładowanego, albo akumulatora kwasowego rozładowanego) prowadzi do przyspieszonej degradacji lub uszkodzenia.

---

## Podsumowanie modułu

**26 ekranów** (12 LiFePO4 + 14 kwasowo-ołowiowe — więcej, bo mniej naturalnych merge'y ze względu na balansery zewnętrzne i test elektrolitu, które nie mają odpowiednika po stronie LiFePO4), zbudowanych z ok. 12 wielokrotnie używanych szablonów UI współdzielonych między dwiema ścieżkami. Pokrywają wszystkie 40 pierwotnych funkcji.

**Twarde stopy zidentyfikowane w tym module:** demontaż ogniw przy pełnym naładowaniu (Ekran A6), próba ładowania ogniwa LiFePO4 o napięciu 0V (Ekran A9), brak wentylacji przy akumulatorach kwasowych w zamkniętym pomieszczeniu (Ekran B2), przechowywanie rozładowanego akumulatora kwasowego w mrozie (Ekran B12), wylewanie kwasu do kanalizacji/gruntu (Ekran B12).

---

**Wersja:** 1.0 — pełna treść Modułu 11 (Etap 3)
**Data:** Sierpień 2026
**Status:** Wszystkie 26 ekranów gotowe do przekazania deweloperowi.
**Powiązane dokumenty:** Biblia_Offgrid_v2_0_Architektura_Modulowa.md, Zasady_UX_Doradca_v2_1.md, Tresc_Modul_5_Okablowanie_Ekrany.md, Tresc_Modul_3_PV_Ekrany.md, Tresc_Modul_4_Baterie_Ekrany.md, Tresc_Modul_6_Ogrzewanie_Ekrany.md, Tresc_Modul_7_StressTest_Ekrany.md, Tresc_Modul_8_Bezpieczenstwo_Ekrany.md, Tresc_Modul_9_ESP32_Ekrany.md, Tresc_Modul_10_AI_Ekrany.md
