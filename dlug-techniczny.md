# Dług techniczny — Inżynier Offgrid Pro

**Wersja:** 1.0 | **Filar:** C | **Data utworzenia:** 04.09.2026 | **Ostatnia aktualizacja:** 04.09.2026 | **Status:** Stabilny (rosnący)
**Powiązane dokumenty:** `00_Biblia.md`, `docs/rejestr-pokrycia.md`, `backlog-poza-v1.md`

TL;DR: Rejestr świadomych uproszczeń kodu względem specyfikacji źródła (Część X.4 GOD BOOK) — ekrany zbudowane **częściowo**, gdzie zbudowana część jest kompletna i poprawna, ale źródło opisuje więcej niż jest dziś zaimplementowane. Różni się od `backlog-poza-v1.md`: tam są całe ekrany niezbudowane, tu są ekrany **częściowo** zbudowane z jawnie oznaczoną brakującą resztą.

---

## Ekrany częściowe (świadome, udokumentowane w kodzie i `docs/rejestr-pokrycia.md`)

- **M2/E5 (Profil dobowy + astronomiczny dzień/noc)** — zbudowana tylko część astronomiczna (długość dnia/nocy, formuła Coopera). Sekcja B źródła (profil godzinowych współczynników zapotrzebowania, "0,3 w nocy, 1,5 w szczycie") NIE zbudowana — to przykładowe, nie uniwersalne wartości źródła.
- **M2/E8 (Zaawansowane parametry obciążenia)** — zbudowany tylko podpunkt 1 (moc pozorna/cos φ, wzór podany wprost). Podpunkty 2 (prądy rozruchowe) i 3 (współczynnik jednoczesności) wymagają bazy komponentów/modelu statystycznego nieobecnego w źródle — patrz `backlog-poza-v1.md`.
- **M4/E5 (Grzałki BMS i ochrona przed mrozem)** — zbudowana tylko druga warstwa (drzewo decyzyjne "skąd brać prąd na grzanie"). Pierwsza warstwa (bilans dobowy grzania w kWh) NIE liczona — źródło podaje tylko dwa ilustracyjne przykłady liczbowe, bez wzoru wiążącego temperaturę/czas z energią.
- **M4/E14 (SoH — diagnostyka)** — zbudowana tylko warstwa 2 (rezystancja per ogniwo względem fabrycznej, próg 50%). Warstwa 1 (SoH ogólny metodą coulombowską) wymaga ciągłego logowania historii cykli/temperatury/DoD z BMS w czasie — niemożliwe do policzenia z jednorazowych danych wejściowych.
- **M4/E17 (Second-Life)** — obie metody szacowania SoH (z wieku LUB przebiegu) zbudowane w pełni, ale reprodukują przykład źródła tylko przy self-konsystentnych wartościach własnych — źródło nie podaje dokładnego wieku/przebiegu użytego w swoim przykładzie liczbowym (833 zł/kWh), więc nie da się dopasować dokładnie do jednej konkretnej kombinacji.
- **M3/E17 (Niedopasowanie mocy paneli)** — wzór z Sekcji B zbudowany w pełni i zweryfikowany dokładnie (1,4% strata). Druga liczba z tego samego ekranu (Sekcja C: "strata może sięgać nawet 18%") to osobna, nieformułowa obserwacja źródła o nieliniowym wzroście strat przy większej różnicy mocy — NIE zaimplementowana jako osobne obliczenie, bo źródło nie podaje wzoru na tę nieliniowość.

## Uproszczenia infrastrukturalne (świadome, nie "luki")

- **Brak trwałego zapisu** — patrz `backlog-poza-v1.md`. Wszystkie ekrany liczą poprawnie z inputu w danej sesji, ale nic nie przeżywa odświeżenia strony.
- **Dane demonstracyjne w M8/M10** — jawnie oznaczone w kodzie i UI (`SAMPLE_AUDIT_ITEMS` i odpowiednik w Prognozach) jako placeholder do podłączenia z modułów źródłowych.
- **Pola "docelowo auto z Modułu X" wpisywane ręcznie** — bardzo częsty wzorzec (np. szerokość geograficzna z M1, liczba domowników z M2/E4, produkcja PV z M3) — każdy taki ekran ma hint w UI wprost mówiący, skąd wartość ma docelowo pochodzić, gdy zbuduje się współdzielony stan projektu (Kontrakt zapisu, `kontrakty-rdzenia.md` §3).

---

## Log zmian

| Data | Zmiana |
|---|---|
| 04.09.2026 | Utworzono — ekstrakcja z `docs/rejestr-pokrycia.md` (notatki "częściowo" per ekran). Wersja 1.0. |
