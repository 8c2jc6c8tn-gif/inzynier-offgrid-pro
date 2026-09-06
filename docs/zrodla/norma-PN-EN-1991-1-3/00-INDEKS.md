# PN-EN 1991-1-3:2005 — Eurokod 1: Oddziaływania na konstrukcje. Część 1-3: Oddziaływania ogólne — Obciążenie śniegiem

## Źródło i metoda ekstrakcji

- **Plik:** `PN-EN-1991-1-3-2005-Eurokod-1-Obciazenie-sniegiem.pdf` (54 strony).
- **Pochodzenie:** dostarczony przez właściciela projektu (06.09.2026), zapowiedziany wcześniej
  jako uzupełnienie do `docs/normy-brakujace.md` (pozycja "Eurokod śnieg", 🔵 spodziewana).
- **Format:** skan (0 znaków tekstu natywnego na każdej sprawdzonej stronie —
  `pypdfium2`/`get_text_range`), nie tekst. Polska wersja językowa PKN, październik 2005,
  wprowadza EN 1991-1-3:2003 (identyczna, IDT).
- **Metoda ekstrakcji — odczyt wizualny bezpośredni, nie OCR.** Wszystkie 54 strony przeczytane
  narzędziem `Read` z parametrem `pages` (6 partii: 1-10, 11-20, 21-30, 31-40, 41-50, 51-54),
  bezpośrednio jako obrazy, bez pośredniczącego tekstu OCR. Zgodnie z ustalonym wzorcem sesji
  (`docs/propozycje-do-new-app-standards/przetwarzanie-materialow-zrodlowych.md`, Krok 0): dla
  dokumentów tej wielkości (54 strony, nie setki) odczyt wizualny bezpośredni jest szybszy i
  równie pewny jak pełny pipeline OCR+weryfikacja, bo i tak wymaga finalnej weryfikacji wizualnej
  każdej strony — tu ta weryfikacja jest jednocześnie pierwszym (i jedynym potrzebnym) odczytem.
  **Status weryfikacji: pełna, strona po stronie, od okładki do tylnej strony (ISBN)** — nie
  spot-check. Krzyżowa spójność potwierdzona: mapa polskich stref w Załączniku krajowym NB
  (Rysunek NB.1, str. 4) identyczna z mapą w Załączniku C (Rysunek C.13, "Polska", str. 43) —
  ten sam podział na 5 stref, te same wzory `s_k(A)`.

## Status: kompletny

Dokument kompletny od strony tytułowej po tylną okładkę (ISBN 83-243-8005-1) — nie jest
"Wyciągiem" ani skrótem (w odróżnieniu od np. `docs/zrodla/norma-HD-60364-7-712/`). Zawiera pełny
tekst normy europejskiej + polski Załącznik krajowy NA/NB (normatywny dla Polski).

## Dlaczego ta norma i po co jest w projekcie

Odblokowuje ekran "Obciążenie dachu śniegiem" (`docs/rejestr-pokrycia.md`), wcześniej `todo` z
notatką "ryzyko braku normy budowlanej" — do dziś budowany bez formalnego źródła normatywnego dla
obciążenia śniegiem, mimo że dotyczy bezpieczeństwa konstrukcyjnego dachu z panelami PV (waga
śniegu na konstrukcji montażowej, projekt wsporników).

## Mapa plików

| Plik | Zawartość |
|---|---|
| `01-zalacznik-krajowy-NA-NB.md` | **Najważniejszy dla Polski** — Załącznik NA (odpowiedniki norm powołanych), Załącznik NB (postanowienia krajowe: mapa 5 stref, Tablica NB.1 wzory s_k(A), wzór współczynnika termicznego C_t, 13 punktów NB1.1–NB1.13 doprecyzowujących zastosowanie reszty normy w Polsce). |
| `02-postanowienia-ogolne-rozdzial-1-2-3.md` | Rozdziały 1–3: zakres normy, definicje (1.6), symbole (1.7), klasyfikacja oddziaływań (rozdz. 2), sytuacje obliczeniowe normalne/wyjątkowe (rozdz. 3). |
| `03-obciazenie-sniegiem-gruntu-rozdzial-4.md` | Rozdział 4: wartość charakterystyczna `s_k`, inne wartości reprezentatywne (Tablica 4.1, współczynniki ψ₀/ψ₁/ψ₂), wzór wyjątkowego obciążenia `s_Ad = C_esl × s_k`. |
| `04-obciazenie-sniegiem-dachow-rozdzial-5.md` | **Rozdział 5 — rdzeń kalkulatora.** Wzór główny `s = μᵢ Ce Ct sk` (5.1), współczynnik ekspozycji Ce (Tablica 5.1), współczynnik termiczny Ct, **Tablica 5.2** (współczynniki kształtu μ₁/μ₂ wg kąta nachylenia dachu — jednopołaciowe, dwupołaciowe, wielopołaciowe), dachy walcowe (5.3.5), dachy przylegające do wyższych budowli (5.3.6). |
| `05-obciazenia-miejscowe-rozdzial-6.md` | Rozdział 6: zaspy przy występach/przeszkodach (6.2), nawisy śnieżne na krawędzi dachu (6.3, wzór `s_e = k s²/γ`), siła zeslizgu śniegu na barierki (6.4, wzór `F_s = s b sin α`). |
| `zalacznik-A-sytuacje-obliczeniowe.md` | Załącznik A (normatywny) — Tablica A.1, 4 przypadki (A/B1/B2/B3) sytuacji obliczeniowych wg warunków klimatycznych lokalizacji. |
| `zalacznik-B-zaspy-wyjatkowe.md` | Załącznik B (normatywny) — współczynniki kształtu dla wyjątkowych zasp śnieżnych: dachy wielopołaciowe (B2), dachy przy wyższych budowlach (B3, Tablica B1), zaspy przy występach/przeszkodach/attykach (B4). |
| `zalacznik-C-mapy-europejskie.md` | Załącznik C (informacyjny) — europejskie mapy `s_k` dla 9 regionów klimatycznych + Tablica C.1 wzorów. **Dla Polski nie używać** — Polska ma własny, odrębny system stref w Załączniku NB (Tablica NB.1); Załącznik C zawiera tylko powtórzenie tej samej polskiej mapy jako Rysunek C.13, informacyjnie. |
| `zalacznik-D-okres-powrotu.md` | Załącznik D (informacyjny) — wzór D.1 przeliczenia `s_k` na inny okres powrotu niż 50 lat (rozkład Gumbela), z polskim współczynnikiem zmienności V z Załącznika NB (wzór NB.3). |
| `zalacznik-E-ciezar-objetosciowy-sniegu.md` | Załącznik E (informacyjny) — Tablica E.1, orientacyjny ciężar objętościowy śniegu (świeży/osiadły/stary/mokry). |

## Status wykorzystania w kodzie

Przeanalizowany i podzielony, **jeszcze niewykorzystany w kodzie** — ekran "Obciążenie dachu
śniegiem" (`docs/rejestr-pokrycia.md`) czeka na osobną sesję implementacyjną. Ta norma jest teraz
**pełnym, formalnym źródłem** dla tego ekranu — w odróżnieniu od stanu sprzed 06.09.2026, gdy
notatka mówiła o "ryzyku braku normy budowlanej".

Przeniesiona z `docs/normy-brakujace.md` do stanu "pozyskana" — patrz `docs/zrodla/README.md` i
`docs/memory.md`.
