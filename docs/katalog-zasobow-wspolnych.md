# Katalog zasobów wspólnych — co jest w bazie wspólnej, co tylko w projektach, czego nie ma nigdzie

Stan na 07.10.2026. Odczyt projektów po `git fetch` z `origin/main`: inzynier-szkieletowy-pro `c6e5ced`, inzynier-offgrid-pro `70e7e65`, farmer360.io `bde026e`, zero-waste `204aed7`. Odczyt, bez edycji projektów.

**Jak używać (dla sesji w dowolnym projekcie).** Zanim szukasz normy, danych klimatycznych lub tabeli: znajdź wiersz niżej. Status mówi, skąd to wziąć:

- ✅ **W BAZIE** — jest w tym repo (`new-app-standards`), skopiuj wskazany katalog/plik.
- 🟡 **TYLKO W PROJEKCIE** — istnieje, ale nie w bazie wspólnej; w kolumnie „Gdzie” ścieżka i commit. Do czasu skopiowania do bazy czytaj z tamtego repo (`git fetch` + `git show origin/main:<ścieżka>`); nie kopiuj wprost bez wiedzy właściciela (patrz „Zasady” na dole).
- ❌ **NIE MA NIGDZIE** — luka; nie zgaduj, zgłoś właścicielowi (sekcja D).

Powiązane: `docs/biblioteka-norm/00-INDEKS.md` (spis norm już w bazie), `docs/standards/19-dane-srodowiskowe.md` (reguły danych środowiskowych), `docs/dane-srodowiskowe-raport-zrodel.md` (licencje źródeł).

---

## A. Normy i materiały normowe

W bazie (`docs/biblioteka-norm/`) jest dziś **10 pozycji** (elektryka niskiego napięcia, PV, śnieg). Reszta norm leży tylko w dwóch projektach inżynierskich. Kolumna „Duplikat” oznacza identyczny plik (ten sam skrót git) w obu projektach.

| Norma / materiał | Do czego służy | Status | Gdzie |
|---|---|---|---|
| PN-EN 1991-1-3:2005 (śnieg) + Załącznik krajowy NB (Tablica NB.1, Rys. NB.1) | `s_k` z wzorów strefowych, mapa stref | ✅ W BAZIE | `docs/biblioteka-norm/norma-PN-EN-1991-1-3/` (PDF + 8 plików md; ten sam PDF jest w offgrid i szkieletowym) |
| PN-HD 60364-5-52, 5-54; PN-IEC 60364-4-41, 4-43; PN-EN 60445; IEC 62109-2; UNE-HD 60364-7-712 (tylko spis); 2 materiały branżowe (PV 2019, ochrona 2010) | elektryka NN, uziemienia, ochrona, PV | ✅ W BAZIE | `docs/biblioteka-norm/` (szczegóły i status weryfikacji: `README.md` tamże) |
| **PN-EN 1991-1-4:2008 (wiatr) + NA (Tablica NA.1, Rys. NA.1)** | `v_b0`, `q_b0`, mapa stref wiatru | ✅ W BAZIE (skopiowane 07.10.2026, `docs/biblioteka-norm/`; kolumna „Gdzie” = pochodzenie) | offgrid `docs/zrodla/norma-PN-EN-1991-1-4/` (3 pliki), szkieletowy `docs/zrodla/norma-PN-EN-1991-1-4-2008/` (5 plików, w tym `01-zalacznik-krajowy-NA.md`); PDF 10,6 MB — **duplikat** |
| **PN-82/B-02403 (temperatury obliczeniowe zewn., strefy I–V)** | `θe` projektowa, `Tśr roczna` | ✅ W BAZIE (skopiowane 07.10.2026, `docs/biblioteka-norm/`; kolumna „Gdzie” = pochodzenie) | offgrid `docs/zrodla/norma-PN-82-B-02403/` (3), szkieletowy `docs/zrodla/norma-PN-82-B-02403/` (2); PDF 0,1 MB — **duplikat**. Załącznik z mapą w skanie jest pusty |
| Poradnik Purmo (PN-EN 12831, ogrzewanie, Rys. 2.1 — jedyna mapa stref temperatur w naszych repo) | mapa stref temperatur, straty ciepła | ✅ W BAZIE (skopiowane 07.10.2026, `docs/biblioteka-norm/`; kolumna „Gdzie” = pochodzenie) | offgrid `docs/zrodla/materialy-Purmo-PN-EN-12831-ogrzewanie/` (5 plików, 6 MB) **[07.10.2026]** Sprawdzone dwa dodatkowe PDF od właściciela: (a) „Metoda obliczania obciążenia cieplnego… wg PN-EN 12831”, Strzeszewski/Wereszczyński, ELEKTRA, wyd. II rozszerzone, 2016, v2.00 — to **ten sam plik** (hash `089221b`), który offgrid trzyma jako `Poradnik-ELEKTRA-…-wyd-2011.pdf`; nazwa w offgridzie myli rok (okładka: 2016); (b) poradnik Purmo 2007 v1.06 — starsza redakcja (w offgridzie jest edycja 2012), Rys. 2.1 i Tabela 2.1 identyczne. Mapa i tabela stref I–V nie dodają nic nowego; to wciąż poradniki, nie sama norma. |
| PN-EN 1990 / EN 1990:2002 (Eurokod 0) | kombinacje obciążeń | ✅ W BAZIE (skopiowane 07.10.2026, `docs/biblioteka-norm/`; kolumna „Gdzie” = pochodzenie) | offgrid `norma-PN-EN-1990-eurokod-0/` (9 plików, 26 MB), szkieletowy `norma-EN-1990-2002/` (PDF 3 MB) — **inne pliki PDF** (offgrid ma 4 PDF-y, w tym wykaz Eurokodów; szkieletowy `EN-1990-2002.pdf`) — wybrać pełniejszy przy kopiowaniu |
| PN-EN 1991-1-1:2004 (ciężary własne) | obciążenia stałe | ✅ W BAZIE (skopiowane 07.10.2026, `docs/biblioteka-norm/`; kolumna „Gdzie” = pochodzenie) | szkieletowy `norma-PN-EN-1991-1-1-2004/` (9 plików, 2 MB) |
| PN-EN 1995-1-1:2010 (drewno) | konstrukcje drewniane | ✅ W BAZIE (skopiowane 07.10.2026, `docs/biblioteka-norm/`; kolumna „Gdzie” = pochodzenie) | szkieletowy `norma-PN-EN-1995-1-1-2010/` (13 plików), offgrid `norma-PN-EN-1995-1-1-eurokod-5-drewno/` (3) — **duplikat PDF** |
| PN-EN 1995-1-2:2008 i EN 1995-1-2:2004 (drewno, pożar) | odporność ogniowa | ✅ W BAZIE (skopiowane 07.10.2026, `docs/biblioteka-norm/`; kolumna „Gdzie” = pochodzenie) | szkieletowy `norma-PN-EN-1995-1-2-2008/` (9 plików, 6 MB), `norma-EN-1995-1-2-2004/` (6, 2 MB) |
| PN-EN 338 i PN-EN 14080 (tablice klas drewna) | klasy wytrzymałości | ✅ W BAZIE (skopiowane 07.10.2026, `docs/biblioteka-norm/`; kolumna „Gdzie” = pochodzenie) | szkieletowy `norma-PN-EN-338-i-PN-EN-14080/` |
| PN-EN ISO 6946:2017 (opór cieplny, U) | współczynnik U przegród | ✅ W BAZIE (skopiowane 07.10.2026, `docs/biblioteka-norm/`; kolumna „Gdzie” = pochodzenie) | szkieletowy `norma-PN-EN-ISO-6946-2017/` (4 pliki, 14 MB) + opracowanie `materialy-branzowe-opor-cieplny-i-U-…` |
| PN-EN ISO 13788:2003 oraz fragment EN ISO 13788:2012 | kondensacja, metoda Glasera | ✅ W BAZIE (skopiowane 07.10.2026, `docs/biblioteka-norm/`; kolumna „Gdzie” = pochodzenie) | szkieletowy `norma-PN-EN-ISO-13788-2003/` (4, 6 MB), `norma-EN-ISO-13788-2012-fragment/` (próbka, niepełna) |
| ISO 10456:2007 (właściwości cieplne materiałów) | λ materiałów | ✅ W BAZIE (skopiowane 07.10.2026, `docs/biblioteka-norm/`; kolumna „Gdzie” = pochodzenie) | szkieletowy `norma-ISO-10456-2007/` (5 plików) |
| PN-82/B-02402 (temperatury w pomieszczeniach) | `θi` | ✅ W BAZIE (skopiowane 07.10.2026, `docs/biblioteka-norm/`; kolumna „Gdzie” = pochodzenie) | szkieletowy `norma-PN-82-B-02402/` |
| PN-EN ISO 13786, 14683-1 | pojemność cieplna, mostki | ✅ W BAZIE (skopiowane 07.10.2026, `docs/biblioteka-norm/`; kolumna „Gdzie” = pochodzenie) | offgrid `norma-PN-EN-ISO-13786/`, `norma-PN-EN-ISO-14683-1/` |
| HD 60364-4-443, IEC 62109-1, IEC 62305 (piorunochrony, 61 MB) | ochrona przed przepięciami, bezp. falowników, odgromowa | ✅ W BAZIE (skopiowane 07.10.2026, `docs/biblioteka-norm/`; kolumna „Gdzie” = pochodzenie) | offgrid `norma-HD-60364-4-443/`, `norma-IEC-62109-1/`, `norma-IEC-62305/` |
| Materiały branżowe fizyki budowli (Starakiewicz 2015, Pogorzelski 2002 straty przez grunt, FRSI Łódź, przykład kondensacji ZUT, wykaz Eurokodów 2021) | metody uzupełniające | ✅ W BAZIE (skopiowane 07.10.2026, `docs/biblioteka-norm/`; kolumna „Gdzie” = pochodzenie) | szkieletowy `docs/zrodla/materialy-branzowe-*` (po 1 PDF + md); offgrid `materialy-fizyka-budowli/` (7) |
| **PN-EN 12831 (sama norma, ZA krajowy)** | wartości projektowe temp. wg normy aktualnej | ❌ NIE MA NIGDZIE | w repo tylko poradnik Purmo „na podstawie” normy; stara PN-82/B-02403 obowiązuje przez ZA — potwierdzić wersję |
| **Mapa stref temperatur (oryginał normy)** | przypisanie lokalizacji do stref I–V | ❌ NIE MA NIGDZIE | tylko pośrednio: Rys. 2.1 Purmo |

## B. Dane środowiskowe (klimat, strefy, miejscowości)

Rozdz. 19 standardu wyznacza docelowo osobne repo `dane-srodowiskowe`. Repo jeszcze **nie istnieje** (utworzenie zwróciło 403 po stronie sesji). Paczka jest gotowa jako lokalne repo z wyciętą historią w sesji nad standardem (nie jest dostępna innym sesjom, dopóki nie trafi do wspólnego miejsca — patrz „Decyzja” w sekcji E).

| Zasób | Zawartość | Status | Gdzie |
|---|---|---|---|
| Baza meteo (schemat v3): 62 lokalizacje — 61 stacji MIIB (IMGW 1971–2000, 18 z niepełnym ciągiem) + punkt na żądanie; miesięczne θe, φe, pe, promieniowanie, wiatr, stopniodnie, min./maks. godzinowe; surowe pliki godzinowe wydawcy i PVGIS TMY; `meteo.sqlite`; schematy; skrypty | klimat do obliczeń cieplno-wilgotnościowych i PV | 🟡 TYLKO W PROJEKCIE + kopia w paczce sesji | szkieletowy `dane/meteo/` (źródło prawdy dziś); paczka: `dane/meteo/` w repo-do-wydania |
| **Warstwa opadowa**: opad [mm], opad śniegu [cm], dni z opadem ≥1 mm, maks. dobowy opad, zachmurzenie [%], miesięcznie, 1991–2020, 62 lokalizacje | opad/śnieg/zachmurzenie | 🟡 W PACZCE SESJI (nie w żadnym repo projektu) | `dane/meteo/opady/` + `README.md` (ograniczenia: reanaliza ERA5 przez Open-Meteo, nie stacja IMGW; `opadSnieg` ≠ `s_k`; licencja do bramki) |
| **Strefy normowe — wartości norm**: wzory i stałe śniegu (NB.1), wiatru (NA.1), temperatury projektowe I–V — z odesłaniem do punktu normy | zastępuje ręczne tablice w projektach | 🟡 W PACZCE SESJI | `dane/strefy-normowe/normy.json`. Zgodne co do wartości z kodem szkieletowego (`seed.ts`: D57, D61) |
| **Strefy normowe — przypisania** 62 lokalizacji do stref śniegu i wiatru (z cyfrowej mapy szkieletowego) oraz temperatury (odczyt własny) | strefy dla znanych lokalizacji | 🟡 W PACZCE SESJI | `dane/strefy-normowe/przypisania.json`; temperatura: nadal „do weryfikacji” |
| Cyfrowa mapa stref śniegu i wiatru, siatka 0,05° (Rys. NA.1/NB.1 zdigitalizowane) + skrypt | strefy dla dowolnego punktu w Polsce | 🟡 TYLKO W PROJEKCIE | szkieletowy `dane/strefy/strefy-mapa.json` + `skrypty/zbuduj_strefy_z_mapy.py` (D177–D179); kopia pliku w paczce sesji tylko jako źródło odczytu |
| Baza miejscowości PRNG (101 334 rekordów, nazwa → współrzędne) | wyszukiwarka lokalizacji | 🟡 TYLKO W PROJEKCIE | szkieletowy `dane/miejscowosci/`, `docs/zrodla/prng-2026-10/`, `public/dane/miejscowosci.json` |
| PVGIS TMY 16 miast + wyniki | napromienienie | 🟡 TYLKO W PROJEKCIE | szkieletowy `docs/zrodla/pvgis-2026-10/`, `klimat-miesieczny-2026-10/pvgis-tmy/` |
| Taryfy OSD 2026 (Enea, Energa, Stoen, Tauron), URE opłata mocowa | koszty energii | 🟡 TYLKO W PROJEKCIE | offgrid `docs/zrodla/*Taryfa*.pdf`, `Material_Stawki_Dystrybucyjne_OSD_*.md` |
| Wysokość n.p.m. dowolnego punktu (DEM) | `A` we wzorach śniegu/wiatru | ❌ NIE MA NIGDZIE | w bazie tylko wysokość stacji MIIB; dla punktu na żądanie brak źródła (TD40 szkieletowego) |
| Strefa przemarzania gruntu (mapa/tablica) | fundamenty | ❌ NIE MA NIGDZIE | szkieletowy wpisuje ręcznie |
| Wykaz stref według gmin (śnieg/wiatr/temperatura) | zamiast odczytu z mapy | ❌ NIE MA NIGDZIE | norma publikuje tylko rysunek |
| Dane agro dla farmer360 (gleba SoilGrids/IUNG, NDVI Sentinel-2, alerty pogodowe) | warstwa D rozdz. 19 | ❌ NIE MA NIGDZIE | wymagania w Biblii farmer360 (`docs/zrodla/`); dostawcy w raporcie źródeł |

## C. Dokumenty domenowe projektów (nie do współdzielenia)

To materiał własny jednego projektu, nie baza wspólna. Wymieniony, żeby było jasne, że nie ma ich w tym repo i nie powinno.

| Projekt | Dokumenty | Gdzie |
|---|---|---|
| farmer360.io | Biblia v1.3 + 17 rozdziałów tematycznych + 7 rund burzy AI + folder `Nowe` | `docs/zrodla/` |
| inzynier-offgrid-pro | Biblia Offgrid v2.0, 14 treści modułów, zasady UX, opracowania (M14, taśmy LED, dobór napięcia) | `docs/zrodla/` |
| inzynier-szkieletowy-pro | Biblia v2.1, moduły silnika, specyfikacje UI, prompty v0 | `aktualne pliki/`, `docs/silnik/zrodla/` |
| zero-waste | brak dokumentów źródłowych (tylko README) | `docs/zrodla/README.md` |
| (to repo) | 3 dokumenty techniczne AI offline/PWA (21.09.2026) | `docs/zrodla/` |

Karty techniczne produktów (Knauf Unifit 032/033/035/037, Isover Vario, JA Solar JAM60D41) — własne dla szkieletowego/offgrida, ✅ skopiowane do `docs/biblioteka-norm/` (`karta-*`) 07.10.2026.

## D. Luki do zgłoszenia właścicielowi

**[07.10.2026, sprostowanie]** Metoda ISO 13370 jest wdrożona w szkieletowym (D64, artykuł Pogorzelskiego); w bazie jest też policzony przykład z PŁ (`materialy-PL-przyklad-obliczeniowy-ISO-13370-grunt/`) — brakuje wyłącznie pełnego tekstu normy. PN-EN 1991-1-3 (pełny tekst, 54 str.) jest w bazie. **Otwarta rozbieżność:** wartości klas drewna wg PN-EN 338 różnią się między tablicą w bazie a notatką `materialy-drewno-…` (ścinanie, część f_c,90) — hipoteza: różne wydania normy, niezweryfikowane.

1. Mapa stref temperatur z normy (nie z poradnika) — bez niej temperatury stref dla 29 z 62 lokalizacji pozostają „do weryfikacji”.
2. Obszar czarny mapy śniegu (Rys. NB.1): mapa nie rozróżnia stref 3/4/5. Szkieletowy przyjął „3” (D179, polecenie właściciela); w górach to może być 4–5. Przypisania w bazie niosą flagę.
3. PN-EN 12831: brak samej normy w repo.
4. Wysokość punktu na żądanie, strefa przemarzania, wykaz gmin.

## E. Zasady kopiowania do bazy

1. **Licencja norm PKN**: właściciel potwierdził 15.09.2026, że licencja pozwala trzymać zakupione normy „dla pracy nad projektem, jeśli projekt ich potrzebuje” (`docs/biblioteka-norm/README.md`). To objęło 10 pozycji. **[07.10.2026] Właściciel zdecydował: wszystkie dokumenty źródłowe z projektów trzymamy w bazie** (zakres nie ogranicza się do norm potrzebnych ≥2 projektom); skopiowano 31 dalszych katalogów (`docs/biblioteka-norm/README.md`). Licencja pozycji spoza 10 pierwszych (kopie ze Studocu, wydania BS/serbskie, próbki, poradniki producentów) nie była weryfikowana przez AI — status w manifeście.
2. **Duplikaty** (ten sam plik, zgodny skrót git, w offgridzie i szkieletowym — sprawdzone: PN-82/B-02403, PN-EN 1991-1-3, PN-EN 1991-1-4, PN-EN 1995-1-1, FRSI Łódź, metoda Fi-max, przykład kondensacji ZUT, wykaz Eurokodów 2021) trzymamy w bazie raz. Pliki md z wyciągami treści różnią się między projektami (szkieletowy ma ich więcej dla 1991-1-4, 1995-1-1, 1991-1-1) — przy kopiowaniu porównać i wziąć pełniejsze.
3. **Niewspółdzielone**: Biblie, treści modułów, dane agro — zostają w projektach. (Karty produktów dostawców skopiowano do bazy 07.10.2026 decyzją właściciela, patrz E.1; taryfy OSD nie skopiowane — to nie normy.)
4. **Dane środowiskowe**: reguły rozdz. 19; JSON źródłem prawdy; licencje źródeł do bramki licencyjnej (`docs/dane-srodowiskowe-raport-zrodel.md`).
5. **Aktualizacja katalogu**: sesja nad `new-app-standards` przy każdym odczycie U.4 aktualizuje stan i skróty commitów.

**[07.10.2026, później]** Trzy wgrane przez właściciela kopie Studocu (PN-EN 1991-1-3, tablica PN-EN 14080, Pogorzelski) zapisane w `docs/biblioteka-norm/materialy-Studocu-kopie-dublujace-07-10-2026/` z opisem i wskazaniem kopii wzorcowych. Rozbieżność klas drewna: hipoteza (nie weryfikacja) — tablica w bazie = wydanie ≥2009 (f_v,k = 4,0), notatka Szymańskiego = wydanie 2003/2004; wzorcowa tablica w `norma-PN-EN-338-i-PN-EN-14080/`, notatka oznaczona jako nieaktualna.
