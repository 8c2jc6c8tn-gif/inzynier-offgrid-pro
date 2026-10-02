# 01. Ekonomia marketingu i bramki decyzyjne

Data: 02.10.2026 · Rozwija sekcje 2, 5 i 11 pliku `04_Plan_Rozwoju_i_Sprzedazy.md` · Oznaczenia: ✅ ustalone · 💡 rekomendacja · 🔎 niezweryfikowane, sprawdzić

Po co ten plik: zanim wydasz złotówkę na reklamy, trzeba wiedzieć, **ile wolno zapłacić za jednego klienta**. Reszta planu (Google, Facebook, strona) opiera się na tych liczbach.

## 1. Ile wolno zapłacić za klienta (CAC maksymalny)

Z jednej sprzedaży na własnej stronie zostaje (po VAT 23% i ~2% prowizji płatności, liczby z `plan-sprzedazy.md`):

| Produkt | Zostaje |
|---|---|
| Roczny 599 zł | ~477 zł |
| Założycielski 399 zł | ~318 zł |
| Pakiet projektowy 299 zł | ~238 zł |
| Instalator 1490 zł | ~1187 zł |

💡 **Przyjmuję limit CAC = 250 zł** na jednego kupującego plan roczny. Dlaczego nie 477 zł: trzeba zostawić miejsce na zwroty (gwarancja 30 dni), koszt AI i serwerów, pracę nad apką oraz błąd w moich założeniach. Przy planie założycielskim (318 zł) limit jest mniejszy, więc reklamy płatne warto kierować na cenę zwykłą.

Plan roczny płaci się z góry, więc **reklama zwraca się od razu**, jeśli CAC jest poniżej ~477 zł. To duża przewaga nad abonamentem miesięcznym.

## 2. Co z tego wynika dla reklam (to jest najważniejsza tabela)

Wzór: **CAC = koszt kliknięcia ÷ odsetek kliknięć, które kończą się zakupem.**

Odsetek „kliknięcie → zakup” jest **niewiadomą**. Dla darmowego narzędzia z listą oczekujących zakładam (🔎 założenie, nie dane): ok. 5–10% odwiedzających zapisuje się, a 3–5% zapisanych kupuje, czyli **0,15–0,5% kliknięć kończy się zakupem**. Dla fraz o zamiarze zakupu (np. „program do projektowania off grid”) może być kilka razy lepiej.

| Koszt kliknięcia | CAC przy 0,25% | CAC przy 0,5% | CAC przy 1% | CAC przy 2% |
|---|---|---|---|---|
| 1 zł | 400 zł | 200 zł | 100 zł | 50 zł |
| 2 zł | 800 zł | 400 zł | 200 zł | 100 zł |
| 4 zł | 1600 zł | 800 zł | 400 zł | 200 zł |
| 8 zł | 3200 zł | 1600 zł | 800 zł | 400 zł |

Pola mieszczące się w limicie 250 zł: tylko lewy dolny róg tabeli (tanie kliknięcia albo wysoka konwersja).

**Wniosek 💡:** reklamy płatne na zimno **nie będą silnikiem wzrostu** w pierwszych miesiącach. Silnikiem są: ruch z wyszukiwarki (frazy long tail), społeczności, lista e‑mail, twórcy i partnerzy. Reklamy służą do (a) **zmierzenia prawdziwych liczb**, (b) **retargetingu** ludzi, którzy już użyli kalkulatora, (c) kilku **fraz o zamiarze zakupu**, które mogą się opłacać.

Dla orientacji o rynku: według przeglądu stawek na stronie [artursmolicki.com](https://artursmolicki.com/blog/stawki-cpc-w-polsce/) (aktualizacja 30.09.2026) kliknięcie w branży „fotowoltaika, pompy ciepła, instalacje” kosztuje 6–18 zł, a mediana dla Polski ok. 2,17 zł. Fotowoltaika to branża droga, bo reklamują się w niej firmy montażowe z leadami wartymi tysiące złotych. Frazy typu „jak obliczyć przekrój kabla” bywają znacznie tańsze (🔎 do sprawdzenia w Planerze słów kluczowych), bo nikt nie zarabia na nich tysięcy.

## 3. Ile płacić za zapis na listę (praktyczna zasada do kampanii)

Skoro celem kampanii jest zapis na listę oczekujących, to **maksymalny koszt zapisu = CAC limit × odsetek zapisanych, którzy kupią**:

| Zapisani, którzy kupią | Limit koszt zapisu (CAC 250 zł) |
|---|---|
| 2% | 5,00 zł |
| 3% | 7,50 zł |
| 5% | 12,50 zł |
| 8% | 20,00 zł |

Odsetek 5% pochodzi ze `strategia-startu-pierwszy-miesiac.md` (reguła branżowa 🔎, nie zmierzona). **Pierwsza zmierzona prawdziwa liczba z bety lub pierwszej wysyłki zastępuje tę regułę.**

## 4. Skala: ilu klientów potrzeba i ile to kosztuje

- Utrzymanie 5000 zł na rękę przy 599 zł/rok to ok. 200–230 aktywnych rocznych klientów, czyli 17–20 nowych planów miesięcznie (`04_Plan…` sekcja 11).
- Gdyby wszystko kupować reklamą, 20 klientów miesięcznie kosztuje:

| CAC | Budżet reklamowy / mies. |
|---|---|
| 150 zł | 3 000 zł |
| 250 zł | 5 000 zł |
| 400 zł | 8 000 zł |
| 600 zł | 12 000 zł |

To pokazuje, dlaczego plan zakłada **mieszankę** (organiczny + społeczności + partnerzy), a nie same reklamy. Przy CAC powyżej limitu każdy płatny klient jest dokładany z własnej kieszeni (czasem warto, patrz sekcja 6).

## 5. Pierwszy miesiąc a miesiąc trzeci

Ruch z Google na nowej domenie nie pojawia się od razu. Strony zaindeksowane w październiku zwykle zaczynają przynosić pierwsze odwiedziny po kilku tygodniach, a stabilny ruch po 3–6 miesiącach (🔎 reguła branżowa, bardzo zależna od konkurencji; w tej niszy są małe konkurencyjne strony typu offgridkalkulator.pl czy kalkulatory sklepów, więc nisza nie jest pusta).

Dlatego dwa cele mają **dwa różne silniki**:

| Cel | Co go napędza |
|---|---|
| Pierwszy miesiąc sprzedaży (5–10 tys.) | Lista oczekujących z grup, twórców, własnych reklam testowych; oferta założycielska |
| Utrzymanie 5000 zł co miesiąc | Ruch organiczny z tysięcy fraz, polecenia, partnerzy, e‑mail, odnowienia |

Treści na stronę trzeba więc zacząć **teraz**, a nie na tydzień przed startem sprzedaży. Sezon też gra: zapytania o zimę i autonomię rosną jesienią (🔎 sprawdzić w Google Trends), a strony o zimie opublikowane w październiku mają szansę złapać grudzień–styczeń.

## 6. Kiedy warto przepłacić (świadomie)

Płacenie ponad limit CAC ma sens w trzech przypadkach:
1. **Pierwsi 20–30 klientów**, bo dają opinie, zrzuty ekranu i studia przypadków (wartość marketingowa większa niż 250 zł).
2. **Retargeting** (zwykle najtańszy kanał, bo odbiorcy już znają apkę).
3. **Frazy o zamiarze zakupu**, które mają wysoką konwersję i wysoką wartość klienta (plan Instalator 1490 zł).

## 7. Bramki decyzyjne (kiedy ruszamy dalej)

Każda faza zaczyna się dopiero po zamknięciu poprzedniej bramki. To odpowiada Twojej zasadzie: nie idziemy do ludzi z niedopracowaną apką.

| Bramka | Warunek | Co odblokowuje |
|---|---|---|
| **G0 Fundamenty** | Domena, strona, formularz listy e‑mail, polityka prywatności i zgody, mierzenie ruchu | Publiczne treści i zbieranie adresów |
| **G1 Jakość** | Mentorzy przejrzeli kalkulatory, które wystawiamy publicznie, a strony nie obiecują więcej niż apka umie | Zaproszenia do twórców i sklepów, reklamy płatne |
| **G2 Beta** | 20–50 testerów, opinie i zgody na ich cytowanie | Dowody społeczne, studia przypadków |
| **G3 Płatności** | Konta, płatności, kody, mapa FREE/PRO działają (zadanie nr 1 z planu) | Start sprzedaży, kampanie na zakup |

Reguły stopu dla reklam (żeby nie spalić pieniędzy):
- po 2 tygodniach i wydaniu ~300 zł na kampanię: jeśli **koszt zapisu jest ponad 2× limit z sekcji 3**, wyłączamy kampanię i poprawiamy stronę, nie podnosimy budżetu;
- po osiągnięciu limitu: powtarzamy co tydzień, podnosimy budżet nie więcej niż o 20–30% na raz;
- sprzedaż startuje dopiero na G3.

## 8. Co mierzymy (najważniejsze liczby tygodniowo)

1. Odwiedzający na stronach narzędzi (osobno: organiczny, reklamy, grupy, e‑mail).
2. Odsetek uruchamiających kalkulator i dochodzących do wyniku.
3. Zapisy na listę i **koszt zapisu**.
4. Otwarcia i kliknięcia w mailach.
5. Po G3: zakupy, **CAC**, zwroty, odnowienia.
6. Frazy, na których strona już się pojawia w Google (Search Console, bezpłatne).
