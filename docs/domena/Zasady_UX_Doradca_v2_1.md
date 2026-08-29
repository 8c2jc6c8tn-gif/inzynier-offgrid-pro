# Zasady projektowania ekranów — od kalkulatora do doradcy

**Dokument nadrzędny wobec:** Biblia Off-Grid PV v2.0 (Architektura Modułowa)
**Cel:** Zanim przepiszemy 579 funkcji na nowo, ustalamy JEDEN spójny standard interakcji, żeby nie robić tego dwa razy.
**Status:** v1.0 — do zatwierdzenia przed rozpoczęciem pełnego przepisania

---

## 1. Zasada nadrzędna

Aplikacja nie jest encyklopedią. Ekran, który dotyczy decyzji inżynierskiej (dobór, kompatybilność, konfiguracja), nie może kończyć się na "oto wzór i wynik". Musi:

1. **Przyjąć realny sprzęt użytkownika** jako dane wejściowe (nie generyczne przykłady)
2. **Ocenić wybór względem granic bezpieczeństwa tego konkretnego sprzętu**
3. **Wydać jednoznaczny werdykt** (nie zostawiać usera z samą liczbą do interpretacji)
4. **Wytłumaczyć DLACZEGO** — fizyczny mechanizm, nie tylko "przekroczono limit"
5. **Twardo ostrzec**, gdy opcja grozi uszkodzeniem sprzętu, pożarem lub utratą gwarancji

To jest różnica między "Wikipedią" a "doradcą" — Wikipedia opisuje zjawisko, doradca mówi: *rób tak, nie rób tamtego, a jeśli już to zrobiłeś — oto konsekwencje.*

---

## 2. Cztery wzorce ekranów — kiedy który

**Uwaga:** poniższe cztery wzorce to punkt startowy, nie zamknięta lista. Jeśli funkcja lub klaster funkcji nie pasuje dobrze do żadnego z nich, tworzymy nowy wzorzec dedykowany dla tego przypadku, zamiast naciągać treść pod istniejący schemat. Naciąganie na siłę pogarsza UX bardziej niż dodanie piątego/szóstego wzorca. Nowe wzorce dopisujemy do tej sekcji w miarę ich powstawania podczas audytu (etap 2).

| Wzorzec | Kiedy stosować | Przykład z PV |
|---|---|---|
| **A. Przełącznik trybu** | Opcje wzajemnie się wykluczają i są matematycznie równoważne (ten sam typ danych wejścia/wyjścia, inny wzór) | Szereg / równolegle / mieszany — czyste przeliczenie |
| **B. Karty porównawcze** | User wybiera PRODUKT lub TECHNOLOGIĘ z opisową charakterystyką, niekoniecznie własny sprzęt na wejściu | Porównanie PERC vs TOPCon vs HJT |
| **C. Akordeon** | Tematy uzupełniają się, nie wykluczają — user może chcieć przeczytać wszystkie | Kąt nachylenia + śnieg + harmonogram czyszczenia |
| **E. Checklist weryfikacyjna** *(nowy, z audytu Modułu 5)* | Kroki instalacyjne/odbiorcze do potwierdzenia, opcjonalnie z wynikiem pomiaru porównanym do progu — nie kalkulacja, tylko sekwencja "zrób i potwierdź" | Pomiary powykonawcze (ciągłość, izolacja, rezystancja uziemienia); oznakowanie obwodów; kontrola momentów dokręcenia |
| **F. Przewodnik z ilustracją** *(nowy, z audytu Modułu 5)* | Zasada przestrzenna/fizyczna, do której się zagląda podczas montażu — nie ma pól do wpisania, jest rysunek + reguła | Separacja kabli silno- i słaboprądowych (EMC); trasy kablowe i odstępy; przepust powietrza pod panelami |
| **G. Raport / Podsumowanie** *(nowy, z audytu Modułu 3)* | Ekran tylko do odczytu, prezentujący zagregowany wynik (np. roczny), bez pól wyboru czy werdyktu — koniec ścieżki decyzyjnej, nie jej część | Roczny uzysk z uwzględnieniem technologii paneli (podsumowanie projektu) |
| **H. Katalog komponentów** *(nowy, z audytu Modułu 9)* | User dodaje dowolną liczbę niewykluczających się elementów z listy (nie wybiera JEDNEGO wariantu jak w A) — każdy dodany element konfiguruje się osobno | Katalog czujników ESP32 (można dodać 5 czujników temperatury naraz); katalog aktuatorów; katalog protokołów komunikacji |
| **H. Katalog komponentów** *(nowy, z audytu Modułu 9)* | User dodaje dowolną liczbę niewykluczających się elementów z listy (nie wybiera JEDNEGO wariantu jak w A) — każdy dodany element konfiguruje się osobno | Katalog czujników ESP32 (można dodać 5 czujników temperatury naraz); katalog aktuatorów; katalog protokołów komunikacji |

**Zasada pierwszeństwa:** jeśli funkcja kwalifikuje się do wzorca D (patrz sekcja 4), **zawsze wygrywa** nad A/B/C — nawet jeśli technicznie pasowałaby też do przełącznika trybu. Bezpieczeństwo > wygoda przełącznika.

---

## 3. Obowiązkowy szablon ekranu typu "Doradca"

Każdy ekran tego typu ma cztery sekcje w tej kolejności:

### Sekcja A — Twój sprzęt
Pola do wpisania realnych parametrów (nie placeholder w stylu "np. 40V" — prawdziwe dane z karty katalogowej urządzenia usera). Wartości domyślne mogą być podpowiedzią, ale liczą się na żywo od pierwszego inputu.

### Sekcja B — Silnik oceny
Dla każdej rozważanej opcji:
- **Wartości robocze I ekstremalne** — nie tylko STC (25°C, pełne słońce), ale też scenariusz brzegowy (mróz -10/-20°C dla napięcia, pełne słońce dla prądu, zwarcie dla zabezpieczeń)
- **Werdykt trójstopniowy:**
  - 🟢 **Zalecane** — mieści się bezpiecznie, z marginesem
  - 🟡 **Dopuszczalne, ale gorsze** — działa, ale blisko limitu albo nieoptymalne
  - 🔴 **Zabronione — ryzyko uszkodzenia** — przekracza granicę bezpieczeństwa sprzętu
- **Uzasadnienie fizyczne** — jedno zdanie, konkretna przyczyna (nie "błąd walidacji", tylo np. "napięcie przy mrozie przekroczy limit wejścia DC")

### Sekcja C — Rekomendacja
Wyróżniona wizualnie najlepsza opcja spośród ocenionych na 🟢, z krótkim podsumowaniem dlaczego właśnie ta.

### Sekcja D — Migawka edukacyjna
Zachowana z v1.5 zasada `[i]` — krótkie "o co chodzi" tłumaczenie zjawiska fizycznego stojącego za oceną (np. dlaczego napięcie rośnie na mrozie). To jest miejsce na edukację, nie na powtórzenie werdyktu.

---

## 4. Kryteria kwalifikacji — kiedy funkcja MUSI być Doradcą

Funkcja kwalifikuje się do wzorca D, jeśli odpowiedź na **którekolwiek** z poniższych pytań brzmi "tak":

- [ ] Czy dotyczy doboru jednego komponentu do parametrów innego komponentu? (np. bezpiecznik do prądu, kabel do długości i obciążenia, BMS do konfiguracji ogniw)
- [ ] Czy błędny wybór może fizycznie uszkodzić sprzęt, spowodować pożar lub porażenie?
- [ ] Czy błędny wybór unieważnia gwarancję producenta?
- [ ] Czy istnieją jasne, liczbowe granice bezpieczeństwa (napięcie max, prąd max, temperatura, przekrój)?
- [ ] Czy funkcja ma w tytule słowa: *dobór, kompatybilność, zabezpieczenie, ochrona, koordynacja, limit, ryzyko*?

Jeśli **żadne** z powyższych nie zachodzi, a funkcja tylko wyjaśnia zjawisko lub pokazuje dane — wystarczy wzorzec B lub C.

---

## 5. Wykaz kandydatów do wzorca "Doradca" — audyt całego dokumentu v1.5

Przeskanowałem tytuły wszystkich 579 funkcji pod kątem słów kluczowych z sekcji 4. Wynik: **79 funkcji** w 8 rozdziałach kwalifikuje się wprost. To jest lista robocza do etapu 2 (pełne przepisanie).


### Instalacja PV (Kafel 3) — 8 kandydatów

- 2.24: Dobór liczby paneli do konkretnego falownika (model, parametry)
- 2.26: Ryzyko przewymiarowania i niedowymiarowania – skutki
- 2.27: Dopasowanie napięcia i prądu stringów do wejść MPPT falownika
- 2.32: Straty niedopasowania (mismatch) – łączenie paneli o różnej mocy
- 2.37: Analiza wydajności MPPT – dopasowanie napięcia stringu do zakresu pracy falownika
- 2.38: Ochrona stringów – dobór bezpieczników i diod blokujących
- 2.45: Dobór paneli do warunków nadmorskich i pylistych (odporność na korozję, PID)
- 2.47: Zabezpieczenie przeciwprzepięciowe stringów PV – koordynacja z SPD

### Baterie (Kafel 4) — 6 kandydatów

- 3.1: Dobór pojemności baterii
- 3.5: Grzałki BMS i ochrona przed mrozem (szczegóły)
- 3.9: Detekcja Zwarcia i Zabezpieczenia Półprzewodnikowe (e-Fuse)
- 3.11: Ochrona przed wilgocią i kondensacją
- 3.27: Dobór bezpiecznika DC (AIC / Class T / NH)
- 3.32: Detekcja doziemienia i ochrona (Ground Fault & IMD)

### Okablowanie (Kafel 5) — 18 kandydatów

- 4.1: Dobór przekrojów przewodów DC i AC
- 4.2: Dobór bezpieczników i rozłączników
- 4.3: Dobór mocy falownika
- 4.5: Dobór ochronników przeciwprzepięciowych (SPD DC i AC)
- 4.6: Strefowa koncepcja ochrony (LPZ 0–3)
- 4.7: Koordynacja SPD z istniejącą instalacją odgromową
- 4.10: Uziemienie funkcjonalne vs. ochronne
- 4.12: Selektywność zabezpieczeń (koordynacja czasowo-prądowa)
- 4.13: Dobór wyłączników nadprądowych DC (MCB, MCCB)
- 4.14: Zabezpieczenie przed odwrotną polaryzacją
- 4.15: Dobór wyłączników różnicowoprądowych (RCD)
- 4.16: Ochrona przed dotykiem bezpośrednim i pośrednim
- 4.19: Dobór szyn zbiorczych i listew rozdzielczych
- 4.21: Złącza MC4, rozgałęźniki i przejściówki – dobór, kompatybilność i montaż
- 4.24: Zabezpieczenia termiczne szyn i połączeń
- 4.32: Ochrona przed gryzoniami i uszkodzeniami mechanicznymi
- 4.38: Dobór izolacji i powłok kabli do warunków montażu (ziemia, UV, napowietrzne, ukryte)
- 4.39: Ochrona przed korozją galwaniczną i podkładki bimetaliczne

### Ogrzewanie/pompa ciepła (Kafel 6) — 23 kandydatów

- 5.13: Dystrybucja ciepła – ogrzewanie podłogowe, grzejniki, dobór
- 5.14: Bufor ciepła – dobór pojemności
- 5.15: Pompy cyrkulacyjne – dobór i zużycie energii
- 5.18: Grzejniki niskotemperaturowe – dobór i analiza
- 5.22: Dobór grzałek elektrycznych do C.W.U.
- 5.25: Ochrona przed przegrzaniem latem (solar shading)
- 5.27: Pompa ciepła – dobór mocy do budynku
- 5.33: Kocioł elektryczny – dobór i sprawność
- 5.61: Pompa ciepła – dobór urządzenia do pracy z falownikiem hybrydowym
- 5.65: Pompa ciepła – dobór przepływów i pomp obiegowych
- 5.75: Pompa ciepła – analiza wpływu mostków termicznych na dobór mocy
- 5.77: Pompa ciepła – analiza wpływu okien na dobór mocy
- 5.78: Pompa ciepła – analiza wpływu izolacji dachu na dobór mocy
- 5.79: Pompa ciepła – analiza wpływu izolacji podłogi na dobór mocy
- 5.80: Pompa ciepła – analiza wpływu szczelności budynku na dobór mocy
- 5.81: Pompa ciepła – analiza zysków słonecznych i ich wpływ na dobór mocy
- 5.82: Pompa ciepła – analiza zysków bytowych i ich wpływ na dobór mocy
- 5.83: Pompa ciepła – analiza wpływu wysokości pomieszczeń na dobór mocy
- 5.84: Pompa ciepła – analiza wpływu orientacji budynku na dobór mocy
- 5.85: Pompa ciepła – analiza wpływu wiatru na dobór mocy
- 5.86: Pompa ciepła – analiza wpływu cieniowania na dobór mocy
- 5.87: Pompa ciepła – analiza wpływu rodzaju gruntu na dobór mocy
- 5.88: Pompa ciepła – analiza wpływu wysokości nad poziomem morza na dobór mocy

### Tryb Live (Kafel 13) — 1 kandydatów

- 7.42: Monitorowanie stanu zabezpieczeń i bezpieczników

### Kalkulator mobilny (Kafel 12) — 15 kandydatów

- 8.1: Tryb uproszczony – dobór akumulatora i odbiorników
- 8.2: Algorytm bezpieczeństwa – przewody, bezpieczniki, napięcie
- 8.6: Szybki dobór paneli PV dla pojedynczego urządzenia
- 8.8: Dobór regulatora ładowania PWM vs MPPT do małej instalacji
- 8.9: Dobór przetwornicy / ładowarki USB (12V na 5V, 24V na 12V)
- 8.10: Zabezpieczenia i bezpieczniki dla małych instalacji 12V/24V
- 8.11: Ochrona przed rozładowaniem akumulatora (dozownik napięcia)
- 8.13: Przewody i bezpieczniki do samochodu / kampera
- 8.37: Dobór akumulatora do kampera (AGM vs LiFePO4)
- 8.38: Dobór panelu do kampera (elastyczny vs sztywny)
- 8.41: Przetwornica 12V na 230V – dobór mocy
- 8.46: Zabezpieczenia przeciwwilgociowe dla małych instalacji
- 8.49: Dobór kabli i złączek do małej instalacji
- 8.55: Zabezpieczenie akumulatora przed zimnem w małej instalacji
- 8.64: Urządzenia zabronione/ryzykowne dla małych falowników

### Montaż LiFePO4 (Kafel 11) — 1 kandydatów

- 9.10: Montaż mechaniczny – separacja ogniw i zabezpieczenie krawędzi

### Montaż kwasowe (Kafel 11) — 3 kandydatów

- 10.5: Dobór kabli, bezpieczników i zabezpieczeń
- 10.9: Bezpieczeństwo pracy z kwasem – środki ochrony i neutralizacja
- 10.15: Zabezpieczanie rozłączonego zestawu przed zwarciem

### ESP32 (Kafel 9) — 3 kandydatów

- 11.26: Moduł e-Fuse / zabezpieczenie nadprądowe
- 11.35: Ochrona przepięciowa linii sygnałowych
- 11.45: Czujnik prądu upływu / detekcja różnicowa (ochrona RCD)

### AI (Kafel 10) — 1 kandydatów

- 12.7: Automatyczny dobór źródeł zasilania (PV / bateria / agregat / sieć)


**Uwaga:** to jest lista z samych tytułów — pewnie po przejrzeniu treści dojdą kolejne funkcje, które nie mają tych słów w tytule, ale kwalifikują się po treści (np. dobór kąta nachylenia, dobór lokalizacji czujnika). Lista wyjściowa do dalszej weryfikacji, nie ostateczna.

---

## 6. Twarde stopy (hard stops) — zasady wspólne dla całej aplikacji

Niezależnie od modułu, poniższe warunki ZAWSZE muszą skutkować werdyktem 🔴 Zabronione:

- Napięcie stringu PV przy najniższej spodziewanej temperaturze przekracza max. napięcie DC falownika
- Prąd wejściowy MPPT/regulatora przekracza jego wartość znamionową
- Napięcie nominalne BMS/baterii nie odpowiada konfiguracji szeregowej ogniw
- Przekrój kabla poniżej wymaganego dla danego prądu ciągłego i długości trasy (przegrzanie/pożar)
- Brak zabezpieczenia nadprądowego tam, gdzie norma tego wymaga
- Mieszanie ogniw/baterii o różnej chemii lub różnym stanie zużycia w jednym obwodzie równoległym bez izolacji
- Przekroczenie maksymalnego prądu wyładowania/ładowania deklarowanego przez producenta ogniwa

Ta lista będzie rosła w miarę przepisywania kolejnych modułów — każdy moduł dorzuci swoje specyficzne twarde stopy (np. moduł 6 doda limity dla pompy ciepła, moduł 4 — dla instalacji elektrycznej).

---

## 7. Jak to się ma do Biblii v2.0

Ten dokument **nie zastępuje** struktury 14 kafli z v2.0 — on definiuje, **jak ma wyglądać zawartość w środku** każdego kafla, tam gdzie funkcja tego wymaga. Etap 2 (pełne przepisanie) będzie polegał na przejściu przez wszystkie 579 funkcji z checklistą z sekcji 4 i nadaniu każdej jednego z czterech wzorców (A/B/C/D), a następnie zaimplementowaniu D dokładnie wg szablonu z sekcji 3.

**Kolejność prac (proponowana):**
1. Zatwierdzenie tego dokumentu (jesteś tu)
2. Pełny audyt treści (nie tylko tytułów) — potwierdzenie/rozszerzenie listy 79 kandydatów
3. Przepisanie modułów w kolejności priorytetu bezpieczeństwa: Okablowanie (5) → PV (3) → Baterie (4) → Ogrzewanie (6) → reszta

---

## 8. Podpowiedzi przy polach (poziom drobniejszy niż Migawka)

Migawka `[i]` z v1.5 tłumaczy **całą funkcję**. To za mało dla pojedynczych oznaczeń w polach input — user może rozumieć cel ekranu, ale nie wiedzieć co wpisać w pole "Vmp".

**Zasada:** każde pole liczbowe na ekranie typu Doradca (i docelowo wszędzie, gdzie pojawia się skrót/jednostka) ma mały znak `?` obok etykiety. Kliknięcie/tap pokazuje popover z:
- pełną nazwą (Vmp = napięcie w punkcie mocy maksymalnej)
- jednym zdaniem "do czego służy"
- gdzie to znaleźć (np. "na naklejce z tyłu panelu" / "w karcie katalogowej falownika, sekcja dane wejściowe DC")
- typowym zakresem wartości (pomaga wyłapać literówkę: "typowo 30–42 V dla panelu 400 W")

**Różnica względem Migawki:** Migawka wyjaśnia zjawisko fizyczne (sekcja D szablonu). Podpowiedź przy polu wyjaśnia **oznaczenie**. Obie mogą występować na tym samym ekranie i się uzupełniać, nie dublują się.

**Glosariusz zbiorczy:** wszystkie te wyjaśnienia trafiają też do jednego przeszukiwalnego słownika w Kaflu 14 (Ustawienia/Pomoc) — użytkownik może przejrzeć wszystkie skróty naraz (V, A, Voc, Vmp, Isc, Imp, COP, SoC, DoD, BMS, MPPT...), a nie tylko natrafiać na nie punktowo.

---

## 9. Nawigacja między ekranami

Skoro odchodzimy od "wszystko w jednym oknie" na rzecz wielu osobnych ekranów (przełącznik trybu, doradca, katalogi z sekcji o scaleniach), potrzebna jest spójna nawigacja:

- **Przycisk Wstecz** — zawsze w tym samym miejscu (góra ekranu), wraca do poprzedniego ekranu z zachowanym stanem (wpisane dane nie znikają, jeśli user cofnie się przez pomyłkę).
- **Okruszki (breadcrumb)** — mała ścieżka na górze typu `Kafel 3 › PV › Konfigurator stringów`, żeby user zawsze wiedział, gdzie jest w strukturze 14 kafli. Ważne przy scaleniach — łatwo się zgubić, gdy jeden ekran kryje 74 dawne funkcje.
- **Brak "ślepych zaułków"** — z każdego ekranu Doradcy powinno dać się przejść bezpośrednio do powiązanej funkcji (pole "Powiązania" z zasady nr 3) bez konieczności cofania się do pulpitu.

---

## 10. Profil sprzętu — zapamiętaj i wykorzystaj wszędzie

To jest chyba najważniejszy dodatek. Zamiast wpisywać Voc/Vmp/Isc panelu od nowa na każdym ekranie Doradcy, które go dotyczą (a takich będzie sporo — PV, okablowanie, MPPT, mismatch...):

- **Kafel 14 (Ustawienia) dostaje nową sekcję: "Mój sprzęt"** — jednorazowo wpisane parametry panelu, falownika/MPPT, baterii/BMS, generatora.
- Każdy ekran Doradcy **domyślnie wypełnia się danymi z profilu**, z możliwością nadpisania "co by było gdyby" bez zapisywania zmiany na stałe.
- **Wiele profili/wariantów** — jeśli user projektuje dwa różne warianty instalacji (np. "wersja budżetowa" vs "wersja premium"), powinien móc zapisać oba i przełączać się między nimi, zamiast nadpisywać jeden.
- **Ostrzeżenie przy wyjściu z niezapisanymi zmianami** — jeśli user zmienił coś na ekranie względem zapisanego profilu i próbuje wyjść, krótkie pytanie "zapisać te zmiany w profilu sprzętu?" (tak/nie/anuluj), żeby nie zgubić pracy przez przypadek.

To zamienia doradcę z "kalkulatora, który za każdym razem pyta od nowa" w system, który **zna Twoją instalację** i konsekwentnie się do niej odnosi na każdym ekranie.

---

## 11. Dodatkowe pomysły do rozważenia

Kilka rzeczy, które pasują do ducha "aplikacja dokształcająca, nie encyklopedia" — do przedyskutowania, nie od razu do wdrożenia:

- **Podpowiedzi sanity-check w locie** — gdy user wpisuje wartość mocno odstającą od typowej (np. Voc = 900 V dla pojedynczego panelu), pole podświetla się na żółto z komentarzem "to nietypowo wysoka wartość — sprawdź, czy nie pomyliłeś jednostek", zanim jeszcze dojdzie do właściwej oceny Doradcy. Uczy user na bieżąco, że coś jest nie tak, zamiast dopiero na końcu.
- **Historia decyzji** — log tego, co user skonfigurował i jaki werdykt dostał, dostępny z Kafla 14. Przydatne przy dużych projektach rozłożonych na wiele sesji — "co ja tu ostatnio ustaliłem?".
- **Porównanie scenariuszy A/B** — możliwość zapisania dwóch konfiguracji obok siebie i zestawienia werdyktów (np. "z falownikiem X" vs "z falownikiem Y"), przydatne przy zakupach.
- **Odznaczanie "już to rozumiem" (opcjonalne, kosmetyczne)** — *korekta względem wersji 1.0:* skoro podpowiedź pokazuje się dopiero po kliknięciu `?`, nie ma efektu irytowania — nic nie wyskakuje samo. Jedyny realny argument za tą funkcją to estetyka (mniej ikonek `?` na gęstym ekranie dla zaawansowanego usera), nie komfort. Niska priorytetowo — do rozważenia na końcu, nie kluczowe dla etapu 2.

---

## 12. Źródło danych o budynku — import z innej aplikacji vs ręczne dodanie

Dane o budynku (przegrody, U, orientacja, szczelność) mają domyślnie pochodzić z **Kalkulatora Inżyniera Pro** (nazwa robocza, do zmiany) — użytkownik nie wpisuje tego od zera w Off-Grid Pro, tylko system importuje istniejący budynek.

**Dwie ścieżki:**

1. **Import (domyślna)** — użytkownik wybiera swój budynek z listy zsynchronizowanej z drugą apką. Wszystkie parametry przegród (ściany, dach, podłoga, okna — każde z własnym U i g), mostki termiczne, wynik testu szczelności, orientacja, wysokość pomieszczeń, bezwładność cieplna — wchodzą automatycznie.
2. **Dodaj budynek ręcznie** — dla kogoś, kto chce policzyć instalację dla budynku spoza naszego ekosystemu (np. dom sąsiada, budynek klienta, projekt na sprzedaż). Potrzebny osobny kreator "Dodaj budynek", który zbiera dokładnie te same pola co import — inaczej dalsze ekrany (silnik pompy ciepła, stress-test zimowy) nie będą miały skąd wziąć danych.

**Zasada projektowa:** obie ścieżki muszą karmić **ten sam model danych**. Ekran Doradcy w module 6 nie powinien wiedzieć ani go nie obchodzić, czy dane przyszły z importu czy z ręcznego kreatora — ale **musi to pokazać userowi** (mała etykieta źródła przy sekcji A: "Dane z Kalkulatora Inżyniera Pro, zaktualizowane 12.08.2026" albo "Dane wpisane ręcznie"), żeby user wiedział, co jest aktualne i skąd biorą się liczby, które ocenia Doradca.

**Synchronizacja:** jeśli budynek w drugiej apce się zmieni (np. user dołoży ocieplenie), Off-Grid Pro powinien to wykryć i zaproponować odświeżenie zaimportowanych danych, a nie cicho pracować na nieaktualnych wartościach.

**Funkcje z v1.5 dotknięte tą zmianą** — przeskanowałem dokument pod kątem zależności od danych budynkowych (U, izolacja, przegrody, orientacja, szczelność, bryła): **23 funkcje**, skoncentrowane głównie w Module 6 (silnik analiz pompy ciepła):

- 0.4 Bryła budynku i orientacja ścian
- 5.1 Charakterystyka termiczna budynku
- 5.7 Mostki termiczne – analiza i eliminacja
- 5.8 Pojemność cieplna budynku (bezwładność)
- 5.10 Optymalizacja izolacji
- 5.11 Okna i drzwi – U, g, zyski słoneczne
- 5.12 Infiltracja powietrza – test szczelności
- 5.40 Raport efektywności cieplnej budynku
- 5.67 Bilans cieplny i energetyczny budynku
- 5.73–5.75, 5.77–5.80, 5.83–5.84, 5.88 — czynniki "wpływu X na dobór mocy pompy ciepła" (część klastra 74 funkcji już scalonego w Module 6)
- 6.11 Bezwładność cieplna budynku (czas do zamarznięcia)
- 6.16 Obciążenie grzałek dachowych/rynnowych
- 6.17 Test sztywnienia izolacji w niskich temperaturach
- 6.34 Obciążenie dachu śniegiem/lodem

**Praktyczna konsekwencja dla Modułu 6:** skoro większość z 74 "czynników wpływu" w silniku pompy ciepła to właśnie parametry przegród budynku, po wdrożeniu importu te ekrany zmieniają charakter — z "wpisz swoje dane" na "oto zaimportowane dane, zobacz jaki mają wpływ", co jest szybsze i mniej podatne na błędy usera przy przepisywaniu wartości U ze świadectwa energetycznego.

---

## 13. Dalsze funkcje do wdrożenia

Zestaw dodatkowych funkcji zgłoszonych do wdrożenia razem z etapem 2, nie jako osobny "backlog na później".

### 13.1 Dokumentacja i eksport

**Automatyczna lista zakupów (BOM)** — każda decyzja podjęta na ekranie Doradcy (wybrany falownik, bezpiecznik, przekrój kabla, model baterii) trafia do zbiorczej listy zakupów z ilościami i specyfikacją. Dostępna z Kafla 14, eksportowalna. Zasila się automatycznie z tych samych danych, które ocenia Doradca — nie osobny formularz do wypełnienia.

**Eksport projektu do PDF** — gotowy raport (schemat instalacji, zestawienie doborów, uzasadnienia z sekcji B/C szablonu Doradcy) do pokazania instalatorowi, elektrykowi lub jako załącznik do wniosku o dotację. Ma sens jako "wspólny język" z osobami, które appki nie mają.

### 13.2 Praca w terenie (montaż)

**Tryb offline dla checklist montażowych** — Moduł 11 (montaż baterii) i checklisty instalacyjne muszą działać bez internetu — user będzie w garażu, na dachu, w piwnicy, nie zawsze z zasięgiem. Dane zapisują się lokalnie i synchronizują, gdy połączenie wróci.

**Dokumentacja fotograficzna kroków montażu** — możliwość dołączenia zdjęcia przy każdym checkboxie w kreatorze montażu (Moduł 11). Przydatne do gwarancji, ubezpieczenia i jako własna dokumentacja "co dokładnie zrobiłem" na przyszłość.

### 13.3 Pętla zwrotna po montażu

**Porównanie projektu z rzeczywistością** — dane z czujników ESP32 (Moduł 9) zestawione z założeniami projektowymi (Moduł 2 zapotrzebowanie, Moduł 3 produkcja PV): np. *"zakładałeś 4000 kWh/rok, realnie masz 3600 kWh — oto możliwe przyczyny"*. Spina cały cykl: projekt → montaż → eksploatacja, i pozwala wykryć błąd projektowy albo zmianę w zużyciu.

**Powiadomienia serwisowe** — rozwinięcie istniejącej funkcji 7.32 (przypomnienia o przeglądach) w realne push-notification: czyszczenie paneli wg harmonogramu z Modułu 3 (2.40), wymiana/kontrola bezpieczników, przegląd baterii wg BMS.

### 13.4 Wejście do aplikacji

**Kreator szybkiego startu** — zanim kompletny początkujący zobaczy 14 kafli, krótki wywiad (3–4 pytania: budżet / priorytet — niezależność energetyczna czy oszczędność / poziom doświadczenia technicznego) i na tej podstawie appka proponuje, od którego kafla zacząć i czy w ogóle pokazywać Tryb Inżyniera. Chroni przed przytłoczeniem kogoś, kto szukał prostego kalkulatora, a trafił na 470+ ekranów.

### 13.5 Do sparametryzowania później (nie blokuje etapu 2)

**Normy regionalne jako parametr** — obecne twarde stopy (§6) są pisane pod polskie/europejskie normy (PN, IEC). Jeśli aplikacja ma kiedyś wyjść poza Polskę, granice bezpieczeństwa (np. dopuszczalne obciążenia RCD, klasy SPD) różnią się względem NEC (USA) czy innych norm lokalnych. Nie wymaga działania teraz — wystarczy, żeby dobór komponentów i twarde stopy w kodzie nie były zahardkodowane na sztywno pod jedną normę, tylko odwoływały się do tabeli norm, którą można będzie kiedyś rozszerzyć.

---

## 14. Kolejna runda pomysłów

### 14.1 Symulator awarii ("co jeśli")

Zanim coś się realnie zepsuje, user może zasymulować scenariusz: "co jeśli ten panel przestanie działać", "co jeśli inwerter padnie", "co jeśli bateria straci 20% pojemności" — i zobaczyć wpływ na cały system (autonomię, pokrycie krytycznych obciążeń). Uczy przewidywania konsekwencji zamiast poznawania ich w środku zimy podczas realnej awarii.

### 14.2 Weryfikator oferty instalatora — z analizą kosztową

User wpisuje, co proponuje mu instalator (model falownika, liczba i model paneli, ewentualnie magazyn energii, cena całości), a system:

- **Porównuje dobór techniczny** z tym, co sam wyliczył w swoich modułach — np. "instalator proponuje falownik o 30% za mały względem Twojego zapotrzebowania" albo "dobór pasuje".
- **Szacuje realną cenę rynkową** takich samych lub bardzo zbliżonych komponentów (panele, falownik, magazyn energii) i pokazuje różnicę względem oferty — ile instalator doliczył za montaż/marżę.
- **Pokazuje potencjalną oszczędność przy samodzielnym montażu** z pomocą aplikacji (Moduł 11 — montaż baterii, plus reszta kreatorów doborowych), zestawioną z ceną "pod klucz".
- **Adresuje argument "ale gwarancja"** — jeśli user obawia się utraty gwarancji przy zakupie komponentów osobno i montażu samodzielnym, system pokazuje do rozważenia:
  - gwarancja na falownik jest zwykle udzielana przez producenta niezależnie od tego, kto go zamontował (o ile montaż jest zgodny z instrukcją producenta) — kupno osobno zwykle tej gwarancji nie unieważnia,
  - panele w praktyce rzadko ulegają awarii w typowym okresie 10 lat — ryzyko, przed którym "chroni" gwarancja instalatora, jest w tym oknie czasowym stosunkowo niskie,
  - roszczenia gwarancyjne bywają trudne do wyegzekwowania niezależnie od tego, czy kupowano przez instalatora, czy samodzielnie.

  **Zastrzeżenie do uwzględnienia w treści:** warunki gwarancji różnią się między producentami, sprzedawcami i krajami — te punkty mają być prezentowane jako "weź to pod uwagę i sprawdź warunki konkretnego sprzedawcy", a nie jako uniwersalna prawda prawna czy porada prawna. Treść tej sekcji powinna zostać sformułowana ostrożnie przy pisaniu (etap 2), żeby nie brzmiała jak gwarancja prawna ze strony aplikacji.

### 14.3 Kontroler spójności między modułami

Automatyczne wykrywanie sprzeczności między decyzjami podjętymi w różnych kaflach — np. user wybrał baterię 5 kWh w Module 4, ale w Module 2 założył 3 dni autonomii przy zapotrzebowaniu wymagającym 15 kWh. System wychwytuje taką niespójność i wskazuje, gdzie leży rozjazd, zamiast zostawiać to userowi do samodzielnego wykrycia dopiero przy zakupie sprzętu.

### 14.4 Tryb quizowy / utrwalanie wiedzy

Skoro celem aplikacji jest dokształcanie, krótkie opcjonalne quizy oparte na podpowiedziach, które user już otworzył (§8) — np. po jakimś czasie aplikacja pyta "czy pamiętasz, co to Vmp?". Zamienia bierne otwieranie tooltipów w coś, co faktycznie zostaje w pamięci.

### 14.5 Tryb awaryjny bez logowania

Uproszczony ekran z dużym tekstem i najważniejszymi danymi z Trybu Live (SoC baterii, bieżąca produkcja, stan krytycznych obciążeń), dostępny natychmiast, bez przechodzenia przez normalną nawigację po 14 kaflach — na wypadek realnego blackoutu, gdzie liczy się szybkość dostępu, nie pełna funkcjonalność.

### 14.6 Udostępnianie projektu jako link do podglądu

Osobna opcja od eksportu PDF (§13.1) — link typu "tylko do odczytu" do projektu, żeby np. współdomownik albo współinwestor mógł zobaczyć postęp i decyzje bez pełnego dostępu edycyjnego do konta.

---

## 15. Rzeczy, bez których to nie jest gamechanger

Poniższe nie są kolejnymi usprawnieniami pojedynczych ekranów — zmieniają charakter całego produktu. Bez #1 i #2 reszta aplikacji opiera się na ręcznie wpisywanych, statycznych liczbach; #4 (w rozszerzonej formie) to jedyny element, który rośnie na wartości wraz z liczbą użytkowników.

### 15.1 Silnik symulacji rocznej (cyfrowy bliźniak systemu)

Zamiast oddzielnych, statycznych obliczeń w każdym module ("ile potrzebujesz baterii", "ile da panel"), jedna symulacja **godzina po godzinie przez cały rok (8760 h)**, łącząca dane pogodowe (Moduł 1), profil zużycia (Moduł 2), produkcję PV (Moduł 3), pracę baterii (Moduł 4) i ogrzewanie (Moduł 6) w jeden ciągły model. User widzi, jak system zachowałby się w konkretnym styczniowym tygodniu, zanim wyda złotówkę — zamiast składać to sobie w głowie z osobnych liczb z różnych ekranów. To jest fundament, na którym powinny się opierać wszystkie ekrany Doradcy dotyczące doboru mocy/pojemności — nie odwrotnie.

### 15.2 Baza rzeczywistych komponentów

Wyszukiwarka modelu (np. "Jinko JKM440N-54HL4-B") z gotową bazą parametrów (Voc, Vmp, Isc, Imp, współczynniki temperaturowe) zamiast ręcznego przepisywania z tabliczki znamionowej na każdym ekranie Doradcy. Usuwa tarcie i błędy przy przepisywaniu liczb — różnica między "appką dla cierpliwych" a "appką, której użyje każdy".

### 15.3 Prognoza pogody live jako silnik AI

Moduł 10 (AI) ma sens tylko, jeśli prognozy produkcji/zużycia opierają się na realnej prognozie pogody na 3–7 dni, a nie wyłącznie na uśrednionych danych klimatycznych z Modułu 1. Bez tego "AI przewiduje produkcję" to w praktyce tabela historyczna, nie żywy asystent mówiący "jutro pochmurno, oszczędzaj dziś wieczorem".

### 15.4 Społeczność Off-Grid (rozszerzony benchmarking)

Nie tylko anonimowe porównanie liczb — pełna, opt-in platforma społecznościowa wokół instalacji:

- **Dwa niezależne przełączniki udostępniania:** (a) udostępnij parametry sprzętu (panele, kąt nachylenia, moc, pojemność baterii), (b) udostępnij przybliżoną lokalizację. Domyślnie oba wyłączone — świadoma zgoda, nie opt-out.
- **Mapa Polski z przybliżoną lokalizacją** — pozycja zaokrąglona do siatki/gminy, nigdy dokładny punkt GPS. To nie jest tylko kwestia prywatności w sensie ogólnym — ujawnienie "tu jest dom z drogim magazynem energii" plus dokładna lokalizacja to realne ryzyko włamania. Rozdzielczość mapy musi to uwzględniać od pierwszej wersji, nie jako poprawka po fakcie.
- **Wiadomości między użytkownikami** — tylko za obopólną zgodą (jak zaproszenie do kontaktu, nie od razu otwarty czat), z możliwością zablokowania i zgłoszenia. Cel: łączenie ludzi o podobnym podejściu do off-gridu, wymiana doświadczeń, budowanie świadomości — nie kolejny kanał spamu/naciągania.
- **Wartość sieciowa:** to jedyny punkt z całej listy pomysłów, który staje się lepszy wraz z liczbą użytkowników — im więcej osób, tym trafniejsze porównania i tym trudniej to skopiować konkurencji od zera.

**Kierunek na przyszłość — Meshtastic / sieć mesh LoRa:** docelowa integracja z siecią komunikacji mesh (typu Meshtastic) jako rozszerzenie idei niezależności z appki zasilania na niezależność komunikacyjną — łączność między użytkownikami/urządzeniami bez internetu i sieci komórkowej, szczególnie istotna w Module 8 (Bezpieczeństwo i sytuacje awaryjne) przy blackoutach. To osobna, znacznie większa inicjatywa sprzętowa (radio LoRa, nie tylko oprogramowanie) — warto zanotować jako kierunek strategiczny już teraz (współdzieli warstwę ESP32 z Modułem 9), ale traktować jako odrębny etap wdrożenia, nie część etapu 2.

### 15.5 Domknięcie pętli projekt → zakup

Rozszerzenie listy zakupowej (§13.1, BOM) o realną, aktualną cenę i dostępność u sprzedawcy przy każdej pozycji. User kończy projektowanie i może od razu kupić, zamiast przepisywać listę do wyszukiwarki.

---

## 16. Etap 2 — Audyt treści: Moduł 5 (Okablowanie i zabezpieczenia)

Pierwszy pełny audyt wzorców, zgodnie z priorytetem z §7 (bezpieczeństwo elektryczne = najwyższe ryzyko). Każda z 40 funkcji dostała przypisany wzorzec. To jest szablon do powtórzenia dla pozostałych 12 modułów.

| Funkcja | Tytuł | Wzorzec | Uwaga |
|---|---|---|---|
| 4.1 | Dobór przekrojów przewodów DC/AC | D | rdzeń — łączy się z 4.18, 4.27, 4.30 (patrz merge poniżej) |
| 4.2 | Dobór bezpieczników i rozłączników | D | |
| 4.3 | Dobór mocy falownika | D | |
| 4.4 | Przepust powietrza pod panelami | D | wejście: klimat/typ montażu → rekomendowany prześwit |
| 4.5–4.7 | SPD / LPZ / koordynacja odgromowa | D (scalone) | już zmergowane wcześniej — jeden ekran Doradcy |
| 4.8 | Projekt uziemienia | D | |
| 4.9 | Główna szyna wyrównawcza (GSW) | **E** | co podłączyć do GSW — checklist, nie kalkulator |
| 4.10 | Uziemienie funkcjonalne vs ochronne | D | zły wybór → niebezpieczne napięcie dotykowe |
| 4.11 | Analiza zwarciowa | D | |
| 4.12 | Selektywność zabezpieczeń | D | |
| 4.13 | Wyłączniki nadprądowe DC | D | |
| 4.14 | Ochrona przed odwrotną polaryzacją | C | diode vs breaker — porównanie podejść |
| 4.15 | Wyłączniki RCD | D | |
| 4.16 | Ochrona przed dotykiem | C | wyjaśnienie + wskazanie wymaganych środków wg systemu uziemienia |
| 4.17 | Monitorowanie izolacji (IMD) | C | opis funkcji urządzenia, decyzja czy potrzebne |
| 4.18 | Obciążalność długotrwała / korekcja temp. | D | **merge → 4.1** jako zaawansowany parametr |
| 4.19 | Szyny zbiorcze i listwy | D | **merge → z 4.20, 4.24** (patrz niżej) |
| 4.20 | Kontrola momentów dokręcenia | **E** | tabela wartości + checklist |
| 4.21+4.35 | Złącza MC4 (scalone) | D | mieszanie klonów różnych producentów = ryzyko pożaru — twardy stop |
| 4.22 | Trasy kablowe — prowadzenie, separacja | **F** | |
| 4.23 | Oznakowanie obwodów | **E** | |
| 4.24 | Zabezpieczenia termiczne szyn | D | **merge → 4.19** |
| 4.25 | Lista materiałów (BOM) | *(poza A–F)* | to jest zalążek ogólnoaplikacyjnego BOM z §13.1 — nie osobny ekran doradczy, tylko zasilacz dla mechanizmu §13.1 |
| 4.26 | Normy i certyfikaty | C | |
| 4.27 | Spadki napięć na dystansie | D | **merge → 4.1** |
| 4.28 | String Box / Array Box | D | |
| 4.29 | Separacja EMC | **F** | |
| 4.30 | Derating przy wiązkach kabli | D | **merge → 4.1** |
| 4.31 | Peszle, koryta, rurki | B | porównanie typów osłon |
| 4.32 | Ochrona przed gryzoniami | C | |
| 4.33 | Optymalizacja trasy i kosztu kabla | B | trade-off: najkrótsza vs wykonalna |
| 4.34 | Puszki połączeniowe | B | |
| 4.36+4.37+4.39 | Cu-Al: łączenie, porównanie, korozja (scalone) | D | bezpośrednie łączenie Cu-Al bez złączki bimetalicznej = twardy stop |
| 4.38 | Dobór izolacji kabla do warunków montażu | D | |
| 4.40 | Pomiary powykonawcze | **E** | checklist z progami pomiarowymi (ciągłość, R izolacji, R uziemienia) |

### Dodatkowe scalenie znalezione podczas audytu treści (poza tym, co wychwycił skan tytułów)

**Mega-Doradca "Dobór przekroju kabla"** — 4.1 (przekrój) + 4.18 (korekcja temperaturowa) + 4.27 (spadek napięcia na dystansie) + 4.30 (derating przy wiązkach) to w praktyce **jeden dobór z czterema poprawkami**, nie cztery osobne ekrany. User wpisuje prąd, długość trasy, temperaturę otoczenia i sposób prowadzenia kabla (osobno/w wiązce) **raz**, a wynik uwzględnia wszystkie cztery czynniki naraz. To większe zejście niż wcześniejsze zgrubne szacunki — z 4 funkcji do 1 ekranu.

**Klaster szyn/połączeń** — 4.19 (dobór szyn) + 4.20 (momenty dokręcenia) + 4.24 (zabezpieczenia termiczne szyn) logicznie należą do jednego przepływu "montaż szyny zbiorczej", ale to hybryda: 4.19/4.24 to Doradca (dobór), 4.20 to Checklist (E). Rozwiązanie: jeden ekran z dwiema sekcjami — góra Doradca (dobór przekroju/zabezpieczenia szyny), dół Checklist (momenty dokręcenia do potwierdzenia po montażu).

### Wynik dla Modułu 5

- 40 funkcji → **~24 ekrany** (po merge'ach z audytu treści, dodatkowo do tego, co już scaliliśmy wcześniej: MC4 i SPD/LPZ)
- Rozkład wzorców: 16× D (Doradca), 4× E (Checklist), 4× F (Przewodnik), 4× B (Porównanie), 5× C (Informacja), 1× poza schematem (BOM → zasila §13.1)
- **8 twardych stopów** zidentyfikowanych wprost w tym module (mieszanie klonów MC4, bezpośrednie łączenie Cu-Al, przekroczenie zwarciowe, niedopasowanie selektywności, za mały przekrój, itd.) — do sekcji 6 dopiszemy je po zamknięciu wszystkich modułów.

---

## 17. Etap 2 — Audyt treści: Moduł 3 (Instalacja PV)

Drugi audyt, wg priorytetu z §7. 50 funkcji — w treści znalazł się największy jak dotąd klaster do scalenia (dopasowanie tablicy PV do falownika, 6 funkcji w jeden ekran) oraz dwa przypadki wymagające przeniesienia między modułami, nie tylko scalenia.

| Funkcja | Tytuł | Wzorzec | Uwaga |
|---|---|---|---|
| 2.1 | Baza modeli paneli PV i tryb custom | *(infra)* | to jest właśnie baza komponentów z §15.2 — komponent współdzielony w całej aplikacji, nie osobny ekran PV |
| 2.2 | Pobranie danych nasłonecznienia (PVGIS/PVWatts) | *(infra)* | zasila Moduł 1 i silnik symulacji rocznej z §15.1 |
| 2.3 | Kąt pochylenia i azymut — suwaki | D | |
| 2.4, 2.5, 2.6, 2.7, 2.9 | Montaż pionowy / dach płaski / dach skośny / wielopołaciowy / wiata | **A (scalone)** | 5 wariantów montażu = jeden ekran z wyborem typu, identycznie jak dawny szereg/równolegle/mieszany |
| 2.8 | Tracker vs konstrukcja stała | B | |
| 2.10 | Symulacja liczby paneli (3 warianty) | B | |
| 2.11 | Zimowy stress-test napięciowy MPPT | D | to dokładnie ten ekran, który już zbudowałem jako przykład |
| 2.12 | Aerodynamika — wiatr i ssanie | D | twardy stop przy niewystarczającym mocowaniu |
| 2.13 | Mikropęknięcia termiczne | C | |
| 2.14 | Straty na okablowaniu DC | D | |
| 2.15, 2.29 | Zjawisko PID / technologie anty-PID | *(patrz niżej)* | 2.29 wchodzi do klastra technologii (2.28+2.29+2.30+2.43), 2.15 zostaje jako C (wyjaśnienie zjawiska) |
| 2.16, 2.40, 2.44 | Śnieg/serwis, harmonogram czyszczenia (live), kąt a zabrudzenie | **C (scalone, akordeon)** | już wcześniej typowany jako kandydat — potwierdzony |
| 2.17 | Optymalizator "Złotego Środka" | D | |
| 2.18 | Kalkulator konstrukcji wsporczej | D | realny dobór wymiarów, nie tylko lista zakupów |
| 2.19–2.21 | Szereg / równolegle / mieszany | **A (scalone)** | już zbudowane jako przykład |
| 2.22 | Wpływ diod bocznikujących | C | |
| 2.23, 2.49 | Symulacja zacienienia jednego panelu + wpływ na diody bocznikujące | **D (scalone)** | ten sam temat opisany dwa razy pod różnym kątem |
| 2.24, 2.25, 2.26, 2.27, 2.37, 2.42 | Dobór liczby paneli / przewymiarowanie DC-AC / ryzyko / dopasowanie MPPT / min. napięcie startowe | **D (mega-scalenie)** | **największy klaster w tym module** — patrz niżej |
| 2.28, 2.29, 2.30, 2.43 | Technologie paneli | **B (scalone)** | już zbudowane jako przykład |
| 2.31 | Panele bifacjalne | D | |
| 2.32, 2.41 | Straty niedopasowania mocy / łączenie różnych paneli | **D (scalone)** | ten sam temat, dwa numery |
| 2.33 | Wpływ temperatury na wydajność | D | |
| 2.34 | Degradacja w czasie (symulacja pogłębiona) | D | prognoza wieloletnia, różna od 2.15 (wyjaśnienia zjawiska) |
| 2.35 | Orientacja wschód-zachód, dwie połacie | D | |
| 2.36 | Mikroinwertery vs centralny | B | |
| 2.38 | Ochrona stringów — bezpieczniki i diody blokujące | D | |
| 2.39 | Powłoki antyrefleksyjne | C | |
| 2.45 | Dobór paneli do warunków nadmorskich/pylistych | D | |
| 2.46 | Straty na złączkach MC4 w praktyce | C | kontekst do MC4 z Modułu 5, nie duplikat |
| 2.47 | Zabezpieczenie przeciwprzepięciowe stringów PV | **→ przenieść do Modułu 5** | ten sam temat co klaster SPD (4.5–4.7) — nie duplikować w dwóch modułach |
| 2.48 | Monitoring wydajności paneli na żywo | **→ przenieść do Modułu 13** | to widżet Trybu Live, nie ekran projektowy |
| 2.50 | Kalkulator rocznego uzysku (podsumowanie) | **G** | ekran wynikowy silnika symulacji z §15.1, nie osobny kalkulator |

### Mega-scalenie: "Dopasowanie tablicy PV do falownika"

2.24 + 2.25 + 2.26 + 2.27 + 2.37 + 2.42 — sześć funkcji, jedno pytanie: *czy mój dobór paneli pasuje do mojego falownika?* Wszystkie sprawdzają to samo z różnych kątów (liczba paneli, stosunek DC/AC, ryzyko over/undersizing, okno MPPT, minimalne napięcie startowe). To jest dokładnie ten sam wzorzec, który zbudowałem w przykładzie z konfiguratorem stringów — tylko szerszy zakres oceny. Jeden ekran Doradcy, jedna sekcja wejściowa (dane paneli + dane falownika, prawdopodobnie te same co w scalonym 2.19–21), jeden silnik oceny sprawdzający wszystkie sześć kryteriów naraz i wypisujący werdykt zbiorczy.

### Dwa przeniesienia międzymodułowe

- **2.47 → Moduł 5**: ochrona przeciwprzepięciowa stringów PV to ten sam temat co klaster SPD/LPZ (4.5–4.7) już scalony w Module 5. Trzymanie tego w dwóch miejscach oznacza rozjazd treści przy aktualizacji w przyszłości.
- **2.48 → Moduł 13**: monitoring na żywo nie jest decyzją projektową, tylko danymi z eksploatacji — miejsce dla tego to biblioteka widżetów Trybu Live, nie osobny ekran w Module 3.

### Wynik dla Modułu 3

- 50 funkcji → **28 ekranów** (3 stają się współdzieloną infrastrukturą/silnikiem z §15, 2 przenoszą się do innych modułów, 25 scala się w 7 ekranów, 20 zostaje bez zmian, 2.50 zostaje jako 1 ekran raportu)
- Nowy wzorzec **G (Raport/Podsumowanie)** wprowadzony właśnie tutaj — przyda się też w Module 6 (roczny bilans cieplny) i pewnie w Module 4 (baterie)
- Rozkład: 14× D, 5× B, 6× C, 2× A (scalone), 1× G, 3× infrastruktura, 2× przeniesione

---

## 18. Etap 2 — Audyt treści: Moduł 4 (Baterie)

Trzeci audyt. 39 funkcji. W przeciwieństwie do PV i Okablowania, tu **nie pojawił się żaden nowy wzorzec** — wszystko mieści się w A–G. To dobry sygnał, że zestaw wzorców się stabilizuje. Za to znalazły się kolejne 2 przeniesienia międzymodułowe.

| Funkcja | Tytuł | Wzorzec | Uwaga |
|---|---|---|---|
| 3.1 | Dobór pojemności baterii | D | |
| 3.2 | Sugestia napięcia systemowego (12/24/48V) | D | |
| 3.3 | Symulacja czasu ładowania/rozładowania | D | |
| 3.4 | Moduł EV — ładowanie samochodu | D | |
| 3.5, 3.14 | Grzałki BMS ochrona przed mrozem / inteligentne zasilanie grzałek | **D (scalone)** | ten sam temat: skąd grzałki BMS biorą prąd i kiedy się włączają |
| 3.6 | Starzenie i degradacja ogniw (bufor projektowy) | D | inne niż 3.16 — to decyzja projektowa "ile zapasu dodać", nie diagnostyka na żywo |
| 3.7 | Obwód Pre-Charge | D | brak pre-charge = uszkodzenie stykowe przy pierwszym załączeniu — twardy stop |
| 3.8 | Symulacja "Słabego Ogniwa" (Cell Drift & Balancing) | D | |
| 3.9 | Detekcja zwarcia i e-Fuse | D | |
| 3.10 | Gaszenie i wentylacja komory (pożar klasy B) | **→ przenieść do Modułu 8** | ten sam typ funkcji co sterowanie gaśnicze z 11.52, już tam zebrane |
| 3.11 | Ochrona przed wilgocią i kondensacją | D | |
| 3.12 | Moment dokręcania śrub | **E** | dokładnie ten sam wzorzec co 4.20 w Module 5 — te dwa ekrany mogą współdzielić komponent UI |
| 3.13 | Ograniczenie prądu ładowania w mrozie (Cold C-Rate) | D | |
| 3.15 | Algorytm końca ładowania (Tail Current) | D | |
| 3.16, 3.33 | SoH — prognoza żywotności / pomiar rezystancji wewnętrznej | **D (scalone)** | SoH liczy się właśnie z trendu rezystancji — to jeden silnik, nie dwa |
| 3.17 | Cold Cranking Amps | D | |
| 3.18 | Tryb Long Term Storage | D | |
| 3.19 | Analiza Second-Life (baterie z EV) | B | nowa vs używana — porównanie z trade-offami |
| 3.20 | Łączenie równoległe różnych baterii (Mixing) | D | twardy stop — różne chemie/wiek/pojemność równolegle bez izolacji |
| 3.21 | Vehicle-to-Home (V2H) | D | |
| 3.22 | Komunikacja BMS — CAN/RS485/Modbus | D | dobór protokołu do konkretnego BMS/falownika; powiązane z katalogiem protokołów w Module 9, ale to inny kontekst (BMS, nie ESP32 ogólnie) |
| 3.23 | Pozycjonowanie ogniw (kompresja/spuchnięcie) | D | za mała kompresja → ryzyko pożaru — twardy stop |
| 3.24 | Pobór własny BMS i tryb uśpienia | D | |
| 3.25 | Analiza opłacalności magazynu (True Cost of Storage) | D | |
| 3.26 | Czarna Skrzynka (Data Logging & Alarmy) | **→ przenieść do Modułu 13** | to widżet Trybu Live, nie ekran projektowy — analogicznie do 2.48 |
| 3.27 | Dobór bezpiecznika DC (AIC/Class T/NH) | D | prądy zwarciowe baterii są rzędu kA — inne wymagania niż bezpieczniki z Modułu 5, zostaje osobno |
| 3.28, 3.38 | Szyny zbiorcze i rozkład prądu / połączenia międzypakietowe | **D (scalone)** | ten sam temat na poziomie pakietu baterii |
| 3.29 | Topologia BMS (Common Port vs Separate Port) | B | |
| 3.30 | Chłodzenie baterii latem | D | |
| 3.31 | Kalibracja SoC (Coulomb Counting) | D | |
| 3.32 | Detekcja doziemienia (Ground Fault & IMD) | D | powiązane z 4.17 w Module 5, ale kontekst battery-side, zostaje osobno |
| 3.34 | Porównanie technologii magazynów (LiFePO4 vs AGM/Żel/Kwasowy/Trakcyjny) | B | |
| 3.35 | Napięcie odcięcia vs żywotność (DoD) | D | nadmierne rozładowanie = twardy stop |
| 3.36 | Hierarchia ładowania (PV > Agregat > Sieć) | D | |
| 3.37 | Symulacja miesiąca zachmurzenia (No-Sun Scenario) | D | powiązane z Modułem 7 (stress-test), zostaje tu bo dotyczy konkretnie autonomii baterii |
| 3.39 | Matryca alarmów BMS i reakcje systemu | C | tabela referencyjna alarm → reakcja, do przejrzenia/skonfigurowania |

### Dwa kolejne przeniesienia międzymodułowe

- **3.10 → Moduł 8**: gaszenie/wentylacja komory baterii to dokładnie ta sama kategoria funkcji co sterowanie modułem gaśniczym (11.52), już zebrane w Module 8. Trzymanie osobno w Module 4 dublowałoby logikę.
- **3.26 → Moduł 13**: czarna skrzynka to log danych z eksploatacji na żywo — widżet biblioteki Trybu Live, nie ekran projektowy, tak samo jak monitoring PV (2.48).

**Obserwacja:** to już drugi moduł z rzędu, gdzie coś "ucieka" do Modułu 8 (bezpieczeństwo) i Modułu 13 (Live) — warto przy pełnym przepisaniu systematycznie przejrzeć **wszystkie** moduły pod kątem tych dwóch kierunków, nie tylko czekać, aż wypłyną przy audycie.

### Wynik dla Modułu 4

- 39 funkcji → **34 ekrany** (3 pary scalone do 3 ekranów, 2 funkcje przeniesione do innych modułów)
- Najmniejsza redukcja spośród audytowanych dotąd modułów — baterie to w większości genuinie odrębne tematy bezpieczeństwa, nie powtarzalne warianty jednego pytania
- Rozkład: 26+3(scalone)=29× D, 3× B, 1× C, 1× E — **żaden nowy wzorzec nie był potrzebny**, zestaw A–G się stabilizuje

---

## 19. Etap 2 — Audyt treści: Moduł 6 (Ogrzewanie / pompa ciepła)

Czwarty audyt — najciekawszy dotąd, bo to moduł z już wcześniej scalonym silnikiem 74 czynników ORAZ z największą zależnością od importu danych budynkowych (§12: 23 z 579 funkcji w całym dokumencie zależy od danych budynku, większość właśnie tutaj).

### Część 1: funkcje 5.1–5.26 (przed silnikiem czynników)

| Funkcja | Tytuł | Wzorzec | Uwaga |
|---|---|---|---|
| 5.1 | Charakterystyka termiczna budynku | **G** | to jest ekran wynikowy importu z §12 — pokazuje dane z Kalkulatora Inżyniera Pro (lub wpisane ręcznie), nie osobny kalkulator |
| 5.2 | Zapotrzebowanie na C.O. i C.W.U. | D | konsumuje dane z 5.1 automatycznie po imporcie |
| 5.3, 5.23, 5.24 | Rekuperacja / projekt wentylacji mech. / letni bypass | **D (scalone)** | jeden system wentylacji z odzyskiem, trzy aspekty tego samego projektu |
| 5.4 | Gruntowy wymiennik ciepła (GWC) | D | powiązane z czynnikami odwiertu w silniku 74-czynnikowym |
| 5.5 | Pompa ciepła — COP/SCOP w funkcji temperatury | D | **ekran bazowy dla silnika 74 czynników** — stąd link "zobacz wpływ konkretnego czynnika" do scalonego modułu z Części 2 |
| 5.6 | Cykle odszraniania (defrost) | D | |
| 5.7 | Mostki termiczne | D | dane z §12 (import budynku) |
| 5.8 | Pojemność cieplna budynku (bezwładność) | D | dane z §12 |
| 5.9 | Straty przez wentylację grawitacyjną | D | |
| 5.10 | Optymalizacja izolacji | D | dane bazowe z §12, ocena opcji ulepszenia |
| 5.11 | Okna i drzwi — U, g, zyski słoneczne | D | dane z §12 |
| 5.12 | Infiltracja powietrza — test szczelności | D | dane z §12 |
| 5.13, 5.17, 5.18 | Dystrybucja ciepła: dobór ogólny / podłogowe / grzejniki niskotemp. | **A (scalone)** | wybór typu dystrybucji — ten sam wzorzec co montaż PV czy topologia stringów |
| 5.14 | Bufor ciepła — dobór pojemności | D | powiązane z czynnikiem bufora w silniku 74-czynnikowym (wpływ wielkości bufora na liczbę załączeń) |
| 5.15 | Pompy cyrkulacyjne — dobór | D | |
| 5.16 | Sterowanie strefowe — zawory, siłowniki | D | fizyczny dobór siłownika → katalog w Module 9, logika stref zostaje tutaj |
| 5.19, 5.20, 5.21 | C.W.U.: zasobnik / straty postojowe / cyrkulacja | **D (scalone)** | jeden system, trzy aspekty tego samego zasobnika |
| 5.22 | Dobór grzałek elektrycznych do C.W.U. | D | |
| 5.25 | Ochrona przed przegrzaniem latem (solar shading) | D | |
| 5.26 | Wentylacja naturalna a mechaniczna — porównanie | B | punkt wejścia decyzyjny, prowadzi do scalonego 5.3/23/24 jeśli user wybierze mechaniczną |

### Część 2: silnik 74 czynników (5.27–5.100, już wcześniej scalony)

Bez zmian co do struktury (1 ekran, dropdown/lista czynników) — ale audyt ujawnia ważny podział wewnętrzny, istotny dla wdrożenia:

- **Czynniki budynkowe** (izolacja, okna, mostki, szczelność, orientacja, wysokość pomieszczeń, bezwładność) — po wdrożeniu §12 wypełniają się **automatycznie** z importu, user tylko ogląda wpływ, nie wpisuje.
- **Czynniki sprzętowo-projektowe** (głębokość odwiertu, liczba odwiertów, wielkość bufora, ustawienia defrostu, tryb cichy) — te zostają w pełni interaktywne, bo to decyzje projektowe, nie dane budynku.

To nie zmienia liczby ekranów (nadal 1 scalony silnik), ale zmienia, ile z 74 "kart" w tym silniku wymaga realnego wpisywania danych przez usera po wdrożeniu importu — praktycznie mniej niż połowa.

### Wynik dla Modułu 6

- **100 funkcji → 21 ekranów**
- Rozbicie: 5.1 → 1× G, silnik czynników → 1× D (kryjący 74 pozycje), reszta: 3 klastry scalone (2× D, 1× A) z 9 funkcji → 3 ekrany, 16 funkcji indywidualnych (15× D, 1× B)
- To największa dotychczasowa redukcja procentowa (79% mniej ekranów niż surowych funkcji) — i jedyny moduł, gdzie import danych budynkowych (§12) realnie zmienia sposób wypełniania, nie tylko liczbę ekranów

---

## 20. Etap 2 — Audyt treści: Moduł 1 (Lokalizacja) i Moduł 2 (Zapotrzebowanie)

Piąty i szósty audyt. Moduł 1 jest bardzo mały i w większości pozostaje bez zmian. Moduł 2 dał trzy nowe scalenia lokalne i — co ciekawsze — **cztery funkcje, które w ogóle nie powinny tu być**, bo dublują tematy z innych modułów.

### Moduł 1 (Lokalizacja) — 4 funkcje

| Funkcja | Tytuł | Wzorzec | Uwaga |
|---|---|---|---|
| 0.1 | GPS i pobranie lokalizacji/klimatu | *(infra)* | zasila Moduł 1 dalej i silnik symulacji z §15.1 |
| 0.2 | Skaner działki — online (Geoportal) / offline (spacer GPS) | A | przełącznik trybu wg dostępności internetu |
| 0.3 | Analiza zacienienia (horyzont cieni) | D | |
| 0.4 | Bryła budynku i orientacja ścian | D | częściowo pokrywa się z geometrią z §12 (import budynku) — do ustalenia przy przepisywaniu, czy dane wejściowe są współdzielone |

**Wynik:** 4 funkcje → 4 ekrany. Za mały i za bardzo fundamentalny moduł, żeby cokolwiek scalać.

### Moduł 2 (Zapotrzebowanie) — 26 funkcji indywidualnych + 1 już scalony moduł wampirów

| Funkcja | Tytuł | Wzorzec | Uwaga |
|---|---|---|---|
| 1.1 | Systemy podtrzymania życia (Survival Core) | D | |
| 1.2 | Inteligentny bojler C.W.U. | D | |
| 1.3, 1.4, 1.5 | Urządzenia zmienne / płyta indukcyjna / klasa energetyczna i wiek | **D (scalone)** | jedna lista urządzeń z parametrami zamiast trzech osobnych ekranów |
| 1.6 | Liczba domowników | D-lite | prosty parametr wejściowy, część onboardingu — nie potrzebuje pełnego werdyktu z §3 |
| 1.7, 1.16 | Profil dobowy (24h) / astronomiczny profil dnia-nocy | **D (scalone)** | długość nocy to tylko jeden z wymiarów tego samego profilu |
| 1.8 | Sezonowość i tryb wakacyjny | D | |
| 1.9 | Dni autonomii | D-lite | |
| 1.10, 1.11, 1.21 | VA/cosφ / prądy rozruchowe / współczynnik jednoczesności | **D (scalone)** | już typowane wcześniej jako kandydat — potwierdzone |
| 1.12 | Pobór własny falownika (standby) | D | |
| 1.13 | Sprawność inwertera przy niskim obciążeniu | D | |
| 1.14 | Cykle odszraniania pompy ciepła (defrost) | **→ przenieść do Modułu 6** | dokładnie ten sam temat co 5.6 — duplikat międzymodułowy |
| 1.15 | Grzałki BMS i samorozładowanie ogniw | **→ przenieść do Modułu 4** | dokładnie ten sam temat co scalony klaster 3.5+3.14 |
| 1.17 | Przetwornice DC/DC | D | |
| 1.18 | Degradacja i starzenie (aging factor) | D | *do weryfikacji przy pisaniu treści: nazwa sugeruje możliwe pokrycie z 3.6 (starzenie ogniw) w Module 4 — może dotyczyć starzenia sprzętu AGD, nie baterii; sprawdzić treść źródłową przed etapem 3* |
| 1.19 | Agregat prądotwórczy — definicja i logika | D | powiązane, ale odrębne od hierarchii ładowania 3.36 w Module 4 |
| 1.20 | Macierz priorytetów odłączania (Smart Load Shedding) | D | zostaje tu, z odsyłaczem do Modułu 8 (bezpieczeństwo) |
| 1.22, 1.23 | Świadomość prądowa (W→A) / Szybki Niezbędnik | **→ przenieść do Modułu 12** | to kalkulatory pomocnicze — miejsce dla nich to Moduł 12 (szybki kalkulator mobilny), nie szczegółowe projektowanie |
| 1.25 | Bufor na rozbudowę | D | |
| 1.26 | Architektura 1-fazowa/3-fazowa | D | |
| 1.27 | Kategoria: warsztat/gospodarstwo/oświetlenie terenowe | A | przełącznik trybu — wybór kategorii ładuje gotowy profil wyjściowy |

### Trzy nowe przeniesienia międzymodułowe (więcej niż w jednym module naraz)

- **1.14 → Moduł 6**: cykle odszraniania pompy ciepła to duplikat 5.6, nie osobny temat
- **1.15 → Moduł 4**: grzałki BMS to duplikat już scalonego klastra 3.5+3.14
- **1.22 + 1.23 → Moduł 12**: to narzędzia szybkiego przeliczania, nie projektowanie szczegółowe — właściwe miejsce to moduł kalkulatora mobilnego

**Obserwacja:** to pierwszy przypadek, gdzie funkcja duplikuje się międzymodułowo (nie tylko "powinna być gdzie indziej tematycznie", jak przy Module 8/13, ale dosłownie **ten sam temat opisany dwa razy w dwóch rozdziałach źródłowych**, 1.14/5.6 i 1.15/3.5+3.14). To sugeruje, że oryginalny dokument v1.5 mógł mieć więcej takich ukrytych duplikatów międzyrozdziałowych niż tylko znany wcześniej przypadek MC4 (4.21/4.35) — wart dodatkowej uwagi przy audycie pozostałych modułów.

### Wynik dla Modułu 2

- 26 funkcji indywidualnych + 1 wcześniej scalony moduł wampirów → **18 ekranów** (17 z części indywidualnej + 1 moduł wampirów)
- Licząc z wampirami: z **50 surowych funkcji** dawnego Rozdziału 1 → **18 ekranów** (64% redukcji)
- 3 nowe scalenia lokalne, 4 funkcje przeniesione do innych modułów, 1 duplikat międzyrozdziałowy wymagający weryfikacji treści (1.18)

---


---

## 21. Etap 2 — Audyt treści: Moduł 8 (Bezpieczeństwo i sytuacje awaryjne)

Siódmy audyt. Ten moduł już był zbiorem cross-cuttingowym z Rozdz. 6/11/12 — audyt treści ujawnia, że **hardware i AI dla tego samego podsystemu powinny być jednym ekranem**, nie dwoma osobnymi, bo user konfiguruje jedno urządzenie z jego logiką naraz.

| Funkcje | Temat | Wzorzec | Uwaga |
|---|---|---|---|
| 6.19 | Awaryjne źródło ciepła | D | |
| 6.25 | Bezpieczeństwo pożarowe przy dogrzewaniu paliwem stałym | D | |
| 11.51 | Siłowniki drzwi i zamki | D | |
| 11.52 + 12.51 | Moduł gaśniczy (sprzęt) + dowódca akcji gaśniczej (AI) | **D (scalone)** | ta sama instalacja gaśnicza, dwie warstwy opisu → jeden ekran |
| 11.53 | Wejścia centrali sygnalizacji pożaru | D | |
| 11.54 + 12.54 | UPS krytyczny (sprzęt) + zarządzanie AI | **D (scalone)** | |
| 11.55 + 12.52 | Oświetlenie awaryjne (sprzęt) + adaptacyjna ewakuacja (AI) | **D (scalone)** | |
| 11.56 + 12.56 | Klapy/wentylacja pożarowa (sprzęt) + kontrola AI | **D (scalone)** | |
| 12.53 | Predykcja ryzyka pożaru i zwarcia łukowego | D | dochodzi tu 12.23 z Modułu 10 — ten sam temat |
| 12.55 | Integracja z syreną, monitoringiem, służbami | D | |
| 12.57 | Autonomiczny audyt bezpieczeństwa pożarowego | **G** | |

**Wynik:** 15 funkcji → **11 ekranów** (4 pary sprzęt+AI scalone w jeden ekran każda).

---

## 22. Etap 2 — Audyt treści: Moduł 9 (Elektronika / ESP32 / sensoryka)

Ósmy audyt — tu pojawia się drugi nowy wzorzec: **H (Katalog komponentów)**. Różnica względem A: w A user wybiera JEDEN wariant z wykluczających się opcji. W H user **dodaje dowolną liczbę** elementów — sensorów, aktuatorów — bo realnie będzie miał 5 czujników temperatury, nie jeden.

| Funkcje | Temat | Wzorzec | Uwaga |
|---|---|---|---|
| 11.1, 11.2, 11.5 | Wybór płytki / zasilanie ESP32 / konfiguracja GPIO | D | kroki sekwencyjne konfiguracji, nie katalog |
| 11.3 | Montaż i obudowa w rozdzielni | F | |
| 11.4 | Komunikacja ESP32 z falownikiem/BMS/aplikacją | D | ekran-koncentrator dla katalogów komunikacji poniżej |
| 11.6–11.20, 11.40–11.45 | 21 czujników (napięcie, prąd, temperatura, dym, zalanie, ruch, jakość powietrza, wibracje, deszcz, wiatr, poziom wody, upływność...) | **H (scalone)** | jeden katalog "dodaj czujnik", 21 pozycji zamiast 21 ekranów |
| 11.21–11.26 | 6 aktuatorów (przekaźniki, MOSFET, PWM, SSR, styczniki, e-Fuse) | **H (scalone)** | katalog "dodaj wyjście sterujące" |
| 11.27, 11.28, 11.31, 11.46, 11.47, 11.48 | 6 protokołów komunikacji (RS485/Modbus, CAN, WiFi/BT, LoRa, Ethernet, MQTT) | **H (scalone)** | katalog łączności — tu też schodzi się kierunek na Meshtastic z §15.4 |
| 11.29, 11.30, 11.32–11.35, 11.49, 11.50 | 8 funkcji niezawodności (SD, RTC, superkondensator, watchdog, izolacja galwaniczna, ochrona przepięciowa, OTA, redundancja) | **D (scalone)** | jeden ekran z przełącznikami — to ustawienia (włącz/wyłącz), nie katalog wielokrotnego dodawania |
| 11.36–11.39 | 4 elementy UI lokalnego (OLED, dioda RGB, przyciski, buzzer) | **H (scalone)** | katalog "dodaj wskaźnik lokalny" |

**Wynik:** 50 funkcji → **10 ekranów**. Potwierdza wcześniejszy zgrubny szacunek ("~10 ekranów"), tym razem policzony rygorystycznie.

---

## 23. Etap 2 — Audyt treści: Moduł 10 (AI i prognozy)

Dziewiąty audyt — i największa niespodzianka w dokumencie. Duża część z 50 "funkcji AI" to nie osobne ekrany — to **właściwości działania AI w tle** (uczenie się, samokorekta), które nie potrzebują dedykowanego ekranu poza jednym miejscem transparentności w ustawieniach.

| Funkcje | Temat | Wzorzec | Uwaga |
|---|---|---|---|
| 12.1, 12.2, 12.3, 12.4, 12.5, 12.43 | Prognozy: PV 24h / zużycie 24h / miesięczna / SoC / szczyty / wizualizacja | **G (scalone)** | to UI silnika symulacji rocznej z §15.1 i prognozy pogody z §15.3 — nie osobny kalkulator |
| 12.6, 12.19, 12.24, 12.39, 12.40, 12.44, 12.45, 12.49, 12.50 | 9 funkcji "uczenia się/personalizacji" | **C (scalone)** | to własność działania AI w tle, nie 9 ekranów — jeden ekran transparentności, reszta dzieje się bez interfejsu |
| 12.7 | Automatyczny dobór źródeł zasilania | D | wykonawcza warstwa AI dla hierarchii z 3.36 (Moduł 4) |
| 12.8, 12.9 | Optymalizacja ładowania z PV / na podstawie prognoz | **D (scalone)** | |
| 12.10 | Dynamiczne przesuwanie zadań domowych | D | |
| 12.11, 12.42 | Rekomendacje ustawień / raporty z komentarzem AI | **G (scalone)** | |
| 12.12 | Ocena opłacalności magazynowania (AI) | **→ Moduł 4** | duplikat 3.25 (True Cost of Storage) |
| 12.13–12.18 | Anomalie: PV / zużycie / falownik / bateria / spadki produkcji / pompy-wentylacja | **D (scalone)** | jeden ekran wykrywania anomalii z selektorem podsystemu |
| 12.20, 12.21, 12.22 | AI ogrzewania: C.W.U. / zarządzanie / wentylacja | **D (scalone)** | |
| 12.23 | Wykrywanie zagrożeń pożarowych i zwarciowych | **→ Moduł 8** | duplikat 12.53 |
| 12.25–12.30, 12.46–12.48 | 9 funkcji AI wody | **D (scalone)** | jeden ekran "AI wody" z zakładkami |
| 12.31, 12.32, 12.33 | Prognoza burz śnieżnych / odśnieżanie / deficyt w mrozy | **D (scalone)** | |
| 12.34, 12.35 | Sprawdzanie i zarządzanie generatorem (AI) | **D (scalone)** | |
| 12.36 | Generalny audyt zimowy | G | |
| 12.37 | "Nigdy nie zabraknie ciepła, wody, powietrza" | *(nie ekran)* | zasada produktowa, nie funkcja UI |
| 12.38 | Interaktywne symulacje scenariuszy z AI | *(= §14.1)* | to Symulator awarii, już gamechanger — nie duplikować |
| 12.41 | Asystent głosowy z AI | *(inny typ interfejsu)* | głos, nie mieści się we wzorcach A–H — specyfikacja osobno na etapie 3 |

**Wynik:** 50 funkcji → **13 ekranów** — największa redukcja w dokumencie (74%).

---

## 24. Etap 2 — Audyt treści: Moduł 11 (Montaż baterii)

Dziesiąty audyt. Moduł w ogromnej większości to wzorzec **E (Checklist)** — sekwencje montażowe, nie kalkulatory. Obie ścieżki chemii audytowane osobno.

### Ścieżka A: LiFePO4

| Funkcje | Wzorzec |
|---|---|
| 9.1+9.8, 9.2+9.10, 9.3+9.11, 9.4+9.5+9.12, 9.6+9.13, 9.7+9.14+9.15 | **E (6 scaleń)** |
| 9.9, 9.16 | E |
| 9.17 | D (werdykt: ratować czy nie) |
| 9.18, 9.19, 9.20 | C |

**Wynik:** 20 → 12 ekranów.

### Ścieżka B: Kwasowo-ołowiowa

| Funkcje | Wzorzec |
|---|---|
| 10.1+10.8, 10.2+10.11, 10.3+10.10, 10.4+10.12, 10.7+10.14+10.15 | **E (5 scaleń)** |
| 10.5 | D (dobór kabli/bezpieczników) |
| 10.6, 10.9, 10.16 | E |
| 10.13, 10.17 | D |
| 10.18, 10.19, 10.20 | C |

**Wynik:** 20 → 14 ekranów.

**Obserwacja:** 8.70 z Modułu 12 ("ratowanie rozładowanego akumulatora") to trzeci wariant tematu z 9.17/10.17 — do weryfikacji na etapie 3.

**Wynik dla Modułu 11:** 40 funkcji → **26 ekranów**, zbudowanych z ok. 12 wielokrotnie używanych szablonów UI współdzielonych między chemiami.

---

## 25. Etap 2 — Audyt treści: Moduł 12 (Szybki kalkulator / tryb mobilny)

Jedenasty audyt, największy liczbowo. Wzorce "Kalkulator per urządzenie" i "Tryb zasilania X" okazały się rozsiane po całym rozdziale, nie tylko w numerach 8.23–36.

**Rozszerzenie istniejących modułów zbiorczych:** do kalkulatora per urządzenie dochodzi 8.15; do kreatora zasilania dochodzi 8 pozycji (8.17, 8.18, 8.19, 8.21, 8.48, 8.52, 8.53, 8.67).

**Nowe scalenia lokalne:** 8.9+8.41+8.42 (przetwornice, **A**) · 8.2+8.10 (zabezpieczenia, D) · 8.13+8.49 (kable/złączki, D) · 8.3+8.16 (szablony+kemping, **A**) · 8.40+8.43 (ładowanie z alternatora, B).

**Przeniesienie:** 8.44 → Moduł 13 (widżet Live, czwarty taki przypadek).

**Nowy ekran z napływu:** 1.22+1.23 z Modułu 2 → 1 [D] "Kalkulatory pomocnicze".

**Reszta** (35 funkcji) zostaje indywidualnie — realnie odrębne scenariusze bezpieczeństwa (medyczne, kamper, balkon, garaż).

**Wynik dla Modułu 12:** 72 funkcje → **43 ekrany**.

---

## 26. Etap 2 — Audyt treści: Moduł 13 (Tryb Live)

Dwunasty i ostatni audyt funkcyjny. Potwierdza się założenie z §15: to **2 realne ekrany** (Dashboard + Biblioteka widżetów), nie 33.

- **21 funkcji** zostaje widżetami bez zmian
- **7.1** to samo wejście w tryb Live (infra, nie widżet)
- **7.2, 7.3, 7.31** pokrywają się z systemami już opisanymi gdzie indziej (uczenie AI z Modułu 10, asystent głosowy z 12.41)
- **7.35, 7.36, 7.37 → Moduł 14** (role/uprawnienia, kopia zapasowa, aktualizacje — to ustawienia, nie widżety danych)
- **7.44 = §15.4** (Społeczność Off-Grid), **7.47 = §14.1** (Symulator awarii) — już opisane jako gamechangery, nie duplikować

**Widżety dochodzące z audytu innych modułów:** 2.48, 3.26, 6.33, 8.44 — 4 dodatkowe.

**Wynik dla Modułu 13:** 33 funkcje → **2 realne ekrany**, kryjące **27 pozycji** w bibliotece widżetów (22 własne + 4 z innych modułów + eksport).

---

## 27. Etap 2 — Podsumowanie końcowe

Wszystkie 13 modułów funkcyjnych przeaudytowane.

| Moduł | Surowe funkcje | Ekrany | Redukcja |
|---|---|---|---|
| 1. Lokalizacja | 4 | 4 | 0% |
| 2. Zapotrzebowanie | 50 | 18 | 64% |
| 3. Instalacja PV | 50 | 28 | 44% |
| 4. Baterie | 39 | 34 | 13% |
| 5. Okablowanie | 40 | 24 | 40% |
| 6. Ogrzewanie/pompa ciepła | 100 | 21 | 79% |
| 7. Stress-test zimowy | 40 | 26 | 35% |
| 8. Bezpieczeństwo | 15 | 11 | 27% |
| 9. Elektronika ESP32 | 50 | 10 | 80% |
| 10. AI i prognozy | 50 | 13 | 74% |
| 11. Montaż baterii | 40 | 26 | 35% |
| 12. Kalkulator mobilny | 70 (+2) | 43 | 40% |
| 13. Tryb Live | 33 | 2 (+27 widżetów) | — |
| **RAZEM** | **~581** | **~260 ekranów** | **~55%** |

**Trzy rzeczy, które audyt zmienił względem wcześniejszego zgrubnego szacunku (290–300 ekranów):**

1. **Duplikaty międzyrozdziałowe poza znanym MC4** — co najmniej 6 kolejnych: defrost pompy ciepła (1.14/5.6/6.8, potrójny), grzałki BMS (1.15/3.5+3.14), bezwładność cieplna budynku (5.8/6.11), mroźny start baterii (3.17/6.13), opłacalność magazynu (3.25/12.12), zagrożenia pożarowe (12.23/12.53), plus prawdopodobnie ratowanie baterii (9.17/10.17/8.70) — do weryfikacji na etapie 3.
2. **AI (Moduł 10) skurczył się drastyczniej niż zakładano** (74%) — duża część to własności działania systemu w tle, nie ekrany.
3. **Wzorce H (Katalog) i G (Raport) okazały się potrzebne szerzej** niż tam, gdzie je pierwotnie znaleziono.

**Etap 2 zamknięty.** Etap 3: pisanie realnej treści każdego ekranu wg szablonu z §3, w kolejności z §7 (Okablowanie → PV → Baterie → Ogrzewanie → reszta), zaczynając od pozycji "scalone" — tam trzeba napisać nowy, zintegrowany silnik oceny, nie tylko przenieść istniejący tekst.

---

**Wersja:** 2.1
**Data:** Sierpień 2026
**Zmiany względem 1.1:** korekta uzasadnienia w §11 (tooltip na klik nie irytuje), dodano §12 (import danych budynkowych z Kalkulatora Inżyniera Pro vs ręczne dodanie budynku, lista 23 dotkniętych funkcji)
**Zmiany względem 1.2:** dodano §13 (BOM, eksport PDF, tryb offline montażu, dokumentacja fotograficzna, porównanie projekt vs rzeczywistość, powiadomienia serwisowe, kreator szybkiego startu, normy regionalne jako parametr na przyszłość)
**Zmiany względem 1.3:** dodano §14 (symulator awarii, weryfikator oferty instalatora z analizą kosztową i argumentem gwarancyjnym, kontroler spójności między modułami, tryb quizowy, tryb awaryjny bez logowania, udostępnianie projektu jako link)
**Zmiany względem 1.4:** dodano §15 (silnik symulacji rocznej 8760h, baza rzeczywistych komponentów, prognoza pogody live w AI, Społeczność Off-Grid z opt-in mapą/wiadomościami i kierunkiem na Meshtastic, domknięcie pętli projekt→zakup)
**Zmiany względem 1.5:** doprecyzowano §2 (wzorce A–D to punkt startowy, nie zamknięta lista) i dodano wzorce E (Checklist weryfikacyjna) i F (Przewodnik z ilustracją); dodano §16 — pierwszy pełny audyt treści (Moduł 5, Okablowanie): 40 funkcji sklasyfikowanych, dodatkowe merge'e znalezione w treści (mega-Doradca doboru kabla, klaster szyn/połączeń), wynik: ~24 ekrany
**Zmiany względem 1.6:** dodano wzorzec G (Raport/Podsumowanie); dodano §17 — audyt treści Modułu 3 (PV): 50 funkcji sklasyfikowanych, mega-scalenie dopasowania PV do falownika (6→1), 2 przeniesienia międzymodułowe (SPD→Moduł 5, monitoring live→Moduł 13), wynik: 28 ekranów
**Zmiany względem 1.7:** dodano §18 — audyt treści Modułu 4 (Baterie): 39 funkcji sklasyfikowanych, 3 scalenia (grzałki BMS, SoH+rezystancja wewnętrzna, szyny+połączenia międzypakietowe), 2 przeniesienia międzymodułowe (gaszenie komory→Moduł 8, czarna skrzynka→Moduł 13), wynik: 34 ekrany, żaden nowy wzorzec nie był potrzebny
**Zmiany względem 1.8:** dodano §19 — audyt treści Modułu 6 (Ogrzewanie/pompa ciepła): 100 funkcji, 3 dodatkowe scalenia (dystrybucja ciepła, C.W.U., rekuperacja), 5.1 zidentyfikowane jako ekran importu budynkowego (wzorzec G), rozbicie silnika 74 czynników na budynkowe (auto-import z §12) vs sprzętowo-projektowe (ręczne), wynik: 21 ekranów — 79% redukcji, największa dotąd
**Zmiany względem 1.9:** dodano §20 — audyt Modułu 1 (Lokalizacja, 4 funkcje, bez zmian) i Modułu 2 (Zapotrzebowanie): 3 nowe scalenia lokalne, 4 funkcje przeniesione do innych modułów (w tym 2 duplikaty międzyrozdziałowe: defrost pompy ciepła i grzałki BMS opisane dwukrotnie w oryginale), wynik: 18 ekranów (64% redukcji)
**Zmiany względem 2.0:** dodano wzorzec H (Katalog komponentów); dodano §21–§26 — audyt pozostałych modułów (8 Bezpieczeństwo, 9 ESP32, 10 AI, 11 Montaż baterii, 12 Kalkulator mobilny, 13 Live); dodano §27 — podsumowanie końcowe etapu 2 z pełną tabelą wyników dla wszystkich 13 modułów (~579 funkcji → ~260 ekranów, 55% redukcji) i listą wykrytych duplikatów międzyrozdziałowych do weryfikacji na etapie 3
**Powiązane dokumenty:** Biblia_Offgrid_v2_0_Architektura_Modulowa.md
