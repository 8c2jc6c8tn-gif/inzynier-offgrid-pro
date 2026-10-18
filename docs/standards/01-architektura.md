# 01 — Architektura

Powiązane: [00 Filozofia](00-filozofia.md) · [02 Model danych](02-model-danych.md) · [03 Jądro logiki domenowej](03-jadro-obliczeniowe.md) · [13 Droga web → mobile](13-droga-mobile.md)

---

## 1.1. Zasada nadrzędna: logika nie wie nic o platformie

**Reguła.** Cała logika domenowa (jądro obliczeniowe/decyzyjne, profile kontekstowe, walidacja, reguły biznesowe, i18n) jest napisana jako czyste funkcje bez efektów ubocznych. Nie importuje niczego z warstwy UI, DOM, `window`, `fetch`, bazy danych, systemu plików ani kamery/AI.

**Uzasadnienie.** To zwykle większość realnej wartości produktu i jest w 100% przenośne między platformami. Przejście web → mobile, albo zmiana frameworka UI, ma kosztować "skórę, nie serce".

**Konsekwencja w kodzie.** Podział na warstwy, egzekwowany lintem (`domain`/`core` nie może importować z warstw wyższych):

```
domain/ (core/)  → czyste funkcje: logika domenowa, modele, walidacja, jednostki, ostrzeżenia, i18n
application/     → przypadki użycia, orkiestracja logiki domenowej, zapis stanu, raporty, komunikacja z AI
infrastructure/  → baza, system plików, kamera, OCR, modele AI, sieć, płatności (za interfejsami/adapterami)
presentation/    → ekrany, komponenty, hooki — wymienne (web dziś, mobile jutro)
```

Mniejsze projekty mogą spłaszczyć `application` do `domain`, dając trójwarstwowy podział `core / adapters / app` — wybór zależy od skali projektu, ale **kierunek zależności jest zawsze ten sam**: `presentation → application → domain`, nigdy odwrotnie, i `infrastructure` nigdy nie jest importowane przez `domain`.

**Zakaz odwrotny, jawnie.** Kierunek zależności (import) to jedna strona tej zasady — druga, równie wiążąca: **warstwa prezentacji nie zawiera logiki obliczeniowej/decyzyjnej**. Komponent UI wywołuje funkcję domenową i wyświetla jej wynik; nie przelicza niczego samodzielnie "przy okazji" (np. inline w komponencie), nawet jeśli to tylko dwie linijki. Dwie linijki dziś to duplikat jutro, gdy reguła się zmieni w jednym miejscu, a nie w drugim (patrz 1.3, wzorzec echo).

## 1.2. Wzorzec Kernela — graf modułów z jawnymi zależnościami

**Reguła.** Gdy projekt ma wiele współzależnych obliczeń/decyzji (dziesiątki+), każdy moduł deklaruje `{nazwa, dependsOn, produces}` **przed** napisaniem logiki. Jedyny zapis wyniku do stanu globalnego dzieje się wewnątrz silnika (`Kernel.przelicz()`) — moduł dostaje wyniki zależności tylko do odczytu, nigdy nie modyfikuje stanu innego modułu bezpośrednio.

**Uzasadnienie.** Powyżej kilkunastu współzależnych obliczeń ręczne zarządzanie kolejnością przeliczania i propagacją zmian staje się źródłem cichych błędów. Graf zależności + jawna kolejność topologiczna to jedyny sprawdzony sposób utrzymania tego w ryzach przy 30+ modułach.

**Konsekwencja w kodzie.**
- Zmiana danych wejściowych (`ustawSeed()`) oznacza moduł i wszystkich zależnych od niego (rekurencyjnie) jako "dirty".
- Przeliczenie sortuje moduły topologicznie i liczy tylko te oznaczone jako nieaktualne.
- Odczyt niezadeklarowanej zależności **rzuca wyjątek** — zależności się deklaruje z góry, nie "odkrywa" ad hoc podczas pisania logiki.
- **Jedna bramka błędów**: każdy moduł wywoływany jest przez wspólny wrapper (`bezpiecznieOblicz()`), który łapie wyjątek i zamienia go na ustandaryzowany wynik ze statusem błędu — komponent UI zawsze dostaje spójny kształt danych, nigdy surowy wyjątek.

Dla mniejszych projektów (kilka–kilkanaście modułów logiki) pełny Kernel bywa nadmiarowy — wystarczy jawna orkiestracja w warstwie `application`, ale zasada "jedna bramka błędów" i "zależności deklarowane z góry" obowiązuje niezależnie od skali.

[07.10.2026] ✅ DODANO — źródło: inzynier-szkieletowy-pro (U.4, wpisy z 04–05.10.2026), decyzja właściciela repo. **Dwa ryzyka grafu, których Kernel sam nie zgłosi:**
- **Cecha współdzielona ma jedno źródło.** Cecha materiału lub produktu używana przez więcej niż jeden moduł (energetyka, ppoż., akustyka, koszty) żyje w jednym miejscu (katalog albo warstwa), a moduły pochodne czytają ją przez `dependsOn`. Pole lokalne w module pochodnym jest dopuszczalne wyłącznie jako jawny zapas „cecha nieznana” (bez zgadywania). Opis tego samego elementu w dwóch modułach rozjechał się raz tak, że wynik pożarowy był o trzy klasy po stronie niebezpiecznej (REI 60 zamiast 20), a testy każdego modułu z osobna były zielone. UI pokazuje źródło wartości zamiast edytowalnego duplikatu. Wynik słaby z powodu wyboru materiału może nieść policzoną alternatywę (zalecane, nie wymóg).
- **Brak krawędzi w grafie to brak danych, nie błąd.** Moduł agregujący („całość”: masa, koszty, bilans, raport) cicho pomija wszystko, czego nie ma w jego `dependsOn`; nowy moduł z danymi fizycznymi nie ma automatycznie konsumentów (dom z antresolą liczył się jak parterowy). Przy dodawaniu modułu wynikowego obowiązuje punkt: **które moduły agregujące powinny go czytać** — dopisane do ich `dependsOn` albo jawnie wykluczone z uzasadnieniem. Test łańcucha na pełnym grafie: 10.10 pkt 5.

## 1.3. Wzorzec "echo" zamiast duplikowania logiki

**Reguła.** Gdy wynik modułu A jest potrzebny dalej w łańcuchu przez moduł C (zależny od B, zależnego od A), B "echouje" gotowe pole zamiast przeliczać tę samą logikę od nowa.

**Uzasadnienie.** Jedno źródło prawdy dla każdej wartości. Duplikacja logiki oznacza dwa miejsca do synchronizacji przy każdej zmianie reguły — prędzej czy później się rozjadą.

**Konsekwencja.** Ta sama zasada dotyczy treści, nie tylko kodu: gdy ten sam temat pojawia się w dwóch miejscach specyfikacji (typowy skutek organicznego rozrostu dużych dokumentów źródłowych), docelowa implementacja ma jedno miejsce z pełną logiką, a pozostałe **odsyłają**, zamiast duplikować (patrz rozdział 14 o wykrywaniu takich duplikatów).

## 1.4. Generyczny silnik zamiast dziesiątek podobnych implementacji

**Reguła.** Gdy dziesiątki funkcji różnią się tylko parametrami tego samego wzorca ("wpływ czynnika X na wynik Y"), buduje się **jeden generyczny silnik + tabela parametrów**, nie dziesiątki osobnych implementacji.

**Uzasadnienie.** To ten sam koncept co zasada "profile jako dane, nie kod" (rozdział 02), tylko zastosowany na poziomie architektury obliczeń, nie tylko konfiguracji regionalnej. Sprawdzony w praktyce przykład z jednego z naszych projektów: kilkadziesiąt funkcji "wpływ czynnika X na wynik Y", które różniły się tylko wybranym czynnikiem, zaimplementowane jako jeden silnik z dropdownem parametru, nie N osobnych ekranów i N osobnych implementacji.

**Konsekwencja.** Przed napisaniem N podobnych funkcji, sprawdź czy różnią się tylko parametrami — jeśli tak, napisz jeden silnik.

## 1.5. Struktura repozytorium (przykładowa, do adaptacji)

```
project/
├── app/ (lub src/)
│   ├── domain/            (core/)
│   │   ├── calculators/    (lub: rules/, logic/ — nazwa wg domeny projektu)
│   │   ├── models/
│   │   ├── units/
│   │   ├── validation/
│   │   └── warnings/
│   ├── application/
│   │   ├── use_cases/
│   │   ├── services/
│   │   └── dto/
│   ├── infrastructure/
│   │   ├── database/
│   │   ├── camera/  ai/  reports/  storage/
│   └── presentation/
│       ├── web/  api/  pwa/  mobile/
├── tests/
│   ├── unit/  integration/  fixtures/
├── docs/
│   ├── standards/          ← ten pakiet
│   └── memory.md
├── CLAUDE.md
└── README.md
```

## 1.6. Moduły funkcjonalne

**Reguła.** Każdy moduł domenowy (np. w zależności od projektu: "Kategoria produktów", "Fundament", "Baterie") ma własne: modele danych, logikę/kalkulatory, walidatory, testy, definicje ostrzeżeń, dokumentację. Moduły nie piszą do siebie nawzajem — patrz 1.2.

## 1.7. Decyzje otwarte per projekt (do wypełnienia w `docs/memory.md`, nie tutaj)

Ten standard celowo nie narzuca: docelowego frameworku UI, formatu głównej bazy danych, sposobu synchronizacji między urządzeniami, dokładnego formatu systemu pluginów modułów, modelu uprawnień użytkowników, docelowego silnika 3D (jeśli w ogóle dotyczy). To są decyzje per-projekt — zapisz je i ich uzasadnienie w `docs/memory.md` tego konkretnego projektu, nie zgaduj ani nie kopiuj bezmyślnie z innego naszego projektu.
