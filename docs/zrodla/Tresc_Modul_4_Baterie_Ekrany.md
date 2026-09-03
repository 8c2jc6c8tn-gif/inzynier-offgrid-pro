# Moduł 4 (Kafel 4): Magazyn energii / baterie — treść ekranów

**Etap 3 — kontynuacja.** Trzeci w pełni opisany moduł treściowy. Wszystkie wzory, progi i przykłady liczbowe pochodzą z oryginalnego dokumentu źródłowego — żaden nie jest wymyślony. Struktura zgodna z §3 Zasad UX, audyt wzorców zgodny z §18.

---

## EKRAN 1: Dobór pojemności baterii
*(dawne 3.1 — Wzorzec D)*

### Sekcja A
| Pole | Jednostka | Podpowiedź `?` |
|---|---|---|
| Zapotrzebowanie dobowe | kWh | *auto z Modułu 2* |
| Dni autonomii | dni | *auto z Modułu 2 (1.9)* — "Ile dni bez słońca system ma wytrzymać wyłącznie na baterii." |
| Sprawność falownika | % | domyślnie 95%, edytowalne |
| DoD (głębokość rozładowania) | % | "Ile procent pojemności baterii można bezpiecznie wykorzystać. Dla LiFePO4 typowo 80–90% — reszta to bufor chroniący żywotność." |
| Horyzont projektowy | lata | do bufora starzeniowego, cross-ref Ekran 5 |

### Sekcja B — Silnik oceny
`Pojemność_użyteczna = (zapotrzebowanie_dobowe × dni_autonomii) / (sprawność_falownika × DoD)`
Dodawany bufor starzeniowy z Ekranu 5 (np. +20% na 10 lat).

### Sekcja C
*"Twoje zapotrzebowanie to 12 kWh/dobę. Przy 3 dniach autonomii potrzebujesz 45 kWh użytecznej — ok. 6 akumulatorów 12V/200Ah (57,6 kWh nominalnie)."*

### Sekcja D
*"Bateria nigdy nie jest w 100% 'użyteczna' — część pojemności to bufor bezpieczeństwa, żeby nie skracać jej życia głębokim rozładowywaniem."*

---

## EKRAN 2: Sugestia napięcia systemowego (12/24/48V)
*(dawne 3.2 — Wzorzec D)*

**A:** obciążenie szczytowe (W, auto z Modułu 2), prądy rozruchowe.
**B:** dla mocy >3000 W zalecane 48V (mniejsze prądy → cieńsze i tańsze kable); dla małych instalacji (<1000W) wystarcza 12V. Silnik porównawczo liczy wymagane przekroje kabli dla obu napięć.
**C:** *"Twoje obciążenie szczytowe to 4,8 kW — rekomendujemy 48V. Przy 12V prąd 400 A wymaga kabla 95 mm², przy 48V to 100 A i kabel 25 mm²."*
**D:** *"Wyższe napięcie systemowe = mniejszy prąd przy tej samej mocy = cieńsze, tańsze kable. To nie kwestia mody, tylko fizyki (P = V × I)."*

---

## EKRAN 3: Symulacja czasu ładowania/rozładowania
*(dawne 3.3 — Wzorzec D)*

**A:** pojemność baterii, aktualny/zakładany SoC, moc ładowania z PV (z Modułu 3), profil obciążenia (z Modułu 2).
**B:** dla profilu dobowego i produkcji PV system liczy, o której godzinie bateria osiągnie 100% i kiedy zacznie się rozładowywać w nocy.
**C:** *"Bateria naładuje się do pełna o 14:30, rozładowanie do 20% nastąpi o 5:45 — masz zapas."*
**D:** *"Ten wykres to symulacja jednego typowego dnia — pokazuje, czy Twoja bateria i produkcja PV są w ogóle zsynchronizowane z Twoim zużyciem."*

---

## EKRAN 4: Moduł EV — ładowanie samochodu elektrycznego
*(dawne 3.4 — Wzorzec D)*

**A:** pojemność baterii EV (kWh), dzienny przebieg, moc ładowarki (kW).
**B:** wyliczenie dodatkowego zapotrzebowania (np. 50 kWh/tydzień); sprawdzenie, czy instalacja ma nadwyżki do ładowania w dzień, czy trzeba sięgać po baterię domową/agregat.
**C:** *"Do naładowania EV potrzebujesz 10 kWh dziennie. Twoja instalacja ma nadwyżkę tylko latem — zimą będziesz musiał zwiększyć PV o 4 panele."*
**D:** *"EV to dodatkowy 'odbiornik' o dużym apetycie — trzeba go policzyć osobno, bo potrafi zjeść całą nadwyżkę produkcji."*

---

## EKRAN 5: Grzałki BMS i ochrona przed mrozem
*(scala dawne: 3.5, 3.14 — Wzorzec D)*

### Sekcja A
minimalna temperatura w lokalizacji (auto z Modułu 1), pobór grzałek BMS, czy magazyn jest w pomieszczeniu ogrzewanym, aktualna produkcja PV (live), SoC baterii (live).

### Sekcja B — dwie warstwy zintegrowane w jeden silnik
1. **Bilans energetyczny grzania** (dawne 3.5): poniżej 5°C BMS włącza grzałki przed ładowaniem; dolicza się to do bilansu dobowego (np. 0,5 kWh/dobę w styczniu).
2. **Logika decyzyjna, skąd brać prąd na grzanie** (dawne 3.14):
   - jest produkcja PV → grzałki zasilane bezpośrednio z paneli
   - brak PV, ale SoC > 30% → grzanie z baterii, tylko do osiągnięcia minimalnej temperatury ładowania (np. +5°C)
   - brak PV i SoC < 30% → grzanie wstrzymane, tryb uśpienia

### Sekcja C
*"Magazyn w garażu nieogrzewanym — zimą dolicz 0,6 kWh/dobę na grzanie ogniw."*
*"Jutro o 7:00 zacznie świecić słońce. Grzałki włączą się o 6:45 z baterii tylko na 15 minut, aby o 7:00 ogniwa miały 0°C i mogły przyjąć pełny prąd z PV."*
🔴 magazyn w nieogrzewanym pomieszczeniu bez doliczonego bilansu grzania → *"BMS zablokuje ładowanie przy mrozie, jeśli tego nie uwzględnisz."*

### Sekcja D
*"Nie marnuj prądu z baterii na grzanie, jeśli za chwilę słońce zrobi to za darmo — system sam to policzy i wybierze mądrzejszy moment."*

---

## EKRAN 6: Starzenie i degradacja ogniw (bufor projektowy)
*(dawne 3.6 — Wzorzec D)*

**A:** horyzont projektowy (suwak 5/10/15 lat).
**B:** LiFePO4 traci ok. 2-3% pojemności rocznie → po 10 latach ok. 80% pojemności początkowej. System dobiera baterię tak, żeby po tym czasie nadal mieć wymaganą pojemność użyteczną (z Ekranu 1).
**C:** *"Na dziś potrzebujesz 45 kWh użytecznej, ale za 10 lat będzie to wymagało baterii o pojemności 56 kWh — zamów akumulator o pojemności 60 kWh."*
**D:** *"Kupujesz baterię nie na dziś, tylko na cały okres jej życia — trzeba od razu doliczyć zapas na to, że będzie 'słabnąć'."*

---

## EKRAN 7: Obwód Pre-Charge
*(dawne 3.7 — Wzorzec D)*

**A:** pojemność wejściowa DC falownika C (µF, z bazy komponentów), napięcie systemowe V_sys.
**B:** `T = 5 × R_pre × C` — czas ładowania kondensatorów wejściowych przez rezystor wstępny. Dobór R_pre tak, by ograniczyć prąd uderzeniowy do bezpiecznego poziomu (np. 5A).
**C:** *"Zastosuj rezystor 50Ω/50W. Czas wstępnego ładowania: 3 sekundy. Poczekaj, aż zgaśnie dioda falownika, dopiero potem załącz główny bezpiecznik/stycznik."*
🔴 *"Bez obwodu pre-charge zaiskrzy i uszkodzisz styki bezpiecznika DC przy pierwszym podłączeniu."*
**D:** *"Kondensatory falownika w pierwszej chwili zachowują się jak zwarcie — pre-charge to łagodne 'obudzenie' ich prądem, zanim puścisz pełną moc."*

---

## EKRAN 8: Symulacja "Słabego Ogniwa" (Cell Drift & Balancing)
*(dawne 3.8 — Wzorzec D)*

**A:** liczba ogniw w szeregu (np. 16S), pojemność znamionowa (Ah), tolerancja fabryczna (domyślnie ±3%), opcjonalnie pomiar live z BMS.
**B:** symulacja rozładowania — identyfikacja ogniwa o najmniejszej pojemności, moment osiągnięcia napięcia odcięcia (np. 2,5V) podczas gdy reszta ma zapas. Użyteczna pojemność pakietu = pojemność najsłabszego ogniwa.
**C:** *"Twoja bateria nominalnie ma 10 kWh, ale przez słabe ogniwo #12 wykorzystasz tylko 8,8 kWh. Rekomendowany balanser aktywny o prądzie 2A."*
**D:** *"To jak pociągnięcie za hamulec w całym pociągu, bo jeden wagon się zepsuł — jedno słabe ogniwo ogranicza cały pakiet."*

---

## EKRAN 9: Detekcja zwarcia i e-Fuse
*(dawne 3.9 — Wzorzec D)*

**A:** prąd zwarciowy baterii (z rezystancji wewnętrznej — cross-ref Ekran 16), impedancja pętli zwarcia.
**B:** porównanie czasu reakcji: standardowy bezpiecznik ~10ms vs elektroniczny wyłącznik (e-Fuse) &lt;100µs. Jeśli prąd zwarciowy przekracza zdolność łączeniową pojedynczych tranzystorów BMS, wymagany bezpiecznik półprzewodnikowy.
**C:** *"Przy zwarciu w Twoim systemie popłynie prąd 5000A. Zwykły bezpiecznik ANL wyłączy to w 20 ms — za wolno! Twój BMS musi mieć funkcję e-Fuse (wyłączenie natychmiastowe)."*
🔴 brak e-Fuse przy wysokim prądzie zwarciowym pakietu.

---

## EKRAN 10: Ochrona przed wilgocią i kondensacją
*(dawne 3.11 — Wzorzec D)*

**A:** temperatura minimalna i wilgotność względna (auto z Modułu 1), stopień ochrony obudowy (IP), temperatura ogniw (live z BMS, jeśli dostępna).
**B:** obliczenie punktu rosy dla zadanej temperatury/wilgotności; jeśli temperatura obudowy/ogniw spada poniżej punktu rosy → wysokie ryzyko kondensacji. Dla miejsc narażonych na wilgoć (garaż, komora zewnętrzna) wymagane min. IP55.
**C:** *"W grudniu przy temp. −5°C i wilgotności 85% punkt rosy to −7°C. Twoja obudowa osiągnie −6°C — w środku wykropli się woda. Zalecana grzałka antykondensacyjna 25W sterowana czujnikiem wilgotności."*
**D:** *"Mokry BMS i miedziane szyny to gotowy przepis na zwarcie — kondensacja to cichy zabójca elektroniki."*
🔴 obudowa poniżej wymaganego IP w środowisku wilgotnym.

---

## EKRAN 11: Moment dokręcania śrub (Torque Control)
*(dawne 3.12 — Wzorzec E, checklist)*

| Element | Moment | Uwaga | ☐ |
|---|---|---|---|
| Terminal ogniwa M6 (typowy LiFePO4) | 4-4,5 N·m | klucz dynamometryczny, nigdy udarowy | ☐ |
| Terminal ogniwa M8 | 8 N·m | — | ☐ |
| Kontrola ponowna po 24h | — | osiadanie połączenia | ☐ |

**Ostrzeżenia stałe:** nie stosować podkładek sprężystych bezpośrednio na terminalu; nie używać pasty miedziowej na aluminium (cross-ref Moduł 5, Ekran 4).
**D:** *"Śruba to sprężyna — musisz ją naciągnąć dokładnie tyle, ile trzeba, żeby docisnęła końcówkę kablową, ani trochę więcej."*

---

## EKRAN 12: Ograniczenie prądu ładowania w mrozie (Cold C-Rate)
*(dawne 3.13 — Wzorzec D)*

### Sekcja A
temperatura ogniw (live z BMS), pojemność pakietu (Ah).

### Sekcja B — krzywa limitów
| Temperatura ogniwa | Max prąd ładowania |
|---|---|
| < −10°C | blokada całkowita |
| −10°C do 0°C | max 0,1C |
| 0°C do 5°C | max 0,2C |
| > 10°C | pełny prąd |

### Sekcja C
*"Dzisiaj rano przy −5°C bateria 280Ah może być ładowana prądem maks. 28 A. Pełne naładowanie zajmie 6 godzin zamiast 2."*

### Sekcja D
*"W lodówce miód ledwo płynie. W baterii jony litu też poruszają się wolniej na mrozie — ładowanie zbyt szybkie w zimnie trwale uszkadza ogniwa (osadzanie litu metalicznego)."*
🔴 ładowanie powyżej limitu C-rate dla danej temperatury — trwałe uszkodzenie ogniw.

---

## EKRAN 13: Algorytm końca ładowania (Tail Current / Absorption)
*(dawne 3.15 — Wzorzec D)*

**A:** napięcie absorpcji (np. 3,55 V/ogniwo), prąd końcowy (próg, np. 0,05C), aktualny prąd i napięcie (live).
**B:** cykl CC (stały prąd) do napięcia absorpcji → CV (stałe napięcie) do spadku prądu poniżej progu końcowego.
**C:** *"Bateria osiągnie 3,55 V/ogniwo o 13:20, ale pełne naładowanie nastąpi dopiero o 15:40, gdy prąd spadnie do 14 A. Nie odłączaj ładowania zbyt wcześnie!"*
**D:** *"To jak napełnianie butelki — ciśnienie już jest, ale trzeba chwilę odczekać, żeby woda dotarła do samego końca."*

---

## EKRAN 14: SoH (State of Health) — prognoza żywotności
*(scala dawne: 3.16, 3.33 — Wzorzec D)*

### Sekcja A
historia pracy z BMS (liczba cykli, średnia temperatura, średnie DoD, prądy) LUB manualny pomiar rezystancji wewnętrznej per ogniwo.

### Sekcja B — dwa powiązane silniki w jednym ekranie
1. **SoH ogólny pakietu** (dawne 3.16): metoda coulombowska, porównanie pojemności aktualnej ze znamionową, uwzględnia degradację kalendarzową i cykliczną.
2. **Diagnostyka per ogniwo** (dawne 3.33): SoH pakietu wynika bezpośrednio z trendu rezystancji wewnętrznej poszczególnych ogniw — wzrost rezystancji o 50% względem wartości fabrycznej = utrata pojemności tego ogniwa.

### Sekcja C
*"Twoja bateria ma 87% SoH. Przewidywany koniec życia: sierpień 2031."*
Tabela per ogniwo: *"Ogniwo #1: 0,25 mΩ (OK). Ogniwo #7: 0,48 mΩ (UWAGA!). Ogniwo #12: 0,71 mΩ (KRYTYCZNE — wymień)."*

### Sekcja D
*"Bateria to nie drzewo — umiera powoli i systematycznie. Rosnąca rezystancja jednego ogniwa to jak zatkane naczynie krwionośne — reszta układu musi pracować ciężej, żeby to skompensować."*

---

## EKRAN 15: Cold Cranking Amps (zimny start dużych odbiorników)
*(dawne 3.17 — Wzorzec D)*

### Sekcja A
temperatura ogniw, prąd rozruchowy odbiornika, rezystancja wewnętrzna ogniw, min. napięcie pracy falownika.

### Sekcja B
`V_sag = V_oc − I_rozruch × R_wewn` — jeśli V_sag spadnie poniżej minimalnego napięcia pracy falownika, ten się wyłączy. Sprawdzenie, czy BMS dopuści taki chwilowy prąd.

### Sekcja C
*"Przy −20°C napięcie na pakiecie podczas startu pompy spadnie do 40,5V. Falownik się wyłączy. Zalecane: podgrzanie ogniw do min. 5°C lub zastosowanie soft-startu."*

### Sekcja D
*"Zimna bateria to leniwa chemia — reakcje chemiczne wewnątrz zwalniają, więc bateria chwilowo 'nie nadąża' z dostarczeniem prądu rozruchowego, nawet jeśli ma dużo energii."*

---

## EKRAN 16: Tryb Long Term Storage (odstawienie na zimę)
*(dawne 3.18 — Wzorzec D, z elementem E)*

**A:** planowany okres nieobecności, temperatura w miejscu przechowywania, dostępność panelu podtrzymującego.
**B:** procedura: naładuj do 50-60% SoC → odłącz od falownika/obciążeń → uśpij BMS → zabezpiecz przed mrozem (sprawdzenie, czy temperatura nie spadnie poniżej −20°C).
**C — checklist:** *"Naładuj do 55%, odłącz BMS, upewnij się, że temperatura nie spadnie poniżej −20°C. Po powrocie bateria straci mniej niż 2% pojemności."*
**D:** *"Bateria to trochę jak roślina — nie lubi być ani przesuszona (0% SoC), ani przelana (100% SoC) przez długi czas bezczynności."*

---

## EKRAN 17: Analiza Second-Life (baterie z EV)
*(dawne 3.19 — Wzorzec B)*

**A:** deklarowana pojemność, cena zakupu, wiek, przebieg, typ chemii.
**B:** szacunek realnego SoH na podstawie wieku/przebiegu (~2-3%/rok lub ~1%/10 000 km); porównanie kosztu 1 kWh użytecznej z nową baterią LiFePO4.
**C:** *"Deklarowana pojemność 10 kWh, realny SoH ~72% → 7,2 kWh użyteczne. Cena 6000 zł za 7,2 kWh = 833 zł/kWh. Nowa LiFePO4 kosztuje 1200 zł/kWh, ale ma 100% SoH i 10 lat życia."*
**D:** *"Kupujesz kota w worku — bateria z rozbiórki EV może być świetną okazją albo drogim rozczarowaniem, zależnie od realnego stanu, nie deklarowanego."*

---

## EKRAN 18: Łączenie równoległe różnych baterii (Mixing)
*(dawne 3.20 — Wzorzec D)*

### Sekcja A
parametry obu baterii: pojemność, rezystancja wewnętrzna, napięcie nominalne, chemia, wiek/SoH.

### Sekcja B
`I_wyrównawczy = ΔV / (R1 + R2)` — jeśli różnica napięć >0,2V, ryzyko iskrzenia przy połączeniu. Symulacja nierównomiernego rozkładu prądu (starsza bateria o wyższej rezystancji oddaje mniej).

### Sekcja C
*"Nowa bateria 200Ah + stara 200Ah (SoH 70%) to zły pomysł — stara będzie miała wyższą rezystancję, nowa będzie oddawać 60% prądu, przeciążając się."*

### Sekcja D
*"To jak zaprzęgnięcie konia pociągowego z kucykiem do tego samego wozu — jeden ciągnie więcej i szybciej się wykończy."*
🔴 różnica napięć >0,2V lub mieszanie różnych chemii/wieku bez izolacji (cross-ref twarde stopy §6 Zasad UX).

---

## EKRAN 19: Vehicle-to-Home (V2H)
*(dawne 3.21 — Wzorzec D)*

**A:** model samochodu, pojemność baterii trakcyjnej, typ złącza, wsparcie falownika dla V2H/V2G.
**B:** sprawdzenie czy auto wspiera V2H czy tylko V2L (niższa moc, np. max 3,6 kW); obliczenie realnej dostępnej pojemności (rezerwa na dojazd, degradacja, straty); porównanie kosztu energii z baterii EV vs baterii domowej/agregatu.
**C:** *"Twój samochód ma baterię 80 kWh, ale wspiera tylko V2L (max 3,6 kW) — nie zasilisz całego domu. Do V2H potrzebujesz CHAdeMO i specjalnej ładowarki. Realnie oddasz 40 kWh, koszt 1 kWh z baterii EV: 2,1 zł."*
**D:** *"Auto może być powerbankiem na kółkach, ale to zużywa jego baterię trakcyjną — warto policzyć, czy to się opłaca, zanim zrobisz to w praktyce."*

---

## EKRAN 20: Komunikacja BMS — CAN/RS485/Modbus
*(dawne 3.22 — Wzorzec D)*

**A:** protokoły obsługiwane przez wybrany BMS i falownik/ładowarkę (z bazy komponentów).
**B:** sprawdzenie kompatybilności; jeśli BMS mówi RS485, a falownik CAN → wskazanie konwertera; uwzględnienie redundancji (zanik komunikacji → falownik w tryb bezpieczny).
**C:** *"Ten BMS nie obsługuje protokołu Pylontech, więc falownik nie odczyta SoC. Potrzebny konwerter za ok. 150 zł."*
**D:** *"BMS i falownik muszą 'mówić tym samym językiem' — bez tego falownik nie wie, ile realnie ma baterii, i musi zgadywać."*

---

## EKRAN 21: Pozycjonowanie ogniw (kompresja/spuchnięcie)
*(dawne 3.23 — Wzorzec D)*

**A:** typ ogniw (pryzmatyczne LiFePO4), wymiary pakietu.
**B:** zalecany docisk 300-400 kgf dla ogniw pryzmatycznych; uwzględnienie dylatacji (ogniwa rosną o 1-2% podczas ładowania) — konieczny margines luzu.
**C:** *"Dla pakietu 16S 280Ah zastosuj 4 pręty M8. Docisk odpowiadający momentowi 3 N·m na nakrętkach, ale zostaw 1 mm luzu na pęcznienie."*
🔴 zbyt duży docisk (uszkodzenie mechaniczne) LUB zbyt mały (utrata kontaktu wewnętrznego, przyspieszona degradacja).
**D:** *"Ogniwa lubią być trzymane stabilnie, ale nie jak w imadle — muszą mieć trochę przestrzeni na naturalne 'oddychanie' podczas pracy."*

---

## EKRAN 22: Pobór własny BMS i tryb uśpienia
*(dawne 3.24 — Wzorzec D)*

**A:** pobór BMS w trybie pracy (typowo 5-15W) i w trybie uśpienia (0,5-1W).
**B:** `strata_roczna = pobór_W × 24 × 365 / 1000` (kWh); porównanie strategii pracy ciągłej vs deep sleep w okresach bezczynności.
**C:** *"Twój BMS zużywa 7W ciągle = 61 kWh rocznie. Przejście w deep sleep zmniejszy to do 0,024 kWh/dobę."*
**D:** *"BMS to też odbiornik prądu, nawet gdy 'nic nie robi' — w małych off-gridach ten stały pobór potrafi być zaskakująco dużą częścią bilansu."*

---

## EKRAN 23: Analiza opłacalności magazynu (True Cost of Storage)
*(dawne 3.25 — Wzorzec D)*

**A:** cena baterii, pojemność użyteczna, liczba cykli przy danym DoD, sprawność, koszt alternatywy (agregat/sieć).
**B:** `energia_całkowita_życia = pojemność × liczba_cykli × sprawność`; `koszt_za_kWh = cena_baterii / energia_całkowita_życia`.
**C:** *"Koszt 1 kWh z baterii: 1,1 zł. Koszt 1 kWh z agregatu: 3,4 zł. Magazyn zwraca się po ok. 1200 cyklach."*
🟡 *"Twoja bateria jest zbyt mała i głęboko rozładowywana, co skraca jej życie i pogarsza ten rachunek — patrz Ekran 25 (napięcie odcięcia)."*
**D:** *"Bateria to skarbonka energii, ale sama też kosztuje — dopiero policzenie kosztu za każdą oddaną kWh pokazuje, czy się faktycznie opłaca."*

*(uwaga: ten ekran wchłania też dawną funkcję 12.12 z Modułu AI — "ocena opłacalności magazynowania (AI)" — to był duplikat tego samego tematu, scalony tutaj.)*

---

## EKRAN 24: Dobór bezpiecznika DC (AIC/Class T/NH)
*(dawne 3.27 — Wzorzec D)*

**A:** rezystancja wewnętrzna i napięcie baterii (do obliczenia prądu zwarciowego), pojemność pakietu.
**B:** `I_zw = V / R_wewn`; sprawdzenie, czy AIC (zdolność wyłączania) wybranego bezpiecznika przekracza obliczony prąd zwarciowy — dla LiFePO4 minimum AIC 10 000 A.
**C:** *"Zwarciowy prąd Twojego pakietu to 5200 A. Bezpiecznik ANL 200A ma zdolność wyłączenia tylko 2000 A i rozerwie się, tworząc łuk plazmowy. Musisz zastosować bezpiecznik Class T (AIC 20 000 A)."*
🔴 AIC bezpiecznika poniżej obliczonego prądu zwarciowego pakietu — to jeden z najpoważniejszych twardych stopów w całym dokumencie.
**D:** *"Bezpiecznik musi umieć ugasić pożar elektryczny, a nie tylko się przepalić — źle dobrany pod względem AIC sam staje się źródłem łuku elektrycznego."*

---

## EKRAN 25: Szyny zbiorcze i połączenia międzypakietowe
*(scala dawne: 3.28, 3.38 — Wzorzec D)*

### Sekcja A
liczba ogniw/baterii równoległych, maksymalny prąd, wymiary/długości kabli łączących.

### Sekcja B — dwa poziomy tego samego problemu
1. **Wewnątrz pakietu** (dawne 3.28): spadek napięcia na szynie miedzianej, nierównomierny rozkład prądu między ogniwami przy dużej różnicy rezystancji.
2. **Między pakietami** (dawne 3.38): spadki napięcia na kablach łączących równoległe baterie; nierówny rozkład prądu przy połączeniu kaskadowym.

### Sekcja C
*"Prąd na ogniwie #1 jest o 20% większy niż na ogniwie #8 — przesuń główny kabel na środek szyny."*
*"Twoje 4 baterie są połączone kaskadowo. Bateria #1 oddaje 40% prądu, Bateria #4 tylko 15%. Zastosuj szynę zbiorczą (gwiazda) i kable o równej długości zamiast kaskady."*

### Sekcja D
*"Elektrony, jak wszystko leniwe, płyną tam, gdzie jest im łatwiej — nierówne długości kabli czy niesymetryczne podłączenie zawsze prowadzi do nierównego obciążenia."*

---

## EKRAN 26: Topologia BMS (Common Port vs Separate Port)
*(dawne 3.29 — Wzorzec B)*

**A:** model BMS, falownika, ładowarki (osobne czy hybrydowe).
**B:** Common Port — jedna droga dla ładowania i rozładowania; Separate Port — osobne dla MPPT i falownika.
**C:** *"Wybrany BMS ma Common Port 100A, ale twój inwerter pobiera 150A przy rozruchu. Wybierz wersję Separate Port."*
**D:** *"Jak masz jedną rurę do wody i ścieków, to w końcu się zapcha — czasem lepiej rozdzielić drogi ładowania i rozładowania."*

---

## EKRAN 27: Chłodzenie baterii latem
*(dawne 3.30 — Wzorzec D)*

**A:** temperatura maksymalna w lokalizacji (auto z Modułu 1), temperatura ogniw (live).
**B:** dopuszczalny zakres pracy (typowo 15-35°C); powyżej 35°C wykrywane ryzyko przyspieszonej degradacji.
**C:** *"Symulacja lipca: temperatura w garażu 45°C. Twoje ogniwa osiągną 48°C. Degradacja przyspieszy o 30%. Przenieś magazyn do piwnicy albo zapewnij aktywne chłodzenie."*
**D:** *"Bateria to nie piec — wysoka temperatura nie tylko chwilowo obniża wydajność, ale trwale przyspiesza starzenie ogniw."*

---

## EKRAN 28: Kalibracja i dokładność SoC
*(dawne 3.31 — Wzorzec D)*

**A:** historia ładowań, napięcia ogniw, prądy, czas od ostatniego pełnego naładowania (live z BMS).
**B:** coulomb counting akumuluje błąd przy długotrwałej pracy bez pełnego naładowania; system wykrywa, kiedy było ostatnie pełne ładowanie i po ok. 2 tygodniach bez niego rekomenduje kalibrację.
**C:** *"Wskaźnik SoC rozjechał się o 12%. Zrób pełne ładowanie, żeby BMS złapał punkty odniesienia."*
**D:** *"Liczenie prądu w BMS to ciągły szacunek, nie dokładny pomiar — od czasu do czasu trzeba go 'zresetować' pełnym naładowaniem, żeby błąd się nie kumulował."*

---

## EKRAN 29: Detekcja doziemienia (Ground Fault & IMD)
*(dawne 3.32 — Wzorzec D)*

**A:** napięcie DC systemu, typ uziemienia (auto z Modułu 5, Ekran 11).
**B:** sprawdzenie obecności monitora izolacji (IMD) lub różnicówki DC; symulacja scenariusza przebicia.
**C:** *"Przebicie w panelu spowoduje pojawienie się niebezpiecznego potencjału na ramie. Zainstaluj monitor izolacji (IMD)."*
**D:** *"Prąd stały (DC) trzyma ofiarę porażenia mocniej niż zmienny (AC) — mięśnie nie mogą się 'puścić' tak jak przy AC. Dlatego detekcja doziemienia w DC jest tak krytyczna."*
Cross-ref: Moduł 5, Ekran 18 (IMD).

---

## EKRAN 30: Porównanie technologii magazynów
*(dawne 3.34 — Wzorzec B)*

| Technologia | Cena startowa | Cykle (przy DoD) | Sprawność | Waga/kWh | Obsługa |
|---|---|---|---|---|---|
| LiFePO4 | wysoka | 5000 (80% DoD) | 98% | ~12 kg | bezobsługowa |
| Kwasowa (AGM) | niska | 300-500 (50% DoD) | 80% | 25-30 kg | wentylacja gazów |
| Żelowa (GEL) | średnia | 800-1000 (50% DoD) | 80% | ~30 kg | bezobsługowa, długie ładowanie |
| Trakcyjna (wózek widłowy) | niska/kWh | 1500-2000 (80% DoD teoret.) | — | bardzo duża (500-1000 kg/48V) | uzupełnianie wody, wentylacja |

**C:** *"Kwasowy kosztuje 500 zł, ale w całym cyklu życia jest 2× droższy od LiFePO4. Trakcyjny z wózka jest tani za kWh, ale waży 300 kg i wymaga regularnego dolewania wody destylowanej."*
**D:** *"Cena zakupu to nie to samo co koszt w całym życiu baterii — trzeba doliczyć wagę (konstrukcja podłogi), obsługę i realną liczbę cykli."*

---

## EKRAN 31: Napięcie odcięcia vs żywotność (DoD vs Voltage Cut-off)
*(dawne 3.35 — Wzorzec D)*

**A:** napięcie odcięcia ustawione na falowniku, konfiguracja pakietu (np. 16S → napięcie nominalne 48V).
**B:** porównanie ustawionego napięcia odcięcia z zalecanym; przeliczenie na realną głębokość rozładowania (DoD) i wpływ na liczbę cykli życia.
**C:** *"Twoje napięcie odcięcia to 42,0V (100% DoD) → 2000 cykli. Jeśli podniesiesz je do 44,0V (80% DoD), bateria wytrzyma 5000 cykli (+150% życia)."*
**D:** *"Nie wyciskaj baterii do ostatniej kropli — pozostawienie małego zapasu radykalnie wydłuża jej życie, kosztem niewielkiej części dostępnej pojemności."*

---

## EKRAN 32: Hierarchia ładowania (PV > Agregat > Sieć)
*(dawne 3.36 — Wzorzec D)*

**A:** konfiguracja dostępnych źródeł (PV/agregat/sieć), prognoza pogody (z §15.3), aktualny SoC.
**B:** priorytet: (1) PV zawsze pierwsze; (2) agregat tylko gdy SoC poniżej progu krytycznego ORAZ prognoza nie przewiduje słońca; (3) sieć doładowuje nocą tylko przy taniej taryfie.
**C:** *"Jutro wraca słońce. System NIE włączy dziś agregatu, mimo że SoC spadł do 25%, bo przewiduje produkcję 4 kWh od 9:00 rano."*
**D:** *"Mądry system czeka na darmowe paliwo ze słońca, zamiast od razu sięgać po drogi agregat."*
Cross-ref: Moduł 10 (AI), 12.7 — wykonawcza warstwa AI tej samej hierarchii.

---

## EKRAN 33: Symulacja miesiąca zachmurzenia (No-Sun Scenario)
*(dawne 3.37 — Wzorzec D)*

**A:** historyczne dane pogodowe najgorszych okresów (z Modułu 1), pojemność baterii, liczba dni scenariusza (edytowalna, domyślnie 10).
**B:** symulacja produkcji PV na poziomie 5-10% nominalnej przez zadaną liczbę dni; codzienny ubytek energii z baterii; sprawdzenie, kiedy nastąpi "śmierć systemu" (blackout).
**C:** *"W czarnym scenariuszu (10 dni chmur) Twój system padnie 7. dnia o 22:00. Aby przetrwać bez agregatu, potrzebujesz dodatkowych 20 kWh baterii."*
**D:** *"Projektujesz system nie na średnią pogodę, tylko na najgorszy realistyczny tydzień w roku — to jest istota prawdziwego off-gridu."*
Cross-ref: Moduł 7 (Stress-test zimowy).

---

## EKRAN 34: Matryca alarmów BMS i reakcje systemu
*(dawne 3.39 — Wzorzec C, tabela referencyjna/konfiguracyjna)*

| Alarm | Reakcja systemu |
|---|---|
| Nadmierne napięcie | Odłączenie ładowania |
| Podnapięcie | Odłączenie obciążenia |
| Przegrzanie | Ograniczenie prądu → awaryjne wyłączenie |
| Przeciążenie | Ograniczenie prądu |
| Zwarcie | Awaryjne wyłączenie natychmiastowe |
| Awaria czujnika | Ostrzeżenie |
| Rozjazd ogniw | Ostrzeżenie → zalecenie balansowania |

**Przykład komunikatu:** *"ALARM: Przegrzanie ogniwa #3 (52°C). BMS ograniczył prąd ładowania do 20A. Sprawdź wentylację komory."*
**D:** *"System broni się sam — Twoim zadaniem jest zrozumieć komunikat i usunąć przyczynę, nie tylko skasować alarm."*

---

## Funkcje przeniesione z tego modułu (nie mają tu ekranu)

- **3.10 (Gaszenie i wentylacja komory baterii)** → treść należy do Modułu 8 (Bezpieczeństwo), razem z pokrewnym sterowaniem gaśniczym (dawne 11.52+12.51). Kluczowe dane źródłowe do przeniesienia: wymagany przepływ wentylacyjny do odprowadzenia ciepła/gazów; dla LiFePO4 **jedynym skutecznym środkiem gaśniczym jest agregat wodny/mgłowy lub specjalny środek do magazynów energii — proszek/CO2 NIE gasi wewnętrznej reakcji chemicznej ogniwa, piasek nadaje się tylko do zasypania wycieku.**
- **3.26 (Czarna Skrzynka — Data Logging & Alarmy)** → staje się widżetem biblioteki Trybu Live (Moduł 13).

---

## Podsumowanie modułu

**34 ekrany** (29 z pełną treścią Doradcy + 3 porównawcze B + 1 checklist E + 1 tabela referencyjna C), pokrywających 39 pierwotnych funkcji źródłowych (3 pary scalone, 2 przeniesione).

**Twarde stopy zidentyfikowane w tym module:** AIC bezpiecznika poniżej prądu zwarciowego pakietu (Ekran 24 — jeden z najpoważniejszych w całym dokumencie), ładowanie powyżej limitu C-rate w mrozie (Ekran 12), mieszanie baterii o różnej chemii/wieku/napięciu w równoległym połączeniu bez izolacji (Ekran 18), zbyt duży lub zbyt mały docisk ogniw pryzmatycznych (Ekran 21), obudowa poniżej wymaganego IP w środowisku wilgotnym (Ekran 10).

---

**Wersja:** 1.0 — pełna treść Modułu 4 (Etap 3)
**Data:** Sierpień 2026
**Status:** Wszystkie 34 ekrany gotowe do przekazania deweloperowi.
**Powiązane dokumenty:** Biblia_Offgrid_v2_0_Architektura_Modulowa.md, Zasady_UX_Doradca_v2_1.md, Tresc_Modul_5_Okablowanie_Ekrany.md, Tresc_Modul_3_PV_Ekrany.md
