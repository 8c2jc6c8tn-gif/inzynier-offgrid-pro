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
natywny tekst. **Pełny OCR (tesseract, pol+eng, 250 DPI) wykonany w tej sesji** — patrz
[`01-tresc-ocr.txt`](01-tresc-ocr.txt). **Zastrzeżenie jakości identyczne jak przy innych skanach
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

Przeanalizowany (OCR głównego pliku), **niewykorzystany w kodzie**. Patrz rekomendacja końcowa
w `docs/zrodla/README.md` co do dalszego losu tego materiału (raczej `new-app-standards` niż ten
projekt, chyba że powstanie moduł konstrukcji wsporczej).
