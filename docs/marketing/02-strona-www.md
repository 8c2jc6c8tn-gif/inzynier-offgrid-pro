# 02. Plan strony internetowej (etap online)

Data: 02.10.2026 · Rozwija sekcje 1 i 6 `04_Plan_Rozwoju_i_Sprzedazy.md` · Oznaczenia: ✅ ustalone · 💡 rekomendacja · 🔎 do sprawdzenia przed wdrożeniem

## 1. Cel strony w jednym zdaniu

Strona ma **złapać ludzi z wyszukiwarki w chwili, gdy mają konkretny problem**, dać im darmowy, prawdziwy wynik z kalkulatora, a potem zaprosić na listę oczekujących i, po starcie, do zakupu. Nie jest wizytówką firmy. Każda podstrona to osobne wejście do apki.

## 2. Uczciwie o konkurencji

W wyszukiwarce już są polskie kalkulatory off‑grid: [offgridkalkulator.pl](https://offgridkalkulator.pl/) (darmowy, kalkulator paneli, akumulatorów, regulatora MPPT i przekroju kabli, poradniki), [uwolnijprad.pl](https://uwolnijprad.pl/kalkulatory/fotowoltaika-off-grid) (firma instalacyjna, kalkulator jako przynęta), [optimalenergy.pl](https://optimalenergy.pl/magazyny-energii/kalkulator-magazynow-energii/), [sklepelektryka24.pl](https://sklepelektryka24.pl/blog/post/7-kalkulator-instalacji-fotowoltaicznej-off-grid), kalkulator Ministerstwa Klimatu na gov.pl (magazyn energii dla prosumentów).

**Co z tego wynika:**
- Proste kalkulatory są bezpłatne i jest ich sporo. Konkurować „darmowym kalkulatorem” samym w sobie nie ma sensu.
- Wasza przewaga jest inna: **głębokość i uczciwość** (twarde stopy bezpieczeństwa, zima, spadki napięcia, zabezpieczenia, TCO, przejście z sieci, raport do zapisu) oraz **brak interesu sprzedawcy sprzętu**. Sklepy i instalatorzy mają kalkulator, żeby sprzedać sprzęt; wy możecie powiedzieć „ten dom się nie opłaca off‑grid”.
- Strategia: darmowy kalkulator **na jedno pytanie** ma dać prawdziwy wynik i pokazać, czego prosty kalkulator nie powie (ostrzeżenie, zimowy deficyt, błędy w doborze). Za pełny raport i projekt płaci się w PRO.

## 3. Struktura serwisu

```
/                         główna: obietnica, darmowe narzędzie, zapis na listę
/kalkulator-off-grid      wejście do narzędzia głównego (frazy: „kalkulator off grid”)
/kalkulator/…             ~10 małych kalkulatorów na jedno pytanie (strony narzędzi)
/poradnik/…               ~15 poradników z mini‑kalkulatorem lub tabelą (strony wiedzy)
/tabele/…                 4 huby z tabelami liczonymi z kalkulatorów (mikro‑frazy)
/cennik                   po G3 (plany, kwoty, gwarancja 30 dni)
/dla-instalatorow         plan Instalator, raport z logo firmy
/partnerzy                program partnerski (jedna strona, parametr ?p=nazwa)
/metodologia              „Jak liczymy”: źródła norm, wersje, twarde stopy
/o-projekcie              kto stoi za apką, mentorzy, kontakt
/lista-oczekujacych       formularz + oferta założycielska
/regulamin, /prywatnosc   wymagane prawnie
```

Szczegóły stron narzędzi i poradników, wraz z frazami i tygodniem publikacji, są w `05-long-tail-grafik.md` i w pliku `hasla-long-tail-grafik.csv`.

## 4. Elementy każdej strony narzędzia (szablon)

1. **Tytuł z frazą** (np. „Ile akumulatorów do domu off‑grid? Kalkulator”) i jedno zdanie obietnicy.
2. **Działający mini‑kalkulator** na górze, bez rejestracji, z prawdziwym wynikiem (werdykt 🟢/🟡/🔴 i główna liczba), zgodnie z tym, że w FREE „wynik jest przed paywallem”.
3. **Pod wynikiem: „czego ten wynik nie uwzględnia”** (np. zimę, rozruch, temperaturę), z odsyłaczem do pełnej apki. To jest naturalny moment do zapisu na listę.
4. **Poradnik pod kalkulatorem** (500–1200 słów): jak liczyć, wzór, przykład liczbowy, typowe błędy, tabela.
5. **Ostrzeżenie bezpieczeństwa tam, gdzie dotyczy** (prace przy 230 V i DC wykonuje osoba z uprawnieniami; to twarde stopy, nie reklama).
6. **Źródło i data aktualizacji** oraz „sprawdził: [mentor]” po akceptacji mentora (to buduje zaufanie i zgodność z zasadami Google o doświadczeniu i wiarygodności 🔎).
7. **Linki do 2–3 powiązanych stron** (silna sieć linków wewnętrznych wzmacnia całą domenę).
8. **Zapis na listę:** „Wyślij mi ten wynik i checklistę błędów” (powód zapisu, nie prośba o adres).

## 5. Zasady, żeby Google nie uznał stron za spam

- Każda strona ma **inną, realnie użyteczną treść i inny wynik**. Zasady Google o „doorway pages” i masowo generowanej treści („scaled content abuse”) dotyczą stron robionych wyłącznie pod frazy; dlatego **huby tabel** (sekcja w `05`) mają jedną stronę na rodzinę fraz, a nie 100 podobnych stron.
- Wszystkie strony pod **jedną marką i jedną domeną** (podstrony, nie osobne domeny). Różny styl graficzny pod różne grupy jest dopuszczalny.
- Osobne mini‑domeny dopiero później, tylko z unikalną treścią, nigdy jako „niezależne recenzje” własnej apki (to wprowadzałoby czytelników w błąd).
- Treści pisane z pomocą AI **muszą** przejść przez człowieka: sprawdzenie liczb przez kalkulator apki, korekta stylu, akceptacja mentora w tematach bezpieczeństwa. Bez tego jest to ryzyko dla reputacji i dla wyników w wyszukiwarce.

## 6. Dwie drogi techniczne (decyzja do podjęcia)

Strona musi być widoczna dla wyszukiwarek (HTML wygenerowany po stronie serwera lub w trakcie budowania), a apka jest PWA działającą offline z własnym service workerem i polityką CSP. Dlatego są dwie sensowne drogi:

| | **A. Osobny serwis marketingowy** | **B. Publiczne trasy w tym samym repo** |
|---|---|---|
| Opis | Prosty statyczny serwis (np. Astro lub Next.js statyczny) na domenie głównej; apka pod `app.` | Trasy `(marketing)` w istniejącej aplikacji Next.js, generowane statycznie |
| Plusy | Szybkość i wynik w Core Web Vitals; zero ryzyka dla PWA; łatwo oddać komuś do prowadzenia | Jeden kod; kalkulatory z `lib/core` użyte bez kopiowania |
| Minusy | Kalkulatory trzeba podpiąć z `lib/core` jako pakiet lub kopię | Ryzyko pomieszania z service workerem i CSP; sprawdzić, czy ruch SEO nie psuje architektury offline |
| 💡 | **Rekomendacja:** A dla treści + kalkulatory z `lib/core` jako wspólny pakiet, jeśli standard (`docs/standards/01`, `11`) na to pozwala 🔎 | Dobre, jeśli spike pokaże brak konfliktu z SW/CSP |

`CLAUDE.md` mówi, że warstwa domenowa nie importuje z UI, więc kalkulator „w przeglądarce” z `lib/core` jest technicznie możliwy; **to jest decyzja architektoniczna do rozstrzygnięcia osobnym zadaniem (spike 1–2 dni), nie w tym wątku.** Jeśli chcesz, wpiszę ją do `docs/lista-do-zrobienia.md` jako zadanie z priorytetem.

## 7. Techniczne minimum SEO (lista kontrolna)

- Szybkie ładowanie na telefonie (większość ruchu z wyszukiwania na takie pytania to telefon, 🔎 sprawdzić w analityce).
- Każda strona: unikalny `title` (≤60 znaków) i `meta description` (≤155), jeden `h1`, logiczne `h2`.
- `sitemap.xml`, `robots.txt`, kanoniczne adresy, polskie adresy URL bez polskich znaków.
- Dane strukturalne: `SoftwareApplication` na głównej, `Article` na poradnikach, `BreadcrumbList`. (FAQ w wynikach Google pojawia się dziś tylko dla wybranych serwisów 🔎, więc FAQ pisz dla czytelnika, nie dla gwiazdek.)
- **Google Search Console** od pierwszego dnia (bezpłatne): pokazuje, na jakie frazy strona się wyświetla. To najlepsze źródło nowych fraz long tail, bo są prawdziwe.
- Linki wewnętrzne: każda strona linkuje do narzędzia głównego i do 2–3 sąsiednich.
- Wersje językowe EN/RU dopiero po sprawdzeniu, że PL działa (apka ma PL/EN/RU, ale ruch zaczyna się po polsku). 🔎 Wersja EN to oddzielna, tania szansa na zagraniczne frazy off‑grid, ale to etap 2.

## 8. Prawo i zaufanie (nie pomijać)

- **RODO i cookies:** baner zgody; analityka za zgodą. Dla reklam Google wymagany tryb zgód (Consent Mode v2) 🔎 sprawdzić aktualne wymagania. Polityka prywatności opisująca listę e‑mail.
- **Zgoda na e‑mail marketing:** osobne pole zgody, potwierdzenie zapisu linkiem (double opt‑in) i widoczne wypisanie 🔎 (sprawdzić z prawnikiem aktualne przepisy o komunikacji elektronicznej).
- **Regulamin i prawo odstąpienia** (zwrot 30 dni to Twoja polityka; ustawowe prawo odstąpienia dla treści cyfrowych wymaga osobnego sformułowania 🔎 — do ustalenia z prawnikiem przed G3).
- **Oznaczanie współpracy** z twórcami jako reklamy (wytyczne UOKiK).
- **Nie obiecujemy oszczędności ani bezpieczeństwa.** Apka to narzędzie wspierające, a prace instalacyjne wykonuje osoba z uprawnieniami (zgodne z personą apki i twardymi stopami).

## 9. Koszty strony (ścieżka najtańsza)

| Pozycja | Koszt orientacyjny 🔎 |
|---|---|
| Domena .pl | ok. 40–70 zł rocznie |
| Hosting statyczny (Cloudflare Pages / Netlify / podobne) | 0 zł na start; sprawdzić, czy darmowy plan dopuszcza użycie komercyjne (np. darmowy plan Vercel jest dla projektów niekomercyjnych) |
| Formularz i lista e‑mail | plany darmowe do kilkuset–tysiąca subskrybentów u kilku dostawców (MailerLite, Brevo itp.) |
| Analityka | Search Console 0 zł; analityka bez ciasteczek (np. Plausible, Umami) ok. 0–40 zł/mies. albo GA4 za zgodą |
| Grafika | Canva lub własne zrzuty z apki, 0 zł |
| Obsługa płatności | po G3, prowizja operatora (~2%) |

**Razem na start: ok. 50–150 zł w pierwszym miesiącu.** Najdroższa jest praca, nie narzędzia.

## 10. Harmonogram strony (niezależnie od daty startu sprzedaży)

| Tydzień | Co |
|---|---|
| 1 | Decyzja A/B i domena; główna strona + lista oczekujących + polityka prywatności; Search Console |
| 1–2 | Pierwsze 4 strony narzędzi (patrz `05`): akumulatory, zima, panele, kabel |
| 3–12 | 2 nowe strony tygodniowo wg grafiku `05` |
| 4 | Strona „Metodologia” i „O projekcie” (z mentorami po ich zgodzie) |
| po G1 | `/dla-instalatorow` i `/partnerzy` |
| po G3 | `/cennik` i przycisk zakupu |
