# Brief dla v0 — Inżynier Offgrid Pro

**Status:** wersja robocza (2026-08-30) — autor projektu doda swoje uzupełnienia po przejrzeniu.
Ten dokument to techniczny i projektowy punkt wyjścia. Nie zastępuje decyzji autora, tylko
zbiera w jednym miejscu to, co v0 musi wiedzieć, żeby nie zgadywać.

**Ten plik i `docs/standards/08-ui-ux.md` są przeznaczone do przeczytania bezpośrednio z repo
przez v0** (nie do kopiowania fragmentami w rozmowie) — to jest jedyne źródło prawdy dla wymagań
projektowych tej paczki. Jeśli coś tu jest niejasne albo wygląda na sprzeczne z tym, co widać w
kodzie, v0 powinien to zgłosić, nie zgadywać (ta sama zasada co dla AI w `CLAUDE.md`).

---

## 1. Co to za projekt

Kalkulator/doradca inżynierski dla systemów off-grid PV (panele, magazyn energii, ogrzewanie,
bezpieczeństwo). Web/PWA offline-first, 13 modułów tematycznych + moduł ustawień, dziesiątki
ekranów per moduł (docelowo ~579 funkcji obliczeniowych, patrz `docs/rejestr-pokrycia.md`).
Część rodziny aplikacji "Inżynier Pro" — architektura ma być przenośna na mobile bez przepisywania
logiki (`docs/standards/13-droga-mobile.md`).

**Ważne dla v0: to nie jest projekt od zera.** Jądro obliczeniowe, kontrakt wyniku, 8 w pełni
zaimplementowanych przykładowych ekranów, pulpit i ustawienia już działają w kodzie (Next.js 16 /
React 19 / TypeScript / Tailwind 4 / shadcn). Rola v0 tutaj to **system projektowy i dopracowanie
wizualne** na bazie istniejącej, działającej struktury — nie wymyślanie funkcji ani przepisywanie
logiki obliczeniowej od nowa.

## 2. Stack techniczny (już w repo, nie do zmiany)

- Next.js 16, React 19, TypeScript, Tailwind CSS 4, `shadcn/ui`.
- Komponenty domenowe (kalkulatory) żyją w `lib/core/modules/`, całkowicie oddzielone od UI
  (`app/`, `components/`) — v0 nie dotyka `lib/core`, tylko warstwę prezentacji.
- Jeden lockfile: `pnpm-lock.yaml`. Nie dodawać `package.json`/zależności bez potrzeby.

## 3. System designu — stan obecny i czego brakuje

`app/globals.css` ma już pełny zestaw tokenów kolorów (`--background`, `--foreground`, `--card`,
`--primary`, `--destructive`, itd., w formacie `oklch`) z osobnym zestawem dla jasnego i ciemnego
motywu. **Obecnie to paleta czysto szara (chroma 0)** — jedyny kolor z chromą to `--destructive`
(czerwony, do błędów/🔴). Brak zdefiniowanego koloru marki/akcentu.

**Otwarte pytanie do autora:** jaki kolor akcentu (np. dla przycisków głównych, aktywnych stanów,
🟢 werdyktu)? Do czasu decyzji v0 powinien zaproponować 1-2 warianty, nie utwardzać własnego
wyboru jako ostatecznego. **Do eksperymentowania na żywo** (autor sam próbuje kolorów, bez
proszenia v0 o kolejne warianty) służy edytor kolorów w Ustawieniach/`/wzornik` — patrz niżej.

**Jasny/ciemny motyw — zrobione (2026-08-30).** Przełącznik ☀️/🌙 (a właściwie trójstanowy:
🖥️ systemowy → ☀️ jasny → 🌙 ciemny → z powrotem 🖥️) działa w pasku górnym pulpitu, obok
"Ustawienia" (`components/theme-toggle.tsx`, stan w `lib/theme/storage.ts` — ten sam wzorzec
`useSyncExternalStore` co `lib/pulpit/storage.ts`). Wybór zapamiętany w `localStorage`, bez
błysku złego motywu przy odświeżeniu strony (inline skrypt w `<head>`, `app/layout.tsx`). **v0
dopracowuje wizualnie ten przycisk** (ikony, umiejscowienie, ewentualnie osobna wersja jako pozycja
w Ustawieniach zamiast/obok paska górnego) — mechanizm działania nie do zmiany.

`app/layout.tsx` ma już poprawną konfigurację `viewport.colorScheme` i osobne `themeColor`/ikony
per schemat (`icon-light-32x32.png`/`icon-dark-32x32.png`) — przeglądarka/system już wie o obu
motywach. Zawiera natomiast nieaktualne resztki scaffoldu (`title: 'v0 App'`, `<html lang="en">`
mimo polskiej treści) — do poprawienia przy tej samej okazji.

## 4. Wymogi UX — nie do naruszenia

Pełna specyfikacja: `docs/standards/08-ui-ux.md`. Skrót najważniejszych reguł:

- **Aplikacja jest doradcą, nie encyklopedią** (8.1) — ekran decyzyjny zawsze kończy się
  jednoznacznym werdyktem, nie samym wzorem i liczbą.
- **8 wzorców ekranu (A–H)**, patrz tabela niżej — każdy nowy ekran musi pasować do jednego z
  nich; jeśli żaden nie pasuje, projektuje się nowy wzorzec zamiast naciągać istniejący.
- **Werdykt trójstopniowy 🟢🟡🔴** — zawsze z kształtem/ikoną, nie tylko kolorem (dostępność, 8.10).
- **Bezpieczne wartości domyślne** (8.6) — dane wpływające na bezpieczeństwo nigdy nie są ukrytą
  wartością domyślną; jeśli pole ma default, musi być jawnie oznaczone jako orientacyjne.
- **Styl komunikatów** (8.8) — konkretne, bez straszenia, bez udawania pewności. Przykład wzorcowy:
  *"Brakuje informacji o klasie materiału. Wynik został policzony orientacyjnie dla wartości
  domyślnej i nie powinien być użyty jako projekt wykonawczy."*
- **Mobile-first** (8.9) — telefon jako pierwszy cel: dotyk ≥44px, pole input ≥16px (bez auto-zoom
  iOS), potem rozwój na tablet/desktop. Ekran terenowy (praca poza biurem) dodatkowo: duże
  przyciski, wysoki kontrast, czytelność w jasnym otoczeniu, obsługa w rękawicach.

### Responsywność — zakres urządzeń

**Wymóg jawny (do ustalenia z autorem, jeśli chce dopisać konkretne breakpointy):** projekt musi
działać responsywnie na całym typowym zakresie urządzeń — telefony iOS i Android (od małych do
dużych), tablety (iPad i odpowiedniki Android), oraz desktop (od małego laptopa do szerokiego
monitora). Repo nie ma dziś jeszcze spisanych konkretnych breakpointów w standardzie — v0
powinien trzymać się mobile-first z Tailwind (`sm/md/lg/xl/2xl`) i testować skrajne szerokości,
a nie tylko jeden "typowy" ekran.

### Taksonomia wzorców A–H — z gotowymi przykładami w kodzie

Każdy wzorzec ma już w pełni zaimplementowany, zweryfikowany przykład (logika + testy + UI).
**v0 powinien traktować te ekrany jako źródło prawdy dla struktury/przepływu danego wzorca** —
dopracowuje wizualnie, nie zmienia struktury sekcji bez uzasadnienia.

| Wzorzec | Kiedy stosować | Zaimplementowany przykład |
|---|---|---|
| A — Przełącznik trybu | Opcje wykluczają się, matematycznie równoważne | `/kalkulatory/konfigurator-stringow` |
| B — Karty porównawcze | Wybór produktu/technologii, opisowe | `/kalkulatory/porownanie-technologii-magazynow` |
| C — Akordeon/informacja | Tematy uzupełniają się | `/kalkulatory/czystosc-i-snieg` |
| D — Doradca (werdykt bezpieczeństwa) | Dobór z konsekwencją bezpieczeństwa — patrz 8.3 | `/kalkulatory/dobor-bezpiecznika-dc` |
| E — Checklist weryfikacyjna | Sekwencja "zrób i potwierdź" | `/kalkulatory/moment-dokrecania-srub` |
| F — Przewodnik z ilustracją | Zasada przestrzenna, bez pól wejściowych | `/kalkulatory/trasy-kablowe` |
| G — Raport/podsumowanie | Tylko odczyt, koniec ścieżki decyzyjnej | `/kalkulatory/audyt-pozarowy` |
| H — Katalog komponentów | Dodawanie wielu niewykluczających się elementów | `/kalkulatory/katalog-czujnikow` |

**Szablon wzorca D (Doradca)** — najważniejszy, bo "zawsze wygrywa" gdy się kwalifikuje (8.3) —
ma sztywną strukturę 4 sekcji: A) Twój sprzęt/dane → B) Silnik oceny (werdykt per opcja +
uzasadnienie fizyczne) → C) Rekomendacja (wyróżniona wizualnie) → D) Migawka edukacyjna. Patrz
`/kalkulatory/dobor-bezpiecznika-dc` jako żywy przykład.

### Szablon per wzorzec, nie ekran per ekran

**Zrobione (2026-08-30) — pierwszy reużywalny komponent.** `components/werdykt.tsx` eksportuje
`WerdyktPanel`/`WerdyktBadge` (werdykt 🟢🟡🔴, jeden komponent zamiast kopiowanych klas Tailwind)
i `poziomZStatusu()` (mapowanie `Status` → poziom). **Wszystkie 14 ekranów, które miały
zahardkodowane klasy koloru werdyktu, zostały na to przepisane** — zmiana koloru w Ustawieniach
faktycznie propaguje się dziś na każdy z nich, zweryfikowane w przeglądarce (Playwright, pełna
nawigacja między stronami). `components/ui/chmurka.tsx` (`Chmurka`/`PomocPole`, na `@base-ui/
react/tooltip`) to drugi taki reużywalny element — dymek z wyjaśnieniem z 8.4.

**Wymóg dla v0: ten sam wzorzec dla pozostałych 7 typów (A, B, C, E, F, G, H).** Każdy ma powstać
jako reużywalny szablon/zestaw komponentów (np. `SekcjaDoradcy`, `KartaPorownawcza`), nie jako
jednorazowy układ na każdym z ~579 przyszłych ekranów — cel: zmiana wyglądu wzorca w jednym
miejscu propaguje się na wszystkie jego ekrany. `WerdyktPanel`/`Chmurka` to gotowy, działający
wzór **jak** to zrobić technicznie (props + tokeny CSS, nie inline kolory) — v0 podąża za tym
wzorem, nie wymyśla własnego mechanizmu.

### Kolory — łatwe do zmiany, bo już są tokenami

Cała paleta jest sterowana zmiennymi CSS (`--background`, `--primary`, `--destructive`, `--werdykt-
ok/-uwaga/-blad`, itd., sekcja 3) — komponenty shadcn/Tailwind już z nich korzystają (`bg-background`,
`text-primary`, `bg-werdykt-ok-bg`...). **v0 nie ma hardkodować żadnego koloru w komponentach**
(ani jako hex w klasie, ani inline style) — zawsze przez istniejący token, albo nowy token dodany
do tej samej listy w `globals.css`, jeśli naprawdę potrzebny. Powód: kolorystyka jest już dziś
edytowalna na żywo (patrz "Edytor kolorów" niżej) i to musi zostać prawdziwe — nowy kod v0
łamiący tę zasadę cichaby wyłączał edytor dla tego fragmentu UI.

## 5. Kontrakt danych, który UI renderuje (nie do zmiany)

Każdy kalkulator zwraca `CalcResult<T>`: `{value, unit, status, formula, inputs, assumptions,
warnings, calculatorVersion}`. `status` to jeden z `VALID / VALID_WITH_WARNINGS / INCOMPLETE /
OUT_OF_SCOPE / INVALID_INPUT`. `warnings` to lista `{code, level: "info"|"warning"|"critical",
message, technicalMessage, field?}`. UI mapuje `level` na werdykt 🟢🟡🔴. v0 projektuje **jak to
wygląda**, nie zmienia **co to znaczy** — pełny kontrakt: `docs/standards/03-jadro-obliczeniowe.md`.

## 6. Pulpit i nawigacja — już zbudowany mechanizm

`docs/pulpit-i-nawigacja.md` (pełna specyfikacja) + `docs/standards/08-ui-ux.md` 8.11 (mechanizm
generyczny). Skrót:

- Pulpit główny (`/`) = siatka 13 kafli modułów + Kafel 14 (Ustawienia, dostępny też z paska
  górnego). Kolejność domyślna wynika z zależności danych między modułami, nie jest arbitralna.
- Kafel → lista ekranów modułu (`/moduly/[id]`) → konkretny ekran/kalkulator.
- Ustawienia (`/ustawienia`) pozwalają pokazać/ukryć/przenieść kafle i przywrócić domyślne —
  **ukrycie nigdy nie usuwa**, tylko chowa z widoku.
- v0 dopracowuje wizualnie te trzy ekrany (już działają funkcjonalnie): `app/page.tsx`,
  `app/moduly/[id]/page.tsx`, `app/ustawienia/page.tsx`.

## 7. Poza zakresem tej paczki (świadomie)

- **PWA** — manifest/service worker celowo odłożone (`docs/memory.md`, "Otwarte sprawy"), autor
  dostarczy referencyjną konfigurację z siostrzanej aplikacji rodziny. Nie projektować teraz.
- Pozostałe ~570 funkcji/ekranów spoza 8 wzorców i pulpitu — nie są jeszcze zaimplementowane
  (`docs/rejestr-pokrycia.md`), poza zakresem tej rundy projektowej.
- Logika obliczeniowa (`lib/core/`) — v0 nie generuje ani nie zmienia wzorów/walidacji.

## 8. Dodatkowe propozycje — status

- **Żywa strona-wzornik — zrobione (2026-08-30), `/wzornik`.** Pokazuje w jednym miejscu: edytor
  kolorów (pojedynczo i grupowo), edytor czcionki, wszystkie 3 poziomy werdyktu (panel + badge),
  przykład chmurki/`PomocPole`, styl komunikatów (8.8), warianty i stany przycisków, skalę
  typografii (z polskim pangramem), komplet ikon nawigacji i modułów. **v0: to jest referencja
  do sprawdzania spójności przy każdej zmianie**, nie ekran do przeprojektowania od zera — dopracuj
  wizualnie układ/spacing, zachowaj zestaw sekcji.
- **Stany komponentów** — wciąż otwarte, nie zrobione. Hover/focus/aktywny/disabled dla przycisku
  są w `components/ui/button.tsx` (shadcn), ale nie przemyślane pod resztę komponentów (pola,
  linki, kafle pulpitu). Do zrobienia przez v0.
- **Stany pustki/błędu/ładowania per wzorzec** — częściowo pokryte (INCOMPLETE/INVALID_INPUT
  obsłużone ad hoc na kilku ekranach), wciąż brak jednego spójnego wzorca wizualnego. Do zrobienia.
- **Skala typografii** — pokazana w `/wzornik` (5 poziomów: H1/H2/etykieta/treść/podpis), ale to
  wciąż luźne klasy Tailwind, nie token/util. Ujednolicenie w kod — do zrobienia przez v0.
- **Ikonografia** — nadal emoji, pytanie o SVG wciąż otwarte. Pełna lista do przejrzenia: sekcje
  "Ikony nawigacji"/"Ikony modułów" w `/wzornik`.
- **Kontrast i dostępność (WCAG AA)** — nadal do zrobienia. Uwaga: `--werdykt-*` to teraz kolor
  bazowy + automatycznie wyliczone tło/tekst przez `color-mix()` (`app/globals.css`) — user może
  ustawić dowolny hex w edytorze, więc audyt kontrastu ma sens dopiero po ustaleniu domyślnych
  wartości, nie tylko raz.

## Edytor kolorów i czcionki — zrobione (2026-08-30)

`app/ustawienia` (sekcja "Personalizacja wyglądu") i `/wzornik` udostępniają ten sam komponent
(`components/kolor-grupa-edytor.tsx`): 7 grup kolorów (Tło, Karty, Tekst, Akcent, Werdykt 🟢/🟡/🔴)
— **edycja pojedyncza** (swatch + pole HEX per grupa) i **grupowa** (zaznacz kilka grup checkboxem,
wybierz jeden kolor, "Zastosuj do zaznaczonych" nadpisuje wszystkie naraz). Zmiana propaguje się
w całej aplikacji (zweryfikowane: zmiana w Ustawieniach widoczna po pełnej nawigacji na dowolny
ekran kalkulatora) — mechanizm: `lib/wyglad/storage.ts` nadpisuje zmienne CSS na `<html>` i
zapisuje w `localStorage`; inline skrypt w `app/layout.tsx` odtwarza je przy każdym ładowaniu
strony (bez błysku domyślnego wyglądu). Osobno: **czcionka** (`components/czcionka-edytor.tsx`) —
4 fonty z pełnym wsparciem polskich znaków (Inter/Source Sans 3/Roboto/Lato, `next/font/google`,
subset `latin-ext`) + przełącznik wagi tekstu (normalna/pogrubiona).

**Świadomie poza zakresem v1:** tylko 7 grup, nie wszystkie ~20 tokenów CSS naraz (żeby nie było
łatwo przypadkiem zepsuć kontrast) — `--secondary`/`--muted`/`--accent`/`--ring`/`--sidebar-*`
nadal tylko przez `globals.css`. Rozszerzenie na więcej tokenów możliwe później bez zmiany
mechanizmu, jeśli okaże się potrzebne.

## 9. Miejsce na uzupełnienia autora

*(sekcja celowo pusta — do wypełnienia po przejrzeniu powyższego)*

-
-
-
