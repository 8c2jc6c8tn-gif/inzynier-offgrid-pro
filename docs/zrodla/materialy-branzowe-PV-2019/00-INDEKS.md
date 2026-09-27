# Indeks — "Bezpieczeństwo instalacji fotowoltaicznych" (Rynek Fotowoltaiczny, dodatek 3/2019)

Źródło: `docs/zrodla/materialy-branzowe-PV-2019/Bezpieczenstwo-instalacji-fotowoltaicznych-Rynek-Fotowoltaiczny-2019.pdf`
(32 strony, PDF natywny tekst — zweryfikowane, nie skan). Autorzy: dr inż. Maciej Piliński (Politechnika
Częstochowska), inż. Stanisław Osiński (PHU Elstan, PKOO SEP), mgr inż. Krzysztof Wincencik (DEHN,
SEP). Bezpłatny dodatek do magazynu "Rynek Elektryczny", wydawca Publikatech.

## ⚠️ To NIE jest formalna norma (PN/IEC/EN) — to literatura branżowa/szkoleniowa

W odróżnieniu od pozostałych plików w `docs/zrodla/norma-*`, ten dokument **nie ma statusu prawnego
normy**. Jest to artykuł ekspercki podsumowujący i interpretujący rzeczywiste normy (cytowane
wprost: PN-HD 60364-7-712, PN-EN 62305-3, PN-EN 62852, PN-EN 60445 i inne — patrz Tabele 1-5 w
`01-tresc.md`) oraz dane branżowe (statystyki pożarowe z Niemiec/UK/Holandii). Traktować jak
materiał wtórny/pomocniczy (analogicznie do `Zasady_UX_Doradca_v2_1.md` czy Biblii projektu) — dobry
do informowania treści ostrzeżeń/checklist w UI, **nie** jako źródło twardych wartości liczbowych
podstawionych wprost do wzoru bez sprawdzenia oryginalnej normy, którą dokument cytuje. Jedyny
wyjątek: kilka tabel w dokumencie to bezpośrednie, samodzielne dane liczbowe (promienie gięcia,
odległości montażowe) — oznaczone niżej jako w miarę bezpieczne do użycia wprost, z zastrzeżeniem
że artykuł sam mówi "zawsze potwierdzić z danymi producenta przewodu".

## Zawartość

| Plik | Zakres |
|---|---|
| [`01-tresc.md`](01-tresc.md) | Pełne streszczenie wszystkich 10 rozdziałów + wszystkie tabele liczbowe |
| [`02-tresc-pelna-z-pdf.txt`](02-tresc-pelna-z-pdf.txt) | [27.09.2026] Pełny tekst 1:1 z PDF, strona po stronie — **bezstratna** wersja treści (PDF ma tekst natywny, OCR zbędny) |

## [27.09.2026] Kompletność `.docx` vs PDF

Właściciel projektu dostarczył ten sam PDF drugi raz (jako „ZIAD Bielsko-Biała”, MD5
`007dfe6c…` — identyczny z PDF w tym folderze), wskazując, że przy przeróbce na `.docx` zgubiły
się fragmenty. Porównanie linia po linii (tekst PDF vs akapity+tabele `.docx`, z pominięciem
numeracji list i nagłówków stron):
- **Nie zgubił się żaden rozdział ani podrozdział** (spis treści PDF 1.–10. w całości obecny w `.docx`).
- **Zgubione fragmenty (z pól tekstowych na granicach kolumn/rysunków):** str. 21 — pierwszy akapit
  („Kompleksowa ochrona… rys. 17… odstępów separujących… w materiałach stałych… pożarem”), podpisy
  Rys. 17 i Rys. 18, zdanie „Norma zaleca, że kiedy jest to tylko możliwe, powinno być [zastosowane
  separowane urządzenie piorunochronne]” i „Przy projektowaniu… odstęp separujący s (pkt 6.3 PN-EN
  62305-3)… rys. 18”; str. 17 — podpis Rys. 5 (ochrona krawędzi, rury w obszarze krawędzi i ugięć);
  str. 18 — przypis 1 (MC4 produkowany przez Multi-Contact AG, od 1.01.2017 Stäubli Electrical Connectors AG).
- 9 pozycji listy norm (Tabele 1–5) — **nie zgubione, tylko wypchnięte z tabel do akapitów**
  (patrz korekta w `01-tresc.md`).
- `01-tresc.md` pisano z PDF, więc streszczenie było kompletne co do rozdziałów; brakujące dwie myśli
  merytoryczne ze str. 21 dopisano (oznaczone datą). **Źródłem prawdy jest PDF / `02-tresc-pelna-z-pdf.txt`, nie `.docx`.**
- **[27.09.2026, decyzja właściciela — wariant A] Niekompletny `.docx` USUNIĘTY z repo** (MD5 `428edf51…`, 22,5 MB),
  razem z jego duplikatem `docs/zrodla/materialy-szkolenie-ZIAD-Bielsko-Biala/`. Oryginałem w folderze jest
  wyłącznie PDF. Wzmianki o `.docx` w `01-tresc.md` (np. „akapit `.docx`”) są historyczne — opisują metodę
  z 06.09/27.09; każdą wartość da się sprawdzić w PDF / `02-tresc-pelna-z-pdf.txt`. Plik `.docx` jest w historii git
  (commit `0033707` i wcześniejsze), gdyby był kiedyś potrzebny.

## Najważniejsze dla tego projektu

1. **Tabela 1-5 (str. 8-9)** — obszerny, gotowy indeks norm PV specyficznych dla branży (PN-HD
   60364-7-712, PN-EN 62305 seria, PN-EN 62852, PN-EN 61215, PN-EN 62109, PN-EN 61730 i inne) —
   **najlepszy dotąd znaleziony punkt wyjścia do decyzji, które normy kupować dalej**, gdyby
   Ekran 21 M5 ("Normy i certyfikaty") miał kiedyś zostać w pełni zbudowany.
2. **Sekcja 5 (Łuk elektryczny)** — bezpośrednio uzupełnia moduł `trasy-kablowe`/`string-box`: lista
   przyczyn łuku wg komponentu (Tabela 6), zasady promieni gięcia (**Tabela 7**: D<8mm→4×D sztywne/
   3×D elastyczne; 8-12mm→5×D/3×D; >12mm→6×D/4×D), odległości montażowe zacisków kablowych
   (**Tabela 8**: zależne od średnicy przewodu, 250-500mm poziomo/pionowo).
3. **Sekcja 5.4 (Kompatybilność złączy MC4)** — ważne ostrzeżenie: **złącza DC różnych
   producentów, mimo deklaracji "kompatybilne z MC4", NIE powinny być łączone ze sobą** (IEC 62548
   i IEC 60364-7-712:2017 tego zakazują) — to bezpośrednio dotyczy istniejącego modułu
   `zlacza-mc4`/`string-box` w Module 5 i warto sprawdzić, czy tamten kalkulator/ostrzeżenia to
   uwzględniają.
4. **Tabela 9 (str. 25)** — orientacyjne minimalne odległości gaszenia pożaru instalacji pod
   napięciem (1-10m, zależnie od napięcia i typu strumienia) — potencjalnie przydatne dla
   Modułu 8 (bezpieczeństwo pożarowe).
5. **Tabela 10 (str. 27)** — harmonogram przeglądów/konserwacji instalacji PV (codziennie/
   miesięcznie/co 4 lata) — mogłoby zasilić przyszły ekran "Warunki odbioru — przeglądy i
   konserwacje" (2.9 w spisie treści źródła), dotąd niebudowany.

## Status wykorzystania w projekcie

Na 05.09.2026: dostarczony, przeanalizowany. Niewykorzystany jeszcze w żadnym kalkulatorze/ekranie.
