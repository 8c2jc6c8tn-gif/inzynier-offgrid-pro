# Uzupełnienie praktyczne — Montaż pakietu 16S LiFePO4 (Moduł 11)

**Status:** materiał źródłowy, dostarczony przez właściciela projektu 2026-09-13, zachowany
**niezmieniony** (GOD BOOK B.5 — materiały źródłowe, tylko do odczytu). Nie jest to oryginalna
treść `Tresc_Modul_11_MontazBaterii_Ekrany.md` (Biblia v2.0, ekrany A1–A10) — to praktyczne,
znacznie bardziej szczegółowe uzupełnienie tego samego tematu (montaż fizycznego pakietu 16S
LiFePO4), przygotowane przez właściciela projektu na bazie realnego montażu. Cel dostarczenia
(cytat właściciela projektu): *"dopracowałem jeden moduł. Ale nie do końca dopracowany. Trzeba na
bazie tego co ci teraz podam stworzyć/dopisać do Biblii jako plik czy część. Żeby było wiadomo na
bazie czego było robione."*

Analiza tego materiału (dopasowanie do istniejących ekranów A1–A10, zgodności/rozbieżności z już
zaimplementowanymi wartościami, nowa treść bez dzisiejszego pokrycia) — patrz `docs/rejestr-pokrycia.md`
(wiersze A2/A3/A4/A5, Moduł 11) i `docs/memory.md` (wpis 2026-09-13).

Treść poniżej wklejona dosłownie, bez zmian.

---

## TOM 1: Wprowadzenie, Przygotowanie Ogniw i Montaż Mechaniczny

### 1. Wprowadzenie i założenia projektowe

Budujemy pakiet 16S (16 ogniw połączonych szeregowo) w technologii LiFePO4. Napięcie nominalne pakietu to 51,2 V (16 x 3,2 V). Maksymalne napięcie ładowania to 57,6–58,4 V (16 x 3,60–3,65 V). Minimalne napięcie rozładowania to 40,0–44,8 V (16 x 2,50–2,80 V). Pakiet będzie montowany w obudowie (boksie) w układzie dwóch rzędów po 8 ogniw.

### 2. Etap 0: Selekcja i Top-Balancing (Najważniejszy etap)

Zaniedbanie tego etapu jest najczęstszą przyczyną problemów z balansowaniem i przedwczesnej degradacji pakietu.

**Krok 0.1 — Selekcja ogniw:**

- Używaj ogniw z tej samej partii produkcyjnej (te same kody batch).
- Zmierz napięcie obwodu otwartego (OCV) każdego ogniwa multimetrem o rozdzielczości ≥ 0,1 mV. Różnica między najwyższym a najniższym ogniwem nie powinna przekraczać 10 mV (0,010 V).
- Zmierz rezystancję wewnętrzną (IR) każdego ogniwa testerem AC 1 kHz. Typowa wartość dla ogniw 280–314 Ah to < 0,5 mΩ. Odrzuć ogniwa odstające o więcej niż 20% od mediany.

**Krok 0.2 — Top-balancing:**

- Połącz wszystkie 16 ogniw równolegle (plus do plusa, minus do minusa) grubymi przewodami.
- Podłącz zasilacz laboratoryjny ustawiony na 3,60 V z ograniczeniem prądu do 10–20 A.
- Ładuj aż prąd spadnie do ~0,5 A. Napięcie wszystkich ogniw powinno się wyrównać do 3,60 V ± 5 mV.
- Rozłącz połączenia równoległe i odczekaj 2–4 godziny. Zmierz napięcia spoczynkowe – różnica nie powinna przekraczać 5 mV.
- Uwaga: Nigdy nie montuj pakietu z ogniwami o różnicy napięć > 50 mV. BMS będzie musiał skompensować tę różnicę, co przy dużych prądach balansowania zajmie dni, a w skrajnych przypadkach doprowadzi do przeciążenia ogniw.

### 3. Etap 1: Montaż mechaniczny i kompresja

**Krok 1.1 — Przygotowanie obudowy:**

- Zamontuj kółka jezdne (jeśli używasz wózka) do ramy obudowy za pomocą śrub M6 z podkładkami.
- Ustaw obudowę na równej, stabilnej powierzchni.

**Krok 1.2 — Izolacja ogniw:**

- Oczyść powierzchnie stykowe ogniw (boczne) z kurzu i tłuszczu.
- Umieść przekładki izolacyjne (FR4, płyty epoksydowe lub papier ryżowy) między każdą parą sąsiadujących ogniw.
- Przekładki służą do: izolacji elektrycznej, izolacji termicznej oraz ochrony przed ścieraniem się ogniw podczas rozszerzania i kurczenia.

**Krok 1.3 — Ułożenie ogniw w obudowie:**

- Ułóż 16 ogniw w kolejności 16S, naprzemiennie biegunami (+ – + – + – …), tak aby busbary mogły je łączyć w sposób ciągły.
- Ogniwa powinny stać pionowo, odpowietrznikiem do góry. Jest to bezpieczniejsze – w przypadku wystąpienia zjawiska thermal runaway odpowietrznik nie zostanie zablokowany.
- Wsuń ogniwa w prowadnice izolacyjne obudowy (jeśli są dostępne).

**Krok 1.4 — Kompresja:**

- Zamontuj płytę kompresji i dokręć śruby kompresyjne. Cel: lekkie, równomierne docisnięcie ogniw, aby zapobiec ich przesuwaniu.
- Nie stosuj nadmiernej siły. Kompresja ma zapobiegać ruchowi ogniw, nie ma na celu „zatrzymania” rozszerzania się ogniw – siła rozszerzania jest zbyt duża, aby jakakolwiek rama kompresyjna mogła ją zatrzymać.
- Jeśli używasz sprężyn talerzowych, dokręć je tak, aby były lekko ściśnięte, ale nie zblokowane.

---

## TOM 2: Połączenia Szeregowe, Busbary i Mity

### 1. Dobór busbarów (na podstawie analizy zdjęć)

Analizowaliśmy elastyczne złącza miedziane (np. Turmera RUAN-5617720) dla ogniw 280/320Ah (EVE LF280K, MB31).

- Wymiary: LxW: 109mm x 20mm, grubość 2mm. Odległość między otworami (część elastyczna): 56mm. Odległość od otworu do końca: 17mm. Otwór: 7mm (pasuje na śrubę M6).
- Elastyczne vs. sztywne: Elastyczne są lepsze dla dużych ogniw. Kompensują rozszerzanie ogniw, zmniejszając ryzyko uszkodzenia terminali i poprawiając trwałość połączenia. Sztywne (z jedną dziurką) są tańsze, ale przenoszą naprężenia na terminale.
- Wniosek: Te busbary są jak najbardziej odpowiednie. Dziurki nie są „za daleko” – to standardowy wymiar.

### 2. Mit: Wiercenie dziurki w środku busbara

- Twierdzenie: Wiercenie otworu w środku busbara poprawia balansowanie ogniw.
- Prawda: To mit. Rezystancja miedzianego busbara jest minimalna, a spadek napięcia na całej jego długości przy prądach roboczych jest znikomy (rzędu miliwoltów). Umiejscowienie przewodu na środku nie daje żadnej mierzalnej korzyści dla balansowania. Wręcz przeciwnie – wprowadza dodatkową rezystancję i może prowadzić do błędnych odczytów przez BMS.
- Jedyna zaleta: Wygoda serwisowa (możliwość wymiany BMS bez demontażu głównych połączeń).
- Jeśli już musisz to zrobić: Wierć otwór jak najbliżej terminala ogniwa. Użyj wiertła 2,5 mm i gwintownika M3. Zastosuj krótką śrubę M3 z podkładką sprężynową i oczkiem.
- Zalecenie: Przewody balansujące podłączaj bezpośrednio do terminali ogniw, a nie do busbarów. To najczystsze i najbezpieczniejsze rozwiązanie.

### 3. Krok 2: Połączenia szeregowe (busbary) – Instrukcja krok po kroku

Zakładamy układ dwóch rzędów po 8 ogniw (16S). Aby zminimalizować długość przewodów i zachować przejrzystość, stosujemy układ serpentyny (węża).

**Krok 2.1 — Ułożenie ogniw w dwóch rzędach:**

- Rząd górny (od lewej do prawej): Ogniwo 1, Ogniwo 2, Ogniwo 3, Ogniwo 4, Ogniwo 5, Ogniwo 6, Ogniwo 7, Ogniwo 8.
- Rząd dolny (od prawej do lewej): Ogniwo 9, Ogniwo 10, Ogniwo 11, Ogniwo 12, Ogniwo 13, Ogniwo 14, Ogniwo 15, Ogniwo 16.
- Dzięki takiemu ułożeniu, ogniwo 8 (koniec górnego rzędu) sąsiaduje z ogniwem 9 (początek dolnego rzędu), co znacznie ułatwia połączenie szeregowe.
- Pamiętaj o naprzemiennym ułożeniu biegunów (+/-) w każdym rzędzie, aby busbary łączyły sąsiednie ogniwa w sposób ciągły.

**Krok 2.2 — Montaż busbarów (połączenia + i -):**

- Połączenie 1: Plus ogniwa 1 łączymy z minusem ogniwa 2.
- Połączenie 2: Plus ogniwa 2 łączymy z minusem ogniwa 3.
- Połączenie 3: Plus ogniwa 3 łączymy z minusem ogniwa 4.
- Połączenie 4: Plus ogniwa 4 łączymy z minusem ogniwa 5.
- Połączenie 5: Plus ogniwa 5 łączymy z minusem ogniwa 6.
- Połączenie 6: Plus ogniwa 6 łączymy z minusem ogniwa 7.
- Połączenie 7: Plus ogniwa 7 łączymy z minusem ogniwa 8.
- Połączenie 8 (między rzędami): Plus ogniwa 8 łączymy z minusem ogniwa 9 (busbar przechodzi między rzędami).
- Połączenie 9: Plus ogniwa 9 łączymy z minusem ogniwa 10.
- Połączenie 10: Plus ogniwa 10 łączymy z minusem ogniwa 11.
- Połączenie 11: Plus ogniwa 11 łączymy z minusem ogniwa 12.
- Połączenie 12: Plus ogniwa 12 łączymy z minusem ogniwa 13.
- Połączenie 13: Plus ogniwa 13 łączymy z minusem ogniwa 14.
- Połączenie 14: Plus ogniwa 14 łączymy z minusem ogniwa 15.
- Połączenie 15: Plus ogniwa 15 łączymy z minusem ogniwa 16.
- Wyjścia pakietu: Minus ogniwa 1 to B- (minus pakietu). Plus ogniwa 16 to B+ (plus pakietu).

**Krok 2.3 — Momenty dokręcania:**

- Dokręć śruby terminali momentem zgodnym ze specyfikacją ogniwa. Typowe wartości:
  - M6 (ogniwa 50–150 Ah): 5–6 N·m.
  - M6 (ogniwa 280 Ah, np. EVE LF280K, MB31): 6–7 N·m (nie przekraczaj 8 N·m, a dla MB31 maksymalnie 6 N·m).
  - M8 (większe ogniwa): 8–10 N·m.
- Używaj klucza dynamometrycznego. Dokręcenie „na wyczucie” jest niedopuszczalne – zbyt luźny busbar powoduje miejscowe nagrzewanie i uszkodzenie ogniwa, zbyt mocny deformuje terminal.

**Krok 2.4 — Weryfikacja napięcia pakietu:**

- Zmierz napięcie całego pakietu między skrajnymi biegunami (minus pierwszego ogniwa, plus ostatniego). Powinno wynosić 51,2 V ± 1 V (napięcie spoczynkowe po top-balancingu).
- Zmierz napięcie każdego ogniwa osobno. Różnica nie powinna przekraczać 5–10 mV.
- Zamontuj bezpiecznik klasy DC (np. Class-T) lub wyłącznik MCCB na przewodzie dodatnim pakietu. Bezpiecznik instaluj jak najbliżej plusa pakietu.

---

## TOM 3: BMS – Podłączenie, Konfiguracja i Aktywacja

### 1. Przygotowanie przewodów BMS

- Przewody balansujące (pomiarowe) muszą być polutowane i zaciśnięte przed wpięciem złącza do BMS. Nigdy nie lutuj przewodów przy podłączonym BMS – grozi to uszkodzeniem urządzenia.
- Przewód B- (minus pakietu do BMS) powinien mieć długość ≤ 40 cm i odpowiedni przekrój (np. 50 mm² dla 200 A).

### 2. Kolejność podłączania (Bezwzględnie przestrzegać!)

To najbardziej krytyczny etap. Kolejność ma znaczenie. Zawsze łącz przewody w kolejności rosnącej.

1. Podłącz przewód B- do portu B- na BMS. To połączenie z minusem pakietu (ogniwo 1, biegun ujemny).
2. Podłącz przewody balansujące do złącza BMS – ale jeszcze nie do ogniw.
3. Podłącz przewody balansujące do ogniw w kolejności:
   - Czarny przewód (B0) → minus pierwszego ogniwa (ten sam punkt co B-).
   - Biały przewód B1 → plus pierwszego ogniwa (który jest jednocześnie minusem drugiego ogniwa).
   - B2 → plus drugiego ogniwa.
   - … aż do B16 → plus szesnastego ogniwa (to jest B+ pakietu).
4. Podłącz B+ – przewód dodatni z BMS do plusa pakietu (B16).
5. Podłącz P- – wyjście ujemne BMS do obciążenia/ładowarki (na razie nie podłączaj inwertera – najpierw aktywuj BMS).
6. Podłącz P+ – plus pakietu do plusa obciążenia/ładowarki (zgodnie ze schematem producenta).

- Uwaga: Dla pakietów > 8S BMS JK używa dwóch wiązek przewodów pomiarowych. Podłącz najpierw pierwszą wiązkę, potem drugą, zachowując kolejność pinów.
- Weryfikacja przed aktywacją: Zmierz napięcie między P- BMS a plusem pakietu. Powinno być równe napięciu całego pakietu (~51,2 V). Sprawdź, czy każdy przewód balansujący ma prawidłowe napięcie względem B0 (np. B1 = ~3,2 V, B2 = ~6,4 V, … B16 = ~51,2 V).

### 3. Aktywacja i konfiguracja BMS

**Krok 3.1 — Aktywacja BMS:**

- Metoda 1 (ładowarka): Podłącz ładowarkę o napięciu 2–5 V wyższym niż napięcie pakietu na kilka sekund, aby wybudzić BMS.
- Metoda 2 (wyświetlacz/przycisk): Podłącz ekran LCD lub przycisk i naciśnij, aż BMS się uruchomi.

**Krok 3.2 — Połączenie z aplikacją:**

- Zainstaluj aplikację mobilną producenta (JK BMS, Daly, itp.) i połącz się przez Bluetooth.
- Domyślne hasło (JK BMS): 123456. Zmień je natychmiast po pierwszym logowaniu.

**Krok 3.3 — Konfiguracja parametrów LiFePO4:**

- Typ chemii: LiFePO4 (OVP = 3,60 V).
- Liczba ogniw: 16S.
- Pojemność: Wpisz rzeczywistą pojemność ogniw (np. 280 Ah, 304 Ah, 314 Ah dla EVE MB31).
- Napięcia odcięcia (kluczowe):
  - OVP (Over Voltage Protection): 3,60–3,65 V/ogniwo (całkowite: 57,6–58,4 V).
  - UVP (Under Voltage Protection): 2,50–2,80 V/ogniwo (całkowite: 40,0–44,8 V).
  - Zalecane napięcie ładowania (absorption): 55,2 V (3,45 V/ogniwo) – jest to bezpieczna, konserwatywna wartość dla długiej żywotności.
  - Napięcie float: 53,6–54,4 V (3,35–3,40 V/ogniwo).
- Prąd ładowania: Ustaw zgodnie z możliwościami ładowarki i ogniw (typowo 0,2–0,5 C).
- Prąd rozładowania: Nie przekraczaj prądu znamionowego BMS (np. 200 A ciągły, 350 A chwilowy).
- Balansowanie: Włącz funkcję Balance. Próg startu balansowania ustaw na 3,40 V lub różnicę 10 mV.
- Czujnik temperatury (NTC): Nie wyłączaj. Ustaw progi ochronne (np. ładowanie 0–45°C, rozładowanie -20–60°C).

**Krok 3.4 — Testy funkcjonalne:**

- Sprawdź w aplikacji napięcia wszystkich 16 ogniw. Powinny być zbliżone (±10 mV).
- Sprawdź, czy BMS raportuje temperaturę.
- Symuluj ładowanie i rozładowanie małym prądem, aby zweryfikować działanie zabezpieczeń.

---

## TOM 4: Okablowanie Prądowe, Złącza Oczkowe i Podłączenie do Falownika

### 1. Przekroje przewodów

**Ogniwo ↔ BMS:**

- BMS 200A (lub większy): 50 mm² (1/0 AWG). To minimalny, bezpieczny przekrój dla prądów rzędu 200 A. Kabel 35 mm² będzie się nadmiernie nagrzewał przy długotrwałym obciążeniu.
- BMS 150A: 35 mm².
- BMS 100A: 25–35 mm².
- Mniejsze BMS (np. 50A): 10–16 mm².

**BMS ↔ Falownik:**

- Dla falownika 5 kW 48V maksymalny prąd ciągły wynosi w przybliżeniu 104 A (5000 W / 48 V).
- Zalecany przekrój: 35–50 mm².
- Dla krótkich odcinków (do 2–3 m): wystarczające będzie 35 mm², ale 50 mm² zapewni mniejszy spadek napięcia i niższą temperaturę pracy.
- Dla dłuższych odcinków (powyżej 3 m): koniecznie 50 mm² lub więcej.

### 2. Złącza oczkowe (końcówki kablowe) – Dobór i materiały

**Materiał:**

- Miedź cynowana (Tinned Copper). Mosiądz jest zdecydowanie gorszym wyborem – ma przewodność na poziomie ok. 28% IACS, podczas gdy miedź cynowana to 90–97% IACS. Mosiężne złącze przy prądzie 200 A będzie się znacznie bardziej nagrzewać, co prowadzi do szybszego utleniania i wzrostu rezystancji przejścia.
- Cyna na miedzi zmniejsza rezystancję styku o ok. 15–20% i izoluje podłoże od tlenu, spowalniając korozję nawet 3–5 razy.

**Wymiary dla EVE MB31 (podwójne terminale M6):**

- Dla wszystkich połączeń (główne +/-, BMS) potrzebujesz oczek z otworem 6,4 mm (standard dla M6).
- Dla kabli prądowych (plus i minus pakietu):
  - Kabel 35 mm²: oczko M6, szerokość ok. 12–14 mm, grubość 1,0–1,2 mm (np. KOR 35/6, Erko).
  - Kabel 50 mm²: oczko M6, szerokość ok. 13–15 mm, grubość 1,2–1,5 mm (np. KOR 50/6).
- Dla przewodów BMS (balansujące, cienkie):
  - Typowy przewód 0,5–1,5 mm²: oczko M6, szerokość ok. 11,6 mm, grubość 0,8 mm.
  - Grubsze przewody balansujące 2,5 mm²: oczko M6, szerokość ok. 12 mm, grubość 0,8–1,0 mm.
- Weryfikacja szerokości: Oczka M6 o szerokości 12 mm istnieją i są standardem dla przewodów 4–10 mm². Oczka dla cieńszych przewodów (0,5–1,5 mm²) mają szerokość 11,6 mm.

**Gdzie kupić (sprawdzone źródła):**

- Dla przewodów balansujących (0,5–1,5 mm², szerokość 11,6 mm):
  - TIM SA (TradElectra OKR6): Izolowana końcówka oczkowa Cu, czerwona. Szerokość B [mm]: 11,6.
  - Traconelectric (SZ1.5-6): Nieizolowana końcówka oczkowa z miedzi cynowanej, 1,5–2,5 mm². Szerokość B [mm]: 11,6.
  - Motoroy.pl: Izolowany konektor oczkowy M6 dla przewodu 0,5–1,5 mm².
- Dla grubszych przewodów (4–6 mm², szerokość 12 mm):
  - Max4.pl (M6-0-2.5): Końcówka oczkowa o szerokości 12 mm.
  - El12.com (ERGOM KM 10/6): Końcówka kablowa oczkowa rurowa, szerokość 12 mm, dla 10 mm².

**Zaleta EVE MB31 (podwójny gwint M6):**

- Górny poziom: przykręcić busbar (z nakrętką).
- Dolny poziom: podłączyć oczko przewodu BMS – bez potrzeby „upychania” go pod busbarem. To eliminuje klasyczny problem ciasnych połączeń i luzujących się terminali.
- Moment dokręcania dla EVE MB31: Maksymalnie 6 Nm. Używaj klucza dynamometrycznego.

### 3. Podłączenie do falownika – Rezystor pre-charge vs. Dioda

- Dioda: Nie jest standardowym elementem w typowym połączeniu BMS–falownik. Dioda w obwodzie głównym wprowadziłaby niepożądany spadek napięcia i straty mocy.
- Rezystor pre-charge (przedładowania): Jest niezbędny! Falownik na wejściu DC ma duże kondensatory. W momencie podłączenia do naładowanego pakietu baterii, rozładowane kondensatory powodują chwilowy skok prądu (inrush current) przypominający zwarcie. Ten skok może uszkodzić BMS, zespawać styki przekaźników/contactorów lub doprowadzić do przedwczesnej awarii MOSFET-ów w BMS.
- Jak to rozwiązać: Zamiast diody, stosuje się rezystor pre-charge (typowo 1 Ω, 25 W) podłączony szeregowo z małym przełącznikiem. Sekwencja: najpierw zamykasz obwód przez rezystor, aby łagodnie naładować kondensatory falownika. Gdy napięcie na wejściu falownika zbliży się do napięcia pakietu, zamykasz główny styk (przekaźnik/przełącznik), a rezystor zostaje zwarty lub odłączony.
- Kiedy dioda miałaby zastosowanie? Gdy kilka pakietów baterii jest połączonych równolegle i chcesz zapobiec przepływowi prądu z jednego pakietu do drugiego w przypadku różnicy napięć.

### 4. Podłączenie do inwertera/obciążenia (końcowe)

- Podłącz inwerter do P+ i P- BMS (lub do złączy prądowych obudowy, które są połączone z BMS).
- Sprawdź, czy inwerter komunikuje się z BMS przez RS485/CAN (jeśli jest taka możliwość). W konfiguracji równoległej wielu BMS pierwszy pełni rolę master, kolejne slave – połącz porty RS485-1/RS485-2 kablami RJ45.
- Dokręć wszystkie połączenia prądowe kluczem dynamometrycznym.
- Po pierwszym cyklu ładowania/rozładowania ponownie sprawdź momenty dokręcania – miedź i elementy złączne „osiadają” pod wpływem temperatury.

---

## TOM 5: Błędy, Mity, Tabela Kontrolna i Podsumowanie

### 1. Najczęstsze błędy – unikaj ich

1. Montaż bez top-balancingu → BMS będzie balansował ogniwa tygodniami, pakiet nie osiągnie pełnej pojemności.
2. Zbyt mocne dokręcenie busbarów → deformacja terminali, uszkodzenie ogniw, wyciek elektrolitu. Dla EVE MB31 maksymalnie 6 Nm.
3. Podłączenie przewodów balansujących do BMS przed ich podłączeniem do ogniw → ryzyko zwarcia i uszkodzenia BMS.
4. Zbyt długi przewód B- → zwiększone straty i nagrzewanie. Maksymalnie 40 cm.
5. Brak bezpiecznika DC → w razie zwarcia w instalacji cała energia pakietu rozładowuje się w jednym punkcie – ryzyko pożaru. Stosuj bezpiecznik klasy T lub ANL.
6. Użycie ogniw z różnych partii → różnice IR i pojemności powodują szybszą degradację całego pakietu.
7. Zignorowanie ponownego dokręcenia po pierwszym cyklu → luźne złącza = hotspoty = potencjalne uszkodzenie ogniw.
8. Stosowanie mosiężnych złączy oczkowych → mosiądz ma 28% przewodności miedzi, nagrzewa się i utlenia.
9. Brak rezystora pre-charge przy podłączaniu falownika → skok prądu może uszkodzić BMS lub falownik.

### 2. Mity – obalone

- Mit: Wiercenie dziurki w środku busbara poprawia balansowanie.
  - Prawda: Nie poprawia. Rezystancja busbara jest pomijalna. Główny powód to wygoda serwisowa. Jeśli już wiercisz, rób to blisko terminala, nie w środku.
- Mit: Dioda jest potrzebna przy podłączaniu do falownika.
  - Prawda: Nie jest standardem. Kluczowy jest rezystor pre-charge. Dioda znajduje zastosowanie tylko w specyficznych konfiguracjach (np. równoległe pakiety).

### 3. Tabela kontrolna – kluczowe wartości

| Parametr | Wartość | Uwagi |
|---|---|---|
| Napięcie nominalne pakietu | 51,2 V | 16 × 3,2 V |
| Maks. napięcie ładowania | 57,6–58,4 V | 3,60–3,65 V/ogniwo |
| Zalecane napięcie ładowania | 55,2 V | 3,45 V/ogniwo, konserwatywne |
| Napięcie float | 53,6–54,4 V | 3,35–3,40 V/ogniwo |
| Min. napięcie rozładowania | 40,0–44,8 V | 2,50–2,80 V/ogniwo |
| Moment dokręcania M6 (280 Ah) | 6–7 N·m | Nie przekraczać 8 N·m |
| Moment dokręcania M6 (EVE MB31) | Maks. 6 N·m | Kluczowe dla MB31 |
| Moment dokręcania M8 | 8–10 N·m | Zgodnie ze specyfikacją ogniwa |
| Różnica napięć ogniw (spoczynek) | ≤ 5 mV | Po top-balancingu |
| Długość przewodu B- | ≤ 40 cm | Krótszy = mniejsze straty |
| Przekrój BMS 200A | 50 mm² | 35 mm² zbyt cienki |
| Przekrój BMS do falownika 5kW | 50 mm² | 35 mm² dla krótkich odcinków |
| Otwór oczka M6 | 6,4 mm | Standard dla M6 |
| Szerokość oczka (BMS 0,5–1,5 mm²) | 11,6 mm | Nie 9 mm |
| Szerokość oczka (kable 4–10 mm²) | 12 mm | Standard |
| Rezystor pre-charge | 1 Ω, 25 W | Niezbędny przy falowniku |

### 4. Podsumowanie końcowe

Budowa pakietu 16S LiFePO4 to proces wymagający precyzji, ale dzięki powyższym wytycznym unikniesz typowych pułapek. Kluczowe jest: top-balancing, właściwy moment dokręcania, kolejność podłączania BMS, grube przewody (50 mm²) oraz rezystor pre-charge. Unikaj mosiężnych złączy, nie wierć busbarów bez potrzeby i zawsze używaj klucza dynamometrycznego. Dzięki temu Twój pakiet będzie bezpieczny, wydajny i posłuży długie lata.
