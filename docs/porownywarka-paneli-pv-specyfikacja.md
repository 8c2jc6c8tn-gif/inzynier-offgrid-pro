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
> **Decyzja właściciela 09.10.2026:** w A4 powstaje mała baza popularnych falowników (ok. 10–15 modeli off-grid/hybrydowych, karta jako obraz, tylko pola potrzebne do doboru, bez cen); pełnej bazy nie budujemy. Lista modeli i karty PDF — od właściciela.

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

## 23. Etap A2, część 2 — wykonany (08.10.2026)

Zakres: miejsca instalacji (U19), pytanie „zapisać jako podstawowy?” (U14), zestawy porównań i ranking katalogu (sekcja 12, filtr U5), to samo porównanie w kilku miejscach (U18), parametry w narzędziu AI. Szczegóły i pułapki: `docs/memory.md`, wpis z 08.10.2026 „Etap A2, część 2”.

- **Miejsca (U19):** formularz trzyma listę miejsc z własnymi nazwami (podpowiedzi w `datalist`, nazwa dowolna), przełączanie jedno aktywne; każde ma kąty, albedo, liczbę paneli albo wymiary + margines + sposób montażu. Panele i wycena są wspólne dla miejsc. Zakładka „Miejsca” (≥2 miejsca) pokazuje tabelę miejsca × panele (zima, rok, liczba sztuk) — te same panele w każdym miejscu (U18).
- **Panel podstawowy (U14):** po wyniku przycisk „Zapisz … jako podstawowy…” → potwierdzenie Tak/Nie; zapis wyłącznie za zgodą, bez ceny, jako migawka danych (`katalogId`, data). Profil sprzętu ma `schemaVersion: 2` z migracją addytywną (zapis sprzed zmiany czyta się bez straty).
- **Zestawy (sekcja 12):** zapis bieżącego stanu (miejsca, panele, wycena, kryteria) pod nazwą, wczytanie, nadpisanie, duplikat, usunięcie z potwierdzeniem; autosave jak reszta ekranu.
- **Ranking katalogu:** wszystkie panele katalogu na aktywnym miejscu według energii zimowej; filtry: moc od/do i najdłuższy bok (U5); sortowanie: zima z 1 szt. / na m² / w całym miejscu. Bez gwiazdek i bez ceny (katalog jej nie zna). Temperatura w rankingu tylko wtedy, gdy KAŻDY panel z listy ma γ i NOCT (reguła porównywalności) — ekran mówi, który wariant zastosowano. Zaznaczone (maks. 4) wstawiają się do porównania.
- **Narzędzie AI `porownaj_panele`:** przyjmuje wymiary paneli i masę, wymiary miejsca z marginesem i sposobem montażu oraz 12-miesięczne zużycie; zwraca liczbę sztuk, ile się mieści, energię wykorzystaną i ułamek nadwyżki.
- **Nadal poza zakresem:** reguła odstępu rzędów paneli pochylonych (czeka na właściciela), BOS i elektryka (A3), bilans godzinowy (A5).

## 24. Odstęp rzędów paneli pochylonych (09.10.2026)

Prośba właściciela: reguła odstępu zależna od kąta pochylenia, a najlepiej kalkulator uwzględniający współrzędne i kierunek (zacienienie przez inne panele na płaskim dachu lub gruncie); świadomie z możliwością, że przy dużym kącie cień i tak sięga daleko zimą.

- **Kalkulator** `pv/odstep-rzedow` (ekran `/kalkulatory/odstep-rzedow`, narzędzie AI `odstep_rzedow_paneli`): przekrój prostopadły do rzędów, rzędy nieskończone, grunt płaski. Odstęp bez cienia w oknie: P = L·(cosβ + sinβ·F), F = max(cosΔ/tgα) po próbkach okna 21 grudnia (czas słoneczny → UTC przez równanie czasu i długość geograficzną). Straty: zacieniony ułamek stołu × belka bezpośrednia (dni·cosθ) z godzinowego TMY (model Muneera istniejącego silnika), zima XI–II i rok; rozproszone nie pomniejszane (lekko optymistycznie), diody bypass niemodelowane (ostrzeżenie), waga rzędów (n−1)/n.
- **Co daje użytkownik:** współrzędne (z lokalizacji projektu), nachylenie, azymut, długość stołu wzdłuż spadu, okno, odstęp własny albo docelowa strata zimowa (wynik: najmniejszy odstęp). Tabela kątów 10–60° i najlepszy kąt na m² gruntu.
- **Użycie w Porównywarce:** montaż „pochylony na konstrukcji” bez wpisanej liczby paneli → liczba sztuk z odstępu (stoły 1–2 paneli nad sobą, oba kierunki rzędów, obie orientacje panelu, układ z największą liczbą sztuk); wynik pokazuje układ rzędów (rzędy × stoły, odstęp). Okno wpisuje się w polach miejsca; puste = 9–15 (jawne założenie). Cień poza oknem nie pomniejsza energii (policzy go kalkulator odstępu).
- **Decyzja właściciela (09.10.2026):** domyślne okno 9–15 (czas słoneczny, 21 grudnia) zatwierdzone; na ekranie odstępu i w polach miejsca są dwa przyciski typowych okien, 9–15 i 10–14 (prośba właściciela 09.10.2026: 10–14 mieści więcej paneli), oraz pola na własne okno (węższe, np. 10–14, mieści więcej paneli kosztem zimowego cienia poza oknem).
- **Ranking katalogu (zmiana 09.10.2026):** panel bez γ albo NOCT jest wyszarzony („brak danych”) i wykluczony z punktowania, gdy dane mają temperaturę; nie wyłącza temperatury pozostałym. Porównywarka (2–4 paneli) działa tak samo od 09.10.2026 (decyzja właściciela „Wyszarz panel bez danych”): panel bez γ/NOCT trafia do `value.wykluczone` i jest szary, reszta liczona z temperaturą; gdy nikt nie ma kompletu, model prosty dla wszystkich. Wagi „uzysk roczny” i „cena za Wp” zostają domyślnie wyłączone (decyzja 09.10.2026).


## 25. Etap A3 — elektryka paneli bez falownika i masa (09.10.2026)

- **Dane z kart:** każdy wpis katalogu ma teraz Voc, Vmp, Isc, Imp w STC, β(Voc), maks. napięcie układu i maks. bezpiecznik szeregowy (`lib/core/dane/katalog-paneli-pv/elektryka.ts`, liczby przepisane z tabel STC transkrypcji kart w `docs/zrodla/karta-katalogowa-*`). Test katalogu pilnuje spójności (Vmp·Imp ≈ Pmax ±2%, Voc > Vmp, Isc > Imp, β < 0). Karta Jinko 66HL4M 590–600 W (edycja EN) nie podaje bezpiecznika → `null`. Hyundai: karta podaje „maks. prąd wsteczny 30 A”, wpisany jako bezpiecznik szeregowy.
- **Silnik** `porownywarka-paneli/elektryka.ts` (bez nowych wzorów): Voc zimą z `stress-test-mppt` (`Voc·(1+β·(Tmin−25))`), sumowanie szereg/równolegle z `konfigurator-stringow`, margines Isc K1 = 1,25 i obowiązek zabezpieczenia stringów z `ochrona-stringow` (HD 60364-7-712). Wynik na panel: Voc zimą, maks. liczba paneli w stringu wg limitu napięcia z karty i wszystkie równe układy N paneli (szereg × równolegle) z kolumnami Voc zimą / Vmp / Imp / Isc / zabezpieczenie.
- **Najniższa temperatura** wpisuje użytkownik (pole w zakładce „Elektryka”, bez wartości domyślnej); pod polem pokazana najniższa godzinowa temperatura z danych TMY z zastrzeżeniem, że to nie temperatura projektowa.
- **Czego A3 świadomie NIE robi:** (1) **nie wskazuje „najlepszego” układu** — bez falownika (okno MPPT, maks. Voc wejścia, prąd wejścia: A4) najdłuższy string byłby po prostu najwyższym dopuszczonym napięciem DC (do 1500 V), co w off-gridzie byłoby złą radą; spec 8.1 mówiła „rekomendacja”, ta pojawi się w A4; (2) **nie liczy Vmp w upale**, bo karty nie podają współczynnika temperaturowego Vmp; (3) **nie porównuje obciążeń Pa z Eurokodem** (spec 10) — wymaga strefy śniegowej/wiatrowej i rozróżnienia obciążenia testowego i obliczeniowego z kart (np. 5400 Pa test vs 3600 Pa obliczeniowe, współczynnik 1,5 na karcie JAM54D40 LR) — osobny podetap; (4) **nie wpisuje „liczby osób do montażu”** (brak źródła).
- **Masa:** do istniejącej masy zestawu doszła masa panelu na m² jego powierzchni (kg/m², z masy i wymiarów karty; bez stelaża i balastu).
- **Dane elektryczne tylko z katalogu:** panel wpisany ręcznie (bez wyboru z katalogu) albo z ręcznie zmienioną liczbą z karty nie ma danych elektrycznych — ekran mówi to wprost. Ręczne pola Voc/Vmp/Isc/Imp/β i odczyt z karty (OCR) dojdą w Etapie B (zrobione: sekcje 26 i 33).
- **Narzędzie AI** `porownaj_panele`: nowe wejścia `tminC` i `panele[].elektryka`, nowe wyjście `panele[].elektryka` i `masaNaM2Kg`.
- **Uwaga o planie:** tabela etapów (sekcja 14) umieszcza koszt osprzętu (BOS) w A4; zaakceptowany cennik (`docs/zrodla/cennik-bos-orientacyjny-2026-10-09.md`) wchodzi więc do kodu w A4, razem z falownikiem (ilości: kabel DC, złączki MC4, zabezpieczenia wynikają ze stringów z A3 i wyboru falownika).

## 26. Ręczne dane elektryczne panelu spoza katalogu (09.10.2026)

Zamyka punkt z sekcji 25 („dane elektryczne tylko z katalogu”) i luka nr 1 instalatora: panel spoza katalogu można teraz ocenić.
- **Pola w panelu** (tylko gdy panel nie pochodzi z katalogu): Voc, Vmp, Isc, Imp, β(Voc) i maks. napięcie układu DC — wszystkie sześć wymagane razem; maks. bezpiecznik szeregowy opcjonalny (`null` = przedziału bezpiecznika nie wyznaczamy). Brak któregokolwiek z sześciu = brak oceny stringów, nic nie jest dopełniane „typową” wartością.
- **Kontrola literówek:** gdy |Vmp × Imp / Pmax − 1| > 2%, pokazujemy ostrzeżenie `PORP-ELEKTRYKA-NIESPOJNA` („sprawdź przepisane liczby”). 2% to tolerancja zaokrągleń kart — cały katalog mieści się w niej (test spójności katalogu); to kontrola arytmetyczna, nie norma.
- **Silnik** bez zmian (`ocenElektryke`): ręczne dane trafiają do niego jako `DanePanelu.elektryka`, jak z katalogu; zmiana jest w `lib/porownywarka-paneli/stan.ts` (`elektrykaRecznaZPanelu`) i w formularzu. Wybór panelu z katalogu zawsze bierze elektrykę z katalogu.
- **OCR kart** (Etap B) ma wypełniać te same pola, więc nic w silniku się nie zmieni (zrobione: sekcja 33).

## 27. Etap A4: falownik, regulator, mikroinwerter i osprzęt (09.10.2026)

Zakładka „Falownik i osprzęt” na ekranie Porównywarki. Zamyka punkty 8.2 i 9 oraz kartę „system pomocniczy 24 V” (8.4).
- **Dopasowanie do urządzenia** (`dopasowanie-urzadzenia.ts`): wybór z katalogu urządzeń (regulator MPPT, falownik hybrydowy, mikroinwerter; falownik wyspowy Phoenix pominięty — jego wejście DC to akumulator). Dla każdego układu stringów z A3 cztery kontrole: (1) napięcie jałowe stringu zimą ≤ Voc max, (2) Vmp (STC) w oknie MPPT, (3) prąd roboczy na wejście, (4) prąd zwarcia na wejście; wynik ✓ / ✗ / „?” (karta nie podaje — nigdy zgadnięty limit). Liczba urządzeń: stringi rozkładane równo na wejścia; gdy jedno urządzenie nie udźwignie prądów, potrzeba kolejnych. Limit mocy (moc wejścia PV, nominalna moc PV przy wybranym napięciu akumulatora, moc AC mikroinwertera) to informacja o obcinaniu nadmiaru, nie blokada.
- **Propozycja układu:** spośród układów mieszczących się w limitach i z potwierdzonym Voc — najmniej urządzeń, potem najmniej stringów równoległych (mniej kabli i zabezpieczeń). To heurystyka podana na ekranie jako wskazówka, nie projekt; dobór przekrojów i aparatury zostaje przy projektancie.
- **Limity zastępcze:** brak Voc max na karcie → górna granica okna MPPT (przekroczenie = „do sprawdzenia”, nie „za dużo”, i taki układ nie jest proponowany); mikroinwerter bez okna MPPT → zakres wejścia DC karty; mikroinwerter przyjmuje jeden panel na wejście (szereg odpada).
- **Świadome przybliżenia (w nocie na ekranie):** Vmp z STC (karty paneli nie podają współczynnika temperaturowego Vmp), prądy w STC jak w kartach urządzeń. Przykład uczciwego wyniku: panel 500 W (Imp 13,55 A) przekracza prąd wejścia mikroinwertera GT-600 (12 A) — aplikacja to pokazuje.
- **Osprzęt** (`bos.ts`, `lib/core/dane/cennik-bos`): siedem pozycji z zaakceptowanego cennika (kabel 6 mm², pary MC4, podstawy bezpieczników DC, rozłącznik DC, ogranicznik przepięć T2, rozdzielnia DC, konstrukcja) jako zakres brutto (netto × 1,23) min–max z flagą „orientacyjny”, konstrukcja z flagą „bardzo orientacyjne”. Ilości (propozycja): kabel = 2 × trasa × stringi, MC4 = 2 pary na string, zestawy bezpieczników = stringi tylko gdy A3 wskazuje obowiązek zabezpieczenia, rozłącznik i ogranicznik = wejścia MPPT w użyciu, konstrukcja = liczba paneli; rozdzielnia z aparaturą domyślnie wyłączona (zastępuje osobne aparaty). Każdą pozycję można wyłączyć i nadpisać jej cenę (kwoty przeliczane z walutą). Cena urządzenia nie jest w katalogu — pole opcjonalne. Mikroinwerter: osprzęt DC nie jest wyceniany.
- **Suma:** panele + urządzenia (jeśli wpisano cenę) + osprzęt jako zakres. Okres zwrotu i scenariusz „tańszy panel = więcej paneli” NIE uwzględniają jeszcze osprzętu — osobny krok.
- **System pomocniczy 24 V:** w zakładce „Nadwyżka” opis z odsyłaczami do czterech istniejących ekranów (źródła zasilania, napięcie systemowe, panel dla urządzenia, minimum na czas blackoutu); żadnych liczb bez silnika.
- **Czego A4 nie robi:** nie czyta cen urządzeń (brak w katalogu), nie uwzględnia długości stringów w upale (brak β(Vmp)), nie dobiera przekrojów kabli ani wkładek bezpiecznikowych (zestaw z cennika ma wkładki 15 A — ekran każe dobrać je do przedziału z zakładki „Elektryka”).

## 28. Wydruk oferty (09.10.2026)

Zakładka „Oferta (wydruk)”: kartka z wynikiem do wydruku albo zapisu jako PDF przez okno drukowania przeglądarki. Odpowiada luce „wydruk/PDF dla klienta” instalatora i sprzedawcy (lista zadań).
- **Treść kartki:** nagłówek (tytuł, data, „Dla”, „Wykonawca”, miejsce: nachylenie, azymut i współrzędne), zdanie-wniosek (tylko przy co najmniej dwóch panelach), tabela porównawcza (liczba sztuk, moc, masa, zima, rok, cena paneli, cena za Wp, wartość roczna, zwrot, moc po 25 latach — wiersze bez żadnej liczby są pomijane), sekcja falownika/regulatora z układem i osprzętem (jeśli wybrano urządzenie), uwagi, założenia obliczeń i zastrzeżenie, stopka. Wszystkie liczby pochodzą z tych samych funkcji co ekran (`wierszeWyniku`, `podsumujUrzadzenie`, `PozycjeBos`) — wydruk niczego nie liczy po swojemu.
- **Pola (opcjonalne, w szkicu autosave):** „Dla (klient lub obiekt)”, „Wykonawca lub sprzedawca”, „Uwagi do zestawienia”. Puste = linia albo sekcja nie pojawia się. Nic nie jest wypełniane z góry. Dane zostają w przeglądarce (jak cały szkic).
- **Mechanizm druku:** kartka jest renderowana dwa razy — podglądem w zakładce i w portalu `.druk-root` w `<body>`; przy otwartej zakładce `<body>` ma klasę `druk-oferty`, a reguła `@media print` w `globals.css` ukrywa wszystko poza `.druk-root` (bez pustych stron). Kartka ma zawsze białe tło i ciemny tekst, niezależnie od motywu aplikacji.
- **Zastrzeżenie na wydruku:** szacunki z typowego roku pogodowego i kart katalogowych; nie projekt instalacji, nie oferta handlowa, nie gwarancja uzysku; ceny osprzętu orientacyjne.
- **Czego nie ma:** logo i dane firmy, numeracji ofert, warunków handlowych i VAT-u montażu (to dokument handlowy, a aplikacja nie jest systemem ofertowania); wersja „A/B/C” (ekonomiczny, zimowy, premium) — osobny krok. Poprawka: założenie `PORP-ZAL-BEZ-BOS` mówi teraz, że koszty dodatkowe nie wchodzą do okresu zwrotu i kosztu kWh, a orientacyjny osprzęt jest w zakładce „Falownik i osprzęt”.

## 29. Oferta: dane firmy, logo, wersje A/B/C, napisy reklamowe i ślad wersji (09.10.2026)

Rozszerzenie wydruku z sekcji 28 na prośbę właściciela („dane własne, firmowe i logo”, „wersje A, B, C”, „napis: wykonano w programie Inżynier Offgrid, kilka razy”, „wersja oprogramowania, żeby można było prześledzić, czy obliczenia były w starej wersji”). Silnik obliczeń bez zmian.
- **Dane firmy i logo** (`lib/firma/`, `components/firma/edytor-profilu-firmy.tsx`): nazwa, adres, NIP, telefon, e-mail, strona i logo. Zapis jako osobny szkic `profil-firmy` (autosave, tylko to urządzenie, nic nie jest wysyłane), więc wpisuje się raz i działa na każdym wydruku, także z innych porównań. Puste pola nie pojawiają się. Logo: PNG, JPG, WebP lub SVG do 3 MB, w przeglądarce zmniejszane na płótnie do 480×240 px (bez powiększania) i zapisywane jako PNG; błędy typu, rozmiaru i odczytu mają komunikaty. Pole „Wykonawca lub sprzedawca” zostaje jako osobna linia (np. osoba przygotowująca).
- **Wersje A/B/C** (`lib/porownywarka-paneli/oferta.ts`): każda wersja to jeden z porównywanych paneli z opcjonalną krótką nazwą („ekonomiczna”, „na zimę”) i jedna może być oznaczona jako „zalecana”. Litery są stałe (pusty slot A nie przesuwa B i C), ten sam panel nie powtarza się, panel usunięty z porównania znika z wydruku. Dopóki użytkownik niczego nie zmieni, A, B i C to trzy pierwsze panele. To wyłącznie wybór, co drukować: aplikacja nie rekomenduje wersji sama, zalecenie jest decyzją użytkownika. Kolumny tabeli i sekcje falownika/osprzętu idą w kolejności wersji; bez wersji przycisk druku jest wyłączony.
- **Napisy „Wykonano w programie Inżynier Offgrid”:** cztery miejsca na kartce — plakietka u góry, zdanie pod tabelą porównania, ramka „Policz własne porównanie w programie Inżynier Offgrid” na końcu oraz stopka powtarzana na każdej stronie wydruku (stopka jest `<tfoot>` tabeli otaczającej kartkę, więc przeglądarka powtarza ją na każdej stronie i rezerwuje na nią miejsce). Bez adresu internetowego, bo adres wdrożenia nie jest ustalony (nie wymyślamy go); do dopisania, gdy będzie.
- **Ślad wersji** (sekcja „Wersja obliczeń i danych” + stopka): wersja programu z `package.json` i skrócony hash commita (`next.config.mjs` wpisuje je w `NEXT_PUBLIC_APP_VERSION` i `NEXT_PUBLIC_BUILD_ID`; hash z `VERCEL_GIT_COMMIT_SHA`/`GITHUB_SHA`, a bez nich z gita; puste, gdy brak), wersja silnika porównania (`CALCULATOR_VERSION`), data pobrania danych pogodowych, data odczytu danych wybranego urządzenia i data cennika osprzętu (tylko gdy pozycje są na kartce). Zasada utrzymania: zmiana reguł obliczeń wymaga podniesienia `CALCULATOR_VERSION`; logika A3/A4 (osobne moduły) nie ma jeszcze własnej wersji, a hash commita ją pokrywa.
- **Czego nie ma:** numeracji ofert, warunków handlowych, VAT-u montażu, adresu aplikacji w napisach, ceny urządzenia z katalogu (brak w katalogu).

## 30. Osprzęt w okresie zwrotu i koszcie zimowej kWh — włącznik (09.10.2026)

Na prośbę właściciela (pytanie „czy osprzęt powinien wchodzić do wyniku” → „niech będzie ten włącznik”). W zakładce „Opłacalność” pole „Wlicz urządzenie i osprzęt do ceny”, domyślnie wyłączone (stan `zwrotZOsprzetem`, starsze szkice go nie mają).
- **Co się liczy** (`lib/porownywarka-paneli/zwrot-z-osprzetem.ts`): cena paneli + cena urządzeń (tylko gdy wpisano; katalog cen nie ma) + osprzęt z zakładki „Falownik i osprzęt” (zakres min–max z cennika, z wyłączonymi pozycjami i własnymi cenami). Dla mikroinwertera tylko cena urządzeń (osprzętu DC nie wyceniamy).
- **Jak:** silnik wycenia same panele, więc okres zwrotu (= cena / wartość roczna) i koszt zimowej kWh (= cena / zimowa energia z 25 lat) są skalowane przez (cena + dodatek) / cena. To dokładne, bo mianowniki nie zależą od ceny; nie dotykamy `calculator.ts`. Wynik to zakres od ceny minimalnej do maksymalnej (jedna liczba, gdy końce są równe po zaokrągleniu). Dodatkowy wiersz „Cena z urządzeniem i osprzętem”.
- **Czego nie zmienia:** gwiazdki, ranking, zdanie-wniosek i scenariusz „tańszy panel = więcej paneli” nadal liczą od ceny samych paneli (nota na ekranie to mówi). Montaż i podłączenie nie są wliczone.
- **Przypadki brzegowe:** brak wybranego urządzenia → komunikat i liczby bez osprzętu; panel bez ceny albo bez układu mieszczącego się w limitach → „brak danych” z notą; pozycja osprzętu bez ilości (np. brak długości trasy kabla) → nota „suma niepełna”.
- **Spójność:** założenie „Koszty dodatkowe nie wchodzą do wyniku” jest podmieniane na `PORP-ZAL-Z-BOS` w zakładce „Założenia” i na wydruku oferty, gdy włącznik działa. Wydruk oferty używa tych samych wierszy co ekran (też „Cena z urządzeniem i osprzętem”).

## 31. Tryb prosty dla początkujących (09.10.2026)

Na prośbę właściciela („tryb dla laików”: trzy pytania i jedna rekomendacja po ludzku). Przełącznik „Prosty / Pełny” pod danymi nasłonecznienia; oba tryby edytują ten sam szkic, więc przełączanie niczego nie gubi.
- **Trzy pytania** (`components/porownywarka-paneli/tryb-prosty.tsx`): (1) gdzie staną panele — powierzchnia z projektu (jeśli jest), **strona świata** (osiem kierunków co 45°, `strona-swiata.ts`; to czysta zamiana na azymut, północ 0°, południe 180°; azymut spoza ośmiu kierunków jest pokazany jako „Własny azymut: X°” i nigdy zaokrąglany), nachylenie i liczba paneli, a pod spodem ta sama notatka o zużyciu co w trybie pełnym; (2) które panele — wybór z katalogu i cena (do czterech paneli); panel spoza katalogu wymaga danych z karty, więc ekran odsyła do trybu pełnego; (3) ile płacisz za prąd — jedna stawka z sieci (wycena „sieć”); inny rodzaj wyceny ustawiony w trybie pełnym jest tylko wskazany, nie nadpisywany.
- **Rekomendacja** (`lib/core/modules/pv/porownywarka-paneli/werdykt-prosty.ts`, tabela decyzyjna na liczbach, które silnik już daje; żadnych nowych współczynników ani wag): zima (XI–II) prowadzi, bo w off-gridzie ona decyduje (filozofia aplikacji). Reguły: (a) ten sam panel ma najwięcej energii zimą i najtańszą zimową kWh → „wybierz go”; (b) lider zimy nie jest najtańszy za zimową kWh → **kompromis**, bez wskazywania zwycięzcy: oba panele nazwane, decyzja po stronie użytkownika; (c) brak cen (albo cena tylko jednego panelu) → lider zimy na samej zimie; (d) remis zimowy (różnica lidera i drugiego poniżej 0,5% energii słabszego, czyli to, co ekran zaokrągla do 0%) → rozstrzyga najtańsza zimowa kWh, ale tylko **wśród paneli w remisie** (mocno słabszy, a tani panel nie jest polecany); remis bez cen → „nic ich nie rozdziela, wpisz ceny”. Pod rekomendacją uzasadnienie: różnica zimowa w kWh i procentach, wartość w zł (przy podanej cenie kWh), koszt zimowej kWh każdego panelu i scenariusz „więcej tańszych paneli”, jeśli istnieje. Zastrzeżenie, że to model, nie gwarancja.
- **Domyślny tryb:** pusty formularz startuje w trybie prostym; szkic, który już ma dane (panel, miejsce), zostaje w pełnym. Decyzja jest zapisywana w szkicu (`tryb`) przy pierwszym renderze, bo bez tego tryb przeskakiwałby po wpisaniu pierwszej liczby (błąd złapany w teście przeglądarkowym).
- **Czego tryb prosty nie pokazuje:** zakładek (miesiące, opłacalność, elektryka, falownik, oferta, więcej paneli, nadwyżka, miejsca, gwiazdki, założenia), zapisanych zestawów, rankingu katalogu, ręcznych danych panelu, wymiarów miejsca i okna odstępu. Ostrzeżenia o napięciach stringów (`PORP-ELEKTRYKA-*`) są ukryte, bo odsyłają do zakładki „Elektryka”; reszta ostrzeżeń i wykluczone panele są widoczne. Założenia obliczeń są pod „Jak to policzono”.

## 32. Obciążenie śniegiem i wiatrem a nośność paneli — porównanie z Eurokodem (09.10.2026)

Zakładka „Obciążenia” (po „Elektryka”) zestawia obciążenie, jakie w miejscu daje śnieg i wiatr wg Eurokodu, z maksymalnym obciążeniem mechanicznym panelu z karty (spec 10; odroczone z A3). Silnik: `lib/core/modules/pv/porownywarka-paneli/obciazenia.ts`; dane Eurokodu w istniejących plikach (`eurokod-1/snieg.ts`, `eurokod-1/wiatr.ts`) i nowym `eurokod-0/kombinacje.ts`; nośności z kart: `lib/core/dane/katalog-paneli-pv/obciazenia.ts`.
- **Wejście (od użytkownika, bez wartości domyślnych poza ekspozycją):** strefa śniegowa 1–5, strefa wiatrowa 1–3, wysokość n.p.m. (podpowiedź z danych pogodowych tylko jako placeholder), kategoria terenu, wysokość górnej krawędzi paneli nad gruntem, otoczenie pod kątem zwiewania śniegu (domyślnie „normalny”, Ce = 1,0 — jak w M7/E23). Aplikacja nie wyznacza stref z mapy (rysunki NB.1 i NA.1 w załącznikach krajowych).
- **Śnieg** (PN-EN 1991-1-3 + NB): s = μ1·Ce·Ct·s_k, μ1 z Tablicy 5.2 dla kąta paneli jak dla dachu bez przeszkód zatrzymujących śnieg, Ct = 1,0. Obciążenie działa pionowo na rzut poziomy, więc **prostopadle do panelu liczę s·cos²α** (geometria, nie współczynnik z normy). Zaspy, nawisy i lód nie są liczone.
- **Wiatr** (PN-EN 1991-1-4 + NA): q_p = c_e(z)·q_b (cdir = cseason = 1, jak w E9). **Tylko panele pochylone na konstrukcji 0–30°**, potraktowane jak wiata jednospadowa (Tablica 7.6) — założenie, które właściciel zaakceptował dla stelaży 25.09.2026. Do panelu (element pokrycia) używam **lokalnych współczynników cp,net** (7.3 (5)): „środek” = pole A, „krawędź i narożnik” = gorsze z pól B i C; dopisane do `wiatr.ts` z tablicy zweryfikowanej wizualnie ze skanem. Między węzłami co 5° biorę gorszy z dwóch sąsiednich (jak istniejące `cfOdrywaniaWiaty`), a współczynnik zabudowy pod konstrukcją φ — gorszy z 0 i 1 (nie wiemy, co jest pod spodem; wartości pośrednie są między skrajnymi). **Poprawka AC:2009** (α = 10°, pole A, φ = 1: −2,1 → −1,6) jest zastosowana; skan jej nie ma. Panele równoległe do połaci lub ściany i kąty > 30° — wiatr poza zakresem (inne tablice normy: 7.3a/b, 7.4); ekran mówi to wprost i pokazuje tylko śnieg.
- **Kombinacja** (PN-EN 1990, wzór 6.10, stan STR, zalecane γ — NB nie zmienia): γG = 1,35 dla ciężaru własnego panelu (bez stelaża; z masy i wymiarów karty, a gdy ich brak — pominięty), γQ = 1,5, ψ0 wiatru 0,6, ψ0 śniegu 0,5 (0,7 powyżej 1000 m n.p.m.). Docisk: większy z dwóch przypadków (śnieg wiodący z ψ0 wiatru, wiatr wiodący z ψ0 śniegu); odrywanie: sam wiatr, bez korzystnego ciężaru panelu. NB zaleca mniej korzystne z (6.10a)/(6.10b); wzór (6.10) nie jest od nich korzystniejszy, więc wynik jest po bezpiecznej stronie.
- **Nośność z karty:** `ObciazeniePaneluKarta` (przód, tył, opcjonalnie niższy wiatr z przodu, rodzaj „testowe”/„obliczeniowe”). Liczby przepisane z kart (test sprawdza, że każda występuje w transkrypcji karty; do transkrypcji JAM60D41 LB i nowszej Trina 450–475 W dopisałem wiersze odczytane z obrazu karty). Wpisy z kart innej edycji/rynku (Jinko 590–600 W EN, 72HL4 CN) i panele ręczne bez wpisu → `null`, nigdy liczba „z serii”. **Obliczeniowa = testowa ÷ 1,5** (IEC 61215); podstawą jest karta JA Solar JAM54D40 LR (3600/1600 Pa „współczynnik bezpieczeństwa 1,5”, czyli 5400/2400 Pa testowe). Dla pozostałych kart to **założenie** (`PORP-ZAL-OBC-NOSNOSC`), bo nie mówią wprost, że liczba jest testowa — do potwierdzenia z producentem. Trina: okładka podaje „śnieg do 5400 Pa, wiatr do 4000 Pa” → przód 5400, wiatr 4000 w obu kierunkach.
- **Ostrzeżenia:** `PORP-OBC-PRZEKROCZONE` poziom 🟡 (nie 🔴: nośność opiera się na założeniu ÷ 1,5, a spec 10 zakazuje nowych 🔴; **do decyzji właściciela, czy to ma być twardy stop**), `PORP-OBC-BRAK-NOSNOSCI` ℹ️. Wykorzystanie powyżej 100% = „PRZEKROCZONE”; progu „blisko nośności” nie ma, bo żadna norma go nie podaje.
- **Panel ręczny:** w rozwijanym bloku „Obciążenie mechaniczne z karty” (przód wymagany do oceny, tył opcjonalny, rodzaj wartości). Narzędzie AI `porownaj_panele` przyjmuje `obciazenie` panelu i `obciazenia` miejsca.
- **Czego nie robi:** nie sprawdza stelaża, zakotwienia ani dachu, nie liczy zasp, nawisów ani lodu, nie sprawdza punktów mocowania z instrukcji producenta (od nich zależy nośność panelu). To porównanie panelu z normą, nie projekt konstrukcji (nota na ekranie).

## 33. Odczyt karty katalogowej i naklejki ze zdjęcia lub PDF — Etap B (09.10.2026)

Zrealizowany Etap B z sekcji 13 (U22). Panel wpisywany ręcznie (bez wyboru z katalogu) ma blok „Wypełnij ze zdjęcia lub PDF karty (AI)”; widoczny tylko, gdy asystent AI jest dostępny (`isAiAvailable()`, degradacja po cichu, standard 9.0).
- **Przebieg:** (1) użytkownik wpisuje „o jaki panel chodzi” (producent, model, moc; wstępnie nazwa z formularza), (2) wybiera plik (JPEG, PNG, WebP lub PDF, do 3,5 MB; większe zdjęcie z telefonu jest zmniejszane w przeglądarce do 2400 px dłuższego boku, `lib/porownywarka-paneli/zmniejsz-obraz.ts`), (3) zaznacza **zgodę na wysłanie pliku do dostawcy AI** (przy każdym odczycie; serwer odrzuca żądanie bez zgody, 403), (4) po odczycie widzi podgląd pliku obok listy odczytanych pól, **zatwierdza każde pole osobno** (można poprawić wartość przed zatwierdzeniem; przycisk „Zatwierdź pola o wysokiej pewności” zaznacza tylko pola o pewności „wysoka” i bez uwagi spójności), (5) „Wpisz zatwierdzone do formularza” wpisuje tylko zatwierdzone pola; panel staje się ręcznym (`katalogId` puste), więc dane elektryczne i obciążenia biorą się z pól ręcznych. Niezatwierdzone i nieodczytane pola zostają w formularzu bez zmian.
- **Kształt odczytu** (`lib/core/modules/pv/porownywarka-paneli/odczyt-karty.ts`): każde pole ma `wartosc`, `widoczne` i `pewnosc` (wysoka / średnia / niska); pole nieobecne na dokumencie albo nieczytelne = `null`, niewidoczne. Pola: nazwa, Pmax, Voc, Vmp, Isc, Imp, β Voc, γ Pmax, NOCT, maks. napięcie układu, maks. bezpiecznik, długość, szerokość, masa, degradacja (pierwszy rok i liniowa), obciążenie z przodu i z tyłu, rodzaj obciążenia, bifacjalność. Plus: rozpoznany panel, zgodność z podpowiedzią (tak / nie / nie wiadomo), kolumna mocy, uwagi modelu. Naklejka podaje tylko dane w STC; resztę (γ, NOCT, obciążenia, wymiary) trzeba brać z karty katalogowej.
- **Kontrole spójności** (obowiązkowe wg sekcji 13; ostrzegają, niczego nie poprawiają): Vmp·Imp a Pmax w tej samej tolerancji 2% co w silniku (`ELEKTRYKA_ZGODNOSC_VMP_IMP_TOL`), Voc > Vmp, Isc > Imp, sprawność modułu z mocy i wymiarów w granicach 10–30% (granice zdrowego rozsądku wykrywające pomyłkę w cyfrze, **nie norma**), β i γ ujemne. Test kalibruje je na całym katalogu: każdy wpis z kart przechodzi bez uwag. Pola z uwagą i pola o niepewnym odczycie są wyróżnione słowem i znakiem (⚠), nie samym kolorem.
- **Wywołanie modelu** (`lib/ai/odczyt-karty/`, trasa `app/api/odczyt-karty/route.ts`): trasa POST (multipart) zamiast akcji serwerowej, bo akcje mają limit ciała 1 MB. Model dostaje plik i jedno narzędzie `zapisz_odczyt_karty` z **wymuszonym** `tool_choice`, więc tekst z obrazu nie może uruchomić niczego innego (standard 9.4); prompt mówi, że zawartość pliku to dane, nie polecenia, że nie wolno zgadywać, liczyć ani przeliczać jednostek, i że nie wolno orzekać o bezpieczeństwie ani zgodności (9.5). Podpowiedź użytkownika idzie jako cytowany tekst (JSON). Odpowiedź jest walidowana schematem (Zod); zły kształt = komunikat, nie wpis do formularza. Klucz API tylko po stronie serwera (18.5).
- **Limity** (9.6, 12.2; `lib/ai/odczyt-karty/limit.ts`): okno przesuwne w pamięci procesu, **10 odczytów na godzinę z jednego adresu i 200 na dobę w całej aplikacji** (wartości potwierdzone przez właściciela 10.10.2026). Aplikacja nie ma kont, więc to jedyny dostępny limit; przy kilku instancjach serwera każda liczy osobno. Wyczerpanie limitu nie jest ciche: komunikat z czasem ponowienia i podpowiedzią, by wpisać liczby ręcznie. Ten sam poziom zabezpieczeń ma dziś asystent czatowy (`pytajAsystenta`).
- **Czego nie robi:** nie zapisuje pliku (ani aplikacja, ani trasa), nie wypełnia pól, których nie ma na dokumencie (γ, NOCT zostają puste), nie deklaruje zgodności ani bezpieczeństwa, nie czyta kart wielostronicowych dłuższych niż limit pliku. **Do zrobienia przed publikacją:** funkcja AI „tylko PRO” (standard 12.9) wymaga kont i egzekwowania tieru po stronie serwera; budżet na użytkownika zamiast limitu na adres.
- **Testy (bez sieci):** schemat, wykonanie z wstrzykniętym klientem modelu (zapytanie wymusza jedyne narzędzie, podpowiedź cytowana, PDF jako dokument, odrzucenie pustego/złego typu/za dużego pliku, odmowa, zły kształt odpowiedzi), limiter ze sztucznym zegarem, trasa (brak klucza 503, brak zgody 403, brak pliku 400, za duży 413, zły typ 415, awaria dostawcy bez wycieku szczegółów, limit 429), kontrole spójności z kalibracją na katalogu, mapowanie zatwierdzonych pól na formularz. Przepływ sprawdzony w przeglądarce (desktop i 400 px) z atrapą API modelu pod `ANTHROPIC_BASE_URL`; na prawdziwym modelu nie sprawdzony (brak klucza w środowisku pracy).

## 34. Bilans godzinowy — energia z paneli, baterii i brak (Etap A5, 09.10.2026)

Zrealizowany Etap A5 (sekcja 8.3 i decyzja B z sekcji 21): zakładka „Bilans godzinowy” liczy godzina po godzinie roku TMY, ile energii z paneli zostaje zużyte od razu, ile przechodzi przez baterię, ile brakuje (sieć albo agregat) i ile produkcji nie mieści się w baterii. Silnik: `lib/core/modules/pv/porownywarka-paneli/bilans-godzinowy.ts` (`bilansGodzinowy`, `podsumujBilans`), godzinowa produkcja panelu z tego samego wzoru mocy co energia miesięczna (`mocRekorduW` w `uzysk.ts`, więc suma godzin = kWh miesięczne).
- **Wejścia:** zużycie miesięczne z istniejących ekranów (to samo co w „Nadwyżce”; bez zużycia zakładka odsyła do tych ekranów), **pojemność użyteczna baterii** (0 = bez baterii; przycisk „Użyj tej pojemności” bierze wynik ekranu „Dobór pojemności baterii” z profilu sprzętu, nic nie jest podstawiane po cichu) i opcjonalna **sprawność cyklu**.
- **Model (wszystkie uproszczenia są jawnymi założeniami wyniku):** (1) zużycie miesiąca rozłożone **równo na wszystkie godziny miesiąca** (`PORP-ZAL-BIL-PROFIL-PLASKI`) — aplikacja ma tylko zużycie miesięczne, profilu dobowego nie ma, a decyzja B zabrania pola „udział w strefie dziennej” w porównywarce; (2) w każdej godzinie najpierw zużycie bezpośrednio z paneli, nadwyżka ładuje baterię, brak pokrywa bateria, reszta to brak; (3) sprawność cyklu η stosowana **raz, przy ładowaniu** (jak w „Bilans miesięczny” sieci); bez podanej sprawności liczone 1 (`PORP-ZAL-BIL-CYKL-100`), z podaną `PORP-ZAL-BIL-CYKL`; (4) **bez limitów mocy** ładowania, rozładowania i falownika (`PORP-ZAL-BIL-BEZ-LIMITOW-MOCY`); (5) rok TMY liczony **dwa razy po sobie, pokazany drugi przebieg**, żeby stan baterii w styczniu pochodził z grudnia, nie z pustej baterii (`PORP-ZAL-BIL-DWA-PRZEBIEGI`).
- **Bilans zamknięty (test):** bezpośrednio + z baterii + brak = zużycie; produkcja = bezpośrednio + zmagazynowane/η + nie zmieściło się. Więcej baterii nigdy nie zwiększa braku.
- **Wycena braku (decyzja B):** brakująca energia wyceniana jak „energia brakująca” (stawka płaska, agregat albo strefy taryfy **według godziny braku**), tą samą funkcją co reszta porównywarki; bez wyceny kWh pokazane „bez wyceny”. Zima = XI–II jak wszędzie.
- **Wyniki per panel (zima i rok):** zużycie, pokrycie zużycia z paneli [%], zużyte od razu, z baterii, brak, nie zmieściło się w baterii, koszt braku, pełne cykle baterii w roku; rozwijana tabela braku po miesiącach; zdanie zestawiające energię wykorzystaną wg „Nadwyżki” z energią z bilansu godzinowego. Nie twierdzimy, że bilans miesięczny jest górną granicą: bez baterii jest (zużycie od razu ≤ miesięczne Σmin), ale z dużą baterią przenoszącą energię między miesiącami już nie musi.
- **Czego nie robi:** nie zastępuje „Opłacalności” ani „Nadwyżki” (tam nadal bilans miesięczny, opisany jako uproszczenie; podmiana założenia 7.2 na tę opcję czeka na decyzję — lista zadań), nie zna profilu dobowego zużycia, limitów mocy baterii/falownika ani starzenia baterii; służy do porównania paneli i baterii ze sobą, nie do wymiarowania instalacji.
- **Pozostałe:** narzędzie AI `porownaj_panele` przyjmuje `bilansGodzinowy {pojemnoscKwh, sprawnoscCyklu}` i zwraca wynik per panel; silnik porównywarki 1.2.0 → 1.3.0; 19 testów silnika (ręczne rachunki na dobach syntetycznych, bilans zamknięty, dwa przebiegi, strefy, walidacja) i test narzędzia. Sprawdzone w przeglądarce (desktop i 400 px, bez przepełnienia) na **syntetycznych** danych pogodowych, tylko do weryfikacji interfejsu.

## 35. Opisy producentów paneli — Etap C (10.10.2026)

Zrealizowany Etap C (sekcja 15, wymóg U8): zakładka „Producenci” pokazuje fakty o producentach paneli wybranych z katalogu (JA Solar, Jinko, LONGi, Trina, Astronergy, HD Hyundai). Dane: `lib/core/dane/producenci-paneli/index.ts`, ekran: `components/porownywarka-paneli/producenci.tsx`.
- **Zasada:** wyłącznie fakty z odczytanych stron, **każdy z odnośnikiem do źródła**, cały wpis ze statusem „do akceptacji właściciela” i datą odczytu źródeł (10.10.2026). Aplikacja niczego nie ocenia własnym osądem: „dobre panele” znaczy tylko „wymieniony na liście niezależnego testu”. **Bez automatycznych punktów** — kryterium „wiarygodność danych i producenta” zostaje bez oceny (kierunek `null`), opisy są tylko informacją (decyzja F: punktować można tylko fakty weryfikowalne; do czasu ich akceptacji punktów nie ma).
- **Rodzaje faktów:** rok i miejsce założenia, siedziba, giełda, wysyłki (wg Wikipedii), biura w Europie, lata na liście „Top Performer” raportu **Kiwa PVEL** (tabela producentów na scorecard.pvel.com), obecność w teście **RETC „PV Module Index” 2025**, hurtownia w Polsce z marką w ofercie (strona hurtowni, **nie** potwierdzenie autoryzacji), artykuł sponsorowany o dystrybutorze (słabsze źródło, z datą), „strona producenta nie wymienia Polski” (brak wzmianki to nie dowód braku obecności).
- **Jawne braki:** rok założenia Astronergy nie został ustalony (Wikipedia podaje 1984 dla grupy, nie marki); JA Solar — źródło podaje sprzeczne siedziby, więc żadnej nie podajemy; HD Hyundai — strona sprzedawcy twierdzi, że marka jest „Top Performer” Kiwa PVEL, ale tabela PVEL jej nie wymienia (sprzeczność pokazana wprost, do wyjaśnienia). **Nie sprawdzano:** certyfikatów (IEC, TÜV), serwisu i gwarancji w Polsce, oficjalnych dystrybutorów w Polsce — zdanie o tym jest pod każdym zestawem opisów.
- **Pułapki:** (1) odczyt tabeli PVEL zrobiony narzędziem do odczytu stron (znaczniki ✓ w kolumnach lat), więc przed publikacją warto otworzyć stronę i sprawdzić lata; (2) Wikipedia jest źródłem informacji ogólnych (rok, giełda), nie testów; (3) panel wpisany ręcznie albo odczytany ze zdjęcia nie ma opisu producenta (opisy są tylko dla producentów katalogu).
- **Testy:** każdy producent katalogu ma opis i odwrotnie; każdy fakt ma adres https i tytuł źródła; data przeglądu to data ISO nie z przyszłości; lata PVEL rosnące, bez powtórzeń, z zakresu 2014–2026; brak roku założenia jest jawny; zapis lat jako zakresy. Silnik porównywarki bez zmian (1.3.0).

## 36. „Ile paneli pokryje zimę” — dobór liczby paneli w bilansie godzinowym (10.10.2026)

Rozszerzenie zakładki „Bilans godzinowy” (sekcja 34), wersja 3.6.0, silnik porównywarki 1.3.0 → 1.4.0. Użytkownik wpisuje **cel**: jaką część swojego zużycia z listopada–lutego mają pokryć panele (pole opcjonalne, bez wartości domyślnej — to jego decyzja, nie norma). Dla każdego panelu ekran podaje dwie liczby:
- **„w sumie”** — najmniejsza liczba paneli, przy której energia zimą ≥ cel · zużycie zimą; sama suma, bez dopasowania godzin, więc **zbyt optymistyczna** (ekran tak ją opisuje);
- **godzina po godzinie** — najmniejsza liczba paneli, przy której bilans godzinowy z baterią wpisaną w tej samej zakładce osiąga cel (bisekcja; pokrycie zimy rośnie z liczbą paneli, bo większa produkcja nigdy go nie obniża). Granica **200 paneli** (`MAKS_PANELI_W_DOBORZE`): powyżej cel uznajemy za **nieosiągalny** i pokazujemy, ile najwyżej da się uzyskać przy 200 panelach („nawet 200 paneli daje X%”).
- **Najważniejsza lekcja dla użytkownika:** bez baterii pokrycie zimą jest ograniczone godzinami słońca — cel bliski 100% jest nieosiągalny niezależnie od liczby paneli, a „w sumie” by tego nie pokazało. Dlatego obie liczby stoją obok siebie.
- **Założenie** `PORP-ZAL-DOBOR-ZIMY` w wyniku; walidacja celu (0–100] % (`PORP-CEL-ZIMY-POZA-ZAKRESEM`); pole z pomocą „?” (`bilCel`); narzędzie AI przyjmuje `celZimyPct` i zwraca `doborNaZime` (cel podaje tylko użytkownik). Dobór **nie zależy** od liczby paneli wpisanej w formularzu (test).
- **Czego nie robi:** nie sprawdza, czy tyle paneli zmieści się w miejscu (to robi pakowanie z wymiarów), nie liczy kosztu zestawu, nie zna profilu dobowego zużycia ani limitów mocy (jak sekcja 34).
- **Testy:** ręczny rachunek na dobach syntetycznych (cel 50% bez baterii i z baterią 10 kWh, cele nieosiągalne z maksimum 4/24 i 14/24, panel bez energii zimą), integracja z silnikiem (n spełnia cel, n−1 nie; wynik niezależny od wpisanej liczby paneli; „w sumie” ≤ godzinowo; cel poza zakresem → INVALID_INPUT) i narzędzie AI.
- **Aktualizacja 3.7.0 (10.10.2026, decyzja właściciela „Ok”): limit 200 paneli zdjęty.** Był moim arbitralnym bezpiecznikiem, nie fizyką. Dobór bisekcją po liczbie paneli bez sztywnej górnej granicy (zastępuje ją fizyczne maksimum: pokrycie przy dowolnie wielu panelach, obliczane z mnożnikiem produkcji 10⁹). Cel powyżej tego maksimum jest nieosiągalny, a maksimum jest podawane wprost. Gdy znamy wymiary miejsca: `miejsceNaPaneli`, `pokrycieNaMiejscuPct`, `miesciSieNaMiejscu` — porównanie, nie obcinanie wyniku. Założenie `PORP-ZAL-DOBOR-ZIMY` przeredagowane (brak limitu, noc przy baterii 0). Silnik 1.5.0. Testy: ręczny rachunek przy zużyciu 1000 kWh/godz. (cel 10% = 600 paneli, cel 30% nieosiągalny z maksimum 4/24), miejsce znane i nieznane, przejście miejsca z pakowania wymiarów.

## 37. Zima z ociepleniem budynku — prosta wersja podstawowa i import ze Szkieletowego (PROJEKT, 10.10.2026; kod jeszcze nie powstał)

**Status:** specyfikacja do akceptacji właściciela, bez kodu. Decyzje właściciela (10.10.2026): (1) metodykę przejmujemy z „Inżynier Szkieletowy Pro” (tam gotowa i sprawdzona), nie wymyślamy własnej; (2) w Offgrid jest **prosta wersja podstawowa** wpisywana ręcznie (klienci budujący dom liczą w Szkieletowym i dopiero potem przechodzą do Offgrid); (3) **docelowo** dokładne obliczenia pod konkretny budynek przez **import danych budynku** ze Szkieletowego. Zastrzeżenie widoczne w UI: **nie liczymy mostków cieplnych ani szczegółów węzłów** — to robi Szkieletowy.

### 37.1 Co przejmujemy ze Szkieletowego (odczyt repo `inzynier-szkieletowy-pro`, 10.10.2026)
- **U przegrody:** `U = 1 / (Rsi + Σ(d_j/λ_j) + Rse)`, d w metrach (źródło: `lib/warstwy-przegrod.ts`, `obliczUDokladne`). Opory przejmowania wg PN-EN ISO 6946:2017 Tablica 7 (w Szkieletowym zweryfikowana wizualnie na stronie 21 skanu): strumień w górę (dach) Rsi 0,10; poziomo (ściana) 0,13; w dół (podłoga) 0,17; Rse = 0,04 dla wszystkich. To zamyka naszą otwartą sprawę „Rsi per kierunek strumienia” (do tej pory 0,13 dla wszystkich); wartości są z normy, więc nie są zgadywane.
- **Bilans roczny** (`lib/modules/lambda/oblicz.ts`, `obliczBilans`): `Qtr = ΣU·A · HDD · 24 / 1000` [kWh/rok]; `Qve = V · 0,34 · n · (1 − ηrek) · HDD · 24 / 1000`; `Qstraty = Qtr + Qve`. Stopniodni HDD w definicji A: Σ(20 − θdobowa) dla θdobowa < 15 °C (zgodna z założeniem temperatury wewnętrznej 20 °C). Zyski bytowe 250 W × 220 dni sezonu × współczynnik wykorzystania 0,9 — **założenia, nie norma** (Szkieletowy oznacza je jawnie jako 🔎); w Offgrid mają być widoczne jako założenia do zmiany, nie ukryte stałe.
- **Czego nie przejmujemy:** mostków słupków/legarów (ISO 6946 §6.7.2 + Zał. F), zysków słonecznych (w Szkieletowym też niezaimplementowane), Glasera/punktu rosy, klasyfikacji EP/Zero/Plus.

### 37.2 Dane od użytkownika (prosta wersja)
Powierzchnia i wysokość (kubatura ogrzewana), temperatura wewnątrz (domyślnie 20 °C jak w Szkieletowym; zmiana jawnie); dla ściany, dachu i podłogi: warstwy (materiał, grubość) **albo** gotowe U; okna i drzwi: powierzchnia i U; krotność wymiany powietrza n (domyślnie 0,5 jak w Szkieletowym) i sprawność rekuperacji; źródło ciepła (prąd bezpośrednio η = 1, pompa ciepła z COP, inne z jawną sprawnością) i zapas paliwa (do „na ile wystarczy”). Materiały: lista z λ **z Szkieletowego** (`lib/warstwy-przegrod.ts`) wraz z jej statusem „orientacyjne, 🔎 do weryfikacji” — w Offgrid pokazujemy ten status, nie podajemy λ jako pewnika; użytkownik może wpisać λ z karty produktu.
- Stopniodni i temperatury miesięczne: ze **wspólnej paczki środowiskowej** (`dane-srodowiskowe`, standard 19.13), patrz 37.4 pkt 1.

### 37.3 Wynik i spięcie z bilansem zimy PV
Miesięczne zapotrzebowanie na ciepło → zapotrzebowanie na prąd (przez COP/sprawność źródła) → dodane do zużycia zimowego, z którego liczy się pokrycie godzinowe (sekcje 34 i 36). Do „na ile wystarczy”: zapas paliwa ÷ miesięczne zużycie. Silnik: reużyć `lib/core/modules/ogrzewanie/obciazenie-cieplne` (Σ U·A·ΔT + wentylacja) i dołożyć wejście „z warstw”; uzgodnić z Szkieletowym wynik na tym samym budynku testem krzyżowym (te same dane → ten sam Qtr/Qve do tolerancji zaokrągleń).

### 37.4 Pytania otwarte do właściciela
1. **Źródło klimatu — ROZSTRZYGNIĘTE i skorygowane (właściciel, 10.10.2026 wieczorem):** dane pogodowe są **te same w Szkieletowym i w Offgrid**, więc Offgrid nie używa ani własnych, ani danych ze Szkieletowego, tylko **wspólnej paczki środowiskowej** z repo `dane-srodowiskowe` (standard 19.13: aplikacje pobierają wyłącznie plik `srodowisko-<wersja>.json` z wydania tego repo, z przypiętą wersją i sumą kontrolną, nikt nie czyta `dane/` bezpośrednio). Paczka zawiera już stopniodnie roczne w dwóch definicjach (`hdd20_15` — wariant A, `hdd18_15` — wariant B) dla stacji i źródeł oraz klimat miesięczny, więc HDD i temperatury miesięczne do tej funkcji biorą się stamtąd. Wcześniejsze rozstrzygnięcie „liczymy z własnego TMY” **zastąpione** tym zapisem. **Warunek wstępny:** Offgrid nie ma jeszcze integracji z paczką (sprawdzone 10.10.2026: brak w kodzie i dokumentach) — to osobne zadanie na liście; dopóki go nie ma, funkcja może przyjmować stopniodnie wpisane ręcznie z jawnym oznaczeniem. **Pytanie otwarte:** godzinowy TMY używany dziś w bilansie PV (sekcje 34 i 36) nie jest w paczce („bez danych godzinowych”) — zostaje jak jest, dopóki wspólna baza nie dostanie danych godzinowych. Skutek dla testu krzyżowego: te same stopniodnie z tej samej wersji paczki w obu aplikacjach.
2. **Zyski bytowe — ROZSTRZYGNIĘTE (właściciel, 10.10.2026):** liczymy tak jak w Szkieletowym (250 W × 220 dni sezonu × współczynnik wykorzystania 0,9), jako widoczne założenie; właściciel wróci do tego „na trzeźwo”, gdy będzie gotowa wspólna baza pogodowa.
3. **Format importu (standard 18.15) — właściciel prosi o listę potrzebnych danych, patrz 37.6:** plik JSON z wersjonowanym schematem, wyłącznie dane wejściowe budynku (warstwy, geometria, otwory, lokalizacja, n, ηrek), nigdy wyniki; import to jednorazowa kopia, nie synchronizacja; Offgrid odmawia przy niezgodnej wersji schematu. **Eksport musi powstać po stronie Szkieletowego** (nie mam tam praw zapisu) — to osobne zadanie w tamtym repo. Do uzgodnienia: schemat pliku.

### 37.5 Czego ta funkcja nie zrobi
Mostków cieplnych, zysków słonecznych, Glasera, doboru źródła ciepła na moc szczytową (to osobny moduł obciążenia cieplnego), szczegółów węzłów. W UI i w narzędziu AI: jawne zastrzeżenie, że wynik jest uproszczony, a dokładny wymaga Inżyniera Szkieletowego Pro.

### 37.6 Dane potrzebne do importu budynku (szkic schematu v1, do uzgodnienia ze Szkieletowym)
Plik JSON, `schemat: "budynek-szkieletowy"`, `wersjaSchematu: 1`, **wyłącznie dane wejściowe** (nigdy wyniki), jednorazowa kopia. Lista wynika z tego, co liczy bilans Szkieletowego (`obliczBilans`), więc to minimum do powtórzenia jego Qtr i Qve:
1. **Geometria:** szerokość i długość budynku [m], wysokość ściany [m], kąt dachu [°], typ dachu (jedno-/dwuspadowy), liczba kondygnacji.
2. **Przegrody — ściana zewnętrzna, podłoga, dach:** dla każdej lista warstw od zewnątrz do wewnątrz: typ warstwy (konstrukcja, izolacja, membrana, pustka, wykończenie, pokrycie), materiał, grubość [mm], λ [W/(m·K)] (null dla pustek i membran), flaga „istnieje” oraz — dla warstwy izolacji w szkielecie — informacja o udziale drewna (do późniejszego użycia, jeśli kiedyś włączymy mostki; w wersji podstawowej ignorowana).
3. **Otwory (okna, drzwi):** powierzchnia otworu [m²] i U [W/(m²·K)] (null = nie wpisano; Szkieletowy w takim wypadku nie liczy straty przez otwór i zgłasza to — Offgrid zrobi to samo i pokaże ostrzeżenie).
4. **Wentylacja:** krotność wymiany powietrza n [1/h], sprawność rekuperacji ηrek [0–1].
5. **Lokalizacja:** współrzędne budynku (szerokość i długość geograficzna) — do wskazania klimatu w Offgrid; nazwa lokalizacji opisowo.
6. **Nagłówek:** nazwa projektu, data eksportu, wersja Szkieletowego, wersja schematu.
**Czego NIE przenosimy:** wyników obliczeń (U, Qtr, EUco), danych konstrukcyjnych (belki, krokwie, fundamenty), kosztów, dziennika. Przy niezgodnej wersji schematu Offgrid odmawia importu z czytelnym komunikatem. Pola U przegród liczy Offgrid z warstw (te same wzory i Rsi), więc plik nie niesie U — dzięki temu wynik w obu aplikacjach da się porównać testem krzyżowym.

### 37.7 Decyzja o formacie importu (właściciel, 10.10.2026, wariant C: „sumy teraz, wejścia potem”) i zakres „kamper/garaż”
- **Etap 1 — migawka sum (wyjątek od standardu 18.15, świadomy):** Szkieletowy eksportuje gotowe sumy, a Offgrid dolicza swój klimat (stopniodni z własnego TMY), zyski bytowe (jak w 37.4 pkt 2) i źródło ciepła. Plik `schemat: "budynek-sumy-strat"`, `wersjaSchematu: 1`: `htrWK` (przenikanie **z mostkami**, Σ U·A + straty mostków, W/K), `hveWK` (wentylacja po odzysku, W/K), `afM2` (powierzchnia użytkowa), `vM3` (kubatura ogrzewana), `tWewnetrznaC`, opcjonalnie rozbicie na przegrody do **wyświetlenia** (nazwa, A, U, udział mostków), współrzędne budynku, nazwa projektu, **data eksportu i wersja Szkieletowego**. W UI Offgrid: „Dane z Inżyniera Szkieletowego Pro, stan na <data>” i ostrzeżenie, że po zmianie projektu trzeba import powtórzyć; plik to migawka wyników, nie dane wejściowe. Konsekwencja: wyjątek od 18.15 zapisać w rejestrze decyzji projektu i zgłosić do `docs/wklad-do-standardu.md`.
- **Etap 2 — dane wejściowe (zgodne z 18.15):** lista z 37.6, gdy silnik mostków wg ISO 6946 (§6.7.2, Zał. F) w Szkieletowym będzie zweryfikowany wizualnie (dziś część wzorów oznaczona tam jako niezweryfikowana). Do tego czasu mostki przychodzą wyłącznie jako suma z Etapu 1.
- **Silnik podstawowy w Offgrid (wspólny z trybem mikroinstalacji):** przeniesione czyste funkcje: U z warstw (Rsi 0,10/0,13/0,17, Rse 0,04), Qtr = ΣU·A·HDD·24/1000, Qve = V·0,34·n·(1−ηrek)·HDD·24/1000; biblioteka materiałów i ścianek (ściany, izolacje, okna; **λ jako „orientacyjne, do weryfikacji”** — status przejęty ze Szkieletowego, nie wymyślany) z możliwością dodania własnych pozycji; obiekty: dom, **kamper, garaż, altana/ROD** (tryb mikroinstalacji, `docs/tryb-mikroinstalacji-specyfikacja.md`). Test krzyżowy na przykładach ze Szkieletowego (te same wpisane stopniodni → te same Qtr i Qve). UI i narzędzie AI: stały komunikat, że obliczenia są przybliżone, a dokładne wykonuje się w Inżynierze Szkieletowym Pro.
- **Otwarte:** (1) wspólna paczka kodu obu aplikacji zamiast kopii funkcji — większa decyzja architektoniczna, nie teraz; (2) schemat pliku Etapu 1 uzgodnić z sesją nad Szkieletowym (eksport robi tamta strona); (3) ~~czy kamper/garaż mają własny ekran bilansu ciepła, czy tylko wejście do bilansu zimy PV~~ — **rozstrzygnięte (właściciel, 10.10.2026): oba** (własny ekran bilansu ciepła obiektu i wejście do bilansu zimy PV). Integracja z paczką środowiskową i dane godzinowe — dopiero po gotowej bazie `dane-srodowiskowe` (do tego czasu stopniodnie wpisywane ręcznie z oznaczeniem).

## 38. Test „co, jeśli panel ma mniej mocy, niż deklaruje” (11.10.2026)

Zamyka punkt 4 z sekcji 18 (ryzyko paneli no-name: moc zaniżona względem naklejki). Wersja 3.10.0, silnik porównywarki 1.5.0 → 1.6.0.
- **Wejście:** jedno pole w zakładce „Opłacalność” — o ile % rzeczywista moc może być niższa od mocy z karty lub naklejki (0 < X < 100). **Bez wartości domyślnej** (nie znamy rozrzutu żadnego producenta, więc nie zgadujemy); puste pole = bez testu. Poza zakresem = błąd danych `PORP-ZANIZENIE-MOCY-POZA-ZAKRESEM`.
- **Wynik:** osobny scenariusz obok głównych wyników (główne liczby się nie zmieniają): moc zestawu, energia zimą i w roku, cena za Wp rzeczywistej mocy, koszt zimowej kWh i okres zwrotu — **przy tej samej cenie panelu**, więc kWh drożeje o 1/(1−X), a zwrot się wydłuża o ten sam czynnik.
- **Jak liczone:** uzysk silnika jest liniowy względem mocy w STC (temperatura ogniwa, sprawność przy słabym świetle i G_poa od niej nie zależą), więc scenariusz to skalowanie energii miesięcznej przez (1 − X/100) i ponowne przejście przez to samo podsumowanie (energia wykorzystana wobec zużycia, wycena, strefy taryfy). Test porównuje to z niezależnym przeliczeniem panelu o mocy pomniejszonej.
- **Czego nie robi:** nie dobiera X i nie ocenia, czy dany producent zaniża moc; nie przelicza bilansu godzinowego z baterią ani doboru liczby paneli na zimę dla zaniżonej mocy; nie zmienia gwiazdek.
- **Ekran:** `components/porownywarka-paneli/test-zanizenia-mocy.tsx`, pomoc „?” `zanizenieMocy`, teksty PL/EN/RU; narzędzie AI `porownaj_panele`: wejście `testZanizeniaMocyPct`, wynik `zanizenieMocy` per panel.

## 39. Profil dobowy zużycia w bilansie godzinowym (11.10.2026)

Zamyka punkt (a) z wpisu „dopracowanie bilansu godzinowego” (sekcja 34, założenie `PORP-ZAL-BIL-PROFIL-PLASKI`). Wersja 3.11.0, silnik porównywarki 1.6.0 → 1.7.0.
- **Wejście:** w zakładce „Bilans godzinowy” trzy opcjonalne pola — jaka część dobowego zużycia przypada na dzień (6–18), wieczór (18–22) i noc (22–6), godziny w czasie urzędowym Polski. **Bez wartości domyślnej** (żaden profil nie jest „typowy”): wszystkie trzy puste = zużycie rozłożone równo na dobę jak dotąd; wypełnione częściowo = profil nieużywany i ekran to mówi (nie dopełniamy zgadywaniem). Udziały nie muszą dawać 100, są przeliczane proporcjonalnie (ekran pokazuje sumę).
- **Silnik:** `profilDobowy` = 24 wagi godzinowe (udział pory rozłożony po równo na jej godziny), normalizowane do sumy 1; zużycie miesiąca dzielone na godziny doby wg profilu i na liczbę rekordów danej pary (miesiąc, godzina). Zużycie miesiąca się zachowuje (suma bez zmian), zmienia się tylko jego rozkład. Ten sam profil dla każdego dnia roku. Błąd danych: `PORP-PROFIL-DOBOWY-POZA-ZAKRESEM` (długość ≠ 24, wartość ujemna/nie-liczba, same zera).
- **Założenie** `PORP-ZAL-BIL-PROFIL-DOBOWY` zastępuje `…-PLASKI`, gdy profil jest użyty; mówi, że profil to oszacowanie użytkownika i że dni nietypowe będą inne.
- **Dobór paneli na zimę** (sekcja 36) używa tego samego profilu, bo przechodzi przez ten sam bilans.
- **Narzędzie AI** `porownaj_panele`: `bilansGodzinowy.profilDobowyPct` (`dzienPct`, `wieczorPct`, `nocPct`); same zera = błąd danych, nie ciche „równo na dobę”.
- **Czego nie robi:** nie zna profilu z listy odbiorników (te nie mają godzin doby), nie różnicuje dni tygodnia ani pór roku (np. inny profil w lecie), pory mają stałe granice; dokładniejszy profil godzinowy (24 pola) jest możliwy w silniku, ekran na razie go nie udostępnia.
- **Testy:** ręczne rachunki na dobach syntetycznych (zużycie tylko w godz. 10–13, tylko o godz. 0 bez baterii i z baterią 10 kWh), równoważność równych wag z brakiem profilu, niezależność od skali wag, zachowanie zużycia, rozkład udziałów na godziny w formularzu, walidacja, narzędzie AI.

## 40. Limity mocy baterii i falownika w bilansie godzinowym (11.10.2026)

Zamyka punkt (b) z wpisu „dopracowanie bilansu godzinowego” (sekcja 34, założenie `PORP-ZAL-BIL-BEZ-LIMITOW-MOCY`). Wersja 3.12.0, silnik porównywarki 1.7.0 → 1.8.0.
- **Wejście:** w zakładce „Bilans godzinowy” trzy opcjonalne pola [kW]: maks. moc ładowania baterii, maks. moc rozładowania baterii, moc ciągła falownika. **Bez wartości domyślnej** (nie znamy sprzętu użytkownika); puste pole = ta moc bez ograniczenia. Limity wpisujemy z kart katalogowych (moc ciągła, nie szczytowa). Błąd danych: `PORP-LIMIT-MOCY-POZA-ZAKRESEM` (limit ≤ 0 albo nie-liczba; zero nie znaczy „brak limitu” — brak limitu to puste pole).
- **Model (jedna godzina, rekord TMY = 1 h, więc kW ≡ kWh na rekord):** `obsłużone = min(zużycie, falownik)`; `bezpośrednio = min(produkcja, obsłużone)`; nadwyżka = produkcja − bezpośrednio; do baterii wchodzi `min(nadwyżka·η, wolne miejsce, limit ładowania)`, reszta nadwyżki jest odcięta; z baterii wychodzi `min(obsłużone − bezpośrednio, stan baterii, limit rozładowania)`; `brak = zużycie − bezpośrednio − z baterii`. Zachowana tożsamość: bezpośrednio + z baterii + brak = zużycie.
- **Co oznacza limit falownika:** to jedna moc dla odbiorów, wspólna dla paneli i baterii (falownik hybrydowy/off-grid). Układ z osobnym regulatorem ładowania i falownikiem wyłącznie na baterii wymaga dwóch limitów i nie jest tu odwzorowany; w takim układzie wpisz limit falownika odbiorów, a limit regulatora wpisz jako moc ładowania.
- **Założenie** `PORP-ZAL-BIL-LIMITY-MOCY` zastępuje `…-BEZ-LIMITOW-MOCY`, gdy wpisano którykolwiek limit; niewpisane limity zostają nieograniczone. Strat falownika i kabli bilans nadal nie liczy.
- **Dobór paneli na zimę** (sekcja 36) przechodzi przez ten sam bilans; z limitami maksimum osiągalne pokrycie może być niższe, a cel nieosiągalny przy dowolnej liczbie paneli.
- **Narzędzie AI** `porownaj_panele`: `bilansGodzinowy.limityMocyKw` (`ladowanieKw`, `rozladowanieKw`, `falownikKw`, każdy opcjonalny, > 0).
- **Czego nie robi:** nie liczy sprawności falownika i regulatora, spadku mocy z temperaturą ani z poziomem naładowania baterii, nie odróżnia mocy ciągłej od chwilowej (przeciążalności), nie wiąże limitów z katalogiem urządzeń (A4) — wpisuje je użytkownik.
- **Testy:** ręczne rachunki na dobach syntetycznych (limit ładowania, rozładowania, falownika bez baterii i z baterią), identyczność z wynikiem sprzed zmiany bez limitów, tożsamość bilansu, monotoniczność braku względem ostrości limitu, dobór paneli z limitem, walidacja, założenia, formularz, narzędzie AI.

## 41. Osprzęt w scenariuszu „tańszy panel = więcej paneli” (11.10.2026)

Zamyka punkt z sekcji 27 („scenariusz … NIE uwzględnia jeszcze osprzętu”) i punkt (7) listy zadań. Wersja 3.13.0, silnik porównywarki 1.8.0 → 1.9.0.
- **Włącznik i wejście:** ten sam przełącznik co w sekcji 30 („Wlicz urządzenie i osprzęt do ceny”, zakładka „Opłacalność”) plus wybrane urządzenie z zakładki „Falownik i osprzęt”. Formularz przekazuje silnikowi zwykłe dane (`osprzetScenariusza`: id urządzenia, napięcie akumulatora, cena urządzenia, trasa kabla, wyłączone pozycje i własne ceny osprzętu, kurs waluty, układy wybrane przez użytkownika) — bez funkcji w wejściu. Bez przełącznika albo bez urządzenia wejście jest puste i wynik scenariusza jest taki jak dotąd.
- **Wycena zestawu o n panelach** (`osprzet-zestawu.ts`, `wycenZestaw`/`kosztZestawuZOsprzetem`; ta sama funkcja liczy zakładkę „Falownik i osprzęt”): elektryka (A3) dla n paneli → układy stringów → układ wybrany przez użytkownika, jeśli mieści się w limitach urządzenia dla tego n, inaczej proponowany → liczba urządzeń i ilości osprzętu (kabel, MC4, bezpieczniki, rozłącznik, ogranicznik, konstrukcja) → cena paneli + urządzenia + osprzęt jako zakres min–max z cennika.
- **Wyszukanie liczby paneli:** dla każdego k = 1…(do 1000) liczymy cenę zestawu tańszego panelu o n+k sztukach; „mieści się”, gdy nie przekracza ceny zestawu droższego, osobno na dole zakresu (min z min) i na górze (max z max). Wybieramy największe takie k (cena nie jest monotoniczna w k: liczba pierwsza paneli ma tylko jeden układ, więc k=2 może nie mieścić się, a k=3 tak); liczby paneli, dla których żaden układ nie mieści się w limitach urządzenia, są pomijane. Wynik to `dodatkowePaneleMin` (ostrożnie: ceny z góry zakresu) i `dodatkowePaneleMax`. Energia i przewaga (kWh, zł) są liczone dla ostrożnej liczby, tą samą ścieżką co dotychczasowy scenariusz (najpierw wolne miejsce, reszta na ścianie południowej).
- **Dlaczego wyszukiwanie, a nie dzielenie:** dokupiona sztuka dokłada konstrukcję, MC4, zwykle kabel, a przy braku podzielnego układu albo przekroczeniu prądu wejścia także następne urządzenie; różnica cen paneli przez cenę sztuki zawyża liczbę paneli.
- **Ekran** (zakładka „Więcej paneli?”): pod dotychczasowym blokiem sekcja „Z urządzeniem i osprzętem” — ceny obu zestawów, liczba dodatkowych paneli (jedna liczba albo zakres), energia i przewaga; ostrzeżenie, gdy któraś pozycja osprzętu nie ma ilości (np. nie wpisano trasy kabla) i cena jest zaniżona. Gdy przełącznik jest wyłączony — podpowiedź, jak go włączyć; gdy włączony, a wyceny nie ma — lista, czego brakuje.
- **Założenie** `PORP-ZAL-SCENARIUSZ-Z-OSPRZETEM` (dodawane, gdy choć jeden scenariusz ma wariant z osprzętem); `PORP-ZAL-SCENARIUSZ-BEZ-BOS` zostaje, bo główne liczby nadal pochodzą z samych cen paneli. Błąd danych: `PORP-OSPRZET-SCENARIUSZA-POZA-ZAKRESEM` (kurs i napięcie > 0, ceny i trasa ≥ 0).
- **Czego nie robi:** nie wlicza montażu i podłączenia; nie szuka układu tańszego niż proponowany/wybrany; wariant z osprzętem nie zmienia gwiazdek, werdyktu prostego ani narzędzia AI (narzędzie `porownaj_panele` nie zwraca scenariuszy); nie wycenia mikroinwertera, do którego panel nie pasuje (np. GT-600 nie przyjmie panelu 500 W: wynik `null`, nie zgadnięta cena).
- **Testy:** ręczne rachunki cen zestawów (3, 4 i 5 paneli na Victronie 150/35 przy cenach osprzętu nadpisanych na okrągłe liczby), wyszukanie k z liczbą niemonotoniczną, energia dodatkowych paneli równa energii zestawu o tej liczbie, zakres cen z cennika, brak wyceny bez Tmin / danych elektrycznych / urządzenia, niezależność głównych liczb od osprzętu, walidacja.

## 42. Własny katalog z pliku CSV i eksport wyników do CSV (11.10.2026)

Zamyka punkt (2) listy zadań („własny katalog z importem CSV i eksport wyników do CSV”). Wersja 3.14.0, silnik bez zmian (1.9.0).
- **Import — format pliku:** pierwszy wiersz to nagłówki, kolejne to panele. Wymagane kolumny: `nazwa` i `moc_wp`. Opcjonalne: `producent` (doklejany do nazwy, jeśli nazwa się od niego nie zaczyna), `cena`, `wsp_temp_pmax_proc_na_c`, `noct_c`, `sprawnosc_wzgledna_200_proc`, `degradacja_1_rok_proc`, `degradacja_roczna_proc`, `dlugosc_mm`, `szerokosc_mm`, `masa_kg`, `bifacjalny` (tak/nie), `voc_v`, `vmp_v`, `isc_a`, `imp_a`, `beta_voc_proc_na_c`, `maks_napiecie_ukladu_v`, `maks_bezpiecznik_szeregowy_a`. Akceptowane są też krótsze i angielskie nazwy (np. `name`, `power`, `price`, `voc`); nagłówki porównywane bez wielkości liter, polskich znaków i znaków specjalnych. Nierozpoznana kolumna jest pomijana i wymieniona na ekranie.
- **Odczyt:** UTF-8 z BOM lub bez, CRLF lub LF, pola w cudzysłowie (separator, nowa linia i `""` w środku); separator (średnik, przecinek, tabulator) wykrywany z pierwszej linii; liczby z przecinkiem lub kropką dziesiętną, spacje ignorowane. Liczba z jednostką („500 W”) albo tekst w kolumnie liczbowej odrzuca wiersz. Limity: 1 MB i 500 wierszy.
- **Bez zgadywania:** pusta komórka = brak danych (jak puste pole w formularzu). Dane elektryczne są używane tylko w komplecie sześciu (Voc, Vmp, Isc, Imp, β Voc, maks. napięcie układu — reguła z sekcji 26); przy niekompletnych wiersz jest przyjęty z uwagą, że ocena stringów ich nie użyje. `bifacjalny` puste = nie.
- **Walidacja:** wiersz przechodzi przez `validateInput` silnika (te same kody co formularz: moc ≤ 0, ujemna cena, NOCT poniżej temperatury otoczenia NOCT, dodatnia β Voc itd.), więc import nie dodaje własnych reguł fizycznych. Wiersze odrzucone są wypisane z numerem wiersza (nagłówek = 1) i powodem; reszta pliku jest przyjmowana.
- **Zapis:** osobny szkic `porownywarka-wlasny-katalog` (autosave, tylko to urządzenie, nic nie jest wysyłane); „Dołącz” dopisuje do katalogu, „Zastąp” podmienia cały; pozycje można usuwać pojedynczo. Ceny z pliku są w walucie wyświetlania i przeliczają się razem z przełącznikiem waluty. Wybór do panelu porównania (`wstawZWlasnego`) kopiuje teksty pól do panelu z pustym `katalogId` (czyli dane elektryczne liczą się jako wpisane ręcznie), jak ręcznie wpisany panel spoza katalogu (sekcja 26).
- **Eksport:** w zakładce „Opłacalność” przycisk „Pobierz wyniki jako CSV”: jeden wiersz na panel, kolumny: nazwa, liczba sztuk, moc zestawu, masa, energia zimą i w roku, energia wykorzystana, nadwyżka, cena paneli, cena za Wp, koszt zimowej kWh, wartość roczna i zimowa, okres zwrotu, moc po 25 latach; przy włączonym przełączniku osprzętu dodatkowo cena z urządzeniem i osprzętem oraz okres zwrotu jako min i max. Liczby surowe (nie sformatowany tekst z jednostką), jednostka w nagłówku; brak danych = pusta komórka. Język pl i ru: średnik i przecinek dziesiętny, en: przecinek i kropka. UTF-8 z BOM (Excel poprawnie czyta polskie znaki). Tekst zaczynający się od `=`, `+`, `-`, `@`, tabulatora lub CR dostaje apostrof (ochrona przed wstrzyknięciem formuły z nazwy panelu).
- **Czego nie robi:** nie importuje obciążeń mechanicznych (Pa) ani odczytu ze zdjęć (to OCR, sekcja 33); nie łączy duplikatów (ta sama nazwa dwa razy to dwie pozycje); nie eksportuje bilansu godzinowego, scenariuszy ani założeń (tylko tabela wyniku); nie czyta XLSX.
- **Testy:** odczyt i zapis CSV (BOM, cudzysłowy, separatory, formuły), wzorzec pliku, poprawne i odrzucone wiersze z kodami silnika, dane elektryczne kompletne i niekompletne, limity pliku, identyfikatory katalogu, przeliczanie cen, eksport (liczby, język, brak danych, kolumny osprzętu).

## 43. Udostępnienie porównania linkiem lub plikiem (11.10.2026)

Zamyka punkt (4) listy zadań („udostępnienie porównania poza urządzeniem”). Wersja 3.15.0, silnik bez zmian (1.9.0).
- **Nośnik bez serwera i konta:** (a) link `…/porownywarka-paneli#udostepnij=<kod>` — porównanie jest w samym fragmencie adresu (fragment nie jest wysyłany do serwera), kod to `z.` + base64url(deflate-raw(JSON)), a gdy przeglądarka nie umie kompresji, `j.` + base64url(JSON); (b) plik `porownanie-paneli.json`. Link do ok. 8000 znaków; większe porównanie przycisk odmawia linku i odsyła do pliku.
- **Co jest w paczce:** formularz porównania (miejsca, panele z cenami, urządzenie i osprzęt, bilans, wycena, kryteria) plus waluta i kurs, w których wpisano kwoty. **Czego nie ma:** danych pogodowych, lokalizacji projektu, profilu firmy i logo, danych klienta i wersji oferty (`oferta*`), własnego katalogu CSV — odbiorca liczy wyniki dla własnej lokalizacji.
- **Odbiór (dane obce, nigdy nie ufane):** limit rozmiaru przed i po dekompresji (200 kB; bomba dekompresyjna zatrzymana w trakcie), parsowanie wyłącznie jako dane, odbudowa formularza pole po polu z jego szablonu (`oczyscStan`): nieznane klucze odrzucone, zły typ → puste pole, wyliczenia i identyfikatory katalogów (panele, urządzenia, osprzęt) sprawdzane, maks. 4 panele i 10 miejsc, identyfikatory unikalne i bezpieczne, teksty do 300 znaków. Zła wersja paczki, zła waluta i uszkodzony kod dają czytelny komunikat, nie wyjątek.
- **Nie nadpisuje pracy:** odebrane porównanie trafia jako NOWY zestaw do „Moich zestawów” dopiero po kliknięciu „Dodaj do moich zestawów” (przycisk czeka, aż zapisane zestawy się wczytają, bo wcześniejszy zapis zostałby nadpisany odczytem); formularza, nad którym pracujesz, nic nie rusza — zestaw wczytujesz osobno. Kwoty są przeliczane z waluty paczki na walutę odbiorcy tak jak przy zmianie waluty ekranu. Po obsłużeniu linku fragment jest usuwany z adresu.
- **Wejścia odbioru:** link otwarty w przeglądarce (także w trybie prostym — wtedy pojawia się blok zestawów), wklejony link lub kod, plik `.json`.
- **Czego nie robi:** nie synchronizuje zmian między osobami (każdy ma własną kopię), nie podpisuje ani nie szyfruje paczki (link zna każdy, kto go dostanie), nie udostępnia wyników liczbowych — tylko dane wejściowe.
- **Testy:** czyszczenie obcego stanu (typy, wyliczenia, katalogi, limity, id), pominięcie danych klienta, odczyt JSON (pusty, uszkodzony, obcy, za duży, zła wersja, zła waluta), przeliczenie kwot, kod linku w obie strony, kod uszkodzony/ucięty/za duży, bomba dekompresyjna, rozpoznanie kodu w pełnym linku.

## 44. Zima z ociepleniem budynku — okna i drzwi, odzysk z wentylacji, źródło ciepła i spięcie z bilansem zimy PV (11.10.2026)

Realizuje część sekcji 37 (prosta wersja podstawowa; import ze Szkieletowego nadal czeka na eksport po tamtej stronie). Wersja 3.16.0, silnik obciążenia cieplnego 1.1.0 → 1.2.0, silnik porównywarki bez zmian (1.9.0).
- **Okna i drzwi jako osobna sekcja** ekranu „Straty ciepła budynku”: wiersze z powierzchnią otworu i U (zawsze powietrze zewnętrzne); wiersz bez powierzchni i bez U jest pomijany, wiersz z jednym z nich czeka na dane (wynik niekompletny, nic nie jest zgadywane). Gdy nie wpisano żadnego otworu, ekran mówi, że wynik jest zaniżony. Szkice sprzed zmiany zachowują okna wpisane jako przegroda.
- **Wentylacja:** wymiany powietrza i nowe pole „odzysk ciepła z wentylacji [%]”: H_V · (1 − η/100), jak w Szkieletowym (`Qve = V·0,34·n·(1 − ηrek)`). Założenie jawne w wyniku: cała wpisana wymiana powietrza przechodzi przez rekuperator (część nieszczelności nim nie przechodzi — wtedy wpisuje się mniejszą wartość). Zakres 0–100, puste = bez odzysku.
- **Źródło ciepła:** „prąd” (COP: grzałka 1, pompa ciepła z karty) albo „paliwo”: jednostka, wartość opałowa [kWh/jedn.], sprawność [%] i zapas — wszystko od użytkownika, bez wartości domyślnych. Wynik: ciepło w zapasie (zapas · WO · η), zużycie na dobę obliczeniową, **dni, na które starczy przy mrozie obliczeniowym** (dolna granica) oraz — gdy wpisano temperatury 12 miesięcy — roczne zużycie paliwa, procent ciepła pokryty zapasem i niedobór.
- **Spięcie z bilansem zimy PV:** w Porównywarce paneli pole „Dolicz ogrzewanie elektryczne z ekranu Straty ciepła budynku” (domyślnie wyłączone, nie jest częścią udostępnianej paczki). Dodaje do miesięcznego zużycia prąd na ogrzewanie (ciepło ÷ COP, miesiąc po miesiącu), ale **tylko** gdy: źródło to prąd, jest COP, znane są temperatury wszystkich 12 miesięcy i istnieje zużycie bazowe (rachunki albo odbiorniki mikroinstalacji). Przy każdym innym stanie nic nie jest doliczane, a ekran podaje powód i link. Ostrzeżenie widoczne w UI: jeśli rachunki już obejmują ogrzewanie elektryczne, doliczenie liczyłoby je dwa razy. Ogrzewanie wchodzi w ten sam profil dobowy co reszta prądu (nie ma profilu godzinowego pracy ogrzewania).
- **Narzędzie AI** `policz_straty_ciepla_budynku`: nowe parametry `sprawnoscOdzyskuPct` i `paliwo`, nowe pola wyniku `odzyskWentylacjiPct` i `zapasPaliwa`.
- **Czego nie robi:** mostków cieplnych, zysków słonecznych i bytowych (ostrzeżenie `OC-BEZ-PN-EN-12831` bez zmian), biblioteki materiałów, importu ze Szkieletowego, doboru mocy źródła; ekran kampera/garażu/altany to osobny wpis (tryb mikroinstalacji).
- **Testy:** odzysk (hand-calc 50,25 → 10,05 W/K), walidacja zakresów, zapas paliwa (4000 kWh, 31,02 kg/dobę, ≈ 32,2 dnia, pokrycie roku i niedobór), mapowanie szkicu (otwory, pusty wiersz, stary szkic, paliwo ignoruje COP), ogrzewanie elektryczne miesiąc po miesiącu i powody braku.

## 45. Symulacja przy −20°C i −30°C — Moduł 7, Ekran 1 (11.10.2026)

Wersja 3.17.0. Nowy silnik `stress-test/symulacja-mrozu` 1.0.0, silnik obciążenia cieplnego 1.2.0 → 1.3.0 (nowe pola wyniku `hZewnetrznyWK` i `strataStalaW`), silnik porównywarki bez zmian (1.9.0). Źródło: `docs/zrodla/Tresc_Modul_7_StressTest_Ekrany.md`, Ekran 1 (dawne 6.1).
- **Wejście spięte z gotowymi ekranami, bez nowego modelu klimatu:** produkcja dobowa to suma godzinowego G_poa z TMY lokalizacji projektu (ten sam `profilNaslonecznienia` co Porównywarka) po dobach wybranego miesiąca × moc [kWp] × PR — kWp, PR, nachylenie i azymut wpisuje użytkownik; ciepło budynku z Ekranu 1 Modułu 6: `Q = max(0, H_zewn·(θi − θ) + Φ_stały)·24 h`, gdzie H_zewn = Σ U·A przegród zewnętrznych + H_V (po odzysku), a Φ_stały = strumień przez grunt i pomieszczenia nieogrzewane przy θi.
- **Bilans magazynu** to ten sam `dobowyDeficyt` co Ekran 2 (nadwyżka × sprawność ładuje do pojemności, niedobór dnia najpierw z magazynu, udział nocy opcjonalny) — jeden model bilansu w aplikacji.
- **Czego użytkownik wpisuje (bez wartości domyślnych):** miesiąc, kWp, PR, nachylenie, azymut, zużycie dobowe bez ogrzewania, pojemność i sprawność magazynu (sprawność wymagana przy pojemności), COP (ogólny lub per scenariusz; puste = z Ekranu 1), spadek pojemności baterii per scenariusz (z karty ogniwa; puste = brak spadku). Pola „dodatki” (korekta PV, dodatkowe zużycie, stan początkowy magazynu) puste = 0. Dwa scenariusze startowe (−20 i −30 °C) wynikają z nazwy ekranu; użytkownik może je zmienić lub dodać do 6.
- **Źródło ciepła na paliwo:** ciepło jest liczone, ale nie obciąża prądu (ostrzeżenie informacyjne); brak danych budynku → zużycie bez ogrzewania i ostrzeżenie, że deficyty są zaniżone; ogrzewanie elektryczne bez COP → wynik niekompletny.
- **Wynik:** per scenariusz — ciepło i prąd na dobę, zapotrzebowanie dobowe, pojemność efektywna, dni z deficytem, najdłuższa seria, pierwszy dzień deficytu, deficyt miesiąca, największy deficyt doby, pokrycie energetyczne bez agregatu, tabela dzień po dniu. Werdykt: żółty przy deficycie lub ostrzeżeniu, zielony gdy wszystkie scenariusze pokryte.
- **Czego nie robi:** szeregu temperatur dobowych (temperatura stała w miesiącu), zysków słonecznych i bytowych budynku, limitu mocy źródła ciepła, zmiany COP z temperaturą (COP z karty per scenariusz), automatycznej korekty PV na śnieg/szron (pole ręczne), przeliczenia deficytu na godziny agregatu i paliwo (to Ekran 2).
- **Narzędzie AI** `policz_symulacje_mrozu` (dane tylko od użytkownika, w tym produkcja dobowa).
- **Testy:** ciepło 124,08 i 152,94 kWh/dobę (budynek 120,25 W/K + 360 W, θi 20 °C), prąd przez COP, obcięcie ciepła do zera, magazyn 10 kWh/90% (PV 20/0/0, popyt 8 → 0/0/6 kWh deficytu) i spadek 20% (8 kWh), serie dni z deficytem, udział nocy, korekta PV, INCOMPLETE/INVALID, wyliczenie H_zewn i Φ_stały z E1 (120,25 W/K i 360 W), mapowanie formularza, suma G_poa po dobach UTC.

## 46. Raport kryzysowy — Moduł 7, Ekran 3 (11.10.2026)

Wersja 3.18.0. Silniki bez zmian. Źródło: `docs/zrodla/Tresc_Modul_7_StressTest_Ekrany.md`, Ekran 3 (dawne 6.3, Wzorzec G).
- **Ekran zbiorczy bez pól:** czyta zapisane szkice ekranów Symulacja mrozu (E1), Deficyty miesięczne i agregat (E2), Blackout (E4) i Współczynnik Bezpieczeństwa Zimowego (E12) i przelicza je silnikami tych ekranów — żadnego drugiego modelu. Mapowanie „formularz → wejście silnika” zostało wyciągnięte z trzech stron do wspólnych plików w `lib/stress-test/` (strony E1, E2, E12 używają tych samych funkcji, więc raport i ekran liczą identycznie).
- **Brak danych to brak, nie zero:** część, której ekran nie jest wypełniony (silnik zwraca wynik niekompletny albo szkic nie istnieje), jest oznaczona „○ brak” z linkiem do ekranu; raport nigdy nie podstawia zera. Raport z jedną częścią jest poprawny.
- **Treść:** wskaźnik Współczynnika Bezpieczeństwa Zimowego z najsłabszą składową i składowymi poniżej progu użytkownika (próg wpisuje użytkownik na E12); pokrycie najgorszego miesiąca (produkcja ÷ zapotrzebowanie obcięte do 100%) i brakujące kWh z dwóch liczb wpisanych na E12; na scenariusz mrozu: dni z deficytem, deficyt do pokrycia agregatem, najdłuższa seria, pokrycie; suma deficytów miesięcznych, godziny pracy agregatu, paliwo i koszt, miesiąc najdłuższej pracy; autonomia magazynu bez słońca vs długość scenariusza. Werdykt: żółty, gdy jakakolwiek część pokazuje deficyt, za krótką autonomię lub słaby punkt; zielony, gdy żadna dostępna część nie wskazuje problemu (to nie jest gwarancja — przy brakujących częściach raport mówi, czego nie obejmuje).
- **Wydruk:** przycisk „Drukuj lub zapisz jako PDF” (okno drukowania przeglądarki, linki i przyciski ukryte na wydruku); własnego generatora PDF nie ma — §13.1 źródła pozostaje otwarte.
- **Czego nie robi:** rekomendacji „dodaj N paneli / zwiększ baterię o X kWh” (wymaga modelu doboru — nie wymyślamy), rocznego zapotrzebowania (tylko liczby z E12), przechowywania własnej kopii wyników (raport zawsze czyta aktualne szkice przy otwarciu strony).
- **Testy:** brak ekranów, wynik niekompletny, najgorszy scenariusz symulacji (remis zostaje przy pierwszym), suma deficytów i miesiąc najdłuższej pracy, autonomia 7/10 i 10/10, współczynnik 82,5% (80/70/80/100/100 przy wagach 30/25/20/15/10), pokrycie 80% i brak 200 kWh, obcięcie do 100%, kolejność części.

## 47. Ładowanie akumulatora z regulatora — tryb mikroinstalacji, etap O2 (11.10.2026)

Wersja 3.19.0. Nowy silnik `kalkulator-mobilny/ladowanie-z-regulatora` 1.0.0, pozostałe silniki bez zmian. Realizuje połowę „ładowanie akumulatora” z etapu O2 (`docs/tryb-mikroinstalacji-specyfikacja.md`, sekcja 5); dopasowanie napięcia i prądu paneli do urządzenia było częścią 1 (sekcja 27).
- **Osobny ekran Modułu 12, nie zmiana Porównywarki:** Porównywarka ma duży, współdzielony stan (udostępnianie, oczyszczanie obcych danych), więc ładowanie jest osobnym kalkulatorem na tym samym katalogu urządzeń (`WyborUrzadzeniaPv`: regulator MPPT i falownik hybrydowy). Wybór modelu wstawia prąd ładowania regulatora i moc wejścia PV (dla napięcia akumulatora wpisanego w chwili wyboru; gdy katalog podaje jedno napięcie, a pole jest puste — to napięcie); każdą wartość można poprawić.
- **Wzór:** `I_PV = min(P_paneli, P_wejścia_PV)·η / U`, `I = min(I_PV, I_regulatora, I_akumulatora)`, `C = I / pojemność`, `t = pojemność·ΔSOC/100 / I`. Pole puste = limit nieznany: nie jest liczony, a ekran mówi który brakuje (informacja, nie błąd). Sprawność regulatora tylko wpisana z karty; puste = bez strat.
- **Górna i dolna granica, jawnie w założeniach:** moc paneli to STC (1000 W/m², 25 °C), więc prąd jest GÓRNĄ granicą (zimą i pod chmurami niższy); czas przy stałym prądzie jest DOLNĄ granicą (faza absorpcji spowalnia koniec ładowania). Ekran nie modeluje krzywej ładowania ani temperatury.
- **Ostrzeżenia:** możliwy prąd większy niż limit akumulatora → „ustaw limit prądu w regulatorze” (żółty); moc paneli ponad wejście PV regulatora → nadmiar obcięty, sprawdź kartę (żółty); brak limitu regulatora lub akumulatora (informacja). Ujemne, zerowe i poza zakresem (sprawność 0–100, stan naładowania 0–100 i od < do) → wynik niepoliczalny.
- **Czego nie robi:** nie sprawdza napięcia Voc ani prądu zwarcia paneli względem wejścia regulatora (to ekrany „Dopasowanie tablicy do falownika” i „Łączenie paneli ze stacją”), nie dobiera regulatora, nie liczy PWM, nie bierze pod uwagę ładowania z innych źródeł (alternator, agregat, sieć) ani równoległego zasilania odbiorników z regulatora.
- **Narzędzie AI** `policz_ladowanie_z_regulatora` (limity i moc tylko od użytkownika).
- **Testy:** 200 W / 12 V = 16,67 A (górna granica), limit regulatora 10 A, limit akumulatora 8 A przy 30 A regulatora (ograniczenie „akumulator”, wymaga limitu), 200 W na wejściu 150 W / 12 V = 12,5 A (nadmiar 50 W), sprawność 95% = 15,83 A, 100 Ah 20→80% przy 10 A = 60 Ah = 720 Wh = 6 h = C/10, niekompletne i niepoprawne dane.

## 48. Odbiorniki sezonowe — tryb mikroinstalacji, etap O3 (11.10.2026)

Wersja 3.20.0. Silniki bez zmian (suma dobowa `zuzycie-per-urzadzenie` 1.0.0). Realizuje etap O3 z `docs/tryb-mikroinstalacji-specyfikacja.md`: woda latem (grzałka), ogrzewanie postojowe zimą (Webasto) jako zwykłe odbiorniki z danymi od użytkownika.
- **Interpretacja (do potwierdzenia przez właściciela):** nie ma osobnych „celów zasilania” z własnymi mocami. Grzałka i ogrzewanie postojowe to zwykłe pozycje listy odbiorników, a nowe pole „miesiące pracy” (12 znaczników) mówi, kiedy działają. Aplikacja nie zakłada ich mocy: wpisuje je użytkownik z karty (dla ogrzewania postojowego — pobór elektryczny pompki i wentylatora, nie moc cieplna), zgodnie z sekcją 4 specyfikacji mikroinstalacji.
- **Model danych:** opcjonalne pole `miesiace` w pozycji szkicu `zuzycie-per-urzadzenie`; brak pola (stare szkice) lub tablica o innej długości niż 12 = urządzenie we wszystkich miesiącach użytkowania obiektu.
- **Liczenie:** `dobowaWhNaMiesiac` — w każdym miesiącu suma dobowa tylko urządzeń, które w nim pracują (ten sam silnik, filtrowana lista); niekompletne urządzenie (np. cykliczne bez współczynnika pracy) unieważnia całość. Zużycie miesięczne = dobowe miesiąca × dni, tylko w miesiącach użytkowania obiektu (Ustawienia). Gdy w miesiącach użytkowania nic nie pracuje — brak danych (`null`), nie zero.
- **Ekran:** pole „Miesiące pracy tego urządzenia” (12 pól wyboru, „?”, „Wszystkie miesiące”), nota o odbiornikach sezonowych, a gdy któreś urządzenie ma własne miesiące — tabela dobowego zużycia per miesiąc i uwaga, że suma główna liczy wszystkie urządzenia naraz.
- **Czego nie robi:** nie podpowiada mocy grzałki ani ogrzewania postojowego, nie modeluje zależności zużycia od temperatury (ogrzewanie postojowe zimą to stała moc × godziny), nie przenosi sezonowości do narzędzia AI sumy dobowej.
- **Testy:** lodówka 432 Wh + grzałka 1000 W × 2 h w maju–wrześniu + ogrzewanie 20 W × 8 h w listopadzie–marcu: maj 2432 Wh/dobę (75,392 kWh), styczeń 592 Wh (18,352 kWh), kwiecień 432 Wh (12,96 kWh); obiekt używany tylko latem; lista bez miesięcy jak dawniej; urządzenie poza miesiącami użytkowania → null; niekompletny cyklik unieważnia całość; uszkodzona tablica miesięcy.

## 49. Własne miesięczne sumy promieniowania — INFRA-2 (11.10.2026)

Wersja 3.21.0. Silniki bez zmian. Źródło: `docs/zrodla/Tresc_Modul_3_PV_Ekrany.md`, INFRA-2 („Użytkownik może nadpisać ręcznie”).
- **Co użytkownik wpisuje:** sumę promieniowania całkowitego na płaszczyznę POZIOMĄ [kWh/m²] w wybranym miesiącu (to ta sama wielkość, co miesięczna suma GHI z PVGIS; promieniowanie na płaszczyznę paneli liczy aplikacja). Pole puste = brak nadpisania; wartość niedodatnia lub nieskończona jest pomijana z komunikatem (zero nie oznacza „puste”).
- **Jak działa:** rekordy godzinowe TMY danego miesiąca (wg czasu UTC) mają GHI, DNI i DHI pomnożone przez wspólny współczynnik k = wpisana ÷ suma PVGIS. Kształt doby i podział na składową bezpośrednią i rozproszoną zostają, więc ekrany liczące nachylony płaszczyzny dostają spójne dane. Temperatury nietknięte. Aplikacja nie ocenia, czy wpisana wartość jest realistyczna — pokazuje wartość PVGIS i współczynnik.
- **Gdzie:** `lib/lokalizacja/nadpisanie-nasloneczenia.ts` (czyste funkcje), zastosowane w `useDaneTmy`, więc każdy ekran używający wspólnej sekcji danych (hook `useLokalizacjaProjektu`) i Analiza zacienienia dostają dane po nadpisaniu bez własnego kodu. Wpisy leżą pod osobnym kluczem (mały zapis; duży zapis TMY ~1,3 MB nie jest przepisywany przy każdym znaku) i obowiązują dla lokalizacji, dla której je wpisano (ta sama tolerancja ~1 km co zapis TMY).
- **Czego nie robi:** nie nadpisuje temperatur miesięcznych (źródło wspomina też temperatury — zostają z PVGIS), nie wpływa na narzędzia AI, które pobierają dane PVGIS po stronie serwera niezależnie, nie sprawdza wiarygodności wpisanych liczb, nie przelicza wpisów przy zmianie lokalizacji (dotyczą starej lokalizacji i są wtedy ignorowane).
- **Testy:** sumy miesięczne (0,8 i 0,25 kWh/m²), skala ×2 (suma po nadpisaniu = wpisana, temperatura bez zmian, zapis nie jest mutowany), ×0,5, wartości niepoprawne, miesiąc bez danych PVGIS, obca lokalizacja.

## 50. Miejsce na rozbudowę — M12 8.58, ograniczenia przestrzenne (11.10.2026)

Wersja 3.22.0. Nowy silnik `lib/core/modules/kalkulator-mobilny/miejsce-na-rozbudowe` 1.0.0 i ekran `/kalkulatory/miejsce-na-rozbudowe`. Źródło: `docs/zrodla` (M12, 8.58) podaje tylko ideę „ile jeszcze paneli/akumulatorów się zmieści” — bez pól i reguł, dlatego silnik jest czystą geometrią i niczego nie dobiera za użytkownika.
- **Co użytkownik wpisuje:** wolne miejsce (długość, szerokość, wysokość opcjonalnie) i jeden element (długość, szerokość, wysokość opcjonalnie) w mm; odstęp między elementami i od ścian (opcjonalnie); czy wolno piętrować; ile elementów chce dołożyć (opcjonalnie). Wszystkie pola puste na starcie, pusty = brak danych.
- **Jak liczy:** na każdej osi n = ⌊(S − 2m + g) / (e + g)⌋ (0, gdy S − 2m < e); sprawdza element wzdłuż i obrócony o 90° w poziomie i bierze układ z większą liczbą (remis → wzdłuż). Warstwy = ⌊(H − 2m + g) / (h + g)⌋, tylko gdy wolno piętrować i znane są obie wysokości; element wyższy niż miejsce → 0 szt. Wynik = kolumny · rzędy · warstwy. Zakryta powierzchnia = sztuki na warstwie · długość · szerokość ÷ powierzchnia miejsca.
- **Decyzje wykonawcze:** (1) użytkownik wpisuje WOLNE miejsce, nie liczbę już zamontowanych sztuk (silnik nie zakłada, że stare elementy mają te same wymiary); (2) odstępów na wentylację i dostęp serwisowy aplikacja nie zna i nie podpowiada — puste pole = 0 mm z ostrzeżeniem i założeniem „to brak danych, nie zalecenie”; (3) układy mieszane i ukośne nie są liczone, co może lekko zaniżyć wynik (założenie pokazywane w wyniku); (4) piętrowanie domyślnie wyłączone.
- **Czego nie robi:** nie ocenia wentylacji, dostępu, masy, nośności półki, długości kabli ani temperatury; nie wiąże wyniku z mocą ani pojemnością (to ekrany doboru).
- **Testy:** 2000×1000 mm i 500×400 mm bez odstępów: wzdłuż 4·2 = 8, obrócone 5·2 = 10 → 10 (układ „wszerz”); remis dla 500×500 → 8 „wzdłuż”; margines 100 i odstęp 50 → 4; dokładne dopasowanie 1000/250 = 4; 600/200 → 3 warstwy = 30; element wyższy niż miejsce → 0; plan 12 przy 10 → brakuje 2; wartości niepoprawne.

## 51. Prognoza produkcji miesięcznej — M10, dawne 12.3 (11.10.2026)

Wersja 3.23.0. Nowy silnik `lib/core/modules/ai/prognoza-miesieczna` 1.0.0 i ekran `/kalkulatory/prognoza-miesieczna`. Źródło: `docs/zrodla/Tresc_Modul_10_AI_Ekrany.md` („trend 1–12 miesięcy naprzód, z uwzględnieniem degradacji paneli”) i Biblia §10.3. Zgodnie z decyzją właściciela ekran liczy na danych WPISANYCH ręcznie, bez silnika symulacji rocznej (§15.1) ani prognozy pogody (§15.3), których nie ma.
- **Co użytkownik wpisuje:** produkcję PV w każdym miesiącu kalendarzowym ostatnich 12 miesięcy [kWh] (puste = brak danych), roczną degradację paneli z karty [%/rok] (puste = 0 % z ostrzeżeniem), pierwszy miesiąc prognozy, liczbę miesięcy naprzód (1–12) i — opcjonalnie — wahania pogody między latami [%].
- **Jak liczy:** prognoza miesiąca = produkcja tego samego miesiąca kalendarzowego sprzed roku · (1 − d/100); degradacja stosowana raz, bo prognozowany miesiąc leży rok po danych. Zakres dolny/górny = prognoza · (1 ∓ w/100). Miesiąc bez danych nie dostaje prognozy (nie zero), a sumy go pomijają. Zmiana % = suma prognozy ÷ suma tych samych miesięcy sprzed roku − 1.
- **Decyzje wykonawcze:** (1) zakres to założenie użytkownika o wahaniach pogody, NIE przedział ufności ze statystyki — ekran mówi to wprost (źródło wspomina o przedziałach ufności, ale bez danych wieloletnich nie da się ich uczciwie policzyć); (2) „zmiany zacienienia” ze źródła (np. wzrost drzew) nie są modelowane — użytkownik może je ująć, zmniejszając wpisane wartości; (3) 12 wpisanych miesięcy ma być ostatnimi 12 miesiącami (założenie pokazywane w wyniku).
- **Czego nie robi:** nie przewiduje pogody, rozrostu zacienienia ani zabrudzenia paneli; nie czyta produkcji z telemetrii (to Moduł 13); nie łączy się z ekranem „Prognozy” (dane demonstracyjne).
- **Testy:** 180/220/350 kWh przy degradacji 2 % → 176,4 + 215,6 + 343 = 735 kWh (−2 %); zakres ±10 % z 176,4 → 158,76…194,04; przejście przez koniec roku (od listopada 4 mies. → 11, 12, 1, 2); miesiąc bez danych; brak degradacji = 0 % z ostrzeżeniem; wartości poza zakresem.

## 52. Prognoza SoC 24–72 h i oś czasu — M10, dawne 12.4 + 12.43 (11.10.2026)

Wersja 3.24.0. Nowy silnik `lib/core/modules/ai/prognoza-soc` 1.0.0 i ekran `/kalkulatory/prognoza-soc`. Źródło: `docs/zrodla/Tresc_Modul_10_AI_Ekrany.md` („symulacja stanu baterii w kolejnych 24–72 h”, „interaktywna oś czasu”), Biblia §10.4 i §10.43. Na danych WPISANYCH ręcznie (decyzja właściciela), bez silnika symulacji rocznej i prognozy pogody.
- **Co użytkownik wpisuje:** baterię (pojemność użyteczna, SOC początkowy, najniższy dopuszczalny, opcjonalnie najwyższy, opcjonalnie sprawności i limity mocy ładowania/rozładowania), godzinę początku i długość prognozy (24/48/72 h), profil doby — średnią produkcję PV i zużycie [kW] w ośmiu oknach 3-godzinnych (wszystkie 16 wartości, zera też) oraz opcjonalnie udział produkcji w kolejnych dobach [%].
- **Jak liczy:** krok 1 h. Nadwyżka (produkcja − zużycie) ładuje: min(nadwyżka, limit) · η_ład, do SOC maks.; reszta to „nadwyżka” (strata). Niedobór pobiera z baterii (potrzeba ÷ η_rozł, limit mocy rozładowania), nie poniżej SOC min.; reszta to niedobór. Wynik: SOC co godzinę, najniższy i najwyższy stan, godzina pierwszego osiągnięcia minimum i pełnej baterii, niedobór [kWh] i godziny bez zasilania, nadwyżka [kWh].
- **Oś czasu (12.43):** kolejne godziny o tym samym zachowaniu baterii scalane w odcinki: ładowanie, nadwyżka (bateria pełna albo limit mocy — „dobry moment na odbiornik elastyczny”), rozładowanie, brak energii; plus godziny szczytu produkcji i zużycia i wykres SoC z produkcją i zużyciem.
- **Decyzje wykonawcze:** (1) profil 3-godzinny (jak ekran „Prognozy”) zamiast 24 pól godzinowych, powtarzany w każdej dobie; (2) wszystkie 16 wartości profilu wymagane — puste pole to brak danych (ekran „czeka”), nie zero; (3) brak sprawności = 100 % z ostrzeżeniem, brak limitu mocy = bez limitu z założeniem; (4) pogoda tylko przez udział produkcji w dobie wpisany przez użytkownika; (5) zimny akumulator ujęty wyłącznie przez wpisany przez użytkownika obniżony limit mocy ładowania (aplikacja nie zna temperatury baterii); (6) 12.43 częściowo: bez wody, temperatury i harmonogramów urządzeń (brak ich modeli).
- **Czego nie robi:** nie przewiduje pogody ani temperatury, nie modeluje starzenia i spadku pojemności, nie zna napięciowej krzywej SOC (liniowo z energii), nie łączy się z telemetrią (Moduł 13).
- **Testy:** doba policzona ręcznie dla baterii 10 kWh, start 50 %, minimum 10 %: 5 → 2 → 3,5 → 6,5 → 10 (pełna) → 1 kWh, nadwyżka 8,5 kWh, minimum po 24 h; oś czasu rozładowanie 0–6, ładowanie 6–13, nadwyżka 13–18, rozładowanie 18–24; druga doba bez słońca: niedobór 22,5 kWh przez 24 h; udział 50 % → produkcja 13,5 kWh; sprawność ładowania 90 % → 68 %, rozładowania 80 % → 30 %; limit mocy ładowania i rozładowania; przejście przez północ; wartości niepoprawne.

## 53. Oferta: numer, warunki handlowe i montaż z VAT (11.10.2026)

Wersja 3.25.0. Silniki bez zmian; zmiana dotyczy zakładki „Oferta (wydruk)”. Źródło: tablica ekranów 11.10.2026 (A: „numeracja ofert, warunki handlowe, VAT montażu”) i luki zapisane w sekcjach 28–29.
- **Pola (opcjonalne, w szkicu autosave):** „Numer oferty” (tekst), „Warunki handlowe” (tekst wieloliniowy), „Cena netto montażu i podłączenia” [waluta wyświetlania] i „Stawka VAT montażu” [%]. Wszystkie puste na starcie; puste = element nie pojawia się na wydruku.
- **Numer oferty:** wpisywany ręcznie, drukowany w nagłówku jako „Oferta nr …”. Aplikacja nie numeruje ofert sama (nie ma serwera ani rejestru ofert, a schemat numeracji to sprawa sprzedawcy).
- **Warunki handlowe:** osobna sekcja po uwagach, wyłącznie tekst użytkownika; aplikacja nie podpowiada warunków i nie ocenia ich zgodności z prawem.
- **Montaż z VAT** (`lib/porownywarka-paneli/montaz-vat.ts`): VAT = netto · stawka ÷ 100, brutto = netto + VAT, kwoty do grosza (zaokrąglenie jak na fakturze). Przy pustej stawce wydruk pokazuje tylko kwotę netto z informacją, że stawki nie podano. Stawka 0 % jest stawką (VAT 0, brutto = netto). Kwota ujemna, nie-liczba albo stawka poza 0–100 % nie drukuje sekcji, a ekran pisze dlaczego. **Stawki aplikacja nie zakłada** — zależy od rodzaju usługi i obiektu, ustala ją użytkownik.
- **Decyzja (wersja 3.25.0, uchylona w 3.26.0 — sekcja 54):** kwota montażu NIE była sumowana z cenami paneli i osprzętu, bo nie było wiadomo, czy ceny wpisano netto czy brutto. Właściciel rozstrzygnął 11.10.2026: ceny są zawsze brutto.
- **Udostępnianie:** wszystkie cztery pola dochodzą do listy pomijanych w paczce porównania (dane sprzedawcy, jak „Dla” i „Uwagi”).
- **Testy:** 1000 netto przy 8 % → VAT 80, brutto 1080; 1234,56 przy 23 % → VAT 283,95, brutto 1518,51; stawka pusta, 0 %, wartości niepoprawne; arkusz oferty: sekcje bez wpisu nie pojawiają się, numer, warunki i trzy linie montażu, pominięcie przy kwocie ujemnej; paczka udostępniania nie zawiera nowych pól.

## 54. Oferta: suma „Razem brutto z montażem” (11.10.2026)

Wersja 3.26.0. Decyzja właściciela (11.10.2026, odpowiedź na pytanie z podsumowania sekcji A): „Ceny z VAT. To znaczy zawsze brutto.” Silniki bez zmian — w kodzie ceny były już brutto (`cenaBruttoZl`, etykieta „Cena brutto za sztukę”, cennik osprzętu = ceny netto ze sklepów × 1,23, własne ceny osprzętu „wpisz brutto”), więc zmiana to tylko suma na wydruku.
- **Reguła:** `sumaZMontazem(cenaBrutto, montaż)` = cena brutto + cena brutto montażu, do grosza; `null`, gdy brak ceny, brak montażu albo brak stawki VAT (bez stawki nie ma kwoty brutto montażu, więc nie liczymy sumy).
- **Wydruk (sekcja „Montaż i podłączenie”, pod kwotami montażu):** dla każdej wersji oferty „Wersja X: panele i montaż — kwota” oraz, gdy wybrano urządzenie i da się wycenić osprzęt, „Wersja X: panele, urządzenie, osprzęt i montaż — od … do …” (zakres z cennika osprzętu). Jeden montaż dla całej oferty: ta sama kwota doliczana do każdej wersji.
- **Czego nie robi:** nie przelicza cen wpisanych netto (aplikacja zakłada, że użytkownik wpisał brutto — tak mówi etykieta i „?” pola); nie zakłada stawki VAT montażu.
- **Testy:** 12 000 + brutto montażu 1 518,51 (1 234,56 netto, 23 %) = 13 518,51; brak stawki / ceny / montażu = bez sumy; stawka 0 % = netto bez zmian; arkusz oferty drukuje sumę z wersją i nie drukuje jej bez stawki.

## 55. Ostrzeżenia o pułapkach ofert (16.10.2026)

Wersja 3.29.0, silnik porównywarki 1.9.0 → 1.9.1. Dwa ostrzeżenia 🔵 (info, nie zmieniają statusu wyniku) liczone wyłącznie z liczb, które silnik już ma — bez nowych założeń i progów:
- `PORP-PULAPKA-MOC-STC-ZIMA`: panel z najwyższą mocą z karty (Wp jednej sztuki) nie jest tym, który zimą daje najwięcej energii z 1 kWp (zima XI–II ÷ moc zestawu). Pokazuje o ile % więcej daje „zimowy lider”.
- `PORP-PULAPKA-CENA-WP-ZIMA`: panel najtańszy za 1 Wp nie jest tym z najtańszą zimową kWh (koszt w horyzoncie 25 lat); pokazuje, o ile % jego zimowa kWh jest droższa.
- **Próg:** ostrzeżenie pojawia się, gdy pokazywana różnica po zaokrągleniu do pełnych procentów wynosi co najmniej 1% — to granica czytelności liczby, nie norma ani „próg bezpieczeństwa”.
- **Czego nie robi:** nie ocenia producentów ani uczciwości ofert; pułapki wymagające danych spoza silnika (certyfikaty, serwis w Polsce, rzeczywista moc) zostają w liście zadań.
- **Gdzie widać:** wszędzie, gdzie jest lista ostrzeżeń wyniku (tryb pełny i prosty). Teksty PL/EN/RU w słownikach ostrzeżeń.

## 56. Ładowanie akumulatora z wybranego regulatora w zakładce „Falownik i osprzęt” (16.10.2026)

Wersja 3.29.0, tryb mikroinstalacji O2 (część „tablica 1–4 paneli z regulatorem”). Pod listą układów, gdy wybrano regulator MPPT albo falownik hybrydowy i znane jest napięcie akumulatora (wybrane albo jedyne na karcie), dla każdego zestawu paneli pokazuję: prąd ładowania po limitach (panele, wejście PV i prąd regulatora z karty, limit akumulatora), co ogranicza, nadmiar mocy ponad wejście PV, szybkość C. Dwa nowe pola (opcjonalne): pojemność akumulatora [Ah] i maksymalny prąd ładowania [A] — z karty akumulatora.
- **Silnik:** ten sam co ekran „Ładowanie akumulatora z regulatora” (`calculateLadowanieZRegulatora`), wywołany z `lib/porownywarka-paneli/ladowanie-akumulatora.ts`. Prąd z paneli to GÓRNA granica (moc STC).
- **Zestaw wymagający kilku urządzeń (A4):** zakładam, że ładują ten sam akumulator równolegle, więc limity prądu i mocy wejścia PV sumują się (założenie widoczne w nocie).
- **Brak limitu na karcie** = limit nieznany i nie obcina prądu (nic nie jest zgadywane). Mikroinwerter i urządzenia bez wejścia PV — blok się nie pokazuje.
- **Stan formularza i udostępnianie:** nowe pola `akumPojemnoscAh`, `akumMaksPradA` w `FormularzStan` i w oczyszczaniu paczki udostępniania.

## 57. Biblioteka materiałów i szablony przegród (16.10.2026)

Realizacja punktu „biblioteka materiałów i ścian” z sekcji 37.7 (decyzja właściciela z 10.10.2026: materiały i metodę bierzemy ze Szkieletowego). Wersja 3.29.0.
- **Dane:** `lib/core/dane/materialy-przegrod/` — 20 materiałów (izolacje, OSB, płyta GK, okładziny, pokrycia) i 3 szablony przegród szkieletowych (ściana 45×145, dach 45×145, podłoga 45×195) z odczytu `lib/warstwy-przegrod.ts` w repo Szkieletowego. Membrany, folie i szczeliny pominięte (źródło nie daje dla nich λ i nie wlicza ich do sumy oporów).
- **Status λ jest częścią danych i jest widoczny na ekranie:** `karta-producenta` (Knauf Unifit 032/033/035/037 — karty producenta z 2021 wg Szkieletowego), `norma` (EPDM — ISO 10456:2007 Tabl. 3 wg Szkieletowego), `orientacyjne` (cała reszta: „przykładowe, do weryfikacji z kartą produktu” — tak je oznacza źródło). Test pilnuje, że tylko te pozycje mają status inny niż orientacyjny. Własna λ użytkownika zawsze wygrywa (wpisanie λ odłącza materiał od biblioteki).
- **UI („Straty ciepła budynku”, sekcja „U z warstw”):** lista „Gotowa przegroda (szablon warstw)” — wypełnia warstwy i kierunek strumienia (podmienia dotychczasowe warstwy tej przegrody); w każdej warstwie lista „Materiał z biblioteki” — wstawia nazwę, λ i (przy pustym polu) typową grubość. Szkic zapisany przed zmianą działa bez zmian (`materialId` opcjonalne).
- **Test krzyżowy z ręcznym obliczeniem:** ściana szkieletowa: R = 0,012/0,13 + 0,145/0,038 + 0,0125/0,25 = 3,9581 m²K/W; U = 1/(0,13 + 3,9581 + 0,04) = 0,2423 W/(m²K) (mostki cieplne nie są liczone, więc U jest optymistyczne — ostrzeżenie na ekranie bez zmian).
- **Zostaje:** import migawki sum ze Szkieletowego (czeka na eksport po tamtej stronie), integracja z paczką `dane-srodowiskowe`.

## 58. Bilans ciepła małego obiektu i doliczanie ogrzewania w mikroinstalacji (16.10.2026)

Realizacja ustalenia z sekcji 37.7 pkt 3 („kamper/garaż mają własny ekran bilansu ciepła obiektu i wejście do bilansu zimy PV”). Wersja 3.29.0; silnik `ogrzewanie/maly-obiekt-bilans-ciepla` 1.0.0.
- **Model:** prostopadłościan długość × szerokość × wysokość: ściany = 2(L+W)H − okna i drzwi, dach i podłoga = L × W, okna i drzwi razem z własnym U. Silnik zamienia to na przegrody M6/E1 i woła `calculateObciazenieCieplne` (fizyka zapisana raz). Wejście od użytkownika bez wartości domyślnych: wymiary, U ścian/dachu/podłogi/otworów, co jest pod podłogą (powietrze zewnętrzne albo grunt/nieogrzewane pomieszczenie z temperaturą), strefa klimatyczna, temperatura w środku, wymiany powietrza, odzysk, źródło ciepła (prąd z COP albo paliwo z zapasem), 12 temperatur miesięcznych.
- **Wynik:** moc grzania w mrozie obliczeniowym strefy, straty przez przegrody i z powietrzem, ciepło na dobę, ciepło miesięczne i — z COP — prąd na ogrzewanie **tylko w miesiącach użytkowania z profilu obiektu** (poza nimi 0). Ze źródłem na paliwo (np. nagrzewnica typu Webasto): na ile dni starczy zapasu (silnik M6/E1).
- **Założenia widoczne w wyniku:** prostopadłościan, płaski dach (spadzisty ma większe pole — wpisać większe wymiary), brak mostków i zysków (ostrzeżenie `OC-BEZ-PN-EN-12831` z silnika M6/E1).
- **Porównywarka paneli:** w trybie mikroinstalacji pole „Dolicz ogrzewanie elektryczne” czyta ten ekran (`useOgrzewanieMalegoObiektu`) zamiast „Strat ciepła budynku”; powody braku doliczenia (brak danych, paliwo, brak COP, brak 12 temperatur, brak miesięcy użytkowania) są wypisane.
- **Czego nie robi:** profilu godzinowego pracy ogrzewania (wchodzi w ten sam profil dobowy co reszta prądu), mostków, zysków słonecznych, doboru źródła ciepła.
- **Ekran:** `/kalkulatory/bilans-ciepla-malego-obiektu` (kafel 12), pomoc „?” przy każdym polu i „i” przy tytule PL/EN/RU, narzędzie AI `policz_bilans_ciepla_malego_obiektu`.

## 59. Wiatr dla paneli równoległych do połaci (18.10.2026)

Wersja 3.32.0, silnik porównywarki 1.9.1 → 1.10.0. Zakładka „Obciążenia” liczyła wiatr tylko dla paneli pochylonych na konstrukcji (Tablica 7.6); dla paneli równoległych pokazywała tylko śnieg. Decyzja właściciela 18.10.2026 (D90): policzyć je z tablic dla dachów.
- **Wejście:** nowe pole „Rodzaj połaci” (`typDachu`: jednospadowy albo dwuspadowy), widoczne, gdy montaż miejsca to „równolegle”; zapisuje się w stanie formularza i w udostępnianej paczce; bez wyboru wiatru się nie liczy (śnieg tak), komunikat „Wiatru nie liczę, dopóki nie wybierzesz rodzaju połaci”.
- **Dane:** `lib/core/modules/pv/eurokod-1/wiatr-dachy.ts` — Tablice 7.3a, 7.3b (dach jednospadowy, wiatr θ = 0°, 180°, 90°) i 7.4a, 7.4b (dwuspadowy, θ = 0°, 90°); liczby przepisane i sprawdzone wizualnie ze skanem PDF normy (strony 39 i 41–42 normy) 18.10.2026. Spadek połaci to kąt nachylenia paneli (5–75°); między wierszami interpolacja liniowa wartości tego samego znaku (Uwaga 2); wartość nieobecna dla znaku = 0.
- **Założenie (górne oszacowanie, nie cp,net panelu):** norma nie podaje współczynników dla elementu leżącego nad połacią ze szczeliną, więc bierzemy ciśnienie zewnętrzne połaci c_pe,1 (lokalne, pole ≤ 1 m²; panel ma około 2 m²) bez ciśnienia pod panelem. „Środek” = największe pola (H, I), „krawędź” = najgorsze ze wszystkich pól (F, G, H, I, J, Fup, Flow) i ze wszystkich kierunków wiatru w tablicach. Docisk i odrywanie liczone osobno (Uwaga 1: nie łączyć znaków na tej samej połaci).
- **Własne oszacowanie dla paneli na konstrukcji 30–90°** (decyzja właściciela 18.10.2026): Tablica 7.6 kończy się na 30°, a żadna norma ani dokument nie podaje współczynników dla większych kątów. Aplikacja trzyma wartości z 30° (zachowawczo; dla 90° norma 7.4.3 daje tylko globalne cf = 1,80 płyty wolno stojącej, mniejsze niż lokalne cp,net z 7.6) i oznacza wynik jako „własne oszacowanie”: żółta uwaga na ekranie („to nasze własne obliczenie, nie wynik normy”), pole `zrodloCp = wlasne`, w narzędziu AI `wspolczynnikiWiatru = wlasne-oszacowanie`. To nie jest wartość normowa i nie zastępuje obliczeń konstruktora ani tunelu aerodynamicznego.
- **Dalej bez zmian:** wysokość odniesienia z pola „Wysokość górnej krawędzi paneli” (z_e = h), kombinacja STR 6.10, nośność z karty. Poza zakresem: dachy czterospadowe (Tablica 7.5), ściany (Tablica 7.1), połacie poniżej 5° (Tablica 7.2), kąty powyżej 90° i ujemne.
- **Testy:** `lib/core/modules/pv/eurokod-1/__tests__/wiatr-dachy.test.ts` (wartości z tablic w węzłach, interpolacja, zakresy), `obciazenia.test.ts` (integracja), `obciazenia-formularz.test.ts`, `udostepnianie.test.ts`. Narzędzie AI `porownaj_panele`: pole `typDachu`, powód braku wiatru `brak-typu-dachu` zamiast `montaz-rownolegly`.

