# Materiał źródłowy — Kalkulator, poradnik i FAQ dla przedsiębiorców (taryfy C, PV, magazyny energii)

**Status:** materiał surowy, zapisany 1:1 od właściciela projektu (28.09.2026), **bez zmian
treści** — zgodnie z zasadą `docs/zrodla/README.md` i GOD BOOK B.5. Dokument 1 z 2 dostarczonych
tego dnia (drugi: `Material_Stawki_Dystrybucyjne_OSD_2026_2026-09-28.md`).

**Pochodzenie:** prawdopodobnie wygenerowany przez inne narzędzie AI (styl i zakończenie drugiego
dokumentu tej samej dostawy) — **podwyższona czujność wg standardu 15.1b**. Weryfikacja
merytoryczna, poprawki (✏️) i uzupełnienia trafiają do opracowania/Biblii, nie do tego pliku
(GOD BOOK Część D.7). Wyniki weryfikacji: `docs/memory.md`, wpis z 28.09.2026 „Nowy materiał
źródłowy — rozliczenia energii (gospodarstwo / przedsiębiorca)”.

**Przypisanie do modułu: NIEROZSTRZYGNIĘTE** — nowa domena (rozliczenia z siecią), do decyzji
właściciela.

---

Dokument źródłowy: Kalkulator, poradnik i FAQ dla przedsiębiorców – energia elektryczna, taryfy C, fotowoltaika i magazyny energii

Część 1: Struktura rachunku za energię elektryczną dla przedsiębiorcy

Rachunek za energię elektryczną dla firmy rozliczanej w grupie taryfowej C różni się zasadniczo od rachunku gospodarstwa domowego. Składa się z dwóch głównych części: opłaty za sprzedaż energii (towar) oraz opłaty dystrybucyjnej (dostawa), zatwierdzanej przez Prezesa URE.

Składnik rachunku Charakter Kto ustala Od czego zależy
Cena energii czynnej zmienny (zł/MWh) Sprzedawca (negocjowana) Taryfa (C11, C12a, C21 itd.), profil zużycia
Opłata sieciowa zmienna zmienny (zł/kWh) OSD Taryfa, strefa czasowa
Opłata sieciowa stała stały (zł/kW/miesiąc) OSD Moc umowna
Opłata mocowa zmienny (zł/kWh) URE (stawka) Zużycie w godzinach szczytu (7:00–22:00 w dni robocze)
Opłata jakościowa zmienny (zł/kWh) URE (stawka) Zużycie energii
Opłata OZE zmienny (zł/MWh) URE (stawka) Zużycie energii
Opłata kogeneracyjna zmienny (zł/MWh) URE (stawka) Zużycie energii
Opłata za moc bierną zmienny (zł) OSD Przekroczenie współczynnika tgφ₀
Opłata za przekroczenie mocy umownej zmienny (zł) OSD Przekroczenie mocy umownej
Akcyza zmienny (zł/MWh) Ustawa Zużycie energii
VAT 23% Ustawa Suma wszystkich składników

Kluczowa różnica względem gospodarstw domowych: Przedsiębiorcy w taryfie C płacą za moc bierną (jeśli przekroczą współczynnik tgφ₀) oraz za przekroczenie mocy umownej. Dodatkowo opłata mocowa dla firm jest znacznie wyższa – w 2026 roku wynosi 0,2194 zł/kWh netto (219,40 zł/MWh) za energię pobraną w dni robocze w godzinach 7:00–22:00.

Średni koszt energii dla MŚP w 2026 r. to ok. 500–750 zł/MWh netto za energię czynną plus opłaty dystrybucyjne. Całkowity rachunek zależy od taryfy (C11/C12a/C21/C22a), mocy zamówionej i profilu zużycia.

---

Część 2: Taryfy dla przedsiębiorców – grupa C

Grupa taryfowa C dedykowana jest małym i średnim przedsiębiorcom, w tym sklepom, punktom handlowo-usługowym oraz gospodarstwom rolnym. Od 2008 roku ceny za taryfę C nie są regulowane przez Prezesa URE – sprzedawca nie ma obowiązku przedkładania stawek do zatwierdzenia.

Odbiorców taryfy C można podzielić na dwie zasadnicze grupy:

· Zasilani z sieci niskiego napięcia o mocy umownej poniżej 40 kW – taryfy C11, C12a, C12b
· Zasilani z sieci niskiego napięcia o mocy umownej powyżej 40 kW – taryfy C21, C22a, C22b

2.1. Taryfy dla mocy umownej poniżej 40 kW

C11 – jednostrefowa

· Charakterystyka: Stała stawka za kWh przez całą dobę.
· Dla kogo: Mały sklep, biuro, warsztat – zużycie równomierne.
· Zalety: Prostota, przewidywalność.
· Wady: Brak możliwości obniżenia kosztów poprzez przesunięcie zużycia.

C12a – dwustrefowa (szczyt/pozaszczyt)

· Charakterystyka: Dwie strefy: szczytowa (droższa) i pozaszczytowa (tańsza).
· Dla kogo: Firmy mogące przesunąć znaczną część zużycia na godziny pozaszczytowe.
· Warunek opłacalności: Zużycie w strefie pozaszczytowej musi przekraczać określony próg.

C12b – dwustrefowa (dzień/noc)

· Charakterystyka: Podobna do C12a, ale z innymi godzinami stref.
· Dla kogo: Firmy o specyficznym profilu dobowym.

2.2. Taryfy dla mocy umownej powyżej 40 kW

C21 – jednostrefowa

· Charakterystyka: Stała stawka za kWh, opłata za moc umowną.
· Dla kogo: Większe firmy o równomiernym zużyciu.
· Dodatkowe opłaty: Opłata za przekroczenie mocy umownej.

C22a / C22b – dwustrefowe

· Charakterystyka: Dwie strefy czasowe, opłata za moc umowną.
· Dla kogo: Firmy mogące zarządzać profilem zużycia.

Tabela porównawcza taryf C:

Taryfa Moc umowna Liczba stref Dla kogo Opłata za moc bierną
C11 do 40 kW 1 małe firmy, równomierne zużycie Tak (jeśli tgφ > tgφ₀)
C12a do 40 kW 2 firmy z przesunięciem na pozaszczyt Tak
C12b do 40 kW 2 firmy o specyficznym profilu Tak
C21 powyżej 40 kW 1 większe firmy Tak
C22a powyżej 40 kW 2 firmy zarządzające profilem Tak

---

Część 3: Moc bierna – kluczowa różnica dla przedsiębiorców

3.1. Kiedy firma płaci za moc bierną?

Rozliczeniami za pobór energii biernej objęci są odbiorcy zasilani z sieci średniego i wysokiego napięcia, a także – w określonych przypadkach – odbiorcy zasilani z sieci niskiego napięcia (czyli m.in. firmy w taryfie C).

Opłacie podlega ponadumowny pobór energii biernej, czyli:

· Nadwyżka energii biernej indukcyjnej ponad ilość odpowiadającą wartości współczynnika tgφ₀
· Indukcyjny współczynnik mocy przy braku poboru energii czynnej
· Pojemnościowy współczynnik mocy (przekompensowanie)

3.2. Współczynnik tgφ₀ – wartość domyślna

Wartość współczynnika mocy tgφ₀ przyjmuje się w wysokości 0,4, chyba że indywidualna ekspertyza uzasadnia wprowadzenie niższej wartości. Jeśli wartość tgφ₀ nie została określona w warunkach przyłączenia lub umowie, do rozliczeń przyjmuje się tgφ₀ = 0,4.

Co to oznacza w praktyce? Jeśli współczynnik mocy tgφ w Twojej firmie przekracza 0,4, płacisz karę za nadwyżkę energii biernej. Wzór na opłatę:

O_b = k × C_rk × [(1 + tg²φ) / (1 + tg²φ₀) − 1] × A

gdzie:

· O_b – opłata za nadwyżkę energii biernej [zł]
· k – krotność (określona w taryfie)
· C_rk – cena energii czynnej [zł/kWh]
· A – energia czynna pobrana [kWh]

3.3. Jak uniknąć opłat za moc bierną?

1. Kompensacja mocy biernej – instalacja baterii kondensatorów, która kompensuje pobór mocy biernej indukcyjnej.
2. Optymalizacja pracy urządzeń – unikanie pracy silników indukcyjnych na biegu jałowym.
3. Analiza profilu tgφ – regularne monitorowanie współczynnika mocy i dostosowanie kompensacji.

3.4. Opłata za przekroczenie mocy umownej

Operator prowadzi kontrolę mocy pobranej dla odbiorców w grupach taryfowych C21, C21em, C11 i C11em. Opłatę za przekroczenie mocy umownej oblicza się od wartości przekraczającej łączną moc umowną.

Jak uniknąć opłat?

· Dostosowanie mocy umownej do rzeczywistego zapotrzebowania.
· Zarządzanie szczytowym poborem mocy (np. poprzez systemy EMS).
· Unikanie jednoczesnego włączania urządzeń o dużym poborze mocy.

---

Część 4: Net-billing dla przedsiębiorców

Od 1 kwietnia 2022 roku sprzedaż energii z fotowoltaiki odbywa się w systemie net-billing. Dotyczy on posiadaczy mikroinstalacji OZE o mocy do 50 kWp, którzy złożyli wnioski o przyłączenie po tej dacie.

4.1. Jak działa net-billing dla firm?

1. Prosument (firma) zużywa energię z PV na bieżąco – ta energia nie jest nigdzie sprzedawana.
2. Nadwyżki energii są oddawane do sieci i sprzedawane po Rynkowej Cenie Energii (RCE) – godzinowej cenie wyznaczanej przez TGE.
3. Wartość sprzedanej energii trafia na indywidualny depozyt prosumencki – wirtualne konto, którym firma może opłacać pobór energii z sieci.
4. Depozyt jest ważny 12 miesięcy – umożliwia bilansowanie sezonowe między miesiącami o wysokim nasłonecznieniu a okresem zimowym.

4.2. Współczynnik korekcyjny 1,23

Wartość depozytu prosumenckiego jest zwiększana o współczynnik 1,23 (wzrost o 23%). Przepisy wprowadzające ten współczynnik weszły w życie 1 lutego 2025 roku.

Przykład obliczeniowy: Przy nadwyżce 2 MWh miesięcznie i średniej cenie rynkowej 450 zł/MWh, saldo na depozycie po uwzględnieniu korekty 1,23 wyniesie 1 107 zł (2 MWh × 450 zł × 1,23).

4.3. Autokonsumpcja – klucz do opłacalności

W net-billingu im wyższa autokonsumpcja, tym większe oszczędności. Nadwyżka energii oddawana do sieci ma niższą wartość niż energia zużywana bezpośrednio.

Realny współczynnik bilansowania (stosunek wartości energii oddanej do wartości energii pobranej) spada do 0,3–0,4 przy rozliczeniu godzinowym (RCE).

Strategie zwiększania autokonsumpcji:

· Dostosowanie profilu produkcji do profilu zużycia (np. praca urządzeń w godzinach szczytu PV).
· Instalacja magazynu energii.
· Zarządzanie ładowaniem pojazdów elektrycznych.
· Wykorzystanie systemów EMS (Energy Management System).

4.4. Skutki podatkowe net-billingu dla firm

Zgodnie z interpretacją indywidualną Dyrektora KIS z 5 maja 2025 r. (sygn. 0114-KDIP2-2.4010.124.2025.2.ASK):

· Nadwyżka energii wyrażona depozytem nie stanowi przychodu na gruncie CIT.
· Wprowadzona nadwyżka energii podlega opodatkowaniu jako przychód podatkowy.

Przedsiębiorcy są zwolnieni z odprowadzania podatku dochodowego i akcyzy w związku ze sprzedażą zielonej energii z fotowoltaiki.

---

Część 5: Magazyny energii dla firm (BESS)

5.1. Czym jest BESS?

BESS (Battery Energy Storage System) to bateryjny system magazynowania energii, obejmujący ogniwa, układ zarządzania (BMS), przekształtnik (PCS) oraz infrastrukturę łączącą magazyn z siecią. Nad całością pracuje Energy Management System (EMS), który decyduje o momentach ładowania i rozładowywania na podstawie taryfy, prognozy produkcji z PV i bieżącego profilu zużycia.

5.2. Dlaczego magazyn energii staje się priorytetem dla firm?

Trzy zjawiska wypchnęły magazynowanie energii z laboratoriów do budżetów inwestycyjnych:

1. Odmowy przyłączeń do sieci energetycznej.
2. Rekordowa liczba godzin z ujemnymi cenami energii.
3. Rozjazd między ceną RCEm a kosztem zakupu prądu.

Ponad 54% energii elektrycznej w Polsce nadal pochodzi z węgla, więc autokonsumpcja stała się dla przemysłu najtańszą drogą do obniżenia rachunków i emisji.

5.3. Opłacalność magazynu energii dla firmy

Bateryjne systemy magazynowania energii dla przedsiębiorstw kosztują w Polsce od 1 400 do 2 500 zł za kWh pojemności, a przy poprawnie policzonym modelu przychodowym zwracają się w 5–8 lat.

Pięć strumieni przychodu z BESS:

1. Zwiększenie autokonsumpcji – energia z PV zamiast być oddawana do sieci po niskiej cenie, jest magazynowana i zużywana wieczorem.
2. Arbitraż cenowy – ładowanie w godzinach najtańszej energii i rozładowywanie w szczycie.
3. Redukcja opłat za moc – magazyn może zmniejszyć szczytowy pobór mocy, obniżając opłatę za moc umowną.
4. Udział w rynkach usług systemowych – magazyn może świadczyć usługi na rzecz operatora systemu.
5. Redukcja opłaty mocowej – przesunięcie poboru energii poza godziny szczytu (7:00–22:00).

5.4. Dotacje na magazyny energii dla firm

· Program „Fundusze Europejskie dla Podkarpacia” – nabór na magazyny energii dla przedsiębiorstw (FEPK.02.03-IZ.00-002/26): budżet 78,7 mln zł, poziom dofinansowania do 85%, nabór od 3 do 31 marca 2026 r..
· Program „Przydomowe Magazyny Energii” (NFOŚiGW): dofinansowanie do 30% kosztów, nie więcej niż 800 zł za 1 kWh, maksymalnie 16 000 zł.
· Ulga termomodernizacyjna – odliczenie od podstawy opodatkowania.

5.5. Kiedy magazyn energii jest opłacalny?

Magazyn energii ma uzasadnienie ekonomiczne, gdy:

· Firma posiada instalację PV i wysoką nadwyżkę energii oddawanej do sieci.
· Firma ma profil zużycia z wyraźnym szczytem wieczornym.
· Firma chce zredukować opłatę mocową i opłatę za moc umowną.
· Firma ma dostęp do dotacji (np. programy regionalne).
· Firma rozlicza się w taryfie dynamicznej lub C21/C22a.

---

Część 6: Weryfikacja poprawności naliczeń – krok po kroku

6.1. Test „migającej diody” – samodzielna weryfikacja licznika

Nowe liczniki elektroniczne posiadają migającą diodę LED, której częstotliwość migania odpowiada poborowi mocy. Liczba impulsów na 1 kWh jest podana na tabliczce znamionowej licznika (np. 1000 imp/kWh).

Procedura testu:

1. Wyłącz wszystkie urządzenia w firmie (odłącz od prądu wszystko, co możliwe).
2. Zanotuj stan licznika (całkowite zużycie w kWh).
3. Obserwuj diodę LED – policz, ile razy mignie w ciągu np. 1 minuty.
4. Oblicz moc pobieraną:
   · Liczba impulsów na minutę × 60 = liczba impulsów na godzinę.
   · Podziel przez liczbę imp/kWh z tabliczki = moc w kW.
   · Przykład: 15 impulsów/min × 60 = 900 imp/h ÷ 1000 imp/kWh = 0,9 kW (900 W).
5. Porównaj z sumą mocy urządzeń, które pozostawiłeś włączone.

6.2. Analiza profilu zużycia w portalu OSD

Większość OSD udostępnia portal klienta (np. „Mój Licznik” w Energa-Operator, „eLicznik” w TAURON), gdzie można:

· Obserwować zużycie energii w czasie rzeczywistym.
· Analizować profil dobowy i tygodniowy.
· Identyfikować urządzenia pobierające najwięcej energii.
· Sprawdzić, czy zużycie w nocy jest na poziomie zerowym.

6.3. Porównanie z historią zużycia

Jeśli po wymianie licznika zużycie wzrosło o więcej niż 20–30%, warto:

· Porównać rachunki z ostatnich 12 miesięcy.
· Sprawdzić, czy w tym okresie nie pojawiły się nowe urządzenia.
· Zweryfikować, czy poprzednie odczyty były dokonywane na podstawie rzeczywistych wskazań, czy prognoz.

6.4. Kontrola opłat za moc bierną

Jeśli Twoja firma płaci za moc bierną, warto:

· Sprawdzić wartość tgφ na fakturze.
· Porównać z wartością tgφ₀ = 0,4.
· Rozważyć instalację kompensatora mocy biernej.
· Zweryfikować, czy pomiar mocy biernej jest poprawny.

---

Część 7: Reklamacja i badanie laboratoryjne licznika

7.1. Kiedy złożyć reklamację?

Reklamację faktury za energię elektryczną można złożyć, gdy:

· Rachunek wydaje się nieproporcjonalnie wysoki w stosunku do zużycia.
· Wskazania licznika budzą wątpliwości.
· Wystąpiły błędy w naliczeniu opłat (np. błędna taryfa, nieprawidłowe strefy czasowe, błędne naliczenie opłaty za moc bierną).

Termin: Reklamację można złożyć w ciągu 14 dni od otrzymania faktury. Sprzedawca ma 14 dni na jej rozpatrzenie.

7.2. Wzór reklamacji – kluczowe elementy

Pismo reklamacyjne powinno zawierać:

· Dane firmy (nazwa, NIP, adres, numer klienta, numer PPE).
· Numer i datę reklamowanej faktury.
· Opis problemu (np. „Nagły wzrost zużycia energii po wymianie licznika”, „Błędne naliczenie opłaty za moc bierną”).
· Żądanie (np. „Wnoszę o weryfikację poprawności działania układu pomiarowego oraz korektę faktury”).
· Podpis i data.

7.3. Badanie laboratoryjne licznika

Jeśli reklamacja nie przyniesie rezultatu, można zażądać laboratoryjnego sprawdzenia prawidłowości działania układu pomiarowo-rozliczeniowego.

Procedura:

1. Złóż pisemny wniosek do OSD o przeprowadzenie badania laboratoryjnego.
2. OSD ma 14 dni na przeprowadzenie badania od dnia zgłoszenia żądania.
3. W trakcie badania licznik jest demontowany i wysyłany do laboratorium.
4. Wynik badania jest przekazywany klientowi.
5. W terminie 30 dni od otrzymania wyniku badania odbiorca może zlecić dodatkową ekspertyzę. Koszt tej ekspertyzy pokrywa odbiorca.

Kto płaci za badanie?

Sytuacja Kto pokrywa koszt
Badanie na żądanie odbiorcy – nie stwierdzono nieprawidłowości Odbiorca
Badanie na żadanie odbiorcy – stwierdzono nieprawidłowości Przedsiębiorstwo energetyczne (OSD)
Dodatkowa ekspertyza Odbiorca



Koszt badania laboratoryjnego dla przedsiębiorców:

Operator Koszt (brutto) Uwagi
PGE Dystrybucja 209,09 zł W tym 169,99 zł netto + demontaż/montaż
Enea Operator 127,70 zł + 56,02 zł Badanie + demontaż/montaż
TAURON Dystrybucja 130,00 zł + 57,03 zł Badanie + demontaż/montaż

Uwaga: Koszt ok. 140 zł, o którym wspominają użytkownicy, może dotyczyć starszych stawek lub uproszczonej procedury. Aktualne ceny są wyższe i zależą od operatora. Warto jednak walczyć o swoje – jeśli masz uzasadnione wątpliwości, złóż reklamację i ewentualnie zażądaj badania.

7.4. Dodatkowa ekspertyza

Jeśli wynik badania laboratoryjnego jest niejednoznaczny, można zlecić dodatkową ekspertyzę zewnętrznej jednostce badawczej. Koszt pokrywa odbiorca, ale w przypadku potwierdzenia nieprawidłowości można domagać się zwrotu.

---

Część 8: FAQ – najczęściej zadawane pytania

P: Czy firma w taryfie C płaci za moc bierną?
O: Tak, jeśli współczynnik tgφ przekracza wartość tgφ₀ = 0,4. Opłata dotyczy nadwyżki energii biernej indukcyjnej oraz – w niektórych przypadkach – pojemnościowej.

P: Jak uniknąć opłat za moc bierną?
O: Zainstaluj kompensator mocy biernej (baterię kondensatorów) i regularnie monitoruj współczynnik tgφ.

P: Czy nowe liczniki naliczają opłaty za moc bierną?
O: Nowe liczniki elektroniczne mogą mierzyć moc bierną, ale opłata jest naliczana tylko wtedy, gdy firma przekroczy współczynnik tgφ₀.

P: Jakie są stawki opłaty mocowej dla firm w 2026 roku?
O: 0,2194 zł/kWh netto (219,40 zł/MWh) za energię pobraną w dni robocze w godzinach 7:00–22:00. To wzrost o ok. 55% w stosunku do 2025 roku.

P: Czy net-billing dla firm się opłaca?
O: Tak, ale kluczowa jest autokonsumpcja – im więcej energii zużyjesz na bieżąco, tym większe oszczędności. Realny współczynnik bilansowania spada do 0,3–0,4 przy rozliczeniu godzinowym.

P: Czym jest depozyt prosumencki?
O: To wirtualne konto, na które trafia wartość energii sprzedanej do sieci. Depozyt jest powiększany o współczynnik 1,23 i ważny 12 miesięcy.

P: Ile kosztuje magazyn energii dla firmy?
O: Od 1 400 do 2 500 zł za kWh pojemności. Przy poprawnie policzonym modelu przychodowym zwraca się w 5–8 lat.

P: Czy są dotacje na magazyny energii dla firm?
O: Tak, np. program „Fundusze Europejskie dla Podkarpacia” oferuje dofinansowanie do 85% kosztów (budżet 78,7 mln zł). Dostępne są również programy regionalne i ulga termomodernizacyjna.

P: Jak sprawdzić, czy licznik działa poprawnie?
O: Wykonaj test „migającej diody” – wyłącz wszystkie urządzenia i policz impulsy LED w ciągu minuty.

P: Co zrobić, jeśli podejrzewam, że licznik zawyża?
O: Złóż reklamację do OSD, a jeśli to nie pomoże – zażądaj badania laboratoryjnego. Koszt badania to ok. 130–210 zł, w zależności od operatora. W przypadku potwierdzenia nieprawidłowości OSD zwraca koszty.

P: Czy mogę zmienić taryfę z C11 na C12a?
O: Tak, zmiana taryfy jest możliwa. Warto przeanalizować profil zużycia, aby sprawdzić, czy przesunięcie zużycia na godziny pozaszczytowe przyniesie oszczędności.

---

Część 9: Wytyczne dla kalkulatora i porównywarki taryf dla firm

9.1. Dane wejściowe od użytkownika

Dane Opis Przykład
Roczne zużycie energii Całkowite zużycie w kWh/rok 50 000 kWh
Moc umowna kW 30 kW
Profil zużycia dobowego Rozkład zużycia na godziny 60% dzień, 40% noc
Profil zużycia tygodniowego Rozkład zużycia na dni tygodnia 85% dni robocze, 15% weekendy
Rodzaj instalacji 1-fazowa / 3-fazowa 3-fazowa
Operator sieci dystrybucyjnej Tauron, PGE, Enea, Energa Tauron
Współczynnik tgφ Wartość współczynnika mocy 0,35
Posiadanie PV Tak / Nie Tak
Moc instalacji PV kWp 20 kWp
Posiadanie magazynu energii Tak / Nie Nie
Pojemność magazynu kWh 20 kWh

9.2. Algorytm obliczeniowy

Kalkulator powinien:

1. Obliczyć koszt energii dla każdej taryfy na podstawie:
   · Ceny energii czynnej w strefach.
   · Opłaty sieciowej zmiennej w strefach.
   · Opłaty sieciowej stałej (zależnej od mocy umownej).
   · Opłaty mocowej (0,2194 zł/kWh w godzinach 7:00–22:00 w dni robocze).
   · Opłaty jakościowej, OZE, kogeneracyjnej.
   · Akcyzy i VAT.
2. Uwzględnić opłatę za moc bierną – jeśli tgφ > 0,4, obliczyć opłatę według wzoru O_b.
3. Uwzględnić opłatę za przekroczenie mocy umownej – jeśli moc pobrana przekracza moc umowną.
4. Dla firm z PV – uwzględnić:
   · Autokonsumpcję (zużycie energii z PV na bieżąco).
   · Nadwyżki oddane do sieci i wartość depozytu (z współczynnikiem 1,23).
   · Wpływ magazynu energii na zwiększenie autokonsumpcji.
5. Wyświetlić tabelę wyników – posortowaną od najniższego kosztu rocznego.

9.3. Przykładowa tabela wyników

Taryfa Koszt roczny (zł) Oszczędność vs. C11 Rekomendacja
C12a 42 500 zł -3 200 zł ✅ Najlepsza
C21 44 800 zł -900 zł ✅ Dobra
C11 45 700 zł 0 zł ❌ Najdroższa

---

Część 10: Podsumowanie i kluczowe wnioski

1. Taryfy C – przedsiębiorcy rozliczają się w grupach C11, C12a, C12b, C21, C22a, C22b. Ceny nie są regulowane przez URE.
2. Moc bierna – firmy płacą za moc bierną, jeśli tgφ > 0,4. Kluczowa jest kompensacja mocy biernej.
3. Opłata mocowa – dla firm w 2026 roku wynosi 0,2194 zł/kWh w godzinach 7:00–22:00 w dni robocze (wzrost o 55%).
4. Net-billing – kluczowa jest autokonsumpcja. Depozyt prosumencki z współczynnikiem 1,23, ważny 12 miesięcy.
5. Magazyny energii (BESS) – koszt 1 400–2 500 zł/kWh, zwrot w 5–8 lat. Dostępne dotacje (np. do 85% kosztów w programach regionalnych).
6. Weryfikacja – wykonaj test „migającej diody”, analizuj profil zużycia w portalu OSD, porównaj z historią.
7. Reklamacja – złóż pismo do OSD. Jeśli to nie pomoże, zażądaj badania laboratoryjnego (koszt 130–210 zł, pokrywa OSD w przypadku potwierdzenia nieprawidłowości).
8. Nie ma się co bać – jeśli masz wątpliwości, walcz o swoje. Badanie licznika to koszt rzędu 140 zł (w zależności od operatora), a w przypadku potwierdzenia nieprawidłowości OSD zwraca koszty.

---

Część 11: Źródła i odniesienia

· URE – taryfy i stawki opłat: https://ure.gov.pl
· Informacja Prezesa URE nr 58/2025 – stawki opłaty mocowej na 2026 r.
· Taryfy OSD (TAURON, PGE, Enea, Energa) – stawki dystrybucyjne.
· Ustawa o OZE – zasady net-billingu.
· Interpretacja indywidualna Dyrektora KIS z 5 maja 2025 r. (sygn. 0114-KDIP2-2.4010.124.2025.2.ASK).
· NFOŚiGW – program „Przydomowe Magazyny Energii”.
· Program „Fundusze Europejskie dla Podkarpacia” – nabór FEPK.02.03-IZ.00-002/26.

---

Ten dokument stanowi kompletny materiał źródłowy do zbudowania kalkulatora, poradnika i FAQ dla przedsiębiorców. Obejmuje wszystkie aspekty rozliczeń za energię elektryczną w Polsce dla firm, obala mity, wyjaśnia procedury weryfikacji i reklamacji, a także zawiera dane niezbędne do porównywania taryf C, obliczania opłacalności inwestycji w PV i magazyny energii oraz rozliczania net-billingu.
