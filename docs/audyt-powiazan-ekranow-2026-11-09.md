# Audyt powiązań między ekranami — 09.11.2026 (stan kodu 3.53.4)

**Po co ten plik.** Właściciel zlecił sprawdzenie, czy wszystkie funkcje współpracują i dynamicznie wymieniają dane tak, jak zakłada projekt („nie ma prawa być tak, że funkcja, która musi mieć wpływ na inne, nie ma na nie wpływu albo jej wyników nie widzą”). Ten dokument to wynik analizy i **zlecenie dla sesji naprawczej**. W tej sesji niczego w aplikacji nie zmieniano — poza dodaniem tego raportu, załącznika i skryptu pomiarowego.

**Jak czytać.** Sekcja 1 — wniosek w pięciu zdaniach. Sekcja 2 — co projekt zakładał. Sekcja 3 — błędy w istniejących połączeniach (konkretne, do naprawy bez decyzji). Sekcja 4 — połączenia, których brakuje (wymagają decyzji z sekcji 6). Sekcja 5 — czego nie znaleziono. Sekcja 7 — proponowana kolejność napraw. Dane liczbowe: `docs/audyt-powiazan-ekranow-zalacznik.md` (generowany: `node scripts/audyt-powiazan-ekranow.mjs --write`).

**Oznaczenia pewności.** ✅ potwierdzone w kodzie (podany plik i linia) · 🔎 wynika z kodu, ale wymaga sprawdzenia w przeglądarce lub na żywej usłudze, zanim zostanie naprawione.

---

## 1. Wniosek

1. **Pojedyncze kalkulatory są sprawne.** Typecheck, lint, 4302 testy i wszystkie strażniki przechodzą; każdy z 284 kalkulatorów jądra ma ekran i narzędzie AI; nie ma martwych przycisków, pustych handlerów ani linków do nieistniejących tras.
2. **Aplikacja nie działa jeszcze jak jeden projekt instalacji.** Z 311 pozycji rejestru pulpitu (304 różne ekrany) tylko 61 czyta cokolwiek spoza siebie, a 20 z nich to wyłącznie podpowiedź napięcia w trybie mikroinstalacji. Moduły 2, 8, 9, 10 i 11 nie czytają niczego (0 ekranów), moduł 4 — 2 z 36, moduł 5 — 1 z 29.
3. **Te same liczby wpisuje się ręcznie po kilkadziesiąt razy.** Zużycie energii na 35 ekranach, pojemność baterii na 31, napięcie układu na 29, klimat i temperatura minimalna na 28, parametry panelu na 25 — bez żadnego powiązania z ekranem, który tę liczbę policzył.
4. **Wyniki głównych ekranów doboru nigdzie nie trafiają:** liczba paneli, konfiguracja stringów, moc falownika, przekrój kabla, napięcie systemowe, temperatura minimalna lokalizacji. Ekran je liczy, pokazuje i na tym koniec.
5. **W istniejących połączeniach jest sześć realnych błędów** (sekcja 3), z czego dwa mogą dać użytkownikowi złą liczbę bez żadnego ostrzeżenia: utrata ostatniej zmiany przy szybkim przejściu na inny ekran oraz kwota czytana z cudzego ekranu w innej walucie.

---

## 2. Co projekt zakładał (źródła prawdy)

| Założenie | Gdzie zapisane | Stan |
|---|---|---|
| Kafle mają czytać dane od poprzednich: 2←1, 3←1+2, 4←2+3, 5←3+4, 6←1+2, 7←1–6 („spina wszystko”), 8←4+5+6+7+9, 10←„prawie wszystko”, 11←4 | `docs/pulpit-i-nawigacja.md`, sekcja 2 (tabela zależności) | Zrealizowane częściowo — tabela w 4.1 |
| „Profil sprzętu — zapamiętaj i wykorzystaj wszędzie”: panel, falownik/MPPT, bateria/BMS, generator wpisane raz; każdy ekran domyślnie wypełnia się z profilu, z możliwością nadpisania; wiele wariantów; pytanie o zapis przy wyjściu | `docs/zrodla/Zasady_UX_Doradca_v2_1.md`, §10 | Zbudowane tylko: 2 liczby baterii i migawka panelu (`lib/profil-sprzetu/types.ts`, komentarz „świadomie NIE zbudowana teraz”, wpis w memory z 19.09.2026) |
| Ekran „Lokalizacja i dane klimatyczne” zasila klimatem PV, ogrzewanie i stress-test | komentarz w `lib/core/modules/lokalizacja/lokalizacja-i-klimat/calculator.ts:14` i tekst pomocy pola (`lib/i18n/pomoc/m01-lokalizacja.ts:33`: „Zasila zimowe stress-testy…”) | Współrzędne — tak; temperatura minimalna — nikt jej nie czyta (3.4) |
| Pole nigdy nie jest wypełniane po cichu — ekran pokazuje podpowiedź z przyciskiem „Użyj” | decyzja właściciela 11.10.2026 (`components/napiecie-z-profilu.tsx`, nagłówek) | Obowiązuje dla napięcia; **koliduje z §10** („domyślnie wypełnia się”) — decyzja D-1 w sekcji 6 |
| Jeden właściciel zapisu, pozostałe ekrany tylko czytają | `lib/adapters/use-persisted-draft.ts:140` | Przestrzegane (sprawdzono: żaden klucz ekranu nie ma dwóch zapisujących poza świadomie wspólnym `siec-segment-przejscia`) |

---

## 3. Błędy w istniejących połączeniach (do naprawy bez decyzji właściciela)

### 3.1 ✅ Ostatnia zmiana ginie przy przejściu na inny ekran w ciągu 0,5 s — **wysoki**

- **Gdzie:** `lib/adapters/use-persisted-draft.ts:112–130`. Zapis jest opóźniony o 500 ms (`DEBOUNCE_MS`), a funkcja sprzątająca efektu (`return () => clearTimeout(handle)`, linia 129) uruchamia się także przy odmontowaniu ekranu — i kasuje oczekujący zapis, zamiast go wykonać.
- **Skutek:** użytkownik poprawia liczbę i od razu klika link do następnego ekranu (albo zamyka kartę, albo telefon usypia przeglądarkę) → zmiana nie trafia do IndexedDB. Ekran docelowy czyta starą wartość, a po powrocie na ekran źródłowy pole też pokazuje starą. Dotyczy wszystkich 305 formularzy i każdego połączenia z sekcji „Załącznik 1”.
- **Naprawa:** przy odmontowaniu i przy `pagehide`/`visibilitychange → hidden` zapisać od razu to, co czeka (stan trzymać w `ref`, żeby sprzątanie miało aktualną wartość). To samo sprawdzić w `lib/profil-sprzetu/use-profil-sprzetu.ts` (tam zapis jest natychmiastowy — w porządku).
- **Kryterium:** test jednostkowy haka: zmiana stanu → odmontowanie przed upływem 500 ms → `getItem` zwraca nową wartość. Dodatkowo próba w przeglądarce: wpis → natychmiastowe kliknięcie linku → ekran czytający widzi nową liczbę.

### 3.2 ✅ Kwota czytana z cudzego ekranu bez sprawdzenia waluty — **wysoki przy walucie innej niż zł**

- **Mechanizm:** ekran z listą pól kwotowych (`konwersjaKwot`) przelicza wpisane kwoty na walutę wyświetlania i zapisuje obok szkicu, w jakiej walucie jest szkic (`offgrid.draftwaluta.<ekran>`, `use-persisted-draft.ts:22`). Ekran nieotwarty w chwili zmiany waluty przelicza się dopiero przy następnej wizycie. `useOdczytDraftu` (linia 145) czyta sam szkic — znacznika waluty nie czyta nikt poza właścicielem.
- **Przypadek A:** `app/kalkulatory/magazyn-firmy/page.tsx:55–66` czyta `cenaBateriiZl` z ekranu `oplacalnosc-magazynu` (ten przelicza kwoty: `PRZELICZ_KWOTY`, linia 33) i traktuje ją jako złotówki (ekran rynku polskiego, `useTranslate(true)`), a wynik pokazuje przez `zl()`, które przelicza z zł na walutę wyświetlania. Przy walucie EUR: cena wpisana w euro jest liczona jak złotówki i dzielona przez kurs drugi raz.
- **Przypadek B:** `raport-kryzysowy` i `wspolczynnik-bezpieczenstwa-zimowego` czytają szkic `deficyty-miesieczne` (ma `konwersjaKwot`: `KWOTY`, `page.tsx:148`) — koszt paliwa w raporcie jest w walucie z ostatniej wizyty na ekranie deficytów, a podpis w walucie bieżącej.
- **Naprawa:** jedno miejsce — `useOdczytDraftu` z opcją przeliczenia kwot (czyta znacznik waluty szkicu i przelicza wskazane pola na żądaną denominację: zł dla ekranów rynku polskiego, walutę bieżącą dla pozostałych). Wszystkie odczyty szkiców z kwotami mają z niej korzystać.
- **Kryterium:** test: szkic zapisany w EUR, czytelnik „stała zł” dostaje kwotę w zł; czytelnik „waluta bieżąca” po zmianie waluty bez wizyty na ekranie źródłowym dostaje kwotę przeliczoną.

### 3.3 ✅ „Starzenie i degradacja”: wartość z profilu i wartość wpisana ręcznie nadpisują się zależnie od kolejności wczytania — **średni**

- **Gdzie:** `app/kalkulatory/starzenie-degradacja/page.tsx:57–62`. Flaga `autoWypelnione` to zwykły stan komponentu (nie jest zapisywana), więc przy **każdym** otwarciu ekranu pojemność z profilu jest wpisywana do pola. Jednocześnie asynchronicznie wczytuje się własny szkic ekranu. Wygrywa to, co wczyta się później.
- **Skutek:** raz ręcznie poprawiona wartość zostaje zastąpiona wartością z Ekranu 1, innym razem nowa wartość z Ekranu 1 zostaje zastąpiona starą ze szkicu. Komentarz w kodzie (linia 54) deklaruje „tylko raz” i „ręczne edycje nie są nadpisywane” — kod tego nie zapewnia między wizytami.
- **Naprawa:** zależna od decyzji D-1 (podpowiedź z przyciskiem albo wypełnienie domyślne z jawnym oznaczeniem „z profilu / zmienione ręcznie”). W obu wariantach: czekać na `wczytano` obu źródeł i zapisać w szkicu, czy pole pochodzi z profilu.

### 3.4 ✅ Temperatura minimalna lokalizacji: pomoc obiecuje, że zasila stress-testy — nie czyta jej żaden ekran — **średni**

- **Gdzie:** pole `temperaturaMin` ekranu `lokalizacja-i-klimat`; jedyny czytelnik tego szkicu to `lib/lokalizacja/use-lokalizacja-projektu.ts:24–31` i bierze wyłącznie `szerokosc`/`dlugosc`.
- **Ekrany, które tę samą temperaturę każą wpisać od nowa (co najmniej):** `stress-test-mppt` (tminC), `dopasowanie-tablicy-falownika` (tminC), `panel-do-stacji-zasilania` (tminC), `grzalki-bms-mroz`, `long-term-storage`, `sztywnienie-izolacji`, `cykle-odszraniania` (tMin), `cop-pompy-ciepla` (tProj). Dla Voc max na mrozie to wielkość bezpieczeństwa: inna temperatura na dwóch ekranach = dwa różne werdykty dla tego samego stringu.
- **Naprawa:** hak „klimat projektu” obok `useLokalizacjaProjektu` (temperatura minimalna + źródło), podpięty do ekranów powyżej według modelu z D-1. Do czasu naprawy tekst pomocy mówi nieprawdę (PL/EN/RU).

### 3.5 ✅ Panel podstawowy zapisany w profilu sprzętu nie ma żadnego odbiorcy — **średni**

- **Gdzie:** `zapiszPanel` woła tylko `app/kalkulatory/porownywarka-paneli/page.tsx:399`; `profil.panel` czyta tylko ten sam plik (linie 388, 736). Żaden ekran PV nie używa Voc/Isc/Vmp/Imp/β/γ/mocy z profilu.
- **Skutek:** użytkownik za zgodą (U14) zapisuje „panel podstawowy”, po czym na `konfigurator-stringow`, `stress-test-mppt`, `dopasowanie-tablicy-falownika`, `ochrona-stringow`, `analiza-zwarciowa`, `ochrona-przepieciowa-spd`, `wplyw-temperatury`, `liczba-paneli`, `niedopasowanie-paneli`, `zacienienie-diody-bocznikujace`, `panel-do-stacji-zasilania` wpisuje te same dane z karty od zera. Zapis w profilu jest dziś funkcją bez skutku.
- **Naprawa:** komponent podpowiedzi „z panelu podstawowego” (jak `NapiecieZProfilu`) na ekranach powyżej. Zgodne z planem etapu „G” Porównywarki (wpis listy z 08.10.2026: „wspólny profil panelu i miejsca instalacji”).

### 3.6 ✅ Profil baterii nie wycofuje nieaktualnej liczby — **niski**

- **Gdzie:** `app/kalkulatory/dobor-pojemnosci-baterii/page.tsx:67–73` i `starzenie-degradacja/page.tsx:74–81` zapisują do profilu tylko wynik `VALID`. Gdy użytkownik wyczyści pole albo wynik przestanie być poprawny, w profilu zostaje poprzednia liczba, a `porownywarka-paneli` (linia 1528) i `starzenie-degradacja` dalej ją podpowiadają jako „z Ekranu 1”.
- **Dodatkowo 🔎:** wyścig przy pierwszym zapisie — `zapiszBaterie` wywołane, zanim profil się wczyta, zmienia tylko stan w pamięci (`use-profil-sprzetu.ts:64`, warunek `wczytanoRef`), a nic nie ponawia zapisu po wczytaniu. Gdy szkic ekranu wczyta się przed profilem, wynik nie trafi do profilu do następnej edycji pola. Sprawdzić testem z opóźnionym magazynem.
- **Naprawa:** przy wyniku innym niż `VALID` usunąć wartość z profilu albo oznaczyć ją datą i pokazywać wiek; ponowić zapis po wczytaniu.

### 3.7 ✅ Odczyt cudzych danych jest jednorazowy — **niski dziś, istotny po naprawach z sekcji 4**

- `useOdczytDraftu` (`use-persisted-draft.ts:149–168`) i `useProfilSprzetu` czytają magazyn raz, przy zamontowaniu. Nie ma subskrypcji zmian. Dziś każdy ekran to osobna trasa, więc wejście na ekran = świeży odczyt. Problem pojawia się, gdy: aplikacja jest otwarta w dwóch kartach, ekran wraca z pamięci przeglądarki (bfcache), albo zapis i odczyt znajdą się na jednej stronie (planowane podsumowanie projektu, sekcja 4.4).
- **Naprawa (razem z 3.1):** wspólny magazyn z powiadamianiem (`useSyncExternalStore` + `BroadcastChannel`), z którego korzystają oba haki. Wzorzec jest już w repo: `lib/waluta/storage.ts`, `lib/i18n/storage.ts`.

### 3.8 Drobne

- ✅ Zdublowana stała klucza: `app/kalkulatory/tryb-ograniczonego-zuzycia/page.tsx:20` definiuje własne `KLUCZ_DRAFTU_ODBIORNIKOW` zamiast importu z `lib/obiekt/zuzycie-z-odbiornikow.ts:9` (dziś ta sama wartość; zmiana jednej rozłączy ekrany po cichu).
- ✅ `dni-autonomii` (moduł 2) i `dobor-pojemnosci-baterii` (moduł 4) mają identyczny zestaw pól (`zapotrzebowanieDoboweKwh`, `dniAutonomii`, `sprawnoscFalownikaPct`, `dodPct`) i nie są ze sobą połączone — tylko drugi zapisuje wynik do profilu. Użytkownik wypełnia to samo dwa razy; który wynik jest „tym właściwym”, nie wiadomo.
- 🔎 Asystent AI: `lib/ai/pytaj-asystenta.ts:650` i `lib/ai/odczyt-karty/wykonaj.ts:71` używają identyfikatora modelu `claude-opus-5`. Sprawdzić na żywym kluczu, czy to poprawny identyfikator — w środowisku tej sesji znane identyfikatory mają postać `claude-opus-5-5`; bez klucza API nie dało się tego potwierdzić. Każde pytanie wysyła też definicje wszystkich 288 narzędzi (koszt i czas odpowiedzi) — do pomiaru.

---

## 4. Połączenia, których brakuje (wymagają decyzji z sekcji 6)

### 4.1 Zależności kafli: założenie a kod

| Kafel | Ma czytać z | Co faktycznie czyta | Czego brakuje |
|---|---|---|---|
| 2 Zapotrzebowanie (18 ekranów) | 1 | nic | szerokość geograficzna w `profil-astronomiczny` (wpisywana ręcznie); **moduł nie ma ekranu, który sumuje jego wyniki w jedno „zapotrzebowanie dobowe/miesięczne projektu”** — bojler, wampiry, pobór własny falownika, bufor na rozbudowę, sezonowość liczą osobno i nikomu nie przekazują |
| 3 Instalacja PV (30) | 1, 2 | lokalizacja i dane PVGIS na 10 ekranach; zużycie tylko w Porównywarce | `liczba-paneli` bierze zapotrzebowanie ręcznie; wynik (liczba i moc paneli) nie trafia do `konfigurator-stringow`, `dopasowanie-tablicy-falownika`, `ochrona-stringow`; orientacja (azymut, nachylenie) wpisywana osobno na 12 ekranach |
| 4 Magazyn (36) | 2, 3 | 2 ekrany przez profil baterii | zapotrzebowanie dobowe ręcznie; wynik `napiecie-systemowe` nie jest nigdzie zapisywany; pojemność, chemia, DoD wpisywane od nowa na pozostałych ekranach modułu |
| 5 Okablowanie (29) | 3, 4 | tylko rodzaj obiektu w `ochrona-przepieciowa-spd` | prąd, napięcie, Isc, moc falownika — wszystko ręcznie; `dobor-mocy-falownika` i `dobor-przekroju-kabla` nie przekazują wyniku do doboru zabezpieczeń ani analizy zwarciowej |
| 6 Ogrzewanie (35) | 1, 2 | 8 ekranów czyta `obciazenie-cieplne` lub lokalizację | `koszty-ogrzewania` (zapotrzebowanie sezonowe), `kociol-elektryczny`, `alternatywne-zrodla-ciepla`, `gwc`, `nagrzewnica-powietrza` biorą zapotrzebowanie ręcznie; COP z `cop-pompy-ciepla` wpisywany ręcznie na 11 ekranach |
| 7 Stress-test (27) | 1–6 | 4 ekrany (deficyty, symulacja mrozu, współczynnik, raport) — te są połączone dobrze | `blackout`, `strategia-zamarzanie`, `awaria-stringa-zima`, `okno-sloneczne`, `deep-winter-budget`, `ladowanie-z-agregatu` każą wpisać pojemność baterii, zużycie i sprawność falownika od nowa |
| 8 Bezpieczeństwo (11) | 4, 5, 6, 7, 9 | nic (terminarz przeglądów zasila pulpit) | `ups-krytyczny` (pojemność, napięcie), `awaryjne-zrodlo-ciepla` (zapotrzebowanie ciepła) — ręcznie |
| 10 AI i prognozy (7) | „prawie wszystko” | nic | `prognozy`, `prognoza-soc`, `przesuwanie-zadan` biorą produkcję, zużycie i pojemność ręcznie; nie czytają też telemetrii z modułu 13 |
| 11 Montaż baterii (23) | 4 | nic | pojemność, napięcie, prąd — ręcznie |
| 12 Tryb mobilny (45) | samodzielny | 22 ekrany (napięcie z Ustawień, lista odbiorników) | zgodne z założeniem; plan O2–O5 w `docs/tryb-mikroinstalacji-specyfikacja.md` |
| 13 Tryb Live (5) | — | własny magazyn próbek | odbiorcą telemetrii poza modułem jest tylko `deficyty-miesieczne` |
| 15/16 Dom i Firma – sieć | 1–4, 6–8 | zużycie miesięczne, PV i magazyn M14, lokalizacja | **własny, równoległy zestaw danych** (moc PV, pojemność magazynu w `siec-pv-<segment>`), niezależny od modułów 3 i 4 — te same wielkości istnieją w dwóch miejscach |

Pełna lista ekranów per wielkość: załącznik, sekcja 2.

### 4.2 Wyniki, które nie mają żadnego odbiorcy

Ekran liczy, wyświetla, i żaden inny ekran tej liczby nie widzi:

| Wynik | Ekran źródłowy | Kto powinien go widzieć (wpisuje dziś ręcznie) |
|---|---|---|
| Napięcie systemowe budynku (12/24/48 V) | `napiecie-systemowe` | 9 ekranów modułów 3–5, 8, 11 z polem napięcia bez podpowiedzi (lista w załączniku); podpowiedź napięcia istnieje tylko dla mikroinstalacji i pochodzi z Ustawień, nie z tego ekranu |
| Liczba i moc paneli | `liczba-paneli` | `konfigurator-stringow`, `dopasowanie-tablicy-falownika`, `kat-i-azymut`, `zloty-srodek`, moduł 7, M14 (`mocPvKwp`) |
| Układ stringów (liczba w stringu, Voc/Isc stringu) | `konfigurator-stringow` | `stress-test-mppt`, `ochrona-stringow`, `ochrona-przepieciowa-spd` (vocMaxStringuV), `analiza-zwarciowa`, `straty-okablowanie-dc` |
| Moc falownika | `dobor-mocy-falownika` | `dopasowanie-tablicy-falownika`, `sprawnosc-inwertera-niskie-obciazenie`, `pobor-wlasny-falownika`, `urzadzenia-zabronione-falownik` |
| Przekrój i prąd obwodu | `dobor-przekroju-kabla` | `dobor-bezpiecznika-rozlacznika`, `wylaczniki-nadpradowe-dc`, `selektywnosc-zabezpieczen`, `optymalizacja-trasy-kabla` |
| Temperatura minimalna | `lokalizacja-i-klimat` | patrz 3.4 |
| Dni autonomii | `dni-autonomii` | `dobor-pojemnosci-baterii`, `wspolczynnik-bezpieczenstwa-zimowego` (wymagana autonomia) |
| Moc i zużycie paliwa agregatu | `agregat-pradotworczy` | 6 dalszych ekranów agregatu w modułach 2, 7, 12, 15 |

### 4.3 Ustawienia, które działają tylko częściowo

- **Rodzaj obiektu** (Ustawienia → `profil-obiektu`): wpływa na listy ekranów modułów (kamper: 4 ekrany ukryte), `liczba-paneli`, `ochrona-przepieciowa-spd`, `porownywarka-paneli`, `zuzycie-per-urzadzenie`, `tryb-ograniczonego-zuzycia`, `bilans-ciepla-malego-obiektu` i podpowiedź napięcia na 20 ekranach modułu 12. Pozostałe ekrany go nie znają. Zmiana w Ustawieniach jest widoczna dopiero po ponownym otwarciu ekranu (`lib/obiekt/use-rodzaj-obiektu.ts`, komentarz) — dziś bez znaczenia (osobne trasy), patrz 3.7.
- **Waluta:** dwa modele współistnieją — 24 ekrany przeliczają wpisane kwoty (`konwersjaKwot`), ekrany rynku polskiego (10 plików z `useZl`) trzymają wejście w zł i przeliczają tylko wynik. Oba są spójne wewnętrznie; błąd powstaje na styku (3.2).
- **Język, motyw, wygląd:** globalne, działają na wszystkich ekranach (magazyny z subskrypcją).

### 4.4 Brak miejsca, w którym widać wynik całego projektu

Nie ma ekranu ani sekcji pulpitu, która zbiera kluczowe liczby projektu (zużycie, moc PV, pojemność i napięcie magazynu, falownik, werdykty). Najbliżej jest `raport-kryzysowy` (moduł 7) — obejmuje tylko zimowy stress-test. Pulpit czyta z ekranów wyłącznie terminarz przeglądów (`app/page.tsx`). Asystent AI nie dostaje żadnych danych projektu ani informacji, na którym ekranie jest użytkownik (`components/asystent-ai.tsx:61` wysyła samo pytanie; każda odpowiedź zaczyna rozmowę od zera) — o parametry instalacji musi dopytać za każdym razem.

---

## 5. Czego nie znaleziono (sprawdzone, w porządku)

- Linki: 311 różnych adresów w kodzie, wszystkie prowadzą do istniejących tras; rejestr pulpitu nie wskazuje nieistniejącego ekranu i żaden ekran nie leży poza rejestrem.
- Przyciski: brak pustych handlerów, `href="#"`, trwale wyłączonych przycisków (poza stroną `/wzornik`, która pokazuje stany celowo), znaczników TODO/„wkrótce”.
- Jądro: każdy `calculator.ts` jest użyty przez ekran; 288 narzędzi AI jest zarejestrowanych w `NARZEDZIA`.
- Klucze szkiców: żadnej literówki między zapisującym a czytającym; brak dwóch ekranów zapisujących ten sam klucz przez pomyłkę.
- Istniejące połączenia modułu 7 (`deficyty-miesieczne` → `wspolczynnik…` → `raport-kryzysowy`), modułu 6 (`obciazenie-cieplne` → 6 ekranów), modułu 1 (model działki, horyzont, PVGIS → ekrany PV) i M14 mają wspólne typy lub funkcje przeliczające po obu stronach — pola się zgadzają.
- Pakiet kontroli na 3.53.4: typecheck 0 błędów, lint 0, i18n OK, pomoc 352 pliki, narzędzia AI 284/284, twarde stopy OK, testy 463 pliki / 4302 testy.

**Granice audytu.** Nie uruchamiano aplikacji w przeglądarce (ustalenia ✅ pochodzą z czytania kodu, 🔎 wymagają próby). Nie sprawdzano poprawności wzorów w kalkulatorach (to zakres testów jądra i audytu Część N). Grupowanie pól w załączniku opiera się na nazwach pól, więc liczby ekranów to dolna granica.

---

## 6. Decyzje właściciela potrzebne przed naprawami z sekcji 4

### D-1. Jak ekran ma przyjmować liczbę z innego ekranu

Dotyczy wszystkich brakujących połączeń. Dwa zapisane ustalenia są ze sobą sprzeczne, więc sesja naprawcza nie może wybrać sama.

- **A — podpowiedź z przyciskiem „Użyj”** (decyzja właściciela 11.10.2026 dla napięcia; tak działa też `wspolczynnik-bezpieczenstwa-zimowego`). Pole zostaje puste, obok tekst „Z ekranu X: 48 V [Użyj]”. Plus: użytkownik zawsze widzi, co sam wpisał; nic nie zmienia się po cichu. Minus: przy zmianie na ekranie źródłowym ekrany zależne nie zmieniają się same — trzeba kliknąć na każdym; to nie jest „dynamiczna zmiana danych”.
- **B — wypełnienie domyślne z profilu, z możliwością nadpisania** (§10 źródła UX; zlecenie z 09.11.2026: „dynamicznie zmieniać dane”). Pole pokazuje wartość z projektu z etykietą źródła; ręczna zmiana oznacza pole jako „własna wartość” i od tej chwili projekt go nie rusza, z przyciskiem powrotu do wartości projektu. Plus: zmiana w jednym miejscu przelicza wszystko. Minus: werdykt ekranu może się zmienić bez wizyty na nim — wymaga widocznej etykiety źródła i daty przy każdym takim polu oraz sygnału „dane źródłowe zmieniły się”.
- **Rekomendacja:** B dla wielkości projektu z jednym oczywistym źródłem (napięcie układu, panel podstawowy, pojemność baterii, temperatura minimalna, współrzędne, zapotrzebowanie dobowe), A dla wartości z ekranów scenariuszowych („co by było gdyby”). Zmienić zdanie na „tylko A”, jeśli właściciel uzna, że żadna liczba na ekranie nie może się zmienić bez kliknięcia.
- **Koszt i odwracalność:** obie drogi wymagają tej samej warstwy danych projektu (D-2); różnią się tylko komponentem pola. Zmiana A↔B później jest tania.

### D-2. Zakres „profilu projektu”

- **A — rozbudować `lib/profil-sprzetu/` do pełnego §10** (panel, tablica PV, falownik/MPPT, bateria, generator + lokalizacja, klimat, zapotrzebowanie), jeden projekt. **B — to samo plus wiele wariantów** (budżetowy/premium) od razu. **C — zostawić profil wąski, dokładać pojedyncze połączenia ekran→ekran.**
- **Rekomendacja:** A. Warianty (B) dokładają migrację danych i interfejs przełączania — osobny etap po spięciu ekranów. C utrwala obecny stan (każde połączenie pisane osobno, 8 różnych nośników).

### D-3. Skąd bierze się zapotrzebowanie energii projektu

Dziś istnieją trzy niezależne źródła: moduł 2 (18 ekranów cząstkowych, bez sumy), `zuzycie-miesieczne` z M14 (z rachunku) i lista odbiorników `zuzycie-per-urzadzenie` (mikroinstalacja). Porównywarka wybiera między dwoma ostatnimi według rodzaju obiektu. Decyzja: czy moduł 2 ma dostać ekran bilansu, który sumuje jego wyniki, i które źródło ma pierwszeństwo dla budynku. **Rekomendacja:** jedno wspólne „zapotrzebowanie projektu” z jawnym wyborem źródła (rachunek / lista odbiorników / bilans modułu 2), czytane przez moduły 3, 4, 7, 10.

### D-4. PV i magazyn w M14 a moduły 3 i 4

Czy `mocPvKwp` i pojemność magazynu w „Dom/Firma – sieć” mają pochodzić z profilu projektu (jedno źródło), czy M14 zostaje osobnym, „rachunkowym” scenariuszem. **Rekomendacja:** domyślnie z profilu, z możliwością nadpisania jako scenariusz.

---

## 7. Proponowana kolejność napraw

| Etap | Zakres | Zależy od | Wersja wg `docs/wersjonowanie.md` |
|---|---|---|---|
| N1 | 3.1 (zapis przy wyjściu), 3.7 (magazyn z subskrypcją), 3.8 stała klucza | — | trzecia cyfra |
| N2 | 3.2 (waluta w odczycie cudzych szkiców) | N1 | druga cyfra (zmienia liczby przy walucie ≠ zł) |
| N3 | 3.3, 3.6 (profil baterii) | D-1 | trzecia/druga |
| N4 | Warstwa „profil projektu” (D-2) + komponent pola z wartością projektu (D-1) + strażnik: pole z grupy wielkości projektu musi korzystać z komponentu | D-1, D-2 | druga cyfra |
| N5 | Podpięcie wielkości po kolei: lokalizacja i temperatura minimalna (3.4) → panel podstawowy (3.5) → napięcie układu → pojemność/chemia/DoD → zapotrzebowanie (D-3) → falownik → prąd i kabel → ciepło budynku → agregat | N4 | druga cyfra, partiami per wielkość |
| N6 | Moduły 7, 8, 10, 11 i M14 (D-4) czytają profil projektu | N5 | druga cyfra |
| N7 | Podsumowanie projektu na pulpicie; kontekst projektu i ekranu dla asystenta AI (4.4); 3.8 identyfikator modelu | N5 | druga cyfra |

**Miara postępu:** `node scripts/audyt-powiazan-ekranow.mjs` — dziś 61 z 311 (20%) pozycji czyta dane spoza siebie; liczby ekranów per wielkość w sekcji 2 załącznika mają maleć do zera pól „gołych” (bez komponentu wartości projektu).

**Ryzyka dla sesji naprawczej.** (1) Każda zmiana kształtu szkicu wymaga pól opcjonalnych (stare szkice, standard 5.5). (2) Narzędzia AI liczą z danych podanych w pytaniu — po N7 muszą dostawać te same wartości projektu co ekran, inaczej asystent i ekran dadzą różne wyniki. (3) Ekrany pokazujące wartość projektu potrzebują tłumaczeń PL/EN/RU i pomocy „?” (D51). (4) Duży rollout mechaniczny: 2–4 równoległe wątki, nie więcej (`docs/memory.md`, Skrót aktywny 1).
