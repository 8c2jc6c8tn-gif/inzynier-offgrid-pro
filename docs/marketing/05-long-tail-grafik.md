# 05. Frazy long tail i „żywy grafik” publikacji

Data: 02.10.2026 · Dane: `hasla-long-tail-grafik.csv` (191 fraz, 32 podstrony + 4 huby; rozszerza `analizy/hasla-seo-100.csv`, wszystkie jej 100 fraz zostało przypisanych do stron) · Oznaczenia: 🔎 liczby wyszukiwań nieznane, trzeba je uzupełnić z Planera

## 1. Idea

Zamiast walczyć o kilka dużych fraz („fotowoltaika”), pokrywamy **setki małych, konkretnych pytań**, na które mamy gotową odpowiedź w apce. Każda strona ma jedną frazę główną i kilka dodatkowych, bo Google rozumie pokrewne pytania. „Żywy grafik” to stały rytm: **2 nowe strony tygodniowo**, aktualizowany co tydzień danymi z Search Console.

## 2. Zasady wyboru fraz (kolejność priorytetów)

| Priorytet | Reguła | Przykład |
|---|---|---|
| **A** | Apka ma gotowy kalkulator na to pytanie, a frazę wpisuje ktoś na etapie decyzji | „ile akumulatorów do domu off grid” |
| **B** | Pytanie informacyjne, na które da się dać wartościową odpowiedź i link do narzędzia | „mppt czy pwm” |
| **C** | Temat dla elektryków i zaawansowanych, dużo ostrzeżeń, mało ruchu; później odsyłamy do Elektryk Pro (D70) | „uziemienie falownika wyspowego” |

Priorytet to **moja ocena**, nie dane. Po uzupełnieniu Planera zmieniamy go na podstawie wyszukiwań i trudności.

## 3. Rodzaje stron

1. **Narzędzie + poradnik** (A): wynik na górze, wyjaśnienie niżej. Najlepsze pod zapis na listę.
2. **Poradnik** (B): 800–1500 słów, jedna tabela lub rysunek, link do narzędzia.
3. **Hub z tabelą** (mikro‑frazy): np. „kabel do falownika {1,2,3,5,8,10} kW × {12,24,48} V”. **Tabelę liczy rzeczywisty kalkulator apki**, więc każdy wiersz to realna wartość, nie wypełniacz. Cztery huby w CSV:
   - `/tabele/przekroj-kabla-dc-falownik-moc-napiecie`
   - `/tabele/ile-akumulatorow-do-falownika`
   - `/tabele/zuzycie-pradu-urzadzen-off-grid`
   - `/tabele/ile-paneli-do-ladowania-akumulatora`
   Każdy z nich zastępuje 6–18 osobnych, bardzo podobnych stron, które Google mógłby uznać za spam (patrz `02`, sekcja 5).
4. **Strona porównawcza** (zakup): „program do projektowania off‑grid”. Uczciwa, z darmowymi alternatywami; ma najwyższy zamiar zakupu.

## 4. Grafik 12 tygodni (poniedziałki; sprzedaż od G3 nie wpływa na grafik)

| Tydz. | Start | Strony (priorytet) |
|---|---|---|
| 1 | 05.10 | `/kalkulator/ile-akumulatorow-do-domu-off-grid` (A) · `/kalkulator/magazyn-energii-na-zime` (A) |
| 2 | 12.10 | `/kalkulator/ile-paneli-do-domu-off-grid` (A) · `/kalkulator/przekroj-kabla-do-akumulatora` (A) |
| 3 | 19.10 | `/poradnik/program-do-projektowania-off-grid` (A) · `/poradnik/lifepo4-czy-kwasowy-off-grid` (B) |
| 4 | 26.10 | `/kalkulator/napiecie-stringu-zima-voc` (A) · `/poradnik/czy-oplaca-sie-odlaczyc-od-sieci` (A) |
| 5 | 02.11 | `/kalkulator/dobor-agregatu-do-domu` (A) · `/poradnik/napiecie-systemu-12-24-48v` (B) |
| 6 | 09.11 | `/poradnik/falownik-wyspowy-jaki-wybrac` (A) · `/kalkulator/bilans-energetyczny-domu` (A) |
| 7 | 16.11 | `/poradnik/ladowanie-lifepo4-w-mrozie` (A) · `/poradnik/spd-fotowoltaika-typ-1-czy-2` (B) |
| 8 | 23.11 | `/poradnik/bezpiecznik-miedzy-akumulatorem-a-falownikiem` (A) · `/poradnik/przelacznik-siec-agregat` (B) |
| 9 | 30.11 | `/kalkulator/fotowoltaika-do-kampera` (B) · `/poradnik/prad-na-dzialce-bez-przylacza` (A) |
| 10 | 07.12 | `/poradnik/ogrzewanie-domu-off-grid` (B) · `/poradnik/pompa-ciepla-off-grid` (B) |
| 11 | 14.12 | `/poradnik/mppt-czy-pwm` (B) · `/poradnik/najczestsze-bledy-instalacji-off-grid` (A, lead magnet) |
| 12 | 21.12 | `/poradnik/magazyn-energii-gdzie-zamontowac` (B) · `/poradnik/off-grid-a-net-billing` (A) |
| 13+ | 28.12 → | `/kalkulator/grzalka-na-nadwyzki-pv`, 7 stron priorytetu B/C (uziemienie, BMS, MC4, kąt paneli, pomiary, stacje zasilania), potem **4 huby tabel**, potem tematy z Search Console |

Dlaczego taka kolejność:
- **Tygodnie 1–2 to zima, akumulatory, panele, kable** (frazy, które mają apkowe kalkulatory i wchodzą w sezon, 🔎 sprawdzić w Google Trends).
- **Tydzień 3 to porównania** („program do projektowania off‑grid”), bo mają największy zamiar zakupu.
- **Tematy z ostrzeżeniami** (SPD, przełącznik sieć/agregat, uziemienie, RCD) dopiero po tygodniu 7, żeby zdążyć z akceptacją mentora; wszystkie z twardą stopą bezpieczeństwa.
- W okresie świątecznym (tydz. 12–13) tempo można zwolnić.

## 5. Co jest w każdym tygodniu pracy (ok. 4–6 godz. na 2 strony) 💡

1. **Dzień 1:** wybór fraz i pytań z CSV + z Search Console i grup; szkic strony.
2. **Dzień 2:** liczby z kalkulatora apki (nie z głowy), przykład, tabela.
3. **Dzień 3:** korekta, link do narzędzia, ostrzeżenia, meta tagi. **Dla stron z bezpieczeństwem: akceptacja mentora przed publikacją.**
4. **Dzień 4:** publikacja, zgłoszenie adresu w Search Console, wpis w grupie (pomocna odpowiedź, link tylko za zgodą).
5. **Cotygodniowa aktualizacja:** dopisz do CSV nowe frazy z Search Console i zmień status „do zrobienia → opublikowane”.

## 6. Pomiar po publikacji (żeby nie pisać w ciemno)

| Po czasie | Co sprawdzić | Co zrobić |
|---|---|---|
| 2–4 tyg. | Czy strona jest w indeksie i na jakie frazy się wyświetla | Dopisać do strony odpowiedzi na te frazy |
| 6–8 tyg. | Wyświetlenia vs kliknięcia; strony na pozycjach 8–20 | Rozbudować treść i linki wewnętrzne do tych stron (najtańszy wzrost) |
| 3 mies. | Odsetek zapisów na listę per strona | Powielić układ najlepszej strony; poprawić najsłabsze |

## 7. Ostrożnie

- **Liczby wyszukiwań są nieznane.** Mój podział na A/B/C jest oceną, nie danymi. Nie zakładaj ruchu, dopóki nie zobaczysz liczb.
- **Nie powielaj strony na wiele fraz** (patrz zasady spamu w `02`). Lepiej jedna mocna strona niż trzy podobne.
- **Rzeczy, których apka jeszcze nie robi:** sprawdź w `docs/rejestr-pokrycia.md`, zanim zaprosisz na stronę z obietnicą. Według `docs/memory.md` do dużych luk należą m.in. M12 (szybkie kalkulatory), M6 (ogrzewanie) i M7 (stres zimowy). Tytuł „magazyn na zimę” trzeba oprzeć na tym, co już działa (np. `dni-bez-slonca`, `deficyty-miesieczne`, `awaria-stringa-zima` istnieją w `app/kalkulatory`), a nie na zapowiedzi.
- **Temat rozdzielnic i szczegółów AC** zostaje w Elektryk Pro (D70). Na tych stronach: poziom wymagań i twarde stopy, odsyłacz do tej apki dopiero, gdy będzie gotowa.

## 8. Pierwsze dane (02.10.2026, Ubersuggest, plan darmowy: 3 z 187 fraz)

| Fraza | Wyszukiwania w Polsce / mies. | Trudność SEO | CPC |
|---|---|---|---|
| kalkulator off grid | 10 | 20 | 0 USD |
| kalkulator fotowoltaiki off grid | 30 | 13 | 0,31 USD |
| magazyn energii do domu kalkulator | 0 (brak danych w narzędziu) | 4 | 0 USD |

Surowe dane: `ubersuggest-wyniki.csv`. **Co z tego wynika (ostrożnie, to 3 próbki):**
- Frazy „off grid” mają w Polsce dziesiątki, nie tysiące wyszukiwań miesięcznie. Nisza jest mała, a sam długi ogon w Google **nie wystarczy** do ~200 klientów, więc pozostałe kanały z `06` (grupy, lista e‑mail, partnerzy, szersze frazy o magazynach energii i prosumentach z modułu M14) nie są dodatkiem, tylko połową planu.
- Niska trudność (4–20) i CPC bliskie zera oznaczają, że konkurencja jest słaba: wejście na szczyt jest tanie, ale ruch będzie mały.
- Narzędzia często zaniżają polskie frazy o małym wolumenie (🔎), więc „0” nie znaczy „nikt nie szuka”. Pełny obraz da eksport z Planera Google lub płatny Ubersuggest dla wszystkich fraz.
- **Co dalej z danymi:** druga lista, `frazy-do-planera-szerokie.txt` (48 szerokich fraz o magazynach energii, zasilaniu awaryjnym i prosumentach), służy do sprawdzenia, czy większy rynek jest tam, gdzie frazy „off grid” są małe. Wklej ją w Planerze razem z pierwszą listą. Szkice pierwszych dwóch stron z grafiku są w `tresci/`.
