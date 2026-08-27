# ZASADY_APLIKACJI.md

**Projekt:** Inżynier Offgrid Pro (aplikacja Off‑Grid PV)
**Status dokumentu:** żywy — konstytucja projektu
**Wersja zasad:** 0.1.2
**Data:** 2026‑08‑28
**Źródło wymagań:** „Biblia Off‑Grid PV" v1.5 (nagłówek) / metryczka v1.7 — patrz Dług D‑01
**Target:** Web / PWA (offline‑first), architektura przygotowana na przeniesienie na mobile

---

## 0. Jak czytać ten dokument

Ten plik jest **nadrzędny wobec kodu**. Jeśli kod i ten dokument się nie zgadzają — dokument wygrywa albo dokument zostaje świadomie zmieniony (z wpisem w dzienniku zmian). To nie jest specyfikacja funkcji — te są w „Biblii". To jest zbiór **reguł architektonicznych i procesowych**, według których każda z ~540 funkcji ma być budowana.

Każda zasada ma: **regułę → uzasadnienie → konsekwencję w kodzie**.

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
- **FREE:** 1 projekt, tryb prosty, kalkulatory awaryjne (Rozdz. 8).
- **PRO:** wiele projektów, Tryb Inżyniera, stress‑test zimowy, tryb Live, eksport PDF/CSV, AI.

---

## 12. Integralność wersji (Zasada 5 Notatek Systemowych)

**Reguła.**
- Każda wersja dokumentu i danych ma **metryczkę**: liczba rozdziałów, funkcji, sekcji.
- **Żadnej funkcji nie wolno usunąć ani pominąć bez jawnego potwierdzenia** zapisanego w dzienniku zmian.
- Rejestr pokrycia: dla każdej z ~540 funkcji status `todo / in‑progress / done`, mapowany po ID z Biblii.

**Dług D‑01 (częściowo rozstrzygnięty).** Biblia 1.5 jest wewnętrznie niespójna: nagłówek/stopka mówią „1.5", metryczka „1.7 / 540 funkcji", a spis treści jednego z powtórzonych bloków skraca Rozdz. 7 do 3 funkcji.

- **Rozstrzygnięte (2026‑08‑28, decyzja autora):** Rozdział 7 ma **50 funkcji**. Wartość „3" to błąd scalenia w powtórzonym bloku i jest odrzucona.
- **Do rozstrzygnięcia:** wersja kanoniczna (1.5 vs 1.7) i finalna łączna liczba funkcji (weryfikacja, czy przy Rozdz. 7 = 50 suma domyka się do 540).

Ustalamy **jedną kanoniczną listę funkcji** zanim policzymy pokrycie. Do tego czasu rejestr pokrycia jest wstępny.

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

1. **Szkielet architektury**: podział core/adapters/app, i18n, StorageAdapter (IndexedDB), profil `PL`, typ `CalcResult`, Reporter, rejestr pokrycia.
2. **Rozdział 0 + 1** (Geostruktura + Bilans obciążeń) — serce danych wejściowych.
3. **Rozdział 2 + 3** (PV + Magazyn) — najcięższa fizyka.
4. **Rozdział 4 + 5** (BoS + Termika).
5. **Rozdział 6** (Stress‑test zimowy) — spina wszystko.
6. **Rozdział 8** (Kalkulatory awaryjne) — samodzielny, dobry na wczesne demo/free.
7. **Rozdziały 9–10** (instrukcje montażu), **7** (Live), **11** (ESP32), **12** (AI) — nadbudowa zależna od sprzętu/telemetrii.

---

## Dziennik zmian

| Wersja zasad | Data | Zmiana |
|---|---|---|
| 0.1.0 | 2026‑08‑28 | Pierwsza wersja konstytucji na podstawie Biblii v1.5. Zarejestrowano Dług D‑01 (niespójność wersji Biblii). |
| 0.1.1 | 2026‑08‑28 | D‑01 częściowo rozstrzygnięty: Rozdział 7 = 50 funkcji (decyzja autora), wartość „3" odrzucona jako błąd scalenia. |
| 0.1.2 | 2026‑08‑28 | §11 podział FREE/PRO zatwierdzony przez autora. §14: Etap 1 (szkielet) wstrzymany — autor projektuje szkielet osobno; kod nie startuje. |

## Metryczka (stan bieżący)

| Element | Wartość |
|---|---|
| Wersja zasad | 0.1.2 |
| Rozdziały Biblii objęte planem | 13 (0–12 + załączniki) |
| Funkcje Biblii (wg metryczki źródła) | 540 — do potwierdzenia (D‑01) |
| Funkcje z zaimplementowanym kodem | 0 |
| Profile krajowe | 0 (planowany start: PL) |
