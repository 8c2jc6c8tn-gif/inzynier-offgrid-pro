# Perspektywy projektów — technologie i patenty do obserwowania

**Utworzono:** 03.11.2026 (na prośbę właściciela, wątek „Dodać Aircela do perspektyw projektów”). **Status:** żywy rejestr; wpisy dopisujemy, nie usuwamy (zmiana oceny = nowa data obok starej).

## Po co ten rozdział

Tu trafiają technologie, patenty i urządzenia, które ktoś pokazuje jako „przyszłość energetyki” i które **mogłyby** kiedyś dotyczyć użytkownika aplikacji, ale dziś nie są ani w kodzie, ani w `backlog-poza-v1.md`. Każdy wpis ma odpowiedzieć na trzy pytania: (1) co to jest i jak działa, (2) ile to naprawdę kosztuje w energii i w pieniądzach, (3) czy ma sens dla off-grid i kiedy warto wrócić do tematu. To nie jest lista zadań (od tego jest `docs/lista-do-zrobienia.md`) ani decyzja o zakresie (od tego `rejestr-decyzji.md`); wpis tutaj niczego nie obiecuje użytkownikowi.

Dział powstał jako nowy plik, bo w repo nie było wcześniej rozdziału o takiej nazwie: `backlog-poza-v1.md` zbiera odłożone ekrany i obszary produktu, a nie oceny cudzych technologii. Wskaźnik do tego pliku dopisano w backlogu.

## Zasady wpisu

1. **Każda liczba ma oznaczenie pochodzenia:**
   - ✅ **Źródło** — odczytane w tej sesji ze wskazanej strony (data odczytu, link). Strony były streszczane automatycznie, więc przed użyciem liczby w kodzie lub w komunikacji do użytkownika trzeba ją sprawdzić w oryginale.
   - 📣 **Deklaracja producenta** — liczba z materiałów firmy, powtórzona przez media; brak niezależnego pomiaru.
   - 🧮 **Wyliczenie własne** — z podanych wzorów i założeń; można je powtórzyć.
   - ❓ **Założenie** — przyjęte przeze mnie, żeby w ogóle policzyć; zmiana założenia zmienia wynik (podane widełki).
   - 🧠 **Wiedza ogólna** — znane z literatury, ale nie sprawdzane w tej sesji.
2. Nie ma tu ani jednej liczby „z pamięci” bez oznaczenia. Czego nie znaleziono, jest wpisane jako luka.
3. Wpis kończy się kryteriami powrotu (co musi się zmienić, żebyśmy wrócili do tematu) i listą luk.
4. Szablon wpisu: Opis i łańcuch procesu → Co deklaruje producent → Bilans masy i energii → Koszt za jednostkę i koszt urządzenia → Porównanie z alternatywami → Realność → Sens dla Offgrid → Kryteria powrotu → Luki i źródła.

---

## P-001 — Aircela: benzyna syntetyczna z powietrza (e-paliwo w skrzynce)

**Data oceny:** 03.11.2026. **Ocena skrótowo:** technicznie wykonalne (każdy etap jest znaną technologią), ale dla użytkownika off-grid w Polsce **nie ma sensu ekonomicznego ani energetycznego** — jeden egzemplarz potrzebuje ok. 3 kW ciągłej mocy (26–29 kWp paneli przy średniorocznym uzysku), żeby dać około 1,4 tys. litrów paliwa rocznie, a paliwo wychodzi o kilkanaście do kilkudziesięciu procent drożej niż na stacji, nawet przy bardzo tanim prądzie z PV (0,20 zł/kWh). Status: **obserwować, nie budować**.

### 1. Co to jest

Aircela (firma z Nowego Jorku; CEO Eric Dahlgren, ✅ PopSci) pokazała w maju 2025 r. na dachu na Manhattanie maszynę wielkości lodówki, złożoną z trzech sześciokątnych modułów, która ma wytwarzać benzynę z dwutlenku węgla z powietrza, wody i energii elektrycznej (to widać na rolce, którą wrzucił właściciel; opis rolki mówi to samo i dodaje, że głównym problemem jest ogromne zużycie energii). Producent twierdzi, że paliwo jest „motor-grade” i działa w każdym standardowym silniku (✅ strona aircela.com, bez żadnych liczb).

### 2. Jak to działa (łańcuch procesu)

Opis procesu: ✅ [Dezeen](https://www.dezeen.com/2025/06/04/aircela-air-to-fuel-technology/) (opis procesu przez Aircela), uzupełniony o ✅ [Core77](https://www.core77.com/posts/137385/Aircela-Says-Their-Machine-Makes-Carbon-Neutral-Gasoline-Out-of-Thin-Air) (wodorotlenek potasu jako sorbent; widziałem tylko streszczenie w wyniku wyszukiwania, nie cały artykuł).

1. **Wychwyt CO₂ z powietrza (DAC):** ciekły sorbent wiąże CO₂, jest regenerowany w maszynie i nie wymaga wymiany (📣). Regeneracja sorbentu jest najbardziej energochłonnym etapem wychwytu.
2. **Elektroliza wody:** powstaje wodór (magazynowany w maszynie), tlen jest wypuszczany.
3. **Synteza metanolu:** CO₂ + 3 H₂ → CH₃OH + H₂O (🧠 reakcja znana, stosowana przemysłowo m.in. w Islandii).
4. **Metanol → benzyna (MTG, „methanol-to-gasoline”):** dwuetapowy proces katalityczny (✅ Core77); to proces rozwinięty przez Mobil/ExxonMobil, znany z instalacji przemysłowej (🧠). Z procesu wychodzi też frakcja lekka (LPG) — w jednym ze źródeł 15–40% masy produktu zależnie od reaktora (✅ opis patentowy w wynikach wyszukiwania, nie otwierałem), co obniża uzysk benzyny z metanolu.

Sumarycznie dla węglowodoru o składzie przybliżonym CH₂: CO₂ + 3 H₂ → (CH₂) + 2 H₂O. Reakcje 3 i 4 są egzotermiczne (🧠), więc część ciepła może zasilać regenerację sorbentu — ale tylko jeśli temperatura ciepła odpadowego jest wystarczająca; dla roztworów wodorotlenkowych regeneracja wymaga wysokich temperatur, więc nie liczę tego jako zysku.

### 3. Co deklaruje producent (wszystko 📣, brak niezależnych pomiarów)

| Parametr | Wartość | Źródło |
|---|---|---|
| Wydajność | ok. 1 galon benzyny na dobę przy pracy 24/7 | [PopSci](https://www.popsci.com/environment/aircela-gasoline-machine/), Dezeen |
| CO₂ na dobę | 10 kg (po poprawce redakcji PopSci z 29.05.2025; inne media piszą „22 funty”, co daje to samo) | PopSci |
| Zbiornik | do 17 galonów | PopSci |
| Sprawność end-to-end | cel „powyżej 50%” | [The Autopian](https://www.theautopian.com/a-company-wants-to-sell-you-a-small-machine-to-make-gasoline-out-of-air/) (cytuje Aircela) |
| Energia wejściowa | ok. 75 kWh na galon (energia galonu: ok. 37 kWh) | Autopian (Aircela) |
| Koszt prądu | poniżej 1,50 USD za galon przy własnych panelach off-grid (to wynika z ok. 0,02 USD/kWh) | Autopian (Aircela) |
| Cena urządzenia | 15–20 tys. USD „na początek”, później „nieco niższa” | Autopian (Aircela, cel) |
| Dostępność | wybrane rynki USA od końca 2026 (jedno z mediów) | wynik wyszukiwania, niezweryfikowane |
| Dane niepodane | pobór mocy w kW, liczba paneli, zużycie wody, trwałość, serwis | PopSci: rzecznik nie podał ceny; Dezeen: brak sprawności i ceny |

**Rozbieżność w źródłach:** Dezeen podaje 4,55 l na „galon”, czyli galon imperialny; amerykański to 3,785 l. Dalej liczę na galonie amerykańskim (z nim są zgodne kWh/gal i USD/gal), ale to jest ok. 20% niepewności w litrach na dobę. Inne media (CyberGuy) podają koszt samego prądu 12 USD za galon i 15–20 USD z pozostałymi kosztami — nie wiem, na jakich założeniach, więc nie przyjmuję tej liczby; pokazuje tylko, jak bardzo wynik zależy od ceny energii.

### 4. Bilans masy i energii (🧮 — do powtórzenia)

**Założenia (❓):** galon amerykański = 3,785 l; gęstość benzyny 0,74 kg/l; udział węgla 85,5% masy; skład ≈ CH₂ do bilansu wodoru. **Energia galonu ✅:** [DOE AFDC](https://afdc.energy.gov/fuels/properties) podaje 112 114–116 090 Btu/gal (LHV), czyli 32,9–34,0 kWh, oraz 120 388–124 340 Btu/gal (HHV), czyli 35,3–36,4 kWh. Aircela liczy „ok. 37 kWh” (górna granica HHV).

**Masa:**

- benzyna: 3,785 l × 0,74 = 2,80 kg, w tym węgla 2,40 kg;
- CO₂ ze stechiometrii: 2,40 × 44,01 / 12,011 = **8,8 kg** (producent podaje 10 kg — zgodne, różnica to zapas na straty i frakcje uboczne);
- wodór: 2,80 kg / 14,03 g/mol × 3 mol H₂ × 2,016 g/mol = **1,21 kg H₂** na galon;
- woda do elektrolizy: ok. 9 kg na 1 kg H₂ = 10,9 kg; woda powstająca w syntezie: 7,2 kg; zużycie netto ok. 3,7 kg (litra) na galon, jeśli cała woda poreakcyjna jest odzyskiwana (🧮, ❓ — producent nie podał).

**Energia elektryczna (dolna granica, bez strat sprężania, ogrzewania i pomp):**

- elektroliza: 1,21 kg × 50–55 kWh/kg = **60–66 kWh**. Zakres systemu elektrolizera: ok. 54,6 (alkaliczne) i 55,1 kWh/kg (PEM) w 2025 r. wg BNEF, ✅ ale przez wpis na blogu producenta, nie z raportu; starszy odczyt NREL (2017): mediana ok. 52–53 kWh/kg, zakres ok. 47–73 kWh/kg ✅ ze streszczenia. Wartość 50 jest więc optymistyczną dolną granicą;
- wychwyt CO₂: 8,8–10 kg × 1,4–2,8 kWh/kg = **12–28 kWh**. Zakres wyników literaturowych dla sorbentów stałych, prąd + ciepło razem: ok. 1 400–2 800 kWh na tonę CO₂ (✅ przegląd w Coal Science and Technology 2023, w streszczeniu wyszukiwania; inny przegląd podaje, że sam rozrzut regeneracji to 0,5–18,75 GJ/t, bo zależy od sorbentu). Aircela używa sorbentu ciekłego, dla którego pilotowa instalacja Carbon Engineering podaje 8,81 GJ/t (ok. 2 450 kWh/t; ✅ perspektywa w Frontiers, streszczenie), więc górna część zakresu jest bardziej prawdopodobna niż dolna.

**Wynik:** od ok. **73 kWh/gal** (najlepsze liczby ze wszystkiego, zero strat dodatkowych) do ok. **94 kWh/gal** (elektrolizer 55, wychwyt 2,8 kWh/kg CO₂), przed stratami sprężania, grzania katalizatora, pomp i chłodzenia. Moje oszacowanie realistyczne: **85–100 kWh/gal**, czyli 22,5–26,4 kWh na litr.

| Energia wejściowa | kWh/l | Sprawność wg LHV (33,4 kWh/gal) | Sprawność wg HHV (37 kWh/gal) |
|---|---|---|---|
| 75 kWh/gal (deklaracja) | 19,8 | 45% | 49% |
| 85 kWh/gal | 22,5 | 39% | 44% |
| 100 kWh/gal | 26,4 | 33% | 37% |

**Wniosek z bilansu:** deklarowane 75 kWh/gal nie jest fizycznie niemożliwe, ale leży na samym dole mojego zakresu, czyli wymaga najlepszego elektrolizera, najlepszego wychwytu i zerowych strat reszty układu. Deklaracja „sprawność powyżej 50%” jest zgodna z 75 kWh tylko przy liczeniu energii galonu wg HHV (37 kWh); wg LHV, którą zwykle liczy się paliwa w silnikach, wychodzi 45%. Sprawdzenie sensowności: wodór potrzebny na galon ma energię 47,6 kWh (HHV), więc nawet idealny elektrolizer i idealne reakcje dają sprawność łańcucha najwyżej ok. 37/47,6 ≈ 78% względem wodoru, zanim dojdzie wychwyt CO₂.

### 5. Koszt za litr i koszt urządzenia (🧮)

**Moc:** 75–100 kWh na dobę to **3,1–4,2 kW** ciągłej mocy przez całą dobę.

**Panele (❓ uzysk 950–1 050 kWh/kWp rocznie, zgodnie z opracowaniami wtórnymi ✅ [inzynierbudownictwa.pl](https://inzynierbudownictwa.pl/?p=37592); trzeba sprawdzić w PVGIS dla miejsca):** żeby wytwarzać 1 galon na dobę przez cały rok, potrzeba 27,4–36,5 MWh rocznie, czyli **26–38 kWp** paneli (przy 75 kWh/gal: 26–29 kWp; przy 100 kWh/gal: 35–38 kWp) — dla porównania typowy dom z magazynem to kilka kWp. Maszyna pracująca tylko w słońcu musi mieć moc kilka razy większą lub bufor w akumulatorze, co dodaje kosztów, a zimą w Polsce uzysk spada wielokrotnie (do zmierzenia modułem lokalizacji aplikacji, nie podaję tu liczby bez źródła).

**Roczna produkcja przy 1 gal/dobę:** 365 gal = **ok. 1 380 l** (zakładając pracę bez przerw).

**Koszt prądu na litr (E × cena / 3,785):**

| Cena prądu z PV (❓ parametr, nie fakt) | 75 kWh/gal | 100 kWh/gal |
|---|---|---|
| 0,20 zł/kWh | 3,96 zł/l | 5,28 zł/l |
| 0,40 zł/kWh | 7,93 zł/l | 10,57 zł/l |
| 0,60 zł/kWh | 11,89 zł/l | 15,85 zł/l |

Deklaracja Aircela (1,50 USD/gal) odpowiada ok. 0,02 USD/kWh, czyli ok. 0,07 zł/kWh po kursie z założenia 3,7 zł/USD (❓ — kursu nie sprawdzałem w tej sesji); to cena prądu bez uwzględnienia kosztu samych paneli i akumulatora, nieosiągalna w instalacji off-grid z magazynem.

**Amortyzacja urządzenia** (❓ żywotność 5 lub 10 lat, praca 90% czasu, bez odsetek, serwisu, sorbentu i wymiany stosu elektrolizera, cena 15–20 tys. USD przy 3,7 zł/USD, czyli ok. 55–74 tys. zł):

| Cena urządzenia | 10 lat | 5 lat |
|---|---|---|
| 15 tys. USD | 4,5 zł/l | 8,9 zł/l |
| 20 tys. USD | 6,0 zł/l | 11,9 zł/l |

**Razem (prąd 0,20 zł/kWh + urządzenie, 10 lat):** ok. **8,4–11,2 zł/l**, bez paneli, akumulatora, serwisu i wody. Przy prądzie 0,40 zł/kWh: 12,4–16,5 zł/l.

**Cena na stacji w Polsce (✅):** prognoza BM Reflex na 5–9 października 2026: Pb95 średnio 6,85 zł/l; odczyt e-petrol z 5 sierpnia 2026: 7,55 zł/l ([strefainwestorow.pl](https://strefainwestorow.pl/wiadomosci/20261002/co-dalej-z-cenami-paliw-sa-nowe-prognozy-analitykow), [autocentrum.pl](https://www.autocentrum.pl/publikacje/eksploatacja-auta/aktualizacja-cen-paliw-5-08-2026-ile-dzis-kosztuje-paliwo/); z wyniku wyszukiwania, nie otwierałem). Cena na stacji zawiera podatki; jak potraktowano by paliwo wytworzone u siebie (akcyza, rejestracja wytwórcy), **nie sprawdzałem** — to osobne pytanie prawne.

### 6. Porównanie z alternatywami

**A. Samochód:** zakładając spalanie 7 l/100 km (❓) benzyna syntetyczna z tej maszyny kosztuje w energii 139 kWh/100 km przy 75 kWh/gal i 185 kWh/100 km przy 100 kWh/gal. Samochód elektryczny zużywa ok. 18 kWh/100 km (❓ typowa wartość; do sprawdzenia dla konkretnego modelu), czyli **7,7–10 razy mniej**. Dlatego każdy, kto może jeździć na prąd, wygrywa wielokrotnie; sens e-paliwa dotyczy tylko zastosowań bez alternatywy elektrycznej (lotnictwo, statki, istniejące maszyny).

**B. Zakup paliwa na stacji do agregatu:** w off-grid zapotrzebowanie zimowe pokrywa się zwykle agregatem (są ekrany o agregacie w aplikacji). Zakładając sprawność małego agregatu spalinowego 20–30% (❓ typowa, nie sprawdzana) i 33,4 kWh/gal: 1 galon daje 6,7–10 kWh prądu. Na 1 MWh prądu z agregatu trzeba więc 100–149 gal = 380–565 l; przy 6,85–7,55 zł/l to **ok. 2,6–4,3 tys. zł**. Samodzielne wytwarzanie tego paliwa kosztuje więcej niż zakup, więc cena urządzenia (55–74 tys. zł) nie zwraca się w żadnym z policzonych scenariuszy (zakup paliwa na 1 MWh prądu kosztuje 2,6–4,3 tys. zł, a urządzenie ponad dziesięciokrotnie więcej, zanim doliczymy panele).

**C. Magazynowanie sezonowe jako e-paliwo (łańcuch prąd → benzyna → agregat → prąd):** sprawność całego łańcucha to 6,7–13,4% (🧮: 6,7–10 kWh prądu z 75–100 kWh wejścia). Czyli **żeby oddać 1 kWh zimą, trzeba wyprodukować latem 7,5–15 kWh z PV**. Akumulator LiFePO4 ma sprawność cyklu rzędu 90% (🧠, ❓ wartość orientacyjna; w aplikacji jest własna wartość, do użycia zamiast tej), ale jego pojemność kosztuje, a przy jednym cyklu rocznym nie zwraca się — w tym sensie e-paliwo jest teoretycznie jedyną drogą do prawdziwego magazynu sezonowego bez ogromnych zbiorników, tylko że za cenę sprawności rzędu kilkunastu procent. Dla jednego gospodarstwa taniej jest dołożyć paneli i postawić agregat na zakupione paliwo, niż produkować paliwo.

**D. Wodór bez dalszej syntezy (elektrolizer + zbiornik + ogniwo paliwowe):** pomija DAC i syntezę, więc teoretycznie sprawność jest wyższa, ale wymaga magazynowania gazu pod ciśnieniem — nie liczę, bo nie mam zweryfikowanych danych o małych układach domowych; kandydat na osobny wpis P-002.

### 7. Czy da się to zrealizować

- **Technicznie: tak.** Każdy etap (DAC, elektroliza, synteza metanolu, MTG) jest znany; nowością jest zmniejszenie skali do jednej szafy (📣 — prezentacja pokazała działającą maszynę, ale bez niezależnych pomiarów, bez podanego czasu pracy, sprawności i trwałości).
- **Energetycznie: słabo.** 22–26 kWh na litr; jeden egzemplarz to 3–4 kW ciągłej mocy; sprawność łańcucha do silnika 10–13% (por. EV: 7,7–10 razy mniej energii na km).
- **Ekonomicznie: nie w Polsce i nie dla domowego off-grid.** 8,4–11,2 zł/l tylko za prąd z założenia 0,20 zł/kWh i urządzenie na 10 lat, przy cenie stacji 6,85–7,55 zł/l.
- **Skala:** 1 galon na dobę (ok. 1,4 tys. l rocznie) wystarcza na ok. 1,6 samochodu przy 12 tys. km i 7 l/100 km (❓) — nie jest to „stacja paliw we własnym garażu”.
- **Dostępność:** brak ogłoszonej sprzedaży w Europie; deklaracje o starcie w wybranych stanach USA pochodzą z drugiej ręki.

### 8. Sens dla Offgrid (apki)

**Dziś: brak.** Nie dodajemy ekranu ani wzorów; nie obiecujemy użytkownikowi tej technologii. Gdyby użytkownik zapytał w narzędziu AI, odpowiedź powinna wynikać z powyższych liczb (ze wskazaniem, że to szacunek 🧮 oparty na założeniach), a nie z reklamy.

**Co z tego zostaje użyteczne w apce:** pytanie „czy magazynować sezonowo” sprowadza się dziś do trzech dróg (więcej paneli + pojemność akumulatora, agregat na paliwo kupowane, zimowe ogrzewanie z innego źródła). Ten rachunek istnieje w aplikacji w kalkulatorach modułu 7 i w modułach o agregacie; liczby z sekcji 6 B/C można w przyszłości zamienić na „Kalkulator e-paliwa (perspektywa)” w trybie szacunku 🔎 (status `ESTIMATE`, D94) — ale tylko po spełnieniu kryteriów z sekcji 9. Wpis na listę zadań ma niski priorytet (patrz `docs/lista-do-zrobienia.md`).

### 9. Kryteria powrotu (wracamy do tematu, gdy…)

1. Pojawi się **niezależny pomiar** (laboratorium, uczelnia, audyt trzeciej strony) energii na galon w pracy ciągłej, nie deklaracja.
2. Cena urządzenia spadnie poniżej ok. 1/3 obecnego celu **albo** pojawi się model dzierżawy lub współdzielenia na wiele gospodarstw (wtedy kosztuje 1/3 zamiast całości).
3. Urządzenie będzie sprzedawane w UE z deklaracją zgodności, a nie tylko w wybranych stanach USA.
4. Otworzy się jasna ścieżka prawna dla paliwa wytwarzanego u siebie (akcyza, wytwórca paliwa).
5. Rynkowa cena paliwa w Polsce wzrośnie w sposób trwały powyżej ok. 10 zł/l (przy obecnych założeniach wtedy rachunek się zbliża).

### 10. Luki i niezweryfikowane

- Brak niezależnych danych o poborze mocy, wodzie, trwałości, serwisie, kosztach sorbentu i wymiany stosu.
- Rozbieżność litr/galon (4,55 l w Dezeen vs 3,785 l amerykański).
- Kursy walut, żywotność urządzenia, sprawność agregatu, zużycie samochodu (EV i spalinowego), cena prądu z PV: **założenia parametryczne**, nie fakty.
- Jak liczyć ciepło odpadowe z syntezy i MTG na regenerację sorbentu: producent nie podał, w bilansie dałem zero.
- Wartości sprawności elektrolizerów i energii wychwytu CO₂ pochodzą z **streszczeń wyników wyszukiwania i blogów**, nie z pełnych tekstów; przed użyciem w kodzie trzeba odczytać oryginał.
- Aspekt prawny (akcyza na paliwo własne, normy EN 228, gwarancje silnika) — nie badany.
- Nie sprawdzono, czy Aircela ma patenty i jakie; „patenty” z prośby właściciela potraktowano jako „technologie”.

### 11. Źródła (odczyt 03.11.2026)

- [PopSci — refrigerator-sized machine makes gasoline out of thin air](https://www.popsci.com/environment/aircela-gasoline-machine/) (CEO, 10 kg CO₂/dobę, 17 gal zbiornik, brak ceny)
- [The Autopian — a company wants to sell you a small machine to make gasoline out of air](https://www.theautopian.com/a-company-wants-to-sell-you-a-small-machine-to-make-gasoline-out-of-air/) (75 kWh/gal, >50%, 1,50 USD/gal, 15–20 tys. USD)
- [Dezeen — Aircela demonstrates prototype device that turns air into fuel](https://www.dezeen.com/2025/06/04/aircela-air-to-fuel-technology/) (łańcuch procesu, 1 galon na dobę)
- [Core77 — Aircela says their machine makes carbon-neutral gasoline out of thin air](https://www.core77.com/posts/137385/Aircela-Says-Their-Machine-Makes-Carbon-Neutral-Gasoline-Out-of-Thin-Air) (sorbent KOH, MTG; tylko streszczenie)
- [Aircela](https://www.aircela.com) (strona główna: tylko opis, bez liczb)
- [DOE AFDC — Fuel properties](https://afdc.energy.gov/fuels/properties) (energia paliwa w Btu/gal)
- Przeglądy DAC i elektrolizerów: wyniki wyszukiwania (Coal Science and Technology 2023; An i in. 2023; Frontiers in Sustainability 2023; BNEF 2025 przez blog producenta; NREL 2017) — tylko streszczenia, patrz sekcja 10.
- [inzynierbudownictwa.pl — uzysk PV w Polsce](https://inzynierbudownictwa.pl/?p=37592); ceny paliw: [strefainwestorow.pl](https://strefainwestorow.pl/wiadomosci/20261002/co-dalej-z-cenami-paliw-sa-nowe-prognozy-analitykow), [autocentrum.pl](https://www.autocentrum.pl/publikacje/eksploatacja-auta/aktualizacja-cen-paliw-5-08-2026-ile-dzis-kosztuje-paliwo/).

---

## Log zmian

| Data | Zmiana |
|---|---|
| 03.11.2026 | Utworzono rozdział; wpis P-001 (Aircela). |
