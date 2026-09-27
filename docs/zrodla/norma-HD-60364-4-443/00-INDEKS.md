# SRPS HD 60364-4-443:2017 — Instalacje elektryczne niskiego napięcia, Część 4-44:
# Ochrona dla bezpieczeństwa, Punkt 443: Ochrona przed przepięciami pochodzenia
# atmosferycznego lub łączeniowego

**Status: ✅ pełny tekst, natywny PDF (nie skan), przeczytany w całości w tej sesji.**

Plik: `SRPS-HD-60364-4-443-2017-zastrzezenia-przepieciowe.pdf` (18 stron). To jest **serbska
wersja językowa** (SRPS = Institut za standardizaciju Srbije) dokumentu harmonizacyjnego
CENELEC **HD 60364-4-443:2016**, identyczna technicznie z polską PN-HD 60364-4-443 (nie mamy
polskiej wersji w repo — ale HD to dokument harmonizacyjny CENELEC: treść normatywna, wzory,
tabele i wartości liczbowe są identyczne we wszystkich wersjach językowych, różni się tylko
język opisowy). Tekst dokumentu zawiera równolegle terminy angielskie przy każdym akapicie
serbskim, co ułatwia weryfikację.

**Wypełnia bezpośrednio pozycję 🟡 "HD 60364-4-443" z `docs/normy-brakujace.md`** (patrz aktualizacja tego pliku).

## Zawartość

- **443.4 Zarządzanie przepięciem** — kiedy ochrona SPD jest obowiązkowa (m.in. gdy skutki
  przepięcia zagrażają życiu, usługom publicznym, dziedzictwu kulturowemu, działalności
  komercyjnej/przemysłowej lub dotyczą dużej liczby osób) vs. kiedy wymaga oceny ryzyka (wzór
  443.5) vs. wyjątek dla pojedynczych jednostek mieszkalnych (gdy wartość instalacji < 5×
  wartość SPD).
- **443.5 Metoda oceny ryzyka (CRL)** — wzór `CRL = f_env / (L_P × N_g)`:
  - `f_env`: 85×F (obszar wiejski/podmiejski) lub 850×F (obszar miejski), F zwykle =1.
  - `N_g`: gęstość wyładowań atmosferycznych w ziemię (uderzenia/km²/rok), `N_g ≈ 0,1 × T_d`
    (T_d = liczba dni burzowych w roku wg mapy izokeraunicznej).
  - `L_P = 2·L_PAL + L_PCL + 0,4·L_PAH + 0,2·L_PCH` (długości linii napowietrznych/kablowych
    nn/WN, ograniczone do 1 km).
  - Jeśli CRL ≥ 1000 → SPD niekonieczne; jeśli CRL < 1000 → SPD wymagane.
  - Załącznik A: 4 w pełni rozwiązane przykłady liczbowe (dom wiejski, dom wiejski zasilany z
    WN, dom miejski napowietrznie, budynek miejski kablem podziemnym) — gotowe do
    bezpośredniego wykorzystania jako test/przykład referencyjny w kodzie.
- **443.6 Klasyfikacja znamionowych napięć udarowych (kategorie przepięć I–IV)** — Tabela 443.2:
  wymagane U_W (kV) wg napięcia znamionowego instalacji (120/208, 230/400, 400/690, 1000,
  1500 DC) × kategoria przepięcia (I–IV). Np. dla 230/400 V: kategoria IV = 6 kV, III = 4 kV,
  II = 2,5 kV, I = 1,5 kV.
- **Załącznik ZA (normatywny)** — odstępstwa krajowe (Norwegia: SPD zawsze obowiązkowe; Niemcy,
  Finlandia, UK, Hiszpania: warianty progu/zwolnień) — nieistotne dla Polski, ale pokazują
  rozrzut praktyki europejskiej.
- **Załącznik B (informacyjny)** — rozmieszczenie SPD na liniach napowietrznych (co 0,5–1 km).

## Trafność w domenie off-grid PV

Bezpośrednio uzupełnia **Moduł 5 (`ochrona-przepieciowa-spd`, `docs/rejestr-pokrycia.md` wiersz
2)** — dziś ten ekran (wg wcześniejszych notatek w `docs/memory.md`) liczy margines napięciowy
SPD i próg uziemienia, ale **nie liczy formalnie wymogu instalacji SPD metodą CRL** ani nie
klasyfikuje kategorii przepięć (I–IV) urządzeń w łańcuchu instalacji off-grid (falownik,
regulator MPPT, akumulator, rozdzielnica). Wzór CRL + 4 przykłady liczbowe z Załącznika A dają
gotowy materiał do ewentualnego rozszerzenia tego ekranu o samodzielne uzasadnienie "czy SPD
jest tu wymagane" zamiast zakładania SPD zawsze.

## Status wykorzystania

Pozyskana i przeanalizowana (ta sesja), jeszcze niewykorzystana w kodzie.

**[27.09.2026] ✅ Wykorzystana w kodzie:** 443.4 (skutki krytyczne) + 443.5 (CRL, Tablica 443.1, reguły długości)
→ `lib/core/modules/okablowanie/ocena-ryzyka-crl/`, sekcja na ekranie M5/E2; 4 przykłady Załącznika A jako testy.
Zweryfikowane w PDF: symbole „<”/„≥” progu 1000 giną w ekstrakcji tekstu — rozstrzygnięte przykładami A.1–A.4 (CRL < 1000
→ wymagany). Przypis krajowy SRPS: w HD błąd „90 m”, powinno być 900 m (reszta do 1 km). **Uwaga do streszczenia wyżej:**
wyjątek dla mieszkań w tekście serbskim brzmi „wartość instalacji pięć razy mniejsza od wartości SPD”, a nie
„< 5 × wartość SPD” — rozbieżność niezweryfikowana z wersją PL/EN, wyjątek niewdrożony (TD21). Tablica 443.2 niewykorzystana.
