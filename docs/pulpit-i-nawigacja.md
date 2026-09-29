# Pulpit i nawigacja — Inżynier Offgrid Pro

**Status:** mechanizm i zasady zatwierdzone, **v1 zaimplementowana (2026-08-30)** — pulpit, strony
modułów i ustawienia z pokaż/ukryj/przenieś/przywróć domyślne działają (`lib/pulpit/`, `app/page.tsx`,
`app/moduly/[id]/page.tsx`, `app/ustawienia/page.tsx` — szczegóły w `docs/rejestr-pokrycia.md`,
sekcja "Pulpit i nawigacja"). Konkretne presety onboardingu (sekcja 3 niżej) to wciąż **pierwsza
wersja robocza do przejrzenia przez autora** — nie zaimplementowane (ekran onboardingu przy
pierwszym uruchomieniu jeszcze nie istnieje), nie traktować listy jako ostateczną bez potwierdzenia.

Mechanizm generyczny (reużywalny w innych aplikacjach rodziny): `docs/standards/08-ui-ux.md`, 8.11.
Ten dokument to jego konkretna instancja dla Offgrid — 14 kafli, ich domyślna kolejność, presety
onboardingu, i sposób, w jaki ten sam wzorzec powtarza się wewnątrz każdego modułu.

---

## 1. Model pojęciowy

**Pulpit główny** = siatka kafli. Kafel = jeden z 13 modułów domenowych (`Moduł 1`–`Moduł 13`,
`docs/zrodla/`) + **Kafel 14 = Ustawienia** (ta numeracja już istnieje w źródle:
`Tresc_WSZYSTKIE_MODULY_scalone.md`, metryczka "Moduły (kafle pulpitu): 13 + 1").

**Pasek górny** (stały, zawsze widoczny, niezależny od stanu pulpitu):

`☰ Menu projektu` · `📍 Lokalizacja i teren` · `📡 Tryb Live` · `⚙️ Ustawienia` · `🔔 Powiadomienia`

**Ustalenie (2026-08-30, autor):** pasek górny to **dodatkowy skrót**, nie zamiennik. Kafel 1
(Lokalizacja), Kafel 13 (Live) i Kafel 14 (Ustawienia) pozostają pełnoprawnymi pozycjami na
pulpicie — można je tak samo ukryć/przenieść/przypiąć jak każdy inny kafel. Pasek górny daje do
nich szybki dostęp niezależnie od tego, czy user akurat schował je z pulpitu.

## 2. Domyślna kolejność 13 kafli — uzasadnienie

Kolejność wynika z realnego przepływu zależności danych (kto czyta dane od kogo), nie jest
arbitralna. Jest to **dokładnie kolejność już używana** w numeracji `Moduł 1`–`13` w
`docs/zrodla/Tresc_Modul_*_Ekrany.md` — nie nowy wymysł, tylko potwierdzenie, że istniejąca
numeracja już koduje logiczną kolejność.

| # | Kafel | Zależy od (czyta dane z) |
|---|---|---|
| 1 | Lokalizacja i teren | — (fundament: klimat, nasłonecznienie, strefy) |
| 2 | Zapotrzebowanie energetyczne | 1 |
| 3 | Instalacja PV | 1, 2 |
| 4 | Magazyn energii / baterie | 2, 3 |
| 5 | Okablowanie i zabezpieczenia | 3, 4 |
| 6 | Ogrzewanie / pompa ciepła | 1, 2 |
| 7 | Stress-test zimowy | 1–6 (spina wszystko wcześniejsze) |
| 8 | Bezpieczeństwo i sytuacje awaryjne | 4, 5, 6, 7, 9 |
| 9 | Elektronika / ESP32 / sensoryka | względnie niezależny (infrastruktura) |
| 10 | AI i prognozy | prawie wszystko wcześniejsze |
| 11 | Montaż baterii | 4 (proceduralny, nie projektowy) |
| 12 | Szybki kalkulator / tryb mobilny | w większości samodzielny |
| 13 | Tryb Live | monitoring tego, co już zbudowane — ma sens na końcu |

**[28.09.2026, audyt końcowy N.3]** Za kaflem 13 stoją dwa kafle M14: „Dom – sieć” i „Firma – sieć” (D39). Czytają z 1–4 i 6–8. Nie mają numeru kafla, bo „Kafel 14” to Ustawienia (D9). Tabela wyżej zostaje bez zmian jako stan z 30.08.2026. **[28.09.2026]** W `lib/pulpit/registry.ts` mają wewnętrzne id 15 i 16 (tylko techniczne — w UI nazwa), na końcu kolejności; zapisany wcześniej układ pulpitu dostaje je na końcu (`parsujStan`). Wygląd „duży kafel” i animowana ikona — jeszcze nie (TD22).

**Ważne — to jest niezależne od `ZASADY_APLIKACJI.md` §14** ("kolejność budowy"). §14 opisuje, w
jakiej kolejności *my* implementujemy kod; kolejność kafli opisuje, co domyślnie widzi *user* na
pulpicie. To dwie różne rzeczy, mogą się różnić bez sprzeczności — kolejność kafli może się
zmieniać swobodnie, nie sugeruje planu pracy zespołu. Jedyne realne ryzyko pomyłki: `§14` używa
starszej numeracji "Rozdział 0–12" sprzed ustalenia numeracji `Moduł/Kafel 1–13` z `docs/zrodla/`,
i te dwa systemy numeracji **nie pokrywają się 1:1** (np. stary "Rozdział 6" ≠ dzisiejszy "Moduł
6") — w `§14` dopisano jednozdaniowe zastrzeżenie, żeby to nie zostało pomylone w przyszłej sesji.

## 3. Onboarding — pierwsze uruchomienie

Ekran pyta: **"Co chcesz teraz zrobić?"** (wybór jednej lub kilku kategorii, wielokrotny wybór).
Przy każdej kategorii krótkie zdanie, co ona włącza/wyłącza. Po wyborze: przycisk generuje pulpit
(**"Pulpit proponowany"**), z jasną informacją, że wszystko da się później zmienić
(Kafel 14 → "Skonfiguruj pulpit").

**Osiem presetów — pierwsza wersja robocza, do potwierdzenia przez autora:**

| Kategoria | Widoczne kafle (w tej kolejności) | Ukryte |
|---|---|---|
| 🏠 Cały system Off-Grid | 1–13 (kolejność domyślna, sekcja 2) | — |
| ☀️ Instalacja PV | 1, 3, 2, 4, 5, 7, 10 | 6, 8, 9, 11, 12, 13 |
| 🔋 Magazyn energii / baterie | 1, 4, 2, 3, 5, 11, 7 | 6, 8, 9, 10, 12, 13 |
| ⚡ Zapotrzebowanie energetyczne | 1, 2, 3, 4, 12 | 5, 6, 7, 8, 9, 10, 11, 13 |
| 🔥 Ogrzewanie / pompa ciepła | 1, 6, 2, 7, 10 | 3, 4, 5, 8, 9, 11, 12, 13 |
| 🧰 Instalacja elektryczna | 1, 5, 3, 4, 8 | 2, 6, 7, 9, 10, 11, 12, 13 |
| 🧪 Analiza / stress-test | 1, 7, 2, 3, 4, 6, 10 | 5, 8, 9, 11, 12, 13 |
| 🤖 Automatyka i AI | 1, 9, 10, 13, 8 | 2, 3, 4, 5, 6, 7, 11, 12 |

**[28.09.2026, audyt końcowy N.3]** Dziewiąty preset, „Jestem podłączony do sieci” (D39), wysuwa kafle M14 na początek. Skład jego widocznych kafli nie jest jeszcze ustalony. Powstanie razem z ekranem onboardingu (`backlog-poza-v1.md`). Kafle M14 w ośmiu presetach wyżej: ~~ukryte, dopóki właściciel nie zdecyduje inaczej (✅🤖)~~ **[29.09.2026, D53] widoczne we wszystkich ośmiu presetach** — decyzja właściciela: „nie muszą być ukryte, to ważna funkcja”. Miejsce: na końcu listy widocznych kafli danego presetu, w kolejności „Dom – sieć”, „Firma – sieć” (✅🤖 — właściciel nie wskazał pozycji). Tabela wyżej zostaje bez zmian (numery 1–13); kafle M14 dochodzą do kolumny „Widoczne” każdego wiersza. Wejdzie do kodu razem z ekranem onboardingu.

Kafel 1 (Lokalizacja) jest widoczny w każdym presecie — to fundament danych dla każdej ścieżki
projektowej, niezależnie od tego, nad czym user akurat pracuje. Kafel 14 (Ustawienia) nie jest
wymieniony w tabeli — jest dostępny zawsze przez pasek górny, niezależnie od presetu (sekcja 1).

**Wybór wielu kategorii naraz** = suma zbiorów widocznych kafli (unia), przeliczana na żywo —
zaznaczenie kilku kategorii w "Trybie pracy" (sekcja 4) nie wymaga zapamiętywania osobnego układu
per kombinacja, tylko liczy unię aktualnie zaznaczonych presetów.

## 4. Zasady interakcji (nienegocjowalne)

- **Propozycja, nie autopilot.** System nigdy nie zmienia układu pulpitu samodzielnie w trakcie
  pracy. Zmiana wymaga jawnej akcji usera — np. przycisk **"✨ Dopasuj pulpit do mojej pracy"** po
  zmianie zaznaczenia w "Trybie pracy" (checklist kategorii, dostępna z paska górnego pod nazwą
  projektu — `PROJEKT OFF-GRID ▾`).
- **Ukrycie ≠ usunięcie.** Schowany kafel zawsze dostępny przez **"Pełne menu"** (wszystkie 13,
  autokolejność wg sekcji 2) albo **"+ Dodaj kafel"** (wybór pojedynczy z listy 13).
- **Zwolnione miejsce nie zostaje puste** — pozostałe kafle powiększają się (reflow).
- **"Mój pulpit" vs "Pulpit proponowany"** — dwa oddzielne stany. Przełączenie na własny układ nie
  kasuje możliwości powrotu do proponowanego (regeneracja z aktualnego "Trybu pracy").
- Menu kafla (`⋮`): Przenieś / Zmień rozmiar / Ukryj z pulpitu / Przypnij / Przywróć domyślne.

## 5. Rekurencja — ten sam wzorzec wewnątrz modułu

Każdy moduł z wieloma ekranami (np. Moduł 5 — 29 ekranów, Moduł 4 — 34 ekrany) dostaje **ten sam**
komponent (`AdaptiveMenu`, 08.11) na swoim poziomie, nie osobną implementację:

- Wejście do modułu bez wcześniejszej konfiguracji pokazuje **skrócone menu** — podzbiór ekranów
  dobrany wg presetu (np. "Montaż paneli", "Dobór akumulatora") zamiast wszystkich naraz.
- **"Pełne menu"** = wszystkie ekrany modułu widoczne, w kolejności już ustalonej przez numerację
  źródłową `Ekran 1, 2, 3...` w `docs/zrodla/Tresc_Modul_X_*_Ekrany.md` — ta kolejność **już
  istnieje i jest logiczna** (ustalona przez autorów treści przy scalaniu funkcji), nie trzeba jej
  wymyślać od nowa dla każdego modułu.
- Presety per moduł (lista zadań typu "co potrzebne do montażu paneli") — do opracowania osobno
  dla każdego modułu w miarę budowy jego ekranów, nie teraz en masse (żeby nie zgadywać zawartości
  modułów, których ekrany jeszcze nie zostały zaimplementowane).
- Ta sama zasada "ukrycie ≠ usunięcie", ten sam mechanizm `⋮`/"Mój pulpit modułu"/"Pełne menu".

## 6. Techniczne

- **Terminologia:** "profile pulpitu" / "szablony" / "presety" — nigdy "AI" (08.11, uzasadnienie
  w `docs/standards/09-ai-w-produkcie.md`). To deterministyczne mapowanie preset → zbiór pozycji.
- **Przechowywanie:** preferencja UI (Zasada 6 `ZASADY_APLIKACJI.md` — offline-first, `localStorage`
  dozwolony dla "drobnych preferencji UI"), nie dana projektu. Docelowo na mobile: ten sam
  mechanizm co inne preferencje UI, nie `StorageAdapter` projektu.
- **Komponent:** `AdaptiveMenu` żyje w warstwie prezentacji (`app`/`components`), nie w `lib/core`
  — to nawigacja/UI, nie logika inżynierska (Zasada 2).

## Otwarte sprawy

- 8 presetów z sekcji 3 to wersja robocza — do przejrzenia i skorygowania przez autora. **Ekran
  onboardingu ("Co chcesz teraz zrobić?") jeszcze nie zaimplementowany** — v1 pulpitu startuje
  zawsze z pełną, domyślną kolejnością wszystkich 13 kafli, presety trzeba zastosować ręcznie w
  Ustawieniach dopóki onboarding nie powstanie.
- Semantyka "Trybu pracy" przy wielu zaznaczonych kategoriach (unia zbiorów) — założenie robocze,
  do potwierdzenia. Nie zaimplementowane — v1 ma tylko pojedyncze pokaż/ukryj per kafel.
  Kompanuje presetów (`docs/rejestr-pokrycia.md`, "Otwarte sprawy") — do zrobienia.
- Konkretne presety per moduł (sekcja 5) — odłożone do momentu, gdy dany moduł ma zaimplementowane
  wystarczająco dużo ekranów, żeby preset miał sens.
- **Uproszczenie v1 (2026-08-30):** "Przenieś" w Ustawieniach to przyciski ↑/↓, nie przeciąganie
  (drag-and-drop) — ten sam efekt funkcjonalny, bez nowej zależności. Realne przeciąganie można
  dodać później bez zmiany kształtu stanu (`PulpitState.order`).
- "Zmień rozmiar" i "Przypnij" z menu `⋮` (sekcja 4) — nie zaimplementowane w v1, tylko
  pokaż/ukryj/przenieś/przywróć domyślne.
- **[28.09.2026] Dwa nowe duże kafle M14 „Dom – sieć” / „Firma – sieć”** (D35, `03_M14_Dom_i_Firma_Siec.md`) — pozycja w domyślnej kolejności (§2) — **[28.09.2026] rozstrzygnięte: D39, zgodnie z propozycją poniżej** (wcześniej: wymaga decyzji właściciela). Robocza propozycja AI (✅🤖): na końcu, za kaflem 13 (czytają z M1–M4, M6–M8), plus później preset onboardingu „Jestem podłączony do sieci”, który je wysuwa na początek. Uwaga na numerację: „Kafel 14” to już Ustawienia (D9) — kafle M14 nazywać nazwą albo „M14-D” / „M14-F”, nie numerem kafla.
