# Moduł 6 (Kafel 6): Ogrzewanie / wentylacja / pompa ciepła — treść ekranów

**Etap 3 — kontynuacja.** Czwarty, największy i najbardziej złożony moduł treściowy. Wszystkie wzory, progi i przykłady liczbowe pochodzą z oryginalnego dokumentu źródłowego. Struktura zgodna z §3 Zasad UX, audyt wzorców zgodny z §19.

**Ważna decyzja zakresu (przeczytaj przed dalszą pracą):** ten moduł zawiera osobno opisaną Część 1 (26 funkcji, pełna nowa treść wg szablonu Doradcy poniżej) oraz Część 2 — silnik 74 czynników wpływu na pompę ciepła (dawne 5.27–5.100). Dla Części 2 **nic nie zostało utracone** — pełna oryginalna treść wszystkich 74 funkcji (Skąd czerpie dane / Jak działa logika / Efekt na ekranie / Migawka) jest zachowana w całości w pliku `Biblia_Offgrid_v2_0_Architektura_Modulowa.md` (sekcja "Moduł 6", pozycje 6.27.1–6.27.74). Poniżej, w Części 2, podaję: (a) zasadę wspólną dla wszystkich 74 kart, (b) pełny wzór szablonu Doradcy na 5 w pełni rozpisanych przykładach reprezentujących różne kategorie czynników, (c) tabelę wszystkich 74 czynników z przypisaniem do kategorii i źródła danych. To pozwala programiście zaimplementować jeden generyczny silnik i podpiąć pod niego 74 zestawy parametrów, zamiast tworzyć 74 osobne implementacje.

---

## Część 1: Funkcje 5.1–5.26

### EKRAN 1: Charakterystyka termiczna budynku — RAPORT
*(dawne 5.1 — Wzorzec G)*

To jest ekran wynikowy importu danych budynkowych z §12 Zasad UX (z Kalkulatora Inżyniera Pro lub ręcznego kreatora). Nie ma pól do wypełnienia przez użytkownika w tym miejscu — pokazuje zaimportowane dane.

**Dane źródłowe:** powierzchnia, typ ocieplenia, rok budowy, współczynniki U dla ścian/dachu/okien.
**Silnik:** straty ciepła (W) liczone z różnicy temperatur wewnątrz/na zewnątrz i współczynników U, dla każdego miesiąca osobno.
**Przykład wyniku:** *"Twoje straty ciepła przy −20°C wynoszą 8 kW — ogrzewanie elektryczne potrzebowałoby 192 kWh/dobę, ale pompa ciepła zmniejszy to do 60 kWh (COP=3)."*

---

### EKRAN 2: Zapotrzebowanie na C.O. i C.W.U.
*(dawne 5.2 — Wzorzec D)*

**A:** straty ciepła (auto z Ekranu 1), liczba domowników (auto z Modułu 2).
**B:** C.O. zmienia się z temperaturą zewnętrzną (krzywa grzewcza); C.W.U. zależne od liczby osób (norma: ok. 50 l/osobę/dobę) i temperatury zimnej wody.
**C:** *"C.O. (styczeń): 40 kWh/dobę, C.W.U.: 10 kWh/dobę."*
**D:** *"To są dwa różne 'apetyty na ciepło' — C.O. skacze z pogodą, C.W.U. jest w miarę stałe cały rok."*

---

### EKRAN 3: System wentylacji z odzyskiem ciepła
*(scala dawne: 5.3, 5.23, 5.24 — Wzorzec D)*

### Sekcja A
kubatura budynku, liczba pomieszczeń (auto z Modułu 1), liczba domowników, sprawność rekuperatora (%, z bazy komponentów), czy centrala ma funkcję letniego bypassu.

### Sekcja B — trzy warstwy jednego systemu
1. **Podstawowy bilans** (dawne 5.3): odzyskane ciepło redukuje zapotrzebowanie na ogrzewanie; stały pobór wentylatorów (50-100 W) dolicza się do bilansu elektrycznego.
2. **Projekt strumieni** (dawne 5.23): wymagane strumienie nawiewne/wywiewne per typ pomieszczenia (łazienki/kuchnia/WC = wywiew; sypialnie/salon = nawiew); dobór wydajności centrali (m³/h).
3. **Bypass letni** (dawne 5.24): latem w nocy powietrze zewnętrzne bywa chłodniejsze — automatyczne omijanie wymiennika ciepła pozwala schłodzić budynek bez klimatyzacji.

### Sekcja C
*"Dla domu 120 m² i 4 osób wymagany strumień to 200 m³/h. Centrala 250 m³/h ze sprawnością 85% odzyska 2,1 kW ciepła przy −10°C."*
*"Bypass automatyczny w nocy wywietrzy budynek do 19°C bez klimatyzacji — oszczędzasz ok. 150 kWh energii chłodniczej rocznie."*
🟡 *"Zbyt mała centrala będzie głośna i nie dowiezie świeżego powietrza."*

### Sekcja D
*"Wentylacja to płuca domu. Rekuperacja sprawia, że płuca oddychają, ale nie tracą przy tym ciepła — a latem bypass daje im 'oddech' bez dodatkowego chłodzenia."*

---

### EKRAN 4: Gruntowy wymiennik ciepła (GWC)
*(dawne 5.4 — Wzorzec D)*

**A:** długość rur, głębokość ułożenia, typ gruntu.
**B:** GWC podgrzewa powietrze zimą (o kilka °C) i chłodzi latem — wpływa bezpośrednio na bilans ogrzewania/chłodzenia.
**C:** *"GWC o długości 50 m podnosi temperaturę powietrza o 4°C zimą — zmniejsza zapotrzebowanie na ogrzewanie o 5%."*
**D:** *"Grunt na głębokości kilku metrów ma stałą temperaturę przez cały rok — GWC to sposób, żeby to 'pożyczyć' na wstępne podgrzanie lub schłodzenie powietrza."*

---

### EKRAN 5: Pompa ciepła — COP/SCOP w funkcji temperatury
*(dawne 5.5 — Wzorzec D, ekran bazowy dla silnika czynników z Części 2)*

**A:** model pompy ciepła (z bazy komponentów) lub ręcznie wprowadzona krzywa COP; temperatury zewnętrzne dla każdego miesiąca (auto z Modułu 1).
**B:** COP maleje z temperaturą; `P_elektryczna = P_cieplna / COP`.
**C:** *"W styczniu przy −5°C COP = 2,8 — pompa zużyje 14,3 kWh prądu na wyprodukowanie 40 kWh ciepła."*
**D:** *"COP to 'mnożnik' — pompa ciepła nie produkuje ciepła z niczego, tylko przenosi je z zewnątrz, zużywając mniej prądu niż grzałka elektryczna."*
**Link:** *"Zobacz szczegółowy wpływ konkretnego czynnika na ten wynik →"* prowadzi do silnika 74 czynników (Część 2 tego dokumentu).

---

### EKRAN 6: Cykle odszraniania (defrost)
*(scala dawne: 5.6 + 1.14 + 6.8 — trzy dawne funkcje opisujące ten sam temat w trzech różnych rozdziałach źródłowych, teraz jeden ekran — Wzorzec D)*

**A:** temperatura zewnętrzna, wilgotność powietrza, model pompy ciepła.
**B:** poniżej pewnej temperatury (typowo 5-7°C przy wysokiej wilgotności) na parowniku osadza się szron, wymagający okresowego odszraniania — pompa chwilowo pracuje "na chłodzenie", żeby stopić szron, co zwiększa realne zużycie prądu ponad wartość wynikającą z samego COP.
**C:** *"W dzisiejszych warunkach (2°C, 90% wilgotności) spodziewaj się defrostu co ok. 45 minut, każdy trwający 5 minut — to dodatkowe ok. 8% zużycia prądu ponad wartość bazową."*
**D:** *"To jak rozmrażanie zamrażarki — pompa ciepła od czasu do czasu musi 'oczyścić się' z szronu, żeby dalej efektywnie pracować, i to też kosztuje energię."*

---

### EKRAN 7: Mostki termiczne
*(dawne 5.7 — Wzorzec D)*

**A:** model 3D budynku z połączeniami ścian/stropów/dachu (auto z Modułu 1), materiały konstrukcyjne.
**B:** dla każdego mostka (narożniki, styk dachu ze ścianą, płyty balkonowe, ościeża) liczony współczynnik liniowy Ψ i straty W/m.
**C:** *"Twoje mostki termiczne to 12% całkowitych strat ciepła. Zastosowanie izolacji ościeży zmniejszy je o 4%."*
🟡 *"Niezaizolowane nadproże nad oknem to stały wyciek ciepła."*
**D:** *"To jak dziura w swetrze — nawet jak reszta jest ciepła, przez dziurę ucieka mnóstwo energii, nieproporcjonalnie do jej wielkości."*

---

### EKRAN 8: Pojemność cieplna budynku (bezwładność)
*(scala dawne: 5.8 + 6.11 — ten sam temat opisany w Rozdziale 5 i 6 źródła — Wzorzec D)*

**A:** materiały konstrukcyjne i grubości warstw (auto z Modułu 1), objętość pomieszczeń.
**B:** całkowita pojemność cieplna budynku (kWh/K) — ciężkie materiały (beton, cegła) akumulują ciepło i oddają je powoli; lekkie (drewno, gips) szybko się nagrzewają i stygną. Model symuluje reakcję budynku na zmiany temperatury zewnętrznej i pracę ogrzewania — to samo obliczenie odpowiada też na pytanie "ile czasu do zamarznięcia instalacji przy awarii ogrzewania" (dawne 6.11, kontekst stress-testu zimowego).
**C:** *"Twoja bezwładność cieplna to 18 kWh/K. Budynek wolno się wychładza — po wyłączeniu ogrzewania temperatura spadnie o 1°C w 4 godziny."*
🟡 *"Przy dużej bezwładności ogrzewanie podłogowe sprawdzi się lepiej niż grzejniki."*
**D:** *"Ciężki dom to jak piec kaflowy — długo się nagrzewa, ale długo trzyma ciepło. To ta sama liczba, która mówi, ile czasu masz w razie awarii ogrzewania, zanim zacznie robić się naprawdę zimno."*

---

### EKRAN 9: Straty przez wentylację grawitacyjną
*(dawne 5.9 — Wzorzec D)*

**A:** szczelność budynku, liczba kominów, nieszczelności okien, dane klimatyczne (wiatr, temperatura).
**B:** szacunek liczby wymian powietrza na dobę i wynikających strat ciepła; porównanie z wentylacją mechaniczną z rekuperacją (Ekran 3).
**C:** *"Twoja wentylacja grawitacyjna generuje 8 wymian powietrza na dobę. To 15% całkowitych strat ciepła. Rekuperacja obniżyłaby to do 5%."*
🟡 *"Zbyt szczelny dom bez wentylacji mechanicznej to ryzyko pleśni."*
**D:** *"Ciepłe powietrze ucieka kominem samo z siebie — trzeba je powstrzymać, ale nie kosztem świeżego powietrza w domu."*

---

### EKRAN 10: Optymalizacja izolacji
*(dawne 5.10 — Wzorzec D)*

**A:** obecna/planowana izolacja (materiał, grubość), ceny materiałów (baza), zapotrzebowanie na ciepło (Ekran 1).
**B:** porównanie materiałów (wełna, styropian, piana PUR, celuloza) i grubości; opłacalność = koszt izolacji vs oszczędności w 10 lat, uwzględniając λ (przewodność) i R (opór cieplny).
**C:** *"Wełna 20 cm: koszt 5000 zł, oszczędność 300 kWh/rok. PUR 15 cm: koszt 6000 zł, oszczędność 320 kWh/rok. Najbardziej opłacalna: wełna 25 cm — koszt 1 zaoszczędzonej kWh to 0,20 zł."*
🟡 *"Przy zbyt grubej izolacji koszt dodatkowego centymetra przestaje się zwracać."*
**D:** *"Nie chodzi o to, żeby zaizolować jak najgrubiej, tylko żeby rozsądnie wydać pieniądze — jest punkt, po którym kolejny centymetr izolacji już się nie opłaca."*

---

### EKRAN 11: Okna i drzwi
*(dawne 5.11 — Wzorzec D)*

**A:** wymiary i orientacja okien/drzwi, typ (dwu/trzyszybowe), parametry U i g, dane nasłonecznienia (Moduł 1).
**B:** bilans strat (przez U) i zysków słonecznych (przez g) w skali roku, osobno dla każdej orientacji.
**C:** *"Okna południowe przynoszą 120 kWh zysków rocznie, ale okna północne tracą 200 kWh. Rozważ wymianę okien północnych na trzyszybowe."*
🔴 *"Okno o wysokim U i niskim g to dziura w ścianie — nie chroni ani nie daje zysków."*
**D:** *"Okno to jedyny element budynku, który może zarówno grzać (zyski słoneczne), jak i chłodzić (przewietrzanie) — trzeba je dobrać do konkretnej strony świata, nie stosować jednego typu wszędzie."*

---

### EKRAN 12: Infiltracja powietrza (test szczelności)
*(dawne 5.12 — Wzorzec D)*

**A:** wynik testu szczelności (blower door, jeśli wykonany) lub szacunek na podstawie typu konstrukcji.
**B:** ilość powietrza przez nieszczelności (m³/h, wymiany na godzinę) i wynikające straty ciepła.
**C:** *"Twoja infiltracja to 0,8 wymiany na godzinę. Uszczelnienie okien i drzwi obniży straty o 8%."*
🔴 *"Przy zbyt szczelnym domu konieczna jest wentylacja mechaniczna, inaczej grozi pleśń."*
**D:** *"Szpary w budynku to darmowa wentylacja, ale zimą płacisz za nią ciepłem — lepiej mieć kontrolowaną wymianę powietrza niż przypadkową."*

---

### EKRAN 13: Dystrybucja ciepła — wybór systemu
*(scala dawne: 5.13, 5.17, 5.18 — Wzorzec A, przełącznik trybu)*

Trzy warianty dystrybucji ciepła to warianty tego samego wyboru — jeden ekran z przełącznikiem.

**Tryb "Ogrzewanie podłogowe" (dawne 5.13 ogólnie + 5.17 szczegóły):**
A: plan pomieszczeń, typ podłogi, izolacja podłogi.
B: rozstaw pętli (15 cm salon / 10 cm łazienka), wymagana temperatura zasilania — im lepsza izolacja, tym niższa (30-35°C).
C: *"Przy ogrzewaniu podłogowym i zasilaniu 35°C Twoja pompa ciepła osiągnie COP 4,5, zamiast 3,2 przy grzejnikach 55°C — oszczędzasz 28% energii."*
🟡 *"Ogrzewanie podłogowe w domu o niskiej bezwładności może przegrzewać pomieszczenia" (cross-ref Ekran 8).*

**Tryb "Grzejniki niskotemperaturowe" (dawne 5.18):**
A: zapotrzebowanie na ciepło per pomieszczenie, dostępna powierzchnia montażowa.
B: dobór wielkości grzejnika tak, by przy niższej temperaturze zasilania (45/35/20°C zamiast 75/65/20°C) oddał wymaganą moc.
C: *"Pokój dzienny: standardowy grzejnik 2,5 kW przy 75°C vs niskotemperaturowy 4 kW przy 45°C. Wyższy koszt o 200 zł, ale oszczędność 15% energii i +12% COP pompy."*
🔴 *"Nie montuj zwykłych (wysokotemperaturowych) grzejników przy pompie ciepła — będą wymagać wysokiej temperatury zasilania i drastycznie obniżą COP."*

**Migawka wspólna:** *"To jak wybór butów — do biegania inne, do wspinaczki inne. Do pompy ciepła pasuje podłogówka albo duże grzejniki niskotemperaturowe, nie małe grzejniki 'na wysoką temperaturę'."*

---

### EKRAN 14: Bufor ciepła — dobór pojemności
*(dawne 5.14 — Wzorzec D)*

**A:** zapotrzebowanie na ciepło i profil dobowy (Moduł 2), typ źródła ciepła, moc pompy ciepła.
**B:** zalecana pojemność ok. 50 l na każdy kW mocy pompy; bufor pozwala magazynować ciepło z tańszej energii i oddawać później, unikać częstych startów/zatrzymań (co wydłuża żywotność sprężarki — cross-ref silnik 74 czynników, kategoria "bufor").
**C:** *"Dla Twojej pompy 8 kW zalecany bufor to 400 l. Z buforem pompa będzie pracować dłużej, ale rzadziej, co wydłuży jej życie."*
🟡 *"Za mały bufor to częste starty pompy i większe zużycie prądu."*
**D:** *"Bufor to termos dla ciepła — gromadzi je, gdy jest 'tanio' (słońce świeci), i oddaje, gdy jest 'drogo' (noc, chmury)."*

---

### EKRAN 15: Pompy cyrkulacyjne — dobór
*(dawne 5.15 — Wzorzec D)*

**A:** długość rur i opory hydrauliczne instalacji (auto z Ekranów 13, 17), profil pracy (ciągły/sterowany).
**B:** dobór wydajności (m³/h) i wysokości podnoszenia (m); porównanie poboru: pompy stałoobrotowe 100-150 W vs elektroniczne z PWM 5-50 W.
**C:** *"Twoja pompa obiegowa 25/60 pracująca 24/7 pobiera 45 W, czyli 1,08 kWh/dobę. Nowoczesna pompa elektroniczna z trybem adaptacyjnym pobierze 8 W i zużyje 0,19 kWh/dobę."*
**D:** *"W off-gridzie pompy cyrkulacyjne to cisi złodzieje energii — pracują 24/7 i łatwo je zlekceważyć, a różnica między starym a nowym modelem to realne kilowatogodziny dziennie."*

---

### EKRAN 16: Sterowanie strefowe
*(dawne 5.16 — Wzorzec D)*

**A:** podział budynku na strefy (auto z Modułu 1 + sposób użytkowania z Modułu 2), baza urządzeń sterujących.
**B:** dobór zaworów/siłowników per strefa; pobór energii siłowników i sterowników (1-5 W każdy) dolicza się do bilansu.
**C:** *"Sterowanie strefowe obniży zużycie energii o 18% w porównaniu do grzania całego domu jedną temperaturą."*
🟡 *"Zbyt duża liczba siłowników może podnieść zużycie prądu — zbilansuj zyski energetyczne z ogrzewania i koszt zasilania samych siłowników."*
**D:** *"Po co grzać puste pokoje? Sterowanie strefowe to jak oświetlenie tylko tam, gdzie akurat jesteś."*

---

### EKRAN 17: System C.W.U. — zasobnik i cyrkulacja
*(scala dawne: 5.19, 5.20, 5.21 — Wzorzec D)*

### Sekcja A
liczba domowników i profil zużycia wody (Moduł 2), pojemność i klasa izolacji zasobnika (erp A/B/C), temperatura otoczenia zasobnika, długość rur cyrkulacyjnych.

### Sekcja B — trzy aspekty tego samego systemu
1. **Zapotrzebowanie i dobór pojemności** (dawne 5.19): dobowe zapotrzebowanie na C.W.U., dobór pojemności (np. 200 l dla 4 osób).
2. **Straty postojowe** (dawne 5.20): przewodzenie przez izolację, mostki na przyłączach, straty przez dno/pokrywę — wg normy EN 12897.
3. **Cyrkulacja** (dawne 5.21): koszt utrzymania ciepłej wody w rurach (ciągła vs na żądanie vs czasowa).

### Sekcja C
*"Zasobnik 200 l o izolacji 0,8 W/K traci 1,2 kWh/dobę. Lepszy model 0,5 W/K straci 0,7 kWh/dobę — oszczędzasz 180 kWh rocznie."*
*"Cyrkulacja ciągła kosztuje 1,2 kWh/dobę. Cyrkulacja na żądanie z czujnikiem przepływu: tylko 0,3 kWh/dobę."*
🟡 *"Przechowywanie zasobnika w nieogrzewanym garażu podwaja straty postojowe."*

### Sekcja D
*"Bojler to termos — dobry trzyma ciepło, zły wypuszcza je do garażu. A cyrkulacja to luksus natychmiastowej ciepłej wody w kranie, który kosztuje energię non stop, jeśli nie jest sterowany rozsądnie."*

---

### EKRAN 18: Grzałki elektryczne do C.W.U.
*(dawne 5.22 — Wzorzec D)*

**A:** pojemność zasobnika (Ekran 17), dostępna moc elektryczna (Moduł 2), produkcja PV (Moduł 3, live).
**B:** czas grzania = `f(moc grzałki, ΔT, pojemność)`; planowanie pracy w godzinach szczytu PV.
**C:** *"Grzałka 2 kW zagrzeje 200 l od 10°C do 50°C w 4,6 h, zużywając 9,2 kWh. Przy produkcji PV 3 kW zajmie to tylko 3 h."*
🟡 *"Grzałka 2 kW to duże obciążenie — sprawdź, czy falownik ją udźwignie" (cross-ref Moduł 5, Ekran 7).*
**D:** *"Grzałka elektryczna to prosty i tani sposób na ciepłą wodę, ale bardzo 'głodny' — latem grzanie z nadwyżki PV jest praktycznie darmowe, zimą lepiej dogrzewać pompą ciepła, bo grzałka szybko wyczerpuje baterię."*

---

### EKRAN 19: Ochrona przed przegrzaniem latem (solar shading)
*(dawne 5.25 — Wzorzec D)*

**A:** orientacja i powierzchnia okien (Moduł 1), kąty padania słońca latem/zimą, dostępne typy osłon.
**B:** latem słońce operuje wysoko, zimą nisko — dobór osłony musi to rozróżniać (stała osłona pozioma blokuje wysokie letnie słońce, przepuszcza niskie zimowe).
**C:** *"Okna południowe bez osłon przyniosą w lipcu 8 kWh/dobę zysków (czyli przegrzania). Żaluzje zewnętrzne obniżą to do 2 kWh/dobę."*
🟡 *"Stały okap nad oknem chroni latem, ale zimą odbiera cenne darmowe zyski ciepła — rozważ osłonę ruchomą zamiast stałej."*
**D:** *"Słońce latem to wróg (przegrzanie), zimą przyjaciel (darmowe ogrzewanie) — dobra osłona musi to rozróżniać, a nie blokować słońce przez cały rok jednakowo."*

---

### EKRAN 20: Wentylacja naturalna vs mechaniczna — porównanie
*(dawne 5.26 — Wzorzec B)*

| Kryterium | Naturalna (grawitacyjna) | Mechaniczna z rekuperacją |
|---|---|---|
| Straty ciepła | 8 kWh/dobę | 3 kWh/dobę |
| Zużycie prądu | 0 kWh | 0,5 kWh/dobę (wentylatory) |
| Kontrola wilgotności | brak | tak |
| Koszt instalacji | niski | wyższy |

**C:** *"Mechaniczna z odzyskiem oszczędza 4,5 kWh/dobę, czyli ok. 1600 kWh rocznie. Zwraca się po ok. 6 latach."*
🟡 *"Wentylacja naturalna w nowym, szczelnym domu to prosta droga do pleśni" (cross-ref Ekran 12 — infiltracja).*
**D:** *"Oddychać trzeba, ale bez rekuperacji to oddychanie zimą słono kosztuje — pytanie nie brzmi 'czy wentylować', tylko 'jak zrobić to najtaniej'."*

---

## Część 2: Pozostałe funkcje pompy ciepła (dawne 5.27–5.100, 74 funkcje)

**Korekta względem wcześniejszego założenia:** przy pierwotnym audycie strukturalnym (przed napisaniem pełnej treści) założyłem na podstawie próbki 9 z 74 tytułów, że cały ten zakres to jeden powtarzalny wzorzec "wpływ czynnika X". Po sprawdzeniu **wszystkich 74 tytułów** okazało się to nieprawdą — tylko część zakresu ma tę strukturę. Poniżej poprawny, zweryfikowany podział.

### 2A: Alternatywne źródła ciepła (5.32–5.36, 5 funkcji) — Wzorzec B/D

**To w ogóle nie jest pompa ciepła** — to pięć różnych, samodzielnych źródeł/systemów ciepła, błędnie umieszczonych w oryginalnym dokumencie wewnątrz numeracji "pompa ciepła". Powinny być osobnym punktem wyboru na poziomie Ekranu 13 (dystrybucja ciepła), jako alternatywa dla pompy ciepła, nie jej dodatek.

| Funkcja | Temat | Kluczowe dane |
|---|---|---|
| 5.32 | Kominek z płaszczem wodnym | integruje się z buforem (Ekran 14) — kominek podgrzewa wodę w buforze, stamtąd ciepło rozchodzi się po domu |
| 5.33 | Kocioł elektryczny | sprawność 99%, ale zużywa 3-4× więcej prądu na kWh ciepła niż pompa (COP=1 vs COP=3-4) — realny **koszt** źródła awaryjnego/szczytowego, nie podstawowego |
| 5.34 | Grzejniki podczerwieni (IR) | grzeją powierzchnie i ludzi, nie powietrze — subiektywnie cieplej przy niższej temperaturze powietrza |
| 5.35 | Maty kapilarne | niska temperatura zasilania (25-35°C) — dobrze współpracują z pompą ciepła jako uzupełnienie, nie zamiennik |
| 5.36 | Magazyn PCM (materiały zmiennofazowe) | alternatywa/uzupełnienie bufora wodnego (Ekran 14) — magazynuje ciepło w cieple topnienia, nie w pojemności cieplnej wody |

**Rekomendowane potraktowanie:** jeden ekran porównawczy (Wzorzec B) "Alternatywne i uzupełniające źródła ciepła", z kartami dla każdej z 5 opcji, każda z linkiem do integracji z już istniejącymi ekranami (bufor, dystrybucja). Pełna oryginalna treść każdej z 5 funkcji jest zachowana w Biblii v2.0 i wymaga przepisania do formatu Doradcy przy pełnej implementacji — nie zrobiłem tego tutaj ze względu na czas, ale kategoryzacja jest poprawna i kompletna.

### 2B: Funkcje pompy ciepła pokrywające się z Częścią 1 (14 funkcji) — do złączenia, nie osobne ekrany

Te funkcje to głębsze/off-gridowe rozwinięcia tematów już opisanych w Ekranach 1-20 powyżej. Powinny wzbogacić treść tamtych ekranów (dodatkowe pola/akapity), a nie tworzyć nowe:

| Funkcja | Dokłada się do |
|---|---|
| 5.27 (dobór mocy) | Ekran 5 (COP/SCOP) |
| 5.28 (współpraca z buforem) | Ekran 14 (bufor) |
| 5.30 (praca w grzaniu wody) | Ekran 18 (grzałki CWU) / Ekran 2 |
| 5.40 (raport efektywności) | Ekran 1 (raport charakterystyki budynku) |
| 5.43 (COP/SCOP off-grid realny) | Ekran 5 |
| 5.54 (integracja GWC) | Ekran 4 (GWC) |
| 5.56 (strategia defrostu wg pogody) | Ekran 6 (defrost) |
| 5.57 (porównanie podłogowe/grzejnikowe SCOP) | Ekran 13 (dystrybucja) |
| 5.58 (zyski CWU przy nadwyżkach PV) | Ekran 18 |
| 5.65 (dobór przepływów/pomp) | Ekran 15 (pompy cyrkulacyjne) |
| 5.67 (bilans cieplny budynku) | Ekran 1/2 |
| 5.69 (wpływ temp. zasilania na zużycie) | Ekran 5 — *to w istocie kolejny przypadek wzorca "wpływ X", dokłada się do klastra 2D poniżej* |
| 5.70 (z buforem i bez bufora) | Ekran 14 |
| 5.71 (optymalizacja krzywej grzewczej) | Ekran 5 |
| 5.72 (zużycie pompy cyrkulacyjnej sezonowo) | Ekran 15 |

### 2C: Genuinie nowe, odrębne tematy off-gridowe (26 funkcji) — wymagają osobnych ekranów Doradcy

To jest rzeczywista luka do domknięcia w kolejnym przejściu — każda z tych funkcji opisuje realnie inny temat, nie wariant już napisanego ekranu ani prosty "wpływ czynnika". Trzy najbardziej safety-krytyczne rozpisuję w pełni poniżej jako wzór, resztę wypisuję z tematem do dopracowania:

**EKRAN dodatkowy — Ryzyko zamarznięcia dolnego źródła** *(dawne 5.46 — Wzorzec D)*
A: temperatura gruntu w najzimniejszym miesiącu (Moduł 1), głębokość kolektora (Ekran dodatkowy poniżej), stężenie glikolu/solanki, czas ciągłej pracy pompy.
B: dłuższa praca ciągła schładza grunt wokół kolektora — system liczy temperaturę czynnika roboczego w najgorszym scenariuszu (długi mróz + długa praca).
C: *"Przy −20°C i ciągłej pracy pompy temperatura solanki spadnie do −3°C. Zastosuj wyższe stężenie glikolu (30%) lub większy kolektor."*
🔴 temperatura czynnika roboczego zbliżająca się do punktu zamarzania — *"Zamarznięcie dolnego źródła to koniec pracy pompy i ryzyko uszkodzenia wymiennika."*
D: *"Grunt to bateria ciepła — jak za mocno i za długo z niej czerpiesz bez przerwy na regenerację, w końcu zamarza."*

**EKRAN dodatkowy — Ryzyko wyłączenia pompy przy niskim napięciu** *(dawne 5.63 — Wzorzec D)*
A: parametry napięciowe pompy ciepła (min. napięcie pracy), aktualne napięcie systemu off-grid (live, z Modułu 4).
B: przy rozładowanej baterii napięcie systemu spada — jeśli spadnie poniżej progu wymaganego przez pompę, ta się wyłączy w najgorszym możliwym momencie (mróz + rozładowana bateria).
C: *"Przy rozładowaniu baterii do 20% napięcie spadnie do 44V i pompa się wyłączy. Zastosuj stabilizator napięcia lub większą baterię."*
🔴 brak zabezpieczenia przed pracą pompy przy napięciu bliskim progu wyłączenia w krytycznym momencie (mróz).
D: *"Niskie napięcie to cichy zabójca pomp — nie zepsuje się od razu, po prostu przestanie działać dokładnie wtedy, gdy jest najbardziej potrzebna."*

**EKRAN dodatkowy — Hałas i wibracje** *(dawne 5.31 — Wzorzec D)*
A: poziom mocy akustycznej pompy (dB(A), z bazy komponentów), lokalizacja montażu (Moduł 1), odległość od okien sypialni/granicy działki, lokalne normy hałasu (np. 40 dB w nocy).
B: model rozprzestrzeniania hałasu z tłumieniem przez odległość, ekrany, odbicia.
C: *"Poziom hałasu przy sypialni wyniesie 45 dB(A) w nocy — to za dużo. Zastosuj obudowę akustyczną lub przenieś jednostkę. Wibroizolatory obniżą hałas o dodatkowe 5 dB."*
🟡 przekroczenie lokalnej normy hałasu nocnego.
D: *"Pompa ciepła to maszyna z wentylatorem i sprężarką — jak stoi pod oknem sypialni, nie da Ci spać, a sąsiad może złożyć skargę."*

**EKRAN dodatkowy — Wymiarowanie kolektora gruntowego** *(dawne 5.42 — Wzorzec A, przełącznik typu: poziomy/pionowy/spiralny)*
Kluczowe dane: poziomy — 60-120 m² kolektora na każde 10 kW mocy, głębokość 1,2-1,8 m; pionowy — ok. 1 m odwiertu na 50-70 W mocy, głębokość 50-100 m; spiralny — kompaktowy, gdy brak miejsca. *"Dla pompy 8 kW w gruncie gliniastym wilgotnym: 400 m² kolektora poziomego (4 pętle po 100 m) lub 1 odwiert 100 m."* 🔴 zbyt płytki kolektor poziomy = zamarza i traci wydajność.

**Pozostałe 22 funkcje wymagające dedykowanych ekranów (temat zidentyfikowany, pełna treść do napisania w kolejnym przejściu):** chłodzenie letnie pompy (5.29), sterowanie pogodowe/krzywa grzewcza zaawansowana (5.37), eco mode (5.38), porównanie kosztów źródeł ogrzewania (5.39, zbiera wyniki z 2A), odzysk ciepła ze ścieków — DWHR (5.41), tryb cichy nocny + limit mocy off-grid (5.44), priorytet ciepło vs prąd (5.45), free cooling z dolnego źródła (5.47), ogrzewanie basenu (5.48), jednoczesne grzanie i chłodzenie (5.49), serwis i diagnostyka off-grid (5.50), porównanie z klimatyzatorem (5.51), praca z ograniczoną mocą off-grid (5.52), przegrzanie latem/chłodzenie nocne (5.53), praca przy wysokiej wilgotności (5.55), taryfa nocna (5.59), ryzyko hałasu sąsiedzkiego (5.60, scala się z 5.31 powyżej), dobór do falownika hybrydowego (5.61), integracja PV-ready (5.62), modelowanie zużycia sezonowego (5.64), praca z agregatem (5.66), rekomendacje poprawy efektywności — Wzorzec G (5.68).

### 2D: Prawdziwy klaster "wpływ czynnika X na dobór mocy/COP" (29 funkcji: 5.73–5.100 + 5.69 z 2B) — Wzorzec D, jeden scalony silnik

To jest jedyna część, dla której pierwotne założenie "jeden wzorzec, jeden ekran z dropdownem" jest poprawne. Zasada wspólna i pięć w pełni rozpisanych przykładów poniżej — reszta zachowana w pełnej treści w Biblii v2.0.

**Uniwersalny szablon (identyczny dla wszystkich pozycji, różni się tylko treścią pól A/B/C):** Sekcja A — 1-3 pola specyficzne dla czynnika. Sekcja B — wzór łączący czynnik ze zmianą mocy/COP, unikalny per czynnik. Sekcja C — komunikat z konkretną liczbą. Sekcja D — unikalna migawka.

**Pięć w pełni rozpisanych przykładów (reprezentują różne kategorie):**

**Przykład 1 — czynnik budynkowy, auto-import z §12 (dawne 5.80, szczelność):**
A: wynik testu szczelności (auto z Ekranu 12). B: `moc_wymagana = f(wymiany_powietrza_na_h)`. C: *"Przy infiltracji 0,8 wym/h Twoja pompa musi pokryć dodatkowe 1,2 kW strat — bez uszczelnienia okien musisz dobrać pompę o 15% większą."* D: *"Nieszczelny budynek to pompa ciepła pracująca dla przeciągów, nie dla Ciebie."*

**Przykład 2 — czynnik sprzętowo-projektowy, ręczny (dawne 5.90, głębokość odwiertu):**
A: planowana głębokość odwiertu (m), typ gruntu (auto z Modułu 1). B: głębsze odwierty = wyższe, stabilniejsze COP, ale koszt rośnie liniowo. C: *"Odwiert 100 m: 20 000 zł, COP 4,2. Odwiert 120 m: 24 000 zł, COP 4,5 — dalej przyrost COP jest już marginalny względem kosztu."* D: *"Głębszy odwiert to lepsza temperatura źródła, ale koszt rośnie liniowo, a korzyść nie — jest punkt optymalny."*

**Przykład 3 — czynnik budynkowy, auto-import (dawne 5.75, mostki termiczne):**
A: udział strat przez mostki (auto z Ekranu 7). B: mostki podnoszą realne zapotrzebowanie ponad wartość liczoną z samych przegród płaskich. C: *"Twoje mostki termiczne (12% strat) podnoszą wymaganą moc pompy o 0,8 kW."* D: *"Pompę dobiera się do budynku z jego wadami, nie do budynku idealnego z podręcznika."*

**Przykład 4 — czynnik sprzętowy dot. trwałości (dawne 5.100, wielkość bufora vs starty sprężarki):**
A: wielkość bufora (Ekran 14), moc pompy. B: mały bufor = częste, krótkie cykle sprężarki, przyspieszone zużycie mechaniczne. C: *"Bez bufora: 20 startów sprężarki/dobę. Z buforem 400 l: 4 starty/dobę — 5× dłuższa żywotność."* D: *"Sprężarka zużywa się najbardziej przy starcie — bufor daje jej rzadziej 'nowy start'."*

**Przykład 5 — czynnik klimatyczny, auto-import (dawne 5.85, wiatr na jednostkę zewnętrzną):**
A: średnia prędkość wiatru, ekspozycja jednostki (auto z Modułu 1). B: wiatr zwiększa straty konwekcyjne jednostki zewnętrznej. C: *"Jednostka wystawiona na wiatr 25 km/h — realny COP niższy o ok. 4%. Rozważ osłonę wiatrową bez blokowania przepływu powietrza."* D: *"Wiatr 'kradnie' ciepło z jednostki zewnętrznej tak samo jak z Ciebie w mroźny dzień."*

**Pełna lista pozostałych 24 pozycji tego klastra** (zyski słoneczne 5.81, zyski bytowe 5.82, wysokość pomieszczeń 5.83, orientacja budynku 5.84, cieniowanie 5.86, rodzaj gruntu 5.87, wysokość n.p.m. 5.88, wilgotność gruntu 5.89, liczba odwiertów 5.91, rodzaj kolektora 5.92, temperatura dolnego źródła 5.93, prędkość przepływu 5.94, temperatura powrotu 5.95, wpływ defrostu na sezon 5.96, tryb cichy 5.97, ograniczenie mocy 5.98, stabilność temp. z buforem 5.99, izolacja rur 5.73, bezwładność budynku 5.74, wentylacja 5.76, okna 5.77, dach 5.78, podłoga 5.79, temp. zasilania/zużycie 5.69) — pełna oryginalna treść (Skąd/Jak/Efekt/Migawka) zachowana w Biblii v2.0, do wypełnienia wg szablonu powyżej.

## Podsumowanie modułu

**Część 1: 20 ekranów** z pełną nową treścią, pokrywających 26 pierwotnych funkcji.

**Część 2 (poprawiona po weryfikacji wszystkich 74 tytułów źródłowych):**
- **2A — 5 funkcji**, to inny sprzęt niż pompa ciepła (kominek, kocioł elektryczny, IR, maty kapilarne, PCM) → 1 ekran porównawczy, treść źródłowa zidentyfikowana, do pełnego napisania.
- **2B — 14 funkcji** dokłada się jako dodatkowa treść do już napisanych Ekranów 1-20 (nie tworzy nowych ekranów).
- **2C — 26 funkcji** to genuinie odrębne tematy off-gridowe wymagające własnych ekranów; 4 najbardziej safety-krytyczne (ryzyko zamarznięcia dolnego źródła, ryzyko wyłączenia przy niskim napięciu, hałas, wymiarowanie kolektora) rozpisane w pełni; pozostałe 22 zidentyfikowane z tematem, do napisania w kolejnym przejściu.
- **2D — 29 funkcji** to faktyczny, potwierdzony klaster "wpływ czynnika X" → 1 scalony silnik, opisany wzorcowo na 5 pełnych przykładach, pełna treść źródłowa wszystkich 29 zachowana w Biblii v2.0.

**Razem: 20 (Część 1) + ok. 6-7 nowych ekranów Części 2 (2A zbiorczo + 4 rozpisane w pełni z 2C + 1 scalony silnik 2D) + 22 ekrany do dopisania (2C) = ok. 28-29 ekranów docelowo**, z czego **wszystkie 100 pierwotnych funkcji Rozdziału 5 są zidentyfikowane, skategoryzowane i mają zachowaną pełną treść źródłową** — różnica względem wcześniej podanej liczby "21 ekranów" wynika z korekty błędnej kategoryzacji, nie z utraty treści.

**Twarde stopy zidentyfikowane w tym module:** montaż zwykłych (wysokotemperaturowych) grzejników przy pompie ciepła (Ekran 13), okno o jednocześnie wysokim U i niskim g (Ekran 11), zbyt szczelny budynek bez wentylacji mechanicznej (Ekran 12/20), zamarznięcie dolnego źródła przy zbyt długiej pracy ciągłej (2C, dawne 5.46), wyłączenie pompy przy niskim napięciu systemu w krytycznym momencie mrozu (2C, dawne 5.63), zbyt płytki kolektor poziomy (2C, dawne 5.42).

---

**Wersja:** 1.1 — korekta kategoryzacji Części 2 po weryfikacji wszystkich 74 tytułów źródłowych (etap 3)
**Data:** Sierpień 2026
**Status:** Część 1 (20 ekranów) w pełni gotowa. Część 2: 2A i większość 2C wymaga jeszcze pełnego napisania treści (temat i dane źródłowe już zidentyfikowane i poprawnie skategoryzowane); 2D ma gotowy szablon + 5 przykładów, reszta treści źródłowej w Biblii v2.0.
**Uwaga o korekcie:** wersja 1.0 tego dokumentu zawierała błędną, zbyt uproszczoną kategoryzację 74 funkcji jako jednego wzorca. Poprawiono po sprawdzeniu wszystkich 74 tytułów źródłowych zamiast próbki. To pokazuje, dlaczego pełna weryfikacja przed uznaniem czegoś za "gotowe" ma znaczenie.
**Powiązane dokumenty:** Biblia_Offgrid_v2_0_Architektura_Modulowa.md (KRYTYCZNE dla Części 2), Zasady_UX_Doradca_v2_1.md, Tresc_Modul_5_Okablowanie_Ekrany.md, Tresc_Modul_3_PV_Ekrany.md, Tresc_Modul_4_Baterie_Ekrany.md
