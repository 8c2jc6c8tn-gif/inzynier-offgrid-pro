# Brief dla v0 — Inżynier Offgrid Pro

**Status:** wersja robocza (2026-08-30) — autor projektu doda swoje uzupełnienia po przejrzeniu.
Ten dokument to techniczny i projektowy punkt wyjścia. Nie zastępuje decyzji autora, tylko
zbiera w jednym miejscu to, co v0 musi wiedzieć, żeby nie zgadywać.

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
wyboru jako ostatecznego.

**Jasny/ciemny motyw — mechanizm już istnieje.** `globals.css` ma trzy tryby zdefiniowane
jednocześnie: klasa `.dark` (ręczne wymuszenie), klasa `.light` (ręczne wymuszenie jasnego nawet
gdy system jest ciemny — patrz selektor `:root:not(.light)` w bloku `prefers-color-scheme: dark`),
i automatyczne dziedziczenie z `prefers-color-scheme` systemu, gdy żadna klasa nie jest ustawiona.
**Brakuje tylko widocznego przełącznika w UI** (przycisk ☀️/🌙, np. w pasku górnym pulpitu obok
"Ustawienia") — sama infrastruktura CSS jest gotowa, to kwestia jednego komponentu przełączającego
klasę na `<html>` i zapisującego wybór w `localStorage` (ten sam wzorzec co `lib/pulpit/storage.ts`
— `useSyncExternalStore`, nie `useEffect`+`useState`). **Do potwierdzenia przez autora:** czy
dodajemy ten przełącznik teraz, w ramach tej paczki dla v0.

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

## 8. Miejsce na uzupełnienia autora

*(sekcja celowo pusta — do wypełnienia po przejrzeniu powyższego)*

-
-
-
