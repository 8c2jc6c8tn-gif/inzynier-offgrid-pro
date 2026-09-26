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

Eurokod 0 to fundament projektowania konstrukcji budowlanych (zasady bezpieczeństwa konstrukcji,
kombinacje obciążeń, klasy konsekwencji) — potencjalnie istotny tylko dla ewentualnego przyszłego
modułu doboru konstrukcji wsporczej pod panele PV (obciążenie wiatrem/śniegiem na konstrukcję),
którego **obecnie nie ma** w `docs/rejestr-pokrycia.md`. Nie jest normą elektryczną ani energetyczną.

## Status wykorzystania

Przeanalizowany (OCR głównego pliku), **niewykorzystany w kodzie**. [26.09.2026] ⚠️ NIEAKTUALNE (zastąpione przez: sekcja „Weryfikacja wizualna i pierwsze użycie w kodzie” niżej) — powód: powstał balast projektowy M3. Patrz rekomendacja końcowa
w `docs/zrodla/README.md` co do dalszego losu tego materiału (raczej `new-app-standards` niż ten
projekt, chyba że powstanie moduł konstrukcji wsporczej).

## [26.09.2026] Weryfikacja wizualna i pierwsze użycie w kodzie

Na potrzeby balastu projektowego (M3/E9, E2, E6 — D29) strony oryginału wyrenderowane (PyMuPDF, 110 DPI) i
przeczytane wzrokowo, nie tylko w OCR:

| Miejsce | Strona PDF (od 1) | Zweryfikowana treść |
|---|---|---|
| 6.4.1 (1)P a) EQU, 6.4.2 (1)P wzór (6.7) `Ed,dst ≤ Ed,stb`, 6.4.2 (2) (tarcie — tylko możliwość dodania warunku, bez wartości) | 34 (wzór 6.7); 35 (6.4.2 (2) — tylko OCR) | ✅ (6.7); 6.4.2 (2) wg OCR |
| Tablica A1.1 — ψ dla wiatru: ψ0 = 0,6, ψ1 = 0,2, ψ2 = 0; śnieg (H ≤ 1000 m): 0,50 / 0,20 / 0,20 | 40 | ✅ |
| Tablica A1.2(A) (EQU, zestaw A), UWAGA 1 — wartości zalecane: **γG,j,sup = 1,10; γG,j,inf = 0,90; γQ,1 = 1,50** (0 gdy korzystne); UWAGA 2: 1,35 / 1,15 / 1,50 | 41 | ✅ |
| Załącznik krajowy NB (budynki): „nie wprowadza się żadnych zmian krajowych” → obowiązują wartości zalecane | 71 | ✅ |

**Użyte w kodzie:** `GAMMA_G_INF_EQU = 0.9`, `GAMMA_Q_EQU = 1.5` — `lib/core/modules/pv/eurokod-0/rownowaga.ts`.
🔎 Ten egzemplarz to PN-EN 1990:2004 + A1:2008 — ewentualne późniejsze poprawki krajowe (np. Ap) nie są w
repo; przy ich dostarczeniu sprawdzić, czy NB/NA dla A1.3.1 się zmienił.
