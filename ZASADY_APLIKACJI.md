# ZASADY_APLIKACJI.md

> ⚠️ **[04.09.2026] ZASTĄPIONE — treść zachowana, nie usunięta (Część D GOD BOOK).**
> Rolę konstytucji projektu od 04.09.2026 pełni kanoniczna Biblia w formacie GOD BOOK:
> zacznij od **`00_Biblia.md`**. Cała treść tego pliku (14 Zasad, Dług D‑01, dziennik zmian
> 0.1.0–0.1.7) jest zmapowana 1:1 do nowych dokumentów — mapowanie: `00_Biblia.md`, sekcja
> "Relacja ze starą konstytucją". Ten plik zostaje jako materiał historyczny/źródłowy
> (`docs/zrodla/`-podobna rola), **nic z niego nie zniknęło**. Decyzja migracji: `rejestr-decyzji.md` D19.

**Projekt:** Inżynier Offgrid Pro (aplikacja Off‑Grid PV)
**Status dokumentu:** historyczny — zastąpiony przez `00_Biblia.md` (04.09.2026), treść zachowana
**Wersja zasad:** 0.1.7 (ostatnia wersja przed migracją)
**Data:** 2026‑08‑28
**Źródło wymagań:** „Biblia Off‑Grid PV" v1.5 (nagłówek) / metryczka v1.7 — patrz Dług D‑01
**Target:** Web / PWA (offline‑first), architektura przygotowana na przeniesienie na mobile

---

## 0. Jak czytać ten dokument

Ten plik jest **nadrzędny wobec kodu**. Jeśli kod i ten dokument się nie zgadzają — dokument wygrywa albo dokument zostaje świadomie zmieniony (z wpisem w dzienniku zmian). To nie jest specyfikacja funkcji — te są w „Biblii". To jest zbiór **reguł architektonicznych i procesowych**, według których każda z ~540 funkcji ma być budowana.

Każda zasada ma: **regułę → uzasadnienie → konsekwencję w kodzie**.

### 0.1 Ekspertyza domenowa

Zgodnie z `docs/god-book/instrukcja-uniwersalna-biblii-projektu-v2_8.md` §0.2 ("Ekspertyza
domenowa — automatyczna, nie na żądanie"): przy pracy nad tym projektem AI przyjmuje personę
doświadczonego eksperta domeny, bez czekania na polecenie.

**Ekspertyza domenowa: elektryk / inżynier instalacji off‑grid PV (panele, magazyny energii,
ogrzewanie, bezpieczeństwo elektryczne), poziom: senior / 20 lat doświadczenia w terenie.**

Konsekwencja w kodzie: każdy wzór weryfikowany niezależnie przed implementacją (Zasada 4, §4
niżej), rozróżnianie uniwersalnej, fundamentalnej fizyki (prawo Ohma, ciepło właściwe wody,
rezystywność miedzi, równanie Magnusa-Tetensa, deklinacja Słońca) od współczynników
projektowych/normatywnych, których źródło nie podaje wprost — te drugie nigdy nie są zgadywane
(Zasada 4, `docs/standards/15-wspolpraca-z-ai.md`). Sprzeczności fizyczne we własnych przykładach
źródła (jeśli się pojawią) są wyłapywane i jawnie dokumentowane, nie ciche poprawiane ani ślepo
kopiowane.

---

## 1. Filozofia (przeniesiona wprost z Biblii)

1. Aplikacja liczy **twarde fakty fizyczne**, nie „internetowe opinie". Każdy wynik musi dać się wyprowadzić ze wzoru.
2. Aplikacja **ostrzega przed pułapkami**, o których nowicjusz zapomina (Załącznik A Biblii).
3. Aplikacja działa **w pełni offline** po pierwszym pobraniu danych klimatycznych/PV.
4. Aplikacja tłumaczy „po ludzku" (Migawki) **i** pokazuje twardą fizykę (wzory) — Zasada 8.

---

## 2. Zasada nadrzędna: Logika nie wie nic o platformie

**Reguła.** Cała logika inżynierska (jądro obliczeniowe, profile krajowe, walidacja, wzory, reguły biznesowe, i18n) jest napisana w **czystym TypeScript**, jako funkcje bez efektów ubocznych. Nie importuje niczego z React, Next.js, DOM, `window`, `fetch`, bazy danych ani z systemu plików.

**Uzasadnienie.** To jest ~70% wartości produktu i jest w 100% przenośne na mobile. Przeniesienie web → mobile ma kosztować „skórę, nie serce".

**Konsekwencja w kodzie.**
- `packages/core/` (lub `lib/core/`) — logika czysta. **Zakaz** importów UI/IO.
- `packages/adapters/` — wszystko, co dotyka platformy (storage, sieć, płatności, bezpieczeństwo, powiadomienia) za interfejsami.
- `app/` — warstwa widoku (Next.js dziś, React Native jutro).
- Reguła egzekwowana lintem: `core` nie może importować z `app` ani z `adapters`.

```
core/        → czyste funkcje: calc, profile, walidacja, i18n, reguły
adapters/    → StorageAdapter, WeatherAdapter, PaymentAdapter, CryptoAdapter...
app/         → ekrany, komponenty, hooki (wymienne przy przejściu na mobile)
```

---

## 3. Jądro obliczeniowe (Calculation Core)

**Reguła.** Każda funkcja obliczeniowa jest **czysta i deterministyczna**: te same wejścia → te same wyjścia. Zwraca nie tylko liczbę, ale **strukturę wyniku**:

```ts
type CalcResult<T> = {
  value: T
  unit: string
  formula: string        // wzór w LaTeX, np. "I = P / (V \\cdot \\eta)"
  inputs: Record<string, number>   // wartości użyte do obliczenia
  assumptions: string[]  // przyjęte założenia (np. "η falownika = 0,92")
  warnings: Warning[]    // pułapki inżynierskie (Załącznik A)
  traceId: string        // do audit trail (Zasada 9)
}
```

**Uzasadnienie.** Migawka „Fizyka", audyt i podwójna weryfikacja (Zasada 4) wymagają, by wynik niósł ze sobą swój wywód.

**Konsekwencja.** Zakaz „magicznych liczb" w kodzie. Wszystkie stałe (η=0,92; DoD; współczynniki temperaturowe; cos φ) pochodzą z nazwanych stałych lub z profilu krajowego.

---

## 4. Podwójna weryfikacja obliczeń

**Reguła.** Każdy krytyczny wzór (dobór przekroju kabla, Voc max przy mrozie, dobór bezpiecznika AIC, pojemność baterii, moc falownika) ma **dwie niezależne ścieżki** dające ten sam wynik w granicy tolerancji:
1. ścieżka główna (wzór analityczny),
2. ścieżka kontrolna (test jednostkowy z wartością referencyjną policzoną ręcznie / z normy).

Rozbieżność > tolerancji = build fail.

**Uzasadnienie.** Błąd w doborze bezpiecznika albo Voc to realne ryzyko pożaru. Aplikacja nie może się mylić po cichu.

---

## 5. Profile krajowe jako dane, nie kod

**Reguła.** Wszystko, co zależy od kraju/regionu, żyje w **plikach JSON** walidowanych schematem (Zod), nigdy w `if (kraj === 'PL')`.

Profil zawiera m.in.: strefy klimatyczne, strefy wiatrowe/śniegowe, głębokość przemarzania, normy (przekroje, SPD, RCD, uziemienie), waluta, jednostki, ceny referencyjne energii/paliwa, dopuszczalne spadki napięć.

**Konsekwencja.** Nowy kraj = nowy plik JSON + jego walidacja, bez zmian w jądrze. Start: profil `PL`. Struktura od początku wielokrajowa.

---

## 6. Offline‑first (web) i strategia mobile

**Reguła.**
- Web: dane trwałe w **IndexedDB**, service worker do assetów, jednorazowe zapytania online (PVGIS/PVWatts, geolokalizacja) buforowane na stałe.
- Cały stan projektu daje się zapisać/odczytać przez `StorageAdapter` — implementacja IndexedDB dziś, SQLite na mobile jutro.
- Aplikacja musi być w pełni funkcjonalna bez sieci po pierwszym pobraniu.

**Zakaz.** `localStorage` jako baza danych stanu projektu (dozwolony tylko dla drobnych preferencji UI).

---

## 7. Model danych = tabele z Biblii

**Reguła.** Nazwy encji przyjmujemy wprost z Biblii (`project_location`, `critical_loads`, `variable_loads`, `pv_panels`, `battery_sizing`, `cable_sizing`, ...). Jedna funkcja Biblii → jeden nazwany „moduł" o tym samym ID (`standby_drain_simulation`, `mppt_matching`, ...).

**Uzasadnienie.** Zachowanie mapowania 1:1 z Biblią to warunek integralności (Zasada 12) i łatwej nawigacji między dokumentem a kodem.

---

## 8. UI: Migawki, Tryb Inżyniera, Powiązania Bloków (Notatki Systemowe Biblii)

1. **Migawki (`[ i ]`)** — każdy parametr ma dymek z dwiema zakładkami:
   - „Po ludzku" (tekst z Biblii, np. *„Na mrozie chemia w baterii jest leniwa"*),
   - „Fizyka" (wzór LaTeX renderowany, np. $$I = P / (V \cdot \eta)$$).
   Treść pochodzi z pola `formula` + `assumptions` wyniku (Zasada 3) — nie przepisujemy jej ręcznie.
2. **Tryb Inżyniera** — globalny przełącznik. Domyślnie tryb prosty (suwaki, kafle). Inżynier odsłania balansery, protokoły CAN, momenty dokręcania, rezystancje wewnętrzne. Stan trwały w preferencjach.
3. **Powiązania Bloków** — pole `powiazania: string[]` (ID innych funkcji) jest częścią definicji modułu. UI pokazuje je jako linki; silnik używa ich do propagacji danych (np. 3.13 mróz → blokuje 2.10 produkcję PV).
4. **Mobile‑first UI** — projektujemy pod telefon (dotyk ≥44px, input ≥16px, brak auto‑zoom iOS), potem rozwijamy na desktop.
5. **Pulpit adaptacyjny** — pulpit główny (13 kafli + Kafel 14 Ustawienia) i wnętrze każdego modułu z wieloma ekranami używają tego samego mechanizmu personalizacji nawigacji (onboarding proponuje układ, user zawsze może go zmienić, nic nie znika — tylko się chowa). Mechanizm: `docs/standards/08-ui-ux.md` §8.11. Konkretna instancja dla Offgrid (kolejność kafli, presety onboardingu): `docs/pulpit-i-nawigacja.md`.

---

## 9. Audit trail i logowanie błędów

**Reguła.**
- Każde nietrywialne przeliczenie zapisuje wpis: `traceId`, funkcja, wejścia, wynik, wersja jądra, znacznik czasu. To realizuje ducha „Czarnej Skrzynki" (funkcja 3.26 Biblii) na poziomie aplikacji.
- Błędy (runtime, walidacja, rozbieżność weryfikacji) trafiają do jednego `Reporter` (adapter) — z rozróżnieniem: użytkownik widzi komunikat „po ludzku", log niesie szczegóły.
- Zero cichych `catch {}`. Każdy złapany błąd jest raportowany.

---

## 10. Bezpieczeństwo (mapowanie natywne → web)

| Wymóg Biblii (natywny) | Odpowiednik web / PWA |
|---|---|
| Android Keystore / iOS Keychain | WebCrypto + sekrety wyłącznie po stronie serwera; tokeny w HttpOnly cookies |
| Obfuskacja (ProGuard/DexGuard/iXGuard) | minifikacja bundla; brak sekretów w kliencie (ograniczenie znane) |
| Root/jailbreak/SSL pinning | poza zakresem web; nagłówki bezpieczeństwa + HTTPS |
| Restore purchases (App/Play Store) | Stripe (Zasada 11) |

**Reguła bazowa.** Żaden sekret, klucz API ani logika płatności nie trafia do kodu klienta. Walidacja i sanityzacja każdego wejścia. Nagłówki: `X-Content-Type-Options`, `Referrer-Policy`, `Strict-Transport-Security`, `Permissions-Policy` (dla używanych funkcji: geolokalizacja `=(self)`).

---

## 11. Freemium i płatności

**Reguła.** Podział free/pro definiowany **danymi** (mapa `feature → tier`), nie rozsypanymi `if`. Egzekwowanie limitu **po stronie serwera**, nie tylko w UI. Płatności przez **Stripe** (integracja Vercela), z idempotency keys. Restore/subskrypcje App Store/Google Play — dopiero w wersji mobile.

**Podział zatwierdzony (2026‑08‑28, decyzja autora):**
- **FREE:** 1 projekt, tryb prosty, kalkulatory awaryjne (dawny Rozdz. 8, dzisiejszy Moduł 12).
- **PRO:** wiele projektów, Tryb Inżyniera, stress‑test zimowy, tryb Live, eksport PDF/CSV, AI.

---

## 12. Integralność wersji (Zasada 5 Notatek Systemowych)

**Reguła.**
- Każda wersja dokumentu i danych ma **metryczkę**: liczba rozdziałów, funkcji, sekcji.
- **Żadnej funkcji nie wolno usunąć ani pominąć bez jawnego potwierdzenia** zapisanego w dzienniku zmian.
- Rejestr pokrycia: dla każdej z ~540 funkcji status `todo / in‑progress / done`, mapowany po ID z Biblii.

**Dług D‑01 (rozstrzygnięty).** Biblia 1.5 jest wewnętrznie niespójna: nagłówek/stopka mówią „1.5", metryczka „1.7 / 540 funkcji", a spis treści jednego z powtórzonych bloków skraca Rozdz. 7 do 3 funkcji.

- **Rozstrzygnięte (2026‑08‑28, decyzja autora):** Rozdział 7 ma **50 funkcji**. Wartość „3" to błąd scalenia w powtórzonym bloku i jest odrzucona.
- **Skorygowane (2026‑08‑29, weryfikacja programistyczna).** Powyższa decyzja z 2026‑08‑28 jest zastąpiona: Rozdział 7 (Tryb Live) ma **33 realne funkcje** (7.1–7.8 + 7.26–7.50; numery 7.9–7.25 nie istnieją w treści źródłowej), nie 50. Wartość „50" jest odrzucona. Źródło korekty: `Tresc_WSZYSTKIE_MODULY_scalone.md`, liczba ustalona przeliczeniem faktycznej treści, nie z deklaratywnej metryczki dokumentu.
- **Finalna łączna liczba funkcji Biblii: 579** (nie 540 — metryczka źródła była nieaktualna), zweryfikowane programistycznie tą samą metodą. Kanoniczna wersja do dalszego użytku: **v2.0 (Architektura Modułowa)**.

Kanoniczna lista funkcji jest ustalona (579, wg v2.0). Rejestr pokrycia może być liczony względem tej liczby.

---

## 13. Testy

**Reguła.**
- Jądro obliczeniowe: testy jednostkowe obowiązkowe, z wartościami referencyjnymi (Zasada 4).
- Profile krajowe: walidacja schematem w CI.
- Ścieżki użytkownika (UI): weryfikacja w przeglądarce po każdej większej zmianie widocznej dla użytkownika.
- „Nie kompiluje się bez błędów" ≠ „działa poprawnie".

---

## 14. Kolejność budowy (roadmapa wysokopoziomowa)

Fundament → dziedzina → nadbudowa. Kolejne etapy zatwierdzamy osobno.

> **Status (2026‑08‑28):** Etap 1 (szkielet architektury) **wstrzymany** — autor opracowuje projekt szkieletu z innym narzędziem i wróci z decyzją. Do tego czasu **nie zaczynamy kodu**. Poniższa kolejność jest propozycją, jeszcze niezatwierdzoną.
>
> **Wznowione (2026‑08‑29, decyzja autora).** Pauza zakończona — zaczynamy kod wg poniższej kolejności, startując od punktu 1 (szkielet architektury) zgodnie z pakietem standardów `docs/standards/`.

**Skorygowane 2026‑08‑30, druga wersja (jawna korekta, Zasada 14.2 — nic nie usunięte, obie
poprzednie wersje niżej).** Ta roadmapa używa **wyłącznie** numeracji Moduł N (ten sam system co
wszędzie indziej w repo) i **czystej kolejności zależności danych 1→13** (kto czyta dane od kogo —
pełne uzasadnienie per moduł: `docs/pulpit-i-nawigacja.md`, sekcja 2), bez wyjątków. Poprzednia
wersja (0.1.5, niżej) wyciągała Moduł 12 do przodu "na wczesne demo" — **decyzja autora
(2026‑08‑30): to już nieaktualne, porzucone**, wraca do czystej kolejności. Kafel 14 (Ustawienia)
dostaje **własny, jawny punkt** w planie (krok 2) — wcześniej był tylko domyślnie wliczony w
szkielet bez wymienienia z nazwy, co autor uznał za mylące.

1. **Szkielet architektury**: podział core/adapters/app, i18n, StorageAdapter (IndexedDB), profil `PL`, typ `CalcResult`, Reporter, rejestr pokrycia.
2. **Kafel 14 — Ustawienia**: ekran ustawień/preferencji, w tym konfiguracja pulpitu (`docs/pulpit-i-nawigacja.md`) i docelowo profil "Mój sprzęt".
3. **Moduł 1** — Lokalizacja i teren — fundament: klimat, nasłonecznienie, strefy.
4. **Moduł 2** — Zapotrzebowanie energetyczne — potrzebuje 1.
5. **Moduł 3** — Instalacja PV — potrzebuje 1, 2.
6. **Moduł 4** — Magazyn energii / baterie — potrzebuje 2, 3.
7. **Moduł 5** — Okablowanie i zabezpieczenia — potrzebuje 3, 4.
8. **Moduł 6** — Ogrzewanie / pompa ciepła — potrzebuje 1, 2.
9. **Moduł 7** — Stress‑test zimowy — spina moduły 1–6, musi być po nich.
10. **Moduł 8** — Bezpieczeństwo i sytuacje awaryjne — czerpie z 4, 5, 6, 7, 9 (patrz krok 11 niżej — w praktyce budowany równolegle z 9 lub tuż po).
11. **Moduł 9** — Elektronika / ESP32 / sensoryka — infrastruktura, względnie niezależny.
12. **Moduł 10** — AI i prognozy — czerpie z prawie wszystkiego wcześniejszego.
13. **Moduł 11** — Montaż baterii — proceduralny, potrzebuje 4.
14. **Moduł 12** — Szybki kalkulator / tryb mobilny — w większości samodzielny.
15. **Moduł 13** — Tryb Live — monitoring tego, co już zbudowane, ma sens dopiero na końcu.

<details>
<summary>Wersja z 2026‑08‑30, pierwsza korekta (zastąpiona powyżej — wyciągała Moduł 12 do przodu, autor to porzucił)</summary>

1. **Szkielet architektury**: podział core/adapters/app, i18n, StorageAdapter (IndexedDB), profil `PL`, typ `CalcResult`, Reporter, rejestr pokrycia.
2. **Moduł 1 + 2** (Lokalizacja i teren + Zapotrzebowanie energetyczne) — serce danych wejściowych.
3. **Moduł 3 + 4** (Instalacja PV + Magazyn energii/baterie) — najcięższa fizyka.
4. **Moduł 5 + 6** (Okablowanie i zabezpieczenia + Ogrzewanie/pompa ciepła).
5. **Moduł 7** (Stress‑test zimowy) — spina moduły 1–6.
6. **Moduł 12** (Szybki kalkulator / tryb mobilny) — samodzielny, dobry na wczesne demo/free.
7. **Moduł 13** (Tryb Live), **Moduł 9** (ESP32), **Moduł 10** (AI), **Moduł 11** (Montaż baterii, 2 ścieżki chemii), **Moduł 8** (Bezpieczeństwo — spina moduły 4, 5, 6, 7, 9, budować na końcu tego kroku) — nadbudowa zależna od sprzętu/telemetrii.

</details>

<details>
<summary>Wersja pierwotna z 2026‑08‑28 (numeracja "Rozdział", zastąpiona — zachowana jako historia decyzji, Zasada 14.2)</summary>

1. **Szkielet architektury**: podział core/adapters/app, i18n, StorageAdapter (IndexedDB), profil `PL`, typ `CalcResult`, Reporter, rejestr pokrycia.
2. **Rozdział 0 + 1** (Geostruktura + Bilans obciążeń) — serce danych wejściowych.
3. **Rozdział 2 + 3** (PV + Magazyn) — najcięższa fizyka.
4. **Rozdział 4 + 5** (BoS + Termika).
5. **Rozdział 6** (Stress‑test zimowy) — spina wszystko.
6. **Rozdział 8** (Kalkulatory awaryjne) — samodzielny, dobry na wczesne demo/free.
7. **Rozdziały 9–10** (instrukcje montażu), **7** (Live), **11** (ESP32), **12** (AI) — nadbudowa zależna od sprzętu/telemetrii.

</details>

---

## Dziennik zmian

| Wersja zasad | Data | Zmiana |
|---|---|---|
| 0.1.0 | 2026‑08‑28 | Pierwsza wersja konstytucji na podstawie Biblii v1.5. Zarejestrowano Dług D‑01 (niespójność wersji Biblii). |
| 0.1.1 | 2026‑08‑28 | D‑01 częściowo rozstrzygnięty: Rozdział 7 = 50 funkcji (decyzja autora), wartość „3" odrzucona jako błąd scalenia. |
| 0.1.2 | 2026‑08‑28 | §11 podział FREE/PRO zatwierdzony przez autora. §14: Etap 1 (szkielet) wstrzymany — autor projektuje szkielet osobno; kod nie startuje. |
| 0.1.3 | 2026‑08‑29 | D‑01 zamknięty: korekta decyzji z 2026‑08‑28 — Rozdział 7 (Tryb Live) ma 33 funkcje, nie 50 (numeracja 7.9–7.25 nie istnieje w źródle); finalna liczba funkcji Biblii ustalona na 579 (nie 540). Obie wartości zweryfikowane programistycznie na podstawie `Tresc_WSZYSTKIE_MODULY_scalone.md`. |
| 0.1.4 | 2026‑08‑30 | §14: dopisano zastrzeżenie o rozjeździe numeracji "Rozdział" (ta lista) vs "Moduł/Kafel" (`docs/zrodla/`) — nie pokrywają się 1:1, kolejność budowy ≠ kolejność kafli na pulpicie usera. Nowy dokument `docs/pulpit-i-nawigacja.md` (pulpit adaptacyjny, 14 kafli, presety onboardingu) + generyczny mechanizm w `docs/standards/08-ui-ux.md` (8.11). |
| 0.1.5 | 2026‑08‑30 | §14 przepisane na numerację Moduł N (zamiast "Rozdział") — jawna korekta, wersja pierwotna zachowana w zwijanym bloku. Rozstrzygnięcie: stary Rozdział 0–6 to nowy Moduł 1–7 (proste przesunięcie +1, bo stary system liczył od 0), dalej numeracja faktycznie się przetasowała (Live/ESP32/AI/Montaż zamieniły miejsca, Moduł 8 Bezpieczeństwo złożony z kawałków starych 6+11+12, nie istniał jako osobny rozdział). Pełne mapowanie: `docs/pulpit-i-nawigacja.md` §2. |
| 0.1.6 | 2026‑08‑30 | §14 skorygowane po raz drugi (decyzja autora): porzucono wyciąganie Modułu 12 do przodu "na wczesne demo" (nieaktualne) — roadmapa to teraz czysta kolejność zależności danych 1→13, identyczna z kolejnością kafli pulpitu w `docs/pulpit-i-nawigacja.md`. Kafel 14 (Ustawienia) dostał własny, jawny punkt w planie (krok 2) zamiast być domyślnie/niejawnie wliczonym w szkielet. Obie poprzednie wersje zachowane w zwijanych blokach. |
| 0.1.7 | 2026‑09‑04 | Naprawa dryfu (GOD BOOK Część Y.2): dopisano §0.1 "Ekspertyza domenowa" — deklaracja wymagana przez GOD BOOK §0.2, merytorycznie już stosowana przez całą sesję (niezależna weryfikacja wzorów, wyłapywanie sprzeczności fizycznych w źródle), ale nigdy nie zapisana jawnie w konstytucji projektu. |

## Metryczka (stan bieżący)

| Element | Wartość |
|---|---|
| Wersja zasad | 0.1.7 |
| Rozdziały Biblii objęte planem | 13 (0–12 + załączniki) |
| Funkcje Biblii | 579 (zweryfikowane programistycznie, D‑01 zamknięty) |
| Funkcje z zaimplementowanym kodem | 0 |
| Profile krajowe | 0 (planowany start: PL) |
