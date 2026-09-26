# Poradnik Purmo (PN-EN 12831:2006) — wzory numerowane, odczyt zweryfikowany

**Po co ten plik:** w `01-tresc-surowa.txt` wszystkie wzory numerowane rozpadły się przy ekstrakcji
tekstu na luźne fragmenty (np. `(6.5) |/h|m| ,|2|3|50|,|i…`) — wzory w PDF są złożone z
pojedynczych znaków rozrzuconych po pozycjach (indeksy dolne/górne, kreski ułamkowe).
Weryfikacja 25.09.2026 (`docs/memory.md`, "Weryfikacja OCR paczki New-info").

**Metoda odczytu (dwa niezależne źródła, zgodne):**
1. Znaki odczytane z danych PDF (pozycje znaków, `rawdict` PyMuPDF), złożone według linii bazowej —
   rozstrzyga znaki działań.
2. Kontrola wizualna każdego wzoru na renderze strony (170 DPI) — rozstrzyga układ (ułamki, sumy).

**⚠️ Pułapka renderu:** font `Symbol` w tym PDF wyświetla znak `+` (U+002B) niekompletnie —
na obrazie wygląda jak `-` albo `⊣`. Przykład: wzór (7.6) na ekranie wygląda jak
`θsu,i = θe − ηV(…)`, a w danych PDF jest `+`. Rozstrzygają dane PDF (U+002B `+`, U+2212 `−`),
nie obraz. Ktoś, kto przepisuje wzory z wydruku/podglądu, dostanie złe znaki w (3.1), (7.6), (9.1).

Numer strony = numer strony pliku PDF (1 = pierwsza strona pliku), nie numeracja drukowana.

| Wzór | Str. PDF | Treść |
|---|---|---|
| (1.1) | 10 | Φi = ΦT,i + ΦV,i  [W] |
| (1.2) | 11 | Q = Qp·(1 + d1 + d2) + Qw  [W] — wzór starej PN-B-03406:1994, dla porównania |
| (1.3) | 11 | ΦHL,i = ΦT,i + ΦV,i + ΦRH,i  [W] |
| (1.4) | 12 | ΦHL = ΣΦT,i + ΣΦV,i + ΣΦRH,i  [W] |
| (3.1) | 17 | ΦT,i = (HT,ie + HT,iue + HT,ig + HT,ij)·(θint,i − θe)  [W] |
| (3.2) | 17 | HT,ie = Σk Ak·Uk·ek + Σl ψl·ll·el  [W/K] |
| (3.3) | 18 | ek = 1,0;  el = 1,0  (wartości orientacyjne z Załącznika krajowego PN-EN 12831:2006) |
| (3.4) | 18 | HT,ie = Σk Ak·Uk + Σl ψl·ll  [W/K] |
| (3.5) | 18 | Ukc = Uk + ΔUtb  [W/(m²·K)] |
| (3.6) | 20 | HT,iue = Σk Ak·Uk·bu + Σl ψl·ll·bu  [W/K] |
| (3.7) | 20 | bu = (θint,i − θu) / (θint,i − θe)  [−] — gdy temperatura przestrzeni nieogrzewanej jest znana |
| (3.8) | 20 | bu = Hue / (Hiu + Hue)  [−] — gdy nie jest znana |
| (3.9) | 22 | HT,ij = Σk fij·Ak·Uk  [W/K] |
| (3.10) | 22 | fij = (θint,i − θprzyległej przestrzeni) / (θint,i − θe)  [−] |
| (5.1) | 32 | HT,ig = fg1·fg2·(Σk Ak·Uequiv,k)·Gw  [W/K] |
| (5.2) | 32 | fg2 = (θint,i − θm,e) / (θint,i − θe)  [−] |
| (5.3) | 33 | B′ = A / (½·P)  [m] |
| (6.1) | 38 | ΦV,i = HV,i·(θint,i − θe)  [W] |
| (6.2) | 38 | HV,i = V̇i·ρ·cp  [W/K] |
| (6.3) | 38 | HV,i = 0,34·V̇i  [W/K] |
| (6.4) | 39 | V̇i = max(V̇inf,i, V̇min,i)  [m³/h] |
| (6.5) | 39 | V̇inf,i = 2·Vi·n50·ei·εi  [m³/h] |
| (6.6) | 41 | V̇min,i = nmin·Vi  [m³/h] |
| (6.7) | 41 | ΣV̇i = max(0,5·ΣV̇inf,i, ΣV̇min,i)  [m³/h] |
| (7.1) | 44 | ΦV,i = HV,i·(θint,i − θe)  [W] |
| (7.2) | 44 | HV,i = V̇i·ρ·cp  [W/K] |
| (7.3) | 44 | HV,i = 0,34·V̇i  [W/K] |
| (7.4) | 45 | V̇i = V̇inf,i + V̇su,i·fV,i + V̇mech,inf,i  [m³/h] |
| (7.5) | 45 | fV,i = (θint,i − θsu,i) / (θint,i − θe)  [−] |
| (7.6) | 46 | θsu,i = θe + ηV·(θint,i − θe) |
| (7.7) | 47 | fV,i = [θint,i − θe − ηV·(θint,i − θe)] / (θint,i − θe) |
| (7.8) | 47 | fV,i = (1 − ηV)·(θint,i − θe) / (θint,i − θe) |
| (7.9) | 47 | fV,i = 1 − ηV |
| (7.10) | 47 | V̇mech,inf = max(V̇ex − V̇su, 0)  [m³/h] |
| (7.11) | 48 | V̇mech,inf,i = V̇mech,inf · Vi / ΣVi  [m³/h] |
| (7.12) | 48 | ΣV̇i = 0,5·ΣV̇inf,i + (1 − ηV)·ΣV̇su,i + V̇mech,inf,i  [m³/h] |
| (8.1) | 52 | ΦHL,i = ΦT,i + ΦV,i + ΦRH,i  [W] |
| (8.2) | 53 | ΦRH,i = Ai·fRH  [W] |
| (9.1) | 57 | Φi = (ΦT,i + ΦV,i)·fh,i  [W] |

Oznaczenia i jednostki — w tekście poradnika pod każdym wzorem ("gdzie: …"), ta część tekstu
wyekstrahowała się poprawnie (`01-tresc-surowa.txt`). Tabele współczynników (np. 2.1 temperatury
projektowe, 6.4 nmin) — tekst poprawny, sprawdzony wyrywkowo z renderem.

**Status prawny:** to poradnik wydawcy (wydanie 2009, do PN-EN 12831:2006), nie norma — patrz
`00-INDEKS.md`. Aktualna jest PN-EN 12831-1:2017; przed użyciem w kalkulatorze odnotować tę
różnicę wersji jako założenie.
