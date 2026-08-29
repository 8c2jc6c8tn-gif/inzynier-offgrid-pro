# USTALENIA — Inżynier Offgrid Pro

**Projekt:** Inżynier Offgrid Pro (aplikacja Off‑Grid PV)
**Cel dokumentu:** jedno miejsce, w którym spisane są WSZYSTKIE zatwierdzone zasady i decyzje.
**Wersja zasad:** 0.1.2
**Data:** 2026‑08‑28
**Target:** Web / PWA (offline‑first), architektura gotowa na przeniesienie na mobile

> Uwaga: kolejność budowy aplikacji (dawny „punkt B" / §14 roadmapy) jest celowo **pominięta** w tym dokumencie — jest wstrzymana, bo autor projektuje szkielet osobno.

---

## CZĘŚĆ I — Zasady architektoniczne (obowiązujące)

### 1. Filozofia
1. Aplikacja liczy **twarde fakty fizyczne**, nie opinie. Każdy wynik da się wyprowadzić ze wzoru.
2. Aplikacja **ostrzega przed pułapkami** inżynierskimi (Załącznik A Biblii).
3. Aplikacja działa **w pełni offline** po pierwszym pobraniu danych klimatycznych/PV.
4. Aplikacja tłumaczy „po ludzku" (Migawki) **i** pokazuje twardą fizykę (wzory).

### 2. Logika nie wie nic o platformie
- Cała logika inżynierska w **czystym TypeScript**, funkcje bez efektów ubocznych.
- Bez importów z React / Next.js / DOM / `window` / `fetch` / bazy / systemu plików.
- Podział: `core/` (czysta logika) · `adapters/` (platforma za interfejsami) · `app/` (widok, wymienny na mobile).
- Lint pilnuje: `core` nie importuje z `app` ani `adapters`.

### 3. Jądro obliczeniowe
- Każda funkcja **czysta i deterministyczna**.
- Zwraca strukturę wyniku (`CalcResult`): `value`, `unit`, `formula` (LaTeX), `inputs`, `assumptions`, `warnings`, `traceId`.
- **Zakaz „magicznych liczb"** — stałe z nazwanych stałych lub z profilu krajowego.

### 4. Podwójna weryfikacja obliczeń
- Każdy krytyczny wzór (przekrój kabla, Voc przy mrozie, bezpiecznik AIC, pojemność baterii, moc falownika) ma **dwie niezależne ścieżki**: analityczną + test referencyjny.
- Rozbieżność ponad tolerancję = **build fail**.

### 5. Profile krajowe jako dane, nie kod
- Wszystko zależne od kraju/regionu w **plikach JSON** (walidacja Zod), nigdy `if (kraj === 'PL')`.
- Nowy kraj = nowy plik JSON, bez zmian w jądrze. Start: profil **PL**.

### 6. Offline‑first
- Web: **IndexedDB** na dane trwałe, service worker na assety, zapytania online (PVGIS/PVWatts, geolokalizacja) buforowane na stałe.
- Stan projektu przez `StorageAdapter` (IndexedDB dziś, SQLite mobile jutro).
- **Zakaz** `localStorage` jako bazy stanu projektu (tylko drobne preferencje UI).

### 7. Model danych = tabele z Biblii
- Nazwy encji wprost z Biblii; jedna funkcja Biblii → jeden moduł o tym samym ID.
- Mapowanie 1:1 z Biblią (warunek integralności i nawigacji).

### 8. UI
1. **Migawki `[ i ]`** — dymek z zakładkami „Po ludzku" i „Fizyka" (LaTeX). Treść z `formula` + `assumptions`, nie przepisywana ręcznie.
2. **Tryb Inżyniera** — przełącznik globalny; domyślnie tryb prosty (suwaki, kafle). Stan trwały.
3. **Powiązania Bloków** — pole `powiazania: string[]`; linki w UI + propagacja danych między funkcjami.
4. **Mobile‑first** — dotyk ≥44px, input ≥16px, brak auto‑zoom iOS, potem desktop.

### 9. Audit trail i błędy
- Każde nietrywialne przeliczenie loguje: `traceId`, funkcja, wejścia, wynik, wersja jądra, czas („Czarna Skrzynka").
- Błędy do jednego `Reporter` (adapter): użytkownik widzi „po ludzku", log niesie szczegóły.
- **Zero cichych `catch {}`.**

### 10. Bezpieczeństwo
- Żaden sekret / klucz API / logika płatności **nie trafia do klienta**.
- Walidacja i sanityzacja każdego wejścia.
- Nagłówki: `X-Content-Type-Options`, `Referrer-Policy`, `Strict-Transport-Security`, `Permissions-Policy` (geolokalizacja `=(self)`).
- Odpowiedniki natywne (Keystore/Keychain, obfuskacja, SSL pinning) mapowane na web/PWA; restore purchases → Stripe.

### 11. Freemium i płatności
- Podział free/pro **danymi** (`feature → tier`), egzekwowany **po stronie serwera**.
- Płatności przez **Stripe** (idempotency keys). Subskrypcje App/Play Store dopiero na mobile.

### 12. Integralność wersji
- Każda wersja ma metryczkę (rozdziały, funkcje, sekcje).
- **Żadnej funkcji nie wolno usunąć/pominąć bez wpisu w dzienniku.**
- Rejestr pokrycia: status `todo / in‑progress / done` po ID z Biblii.

### 13. Testy
- Jądro: testy jednostkowe z wartościami referencyjnymi (obowiązkowe).
- Profile krajowe: walidacja schematem w CI.
- UI: weryfikacja w przeglądarce po większych zmianach.
- „Kompiluje się" ≠ „działa poprawnie".

---

## CZĘŚĆ II — Decyzje zatwierdzone przez autora

### D‑1 · Rozdział 7 = 50 funkcji  (2026‑08‑28)
Rozdział 7 ma **50 funkcji**. Wartość „3" widoczna w źródle to **błąd scalenia** w powtórzonym bloku Biblii — odrzucona.

### D‑2 · Podział FREE / PRO  (2026‑08‑28)
| Tier | Zakres |
|---|---|
| **FREE** | 1 projekt · tryb prosty · kalkulatory awaryjne (Rozdz. 8) |
| **PRO** | wiele projektów · Tryb Inżyniera · stress‑test zimowy · tryb Live · eksport PDF/CSV · AI |

---

## CZĘŚĆ III — Sprawy otwarte (do rozstrzygnięcia)

- **Dług D‑01 (reszta):** która wersja Biblii jest kanoniczna (1.5 vs 1.7) oraz finalna łączna liczba funkcji — weryfikacja, czy przy Rozdz. 7 = 50 suma domyka się do 540.
- **Punkt B — kolejność budowy / szkielet architektury:** wstrzymane. Autor projektuje szkielet z innym narzędziem i wróci z decyzją. **Do tego czasu nie startujemy kodu.**

---

## Metryczka (stan bieżący)

| Element | Wartość |
|---|---|
| Wersja zasad | 0.1.2 |
| Rozdziały Biblii objęte planem | 13 (0–12 + załączniki) |
| Funkcje Biblii (wg metryczki źródła) | 540 — do potwierdzenia (D‑01) |
| Funkcje z zaimplementowanym kodem | 0 |
| Profile krajowe | 0 (planowany start: PL) |

> Pełna, szczegółowa wersja zasad z uzasadnieniami i przykładami kodu: **`ZASADY_APLIKACJI.md`**.
