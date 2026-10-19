# Indeks — PN-EN 1997-1:2008 (Eurokod 7 — Projektowanie geotechniczne, Część 1: Zasady ogólne)

Stan na 19.10.2026. Plików PDF **nie kopiujemy do repozytorium** (zasada właściciela: „nie robimy kopii wszystkiego, tylko tego, co nam potrzeba”; skany ważą ok. 25 MB każdy, a norma ma prawa autorskie PKN). Tu zostaje wyłącznie wykaz tego, co z nich **zweryfikowano wzrokowo na skanie** i na czym opiera się kod.

## Co dostarczył właściciel i co jest warte

| Plik (nazwa nadana przez właściciela) | Zawartość | Wartość |
|---|---|---|
| `…Projektowanie-Geotechniczne-1.pdf` (50 s.) | pełna polska wersja normy, s. 1–48 (okładka PN, przedmowa krajowa, spis treści, rozdz. 1–5) | **główne źródło**, skan bez warstwy tekstowej |
| `…-2.pdf` (50 s.) | s. 49–98 normy, w tym rozdz. 6 „Fundamenty bezpośrednie” | **główne źródło** |
| `…-3.pdf` (50 s.) | s. 99–148 normy, w tym Załączniki A i B | **główne źródło** |
| `…-4.pdf` (4 s.) | Załącznik J (informacyjny) | niska wartość dla offgrida |
| slajdy KPOIIB 12.01.2012 (56 s.) | rozdz. 1–3 w skrócie | tylko tło; **nie zawiera** rozdz. 6 ani Załącznika A |
| fragment książki ITB 2011 (18 s., ebookpoint) | spis treści, przedmowa, wstęp | tylko tło (spis: rozdz. 6.10–6.11 omawiają nośność i ścięcie podłoża) |

**Brak:** Załącznika krajowego (NA). Przedmowa krajowa (s. 2 normy) mówi wprost: „Załącznik krajowy NA … zostanie opracowany (po zebraniu doświadczeń krajowych) do 2010 r.” — w dostarczonym wydaniu z maja 2008 go nie ma, a to on rozstrzyga, które podejście obliczeniowe (1, 2 czy 3) i czy wartości zalecane z Załącznika A obowiązują w Polsce bez zmian.

## Zweryfikowane na skanie (s. normy → wartości)

**p. 6.5.3 „Nośność na przesunięcie (poślizg)”, s. 56–57:**
- (1)P sprawdzać, gdy obciążenie nie jest prostopadłe do podstawy; (2)P `H_d ≤ R_d + R_p;d` (6.2); (3)P w `H_d` wszystkie czynne siły od gruntu;
- (8)P w warunkach z odpływem: `R_d = V_d′ · tan δ_d` (6.3a) **albo** `R_d = (V_d′ · tan δ_k) / γ_R;h` (6.3b); UWAGA: gdy współczynniki częściowe stosuje się do efektów oddziaływań (γ_F = 1,0), to w (6.3b) `V_d′ = V_k′`;
- (9)P rozważyć, czy `H_d` i `V_d′` są oddziaływaniami współzależnymi czy niezależnymi;
- (10) **`δ_d` = `φ′_cv;d`** (efektywny kąt tarcia wewnętrznego w stanie krytycznym) dla betonowych fundamentów formowanych na gruncie, **`2/3 · φ′_cv;d`** dla gładkich fundamentów prefabrykowanych; efektywną spójność `c′` zaleca się pominąć;
- (11)P bez odpływu: `R_d = A_c · c_u;d` (6.4a) albo `(A_c · c_u;k)/γ_R;h` (6.4b); (12) gdy możliwy dostęp wody/powietrza między fundament a niezdrenowany grunt spoisty: `R_d ≤ 0,4 · V_d` (6.5).

**p. 2.4.7.2 (s. 27–28), EQU:** `E_dst;d ≤ E_stb;d + T_d` (2.4). UWAGA 1: EQU w geotechnice ograniczona do rzadkich przypadków; opór ścinania `T_d` zaleca się przyjmować jako mało istotny.

**p. 2.4.7.3.4 (s. 29–30), podejścia obliczeniowe (STR/GEO):**
- PO 1: kombinacja 1: **A1 „+” M1 „+” R1**; kombinacja 2: **A2 „+” M2 „+” R1**;
- PO 2: **A1 „+” M1 „+” R2**;
- PO 3: **(A1* lub A2†) „+” M2 „+” R3** (* oddziaływania od konstrukcji, † od gruntu).
- Wybór podejścia i sposób użycia wzorów (2.6)/(2.7) „można podać w Załączniku krajowym” (UWAGA 1, s. 29).

**Załącznik A (normatywny), s. 114–121 — wartości zalecane:**
- Tablica A.1 (EQU, oddziaływania): stałe niekorzystne γ_G;dst = **1,1**, korzystne γ_G;stb = **0,9**; zmienne niekorzystne γ_Q;dst = **1,5**, korzystne γ_Q;stb = **0**.
- Tablica A.2 (EQU, parametry gruntu): γ_φ′ = 1,25 (do tan φ′), γ_c′ = 1,25, γ_cu = 1,4, γ_qu = 1,4, γ_γ = 1,0.
- Tablica A.3 (STR/GEO, oddziaływania): **A1** — stałe niekorzystne 1,35, korzystne 1,0; zmienne niekorzystne 1,5, korzystne 0. **A2** — stałe 1,0 / 1,0; zmienne niekorzystne 1,3, korzystne 0.
- Tablica A.4 (parametry gruntu): **M1** — wszystkie 1,0; **M2** — γ_φ′ = 1,25 (do tan φ′), γ_c′ = 1,25, γ_cu = 1,4, γ_qu = 1,4, γ_γ = 1,0.
- Tablica A.5 (nośność fundamentów bezpośrednich): γ_R;v — R1 1,0, R2 1,4, R3 1,0; **γ_R;h (przesunięcie) — R1 1,0, R2 1,1, R3 1,0**.
- Tablice A.13 (konstrukcje oporowe: γ_R;h R1 1,0, R2 1,1, R3 1,0; γ_R;e 1,0 / 1,4 / 1,0) i A.14 (skarpy) — dla przyszłego kalkulatora ogrodzenia.
- Załącznik B (informacyjny) s. 122–124: objaśnia, jak podejścia 1–3 rozkładają współczynniki między oddziaływania, efekty i wytrzymałości.

## Co z tego wynika dla kodu (stan na D96/D97)

- **Oderwanie i przewracanie** liczymy jak EQU: γ_Q = 1,5 (wiatr), γ_G;stb = 0,9 (ciężar korzystny) — to dokładnie Tablica A.1 (wartości te same co w PN-EN 1990). ✔ zgodne.
- **Przesuw** liczymy dziś tymi samymi współczynnikami (EQU), a norma traktuje go jako GEO wg p. 6.5.3 i podejść obliczeniowych (ciężar korzystny γ_G = **1,0**, nie 0,9; współczynnik na tarcie γ_φ′ lub γ_R;h zależnie od podejścia). Rozbieżność do wyprowadzenia — patrz `docs/lista-do-zrobienia.md` i D98.
- **Tarcie μ** = tan δ, gdzie δ wynika z `φ′_cv` wg 6.5.3(10); `φ′_cv` pochodzi z dokumentacji geotechnicznej użytkownika (norma nie podaje wartości kąta dla konkretnego gruntu).
- **Nie sprawdzamy:** nośności podłoża (6.5.2), parcia biernego `R_p;d` (pomijamy po stronie bezpiecznej), przypadku bez odpływu (6.4a/6.5), osiadań (6.6).
