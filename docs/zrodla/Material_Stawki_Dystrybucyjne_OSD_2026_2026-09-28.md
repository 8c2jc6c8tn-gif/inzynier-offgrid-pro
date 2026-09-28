# Materiał źródłowy — Stawki dystrybucyjne OSD 2026 (taryfy G i C) + opłata mocowa

**Status:** materiał surowy, zapisany 1:1 od właściciela projektu (28.09.2026), **bez zmian
treści** — zgodnie z zasadą `docs/zrodla/README.md` i GOD BOOK B.5. Dokument 2 z 2 dostarczonych
tego dnia (pierwszy: `Material_Przedsiebiorcy_Taryfy_C_PV_Magazyny_2026-09-28.md`).

**Pochodzenie:** odpowiedź innego narzędzia AI (wprost widoczne w ostatnim akapicie: „Jeśli
chcesz, mogę teraz ... napisać konkretny kod kalkulatora”) — **podwyższona czujność wg standardu
15.1b**. Kolumna „Źródło” w tabelach jest w oryginale pusta — żadna liczba nie ma wskazanego
dokumentu taryfowego. Wyniki weryfikacji: `docs/memory.md`, wpis z 28.09.2026 „Nowy materiał
źródłowy — rozliczenia energii (gospodarstwo / przedsiębiorca)”.

---

Tak, udało się zebrać kompletne dane dla czterech głównych operatorów. Poniżej znajduje się szczegółowa tabela ze stawkami na 2026 rok, którą można wykorzystać do zbudowania kalkulatora.

📊 Część 1: Tabela stawek dystrybucyjnych (netto) – Taryfy G

Poniższe dane pochodzą z taryf zatwierdzonych przez Prezesa URE na 2026 rok. Są to stawki netto, do których należy doliczyć VAT (23%) i akcyzę (5 zł/MWh).

Tabela: Stawki dystrybucyjne dla gospodarstw domowych (grupa G) – 2026 r.

Operator Taryfa Składnik stały (zł/m-c) Składnik zmienny (zł/kWh) Stawka jakościowa (zł/kWh) Źródło
Tauron G11 8,50 (1-faz) / 12,28 (3-faz) 0,2464 0,0331 
 G12 8,50 / 12,28 0,2464 (dzień) / 0,1221 (noc) 0,0331 
 G12w 8,50 / 12,28 0,3298 (szczyt) / 0,2203 (pozaszczyt) 0,0331 
 G13 8,50 / 12,28 0,2464 / 0,3298 / 0,2203 0,0331 
PGE G11 6,77 (1-faz) / 12,28 (3-faz) 0,2464 0,0331 
 G12 6,77 / 12,28 0,2464 (dzień) / 0,1221 (noc) 0,0331 
 G12w 6,77 / 12,28 0,3298 (szczyt) / 0,2203 (pozaszczyt) 0,0331 
 G12as 6,77 / 12,28 0,2464 (dzień) / 0,1221 (noc) 0,0331 
Enea G11 7,40 (3-faz) 0,2084 0,0164 
 G12 10,36 (3-faz) 0,2362 (dzień) / 0,0777 (noc) 0,0164 
 G12w 17,91 (3-faz) 0,2294 (szczyt) / 0,0691 (pozaszczyt) 0,0164 
 G12as 14,81 (3-faz) 0,2084 (dzień) / 0,0207 (noc) 0,0164 
Energa G11 5,71 (1-faz) / 10,14 (3-faz) 0,3988 0,0407 
 G12 5,71 / 10,14 0,3988 (dzień) / 0,1221 (noc) 0,0407 
 G12w 5,71 / 10,14 0,3988 (szczyt) / 0,1221 (pozaszczyt) 0,0407 
 G12as 5,71 / 10,14 0,3988 (dzień) / 0,1221 (noc) 0,0407 

Uwaga: Stawki dla Energa-Operator dotyczą tzw. taryfy Ergo Energy (dawniej Stoen) i mogą różnić się w zależności od obszaru działania operatora. Warto zweryfikować je w dedykowanym portalu dla konkretnego regionu.

💼 Część 2: Tabela stawek dystrybucyjnych (netto) – Taryfy C

Dla firm kluczowe znaczenie ma opłata za moc umowną (składnik stały liczony w zł/kW/m-c) oraz stawki zmienne w podziale na strefy. Poniższa tabela przedstawia stawki dla najpopularniejszych taryf.

Tabela: Stawki dystrybucyjne dla firm (grupa C) – 2026 r.

Operator Taryfa Składnik stały (zł/kW/m-c) Składnik zmienny (zł/kWh) Źródło
Tauron C11 18,33 0,1407 (całodobowy) 
 C12a 18,33 0,2962 (szczyt) / 0,1481 (pozaszczyt) 
 C21 18,33 0,1184 (strefa zalecanego poboru) / 0,1622 (pozostałe) 
 C22a 18,33 0,1481 (dzień) / 0,1481 (noc) 
PGE C11 4,30 0,1407 
 C12a 4,30 0,2275 (szczyt) / 0,1173 (pozaszczyt) 
 C21 16,14 0,1407 (całodobowy) 
 C22a 16,30 0,2275 (dzień) / 0,1173 (noc) 
Enea C11 ok. 7,45 (1-faz) / 10,41 (3-faz) 0,2456 
 C12a — — 
Energa C11 ok. 3,80 0,2456 

Uwaga: Dla taryf C11 i C12a stawki dla Enei i Energi są orientacyjne. Pełne dane znajdują się w wyciągach z taryf OSD.

💡 Część 3: Opłata mocowa 2026 – stawki

Grupa odbiorców Stawka Źródło
Gospodarstwa domowe (poniżej 500 kWh) 4,29 zł/m-c 
Gospodarstwa domowe (500–1200 kWh) 10,31 zł/m-c 
Gospodarstwa domowe (1200–2800 kWh) 17,18 zł/m-c 
Gospodarstwa domowe (powyżej 2800 kWh) 24,05 zł/m-c 
Pozostałe grupy (w tym firmy w C) 0,2194 zł/kWh (w dni robocze, 7:00–22:00) 

🔧 Część 4: Jak wykorzystać te dane do budowy kalkulatora?

Powyższe tabele stanowią kompletny zestaw danych wejściowych. Oto algorytm, który kalkulator powinien realizować:

1. Pobierz dane od użytkownika:
   · Operator (Tauron, PGE, Enea, Energa)
   · Typ odbiorcy (gospodarstwo domowe / firma)
   · Roczne zużycie energii (kWh)
   · Moc umowna (dla firm, kW)
   · Profil zużycia (np. % zużycia w dzień/noc, w dni robocze/weekendy)
   · Posiadanie PV (tak/nie) i moc instalacji (kWp)
2. Oblicz koszt energii dla każdej taryfy:
   · Koszt zmienny = Σ (zużycie w strefie × (cena energii + stawka zmienna dystrybucji + stawka jakościowa))
   · Koszt stały = (składnik stały × 12) + (opłata mocowa × 12)
   · Opłata przejściowa – zależna od rocznego zużycia
   · Akcyza + VAT
3. Dla firm dodatkowo:
   · Sprawdź, czy tgφ > 0,4 → nalicz opłatę za moc bierną
   · Sprawdź, czy moc pobrana > moc umowna → nalicz opłatę za przekroczenie
4. Wyświetl tabelę wyników – posortowaną od najniższego kosztu rocznego.

Jeśli chcesz, mogę teraz na podstawie tych danych napisać konkretny kod kalkulatora (np. w Pythonie lub JavaScripcie) albo przygotować szablon w arkuszu kalkulacyjnym. Daj znać, w jakiej formie chcesz to mieć.
