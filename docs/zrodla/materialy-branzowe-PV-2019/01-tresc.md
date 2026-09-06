# "Bezpieczeństwo instalacji fotowoltaicznych" — pełna treść

Metoda ekstrakcji: tekst natywny PDF (zweryfikowany, nie skan) + odczyt wizualny stron dla tabel i
diagramów. Dokument dotyczy systemów PV **przyłączonych do sieci (on-grid)** — autor explicite
zaznacza we wstępie, że systemy wyspowe (off-grid), szczególnie ze względu na akumulatory, wymagają
odrębnego opracowania. Mimo to większość treści (bezpieczeństwo DC, łuk elektryczny, złącza,
ochrona przeciwpożarowa i odgromowa) dotyczy części instalacji wspólnej dla on-grid i off-grid.

## 1. Podstawy systemów PV

Słownik pojęć (1.1): fotowoltaika, ogniwo, moduł, łańcuch, generator, falownik, instalacja PV,
Wp, strona AC/DC, OSD, warunki STC (1000 W/m², 25°C, AM=1,5).

Klasyfikacja (1.2): wg miejsca instalacji (wolnostojące/na budynkach), mocy (mikroinstalacje ≤50kW,
małe instalacje 50kW-500kW, instalacje duże ≥500kW/1MW), technologii modułów (mono-/polikrystaliczne
najpowszechniejsze; cienkowarstwowe wymagają uziemienia jednego z połączeń łańcucha modułów —
galwaniczna izolacja wejścia/wyjścia falownika), technologii falowników (bezpieczniki
beztransformatorowe najpowszechniejsze — wymagają IMD i RCMU, patrz niżej).

Progi mocowe kodeksów sieciowych NC RfG (od 27.04.2019, obowiązujące w Polsce): A — 0,8kW do
200kW włącznie; B — 0,2MW do 10MW; C — 10MW do 75MW; D — powyżej 75MW lub przyłączone do sieci
≥110kV.

Kluczowe urządzenia monitorujące bezpieczeństwo falownika: **IMD** (Insulation Monitoring Device)
— mierzy rezystancję izolacji po stronie DC codziennie przed startem, zgodność z **PN-EN 62109-2:2011**;
**RCMU** (Residual Current Monitoring Unit) — reaguje na zmiany prądu upływu w czasie, RCD typu B.

## 2. Wymagania techniczne

**2.1** Analiza przyczyn wypadków pożarowych PV: ~1/3 błędów komponentów, ~1/3 złego planowania,
~1/3 błędów realizacji instalacji.

**2.2 Przepisy i normy.** Najważniejsza grupa: **PN-HD 60364, "Instalacje elektryczne niskiego
napięcia"**. Pełna tabela norm (Tabele 1-5, str. 8-9) — patrz sekcja osobna niżej w tym pliku.

**2.3 Wybór i ocena lokalizacji.** Czynniki: lokalizacja/szerokość geograficzna, nachylenie
powierzchni, azymut, przeszkody terenowe (zacienianie), wymagania projektowe (drogi
technologiczne/pożarowe, dobór falowników/linii, instalacje odgromowe), wymagania technologiczne
(dopuszczalne obciążenia dachu — wiatr/śnieg). Zacienianie modułu = ograniczenie produkcji energii +
ryzyko nieodwracalnego uszkodzenia modułu (hot-spot).

**2.4 Konstrukcje wsporcze.** Dwa zadania: ustawienie kąta/azymutu modułów + przeniesienie sił
(ciężar modułów, śnieg, wiatr). Rodzaje montażu: BIPV (zintegrowany z budynkiem), na dachu skośnym
(równolegle do połaci), na dachu płaskim (dedykowana podkonstrukcja, z uwzględnieniem balastu),
na elewacji, wolnostojący, wiaty/carporty. Uwaga prawna (Polska): instalacje PV o mocy ≤50kW na
budynkach nie wymagają pozwolenia na budowę ani zgłoszenia zamiaru budowy (Ustawa Prawo budowlane,
zmiana 2013, art. 29 ust. 2 pkt 16) — mimo to obliczenia projektowe (obciążenie konstrukcji dachu)
pozostają obowiązkowe merytorycznie, niezależnie od zwolnienia biurokratycznego.

**2.5 Obwody prądu stałego (DC).** Zalecenia: elementy/materiały dedykowane prądowi stałemu
(rozłączniki, bezpieczniki — niedopuszczalne elementy projektowane dla AC); przewody solarne o
odpowiedniej klasie izolacji napięciowej, odporne na UV, podwójna/wzmocniona izolacja; wykorzystanie
istniejących lub budowa nowych przepustów kablowych/rur/koryt o odpowiedniej klasie ogniowej;
skrzynki instalacyjne blisko modułów/falowników, min. II klasa wytrzymałości izolacyjnej, klasa IP
odpowiednia do warunków zewnętrznych, wentylacja przeciw kondensacji; zabezpieczenia bezpiecznikowe
łańcuchów modułów, ochrona przetężeniowa, ochrona przeciwprzepięciowa, ochrona przed dotykiem
bezpośrednim przy napięciach do 1000V; **wyłączniki pożarowe** — zagadnienie skomplikowane, przerwa
w obwodzie DC nie zatrzymuje generacji łańcucha modułów (nadal niebezpieczne dla strażaków) —
najlepsze rozwiązanie: zabezpieczenia zwierające moduły (zerowe napięcie), ale kosztowne; kompromis:
odpowiednie oznakowanie budynku + konsultacja z lokalną strażą pożarną; **spadki napięć na
przewodach między modułami a falownikiem <1%**.

**2.6 Obwody AC, falowniki.** Falownik w oddzielnym pomieszczeniu technicznym lub blisko rozdzielni
głównej; może być montowany na zewnątrz tylko jeśli producent to dopuszcza (ochrona przed
bezpośrednim promieniowaniem słonecznym ze względu na temperaturę); niewskazane w pomieszczeniach o
podwyższonej zawartości substancji żrących (amoniak — obory, kurniki, chlewnie) lub wilgotności;
montaż na podłożu niepalnym, przewodzącym i suchym; wentylacja; niedopuszczalne w sypialniach;
łatwo dostępny dla obsługi; zabezpieczenia nadprądowe i przepięciowe po stronie AC; **sprawność
europejska (euro-η) >95% (transformatorowe) / >97% (beztransformatorowe)**; **spadki napięć
<1%**; moduły cienkowarstwowe wymagające uziemienia bieguna → falownik z izolacją galwaniczną
wejścia/wyjścia (z transformatorem); licznik energii zgodny z wymaganiami OSD; wyłącznik główny
(rozłącznik bezpiecznikowy) w rozdzielnicy głównej budynku, z tabliczką informacyjną o instalacji PV
w widocznym miejscu; monitorowanie parametrów sieci — niedopuszczalna **wyspowa praca falownika
(off-grid)** ze względu na zagrożenie zdrowia/życia personelu serwisowego przy awarii sieci.

**2.7 Monitorowanie.** Bieżące i historyczne dane produkcji, informowanie o zakłóceniach, dostęp
24h/dobę z dowolnego miejsca, proaktywne powiadomienia SMS o nieprawidłowościach mających wpływ na
bezpieczeństwo.

**2.8 Pozostałe dokumenty do projektu.** Uzgodnienia z inwestorem; projekt architektoniczno-budowlany
budynku (najlepiej powykonawczy); projekt konstrukcji nośnej paneli i kanałów kablowych; warunki
przyłączenia do sieci (OSD); aktualna Instrukcja Ruchu i Eksploatacji Sieci Dystrybucyjnej (IRiESD);
dane meteorologiczne nasłonecznienia (np. bezpłatne narzędzie **PV-GIS**).

**2.9 Warunki odbioru — przeglądy i konserwacje.** Przegląd mechaniczny i elektryczny minimum raz w
roku — patrz Tabela 10 w sekcji tabel niżej.

## 3. Zagrożenia

**3.1 Pożar a systemy PV. Fakty i mity.** Powszechne, ale niesprawdzone/mitologiczne twierdzenia
zidentyfikowane w literaturze (Sepanski i inni 2015, BRE 2017): "strażacy nie ugaszą pożaru w
budynkach z PV na dachu"; "system PV znacznie zwiększa ryzyko pożaru"; "system PV zwiększa ryzyko
zranienia strażaków"; "wyłączenie instalacji PV na poziomie modułu zmniejsza ryzyko pożaru"; "nie
jest możliwe ugaszenie pożaru spowodowanego przez instalację PV"; "system PV zwiększa
prawdopodobieństwo trafienia budynku przez piorun" — wszystkie krytycznie zweryfikowane w Rozdziale
8 jako fałszywe lub przesadzone.

**3.2 Ryzyko pożaru a ryzyko dla strażaków** — dwie odrębne kategorie: ryzyko pożaru (prawdopodobieństwo
wystąpienia) i ryzyko dla osób ratujących (prawdopodobieństwo obrażeń podczas akcji). Redukcja
ryzyka pożaru pośrednio redukuje też ryzyko dla ratowników.

**3.3 Doświadczenie innych rynków:**
- **Niemcy** (TÜV Rheinland/Fraunhofer ISE, dane do 2013): 430 zgłoszonych szkód pożarowych na ~1,3
  mln instalacji PV = **0,016%** wszystkich systemów PV. Źródło błędu: Czynnik zewnętrzny 51%,
  Strona DC 19%, Moduły PV 12%, Falownik 10%, Strona AC 8%. Przyczyny: Czynnik zewnętrzny (np.
  wyładowanie atmosferyczne) 56%, Błąd montażu 18%, Awaria sprzętu 17%, Błąd projektu 9%.
- **Wielka Brytania** (BRE National Solar Centre, 2017, 7 lat danych): 58 zdarzeń pożarowych na ~1
  mln systemów PV = **0,0058%**. Źródło: Moduły PV 36%, Rozłącznik DC 30%, Wtyczki DC 16%,
  Falownik 11%, Kable DC 7%. Przyczyny: Nieznane 47%, Błąd montażu 26%, Czynnik zewnętrzny 15%,
  Awaria sprzętu 9%, Błąd projektu 3%.
- **Holandia** (TNO, 2018): 23 incydenty pożarowe wśród ~170 tys. domowych instalacji PV = **0,014%**.
  ~70% spowodowanych wadliwymi złączami DC, zwłaszcza złączami typu MC4 od różnych producentów.

Wniosek autora: pomijając kategorię "nieznany typ błędu", większość incydentów wynika z czynników
zewnętrznych i błędów instalacji — tylko ~9-17% weryfikuje się jako awaria sprzętu.

## 4. Najczęściej popełniane błędy w projektach i realizacjach

**4.1 Błędy na etapie projektowania.** Zła/zbyt ogólna/brakująca dokumentacja projektowa (mimo
prawnego wymogu uprawnień projektowych); zbyt rzadkie angażowanie projektantów konstrukcyjno-
budowlanych/rzeczoznawców budowlanych do oceny stanu konstrukcji dachu; pomijanie zakresów napięć
i prądów wejściowych falownika (temperatura wpływa na napięcie łańcucha — otwarty łańcuch przy
niskiej temperaturze może przekroczyć dopuszczalne napięcie falownika; przy wysokiej temperaturze
prąd maksymalny może nie osiągać wartości potrzebnej do efektywnej pracy); niespójne
rozmieszczenie modułów względem podkonstrukcji wsporczej (elegancki projekt na papierze może być
niespójny mechanicznie); dobór zabezpieczeń zarówno DC jak i AC (błędne pomijanie zabezpieczeń
łańcuchów prądu stałego, gdy są konieczne) — szczegóły w Rozdziale 6.

**4.2 Błędy na etapie realizacji.** Łuk elektryczny — najważniejsza przyczyna możliwego wybuchu
pożaru (**Tabela 6**, patrz sekcja tabel niżej): niekompatybilność wtyczek DC (różni producenci
MC4), słaba jakość zaciśnięcia miejscowego, wtyczki niewłożone całkowicie, uszkodzenie mechaniczne
skorodowane po nowej instalacji, uszkodzenie izolacji przewodu, gryzonie. Łuki szeregowe (w obrębie
jednego łańcucha, np. między ogniwami/na złączkach) częstsze niż równoległe (między różnymi
łańcuchami) — te ostatnie trudniejsze do identyfikacji, ale monitorowanie stanu izolacji DC przez
falownik daje ochronę pośrednią (eliminacja pierwszych symptomów zwarcia doziemnego zapobiega
większości przypadków łuku równoległego).

## 5. Łuk elektryczny: podstawy fizyczne i kwestie związane z DC

**5.1 Powstawanie łuku elektrycznego.** Wymaga poważnej usterki w bezpieczeństwie-istotnym
elemencie, niewykrytej zawczasu. Rozróżnienie: łuki równoległe i szeregowe. Łuk szeregowy: w
typowym systemie PV istnieją niezliczone punkty połączenia szeregowego (między ogniwami w module,
na złączkach przewodów — szczególnie przy złączach różnych producentów, w skrzynce
przyłączeniowej modułu, na zewnątrz modułu w skrzynkach połączeniowych DC, na złączach lub wewnątrz
falownika). Pogorszone/luźne połączenie → wzrost rezystancji styku → "gorący punkt" → materiał
kontaktowy dyfunduje/topi się → w pewnym momencie połączenie całkowicie się przerywa → łuk tworzy
się nad początkowo bardzo małą szczeliną powietrzną. Łuki równoległe mają zwykle mniejszą energię
niż szeregowe (część mocy nadal odkłada się na falowniku), ale trudniejsze do identyfikacji.

**5.2 Środki zapobiegania.** Miejsca ryzyka: moduł PV, połączenia i okablowanie, bezpieczniki,
przełączniki/punkty rozłączające, skrzynka przyłączeniowa generatora PV, falowniki, instalacja AC.
Największe ryzyko/łatwość zapobiegania: połączenia (złącza MC4) i okablowanie.

**5.3 Zasady prowadzenia przewodów.**
- **5.3.1 Kanały kablowe** — ochrona mechaniczna; końce/odgałęzienia kanałów bez ostrych krawędzi
  (ryzyko uszkodzenia izolacji); metalowe kanały mogą łagodzić skutki wyładowań łukowych (materiał
  niepalny).
- **5.3.2 Promienie gięcia** — patrz **Tabela 7** niżej. Przewody elastyczne do PV: promień gięcia
  nie mniejszy niż **4×D** (D = średnica zewnętrzna przewodu), z wyjątkiem szczegółowej tabeli.
- **5.3.3 Bezpieczny montaż przewodów.** Mocowanie chroni przed odkształceniami/przeciąganiem
  mechanicznym; nasadka zapobiega otarciu izolacji; opaski kablowe tylko do mocowania (nie
  przenoszenia obciążenia), odporne na UV na zewnątrz; odległości montażowe — patrz **Tabela 8**
  niżej (250mm poziomo/400mm pionowo minimum, gdy dane producenta niedostępne).
- **5.4 Zasady łączenia przewodów.**
  - **5.4.1 Kompatybilność złączy MC4.** Złącze MC4 (produkowane przez Multi-Contact/Stäubli od
    2017) stało się popularne; inni producenci dostosowują własne złącza do "typu MC4" bez
    dostępnych specyfikacji technicznych — **norma IEC 62852 (PN-EN 62852:2015) to norma
    bezpieczeństwa produktu, NIE testuje wzajemnej kompatybilności różnych złączy**. Doświadczenia
    innych krajów: połączenia złączami DC różnych producentów są szczególnie niebezpieczne, główna
    przyczyna awarii/pożarów. Przyczyny niekompatybilności: różne stopy metali (korozja
    kontaktowa), różne konstrukcje styków, brak zdefiniowanych tolerancji mechanicznych, nieujawniony
    materiał polimerowy części (ryzyko chemiczne/cieplne). **🔴 IEC 62548 i IEC 60364-7-712:2017
    NIE ZEZWALAJĄ na podłączanie złączy DC różnych producentów.** Rekomendacja producentów modułów:
    dostarczyć dodatkowe złącza tego samego producenta zamiast zastępować złącza na końcach
    łańcuchów innymi (ryzyko utraty gwarancji na moduł).
  - **5.4.2 Odciążenie** — złącza (wtyczka, skrzynka, itp.) powinny absorbować ograniczone siły
    (np. reduktor naprężeń dla przewodów 4-9mm wg IEC/EN 62852 może wytrzymać 80N); pozostałe
    obciążenia pochłonięte przez sposób układania.
  - **5.4.3 Odpowiednie zaprojektowanie i ustawienie złączy** — prawidłowe zaślepienie, zgodne ze
    specyfikacją producenta, bez naprężeń mechanicznych.
  - **5.4.4 Pozostałe zalecenia dot. złączy DC** — unikać łączenia wtyczek różnych producentów;
    unikać wnikania wody (wtyczki nie w bezpośrednim świetle słonecznym ani stałym zanurzeniu w
    wodzie).
- **5.5 Inne zalecenia dotyczące bezpieczeństwa.**
  - **5.5.1** Ograniczenie rozprzestrzeniania ognia — unikać łatwopalnych membran dachowych w
    strefie zapłonu łuku; odległości między przewodem a izolacją, materiały metalowe zamiast
    tworzących iskrę.
  - **5.5.2** Ochrona przewodów na dachu — wejścia kablowe wykonane profesjonalnie, bez ostrych
    krawędzi, bez przytwierdzania opasek do dachu (ryzyko grawitacji).
  - **5.5.3** Bezpieczne szafki rozdzielcze — zgodność z **PN-EN 61439-2**; poprawne podłączenie
    biegunów +/− w skrzynkach przyłączeniowych; rozłączniki DC — czyszczenie/wymiana min. raz w
    roku wg zaleceń niektórych producentów.
  - **5.6 Zalecenia dot. jakości materiałów.** Kable jednożyłowe PV oznaczone PV1-F, następnie
    H1Z2Z2-K (**PN-EN 50618**), izolacja klasy II. Złącza — wyłącznie zgodne z **PN-EN 62852**, tego
    samego typu i producenta. Kanały/korytka — metalowe preferowane, odporne na korozję; z tworzywa
    — odporne na UV/ozon. Tuleje wprowadzające kabel (np. DIN 18195 część 9). Uwaga ogólna — w
    obiektach rolniczych może być konieczna odporność na amoniak.

## 6. Ochrona odgromowa i przeciwprzepięciowa instalacji fotowoltaicznej

**6.1 Ochrona odgromowa.** System LPS (Lightning Protection System) projektowany wg **PN-EN 62305**
(wieloarkuszowa) nie gwarantuje absolutnej ochrony, redukuje istotnie ryzyko szkód po wyładowaniach
bezpośrednich/pobliskich. Kompleksowe podejście (strefy koncepcji ochrony LPZ). Kluczowe zasady: (1)
zachować odstęp separujący **s** między elementami LPS a panelami PV — obliczany wg pkt 6.3
PN-EN 62305-3; jeśli nie da się zachować, elementy PV muszą znaleźć się w przestrzeni ochronnej
zwodów (naddatkowa ochrona przed uderzeniem bezpośrednim); (2) elementy urządzenia piorunochronnego
nie mogą być bezpośrednio łączone z systemem paneli PV — separacja; (3) minimalna odległość między
zwodem pionowym a panelem PV, by nie powodować cienia (Rys. 20, wzór z niemieckiego załącznika Bbl.5
do DIN-EN 62305-3, zależny od średnicy zwodu i długości). Ochrona na dachu płaskim: maszty (zwody
pionowe) o wysokości 1000-4000mm, stal ocynkowana/aluminium/stal nierdzewna, w podstawach
betonowych (dobór wg katalogu producenta względem strefy wiatrowej/wysokości masztu).

**6.2 Ochrona przed przepięciami.** SPD (Surge Protective Device) — jedyne sensowne rozwiązanie
techniczne. Dobór typu (T1/T2) i miejsca montażu zależy od: obecności LPS na budynku, liczby
stringów, położenia falownika, odległości między rozdzielnicą a przekształtnikiem. Zasady: obiekt
**z** LPS → SPD typu 1 w rozdzielnicy głównej (odprowadzenie części prądu pioruna) + SPD typu 2 w
instalacji stałoprądowej DC do przekształtnika; jeśli odległość SPD-w-rozdzielnicy do przekształtnika
przekracza **10 m**, wymagany dodatkowy SPD typu 2 przy przekształtniku. Obiekt **bez** LPS, mały
(np. dom jednorodzinny), przekształtnik <10m od rozdzielnicy → SPD typ 1 o niskim poziomie ochrony w
rozdzielnicy może wystarczyć bez dodatkowego SPD typu 2. Przy odporności udarowej zwykłego modułu PV
(U_W(PV_Mod)) wyższej niż odporność przekształtnika (U_W(PV_INV)) — SPD typu 2 zalecany blisko
przekształtnika. Technologia SCI (Short Circuit Interruption) w ogranicznikach dedykowanych do PV —
bezpieczne przerwanie obwodu przy przeciążeniu/zestarzeniu ogranicznika, bez łuku elektrycznego.
Zalecenie dot. tras przewodów sygnałowych: unikać rozległych pętli induktywnych ("pętla masy") —
trasowanie przewodów łączących panele powinno minimalizować powierzchnię pętli.

## 7. Zagrożenia dla służb ratowniczych w razie pożaru

**7.1 Gaszenie pożarów instalacji elektrycznych pod napięciem.** Badania (Fraunhofer ISE 2017, BRE
National Solar Centre 2017): systemy PV nie stanowią szczególnego zagrożenia dla strażaków, o ile
przestrzegane są zasady bezpieczeństwa — instalacje PV mogą być obsługiwane tak jak inne instalacje
pod napięciem. Niemiecka norma **VDE 0132:2008** ("Gaszenie pożarów w instalacjach elektrycznych
lub w ich pobliżu") — minimalne odległości bezpieczeństwa dla służb ratowniczych — patrz **Tabela 9**
niżej. Test w Niemczech (Fire Retardants Online 2011): podpalono instalację PV z zamiarem
wykrycia wpływu pożaru na moduły — minimalne odległości bezpieczeństwa okazały się wystarczające,
brak nietypowych zagrożeń.

**7.2 Oznakowanie.** Zgodnie z **PN-HD 60364-7-712:2016**, oznakowanie instalacji PV wymagane w:
rozdzielni głównej budynku; obok głównego licznika energii (jeśli oddalony od rozdzielni głównej);
obok głównego wyłącznika; w rozdzielnicy przyłączonej do instalacji PV. Naklejka informacyjna z
symbolem domku i panelu (Rysunek 30 w oryginale). W każdym punkcie dostępu do części pod napięciem
strony DC — trwałe ostrzeżenie o możliwości zasilania z modułów PV nawet po wyłączeniu
falownika/AC/rozłącznika DC. Uwaga: falowniki mają zgromadzoną energię w kondensatorach, rozładowanie
do wartości bezpiecznych może zająć nawet kilka minut po odłączeniu separującym falownika od strony
DC i AC.

## 8. Bezpieczeństwo i ryzyko — zalecenia dla projektantów i wykonawców

Podsumowanie (na podstawie Fraunhofer ISE 2017, TÜV Rheinland/Sepanski 2017, BRE National Solar
Centre 2017a, IEA PVPS 2017): jasne/łatwo widoczne oznakowanie komponentów; zachowanie bezpiecznej
odległości (patrz Rozdział 8/9); rozłącznik DC — okresowe kształcenie i szkolenie strażaków
najważniejsze dla bezpieczeństwa (nie sam sprzęt). Krytyczna weryfikacja popularnych mitów z
Rozdziału 3.1 (wszystkie skonfrontowane z cytowanymi badaniami i uznane za fałszywe/przesadzone —
patrz lista w oryginale, str. 27).

## 9. Rekomendacje dotyczące inspekcji i konserwacji

Patrz **Tabela 10** niżej — harmonogram: codziennie (kontrola wyświetlacza falownika), monitoring
danych operacyjnych (regularnie, zdalnie), miesięcznie (licznik energii — wydajność), regularnie/
najrzadziej co 4 lata (kontrola wzrokowa modułów; powtórzenie pomiarów/testów zgodnie z **PN-EN
62446-1**), sytuacyjnie po automatycznym wyłączeniu falownika (rozwiązywanie problemów przez serwis).

## 10. Praca i bezpieczeństwo mikroinstalacji wg IRiESD

**10.1** Nastawy zadanych wartości mikroinstalacji muszą być odczytywalne z mikroinstalacji
(bezpośrednio z falownika, jeśli przyłączona przez falownik). Tabliczka znamionowa mikroinstalacji:
nazwa producenta/typ/nr identyfikacyjny, moc znamionowa, napięcie znamionowe, częstotliwość
znamionowa, zakres regulacji współczynnika przesunięcia fazowego. Informacje po polsku, numer
seryjny, etykiety ostrzegawcze w miejscach z elementami pod napięciem.

**10.2** Wymagania dot. przekazania do eksploatacji: instrukcja montażu zgodna z normami i
wymaganiami krajowymi; urządzenia wchodzące w skład mikroinstalacji — badania typu wg odpowiednich
norm współpracy z siecią; montaż przez instalatorów z odpowiednimi/potwierdzonymi kwalifikacjami;
właściciel musi dysponować schematem jednokresowym mikroinstalacji przygotowanym przez instalatora.

**Tabela 11 — wymagania mikroinstalacji wg mocy zainstalowanej Pn [kW]** (uzupełniona 06.09.2026 z
wersji `.docx`, dokładniejsza struktura niż pierwotny odczyt wizualny):

| Wymaganie | Pn ≤ 3,68 kW | 3,68 < Pn ≤ 10 kW | 10 < Pn ≤ 40 kW |
|---|---|---|---|
| Zdalne sterowanie mocą czynną i zdalne odłączenie mikroinstalacji (zaprzestanie generacji do sieci) | — | — | Wymagane |
| Regulacja mocy biernej wg zadanej charakterystyki Q(U) i cos φ(P) | — | TAK | TAK |
| Układ zabezpieczeń nad-/podnapięciowych, nad-/podczęstotliwościowych i od pracy wyspowej | Zintegrowany z falownikiem | Zintegrowany z falownikiem | Zintegrowany z falownikiem |
| Sposób przyłączenia | 1-fazowo lub 3-fazowo | — | 3-fazowo |

(Progi mocy pochodzą z Instrukcji Ruchu i Eksploatacji Sieci Dystrybucyjnej — IRiESD, wspomnianej w
sekcji 2.8 wyżej.)

---

## Tabele źródłowe (dane liczbowe, zweryfikowane wizualnie)

### Tabela 6 — Najczęstsze przyczyny wystąpienia łuku elektrycznego wg komponentu (jakościowa, nie liczbowa)

| Komponent | Możliwa przyczyna |
|---|---|
| Wtyczka DC | niedopasowanie wtyczek różnych producentów (5.4.1); słabe zaciśnięcie na miejscu instalacji; wtyczki niewłożone całkowicie; wtyczka mechanicznie uszkodzona lub skorodowana po nowej instalacji; warunki atmosferyczne, ugryzienie zwierząt; wtyczka słabo zaciśnięta na etapie produkcji |
| Zaciski śrubowe w rozdzielnicy lub falowniku (strona DC) | styk niedokładnie dokręcony, kabel niewystarczająco głęboko włożony; zbyt duży moment dokręcający skutkujący zerwaniem zacisku śrubowego; niedowymiarowane, ułożone zbyt blisko siebie lub nie za żywe przewody; zacisk dokręcony na izolacji, nie na żyle przewodu |
| Połączenie lutowane (w module) | złe podłączenie lutowia, starzenie z powodu naprężeń mechanicznych/termicznych |
| Dioda by-pass | przepięcie z powodu burzy lub przepięcia łączeniowe w systemie; długotrwałe działanie przeciążenia termicznego |
| Moduł | uszkodzenia ogniw (mikropęknięcia), zerwane złącza ogniw, pęknięcia ogniw/pęknięcia szkła |
| Bezpieczniki DC | nieprawidłowo dobrane bezpieczniki, niewłaściwa instalacja |
| Kabel DC | długotrwałe działanie związane z pogodą (promieniowanie UV, wilgotność, zmiana temperatury); uszkodzenie spowodowane niewłaściwą instalacją (załamania), ugryzienia zwierząt |
| Wyłącznik prądu stałego | nieodpowiednia dla instalacji DC |
| Skrzynka przyłączeniowa | złe połączenie lutowane; starzenie się z powodu stresu mechanicznego/termicznego |
| Ogólne błędy instalacji | niewłaściwy stopień ochrony (wilgotność, kurz); ostrożne wtórnie wprowadzenie kabla i dławik PG |

### Tabela 7 — Przykładowe dopuszczalne promienie zginania przewodu (potwierdzić z danymi producenta)

| Średnica zewnętrzna przewodu D [mm] | Dopuszczalny promień — przewody sztywne | Dopuszczalny promień — przewody elastyczne |
|---|---|---|
| < 8 | 4 × D | 3 × D |
| 8 < D < 12 | 5 × D | 3 × D |
| D > 12 | 6 × D | 4 × D |

### Tabela 8 — Maksymalne odległości montażu przewodów (chyba że producent określa inne)

| Średnica zewnętrzna przewodu D [mm] | Odległość montażowa poziomo [mm] | Odległość montażowa pionowo [mm] |
|---|---|---|
| < 9 | 250 | 400 |
| 9 < D < 15 | 300 | 400 |
| 15 < D < 20 | 350 | 450 |
| 20 < D < 40 | 400 | 500 |

### Tabela 9 — Wartości orientacyjne minimalnych odległości gaszenia instalacji pod napięciem (wg DIN VDE 0132)

| Wylot DIN 14365-CM | Niskie napięcie (≤1kV AC, ≤1,5kV DC) | Wysokie napięcie (≥1kV AC, ≥1,5kV DC) |
|---|---|---|
| Rozproszony (strumień cieczy rozpylonej) | 1 m | 5 m |
| Pełny (zwarty strumień cieczy) | 5 m | 10 m |

### Tabela 10 — Zalecenia dotyczące konserwacji i inspekcji instalacji PV

| Kiedy | Gdzie | Co | Kto | Uwagi |
|---|---|---|---|---|
| Codziennie | Falownik | Kontrola wyświetlacza roboczego w celu uniknięcia utraty wydajności przy wyłączeniach awaryjnych | Operator | Alternatywnie: monitorowanie z aktywnym raportowaniem o błędzie do operatora |
| — | Monitoring danych operacyjnych (system) | Kontrola stanu pracy za pomocą zdalnego monitorowania (w przypadku ochrony przeciwpożarowej należy zwrócić szczególną uwagę na błędy izolacji) | Operator/serwis | — |
| — | — | Analiza komunikatów o błędach i podejmowanie odpowiednich działań | Serwis | — |
| Miesięcznie | Licznik energii | Monitorowanie wydajności: regularnie rejestruj i analizuj odczyty licznika (nie dotyczy automatycznego gromadzenia i oceny danych operacyjnych) | Operator/serwis | — |
| Regularnie, najrzadziej co cztery lata | Powierzchnia modułów | Kontrola wzrokowa, czy występują poważne, oczywiste wady, także takie jak przesunięte moduły, luźne zaciski, elementy ram montażowych lub kable solarne | Operator | Przemieszczanie się w okolicy pola modułów tylko po zatwierdzonych trasach! |
| — | Cała instalacja | Powtórzenie pomiarów i testów przy uruchamianiu zgodnie z PN-EN 62446-1 | Serwis | — |
| Sytuacyjne — po automatycznym wyłączeniu falownika | Cała instalacja | Rozwiązywanie problemów | Serwis | — |

### Tabela 1-5 (str. 8-9) — Wykaz norm związanych z projektowaniem/montażem/bezpieczeństwem instalacji PV

**[06.09.2026 — LISTA UZUPEŁNIONA]** Właściciel projektu dostarczył wersję `.docx` tego samego
dokumentu (konwersja z PDF zachowująca natywne tabele) — pozwoliło to wydobyć dokładny, numerowany
tekst 34 z 43 pozycji bez ryzyka pominięcia szczegółu przy odczycie wizualnym. **9 pozycji (#2, #6,
#10, #13, #17, #27, #29, #33, #37) zgubiło się przy konwersji PPTX→DOCX** (prawdopodobnie na
granicach slajdów) i pozostają nieznane — do sprawdzenia względem oryginalnego pliku, jeśli
którejś z nich zabraknie przy realnej potrzebie.

| # | Numer normy | Wersja językowa | Opis |
|---|---|---|---|
| 1 | PN-EN 50565-1:2014-11 | polska | Przewody elektryczne — Wytyczne stosowania przewodów na napięcie znamionowe nieprzekraczające 450/750 V (U0/U) — Część 1: Wskazówki ogólne |
| 2 | *(nieznana — zgubiona w konwersji)* | — | — |
| 3 | PN-HD 60364-5-54:2011 | polska | Instalacje elektryczne niskiego napięcia — Część 5-54: Dobór i montaż wyposażenia elektrycznego — Układy uziemiające i przewody ochronne |
| 4 | PN-EN 61140:2016-07 | angielska | Ochrona przed porażeniem prądem elektrycznym — Wspólne aspekty instalacji i urządzeń |
| 5 | PN-EN 61439-2:2011 | polska | Rozdzielnice i sterownice niskonapięciowe — Część 2: Rozdzielnice i sterownice do rozdziału energii elektrycznej |
| 6 | *(nieznana — zgubiona w konwersji)* | — | — |
| 7 | **PN-EN 62305-2:2011** | polska | Ochrona odgromowa — Część 2: Zarządzanie ryzykiem |
| 8 | **PN-EN 62305-3:2011** | polska | Ochrona odgromowa — Część 3: Uszkodzenia fizyczne obiektów i zagrożenie życia |
| 9 | **PN-EN 62305-4:2011** | polska | Ochrona odgromowa — Część 4: Urządzenia elektryczne i elektroniczne w obiektach |
| 10 | *(nieznana — zgubiona w konwersji)* | — | — |
| 11 | N SEP-E 004 | polska | Elektroenergetyczne i sygnalizacyjne linie kablowe. Projektowanie i budowa |
| 12 | N SEP-E 005 | polska | Dobór przewodów elektrycznych do urządzeń, których funkcjonowanie jest niezbędne w czasie pożaru |
| 13 | *(nieznana — zgubiona w konwersji)* | — | — |
| 14 | PN-EN 60269-6:2011 | angielska | Bezpieczniki topikowe niskonapięciowe — Część 6: Wymagania dodatkowe dotyczące wkładek topikowych do zabezpieczania fotowoltaicznych systemów energetycznych |
| 15 | **PN-HD 60364-7-712:2016-05** | polska | Instalacje elektryczne niskiego napięcia — Część 7-712: Wymagania dotyczące specjalnych instalacji lub lokalizacji — Fotowoltaiczne (PV) układy zasilania — **najważniejsza norma specyficznie dla PV**; mamy dziś tylko wyciąg (spis treści+bibliografia), patrz `docs/zrodla/norma-HD-60364-7-712/` |
| 16 | PN-EN 61173:2002 | polska | Ochrona przepięciowa fotowoltaicznych (PV) systemów wytwarzania mocy elektrycznej — Przewodnik |
| 17 | *(nieznana — zgubiona w konwersji)* | — | — |
| 18 | PN-EN 61724-1:2017-10 | angielska | Wydajność systemu fotowoltaicznego — Część 1: Monitorowanie |
| 19 | PN-EN 61727:2002 | angielska | Systemy fotowoltaiczne (PV) — Charakterystyki uniwersalnych złączy standardowych |
| 20 | PN-EN 62446-1:2016-08 | angielska | Systemy fotowoltaiczne (PV) — Wymagania dotyczące badań, dokumentacji i utrzymania — Część 1: Systemy podłączone do sieci — Dokumentacja, odbiory i nadzór |
| 21 | IEC 62446-2 (nieobowiązująca w Polsce) | angielska | j.w. — Część 2: Konserwacja systemów podłączonych do sieci |
| 22 | PN-EN 62852:2015-05 | angielska | Złącza DC stosowane w systemach fotowoltaicznych — Wymagania bezpieczeństwa i badania |
| 23 | PN-EN 50380:2018-04 | angielska | Wymagania dotyczące oznakowania i dokumentacji modułów fotowoltaicznych |
| 24 | PN-EN 60904-1:2007 | angielska | Elementy fotowoltaiczne — Część 1: Pomiar charakterystyk prądowo-napięciowych elementów fotowoltaicznych |
| 25 | PN-EN 61215-1:2017-01 | angielska | Moduły fotowoltaiczne (PV) do zastosowań naziemnych — Kwalifikacja konstrukcji i aprobata typu — Część 1: Wymagania dotyczące badań |
| 26 | PN-EN 61215-2:2017-05 | angielska | j.w. — Część 2: Metody badań |
| 27 | *(nieznana — zgubiona w konwersji)* | — | — |
| 28 | PN-EN IEC 61730-2:2018-06 | angielska | Ocena bezpieczeństwa modułu fotowoltaicznego (PV) — Część 2: Wymagania dotyczące badań |
| 29 | *(nieznana — zgubiona w konwersji, prawdopodobnie 61730-1 wg wcześniejszego odczytu wizualnego)* | — | — |
| 30 | PN-EN 50524:2009 | angielska | Karta danych i tabliczka znamionowa falowników do systemów fotowoltaicznych |
| 31 | PN-EN 50530:2010 | angielska | Całkowita sprawność falowników fotowoltaicznych |
| 32 | PN-EN 50549-1:2019-02 (zastępuje PN-EN 50438) | angielska | Wymagania dla instalacji generacyjnych przeznaczonych do równoległego przyłączania do publicznych sieci dystrybucyjnych — Część 1: Przyłączanie do sieci dystrybucyjnej nN — Instalacje generacyjne aż do typu B włącznie |
| 33 | *(nieznana — zgubiona w konwersji, prawdopodobnie 50549-2 wg wcześniejszego odczytu wizualnego)* | — | — |
| 34 | PN-EN 61000 (seria) | — | Seria norm dotycząca kompatybilności elektromagnetycznej (EMC) |
| 35 | **PN-EN 62109-1:2010** | angielska | Bezpieczeństwo konwerterów mocy stosowanych w fotowoltaicznych systemach energetycznych — Część 1: Wymagania ogólne |
| 36 | **PN-EN 62109-2:2011** | angielska | j.w. — Część 2: Wymagania szczegółowe dotyczące falowników — **mamy dziś pełną treść (IEC 62109-2), patrz `docs/zrodla/norma-IEC-62109-2/`** |
| 37 | *(nieznana — zgubiona w konwersji, prawdopodobnie 62116 wg wcześniejszego odczytu wizualnego)* | — | — |
| 38 | PN-EN 61194:2002 | polska | Parametry charakterystyczne autonomicznych systemów fotowoltaicznych (PV) — **off-grid** |
| 39 | PN-EN 62124:2005 | angielska | Systemy fotowoltaiczne (PV) wolnostojące — Weryfikacja projektu — **off-grid** |
| 40 | PN-EN 50521:2009 (norma wycofana) | angielska | Złącza elektryczne do zastosowań w systemach fotowoltaicznych — Wymagania bezpieczeństwa i badania |
| 41 | PN-EN 62093:2005 | angielska | Elementy uzupełniające w systemach fotowoltaicznych — Założenia kwalifikacyjne dla środowiska naturalnego |
| 42 | **PN-EN 61427-1:2013-12** | angielska | Wtórne ogniwa i akumulatory wykorzystywane do magazynowania energii w systemach energetyki odnawialnej — Część 1: Zastosowanie w systemach fotowoltaicznych **niepodłączonych do publicznej sieci energetycznej** — bezpośrednio dotyczy off-grid + akumulatorów |
| 43 | PN-EN 62509:2011 | angielska | Urządzenia kontrolujące proces ładowania akumulatorów w systemach fotowoltaicznych — Parametry i działanie |
