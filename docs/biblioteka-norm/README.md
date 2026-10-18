# docs/biblioteka-norm/ — współdzielona biblioteka norm źródłowych

> **[18.10.2026] Adnotacja lokalna (inzynier-offgrid-pro):** skopiowano tylko `README.md` i `00-INDEKS.md`. Katalogi norm i materiałów z manifestu (ok. 221 MB w `new-app-standards`) NIE są w tym repo — linki do nich nie działają tutaj, czytaj je w źródle. Pełne pliki wnosimy na żądanie, per pozycja (decyzja właściciela 18.10.2026: moduły opcjonalne tak, bez hurtowego kopiowania norm).

> **Szukasz konkretnej normy?** Zacznij od [`00-INDEKS.md`](00-INDEKS.md) — skrócony spis nazw i
> zasięgu każdej pozycji, bez czytania szczegółów niżej.

> **Status: moduł opcjonalny pakietu (GOD BOOK Część Y.10), nie obowiązkowy dla każdego projektu.**
> Dodawany tylko projektom inżynierskim rodziny pracującym na normach elektrycznych/budowlanych
> (np. inzynier-offgrid-pro, inzynier-szkieletowy-pro) — projekty spoza tej podrodziny (farmer360.io,
> zero-waste) nie dostają tego katalogu przy zwykłej synchronizacji Y.9.
>
> Źródło: projekt inzynier-offgrid-pro, zebrane przez GOD BOOK U.4, 06.09.2026. Towarzyszy
> [`../playbooki-opcjonalne/przetwarzanie-materialow-zrodlowych.md`](../playbooki-opcjonalne/przetwarzanie-materialow-zrodlowych.md)
> (jak przetwarzać nowy dokument) — ten katalog rozstrzyga **gdzie** trzymać już przetworzony i
> zweryfikowany wynik, żeby kolejny projekt rodziny nie kupował/skanował/OCR-ował/weryfikował tej
> samej normy od zera.

## Zasada

Każda przyszła aplikacja inżynierska tej rodziny (kolejny "Kalkulator Inżyniera Pro", instalator PV
on-grid, projektant instalacji elektrycznej budynku) prędzej czy później potrzebuje części tych
samych norm — w większości generycznej elektryki niskiego napięcia i budownictwa, nie specyficznych
dla jednego projektu. Ten katalog trzyma **manifest** stanu każdej pozycji (co zweryfikowane w pełni,
co tylko spot-check, co bezużyteczne) — a docelowo, po decyzji o faktycznym przeniesieniu plików,
także same materiały (oryginał + wyciąg treści w Markdown), skonwencjonowane tak samo jak
`docs/zrodla/` w projekcie źródłowym (patrz playbook, Krok 3).

**✅ [15.09.2026] Licencja potwierdzona, pliki skopiowane.** Właściciel repo potwierdził wprost:
posiadana licencja pozwala trzymać zakupione normy "dla pracy nad projektem, jeśli projekt ich
potrzebuje". Wszystkich 10 pozycji manifestu niżej jest od teraz skopiowanych w całości (oryginał +
treść w Markdown) — źródło: `inzynier-offgrid-pro`, commit `d7c81d1`. Manifest niżej nie jest już
samymi metadanymi, tylko opisem realnie obecnych katalogów w tym repo.

<details>
<summary>Pierwotna otwarta kwestia (06.09.2026, dla historii — patrz 14.2, jawna korekta zamiast cichego usunięcia)</summary>

Część pozycji manifestu niżej to normy PN kupione oficjalnie w PKN — typowe warunki licencyjne PKN
ograniczają dalsze kopiowanie/redystrybucję zakupionego dokumentu, także "wewnętrznie" między
własnymi projektami/repozytoriami, w zależności od faktycznych warunków zakupu (licencja
stanowiskowa vs. organizacyjna). Zanim skopiujemy tu realne pliki PDF/skanów/`.doc` (nie tylko ich
metadane w manifeście), właściciel repo powinien świadomo potwierdzić, że posiadana licencja na to
pozwala — to nie jest coś, co rozstrzyga sesja AI za niego.

</details>

## Manifest (stan weryfikacji na 06.09.2026, pliki skopiowane 15.09.2026 — źródło: inzynier-offgrid-pro, commit `d7c81d1`)

| Norma / materiał | Katalog w tym repo | Oryginał | Status weryfikacji | Zasięg |
|---|---|---|---|---|
| **PN-HD 60364-5-52:2011** (obciążalność prądowa kabli, dobór przekroju) | [`norma-PN-HD-60364-5-52/`](norma-PN-HD-60364-5-52/) | Skan, 96 str., zakupiona oficjalnie PKN | Załącznik B (tabele obciążalności, str. 33-58) w pełni zweryfikowany strona po stronie (~35 poprawionych błędów OCR). Reszta (Załączniki A, C, E-I, ZA-ZC) tylko wstępny spot-check. | Uniwersalny — każda aplikacja z instalacją elektryczną NN |
| **PN-HD 60364-5-54:2010** (uziemienia, przewody ochronne PE) | [`norma-PN-HD-60364-5-54/`](norma-PN-HD-60364-5-54/) | Natywny tekst PDF, 38 str., zakupiona oficjalnie | Kompletny, zweryfikowany wizualnie (wzory/tabele przeciw renderowi strony). Uwaga: Załącznik ZC (krajowy PL) ma odnotowaną, nierozstrzygniętą rozbieżność 10mm²/16mm² dla Al chronionego mechanicznie | Uniwersalny |
| **PN-IEC 60364-4-41:2000** (ochrona przeciwporażeniowa) | [`norma-PN-IEC-60364-4-41/`](norma-PN-IEC-60364-4-41/) | `.doc`, prywatny wyciąg z 2002, nie oficjalny skan PKN | Kompletny poza Tablicami 41A/41B (brakujące w tym konkretnym wyciągu — rozwiązane materiałem branżowym niżej, czytać **razem z** `materialy-branzowe-ochrona-przeciwporazeniowa-2010`) | Uniwersalny |
| **PN-IEC 60364-4-43:1999** (ochrona przed przetężeniem) | [`norma-PN-IEC-60364-4-43/`](norma-PN-IEC-60364-4-43/) | `.doc`, prywatny wyciąg | Kompletny, zweryfikowany krzyżowo dwiema metodami ekstrakcji | Uniwersalny |
| **PN-EN 60445:2010** (identyfikacja zacisków urządzeń) | [`norma-PN-EN-60445/`](norma-PN-EN-60445/) | Skan PKN, 16 str. | Kompletny, przeczytany w całości wizualnie | Uniwersalny |
| **IEC 62109-2:2011** (bezpieczeństwo przetwornic PV — falowniki, część 2) | [`norma-IEC-62109-2/`](norma-IEC-62109-2/) | Natywny tekst, angielski (FDIS), 30 str. | Kompletny, od tytułu po bibliografię. Brak Części 1 (wymagania ogólne) w projekcie źródłowym | Uniwersalny dla PV/inwerterów, nie tylko off-grid |
| **UNE-HD 60364-7-712:2017** (instalacje PV) | [`norma-HD-60364-7-712/`](norma-HD-60364-7-712/) | Skan, 6 str. | 🔴 Tylko spis treści + bibliografia — praktycznie bezużyteczny, brak treści technicznej (klauzule 712.41-712.6, Załącznik B) | Uniwersalny temat, ale materiał bez wartości w obecnej postaci |
| **Materiał branżowy "Bezpieczeństwo instalacji fotowoltaicznych" (2019)** | [`materialy-branzowe-PV-2019/`](materialy-branzowe-PV-2019/) | PDF + `.docx` | Przeanalizowany, nie jest normą — indeks 34/43 norm PV z numerami, tabele promieni gięcia/odległości/konserwacji | Uniwersalny dla tematyki PV |
| **Materiał branżowy "Aktualne przepisy ochrony przeciwporażeniowej" (2010)** | [`materialy-branzowe-ochrona-przeciwporazeniowa-2010/`](materialy-branzowe-ochrona-przeciwporazeniowa-2010/) | PDF + `.docx` | Przeanalizowany, nie jest normą — rozwiązuje brak Tablic 41A/41B z normy 4-41 wyżej, zawiera aktualną Tablicę 41.1 (czytać razem z `norma-PN-IEC-60364-4-41`) | Uniwersalny |
| **PN-EN 1991-1-3:2005** (Eurokod 1, obciążenie śniegiem) | [`norma-PN-EN-1991-1-3/`](norma-PN-EN-1991-1-3/) | Skan, 54 str. | Kompletny, przeczytany w całości wizualnie strona po stronie. Załącznik krajowy NB (mapa 5 stref) specyficzny dla Polski | Uniwersalny — każda aplikacja z konstrukcją dachową/budowlaną, nie tylko PV |
| **PN-EN 1991-1-4:2008** (Eurokod 1, wiatr) | [`norma-PN-EN-1991-1-4-2008/`](norma-PN-EN-1991-1-4-2008/) | zob. `00-INDEKS.md` katalogu | Pełny tekst PN + Załącznik krajowy NA (Tablice NA.1–NA.3: strefy wiatrowe PL, ciśnienie ssania dachu). Źródło: szkieletowy. Kopia offgrida (`norma-PN-EN-1991-1-4`) była bajt-w-bajt tym samym PDF-em — zachowano bogatszą wersję. | Konstrukcje, dachy, PV na dachu — każda aplikacja z obciążeniem wiatrem |
| **PN-EN 1991-1-1:2004** (Eurokod 1, ciężary i obciążenia użytkowe) | [`norma-PN-EN-1991-1-1-2004/`](norma-PN-EN-1991-1-1-2004/) | zob. `00-INDEKS.md` katalogu | Pełny tekst PN, Załącznik A (ciężary materiałów), NB. | Konstrukcje budowlane |
| **PN-EN 1990:2004** (Eurokod 0, podstawy projektowania) — skan/OCR | [`norma-PN-EN-1990-eurokod-0/`](norma-PN-EN-1990-eurokod-0/) | zob. `00-INDEKS.md` katalogu | Skan 120 str. z OCR + lista Eurokodów w PN; kopie z Studocu o niskiej wartości (znak wodny) — patrz indeks katalogu. | Każda aplikacja konstrukcyjna |
| **EN 1990:2002+A1:2005** (wydanie angielskie BS) | [`norma-EN-1990-2002/`](norma-EN-1990-2002/) | zob. `00-INDEKS.md` katalogu | Angielski tekst; wartości ψ zalecane, nie krajowe — patrz indeks katalogu. | Konstrukcje; uzupełnia skan PN-EN 1990 |
| **PN-EN 1995-1-1:2010** (Eurokod 5, drewno) | [`norma-PN-EN-1995-1-1-2010/`](norma-PN-EN-1995-1-1-2010/) | zob. `00-INDEKS.md` katalogu | Pełny tekst PN w rozbiciu na rozdziały + NA. Źródło: szkieletowy (kopia offgrida identyczna — pominięta). | Konstrukcje drewniane, szkieletowe |
| **PN-EN 1995-1-2:2008** (Eurokod 5, pożar) | [`norma-PN-EN-1995-1-2-2008/`](norma-PN-EN-1995-1-2-2008/) | zob. `00-INDEKS.md` katalogu | Pełny tekst PN, rozbity na sekcje i załączniki. | Konstrukcje drewniane — odporność ogniowa |
| **EN 1995-1-2:2004** (wydanie angielskie BS) | [`norma-EN-1995-1-2-2004/`](norma-EN-1995-1-2-2004/) | zob. `00-INDEKS.md` katalogu | Wydanie angielskie z poprawkami AC; uzupełnia polską PN-EN 1995-1-2. | Jak wyżej |
| **PN-EN 338 / PN-EN 14080** (klasy drewna) — zestawienie tablic | [`norma-PN-EN-338-i-PN-EN-14080/`](norma-PN-EN-338-i-PN-EN-14080/) | zob. `00-INDEKS.md` katalogu | ⚠️ NIE pełny tekst norm — dwustronicowe zestawienie tablic klas wytrzymałości. | Konstrukcje drewniane |
| **PN-EN ISO 6946:2017** (opór cieplny, U) | [`norma-PN-EN-ISO-6946-2017/`](norma-PN-EN-ISO-6946-2017/) | zob. `00-INDEKS.md` katalogu | Pełny tekst PN + załączniki. | Fizyka cieplna przegród — każdy projekt energetyczny budynku |
| Opracowanie: opór cieplny i U wg ISO 6946:2008 (+ISO 13370) | [`materialy-branzowe-opor-cieplny-i-U-wg-pn-en-iso-6946-2008/`](materialy-branzowe-opor-cieplny-i-U-wg-pn-en-iso-6946-2008/) | zob. `00-INDEKS.md` katalogu | Materiał branżowy, nie norma; tablice materiałowe. | Fizyka cieplna |
| **PN-EN ISO 13788:2003** (wilgoć, kondensacja) | [`norma-PN-EN-ISO-13788-2003/`](norma-PN-EN-ISO-13788-2003/) | zob. `00-INDEKS.md` katalogu | Pełny tekst PN. Uwaga: niespójność Rsi (D162 szkieletowego) rozstrzygana fragmentem ISO 13788:2012 niżej. | Fizyka budowli |
| **ISO/EN ISO 13788:2012** — fragment | [`norma-EN-ISO-13788-2012-fragment/`](norma-EN-ISO-13788-2012-fragment/) | zob. `00-INDEKS.md` katalogu | ⚠️ Tylko publiczny podgląd (próbka iTeh), nie cała norma. | Fizyka budowli |
| Materiał: migracja wilgoci wg ISO 13788 (PG) | [`materialy-branzowe-migracja-wilgoci-pn-en-iso-13788/`](materialy-branzowe-migracja-wilgoci-pn-en-iso-13788/) | zob. `00-INDEKS.md` katalogu | Slajdy szkoleniowe, nie norma. | Fizyka budowli |
| Artykuł: metoda φi,max (Starakiewicz i in., 2015) | [`materialy-branzowe-metoda-fi-max-kondensacja-powierzchniowa/`](materialy-branzowe-metoda-fi-max-kondensacja-powierzchniowa/) | zob. `00-INDEKS.md` katalogu | Artykuł naukowy, nie norma. | Fizyka budowli |
| Szablon fRsi z danymi klimatycznymi (PŁ) | [`materialy-branzowe-frsi-dane-klimatyczne-lodz/`](materialy-branzowe-frsi-dane-klimatyczne-lodz/) | zob. `00-INDEKS.md` katalogu | Szablon ćwiczeniowy, częściowe dane, nie norma. | Fizyka budowli |
| Przykład kondensacji międzywarstwowej (ZUT) | [`materialy-branzowe-przyklad-kondensacja-miedzywarstwowa-zut/`](materialy-branzowe-przyklad-kondensacja-miedzywarstwowa-zut/) | zob. `00-INDEKS.md` katalogu | Notatka/przykład dydaktyczny. | Fizyka budowli |
| Trzy materiały fizyki budowli (Studocu) | [`materialy-fizyka-budowli/`](materialy-fizyka-budowli/) | zob. `00-INDEKS.md` katalogu | Kopie dydaktyczne; trzy PDF-y są bajt-w-bajt duplikatami plików z czterech katalogów `materialy-branzowe-*` (zostawione, bo indeks katalogu je cytuje). | Fizyka budowli |
| Artykuł: straty ciepła przez grunt wg ISO 13370 (Pogorzelski, ITB 2002) | [`materialy-branzowe-straty-ciepla-przez-grunt-iso-13370/`](materialy-branzowe-straty-ciepla-przez-grunt-iso-13370/) | zob. `00-INDEKS.md` katalogu | Artykuł recenzowany, nie norma; **jedyny materiał o gruncie** — dalej brak samej normy ISO 13370. | Fizyka cieplna budynków |
| **ISO 10456:2007** (właściwości cieplno-wilgotnościowe materiałów) | [`norma-ISO-10456-2007/`](norma-ISO-10456-2007/) | zob. `00-INDEKS.md` katalogu | Wydanie angielskie ISO, tablice obliczeniowe. | Fizyka budowli |
| **PN-EN ISO 14683** (mostki cieplne, wartości orientacyjne) | [`norma-PN-EN-ISO-14683-1/`](norma-PN-EN-ISO-14683-1/) | zob. `00-INDEKS.md` katalogu | Pełny tekst (wydanie robocze 2007), 27 str. | Fizyka cieplna / EN 12831 |
| **EN ISO 13786:2007** (dynamiczne charakterystyki cieplne) | [`norma-PN-EN-ISO-13786/`](norma-PN-EN-ISO-13786/) | zob. `00-INDEKS.md` katalogu | Wydanie angielskie, OCR + wzory zweryfikowane. | Fizyka cieplna |
| **PN-82/B-02402** (temperatury wewnętrzne ogrzewanych pomieszczeń) | [`norma-PN-82-B-02402/`](norma-PN-82-B-02402/) | zob. `00-INDEKS.md` katalogu | Stara norma, 4 str.; status obowiązywania niezweryfikowany. | Ogrzewnictwo |
| **PN-82/B-02403** (temperatury obliczeniowe zewnętrzne, strefy I–V) | [`norma-PN-82-B-02403/`](norma-PN-82-B-02403/) | zob. `00-INDEKS.md` katalogu | 5 str.; wartości stref zgodne z załącznikiem krajowym PN-EN 12831 (Tabela 2.1 poradników). Mapa stref — patrz Purmo/Elektra niżej. | Ogrzewnictwo, strefy temperatur — offgrid, szkieletowy |
| Poradniki PN-EN 12831 (Purmo 2007 v1.06 i 2012 v1.10, Elektra 2016 v2.00) | [`materialy-Purmo-PN-EN-12831-ogrzewanie/`](materialy-Purmo-PN-EN-12831-ogrzewanie/) | zob. `00-INDEKS.md` katalogu | ⚠️ To poradniki, **nie** sama norma (autorzy: nie zastępują PN). Zawierają Rys. 2.1 (mapa stref temperatur I–V) i Tab. 2.1–2.2. Plik `…Elektra…-wyd-2011.pdf` jest w treści wydaniem II z 2016 r. (nazwa myli rok). Poradnik Purmo 2007 dodano 07.10.2026 od właściciela. | Ogrzewnictwo — offgrid, szkieletowy |
| **HD 60364-4-443:2017** (przepięcia) — wersja serbska SRPS | [`norma-HD-60364-4-443/`](norma-HD-60364-4-443/) | zob. `00-INDEKS.md` katalogu | Pełny tekst, 18 str., wersja językowa serbska. | Instalacje elektryczne |
| IEC 62109-1 — whitepaper o izolacji | [`norma-IEC-62109-1/`](norma-IEC-62109-1/) | zob. `00-INDEKS.md` katalogu | ⚠️ Artykuł firmowy, nie tekst normy. | PV, falowniki |
| Poradnik Furse do BS EN 62305 + artykuł o zmianach PN-EN 62305 | [`norma-IEC-62305/`](norma-IEC-62305/) | zob. `00-INDEKS.md` katalogu | ⚠️ Poradnik producenta (140 str., skan z OCR), **nie** tekst normy 62305; dołączono artykuł Boryn/Olesz 2010. Plik 58 MB. | Ochrona odgromowa |
| Karta katalogowa panelu JA Solar JAM60D41 LB | [`karta-katalogowa-JA-Solar-JAM60D41-LB/`](karta-katalogowa-JA-Solar-JAM60D41-LB/) | zob. `00-INDEKS.md` katalogu | Karta producenta (obraz). | PV — offgrid |
| Karty techniczne Knauf Unifit 032/033/035/037 | [`karta-knauf-unifit-035/`](karta-knauf-unifit-035/) | zob. `00-INDEKS.md` katalogu | Karty producenta. | Izolacje — szkieletowy |
| Karty Isover Vario XtraSafe / KM Duplex UV | [`karta-isover-vario-membrany/`](karta-isover-vario-membrany/) | zob. `00-INDEKS.md` katalogu | Karty producenta. | Membrany paroizolacyjne — szkieletowy |
| Wykaz Eurokodów w zbiorze PN (stan 7.04.2021) | [`materialy-branzowe-wykaz-eurokodow-pl-2021/`](materialy-branzowe-wykaz-eurokodow-pl-2021/) | zob. `00-INDEKS.md` katalogu | Tabela PKN: numery EN/PN-EN, NA, poprawki. Pomocne do sprawdzania erratów. | Wszystkie Eurokody |
| Przykład obliczeniowy strat ciepła do gruntu wg ISO 13370 (PŁ) | [`materialy-PL-przyklad-obliczeniowy-ISO-13370-grunt/`](materialy-PL-przyklad-obliczeniowy-ISO-13370-grunt/) | zob. `00-INDEKS.md` katalogu | ⚠️ Materiał dydaktyczny, nie norma; policzony przykład (U₀ = 0,43 W/m²K); 2 str. | Fizyka cieplna — dane testowe do ISO 13370 |
| Właściwości mechaniczne drewna (notatka wg PN-EN 338:2004) | [`materialy-drewno-wlasciwosci-mechaniczne-pn-en-338-2004/`](materialy-drewno-wlasciwosci-mechaniczne-pn-en-338-2004/) | zob. `00-INDEKS.md` katalogu | ⚠️ Notatka dydaktyczna, nie norma, **przestarzała (nie używać do obliczeń, 07.10.2026)**; **wartości różnią się od tablicy w `norma-PN-EN-338-i-PN-EN-14080/`** — patrz indeks katalogu | Konstrukcje drewniane |
| Trzy kopie Studocu dublujące pozycje bazy (PN-EN 1991-1-3, tablica 14080, Pogorzelski) | [`materialy-Studocu-kopie-dublujace-07-10-2026/`](materialy-Studocu-kopie-dublujace-07-10-2026/) | zob. `00-INDEKS.md` katalogu | ⚠️ Duplikaty treściowe; kopią wzorcową jest oryginał w bazie (wskazany w indeksie katalogu); licencja niezweryfikowana. Indeks ma przepisaną tablicę GL20h–GL32h. | Konstrukcje drewniane, obciążenie śniegiem, fizyka budowli |

**[07.10.2026] Rozszerzenie biblioteki — decyzja właściciela repo.** Właściciel zdecydował, że wszystkie dokumenty źródłowe z projektów downstream mają być trzymane w tym repo (jedna wspólna baza; projekty pobierają stąd, a nie od siebie nawzajem). Skopiowano pozostałe katalogi `norma-*` / `materialy-*` / `karta-*` z `docs/zrodla/` projektów `inzynier-offgrid-pro` (`70e7e65`) i `inzynier-szkieletowy-pro` (`c6e5ced`) — 1:1, bez zmian. Duplikaty (ten sam skrót git) pominięto; wyjątki opisane w wierszach. **Licencje:** dla 10 pierwszych pozycji obowiązuje potwierdzenie z 15.09.2026; dla pozycji dodanych 07.10.2026 właściciel zdecydował o trzymaniu ich w bazie, ale część to kopie z serwisów udostępniania dokumentów (Studocu), wydania obce (BS/serbskie/hiszpańskie), próbki i poradniki producentów — AI nie weryfikowała ich licencji, a status poszczególnych pozycji (norma vs poradnik vs fragment) jest w ich `00-INDEKS.md`. Brakuje nadal: samej PN-EN 12831 i jej załącznika krajowego, ISO 13370, mapy stref temperatur w oryginale — patrz `docs/katalog-zasobow-wspolnych.md`.

## Struktura (jak faktycznie skopiowana)

Ta sama konwencja co `docs/zrodla/` w projekcie źródłowym (patrz playbook, Krok 3) — zachowana 1:1
przy kopiowaniu, bez zmian: `norma-<OZNACZENIE>/` albo `materialy-branzowe-<TEMAT>-<ROK>/`, każdy
katalog z oryginałem bez zmian (PDF/skan/`.doc`/`.docx`) + `00-INDEKS.md` + pliki treści w Markdown
(rozbite per rozdział/załącznik normy, tam gdzie źródło tak je rozbiło).

## Jak korzysta z tego projekt downstream

Przy instalacji modułu opcjonalnego (Y.10) w projekcie inżynierskim: sprawdź manifest wyżej, skopiuj
(albo poproś o skopiowanie) tylko te pozycje, których dany projekt faktycznie potrzebuje — nie całość
z automatu — zachowując dołączony status weryfikacji, żeby projekt wiedział, czemu może zaufać bez
ponownej weryfikacji, a co wymaga jeszcze pracy.
