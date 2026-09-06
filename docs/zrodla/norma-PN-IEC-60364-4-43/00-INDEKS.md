# Indeks — PN-IEC 60364-4-43:1999 (Instalacje elektryczne w obiektach budowlanych —
Ochrona dla zapewnienia bezpieczeństwa — Ochrona przed prądem przetężeniowym) (Wyciąg)

Źródło: `docs/zrodla/norma-PN-IEC-60364-4-43/PN-IEC-60364-4-43-1999-Ochrona-przed-pradem-przetezeniowym.doc`
(plik `.doc` Word 95/97, dostarczony przez właściciela projektu, prywatne tłumaczenie/wyciąg z 2002).
Metoda ekstrakcji: `antiword`/`wvHtml` — natywny tekst, nie OCR.

## ✅ Ten dokument jest kompletny — w odróżnieniu od PN-IEC 60364-4-41 w tym samym dostarczonym
zestawie, tutaj **żadna tabela ani wzór nie zaginęły**. Dwie niezależne metody ekstrakcji (tekstowa
ASCII-art z `antiword` i strukturalna HTML `<table>` z `wvHtml`) dały **identyczny wynik** dla
jedynej tabeli liczbowej dokumentu (Tablica 43A) — wysoka pewność poprawności.

## Zawartość

| Plik | Zawartość |
|---|---|
| [`01-tresc-normy.md`](01-tresc-normy.md) | Pełny tekst: 431 (postanowienia ogólne), 432 (rodzaje urządzeń zabezpieczających), 433 (zabezpieczenie przed przeciążeniem, wzór koordynacji IB≤In≤Iz), 434 (zabezpieczenie przed zwarciem, wzór adiabatyczny I²t=k²S², **Tablica 43A** — współczynnik k dla przewodów roboczych/fazowych), 435 (koordynacja zabezpieczeń), 436 (ograniczenie prądu przez źródło) |

## Dlaczego ten dokument jest ważny

**Tablica 43A** to dokładnie ta tablica, do której odsyła Załącznik A normy PN-HD 60364-5-54
(`docs/zrodla/norma-PN-HD-60364-5-54/05-przewody-ochronne-543.md`, wzór S=√(I²t)/k, gdzie k₁ =
"wartość k dla przewodu fazowego... z Tablicy A.54.1 lub z HD 384.4.43, Tablica 43A"). Dotąd
mieliśmy tylko połowę układanki — Załącznik A normy 5-54 podaje k₂ (przewód **ochronny**), a
Tablica 43A tutaj podaje k₁ (przewód **roboczy/fazowy**). Razem komplet danych potrzebnych do
poprawnego wzoru na minimalny przekrój przewodu ochronnego, gdy jest on z innego materiału niż
przewód fazowy.

Wzór koordynacji **IB ≤ In ≤ Iz** oraz **I₂ ≤ 1,45 × Iz** (433.2) to kanoniczny wzór doboru
zabezpieczenia nadprądowego względem obciążalności kabla — bezpośrednio przydatny dla przyszłych
kalkulatorów doboru bezpiecznika/wyłącznika (uzupełnia już istniejący `dobor-bezpiecznika-rozlacznika`
w Module 5, który dziś liczy tylko I×1,25 dla zabezpieczenia zwarciowego stringów PV, nie pełną
koordynację przeciążeniową dla instalacji AC/DC ogólnie).

## Status wykorzystania w projekcie

Na 05.09.2026: dostarczony, przeanalizowany, kompletny. Niewykorzystany jeszcze w żadnym
kalkulatorze.
