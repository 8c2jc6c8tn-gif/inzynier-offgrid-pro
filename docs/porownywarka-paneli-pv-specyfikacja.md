# Porównywarka paneli PV — specyfikacja i plan dla następnej sesji

> **Status: SPECYFIKACJA ZATWIERDZONA PRZEZ WŁAŚCICIELA (08.10.2026), KOD NIE ISTNIEJE; ETAP A0 (audyt) WYKONANY 08.10.2026 — wyniki w sekcji 20.** Ten dokument jest jedynym
> kompletnym zapisem ustaleń z rozmowy właściciela z asystentem (sesja 08.10.2026). Inna sesja ma z niego zbudować moduł.
> Decyzja strategiczna: `rejestr-decyzji.md` D81. Wpis na liście: `docs/lista-do-zrobienia.md` („Porównywarka paneli PV”).
> Zasada nadrzędna tego dokumentu: **nigdy nie zgaduj danych katalogowych, norm ani współczynników** (Dyrektywa #1,
> `docs/standards/00-filozofia.md`). Gdzie brak liczby — pole `null` i jawny komunikat „brak danych”, nie wartość domyślna.

## 0. Jak zacząć (kolejność pracy dla wykonującej sesji)

1. Przeczytaj `CLAUDE.md` → `docs/lista-do-zrobienia.md` (wpis o porównywarce) → ten dokument w całości.
2. Wykonaj **Etap A0** (sekcja 14) — audyt istniejącego stanu (dziś wiemy tylko to, co w sekcji 3) i projekt wspólnego
   modelu danych. Dopiero potem silnik.
3. Katalog paneli: właściciel dostarcza **PDF-y kart katalogowych** (10–15 szt.). Umieść je w
   `docs/zrodla/karty-katalogowe-paneli-pv/` + `INDEKS.md` (konwencja katalogów `docs/zrodla/*`, memory.md §1).
   Dane do katalogu **wyłącznie z tych PDF-ów**; każdy parametr ze stroną źródła. Brak PDF-a = brak panelu w katalogu.
4. Jeden etap = jedna partia + commit (Dyrektywa #14). Po każdym etapie: pakiet kontroli z CLAUDE.md (typecheck, lint,
   i18n-guard, pomoc-guard, ai-tools-guard, stopy-guard, test, build) i wpis w `docs/memory.md`.

## 1. Cel produktu (słowami właściciela)

Użytkownik „zielony” nie umie porównać paneli PV, a „tańsze i więcej watów” w katalogu bywa w rzeczywistości gorsze.
Moduł ma rzetelnie pokazać, **który panel lepiej się opłaca — szczególnie zimą**, bo różnica zimą jest najważniejsza dla
off-gridu. Aplikacja **rekomenduje**, użytkownik **sam decyduje**.

## 2. Ustalenia właściciela (numerowane — nie zmieniać bez pytania)

| # | Ustalenie |
|---|---|
| U1 | Porównanie miesiąc po miesiącu (12 miesięcy), zima (XI–II) wyróżniona i podana osobno, średnia zimowa. |
| U2 | Wartość kWh do wyceny wybiera użytkownik z listy: **sieć (taryfa całodobowa), sieć dzienna i nocna, generator (agregat), stawka wpisana ręcznie**. |
| U3 | Ocena w skali **10 gwiazdek**; kryteria jako **oddzielne pola z zaznaczeniem**: zaznaczone = liczone, odznaczone = pomijane. **Wagi zawsze widoczne dla użytkownika**, przeliczane do 100% z zaznaczonych kryteriów. |
| U4 | Każda technologia ma **dokładny opis: jakie daje plusy i jaki ma wpływ na produkcję prądu**. |
| U5 | Wejście: **liczba paneli, jeśli znana**; albo **maksymalny wymiar panelu**, albo **wymiary miejsca** — system sam liczy, ile paneli się zmieści. |
| U6 | **Pole wymagane: cena panelu**, którą znalazł użytkownik (brutto za sztukę). Bez niej brak części „zł”. |
| U7 | **Koszty dodatkowe (stelaż, kable, złączki, zabezpieczenia, montaż) liczymy MY, szacunkowo** — użytkownik „zielony” nie poda ich poprawnie. Szczegóły i ograniczenie (cennik) w sekcji 9. |
| U8 | **Opisy producentów tworzy asystent** (z wyszukiwania w sieci, źródło + data przy każdym fakcie, do akceptacji właściciela). Zakres: czy firma znana, kraj, dystrybutor/serwis w Polsce, certyfikaty, czy panele są dobre. |
| U9 | **Informacja o wadze panelu** i na co zwrócić uwagę przy montażu/obciążeniu (jasne ostrzeżenia). |
| U10 | **Scenariusz „tańszy panel = oszczędność = dokupisz X paneli = Y kWh więcej rocznie, co wartościowo przewyższa różnicę”** — zawsze pokazywany, żeby użytkownik zrozumiał, że za te same pieniądze może mieć więcej paneli. To **sugestia** (nie każdy ma miejsce). |
| U11 | Brak miejsca → **sugestia dodatkowych paneli na ogrodzeniu / ścianie budynku skierowanej na południe** z policzonym uzyskiem kWh/rok (w tym zimą). Panele pionowe są propozycją dla **paneli dodatkowych (nadwyżka)**, nie dla bazowych. |
| U12 | Oprócz kWh/dzień: **sumy napięć i prądów** i inne parametry decydujące o doborze falownika/regulatora. System **rekomenduje połączenie**: 1/2/3 stringi, szeregowo/równolegle, zalecane V i A. |
| U13 | Później: wpisanie parametrów falownika/regulatora → system pokazuje, ile paneli i jak można podłączyć; następnie powiązanie z **ładowaniem akumulatora** (zależnie od typu). Moduł ma być **spięty z resztą aplikacji**. |
| U14 | Po wyborze: **zapytać użytkownika, czy zapisać wybrany panel w systemie jako podstawowy** (nigdy automatycznie). |
| U15 | **Energia użyteczna**: liczona tylko gdy zaznaczone „użyj danych zużycia z systemu” i dane istnieją; gdy ich brak — **zaproponować wprowadzenie** (dokładniejsza analiza), ale **liczyć także bez nich** („suchy” tryb produkcja vs cena, bez wyceny energii użytecznej). |
| U16 | **Nadwyżka energii, której nie da się wykorzystać, nie jest „straconą oszczędnością”** — pokazujemy jej ilość i **proponujemy zagospodarowanie**: ogrzewanie basenu, grządki w szklarni, inne odbiorniki nadwyżkowe. |
| U17 | Rekomendacja **systemu pomocniczego 24 V** (tani falownik + tani zestaw akumulatorów) do kamer, alarmu, oświetlenia terenu — jako propozycja, użytkownik decyduje. |
| U18 | Panele bazowe liczone z **danych już wprowadzonych w aplikacji** (miejscowość, kierunek/nachylenie). W module można wpisać **inne dane niż w systemie** i **porównać kilka kierunków i umiejscowień** paneli. |
| U19 | **Miejsca instalacji** (garaż, ogrodzenie, dom…): możliwość przełączania; użytkownik nadaje własną nazwę, z podpowiedziami typu „ściana północna garażu”. |
| U20 | Porównanie **maksymalnie 4 paneli naraz**; **wiele zapisanych zestawów porównań**, do których można wracać (sposób obsługi 12 paneli — sekcja 12). |
| U21 | UX: dużo informacji, ale **przejrzyście, nie „nawalone”**, a z „game changerami” (sekcja 11). |
| U22 | Funkcja **OCR/AI**: zdjęcie naklejki lub karty katalogowej → AI rozpoznaje dane i wypełnia pola; użytkownik na początku mówi, o jaki panel chodzi. Właściciel: „nie wiem czy to dobry pomysł, ale zróbmy” → Etap B, z zabezpieczeniami (sekcja 13). |
| U23 | **Pogoda**: wkrótce podłączona baza danych pogodowych — silnik ma pobierać dane przez interfejs wymienny (sekcja 6.1), nie na sztywno z PVGIS. |
| U24 | Rekomendujemy; **użytkownik sam decyduje** (brak twardych blokad poza bezpieczeństwem elektrycznym). |

## 3. Co już jest w repo (stan na 08.10.2026, `origin/main`)

Nie budować od zera — **echo (Dyrektywa #8)**: najpierw sprawdź i wywołaj istniejące silniki. Ścieżki zweryfikowane 08.10.2026.

| Potrzeba | Istniejący element |
|---|---|
| Ogólne technologie (PERC/Half-Cut/TOPCon/HJT), powierzchnia na kWp | `lib/core/modules/pv/technologie-paneli/` (dane 1:1 ze źródła; „+5–8% uzysku” **nie jest mnożnikiem** — memory.md 25.09.2026) |
| Nasłonecznienie na powierzchni (nachylenie, azymut, horyzont, albedo; model Muneera jak PVGIS) | `lib/core/modules/lokalizacja/orientacja-powierzchni/` (wejście godzinowe TMY `RekordGodzinowy`), `lib/lokalizacja/dane-tmy.ts`, `use-dane-tmy.ts`, proxy `app/api/pvgis/tmy/route.ts` |
| Lokalizacja projektu | `lib/lokalizacja/use-lokalizacja-projektu.ts` (model działki ma pierwszeństwo przed M1/E1) |
| Powierzchnie o nazwach (dach wg obrysu, Elewacja N…NW, nazwy użytkownika) | `lib/lokalizacja/model-dzialki.ts`, `nazwa-powierzchni.ts` |
| Optymalny kąt/azymut | `pv/kat-i-azymut`, `pv/zloty-srodek`, `pv/wschod-zachod`, `pv/typ-montazu` (tryb pionowy: bilans lato/zima), `pv/tracker-vs-staly` |
| Temperatura (γ) | `pv/wplyw-temperatury` (γ i przyrost podawane jako zakres — pola wpisywane, bez cichych domyślnych) |
| Bifacjalność, AR, PID, mikropęknięcia, zacienienie/diody, niedopasowanie | `pv/panele-bifacjalne`, `pv/powloki-antyrefleksyjne`, `pv/ryzyko-pid`, `pv/mikropekniecia-termiczne`, `pv/zacienienie-diody-bocznikujace`, `pv/niedopasowanie-paneli` |
| Stringi, napięcia, falownik | `pv/konfigurator-stringow`, `pv/dopasowanie-tablicy-falownika`, `pv/ochrona-stringow` (margines Isc 1,25 — D20 uzasadnienie normatywne), `pv/stress-test-mppt`, `pv/straty-okablowanie-dc` |
| Liczba paneli / bilans | `pv/liczba-paneli`, `bilans-miesieczny` (narzędzie AI), `stress-test/deficyty-miesieczne`, `zapotrzebowanie/*` (`zuzycie-miesieczne`) |
| Wycena kWh | `siec/porownanie-taryf`, `taryfa-g`, `taryfa-nocna-pompy-ciepla`, `lib/core/dane/rozliczenia-pl-2026`, `app/kalkulatory/agregat-paliwo` (koszt kWh z agregatu) |
| Odbiorniki nadwyżek | `app/kalkulatory/basen`, `grzalki-dachowe`, `grzalka-cwu`, `bojler-cwu` (szklarnia/grządki — **brak**, patrz sekcja 8.3) |
| Regulator/napięcie systemu/bateria | `dobor-regulatora-pwm-mppt`, `napiecie-systemowe`, `hierarchia-ladowania`, `dobor-pojemnosci-baterii`, `dobor-zrodel-zasilania` |
| Wspólny profil danych | **Tylko** `lib/profil-sprzetu/` — dziś wyłącznie sekcja `bateria` (decyzja memory.md 19.09.2026: pełna wizja świadomie niezbudowana). **Nie ma profilu panelu ani „miejsc instalacji”.** |
| AI | `lib/adapters/ai/{client,config}.ts`, `lib/ai/*` (narzędzia, `pytaj-asystenta.ts`, `is-ai-available.ts`) |
| Telemetria / pogoda | `docs/wklad-do-standardu.md` (kontrakt wspólnych danych pogodowych rodziny, commit 5363500f), `docs/telemetria-kontrakt-esp32.md` |

**Odpowiedź na pytanie właściciela „gdzie jest wspólny profil paneli i dane o budynku?”:** takiego ekranu/profilu dziś **nie ma**.
Są: (a) lokalizacja i model działki z nazwanymi powierzchniami (M1), (b) minimalny `profil-sprzetu` tylko dla baterii.
Dlatego Etap A0 projektuje **profil panelu** i **miejsca instalacji** (sekcja 5) jako rozszerzenie `profil-sprzetu`
i modelu działki — z `schema_version` (standard 02).

## 4. Zasady twarde dla tego modułu

1. **Dane panelu tylko z karty katalogowej/naklejki.** Brak parametru → `null`, kryterium „nie do porównania” (reguła
   porównywalności, 6.4). Zakaz uzupełniania „typowymi” wartościami technologii.
2. **Żadnych mnożników z reklam** („+X% uzysku TOPCon”). Uzysk z fizyki i parametrów (sekcja 6).
3. **Reguła porównywalności:** kryterium wchodzi do porównania i gwiazdek tylko, gdy **wszystkie** porównywane panele
   mają dane do jego policzenia. Inaczej: wiersz „nie da się porównać — brakuje: [panel X: γ]”, waga ignorowana.
4. **Żadnych „bezpiecznych” zgadywanek** dla luk — `OUT_OF_SCOPE`/INCOMPLETE z jawnym komunikatem (memory.md §3).
5. **AI/OCR nigdy nie wpisuje po cichu** i nigdy nie deklaruje zgodności/bezpieczeństwa (standard 9.4, 9.5).
6. **Język:** kod po angielsku (polska nazwa domenowa dopuszczalna konsekwentnie w module), UI i dokumenty po polsku,
   tłumaczenia PL/EN/RU (`lib/i18n/*`), „?” przy każdym polu, „i” przy tytule, narzędzie AI z „Użyj, gdy…”, autosave.
7. `lib/core` nie importuje z `app/`/`components/`. Silnik w `lib/core/modules/pv/porownywarka-paneli/` (nazwa robocza).

## 5. Model danych (projekt do doprecyzowania w A0)

```ts
// lib/core/modules/pv/porownywarka-paneli/ — typy domenowe (czyste, bez UI)
type DanePanelu = {
  id: string; producent: string; model: string
  zrodlo: { rodzaj: "karta-katalogowa" | "naklejka" | "ogloszenie"; plik?: string; strona?: number; dataKarty?: string }
  technologia?: "perc" | "half-cut" | "topcon" | "hjt" | "inna"   // etykieta opisowa; NIGDY nie jest mnożnikiem
  // STC (naklejka ma tylko to + max napięcie systemowe + bezpiecznik):
  pmaxW: number; vocV: number; iscA: number; vmpV: number; impA: number
  maxNapiecieSystemoweV?: number; maxBezpiecznikSzeregowyA?: number
  dlugoscMm: number; szerokoscMm: number; grubosc?: number; masaKg: number
  // Zależne od temperatury/światła (opcjonalne — brak = null, kryterium wyłączone):
  gammaPmaxPctNaC?: number; betaVocPctNaC?: number; alfaIscPctNaC?: number; noctC?: number
  sprawnoscPrzy200WPct?: number      // low-light, jeśli karta podaje
  bifacjalnosc?: { wspolczynnikPct: number }   // φ z karty; model zysku — istniejący pv/panele-bifacjalne
  liczbaDiodBocznikujacych?: number; liczbaOgniw?: number; polowkiOgniw?: boolean
  szklo?: "pojedyncze" | "podwojne"; rama?: boolean
  obciazenieSniegPa?: number; obciazenieWiatrPa?: number
  tolerancjaMocy?: string            // np. "0/+5 W" albo "±3%" — jako tekst z karty + sparsowane granice
  degradacjaPierwszyRokPct?: number; degradacjaLiniowaPctNaRok?: number   // z gwarancji — GÓRNA granica, nie oczekiwanie
  gwarancjaProduktuLat?: number; gwarancjaMocyLat?: number; gwarancjaMocyKoniecPct?: number
  certyfikaty?: string[]; lidOpis?: string; letidOpis?: string; pidOpis?: string
  cenaBruttoZl: number | null        // WYMAGANE przy porównaniu (U6) — wpisuje użytkownik albo katalog z datą
  cenaData?: string
}
type MiejsceInstalacji = {              // U19, U18
  id: string; nazwa: string; podpowiedzNazwy?: string       // własna nazwa + podpowiedź, np. „ściana północna garażu”
  zrodlo: "z-projektu" | "wlasne"                           // z-projektu = z M1/M3, wlasne = nadpisane w module
  nachylenieDeg: number; azymutDeg: number; horyzontDeg?: number[]; albedo?: number
  rola: "bazowe" | "dodatkowe-nadwyzka"                    // U11: pionowe tylko jako dodatkowe
  liczbaPaneli?: number                                     // jeśli znana
  miejsce?: { dlugoscMm: number; szerokoscMm: number }       // albo wymiary miejsca → system liczy ile się zmieści
  maxWymiarPaneluMm?: { dlugosc?: number; szerokosc?: number }
}
type ZestawPorownania = {               // U20 — zapisywany, nazwany, wersjonowany
  id: string; nazwa: string; schemaVersion: number
  panele: string[]                      // 1–4 id (max 4)
  miejsceId: string[]                   // jedno lub kilka miejsc do porównania
  wycenaKwh: WycenaKwh                  // sekcja 7.1
  kryteria: Record<KryteriumId, { wlaczone: boolean; waga: number }>
  uzywajDanychZuzycia: boolean          // U15
}
```

Rozszerzenie `lib/profil-sprzetu/types.ts`: sekcja `panel?: { daneId: string; ... }` — **zapis tylko po jawnym potwierdzeniu
użytkownika** („Zapisać wybrany panel jako podstawowy w systemie?”, U14). Sekcja `miejscaInstalacji` — patrz A0.

## 6. Silnik obliczeń

### 6.1 Dane wejściowe pogodowe — interfejs wymienny (U23)
Silnik przyjmuje **godzinowy rok TMY** (`RekordGodzinowy`: GHI, DNI, DHI + temperatura otoczenia, wiatr jeśli dostępny)
przez interfejs `ZrodloDanychPogodowych` (adapter). Dziś: PVGIS TMY (`lib/lokalizacja/dane-tmy.ts`). Później: baza pogodowa
(kontrakt rodziny — `docs/wklad-do-standardu.md`). **Sprawdź w A0, czy TMY niesie temperaturę otoczenia** (PVGIS TMY ma T2m;
zweryfikować kształt na żywo — wzorzec wkładu z 02.10.2026, nie z pamięci). Silnik nie zna źródła; zmiana źródła nie zmienia silnika.

### 6.2 Łańcuch obliczeń (godzinowo → miesiąc)
Dla każdej godziny i miejsca: nasłonecznienie w płaszczyźnie panelu `G_poa` (istniejący silnik `orientacja-powierzchni`:
Muneer + horyzont + albedo, **bez zmian modelu**) →

- temperatura ogniwa: `T_c = T_otocz + (NOCT − 20)/800 · G_poa` (standardowa definicja NOCT: 800 W/m², 20 °C; fizyka bez
  wolnego parametru); gdy karta nie podaje NOCT → kryterium temperaturowe „nie do porównania” (nie zgadujemy NOCT);
- moc: `P = P_stc · (G_poa/1000) · [1 + γ·(T_c − 25)] · η_rel(G_poa)`; `η_rel` wyłącznie z danych karty (sprawność przy
  200 W/m²) — **brak danych → η_rel = 1 i kryterium low-light wyłączone**, bez interpolacji z technologii;
- bifacjalność (tylko gdy `bifacjalnosc` podane): zysk tylna strona z istniejącego `pv/panele-bifacjalne`
  (albedo śniegu zimą z `orientacja-powierzchni`/`czystosc-i-snieg` — sprawdzić, nie wymyślać);
- degradacja: rok 1 + liniowa z karty/gwarancji; **etykieta „wartość gwarancyjna = górna granica degradacji”** (nie
  prognoza rzeczywista) — uwaga audytora: producenci gwarantują więcej niż zwykle zachodzi, ale tego nie liczymy z pamięci;
- straty systemowe (kable, MPPT, zabrudzenie): **te same dla wszystkich porównywanych paneli** — wpływają na bezwzględne
  kWh, nie na ranking; wartości z istniejących modułów (`straty-okablowanie-dc`, `czystosc-i-snieg`), nie nowe stałe;
- suma miesięczna kWh (12 wartości) dla każdego panelu × miejsca; zima = XI, XII, I, II (oraz wyświetl wariant „XII–II”,
  jeśli moduły sezonowe projektu używają innej definicji — **sprawdzić `zapotrzebowanie/sezonowosc`**, trzymać jedną).

**Testy:** każdy wzór niezależnie w Pythonie/Node przed kodem (Dyrektywa #3); referencje ręczne; przypadki graniczne
(γ=0, brak NOCT, panel bifacjalny bez albedo, noc, śnieg).

### 6.3 Ilość paneli z miejsca (U5)
Wejście: `liczbaPaneli` (jeśli znana) **albo** wymiary miejsca **albo** maks. wymiar panelu. Silnik pakowania: sprawdź
w A0, czy istnieje ekran/silnik „pakowania paneli” (rejestr M3/E2, `typ-montazu/powierzchnie.ts`, `dach-plaski.ts`,
`wiata.ts`; rejestr-pokrycia wspomina M12/E19 „pakowanie paneli”) — **użyj, nie dubluj**. Parametry: orientacja panelu
(pion/poziom), odstępy, marginesy brzegowe, cień międzyrzędowy przy nachyleniu (reguły w istniejącym kodzie). Wynik:
liczba paneli dla **każdego** z porównywanych modeli (różne wymiary → różna liczba mieści się w tym samym miejscu —
to jest sedno uczciwego porównania „na tę samą powierzchnię”).

### 6.4 Reguła porównywalności i kryteria (U3)
Kryteria (id → źródło danych → warunek wejścia). Wszystkie z checkboxem; domyślnie zaznaczone te, do których wszystkie
panele mają dane:

| Kryterium | Dane | Typ |
|---|---|---|
| Uzysk zimowy (kWh XI–II) | silnik 6.2 | liczba |
| Uzysk roczny (kWh) | silnik 6.2 | liczba |
| Koszt zimowej kWh (zł/kWh zimowej w 25 latach) | cena + BOS + uzysk zimowy | liczba |
| Cena za Wp / za zainstalowany Wp | cena, BOS | liczba |
| Degradacja i gwarancja mocy | karta | liczba |
| Słabe światło | sprawność 200 W/m² | liczba |
| Temperatura (γ, NOCT) | karta | liczba |
| Zacienienie i śnieg (diody, half-cut, Pa) | karta | opis + liczba |
| Odporność (PID/LID/LeTID, szkło-szkło) | karta | opis |
| Tolerancja mocy | karta | opis |
| Wiarygodność danych i producenta | źródło danych, opis producenta | opis |

**Wagi startowe (propozycja z 08.10.2026, „wstępne, do dopracowania” — jak M7/E12, D71/D72):**
uzysk zimowy 30%, koszt zimowej kWh 20%, degradacja i gwarancja 15%, słabe światło + temperatura 10%, zacienienie i
śnieg 10%, odporność 10%, tolerancja mocy i wiarygodność 5%. Po odznaczeniu kryterium wagi **przeliczają się**
(suma 100%) i ekran pokazuje, **które kryteria policzono, a które pominięto i dlaczego**.

**Otwarte (D81 pkt A):** odwzorowanie wartości → punkty 0–10. Źródło go nie podaje. Propozycja: skala **względna w
obrębie porównywanego zestawu** (najlepszy w zestawie = 10 na danym kryterium, reszta proporcjonalnie), z jawną notą na
ekranie „gwiazdki są względne do wybranych paneli”. Alternatywa (absolutne progi) wymaga liczb od właściciela. **Do
potwierdzenia przez właściciela (✅🤖)** — do czasu decyzji przyjąć względną i oznaczyć wpis na liście ⚠️.

## 7. Wycena i ekonomia

### 7.1 Wartość kWh (U2) — `WycenaKwh`
Źródła do wyboru: (a) sieć — taryfa całodobowa (np. G11), (b) sieć — dzienna/nocna (G12; użyć istniejących
`porownanie-taryf`/`taryfa-nocna-pompy-ciepla`/`rozliczenia-pl-2026`), (c) agregat — koszt kWh z `agregat-paliwo`
(spalanie, cena paliwa; wpisywane przez użytkownika, bez domyślnych), (d) stawka ręczna zł/kWh (tryb ostatecznej
pewności, jedyne pole wpisywane przez użytkownika bez źródła). **Otwarte (D81 pkt B):** dla taryfy dziennej/nocnej wartość
zależy od pory dobowej braku produkcji — sprawdzić w A0, jak `porownanie-taryf` wystawia cenę kWh per godzina/miesiąc;
jeśli nie wystawia, uprościć do „średnia ważona zgodnie z godzinami strefy” **po akceptacji właściciela**, nie ukrytą stałą.
Jeśli użytkownik wybierze agregat jako zapas na zimę, zimowa kWh = koszt kWh z agregatu (U2) — to wartość „kWh brakującej”.

### 7.2 Energia użyteczna vs nadwyżka (U15, U16)
- Przełącznik „Użyj danych zużycia z systemu” (domyślnie włączony, gdy `zuzycie-miesieczne` ma dane; **jeśli brak —
  baner z propozycją uzupełnienia danych i przyciskiem do ekranu zużycia**; moduł liczy też bez tego).
- Z danymi: `E_uzyteczna,m = min(produkcja_m, zapotrzebowanie_m)`; tylko ona wchodzi do wyceny w złotówkach.
  `Nadwyżka_m = max(0, produkcja_m − zapotrzebowanie_m)` — **pokazana jako ilość kWh/rok i ułamek**, nie jako strata.
  Uwaga: dokładniejszy bilans (godzinowy, ograniczenia baterii/falownika) to Etap A5 — w A1/A2 bilans miesięczny z jawnym
  założeniem „bez ograniczeń baterii” (`assumptions`).
- Bez danych: tryb „suchy” — sama produkcja miesięczna i koszt zł/kWh; ekran mówi wprost, że nie ocenia użyteczności.

### 7.3 Zagospodarowanie nadwyżki (U16)
Karta „Co zrobić z nadwyżką”: ilość kWh/rok → propozycje (z odnośnikami do istniejących ekranów): podgrzew wody
(`grzalka-cwu`, `bojler-cwu`, `grzalki-dachowe`), **ogrzewanie basenu** (`basen`), **grządki/szklarnia** (ekran
nie istnieje — wpisać do `backlog-poza-v1.md`/listy jako propozycja nowego ekranu; do czasu budowy tylko tekst bez
liczb), ładowanie dodatkowego systemu 24 V (U17). Zasady: sugestia, nie zalecenie; **żadnych liczb efektu bez silnika**.

### 7.4 Scenariusz „tańszy panel = więcej paneli” (U10) — game changer #1
Dla pary (droższy A, tańszy B): `oszczędność = N·(cenaA − cenaB)` (+ różnica BOS, sekcja 9) → `X = floor(oszczędność /
koszt jednego dodatkowego panelu B z BOS)` → dodatkowe `X` paneli B daje **ΔE rok i ΔE zima** (z silnika, w tym samym
miejscu **albo** w miejscu „dodatkowym”) → porównanie wartości w zł z tym, co daje A ponad B. Tekst gotowy do czytania
przez „zielonego”: „Wybierając B zamiast A, zostaje Ci X zł — to X dodatkowych paneli, +Y kWh rocznie (w tym Z kWh zimą),
czyli o W zł więcej/mniej niż daje droższy A.” **Warunki ograniczające sprawdzane od razu** (sekcje 6.3 i 10): brak miejsca,
limit wejść MPPT/falownika/regulatora (A4), pojemność baterii (A5). Przy braku miejsca → U11: panele na ogrodzeniu /
ścianie południowej (rola `dodatkowe-nadwyzka`) z uzyskiem kWh/rok z silnika pionowego (`typ-montazu/pionowy.ts`).
Zawsze **rekomendacja + zastrzeżenia**; decyzja użytkownika (U24).

## 8. Elektryka: napięcia, prądy, stringi, falownik, bateria (U12, U13)

### 8.1 Parametry panelu → system (A3)
Dla każdego panelu: `Voc(T_min)` ze wzoru z `β_Voc` i **najniższej temperatury lokalizacji (M1)**, `Vmp(T_max)`, `Isc`, `Imp`,
margines Isc (istniejąca stała M3/E22 — **użyć, nie redefiniować**), limit napięcia systemowego, limit bezpiecznika
szeregowego. Suma dla N paneli: moc, napięcia szeregowo, prądy równolegle. **Rekomendacja podłączenia** (1/2/3 stringi,
szereg/równoległe) z uzasadnieniem — **silnik `pv/konfigurator-stringow` + `ochrona-stringow` + `niedopasowanie-paneli`**;
reguły normatywne (np. zabezpieczenia stringów od określonej liczby gałęzi równoległych) brać z tych modułów i
`docs/zrodla/norma-HD-60364-7-712`, **nie z pamięci**. Zakaz mieszania różnych paneli w jednym stringu (ostrzeżenie).

### 8.2 Falownik / regulator (A4)
Wejście: parametry falownika/regulatora (okno MPPT, max Voc, max Isc na wejście, liczba wejść, moc DC) — wpisywane albo z
istniejących ekranów (`dopasowanie-tablicy-falownika`, `dobor-regulatora-pwm-mppt`). Wynik: ile paneli i w jakiej
konfiguracji można podłączyć; co z nadmiarem (clipping — tylko informacja z istniejących wzorów).

### 8.3 Bateria i ładowanie (A5)
Prąd ładowania przy napięciu systemu, współpraca z `hierarchia-ladowania`, `dobor-pojemnosci-baterii`,
`napiecie-systemowe`; bilans godzinowy → dokładniejsza energia użyteczna (podmienia założenie z 7.2).

### 8.4 System pomocniczy 24 V (U17)
Karta rekomendacji: mały niezależny system (tani falownik 24 V + tani zestaw akumulatorów) do kamer, alarmu,
oświetlenia terenu — zasilany nadwyżką lub dodatkowymi panelami. Powiązanie: `dobor-zrodel-zasilania`,
`napiecie-systemowe`, `panel-dla-urzadzenia`, `blackout-minimum`. Bez cen i mocy „z głowy” — wartości z odpowiednich
ekranów lub wpisywane.

## 9. Koszty dodatkowe BOS szacowane przez aplikację (U7)

Konflikt z zasadą „nie zgaduj” rozstrzygnięty tak: **ILOŚCI liczy silnik** (długość stelaża w m z geometrii/miejsca,
długość kabla DC z `optymalizacja-trasy-kabla`/`dobor-przekroju-kabla`, liczba złączek MC4, liczba zabezpieczeń z
`ochrona-stringow`, ewentualnie większy falownik/MPPT z A4), a **CENY JEDNOSTKOWE pochodzą z edytowalnego „cennika
orientacyjnego”**: wartości z datą, źródłem i flagą „orientacyjny — zweryfikuj w ofercie”, pokazywane jako **zakres**
min–max, zawsze nadpisywalne. **Skąd cennik (D81 pkt C — do ustalenia z właścicielem):** (1) właściciel dostarcza,
(2) asystent zbiera z wyszukiwania w sieci ze źródłami i datami do akceptacji właściciela. **Nie wolno** wpisać cen z
pamięci. Robocizna: pole opcjonalne („montuję sam” = 0). Do czasu cennika: moduł działa na samej cenie panelu (U6) i
pokazuje baner „koszty dodatkowe nieuwzględnione — wynik uproszczony”.

## 10. Uwagi montażowe: waga (U9)

Przy każdym panelu: masa (kg) z karty, masa na m² dachu/konstrukcji, liczba osób do montażu (**tylko jako ostrzeżenie
ogólne bez liczby, jeśli brak źródła**), obciążenie Pa śniegiem/wiatrem z karty vs wymagania z `eurokod-1/snieg.ts`,
`wiatr.ts`, `napor-wiatru`, `zloty-srodek` (balast, D29). Ostrzeżenie 🟡/🔴 według istniejących poziomów — **nie wymyślać
nowych 🔴**; każdy nowy kod ostrzeżenia dopisać do `docs/rejestr-twardych-stopow.md` (strażnik stopów).

## 11. UX: jak ująć dużo informacji przejrzyście (U21)

**Zasada:** warstwy (progressive disclosure), nie jedna ściana liczb. Propozycja do zatwierdzenia w A0 (prototyp
w przeglądarce, wzorce `components/wzorce/*`, `KartaPorownawcza`, `WerdyktPanel`, `WynikSzczegoly`):

1. **Krok 1 – Gdzie i ile:** wybór miejsca instalacji (z projektu / własne; przełącznik garaż·ogrodzenie·dom z nazwami
   i podpowiedziami), liczba paneli albo wymiary miejsca. Komplet wymaganych pól: cena panelu (U6).
2. **Krok 2 – Wybór paneli:** katalog (filtr) lub ręcznie/OCR; max 4 (zestaw).
3. **Krok 3 – Wynik:** na górze **karta werdyktu** (3 „game changery” w zwykłym języku), niżej zakładki:
   **Miesiące** (wykres 12 miesięcy × panele, zima wyróżniona; `dataviz` skill) · **Opłacalność** (zł, zwrot dopłaty,
   25 lat) · **Więcej paneli?** (7.4 + U11) · **Gwiazdki** (10★, wagi z checkboxami, opisy technologii z plusami i
   wpływem na produkcję) · **Elektryka** (stringi, V/A) · **Producent i waga** · **Założenia** (lista pod wynikiem,
   standard UI).
4. **Game changery (karta werdyktu):** (1) „W zimie ten panel da X kWh więcej niż tamten — warte Y zł rocznie”; (2) „Za
   oszczędność z tańszego panelu dokupisz N paneli = +Z kWh, w tym W zimą”; (3) „Nadwyżka latem U kWh — oto co z nią
   zrobić (basen/szklarnia/system 24 V)”. Reszta za rozwinięciem.
5. Mobile: zakładki jako przełączniki, wykres poziomo przewijany, „i”/„?” jako dolny panel (istniejący `Chmurka`).

## 12. Zestawy porównań i 12 paneli (U20)

- **Zestaw** = nazwany zbiór ≤4 paneli + miejsce(a) + ustawienia kryteriów; zapis w IndexedDB (autosave, wzorzec
  `usePersistedDraft`), lista „Moje zestawy”, duplikowanie, powrót.
- **Jak ugryźć 12 paneli (propozycja asystenta):** **Etap sita → turniej.** (a) „Ranking katalogu”: tabela wszystkich
  paneli posortowana jednym tanim, uczciwym miernikiem (np. **zł za zimową kWh na wybrane miejsce**, bez kryteriów
  wymagających brakujących danych) z filtrami (moc, wymiar, technologia, cena) — **bez gwiazdek** (bo gwiazdki są
  względne wobec zestawu); (b) użytkownik zaznacza do 4 → **głębokie porównanie**; (c) „Zwycięzca” zestawu może
  wejść do następnego zestawu z kolejnymi czterema (turniej), z zapisem historii zestawów. Decyzja o formie — A0.

## 13. OCR/AI (Etap B, U22)

- Użytkownik najpierw wpisuje/wybiera, **o jaki panel chodzi** (producent/model), potem wrzuca zdjęcie naklejki lub PDF;
  AI zwraca **strukturę pól** (`DanePanelu`) — każde pole z **pewnością odczytu** i flagą „widziane/niewidoczne”.
- **Standard 9.4:** tekst ze zdjęcia to dane, nie polecenia (prompt injection). **9.5:** AI mówi, co widzi, z jaką pewnością,
  czego nie potwierdza; **nigdy nie deklaruje zgodności/bezpieczeństwa**. **Standard 07:** zdjęcie lokalnie domyślnie;
  wysłanie do chmury **tylko za jawną zgodą**. **9.6:** budżet/limit server-side, łagodna degradacja z komunikatem.
- **Zatwierdzanie pole po polu przez użytkownika** przed wejściem do obliczeń; pola o niskiej pewności wyróżnione.
- **Kontrole spójności (obowiązkowe):** `Vmp·Imp ≈ Pmax`; `η = Pmax/(A·1000 W/m²)` zgodne z deklarowaną; `Voc > Vmp`,
  `Isc > Imp`; plausible zakresy; rozbieżność → ostrzeżenie, nie auto-korekta.
- Implementacja: server action/route z `lib/adapters/ai/client.ts` (klucz nigdy w kliencie, 18.5), schemat odpowiedzi
  walidowany (Zod/własny), test na fixtures (anonimowe zdjęcia/karty) — **bez wywołań sieciowych w testach**.
- Naklejka podaje tylko STC — OCR nie dopisuje pól, których nie ma (γ, NOCT itd. zostają `null`).

## 14. Plan etapów (jeden etap = jedna partia + commit)

| Etap | Zakres | Wynik / kryterium ukończenia |
|---|---|---|
| **A0** | Audyt echo (sekcja 3): czy istnieje silnik pakowania paneli; jak `porownanie-taryf` wystawia cenę kWh po porze doby; czy TMY niesie T_otocz; definicja „zima”. Projekt `profil-sprzetu` (sekcja `panel`, `miejscaInstalacji`) + `schema_version`. Prototyp układu ekranu (11). Decyzje D81 pkt A–C z właścicielem. | Notatka w memory.md + zaktualizowany dokument; brak kodu domenowego bez potwierdzenia statusu (CLAUDE.md). |
| **A1** | Model `DanePanelu`, katalog (PDF-y), silnik 6.2 (12 miesięcy, zima), wycena 7.1, kryteria + gwiazdki 6.4, ekran z krokami 1–3 (zakładki Miesiące/Opłacalność/Gwiazdki/Założenia), narzędzie AI `porownaj_panele`, i18n PL/EN/RU, „?”/„i”, autosave, wpis w `pulpit/registry`, `rejestr-pokrycia`, `opis-ekranow-dla-ai`. | Pakiet kontroli zielony; testy silnika z referencjami ręcznymi; weryfikacja w przeglądarce (desktop + 375 px). |
| **A2** | Miejsca instalacji (przełącznik, nazwy, podpowiedzi), liczba paneli z wymiarów miejsca, scenariusz 7.4, panele dodatkowe na ścianie/ogrodzeniu (U11), energia użyteczna + nadwyżka (7.2/7.3), pytanie „zapisać jako podstawowy?” (U14), zestawy i ranking katalogu (12). | j.w. + testy pakowania. |
| **A3** | Elektryka bez falownika (8.1), waga i obciążenia (10). | Odsyłacze do konfiguratora stringów; testy. |
| **A4** | Falownik/regulator (8.2), BOS (po decyzji o cenniku, sekcja 9), system pomocniczy 24 V (8.4). | j.w. |
| **A5** | Bateria i ładowanie (8.3), bilans godzinowy zamiast miesięcznego. | Podmiana założenia 7.2. |
| **B** | OCR (sekcja 13). | Test fixtures, brak sieci w testach, strażnik `ai-tools`. |
| **C** | Opisy producentów (U8) — mogą iść równolegle z A1 po otrzymaniu nazw marek z PDF-ów. | Każdy fakt: źródło + data + status „do akceptacji”. |

## 15. Opisy producentów (U8, Etap C)

Asystent tworzy opisy: kraj i rok założenia, dystrybutor/serwis w Polsce, certyfikaty, niezależne testy (jeśli
publicznie dostępne), czy firma jest znana na rynku, czy panele są oceniane dobrze. **Wyłącznie z wyszukiwania w sieci**
(`WebSearch`) ze **źródłem i datą przy każdym fakcie**; fakty niepotwierdzone oznaczone; ocena subiektywna („dobre
panele”) zawsze jako „według [źródło, data]” albo pominięta — nie jako własny osąd asystenta. Dla marek nieznanych: jawne
„brak wiarygodnych źródeł” (to samo w sobie sygnał ryzyka dla no-name). Tekst PL/EN/RU, aktualizowalny (data
przeglądu). Wchodzi do kryterium „wiarygodność danych i producenta” tylko jako opis, **bez automatycznych punktów**
(punkty z faktów weryfikowalnych: certyfikaty, gwarancja, dystrybutor — decyzja w A0).

## 16. Powiązania z innymi modułami (podsumowanie)

Wybrany panel (po zgodzie użytkownika) zasila: `wplyw-temperatury` (γ), `konfigurator-stringow`, `niedopasowanie-paneli`,
`stress-test-mppt`, `dopasowanie-tablicy-falownika`, `dobor-regulatora-pwm-mppt`, `liczba-paneli`, `bilans-miesieczny`,
`panel-do-stacji-zasilania`. Zużycie z `zuzycie-miesieczne` zasila 7.2. Agregat/taryfy zasilają 7.1. Pionowe — `typ-montazu`.
Narzędzie AI i raport (M10, wydruk/PDF) obejmują wynik zestawu. Dane pogodowe — adapter 6.1.

## 17. Otwarte decyzje (D81) — kto i kiedy

| # | Pytanie | Propozycja asystenta | Kto |
|---|---|---|---|
| A | Skala punktów 0–10 per kryterium | względna w obrębie zestawu + nota (6.4) | właściciel (✅🤖 do potwierdzenia) |
| B | Wycena kWh w taryfie dziennej/nocnej | wg godzin strefy, jawnie opisana (7.1) | właściciel po A0 |
| C | Źródło cennika BOS (ceny jednostkowe) | właściciel dostarcza LUB asystent zbiera ze źródłami do akceptacji (9) | właściciel |
| D | „Zima” = XI–II czy zgodnie z `sezonowosc` | zgodnie z istniejącym modułem | A0 |
| E | Forma „12 paneli”: ranking → ≤4 → turniej | sekcja 12 | właściciel po prototypie |
| F | Punktowanie wiarygodności producenta | tylko fakty weryfikowalne | A0/C |

## 18. Ryzyka i pułapki (audytor)

1. **Dodatkowe panele latem są bez wartości w off-gridzie** (bateria pełna). Dlatego energia użyteczna i U16; bez danych
   zużycia ekran **nie obiecuje** oszczędności z „dokupionych paneli”, tylko pokazuje produkcję i zimę.
2. **Dokupienie paneli ograniczone elektryką** (MPPT/falownik/regulator/bateria) — sprawdzane w A4/A5; do tego czasu
   scenariusz 7.4 pokazuje zastrzeżenie „wymaga sprawdzenia kompatybilności”.
3. **Gwiazdki względne** zmieniają się po zmianie zestawu — nota na ekranie.
4. **Dane no-name:** moc zaniżona względem naklejki — test „co, jeśli panel ma o X% mniej mocy” z X wpisywanym przez
   użytkownika (**bez** wartości domyślnej).
5. **OCR myli cyfry** (Voc, γ) — kontrole spójności + zatwierdzenie pole po polu.
6. **Zima jako XI–II** vs inne definicje — jedno źródło prawdy.
7. **Konflikt numeracji D#** — przed nadaniem sprawdź najwyższy na `origin/main` (H.3); D81 nadano 08.10.2026.
8. Pliki wspólne z innymi sesjami: `lib/pulpit/registry.ts`, `lib/i18n/dictionary-*.ts`, `lib/i18n/ui/*`,
   `scripts/check-i18n-guard.mjs`, `lib/ai/pytaj-asystenta.ts` — tylko dopisywać, nie przestawiać.
9. **Brak zgadywania cen** — patrz sekcja 9; to najłatwiejsze miejsce na złamanie zasady.

## 19. Definicja ukończenia (zgodna z CLAUDE.md)

Kod działa · testy przechodzą · typecheck czysty · ekran w komplecie: autosave + PL/EN/RU + „?” przy każdym polu + „i” przy
tytule + narzędzie AI z „Użyj, gdy…” (D51, Dyrektywa #15) · strażniki zielone · brak martwego kodu · `docs/memory.md`,
`docs/rejestr-pokrycia.md`, `docs/lista-do-zrobienia.md` zaktualizowane · zmiana nie narusza innych modułów ·
weryfikacja w przeglądarce (desktop + 375 px, wykresy, kolory werdyktu) · kanał zwrotny do standardu
(`docs/wklad-do-standardu.md`) uzupełniony, jeśli powstała reguła uniwersalna.

## 20. Wyniki Etapu A0 (audyt echo i projekt danych) — 08.10.2026

> Status: **A0 wykonany (dokumentacja, bez kodu domenowego).** Sekcje 1–19 powyżej zostają bez zmian (zatwierdzone przez
> właściciela); tu tylko wyniki audytu, które je uszczegóławiają albo z nimi się rozchodzą. Rozbieżności z sekcjami 6–9 są
> oznaczone ⚠️ i **nie** są rozstrzygnięte na własną rękę (CLAUDE.md, zasada konfliktów).

### 20.1 Audyt — odpowiedzi na cztery pytania z sekcji 14

| Pytanie | Wynik (zweryfikowane w kodzie 08.10.2026) | Konsekwencja |
|---|---|---|
| Czy istnieje silnik pakowania paneli? | **Tak, jeden:** `ulozPanele(L, W, dlPanelu, szPanelu)` w `lib/core/modules/pv/typ-montazu/wiata.ts` (eksportowany; dziś używany tylko przez tryb „Wiata”). Układy „gilotynowe” z ≤2 blokami, dwie orientacje panelu, **bez odstępów, marginesów brzegowych i cienia międzyrzędowego** (`TM-ZALOZENIE-BEZ-SZCZELIN`; w `assumptions`: nie jest dowodem optimum). **Nie ma** ekranu „M12/E19 pakowanie” — `rejestr-pokrycia.md` nie zawiera takiej pozycji. `dach-plaski.ts` liczy wysokość i napór, ale **nie** odstęp między rzędami. | A2 **wywołuje** `ulozPanele`, nie pisze własnego. Marginesy brzegowe = wpisywane przez użytkownika, **bez wartości domyślnej** (zmniejszenie L i W; jawne w `assumptions`). Panele pochylone na gruncie/płaskim dachu (cień międzyrzędowy) — **poza zakresem A2**: wynik `INCOMPLETE` z komunikatem, dopóki właściciel nie poda reguły odstępu. Panele równoległe do połaci/ściany/ogrodzenia (jak na dachu skośnym, elewacji) — liczone bez tego problemu. ⚠️ „Maksymalny wymiar panelu” (U5) to **filtr katalogu**, nie pakowanie. |
| Jak `porownanie-taryf` wystawia cenę kWh po porze doby? | **Nie wystawia.** Silnik (`siec/porownanie-taryf`, echo `rachunek-za-prad`) przyjmuje od użytkownika **podział zużycia na strefy** i **ceny energii na strefę** (`zuzycieStrefKwh`, `cenaEnergiiZlKwh`); godziny stref nie istnieją w pliku `rozliczenia-pl-2026` (komentarz w kodzie: „OSD data that the rates file does not have yet”). Strefy w schemacie: `calodobowa, dzien, noc, szczyt, pozaszczyt`. | **Decyzja B zostaje otwarta** i dostaje trzy konkretne warianty (20.4). Nic nie liczymy „wg godzin strefy”, bo godzin nie mamy. |
| Czy TMY niesie temperaturę otoczenia? | ⚠️ **Odpowiedź częściowa — to zmienia zakres A1.** PVGIS TMY zwraca `T2m` (adapter `lib/adapters/pvgis/tmy.ts` ma je w schemacie Zod jako pole **opcjonalne**), **ale** `RekordGodzinowy` (`orientacja-powierzchni/input.ts`) **nie ma pola temperatury** i adapter zapisuje wyłącznie 12 średnich miesięcznych (`temperaturyMiesieczneC`; `docs/memory.md` 26.09.2026: „godzinowe temperatury NIE są zapisywane”). Zapis lokalny `offgrid.pvgis-tmy.v1` nie zawiera godzinowej temperatury. Silnik 6.2 (temperatura ogniwa godzina po godzinie) **nie może więc działać na dzisiejszych danych.** Nie dało się też sprawdzić kształtu odpowiedzi na żywo — z kontenera chmurowego host `re.jrc.ec.europa.eu` jest blokowany przez proxy (403); podstawą są schemat Zod, test adaptera i wpis z 26.09.2026. | A1 zaczyna od **rozszerzenia wstecznie zgodnego**: opcjonalne `tempC?: number` w `RekordGodzinowy`, wypełniane z `T2m` przez adapter; `Godzina` w `muneer.ts` przenosi je dalej; zapisy bez godzinowej temperatury → ekran prosi o ponowne pobranie (ten sam wzorzec co `temperaturyMiesieczneC`, bez zmiany klucza zapisu). **Do zweryfikowania na żywo przy pierwszym pobraniu** (urządzenie właściciela albo CI z dostępem do PVGIS). Do czasu pobrania: kryterium temperaturowe „nie do porównania”, nie średnia miesięczna jako zamiennik. |
| Definicja „zimy”? | **U1 jest jednoznaczne: XI–II** (listopad, grudzień, styczeń, luty). `zapotrzebowanie/sezonowosc` **nie ma** uniwersalnej definicji zimy (okres wpisuje się per urządzenie — komentarz w kodzie). Jedyna stała w repo, `MIESIACE_ZIMOWE = [11, 0]` w `siec/bilans-miesieczny/constants.ts`, to grudzień–styczeń i służy innemu celowi (warunek scenariusza D, M14). | **Pkt D zamknięty przez U1.** Stała lokalna modułu `MIESIACE_ZIMOWE_PORÓWNYWARKI = [10, 11, 0, 1]` (indeksy 0 = styczeń); nie importować stałej z M14 (inna definicja, inny cel). Notka w `assumptions`. |

### 20.2 Co silnik może wywołać bez przepisywania (echo, sprawdzone)

- **Godzinowe napromieniowanie płaszczyzny (G_poa):** `przygotujGodziny` → `plaszczyzna(nachylenie, azymut, albedo)` → `natezenieGodziny(godzina, plaszczyzna, zaHoryzontem(godzina, horyzont))` w `lib/core/modules/lokalizacja/orientacja-powierzchni/muneer.ts`. Wszystko eksportowane; model Muneera i horyzont bez zmian, jak w sekcji 6.2. Miesiąc rekordu (UTC) jest w `Godzina.miesiac`.
- **Ułożenie paneli:** `ulozPanele` (tabela wyżej).
- **Powierzchnie projektu o nazwach:** `lib/lokalizacja/model-dzialki.ts` — `powierzchnieZModelu`, `powierzchnieDoOceny` (nakłada ręczne korekty i powierzchnie dopisane); typ `PowierzchniaZModelu` ma **stałe `id`**. Nazwy generowane („Elewacja N”, „Dach wg obrysu budynku”) tłumaczy `etykietaPowierzchni`.
- **Koszt kWh z agregatu:** `kalkulator-mobilny/agregat-paliwo` (`calculateAgregatPaliwo`: moc, obciążenie, l/h z karty, cena paliwa — wszystko od użytkownika, bez domyślnych) — pasuje do U2(c).
- **Karta katalogowa już w repo:** `docs/zrodla/karta-katalogowa-JA-Solar-JAM60D41-LB/` (seria 485–510 W; Pmax/Voc/Vmp/Isc/Imp, α/β/γ, **NOCT 45±2 °C**, masa 27,3 kg, wymiary 1953×1134×30 mm, bezpiecznik 30 A, bifacjalna). To **pierwszy panel katalogu** (dane 1:1 z `00-INDEKS.md`, ze zwróconą uwagą o etykiecie Vmp). **Nie ma w niej sprawności przy 200 W/m²** → kryterium „słabe światło” dla tego panelu = „nie do porównania” (reguła 6.4), bez uzupełniania typowymi wartościami.
- **Nie audytowane w A0, do A1:** bifacjalność i albedo śniegu (`panele-bifacjalne`, `czystosc-i-snieg`), straty systemowe (`straty-okablowanie-dc`), sparowanie tolerancji mocy.

### 20.3 Projekt danych — poprawki względem sekcji 5

1. **Profil panelu przechowuje migawkę danych, nie samo `daneId`.** Panel wprowadzony ręcznie albo z OCR (Etap B) nie istnieje w katalogu, więc `daneId` wskazywałoby w próżnię. Zapis: `panel?: { podstawowy: DanePanelu; zapisanoIso: string }` — kopia wartości z momentu zgody użytkownika (U14); katalog wskazuje tylko źródło.
2. **Miejsce „z projektu” przechowuje odwołanie, nie kopię kątów.** Przy `zrodlo: "z-projektu"` zapisujemy `powierzchniaId` (stałe `id` z `PowierzchniaZModelu`) i opcjonalną korektę; nachylenie i azymut rozwiązuje się przy odczycie z modelu działki. Kopia liczb zestarzałaby się po zmianie modelu działki (standard 5.1: zapisujemy Seed, nie Wynik). Dla `zrodlo: "wlasne"` zapisujemy liczby. Typ jako unia dyskryminowana — nie dwa opcjonalne pola.
3. **`schema_version` (standard 02, 2.4):** dziś `offgrid.profil-sprzetu.v1` **nie ma** pola wersji w danych (`v1` jest tylko w kluczu). Dodajemy `schemaVersion: 2` w danych; brak pola = wersja 1 (zapisy sprzed zmiany: tylko `bateria`). Migracja 1→2 jest czysto addytywna (nowe sekcje opcjonalne), w jednej funkcji `migrujProfil` z testem; **klucz zapisu bez zmian** (żeby nie osierocić danych baterii). Dług „klucz z sufiksem `.v1` przy wersji danych 2” — do `docs/memory.md` jako znany.
4. **Gdzie leżą „miejsca instalacji”:** propozycja: **osobny Seed** `miejsca-instalacji` (`usePersistedDraft`, jak `skaner-dzialki`), nie sekcja `profil-sprzetu` — to dane o *miejscu*, nie o *sprzęcie*, a `useProfilSprzetu` ma dziś API wąskie (`zapiszBaterie`). Sekcja 5 mówi „rozszerzenie profil-sprzetu **i** modelu działki”; to odchylenie jest techniczne i odwracalne — **do potwierdzenia przy przeglądzie A1**, nie blokuje.
5. **Katalog paneli** jako dane walidowane Zod przy starcie modułu (wzorzec `lib/core/dane/rozliczenia-pl-2026`, D36): `lib/core/dane/katalog-paneli-pv/` — każdy parametr ze stroną źródła, brak pliku źródłowego = brak wpisu.

### 20.4 Decyzje do właściciela po A0 (krótko; rekomendacja pierwsza)

| # | Pytanie | Opcje |
|---|---|---|
| A | Skala 0–10 gwiazdek | **(1) względna w obrębie zestawu + nota** (rekomendacja) · (2) absolutne progi (wymaga liczb od właściciela) |
| B | Wycena kWh „dzienna/nocna” — godzin stref w danych nie ma | **(1) użytkownik wpisuje ceny stref i udział brakującej energii przypadający na strefę dzienną** (z faktury; jawne pole, bez ukrytej stałej) · (2) odłożyć do A5 (bilans godzinowy) i do tego czasu oferować tylko całodobową/agregat/ręczną · (3) dodać godziny stref OSD do pliku stawek (osobne zadanie) |
| C | Cennik BOS | **(1) właściciel dostarcza ceny jednostkowe** · (2) asystent zbiera z sieci ze źródłami i datami do akceptacji · do czasu decyzji moduł działa na samej cenie panelu z banerem (sekcja 9) |
| E | Forma „12 paneli” | decyzja po prototypie układu (sekcja 20.5) |
| F | Punkty za wiarygodność producenta | tylko fakty weryfikowalne (certyfikaty, gwarancja, dystrybutor) — rekomendacja, do potwierdzenia przy Etapie C |

Nowe, techniczne (bez decyzji właściciela, do wiadomości): rozszerzenie TMY o godzinową temperaturę (20.1) oznacza, że **po wdrożeniu A1 użytkownik musi raz pobrać dane pogodowe ponownie** — ekran mówi to wprost.

### 20.5 Układ ekranu (szkic do akceptacji przed A1)

Warstwy zgodne z sekcją 11; jeden ekran, trzy kroki, wynik w zakładkach:

```
[i] Porównywarka paneli PV                      [Moje zestawy ▾]
 Krok 1  Gdzie i ile      ● ─── ○ Krok 2 Panele ─── ○ Krok 3 Wynik
 ┌ Miejsce: [Dach południowy ▾]  [+ własne miejsce]  podpowiedź nazwy
 │ Ile paneli? [ 8 ]  albo  wymiary miejsca [ ] × [ ] m (policzę ile wejdzie)
 └ Wartość kWh: (•) sieć całodobowa ( ) dzienna/nocna ( ) agregat ( ) ręcznie
 Krok 2  Wybierz do 4 paneli:  [z katalogu ▾] [wpisz ręcznie]   Cena brutto*: [ ] zł
 Krok 3  ┌ WERDYKT: 3 karty „game changer” (zima · więcej paneli · nadwyżka)
         └ zakładki: Miesiące | Opłacalność | Więcej paneli? | Gwiazdki | Elektryka | Producent i waga | Założenia
```

Prototyp graficzny (bez danych — wyłącznie układ) opublikowany w wątku projektu; dane liczbowe w nim są **atrapami układu**, nie danymi paneli.

## 21. Etap A1 — wykonany (08.10.2026) i decyzje A–C właściciela

### 21.1 Decyzje właściciela z 08.10.2026

| # | Decyzja | Skutek w kodzie / planie |
|---|---|---|
| A | **Opcja 1 — skala względna w zestawie** | Wdrożone w A1 (`PORP-ZAL-SKALA-WZGLEDNA`); bez zmian. |
| B | Cena kWh dzienna/nocna: **udział brakującej energii w strefach bierzemy z aplikacji** (zapotrzebowanie, pojemność akumulatora itd.); jeśli ekran-źródło nie jest uzupełniony, użytkownik ma go uzupełnić **w odpowiednim istniejącym ekranie**, nie w porównywarce | **Etap A5** (bilans godzinowy): podłączenie profilu zapotrzebowania i magazynu. A1 ma tryb pośredni — patrz 21.2. Nie dodajemy w porównywarce pola „udział energii w strefie dziennej”. |
| C | **Opcja 2 — asystent zbiera ceny BOS z sieci ze źródłami i datami, do akceptacji właściciela** | Zadanie na liście (przed Etapem A3). Do akceptacji ceny nie wchodzą do kodu. |

### 21.2 Taryfa dzienna i nocna w A1 (tryb pośredni, do czasu A5)

W systemie **są** stawki dystrybucyjne G12 per OSD (`rozliczenia-pl-2026`, grupy G12/G12w, strefy `dzien`/`noc`), ale **nie ma** godzin stref ani ceny energii sprzedażnej; godzin stref nie wolno zgadywać, bo operatorzy publikują je różnie: Energa, PGE i E.ON — 22–6 i 13–15; Tauron i Enea wyznaczają je w przedziałach (noc w oknie 22–7, południe w 13–16/17). Źródła: enerad.pl/taryfa-g12 (stan na 08.10.2026, odczyt zbiorczy), akademia-fotowoltaiki.pl/jaka-taryfe-pradu-wybrac (przykład 22–6 i 13–15). Wdrożone:
- wycena „Sieć (taryfa dzienna i nocna)”: użytkownik wpisuje **całkowite ceny kWh** dzienną i nocną (z faktury) oraz **okna taniej strefy** (do dwóch, `od–do`, okno `22→6` przechodzi przez północ); formularz podpowiada **przykład G12** (22–6 i 13–15) widoczny i edytowalny, silnik dostaje okna zawsze od użytkownika;
- energia panelu jest rozdzielana **według godziny produkcji w czasie urzędowym PL** (UTC+1/UTC+2 wg reguły UE, funkcja bez `Intl`) i wyceniana: tania strefa po cenie nocnej, reszta po dziennej; `PORP-ZAL-STREFY-CZAS-PL` w założeniach; taryfy z innymi zasadami w weekendy (G12w) nie są odwzorowane;
- to jest wycena **wyprodukowanej** energii (po godzinie produkcji), nie wycena **brakującej** energii z decyzji B — ta druga przyjdzie w A5 razem z profilem zapotrzebowania i magazynem; wtedy wycena stref będzie liczona na deficycie, a tryb pośredni zostanie opisany jako uproszczenie.

### 21.3 Co zawiera A1

Silnik `lib/core/modules/pv/porownywarka-paneli/` (uzysk godzinowy z temperaturą ogniwa i sprawnością przy słabym świetle, zima XI–II, wycena kWh: sieć/dzienna-nocna/agregat/ręczna/bez wyceny, koszt zimowej kWh w 25 latach, kryteria i gwiazdki względne, reguła porównywalności), katalog JA Solar JAM60D41-485…510/LB z kartą jako obrazem (`public/zrodla/paneli/`, link „Zobacz kartę katalogową” przy panelu z katalogu — potwierdzenie danych klikane w aplikacji), ekran `/kalkulatory/porownywarka-paneli` (kroki 1–3, zakładki Miesiące / Opłacalność / Gwiazdki / Założenia, wykres miesięczny z podświetloną zimą), narzędzie AI `porownaj_panele`, kafelek w M3, tłumaczenia PL/EN/RU, pomoc „?” i „i”, autosave. **Poza A1** (zgodnie z planem): pakowanie paneli w miejscu (A2), dane elektryczne i stringi (A3), „więcej paneli?” i nadwyżka (A4), bilans godzinowy z zapotrzebowaniem (A5), OCR (B), opisy producentów (C). Wagi 5% dla „uzysk roczny” i „cena za Wp” to propozycja asystenta (spec 6.4 ich nie ma) — do potwierdzenia.

### 21.4 Karty katalogowe jako źródła widoczne w aplikacji

Prośba właściciela: zdjęcia kart zapisywać jako źródła i pozwolić je otworzyć w aplikacji. Każdy wpis katalogu ma `kartaObrazy` (ścieżki obrazów w `public/zrodla/paneli/`, kopia pliku z `docs/zrodla/karta-katalogowa-*`); test pilnuje, że pliki istnieją. Link znika, gdy użytkownik ręcznie zmieni liczbę z karty (dane przestają być wtedy potwierdzone kartą). Linki do zdjęć na zewnętrznych serwerach nie działają z chmurowego środowiska asystenta (host pvzenit.pl zablokowany) — karty przesyłać jako załączniki w wątku. Astronergy ASTRO N5 CHSM72N(DG)/F-BH 570–595 W: dodany do katalogu 08.10.2026 ze zrzutów strony sklepu (`docs/zrodla/karta-katalogowa-Astronergy-N5-CHSM72N-DG-F-BH/`); karta podaje NMOT 41 ± 2 °C (wpisany jako NOCT — te same warunki definicji), γ −0,29%/°C, degradację ≤1,0% + ≤0,4%/rok, nie podaje sprawności przy 200 W/m² (`null`). Tego samego dnia dodane: JA Solar JAM54D41 LB 440–465 W (`docs/zrodla/karta-katalogowa-JA-Solar-JAM54D41-LB/`; γ −0,29%/°C, NOCT 45 °C, degradacja 1% + 0,4%/rok) i HD Hyundai HiT-H5xxCF-BF(ZB) 500–520 W (`docs/zrodla/karta-katalogowa-Hyundai-HiT-H5xxCF-BF-ZB/`; γ −0,24%/°C, NMOT 44 °C wpisany jako NOCT na podstawie definicji IEC 61215 — karta nie drukuje warunków, degradacja 1% + 0,3 p.p./rok), a także JA Solar JAM54D40 LR 450–475 W, jednostronny (`docs/zrodla/karta-katalogowa-JA-Solar-JAM54D40-LR/`; γ −0,29%/°C, NOCT 45 °C, degradacja 1% + 0,4%/rok; karta podaje moc przy 200 W/m², 25 °C → sprawność względna wyliczona 96,7–96,8%) oraz JA Solar JAM60D40 LB 485–510 W (`docs/zrodla/karta-katalogowa-JA-Solar-JAM60D40-LB/`; te same liczby co JAM60D41 LB; karta w wersji PL i EN, rozbieżna gwarancja produktu 15 vs 12 lat); polska okładka JAM60D41 LB uzupełniła jego degradację (1% + 0,4%/rok); JA Solar JAM54D40 LB 435–460 W, dwustronny (`docs/zrodla/karta-katalogowa-JA-Solar-JAM54D40-LB/`; γ −0,29%/°C, NOCT 45 °C, degradacja 1% + 0,4%/rok; nie mylić z jednostronnym JAM54D40 LR), Trina Vertex S+ TSM-NEG9R.28 430–475 W (dwie wersje karty: `…-NEG9R-28/` i nowsza `…-NEG9R-28-450-475/`; `docs/zrodla/karta-katalogowa-Trina-Vertex-S-plus-TSM-NEG9R-28/`; podwójne szkło, γ −0,29%/°C, NOCT 43 °C, degradacja 1% + 0,4%/rok; karta nie podaje bifacjalności), LONGi Hi-MO X10 Scientist LR7-60HVH 535–560 W (`docs/zrodla/karta-katalogowa-LONGi-Hi-MO-X10-LR7-60HVH/`; jednostronny BC, γ −0,26%/°C, NOCT 45 °C, degradacja <1% + 0,35%/rok), LONGi Hi-MO X10 Explorer LR7-54HVH 475–490 W (`docs/zrodla/karta-katalogowa-LONGi-Hi-MO-X10-LR7-54HVH/`; jednostronny BC, γ −0,26%/°C, NOCT 45 °C, degradacja <1% + 0,35%/rok), Jinko Tiger Neo 72HL4-BDV 575–600 W (`docs/zrodla/karta-katalogowa-Jinko-Tiger-Neo-72HL4-BDV/`; γ −0,29%/°C, degradacja 1% + 0,40%/rok, bez NOCT), Jinko Tiger Neo 66HL4M-BDV 605–630 W (`docs/zrodla/karta-katalogowa-Jinko-Tiger-Neo-66HL4M-BDV/`; γ −0,29%/°C, degradacja 1% + 0,40%/rok, 12 lat gwarancji produktowej, bez NOCT), Jinko Tiger Neo 48HL4M-BDV 445–470 W (`docs/zrodla/karta-katalogowa-Jinko-Tiger-Neo-48HL4M-BDV/`; γ −0,29%/°C, degradacja 1% + 0,40%/rok; karta NIE podaje NOCT → `noctC: null`), JA Solar JAM72D40 MB 580–605 W (`docs/zrodla/karta-katalogowa-JA-Solar-JAM72D40-MB/`; 144 ogniwa, γ −0,29%/°C, NOCT 45 °C, degradacja 1% + 0,4%/rok), JA Solar JAM66D46 LB 690–720 W (`docs/zrodla/karta-katalogowa-JA-Solar-JAM66D46-LB/` i nowsza `…-LB-695-720/`, dodaje 720 W; duży format 2384×1303 mm, γ −0,29%/°C, NOCT 45 °C, degradacja 1% + 0,4%/rok, gwarancja produktowa 12 lat).

## 22. Etap A2, część 1 — wykonany (08.10.2026)

Zakres: liczba paneli z wymiarów miejsca (6.3), energia wykorzystana i nadwyżka (7.2/7.3), scenariusz „tańszy panel = więcej paneli” z panelami na ścianie południowej (7.4, U10, U11). Szczegóły i pułapki: `docs/memory.md`, wpis z 08.10.2026 „Etap A2, część 1”.

- **Dane:** katalog ma wymiary i masę z kart; panel bez wymiarów na karcie → przy liczeniu z miejsca wynik `INCOMPLETE` z nazwą panelu (nie zgadujemy).
- **Pakowanie:** istniejący `ulozPanele`; margines od krawędzi wpisuje użytkownik (obie strony); odstępów między panelami i cienia międzyrzędowego brak (`PORP-ZAL-PAKOWANIE-BEZ-SZCZELIN`). Montaż pochylony na konstrukcji bez podanej liczby paneli → `INCOMPLETE` (⚠️ do ustalenia z właścicielem: reguła odstępu między rzędami).
- **Energia użyteczna:** bilans miesięczny bez ograniczeń baterii i falownika, do wyceny tylko energia wykorzystana; strefy taryfy skalowane proporcjonalnie — uproszczenie do czasu A5.
- **Scenariusz 7.4:** porównanie z najdroższym zestawem (cena × liczba sztuk); koszt dodatkowej sztuki = cena panelu bez BOS (do czasu akceptacji cennika, sekcja 9).
- **Zostaje w A2:** miejsca instalacji z przełączaniem i nazwami (U19), „zapisać jako podstawowy?” (U14), zestawy i ranking katalogu (sekcja 12).
