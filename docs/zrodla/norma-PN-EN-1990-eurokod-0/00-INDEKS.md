# Indeks — PN-EN 1990:2004 (Eurokod 0 — Podstawy projektowania konstrukcji)

Cztery pliki, różna jakość i wartość:

| Plik | Strony | Jakość | Zawartość |
|---|---|---|---|
| `803243456-Eurocod-0-...pdf` | 120 | **skan, OCR w toku/patrz niżej** | główny, najpełniejszy tekst normy PN-EN 1990:2004+A1 |
| [`02-lista-eurokodow-wprowadzonych-do-PN.txt`](02-lista-eurokodow-wprowadzonych-do-PN.txt) | 14 | tekst natywny, dobra jakość | lista wszystkich Eurokodów wprowadzonych do zbioru PN, stan na 7.04.2021 (numery EN/PN-EN, komitety techniczne) — **przydatny materiał pomocniczy**, nie sama treść normy |
| `03-kopia-fragment-lodz.txt` | 73 | **niska wartość** — strony to głównie znak wodny Studocu ("Downloaded by...", stopki), rzeczywista treść normy jest obrazem, nieprzepisana | kopia Eurokodu 0 (Politechnika Łódzka) |
| `04-kopia-fragment-poznan.txt` | 30 | **niska wartość**, jak wyżej | PN-EN 1990:2004/A1:2008 (Politechnika Poznańska) |

**Pliki 03/04 nie zostały OCR-owane** — ich strony to skan z warstwą tekstową ograniczoną do
stopki Studocu, bez treści normy w warstwie tekstowej. Uznane za zbędne duplikaty głównego pliku
`803243456-...pdf` (ta sama norma, gorsza jakość, dodatkowej wartości nie wnoszą) — jeśli
w przyszłości okaże się, że plik główny ma luki, można wrócić i zrobić im pełny OCR.

## OCR głównego pliku

`803243456-Eurocod-0-Podstawy-Projektowania-Konstrukcji-PN-En-1990-2004-A.pdf` — 120 stron, w
większości skan (strony 0-101 bez warstwy tekstowej), tylko strony ~102-119 (Załączniki) mają
natywny tekst. **Pełny OCR (tesseract, pol+eng, 250 DPI) wykonany i dokończony w tej sesji** —
[`01-tresc-ocr.txt`](01-tresc-ocr.txt) (~300 tys. znaków, tekst normy po polsku, spot-check
spisu treści rozdziału 6.4 "Kombinacja oddziaływań" i współczynników częściowych potwierdza
poprawne rozpoznanie struktury klauzul). **Zastrzeżenie jakości identyczne jak przy innych skanach
w tym repo** (np. `norma-PN-HD-60364-5-52/00-INDEKS.md`): nagłówki klauzul czytelne, ale **żadna
wartość liczbowa (współczynniki częściowe γ, kombinacje obciążeń, wartości ψ) nie została
zweryfikowana wizualnie strona po stronie** — to tylko surowy wynik OCR, nie zweryfikowany. Przed
użyciem jakiejkolwiek liczby w kodzie — obowiązkowa weryfikacja względem oryginalnego PDF.

## Trafność w domenie off-grid PV — **pośrednia, wątpliwa dla rdzenia projektu**

> **[25.09.2026] BŁĘDNA OCENA — skorygowana (weryfikacja OCR).** Norma jest **bezpośrednio potrzebna**:
> w `docs/normy-brakujace.md` miała status 🔴 — blokuje balast PROJEKTOWY w M3/E9 „Złoty środek”,
> M3/E2 „Typ montażu” i M3/E6 (D27: dziś tylko `m = Fw/g` bez współczynników). Potrzebna część:
> 6.4.2 (EQU, wzór 6.7), Tablica A1.2(A) i Załącznik krajowy NB — wszystkie zweryfikowane niżej.
> Rekomendacja przeniesienia do `new-app-standards` (niżej) — **nieaktualna dla tego projektu**.

Eurokod 0 to fundament projektowania konstrukcji budowlanych (zasady bezpieczeństwa konstrukcji,
kombinacje obciążeń, klasy konsekwencji) — potencjalnie istotny tylko dla ewentualnego przyszłego
modułu doboru konstrukcji wsporczej pod panele PV (obciążenie wiatrem/śniegiem na konstrukcję),
którego **obecnie nie ma** w `docs/rejestr-pokrycia.md`. Nie jest normą elektryczną ani energetyczną.

## Status wykorzystania

Przeanalizowany (OCR głównego pliku), **niewykorzystany w kodzie**. Patrz rekomendacja końcowa
w `docs/zrodla/README.md` co do dalszego losu tego materiału (raczej `new-app-standards` niż ten
projekt, chyba że powstanie moduł konstrukcji wsporczej).

## Weryfikacja OCR (25.09.2026)

Metoda jak w `norma-PN-EN-1991-1-4/00-INDEKS.md` (sekcja „Pełny tekst normy”; dawniej `norma-PN-EN-1991-1-4-wiatr/`) (kompletność 120/120, drugi niezależny OCR
300 DPI, hunspell pl — 48 poprawek + ~36 ręcznych, odczyt wizualny ze skanem).

**Zweryfikowane wizualnie i przepisane w całości:** strony pliku **33–44** (6.3.5–6.5: EQU/STR/GEO,
kombinacje oddziaływań 6.9a–6.16b; Załącznik A1: Tablice A1.1, A1.2(A), A1.2(B), A1.2(C), A1.3, A1.4),
**70** (Załącznik krajowy NB), **72–73** (poprawka Ap1 — w PDF uszkodzona warstwa tekstu, poprzedni
odczyt to same losowe znaki; przepisana z obrazu).

**Wynik dla projektu (zweryfikowane trzema drogami: skan, OCR, natywny tekst poprawki AC:2010 s. 111):**
- **Tablica A1.2(A) (EQU), wartości zalecane: γG,sup = 1,10; γG,inf = 0,90; γQ = 1,50** (0 gdy korzystne).
- **Załącznik krajowy NB: „nie wprowadza się żadnych zmian krajowych”** → w Polsce obowiązują wartości
  zalecane. NB zaleca dla STR/GEO mniej korzystne z (6.10a) i (6.10b).
- **Poprawka Ap1:2004** — Tablica A1.1, śnieg, H ≤ 1000 m n.p.m.: **ψ2 = 0** (nie 0,20 jak w druku).
- EQU: `Ed,dst ≤ Ed,stb` (6.7); 6.4.2 (2) dopuszcza uzupełnienie o warunek tarcia — sam współczynnik
  tarcia balastu o podłoże **nie jest w tej normie**.

**Znalezione błędy OCR:** symbole γ/ψ/ξ czytane jako „Y”, „%”, „Ti”, „v”, „W”; **„≤” jako „<” lub „Ś”**
(np. „H < 1000 m” zamiast „H ≤ 1000 m” — zmienia znaczenie), wszystkie wzory 6.6–6.16 nieczytelne,
strona 92 obrócona (tekst odwrócony — Tablica A2.4(B) mostów), strony 72–73 zniszczone.

**Niezweryfikowane (poza zakresem projektu):** strony 0–32 (przedmowy, rozdziały 1–6.3.5), 45–69
(Załączniki B, C, D — niezawodność, badania), 74–101 (A1:2005 — mosty), 102–119 (poprawki; tekst
natywny, wiarygodny bez OCR). Porównanie przebiegów OCR: rozbieżne liczby na 34 stronach — przed
użyciem liczby stamtąd weryfikacja wizualna.
