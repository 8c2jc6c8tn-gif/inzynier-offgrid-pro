# Dług techniczny — Inżynier Offgrid Pro

**Wersja:** 1.1 | **Filar:** C | **Data utworzenia:** 04.09.2026 | **Ostatnia aktualizacja:** 05.09.2026 | **Status:** Stabilny (rosnący)
**Powiązane dokumenty:** `00_Biblia.md`, `docs/rejestr-pokrycia.md`, `backlog-poza-v1.md`

TL;DR: Rejestr świadomych uproszczeń kodu względem specyfikacji źródła (Część X.4 GOD BOOK) — ekrany zbudowane **częściowo**, gdzie zbudowana część jest kompletna i poprawna, ale źródło opisuje więcej niż jest dziś zaimplementowane. Różni się od `backlog-poza-v1.md`: tam są całe ekrany niezbudowane, tu są ekrany **częściowo** zbudowane z jawnie oznaczoną brakującą resztą. **To jest indeks, nie kopia** — każdy wpis TD# odpowiada spójnemu markerowi `🔎 TD#` w kodzie źródłowym (GOD BOOK X.4, rozszerzenie 04.09.2026, wersja 2.8); audyt (Część N) sprawdza zgodność w obie strony przez `grep -rn "🔎 TD"`.

---

## Ekrany częściowe (świadome, udokumentowane w kodzie i `docs/rejestr-pokrycia.md`)

[05.09.2026] ✅ DODANO — źródło: audyt GOD BOOK Część N wykonany na żądanie właściciela projektu. Wpisy niżej istniały już od 04.09.2026 (utworzenie pliku), ale bez numerów TD# i bez kotwiczenia w kodzie — GOD BOOK v2.8 (rozszerzenie X.4, tego samego dnia) tego wymaga, a synchronizacja Y.6/Y.9 z 04.09.2026 sprawdziła tylko istnienie pliku, nie jego zgodność z formatem X.4. Naprawione teraz: każdy wpis dostał numer TD# i odpowiadający marker `🔎 TD#` w `calculator.ts` modułu. Treść merytoryczna wpisów niezmieniona.

- **TD1 (04.09.2026) — moduł: M2/E5 (Profil dobowy + astronomiczny dzień/noc), co skrócono:** zbudowana tylko część astronomiczna (długość dnia/nocy, formuła Coopera). Sekcja B źródła (profil godzinowych współczynników zapotrzebowania, "0,3 w nocy, 1,5 w szczycie") NIE zbudowana — to przykładowe, nie uniwersalne wartości źródła. **Ryzyko:** brak, dopóki UI nie sugeruje kompletności profilu godzinowego. **Priorytet naprawy:** niski. **Kod:** `lib/core/modules/zapotrzebowanie/profil-astronomiczny/calculator.ts`.
- **TD2 (04.09.2026) — moduł: M2/E8 (Zaawansowane parametry obciążenia), co skrócono:** zbudowany tylko podpunkt 1 (moc pozorna/cos φ, wzór podany wprost). Podpunkty 2 (prądy rozruchowe) i 3 (współczynnik jednoczesności) wymagają bazy komponentów/modelu statystycznego nieobecnego w źródle — patrz `backlog-poza-v1.md`. **Ryzyko:** brak — ekran nie sugeruje pokrycia podpunktów 2/3. **Priorytet naprawy:** niski (czeka na dane, nie na czas programisty). **Kod:** `lib/core/modules/zapotrzebowanie/moc-pozorna-cosfi/calculator.ts`.
- **TD3 (04.09.2026) — moduł: M4/E5 (Grzałki BMS i ochrona przed mrozem), co skrócono:** zbudowana tylko druga warstwa (drzewo decyzyjne "skąd brać prąd na grzanie"). Pierwsza warstwa (bilans dobowy grzania w kWh) NIE liczona — źródło podaje tylko dwa ilustracyjne przykłady liczbowe, bez wzoru wiążącego temperaturę/czas z energią. **Ryzyko:** brak — pierwsza warstwa nigdzie nie jest sugerowana jako policzona. **Priorytet naprawy:** niski (czeka na dane). **Kod:** `lib/core/modules/baterie/grzalki-bms-mroz/calculator.ts`.
- **TD4 (04.09.2026) — moduł: M4/E14 (SoH — diagnostyka), co skrócono:** zbudowana tylko warstwa 2 (rezystancja per ogniwo względem fabrycznej, próg 50%). Warstwa 1 (SoH ogólny metodą coulombowską) wymaga ciągłego logowania historii cykli/temperatury/DoD z BMS w czasie — niemożliwe do policzenia z jednorazowych danych wejściowych. **Ryzyko:** brak — ekran jawnie nazwany "per ogniwo", nie "SoH ogólny". **Priorytet naprawy:** średni (wymaga architektury logowania w czasie, nie tylko brakujących danych — większy krok niż TD1-3). **Kod:** `lib/core/modules/baterie/soh-per-ogniwo/calculator.ts`.
- **TD5 (04.09.2026) — moduł: M3/E17 (Niedopasowanie mocy paneli), co skrócono:** wzór z Sekcji B zbudowany w pełni i zweryfikowany dokładnie (1,4% strata). Druga liczba z tego samego ekranu (Sekcja C: "strata może sięgać nawet 18%") to osobna, nieformułowa obserwacja źródła o nieliniowym wzroście strat przy większej różnicy mocy — NIE zaimplementowana jako osobne obliczenie, bo źródło nie podaje wzoru na tę nieliniowość. **Ryzyko:** brak. **Priorytet naprawy:** niski (czeka na wzór ze źródła, nie budować wymyślonej nieliniowości). **Kod:** `lib/core/modules/pv/niedopasowanie-paneli/calculator.ts`.

**M4/E17 (Second-Life) — poza numeracją TD#, świadomie.** Obie metody szacowania SoH (z wieku LUB przebiegu) zbudowane w pełni, ale reprodukują przykład źródła tylko przy self-konsystentnych wartościach własnych — źródło nie podaje dokładnego wieku/przebiegu użytego w swoim przykładzie liczbowym (833 zł/kWh). To nie jest skrócona implementacja (kod jest kompletny wg specyfikacji) — to ograniczenie weryfikowalności przykładu źródłowego, inny rodzaj wpisu niż TD1-TD5, dlatego bez markera w kodzie i bez numeru TD#.

## Uproszczenia infrastrukturalne (świadome, nie "luki")

- **Brak trwałego zapisu** — patrz `backlog-poza-v1.md`. Wszystkie ekrany liczą poprawnie z inputu w danej sesji, ale nic nie przeżywa odświeżenia strony.
- **Dane demonstracyjne w M8/M10** — jawnie oznaczone w kodzie i UI (`SAMPLE_AUDIT_ITEMS` i odpowiednik w Prognozach) jako placeholder do podłączenia z modułów źródłowych.
- **Pola "docelowo auto z Modułu X" wpisywane ręcznie** — bardzo częsty wzorzec (np. szerokość geograficzna z M1, liczba domowników z M2/E4, produkcja PV z M3) — każdy taki ekran ma hint w UI wprost mówiący, skąd wartość ma docelowo pochodzić, gdy zbuduje się współdzielony stan projektu (Kontrakt zapisu, `kontrakty-rdzenia.md` §3).

---

## Log zmian

| Data | Zmiana |
|---|---|
| 04.09.2026 | Utworzono — ekstrakcja z `docs/rejestr-pokrycia.md` (notatki "częściowo" per ekran). Wersja 1.0. |
| 05.09.2026 | **Wynik audytu GOD BOOK Część N** (nie rutynowa integracja): wpisy przenumerowane na TD1–TD5 wg formatu X.4 (moduł/co skrócono/ryzyko/priorytet), dodano odpowiadające markery `🔎 TD#` w 5 plikach `calculator.ts` (kotwiczenie w kodzie, rozszerzenie X.4 z GOD BOOK v2.8 — istniało od 04.09.2026, nigdy nie zastosowane). M4/E17 oznaczone jawnie jako poza numeracją TD# (inny rodzaj wpisu — ograniczenie weryfikacji przykładu źródła, nie skrócona implementacja). Treść merytoryczna wszystkich wpisów zachowana bez zmian. Wersja 1.0→1.1. |
