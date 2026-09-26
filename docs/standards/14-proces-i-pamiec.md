# 14 — Proces, wersjonowanie i pamięć projektu

Powiązane: [00 Filozofia](00-filozofia.md) · [15 Współpraca z AI](15-wspolpraca-z-ai.md)

---

## 14.1. Integralność wersji

**Reguła.** Każda wersja dokumentu zasad/standardu i danych ma metryczkę (liczba rozdziałów/funkcji/sekcji, gdzie ma to zastosowanie). **Żadnej funkcji/reguły nie wolno usunąć ani pominąć bez jawnego potwierdzenia zapisanego w dzienniku zmian.** Rejestr pokrycia (dla projektów z dużą liczbą funkcji domenowych): status `todo / in-progress / done` per pozycja, mapowany po identyfikatorze ze specyfikacji źródłowej.

[15.09.2026] ✅ DODANO — źródło: inzynier-offgrid-pro, integracja z rozdz. 09 (AI w produkcie). Pozycja rejestru może dodatkowo nieść opcjonalne pole `zaproponowaneBy: "ai" | "czlowiek"`, gdy pierwszy szkic zasugerował asystent AI działający w produkcie (rozdział 09.10, nie AI piszące kod — rozdział 15). Czysto informacyjne — nie zwalnia z decyzji człowieka o wdrożeniu.

[25.09.2026] ✅ DODANO — źródło: inzynier-offgrid-pro (U.4). **Rejestr pokrycia jest kompletny tylko wtedy, gdy KAŻDA pozycja źródła ma wiersz** — sprawdzane liczbowo (identyfikatory źródła vs identyfikatory rejestru), nie tylko przez zgodność wierszy już istniejących. Zapowiedź "pełne wyliczenie później"/"reszta analogicznie" nie jest wierszem — liczy się jako pominięcie w rozumieniu reguły wyżej. Procedura audytu: GOD BOOK N.1 (kierunek źródło → rejestr).

## 14.2. Dziennik zmian — jawna korekta, nigdy ciche nadpisanie

**Reguła.** Gdy wcześniejsza decyzja okazuje się błędna lub nieaktualna, **nie usuwa się jej z dokumentu**. Zamiast tego: stara decyzja zostaje, oznaczona jako zastąpiona, obok pojawia się nowa decyzja z datą i uzasadnieniem korekty.

**Wzorcowy przykład z praktyki** (jeden z naszych wcześniejszych projektów, 2026-08-29): decyzja D-1 z 28.08 mówiła "Rozdział 7 ma 50 funkcji". Dokładniejsza, programistyczna weryfikacja treści wykazała 33. Zapis w dokumencie:

```
### D‑1 · Rozdział 7 = 33 funkcje (2026‑08‑28, skorygowane 2026‑08‑29)
Pierwotnie: Rozdział 7 ma 50 funkcji [...] — odrzucona.

Korekta (2026‑08‑29, weryfikacja programistyczna): ta decyzja jest zastąpiona.
Rozdział 7 ma 33 realne funkcje [...]. Źródło korekty: [nazwa dokumentu].
```

Stara wartość nie zniknęła — jest widoczna, oznaczona, z powodem zmiany. Ktoś wracający do tej decyzji za rok widzi całą historię rozumowania, nie tylko finalną liczbę.

## 14.3. "Zweryfikowane programistycznie, nie z metryczki"

**Reguła.** Liczby opisujące stan projektu (liczba funkcji, procent pokrycia, status "gotowe") ustala się przeliczeniem rzeczywistej treści, nie ufając deklaratywnemu podsumowaniu dokumentu źródłowego. Dokumenty duże i długo rozwijane systematycznie się rozjeżdżają między tym, co mówi ich własna metryczka, a tym, co faktycznie zawierają.

**Konsekwencja.** Przy scalaniu/audytowaniu dużej specyfikacji: policz rzeczywiste wystąpienia, nie kopiuj liczby z nagłówka dokumentu. Jeśli znajdziesz rozbieżność — to jest dokładnie ten przypadek, w którym trzeba zgłosić konflikt (rozdział 15), nie wybrać liczby "na oko".

## 14.4. Sekcja "Znane luki do domknięcia" jako uczciwa praktyka

**Reguła.** Duży, rozwijany dokument/projekt utrzymuje osobną, widoczną sekcję wprost wymieniającą, co nie jest jeszcze gotowe i dlaczego — zamiast cichego przemilczenia niedokończonych fragmentów.

**Uzasadnienie.** To bezpośrednia konsekwencja zasady "zero cichych błędów" (00.4) zastosowana do dokumentacji, nie tylko kodu. Sekcja taka jest też pierwszym miejscem, w którym warto szukać przy podejrzeniu, że coś "zniknęło" — jeśli luka jest tam wymieniona, jest świadoma; jeśli nie, prawdopodobnie jest przeoczeniem wartym zgłoszenia.

## 14.5. `docs/memory.md` — obowiązkowy per projekt

**Cel.** Agent AI (i człowiek wracający po przerwie) nie re-eksploruje kontekstu od zera i nie powtarza błędów już raz znalezionych → taniej (mniej tokenów/czasu na eksplorację), szybciej, bezbłędniej.

**Różnica względem `CLAUDE.md`.** `CLAUDE.md` (rozdział 15) to stabilne instrukcje "jak pracować" — rzadko się zmienia. `docs/memory.md` to żywy, rosnący log "co już wiemy o tym konkretnym projekcie" — zmienia się regularnie. `CLAUDE.md` krótko odsyła do `docs/memory.md`, nigdy nie duplikuje jego treści.

**Obowiązkowe sekcje:**
- **Decyzje i uzasadnienie** — co i dlaczego zrobiono tak, a nie inaczej.
- **Pułapki i lekcje** — konkretne błędy już popełnione + jak ich unikać (np. "dwa lockfile naraz zerwały deploy — nigdy nie dodawaj drugiego menedżera pakietów", patrz rozdział 11.1).
- **Konwencje specyficzne dla projektu** — te, które nie są pokryte przez ten ogólny standard.
- **Otwarte sprawy / dług** — pytania czekające na decyzję.
- **Mapa orientacyjna** — gdzie czego szukać, kluczowe pliki/wzorce tego konkretnego repo.

Wpisy krótkie: data + treść, nie eseje.

**Zasada aktualizacji.** Agent AI czyta `docs/memory.md` na starcie każdej sesji pracy nad projektem. Dopisuje wpis po: nietrywialnej decyzji architektonicznej, znalezionym i naprawionym błędzie/pułapce wartej zapamiętania, zamknięciu większego etapu, odkrytej rozbieżności/konflikcie w dokumentacji. **Nie** po każdym drobnym commicie — inaczej plik się zaśmieca i przestaje być użyteczny.

**Lokalizacja.** `docs/memory.md` w root każdego naszego projektu — w tym w repozytorium, w którym trzyma się ten sam standard (decyzje podjęte przy budowie/rozwoju standardu też są warte zapamiętania).
