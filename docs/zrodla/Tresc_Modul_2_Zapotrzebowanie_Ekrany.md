# Moduł 2 (Kafel 2): Zapotrzebowanie energetyczne — treść ekranów

**Etap 3 — kontynuacja.** Jedenasty w pełni opisany moduł treściowy. Zgodnie z audytem §20 Zasad UX — 3 scalenia lokalne, 4 funkcje przeniesione do innych modułów (w tym 2 potwierdzone duplikaty międzyrozdziałowe). Moduł zawiera już wcześniej scalony moduł zbiorczy "Wampiry energetyczne" (24 dawne funkcje w jednym ekranie, opisany w Biblii v2.0).

---

## EKRAN 1: Systemy podtrzymania życia (Survival Core)
*(dawne 1.1 — Wzorzec D)*

**A:** wybór z listy krytycznych odbiorników (pompa głębinowa/hydrofor, przepompownia ścieków, ogrzewanie, wentylacja, monitoring, router), z domyślnymi mocami (pompa 800W, przepompownia 400W, rekuperator 80W, router 15W, kamery 20W — edytowalne).
**B:** te odbiorniki dostają priorytet 1 (nigdy nie odłączane) w całym systemie — zasilają logikę load sheddingu (Ekran 12) i strategię freeze protection (Moduł 7, Ekran 6).
**C:** *"Twoje systemy krytyczne: pompa głębinowa, ogrzewanie, router. Łączne zapotrzebowanie bazowe: 1,3 kW."*
**D:** *"To jest lista rzeczy, bez których dom przestaje być bezpieczny do mieszkania — reszta aplikacji będzie chronić te odbiorniki jako pierwsze, cokolwiek by się działo."*

---

## EKRAN 2: Inteligentny bojler C.W.U.
*(dawne 1.2 — Wzorzec D)*

**A:** pojemność bojlera (l), moc grzałki (kW), liczba domowników (auto z Ekranu 6).
**B:** dobowe zapotrzebowanie na ciepłą wodę na podstawie pojemności cieplnej i liczby osób; harmonogram ładowania dostosowany do dostępności PV (cross-ref Moduł 6, Ekran 18).
**C:** *"Bojler 200l z grzałką 2kW dla 4 osób — dobowe zapotrzebowanie ok. 8 kWh, najlepiej ładowany w oknie największej produkcji PV."*
**D:** *"Bojler to jeden z największych 'elastycznych' odbiorników w domu — można go zaplanować na godziny, kiedy energia jest najtańsza (czyli słoneczna), zamiast grzać na okrągło."*

---

## EKRAN 3: Urządzenia zmienne + płyta indukcyjna + klasa energetyczna
*(scala dawne: 1.3, 1.4, 1.5 — Wzorzec D)*

### Sekcja A
lista urządzeń z predefiniowanej bazy (pralka, zmywarka, lodówka, czajnik, mikrofalówka, laptop, TV, oświetlenie) z domyślną mocą i czasem pracy; osobne pole dla płyty indukcyjnej (moc palników, np. 7kW, czas gotowania); klasa energetyczna per urządzenie lub globalnie (nowoczesne A+++/standardowe 5-10 lat/stare >10 lat).

### Sekcja B
mnożnik wg klasy energetycznej: nowoczesne ×0,8, standardowe ×1,0, stare ×1,3-1,5 (starsze urządzenia zużywają realnie więcej niż nominalna moc sugeruje); płyta indukcyjna traktowana jako osobny rekord wysokiego priorytetu ze względu na duże obciążenie szczytowe.

### Sekcja C
*"Twoja lodówka (10 lat, klasa D) zużywa realnie o 40% więcej niż nowy model A+++ — rozważ wymianę, zwróci się w oszczędności baterii, nie tylko rachunku."*

### Sekcja D
*"Stare urządzenia to nie tylko wyższy rachunek za prąd w sieci — w off-gridzie to też większa, droższa bateria, żeby je udźwignąć. Wymiana starej lodówki czasem tańsza niż dokładanie kWh do magazynu."*

---

## EKRAN 4: Liczba domowników
*(dawne 1.6 — Wzorzec D-lite)*

Prosty suwak (1-6 osób), zasila automatycznie zapotrzebowanie na C.W.U. (Ekran 2), częstotliwość prania/gotowania/zmywania (Ekran 3), profil zużycia wody (cross-ref Moduł 10, AI wody). Domyślnie: 50-70l C.W.U./osobę/dobę.

---

## EKRAN 5: Profil dobowy + astronomiczny dzień/noc
*(scala dawne: 1.7, 1.16 — Wzorzec D)*

### Sekcja A
wskazanie na wykresie 24h okien szczytowego zużycia (np. 7:00-8:00 i 18:00-21:00); szerokość geograficzna (auto z Modułu 1) do wyliczenia długości dnia/nocy w każdym miesiącu.

### Sekcja B
dla każdej godziny współczynnik zapotrzebowania (np. 0,3 w nocy, 1,5 w szczycie); długość nocy wpływa na urządzenia świecące/grzejące w ciemności (np. oświetlenie zewnętrzne, niektóre grzałki) — dłuższa noc zimą = dłuższy czas pracy tych odbiorników niezależnie od reszty profilu.

### Sekcja C
*"Grudzień: 8h dnia, 16h nocy — oświetlenie zewnętrzne pracuje dwa razy dłużej niż w czerwcu, co dolicza się do zimowego bilansu niezależnie od ogrzewania."*

### Sekcja D
*"Profil dobowy to nie tylko 'kiedy używasz najwięcej prądu' — to też kiedy jest ciemno, bo od tego zależy, jak długo pracują urządzenia świecące, a to zmienia się drastycznie między latem a zimą."*

---

## EKRAN 6: Sezonowość i tryb wakacyjny
*(dawne 1.8 — Wzorzec D)*

**A:** przy każdym urządzeniu (lub globalnie) wybór: całoroczny/tylko lato/tylko zima/weekendowy.
**B:** urządzenia sezonowe (np. klimatyzacja "tylko lato") są wyłączane z bilansu poza swoim okresem, żeby nie zawyżać sztucznie zapotrzebowania rocznego.
**C:** *"Klimatyzacja aktywna tylko czerwiec-wrzesień — poza tym okresem nie liczy się do bilansu dobowego."*
**D:** *"Nie każde urządzenie pracuje cały rok — dobry bilans uwzględnia, że klimatyzacja zimą stoi wyłączona, a odśnieżarka latem w ogóle nie istnieje."*

---

## EKRAN 7: Dni autonomii
*(dawne 1.9 — Wzorzec D-lite)*

Suwak: 1/2/3/5/7 dni. To kluczowa wartość zasilająca dobór pojemności baterii w Module 4, Ekran 1. Im więcej dni, tym większa (i droższa) bateria — ekran powinien pokazywać na żywo szacunkowy wpływ na wielkość/koszt magazynu przy przesuwaniu suwaka.

---

## EKRAN 8: Zaawansowane parametry obciążenia
*(scala dawne: 1.10, 1.11, 1.21 — Wzorzec D)*

### Sekcja A
lista urządzeń z silnikami/sprężarkami (pompy, lodówki, kompresory — auto z Ekranu 3).

### Sekcja B — trzy powiązane korekty
1. **Moc pozorna/cos φ** (dawne 1.10): dla urządzeń z silnikami automatyczny cos φ (typowo 0,7, edytowalny); `VA = P / cos φ` — to VA, nie same waty, obciąża realnie falownik.
2. **Prądy rozruchowe** (dawne 1.11): współczynnik rozruchu z bazy (np. 5× dla pompy głębinowej, 6× dla starej lodówki) — chwilowy pik trwający ułamki sekundy, ale musi zmieścić się w przeciążalności falownika (cross-ref Moduł 5, Ekran 7).
3. **Współczynnik jednoczesności** (dawne 1.21): realny pik mocy przy założeniu, że nie wszystko włącza się naraz — dwa scenariusze: bezwzględny pik teoretyczny (suma wszystkiego) vs realny pik statystyczny (z uwzględnieniem prawdopodobieństwa jednoczesnego załączenia).

### Sekcja C
*"Twoje obciążenie nominalne to 3,2 kW, ale przy rozruchu pompy głębinowej (5× skok) chwilowy pik sięga 4,8 kVA. Falownik musi to wytrzymać przez te kilka sekund."*

### Sekcja D
*"Waty na tabliczce znamionowej to nie cała historia — silniki chwilowo 'chcą' dużo więcej prądu przy starcie, i to właśnie ten moment, nie praca ciągła, najczęściej powoduje wyłączanie się falownika."*

---

## EKRAN 9: Pobór własny falownika
*(dawne 1.12 — Wzorzec D)*

**A:** model falownika (baza komponentów) lub ręczne wpisanie poboru w stanie jałowym (typowo 20-100W, domyślnie 50W jeśli nieznany).
**B:** stały pobór doliczany do bilansu z priorytetem 1 (zawsze aktywny, niezależnie od obciążenia).
**C:** *"Twój falownik pobiera 45W nawet bez żadnego obciążenia — to 1,08 kWh/dobę 'z automatu', zanim cokolwiek włączysz."*
**D:** *"Falownik sam w sobie coś zużywa, tylko żeby być gotowym do pracy — to niewidoczny, ale realny koszt stały, o którym łatwo zapomnieć przy liczeniu bilansu."*

---

## EKRAN 10: Sprawność inwertera przy niskim obciążeniu
*(dawne 1.13 — Wzorzec D)*

**A:** krzywa sprawności wybranego falownika (z bazy, lub typowe wartości: max ~95% przy 40-80% obciążenia, spadek do 70-80% przy <10%).
**B:** rzeczywiste zużycie energii = zapotrzebowanie / sprawność przy danym poziomie obciążenia — falownik znacznie przewymiarowany względem realnego obciążenia traci sprawność.
**C:** *"Falownik 5kW przy typowym obciążeniu nocnym 300W pracuje przy 6% swojej mocy — sprawność spada do ok. 75%, więc realnie zużywasz o 25% więcej energii z baterii niż wynika z samego zapotrzebowania."*
**D:** *"Za duży falownik względem realnego obciążenia to trochę jak jazda autem na najwyższym biegu w mieście — silnik pracuje, ale nieefektywnie."*

---

## EKRAN 11: Przetwornice DC/DC
*(dawne 1.17 — Wzorzec D)*

**A:** dla każdego urządzenia niskonapięciowego (12V/24V) wybór: zasilanie przez przetwornicę DC/DC lub bezpośrednio z magistrali.
**B:** sprawność przetwornicy (domyślnie ~90-95%) dolicza się jako stratę do zapotrzebowania tego urządzenia.
**C:** *"Twoje oświetlenie 12V zasilane z magistrali 48V przez przetwornicę traci 8% energii na samej konwersji."*
**D:** *"Każda zmiana napięcia kosztuje trochę energii — czasem warto zasilić urządzenie bezpośrednio z magistrali w jego natywnym napięciu, zamiast przepuszczać prąd przez dodatkową przetwornicę."*

---

## EKRAN 12: Macierz priorytetów odłączania (Smart Load Shedding)
*(dawne 1.20 — Wzorzec D)*

**A:** przypisanie priorytetu każdemu urządzeniu/kategorii: 1-krytyczne (nigdy nie odłączane, auto z Ekranu 1), 2-komfort (odłączane przy SoC <20%), 3-nadwyżkowe (odłączane przy SoC <90% lub braku nadwyżki PV).
**B:** logika automatycznego odłączania wg progów SoC i priorytetów.
**C:** *"Przy SoC 18% system odłączy zmywarkę i suszarkę (priorytet 3), zostawiając ogrzewanie i pompę głębinową (priorytet 1) nietknięte."*
**D:** *"To jest system, który sam decyduje, co poświęcić, zanim Ty musiałbyś to robić ręcznie w panice przy niskiej baterii."*
Cross-ref: Moduł 7, Ekran 6 (freeze protection load shedding) i Moduł 8 (bezpieczeństwo) — to ta sama macierz priorytetów używana w scenariuszach kryzysowych.

---

## EKRAN 13: Bufor na rozbudowę
*(dawne 1.25 — Wzorzec D)*

Suwak: 0%/10%/20%/30% doliczane do całkowitego zapotrzebowania dobowego, jako margines na przyszłą rozbudowę (nowe urządzenia, powiększenie rodziny, dodatkowe zużycie).
**D:** *"Projektując system tylko pod dzisiejsze potrzeby, gwarantujesz sobie, że za 2 lata będzie za mały — bufor to świadoma decyzja, ile 'zapasu na przyszłość' wbudować od razu."*

---

## EKRAN 14: Architektura 1-fazowa / 3-fazowa
*(dawne 1.26 — Wzorzec D)*

**A:** typ instalacji (1-fazowa/3-fazowa), lista urządzeń wymagających 3 faz (np. pompa ciepła, duża indukcja — auto z bazy komponentów).
**B:** przypisanie obciążeń do faz L1/L2/L3; sprawdzenie symetrii — nierównomierne obciążenie faz to problem techniczny (przeciążenie jednej fazy przy niedociążeniu pozostałych).
**C:** *"Twoja pompa ciepła (3-fazowa, 6kW) obciąża wszystkie trzy fazy równo, ale reszta domu (1-fazowa) skupia się na L1 — L1 ma 4,2kW obciążenia, L2 i L3 tylko 2kW każda. Rozważ przepięcie części obwodów na L2/L3."*
🔴 znaczna asymetria obciążenia faz — ryzyko przeciążenia jednej fazy mimo formalnego zapasu mocy całkowitej.
**D:** *"W systemie 3-fazowym nie liczy się tylko suma mocy — liczy się, jak równo jest rozłożona między trzy fazy, bo każda ma swój własny limit."*

---

## EKRAN 15: Kategorie specjalne — warsztat/gospodarstwo/oświetlenie terenowe
*(dawne 1.27 — Wzorzec A, przełącznik kategorii z gotowym profilem)*

**A:** wybór kategorii (elektronarzędzia, spawarka, pompy do podlewania, oświetlenie podjazdu/ogrodzenia) — każda z możliwością oznaczenia jako sezonowa lub weekendowa.
**C:** wybór kategorii "Warsztat" ładuje preset z typowymi urządzeniami (szlifierka, wiertarka, spawarka) i ich charakterystykami mocy/rozruchu, gotowy do dostosowania zamiast wpisywania od zera.
**D:** *"Zamiast zaczynać od pustej listy, wybierasz swój profil (warsztat, gospodarstwo, ogród) i dostajesz gotowy punkt startowy dopasowany do typowych urządzeń w tej kategorii."*

---

## EKRAN 16: Kalkulatory pomocnicze
*(scala dawne: 1.22, 1.23 — Wzorzec D)*

**A:** moc urządzenia (W), napięcie systemu (12/24/48V) — dla przelicznika; dowolne wartości (moc, napięcie, pojemność Ah) — dla kalkulatorów ręcznych.
**B:** `I = P / (V × η)` dla przelicznika W→A; dodatkowe konwersje: Ah↔Wh, szacowany czas pracy z danej pojemności baterii.
**C:** *"Urządzenie 100W przy 12V pobiera ok. 8,7A (z uwzględnieniem sprawności układu)."*
**D:** *"To Twój podręczny 'kalkulator kieszonkowy' do szybkich przeliczeń w terenie, bez przechodzenia przez pełny proces projektowy."*

---

## Funkcje przeniesione z tego modułu (nie mają tu ekranu)

- **1.14 (Cykle odszraniania pompy ciepła)** → wchłonięte do Modułu 6, Ekran 6 (razem z dawnym 5.6 i 6.8 — potrójny duplikat międzyrozdziałowy).
- **1.15 (Grzałki BMS i samorozładowanie ogniw)** → wchłonięte do Modułu 4, Ekran 5 (razem z dawnym 3.5+3.14).
- **1.18 (Degradacja i starzenie — aging factor)** → **potwierdzony duplikat, nie tylko podejrzenie.** Treść źródłowa jednoznacznie łączy degradację paneli PV (−0,5%/rok) ORAZ degradację LiFePO4 (80% po 10 latach) w jeden "bufor starzeniowy". To dokładnie pokrywa się z Modułem 3, Ekran 19 (degradacja paneli) ORAZ Modułem 4, Ekran 6 (bufor starzeniowy baterii) jednocześnie. **Nie tworzy nowego ekranu — jego treść (mnożniki degradacji) powinna zasilić oba te ekrany, nie istnieć osobno.**
- **1.24, 1.28–1.50 (Wampiry energetyczne, 24 funkcje)** → już wcześniej scalone w jeden moduł zbiorczy, pełna treść w Biblii v2.0.

---

## Podsumowanie modułu

**16 ekranów** (nie 18 jak wcześniej szacowano w §20 — korekta po znalezieniu, że 1.18 nie potrzebuje własnego ekranu, tylko zasila dwa już istniejące) + 1 moduł zbiorczy wampirów energetycznych = **17 pozycji**, pokrywających wszystkie 50 pierwotnych funkcji (26 indywidualnych + 24 wampiry, po odjęciu 4 przeniesionych: 1.14, 1.15, 1.18 [zasila inne], 1.22+1.23 [tu zostały, nie przeniesione — korekta względem §20, gdzie błędnie zaplanowałem ich przeniesienie do Modułu 12; zostają tutaj jako najbardziej naturalne miejsce dla podstawowych przeliczników zużycia energii]).

**Uwaga do etapu 4 (integracja):** trzy duplikaty międzyrozdziałowe znalezione w tym module (1.14, 1.15, 1.18) potwierdzają wzorzec zauważony w Module 6 — oryginalny dokument v1.5 rósł organicznie i te same tematy bywały opisywane wielokrotnie w różnych rozdziałach. Warto na koniec etapu 3 zrobić jeszcze jedno przejście przez wszystkie moduły szukając kolejnych, jeszcze nieodkrytych duplikatów.

---

**Wersja:** 1.1 — pełna treść Modułu 2 (Etap 3), z korektą lokalizacji 1.22/1.23 i potwierdzeniem duplikatu 1.18
**Data:** Sierpień 2026
**Status:** Wszystkie 16 ekranów + moduł wampirów gotowe do przekazania deweloperowi.
**Powiązane dokumenty:** Biblia_Offgrid_v2_0_Architektura_Modulowa.md, Zasady_UX_Doradca_v2_1.md, oraz pozostałe pliki Tresc_Modul_*.md
