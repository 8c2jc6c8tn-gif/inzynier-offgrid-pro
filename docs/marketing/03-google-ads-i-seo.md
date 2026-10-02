# 03. Google: reklamy (Ads) i wyszukiwarka (SEO)

Data: 02.10.2026 · Wymaga przeczytania `01-ekonomia-i-bramki.md` · Oznaczenia: ✅ ustalone · 💡 rekomendacja · 🔎 do sprawdzenia

## 1. Dwa różne zadania Google

| | SEO (wyniki bezpłatne) | Google Ads (reklamy) |
|---|---|---|
| Koszt | praca, 0 zł za kliknięcie | płacisz za każde kliknięcie |
| Czas do efektu | miesiące | dni |
| Rola | silnik wzrostu na stałe | pomiar, retargeting, frazy zakupowe |
| Start | od razu, bo trzeba czekać | po G0, najlepiej po G1 |

Kolejność 💡: **SEO startuje pierwsze** (bo działa z opóźnieniem), reklamy płatne dołączają, gdy strony i śledzenie są gotowe.

## 2. SEO: jak łapać „żywy ruch ze specyficznych słów”

Fraza „długiego ogona” (long tail) to bardzo konkretne pytanie, np. „jaki kabel do falownika 5 kW 48 V”. Ma mało wyszukiwań (może kilka–kilkadziesiąt miesięcznie 🔎), ale pytają ją ludzie z prawdziwym problemem, a konkurencja jest mała. Sto takich fraz po 20 wejść to 2000 wejść miesięcznie.

**Cztery poziomy treści** (szczegóły i lista w `05-long-tail-grafik.md`):

1. **Strony narzędzi** (kalkulator + poradnik): ok. 10, frazy typu „ile akumulatorów do domu off grid”. Dają najbardziej wartościowy ruch.
2. **Poradniki**: ok. 15, odpowiedzi na pytania („lifepo4 czy kwasowy”, „SPD typ 1 czy 2”).
3. **Huby z tabelami**: 4 strony, każda obejmuje dziesiątki mikro‑fraz tabelą liczoną z kalkulatorów (np. „kabel do falownika 3 kW 24 V”). To bezpieczny sposób na programowe SEO bez tworzenia setek podobnych stron.
4. **Frazy z Search Console**: po 6–8 tygodniach widać, na co strona już się wyświetla (nawet na pozycjach 10–50). To najlepsze źródło nowych tematów, bo to prawdziwe zapytania. Dopisujesz do strony odpowiedź na te pytania.

**Jak badać frazy bezpłatnie** 🔎 (narzędzia zmieniają limity, sprawdź aktualne):
- Planer słów kluczowych Google (w koncie Google Ads; wymaga założenia konta, dokładność liczb bywa ograniczona przy braku wydatków),
- podpowiedzi wyszukiwarki i „Podobne pytania”,
- Google Trends (sezonowość),
- Search Console (własne dane),
- pytania zadawane w grupach i na forach (elektroda.pl, grupy na Facebooku): tam ludzie piszą swoimi słowami.

Do pliku `hasla-long-tail-grafik.csv` dopisujesz kolumny „wyszukiwania”, „trudność”, „CPC” z Planera; priorytet zmienia się wtedy z mojej oceny na dane.

**Konkurencja w wynikach:** małe strony kalkulatorów i sklepów (np. offgridkalkulator.pl). W frazach „kalkulator off grid” trudno wejść na szczyt na nowej domenie; wygrywa się **precyzyjnymi** frazami (sekcja 2, pkt 3 i 4) i **zimą/bezpieczeństwem**, gdzie proste kalkulatory milczą.

## 3. Reklamy Google Ads: plan testowy

### 3.1. Zasady startu 💡
- **Tylko sieć wyszukiwania.** Wyłącz sieć reklamową i rozszerzenia „dla wygody” (domyślnie włączone wydają budżet na słabe miejsca). Kampanie automatyczne (Performance Max) nie na start: potrzebują danych o konwersjach, których jeszcze nie ma.
- **Dopasowanie:** „fraza” i „ścisłe”. Szerokie dopiero po zebraniu danych.
- **Stawki:** najpierw ręczne ustawienie maksymalnego CPC albo „maksymalizuj kliknięcia” z limitem; „maksymalizuj konwersje” dopiero po ok. 30 konwersjach.
- **Lokalizacja:** Polska; harmonogram: cały tydzień (zapytania o instalacje padają także wieczorem i w weekendy 🔎).
- **Budżet testowy:** 25–40 zł dziennie (750–1200 zł miesięcznie) przez 4 tygodnie, wyłącznie w celu zmierzenia liczb z `01`.

### 3.2. Trzy grupy reklam na start
| Grupa | Frazy | Strona docelowa | Cel |
|---|---|---|---|
| A. Narzędzia | „ile akumulatorów do domu off grid”, „kalkulator off grid”, „przekrój kabla do akumulatora kalkulator”, „napięcie stringu zimą” | strona narzędzia danej frazy | Zapis na listę |
| B. Zakup i porównanie | „program do projektowania instalacji off grid”, „aplikacja do obliczeń instalacji fotowoltaicznej”, „alternatywa pv*sol” | `/poradnik/program-do-projektowania-off-grid` | Zapis; później zakup |
| C. Zima | „magazyn energii na zimę kalkulator”, „off grid zimą w polsce” | strona o zimie | Zapis; sezonowo |

**Wykluczenia (słowa negatywne), od pierwszego dnia 💡:** „sklep”, „cena”, „oferta”, „montaż”, „firma”, „wycena”, „dofinansowanie”, „mój prąd”, „praca”, „darmowy kurs”, „pdf”, „schemat” (wg danych z Search Terms dopisujesz kolejne co tydzień). Chodzi o odsianie ludzi szukających wykonawcy lub dotacji, którzy nie kupią apki.

### 3.3. Szkic reklam (do poprawy po G1; limity: nagłówek 30 znaków, opis 90)
**Nagłówki (przykłady):** „Kalkulator off-grid z zimą”, „Ile akumulatorów do domu?”, „Sprawdź magazyn na styczeń”, „Dobór kabla i bezpiecznika”, „Liczy twardo, nie na oko”, „Wynik za darmo, bez konta”.
**Opisy:** „Policz magazyn, panele i kable dla swojego domu. Ostrzeżenia bezpieczeństwa i zima w cenie.” / „Darmowy wynik z werdyktem. Zanim kupisz sprzęt za dziesiątki tysięcy, sprawdź założenia.”
Zasady: prawda o tym, co apka robi dziś (sprawdzić w `docs/rejestr-pokrycia.md` zakres modułów, szczególnie M7 zima i M12, bo są wśród dużych luk); bez obietnic oszczędności; bez wyrażeń „najlepszy”/„gwarantowany”.

### 3.4. Śledzenie (bez tego reklamy są ślepe)
Zdarzenia: `kalkulator_start`, `kalkulator_wynik`, `zapis_lista`, po G3 `koszyk` i `zakup`. Zapis na listę jest główną konwersją testu. Bez zgody w banerze cookies pomiar i remarketing są ograniczone (patrz `02`, sekcja 8).

### 3.5. Co czytać co tydzień (15 minut)
1. Raport „Wyszukiwane hasła”: dopisz wykluczenia i **nowe frazy do pliku CSV**.
2. Koszt zapisu vs limit z `01`, sekcja 3.
3. Które strony mają najwyższy odsetek zapisów (to one dostają więcej treści).

## 4. Dobór reklamy do etapu

| Etap | Co reklamować | Budżet | Uwagi |
|---|---|---|---|
| G0–G1 | nic płatnego, tylko SEO | 0 zł | Strony i śledzenie |
| Po G1, przed G3 | zapis na listę (grupy A, C) | 750–1200 zł/mies. | Mierzymy koszt zapisu |
| Po G3 | + grupa B i retargeting zakupu | wg `01` sekcja 3, nie ponad limit | Kupujemy tylko to, co mieści się w CAC |
| Black Friday (27.11.2026) | zniżka założycielska lub kody podarunkowe | do ustalenia po danych | Wymaga G3 przed tym terminem |

## 5. Czego nie robić
- Nie kupować reklam na „fotowoltaika cena” i „instalacja fotowoltaiki” (6–18 zł za kliknięcie, ludzie szukają montażu).
- Nie kierować reklam na stronę główną (zbyt ogólna). Zawsze na stronę pasującą do frazy.
- Nie prowadzić reklam bez śledzenia konwersji.
- Nie uruchamiać reklam z „obietnicą” funkcji, której apka jeszcze nie ma.
