# 00 — Filozofia i jak czytać ten standard

**Status:** żywy dokument · **Wersja:** 1.1 · **Data:** 2026‑09‑03 (poprzednia: 1.0, 2026‑08‑29)
**Zastosowanie:** wszystkie nasze aplikacje, niezależnie od domeny — obecne i przyszłe.

---

## 0.1. Co to jest ten dokument

To jest **standard architektoniczny i procesowy**, nie specyfikacja funkcjonalna jednej aplikacji. Każdy projekt ma własną specyfikację domenową (np. dokument "co dokładnie liczymy/śledzimy w tej konkretnej aplikacji") — ten standard mówi **jak** budować, niezależnie od tego, co konkretnie aplikacja robi.

Ten standard jest **nadrzędny wobec kodu**. Jeśli kod i standard się nie zgadzają — standard wygrywa, albo standard zostaje świadomie zmieniony z wpisem w dzienniku zmian (rozdział 14). Nigdy cicha rozbieżność.

**Doprecyzowanie (2026-09-03, przy integracji z GOD BOOK — `docs/god-book/instrukcja-uniwersalna-biblii-projektu-v2_20.md`, Część Y.2):** "standard wygrywa" dotyczy dryfu bez świadomej decyzji — kod, który odjechał od już ustalonej reguły, a nikt świadomie nie zdecydował, że tak ma być. To naprawiasz od razu, bez pytania. Gdy natomiast Biblia projektu (Złota Zasada, decyzja) świadomie i jawnie chce czegoś innego niż ten standard — to nie jest "kod kontra standard", to prawdziwy konflikt dwóch źródeł zamiaru, i obowiązuje rozdział 15.4 (nigdy nie rozstrzygaj sam) — nie automatyczne pierwszeństwo standardu.

Każda zasada w tych rozdziałach ma, tam gdzie to możliwe, kształt: **reguła → uzasadnienie → konsekwencja w kodzie**. To nie jest lista życzeń — to lista rzeczy do faktycznego wymuszenia (lintem, testem, code review, hookiem).

## 0.2. Jak zbudowany jest ten pakiet

- `docs/standards/00-INDEKS.md` — spis rozdziałów z zalecaną kolejnością czytania wg zadania.
- `docs/standards/00`–`15` — poszczególne rozdziały, każdy samodzielnie czytelny.
- `docs/memory.md` (w każdym projekcie osobno) — żywy log decyzji, pułapek i kontekstu specyficznego dla tego konkretnego projektu. Ten standard mówi *jak* budować dowolną naszą aplikację; `docs/memory.md` mówi, co już wiemy o *tej konkretnej* aplikacji.
- `CLAUDE.md` (w każdym projekcie, root) — krótki punkt wejścia dla asystentów AI, odsyła tutaj i do `docs/memory.md`, nie duplikuje treści.
- `docs/god-book/instrukcja-uniwersalna-biblii-projektu-v2_20.md` (w każdym projekcie osobno, kopia z tego repo) — osobny dokument procesowy: jak prowadzić burzę mózgów i budować Biblię *tego* projektu (Złote Zasady, rejestr decyzji, moduły) od zera do wdrożenia. Ten standard jest dla niego fundamentem poprzedzającym, nie częścią — pełna relacja w Części Y tamtego dokumentu.

**Zasada.** Nowy rozdział = nowy plik. Nie dopisujemy nowych tematów do istniejących rozdziałów, jeśli temat zasługuje na własny — jeden plik ma zostać czytelny w jednym posiedzeniu i ładowalny selektywnie do kontekstu AI bez ciągnięcia całości.

## 0.3. Filozofia produktowa (dziedziczona przez każdy nasz projekt)

1. Aplikacja ustala **twarde, weryfikowalne fakty domenowe**, nie przybliżenia czy "internetowe opinie". Każdy wynik musi dać się wyprowadzić z jawnej reguły/wzoru/źródła, a to źródło musi być wskazane.
2. Aplikacja **ostrzega przed pułapkami**, o których nowicjusz zapomina — to jest część produktu, nie dodatek.
3. Aplikacja działa **w pełni offline** po pierwszym pobraniu danych (rozdział 05).
4. Aplikacja tłumaczy **"po ludzku"** i pokazuje **twardą podstawę wyniku** (wzór, źródło, dane wejściowe) równocześnie — nigdy tylko jedno z dwojga (rozdział 08).
5. Aplikacja jest **prowadzona przez deterministyczną logikę domenową**, nie przez model językowy — AI pomaga korzystać z tej logiki, nie zastępuje jej (rozdział 09).
6. Niepewność jest **jawnie oznaczana**, nigdy ukrywana pod pozorem pewności (rozdziały 03, 04, 08, 09).

## 0.4. Filozofia procesowa (jak pracujemy, niezależnie od produktu)

1. **Istniejąca informacja jest źródłem prawdy** — dokumentacja, kod, wcześniejsze decyzje. Nic nie znika cicho (rozdział 15).
2. **Konflikt informacji nigdy nie jest rozstrzygany samodzielnie przez AI** — zawsze trafia z powrotem do człowieka, z jasno przedstawionymi opcjami (rozdział 15).
3. **Zweryfikowane programistycznie, nie z deklaracji** — liczby, statusy "gotowe", pokrycie funkcji ustala się przeliczeniem rzeczywistej treści, nie ufa się metryczce dokumentu (rozdział 14).
4. **Zero cichych błędów i zero cichych luk** — złapany wyjątek jest raportowany, niedokończony fragment jest jawnie wypisany w sekcji "znane luki", nie przemilczany (rozdziały 04, 14).
5. **Web dziś, mobile jutro, bez przepisywania serca aplikacji** — architektura od pierwszego dnia zakłada tę migrację (rozdziały 01, 13).
6. **Kod ma być prosty do utrzymania przez człowieka** — czytelność i modularność wygrywają z "sprytnym" skrótem, jeśli trzeba wybierać. Zwięzłość jest wartością, ale ostatnią na liście priorytetów, nie pierwszą (rozdział 16).

## 0.5. Skąd to się wzięło

Ten standard powstał ze scalenia doświadczeń wypracowanych w kilku wcześniejszych naszych projektach: zasad architektonicznych wypracowanych dla pierwszej dużej aplikacji domenowej, audytu architektury drugiego projektu (co się sprawdziło, czego nie powielać), metodologii tworzenia treści i wzorców UI wypracowanej na projekcie z kilkuset funkcjami domenowymi, oraz kompletu zasad kodowania i współpracy z AI wypracowanych na kolejnym projekcie. Żadne z tych źródeł nie zostało odrzucone milcząco — sprzeczności między nimi zostały rozstrzygnięte jawnie i są odnotowane w rozdziałach, których dotyczą.

Standard jest celowo pisany na poziomie abstrakcji "jak budujemy", nie "co dokładnie liczy ta jedna aplikacja" — każdy przykład domenowy w tekście (np. z aplikacji inżynierskich, spożywczych czy finansowych) jest ilustracją zasady, nie założeniem, że każdy projekt musi mieć dokładnie taki sam kształt danych czy ryzyka.
