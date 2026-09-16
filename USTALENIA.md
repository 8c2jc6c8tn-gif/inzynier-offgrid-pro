# USTALENIA — Inżynier Offgrid Pro

> ⚠️ **[04.09.2026] ZASTĄPIONE — treść zachowana, nie usunięta (Część D GOD BOOK).**
> Rolę konstytucji projektu od 04.09.2026 pełni kanoniczna Biblia w formacie GOD BOOK: zacznij
> od **`00_Biblia.md`**. D‑1/D‑2 tego pliku odpowiadają D1/D2 w `rejestr-decyzji.md`. Ten plik
> zostaje jako materiał historyczny, **nic z niego nie zniknęło**. Decyzja migracji: `rejestr-decyzji.md` D19.

**Projekt:** Inżynier Offgrid Pro (aplikacja Off‑Grid PV)
**Cel dokumentu:** historyczny — jedno miejsce, w którym spisane były WSZYSTKIE zatwierdzone zasady i decyzje, zastąpiony przez `00_Biblia.md` (04.09.2026)
**Wersja zasad:** 0.1.7 (ostatnia wersja przed migracją)
**Data:** 2026‑08‑30
**Target:** Web / PWA (offline‑first), architektura gotowa na przeniesienie na mobile

> Uwaga: kolejność budowy aplikacji (dawny „punkt B" / §14 roadmapy) była celowo **pominięta** w tym dokumencie jako wstrzymana. **Wznowiona 2026‑08‑29** (decyzja autora) — pełna kolejność i status w `ZASADY_APLIKACJI.md` §14. Start: szkielet architektury, potem Moduł 1+2 (Lokalizacja i teren + Zapotrzebowanie energetyczne). Numeracja skorygowana 2026‑08‑30 z "Rozdział" na "Moduł" — patrz `ZASADY_APLIKACJI.md` §14.

---

## CZĘŚĆ I — Zasady architektoniczne (obowiązujące)

### 0. Ekspertyza domenowa

Zgodnie z GOD BOOK §0.2 (`docs/god-book/instrukcja-uniwersalna-biblii-projektu-v2_19.md`): AI
przyjmuje personę doświadczonego eksperta domeny, automatycznie, bez czekania na polecenie.

**Ekspertyza domenowa: elektryk / inżynier instalacji off‑grid PV, poziom: senior / 20 lat
doświadczenia w terenie.** Pełne uzasadnienie: `ZASADY_APLIKACJI.md` §0.1.

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
5. **Pulpit adaptacyjny** — pulpit (13 kafli + Kafel 14 Ustawienia) i wnętrze każdego modułu używają tego samego mechanizmu personalizacji (proponuje, user zawsze zmienia, nic nie znika). Szczegóły: `docs/standards/08-ui-ux.md` §8.11, `docs/pulpit-i-nawigacja.md`.

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

### D‑1 · Rozdział 7 (Tryb Live) = 33 funkcje  (2026‑08‑28, skorygowane 2026‑08‑29)
Pierwotnie: Rozdział 7 ma **50 funkcji**, wartość „3" widoczna w źródle uznana za błąd scalenia w powtórzonym bloku Biblii — odrzucona.

**Korekta (2026‑08‑29, weryfikacja programistyczna):** ta decyzja jest zastąpiona. Rozdział 7 (Tryb Live) ma **33 realne funkcje** (7.1–7.8 + 7.26–7.50; numeracja 7.9–7.25 nie istnieje w treści źródłowej). Wartość „50" odrzucona. Źródło: `Tresc_WSZYSTKIE_MODULY_scalone.md`, ustalone przeliczeniem faktycznej treści, nie z metryczki dokumentu.

### D‑2 · Podział FREE / PRO  (2026‑08‑28)
| Tier | Zakres |
|---|---|
| **FREE** | 1 projekt · tryb prosty · kalkulatory awaryjne (dawny Rozdz. 8, dzisiejszy Moduł 12) |
| **PRO** | wiele projektów · Tryb Inżyniera · stress‑test zimowy · tryb Live · eksport PDF/CSV · AI |

---

## CZĘŚĆ III — Sprawy otwarte (do rozstrzygnięcia)

- **Punkt B — kolejność budowy / szkielet architektury:** ~~wstrzymane~~ → **wznowione 2026‑08‑29** (decyzja autora), patrz notatka na górze dokumentu i `ZASADY_APLIKACJI.md` §14. Kod startuje.

> **Dług D‑01 — zamknięty (2026‑08‑29).** Kanoniczna wersja Biblii: **v2.0 (Architektura Modułowa)**.
> Finalna łączna liczba funkcji: **579** (nie 540 — metryczka źródła była nieaktualna), zweryfikowane
> programistycznie na podstawie `Tresc_WSZYSTKIE_MODULY_scalone.md`. Patrz też D‑1 (CZĘŚĆ II) —
> korekta Rozdziału 7 z 50 na 33 funkcje, część tej samej weryfikacji.

---

## Metryczka (stan bieżący)

| Element | Wartość |
|---|---|
| Wersja zasad | 0.1.7 |
| Rozdziały Biblii objęte planem | 13 (0–12 + załączniki) |
| Funkcje Biblii | 579 (zweryfikowane programistycznie, D‑01 zamknięty) |
| Funkcje z zaimplementowanym kodem | 0 |
| Profile krajowe | 0 (planowany start: PL) |

> Pełna, szczegółowa wersja zasad z uzasadnieniami i przykładami kodu: **`ZASADY_APLIKACJI.md`**.
