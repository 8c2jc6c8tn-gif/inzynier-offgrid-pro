# 00 — Filozofia i jak czytać ten standard

**Status:** żywy dokument · **Wersja:** 1.0 · **Data:** 2026‑08‑29
**Zastosowanie:** wszystkie aplikacje rodziny "Inżynier Pro" (Offgrid, Szkieletowy, Kalkulator Inżyniera Pro i przyszłe kalkulatory domenowe).

---

## 0.1. Co to jest ten dokument

To jest **standard architektoniczny i procesowy**, nie specyfikacja funkcjonalna jednej aplikacji. Każdy projekt z rodziny ma własną specyfikację domenową (np. "Biblia" dla Offgrid) — ten standard mówi **jak** budować, niezależnie od tego, co konkretnie się liczy.

Ten standard jest **nadrzędny wobec kodu**. Jeśli kod i standard się nie zgadzają — standard wygrywa, albo standard zostaje świadomie zmieniony z wpisem w dzienniku zmian (rozdział 14). Nigdy cicha rozbieżność.

Każda zasada w tych rozdziałach ma, tam gdzie to możliwe, kształt: **reguła → uzasadnienie → konsekwencja w kodzie**. To nie jest lista życzeń — to lista rzeczy do faktycznego wymuszenia (lintem, testem, code review, hookiem).

## 0.2. Jak zbudowany jest ten pakiet

- `docs/standards/00-INDEKS.md` — spis rozdziałów z zalecaną kolejnością czytania wg zadania.
- `docs/standards/00`–`15` — poszczególne rozdziały, każdy samodzielnie czytelny.
- `docs/memory.md` (w każdym projekcie osobno) — żywy log decyzji, pułapek i kontekstu specyficznego dla tego konkretnego projektu. Ten standard mówi *jak* budować dowolną aplikację z rodziny; `docs/memory.md` mówi, co już wiemy o *tej konkretnej* aplikacji.
- `CLAUDE.md` (w każdym projekcie, root) — krótki punkt wejścia dla asystentów AI, odsyła tutaj i do `docs/memory.md`, nie duplikuje treści.

**Zasada:** nowy rozdział = nowy plik. Nie dopisujemy nowych tematów do istniejących rozdziałów, jeśli temat zasługuje na własny — jeden plik ma zostać czytelny w jednym posiedzeniu i ładowalny selektywnie do kontekstu AI bez ciągnięcia całości.

## 0.3. Filozofia produktowa (dziedziczona przez każdy projekt rodziny)

1. Aplikacja liczy **twarde fakty fizyczne/inżynierskie**, nie przybliżenia czy "internetowe opinie". Każdy wynik musi dać się wyprowadzić ze wzoru, wzór musi mieć źródło.
2. Aplikacja **ostrzega przed pułapkami**, o których nowicjusz zapomina — to jest część produktu, nie dodatek.
3. Aplikacja działa **w pełni offline** po pierwszym pobraniu danych (rozdział 05).
4. Aplikacja tłumaczy **"po ludzku"** i pokazuje **twardą fizykę** równocześnie — nigdy tylko jedno z dwojga (rozdział 08).
5. Aplikacja jest **prowadzona przez deterministyczne kalkulatory**, nie przez model językowy — AI pomaga korzystać z kalkulatorów, nie zastępuje ich (rozdział 09).
6. Niepewność jest **jawnie oznaczana**, nigdy ukrywana pod pozorem pewności (rozdziały 03, 04, 08, 09).

## 0.4. Filozofia procesowa (jak pracujemy, niezależnie od produktu)

1. **Istniejąca informacja jest źródłem prawdy** — dokumentacja, kod, wcześniejsze decyzje. Nic nie znika cicho (rozdział 15).
2. **Konflikt informacji nigdy nie jest rozstrzygany samodzielnie przez AI** — zawsze trafia z powrotem do człowieka, z jasno przedstawionymi opcjami (rozdział 15).
3. **Zweryfikowane programistycznie, nie z deklaracji** — liczby, statusy "gotowe", pokrycie funkcji ustala się przeliczeniem rzeczywistej treści, nie ufa się metryczce dokumentu (rozdział 14).
4. **Zero cichych błędów i zero cichych luk** — złapany wyjątek jest raportowany, niedokończony fragment jest jawnie wypisany w sekcji "znane luki", nie przemilczany (rozdziały 04, 14).
5. **Web dziś, mobile jutro, bez przepisywania serca aplikacji** — architektura od pierwszego dnia zakłada tę migrację (rozdziały 01, 13).

## 0.5. Skąd to się wzięło

Ten standard powstał ze scalenia: zasad architektonicznych wypracowanych dla Offgrid Pro, audytu architektury aplikacji "Inżynier szkieletowy Pro" (co się sprawdziło, czego nie powielać), metodologii tworzenia treści i wzorców UI wypracowanej dla ~580 funkcji Offgrid, oraz kompletu dokumentów AI z projektu "Kalkulator Inżyniera Pro" (zasady kodowania, architektura warstwowa, zasady współpracy z AI). Żadne z tych źródeł nie zostało odrzucone milcząco — sprzeczności między nimi zostały rozstrzygnięte jawnie i są odnotowane w rozdziałach, których dotyczą.
