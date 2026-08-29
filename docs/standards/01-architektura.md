# 01 — Architektura

Powiązane: [00 Filozofia](00-filozofia.md) · [02 Model danych](02-model-danych.md) · [03 Jądro obliczeniowe](03-jadro-obliczeniowe.md) · [13 Droga web → mobile](13-droga-mobile.md)

---

## 1.1. Zasada nadrzędna: logika nie wie nic o platformie

**Reguła.** Cała logika domenowa (jądro obliczeniowe, profile regionalne, walidacja, wzory, reguły biznesowe, i18n) jest napisana jako czyste funkcje bez efektów ubocznych. Nie importuje niczego z warstwy UI, DOM, `window`, `fetch`, bazy danych, systemu plików ani kamery/AI.

**Uzasadnienie.** To zwykle ~70% realnej wartości produktu i jest w 100% przenośne między platformami. Przejście web → mobile, albo Streamlit → PWA, ma kosztować "skórę, nie serce".

**Konsekwencja w kodzie.** Podział na warstwy, egzekwowany lintem (`domain`/`core` nie może importować z warstw wyższych):

```
domain/ (core/)  → czyste funkcje: kalkulatory, modele, walidacja, jednostki, ostrzeżenia, i18n
application/     → przypadki użycia, orkiestracja kalkulatorów, zapis projektu, raporty, komunikacja z AI
infrastructure/  → baza, system plików, kamera, OCR, modele AI, sieć, płatności (za interfejsami/adapterami)
presentation/    → ekrany, komponenty, hooki — wymienne (Next.js dziś, React Native / Streamlit → PWA jutro)
```

Mniejsze projekty mogą spłaszczyć `application` do `domain`, dając trójwarstwowy podział `core / adapters / app` — wybór zależy od skali projektu, ale **kierunek zależności jest zawsze ten sam**: `presentation → application → domain`, nigdy odwrotnie, i `infrastructure` nigdy nie jest importowane przez `domain`.

## 1.2. Wzorzec Kernela — graf modułów z jawnymi zależnościami

**Reguła.** Gdy projekt ma wiele współzależnych obliczeń (dziesiątki+), każdy moduł deklaruje `{nazwa, dependsOn, produces}` **przed** napisaniem logiki. Jedyny zapis wyniku do stanu globalnego dzieje się wewnątrz silnika (`Kernel.przelicz()`) — moduł dostaje wyniki zależności tylko do odczytu, nigdy nie modyfikuje stanu innego modułu bezpośrednio.

**Uzasadnienie.** Powyżej kilkunastu współzależnych obliczeń ręczne zarządzanie kolejnością przeliczania i propagacją zmian staje się źródłem cichych błędów. Graf zależności + jawna kolejność topologiczna to jedyny sprawdzony sposób utrzymania tego w ryzach przy 30+ modułach.

**Konsekwencja w kodzie.**
- Zmiana danych wejściowych (`ustawSeed()`) oznacza moduł i wszystkich zależnych od niego (rekurencyjnie) jako "dirty".
- Przeliczenie sortuje moduły topologicznie i liczy tylko te oznaczone jako nieaktualne.
- Odczyt niezadeklarowanej zależności **rzuca wyjątek** — zależności się deklaruje z góry, nie "odkrywa" ad hoc podczas pisania logiki.
- **Jedna bramka błędów**: każdy moduł wywoływany jest przez wspólny wrapper (`bezpiecznieOblicz()`), który łapie wyjątek i zamienia go na ustandaryzowany wynik ze statusem błędu — komponent UI zawsze dostaje spójny kształt danych, nigdy surowy wyjątek.

Dla mniejszych projektów (kilka–kilkanaście kalkulatorów) pełny Kernel bywa nadmiarowy — wystarczy jawna orkiestracja w warstwie `application`, ale zasada "jedna bramka błędów" i "zależności deklarowane z góry" obowiązuje niezależnie od skali.

## 1.3. Wzorzec "echo" zamiast duplikowania logiki

**Reguła.** Gdy wynik modułu A jest potrzebny dalej w łańcuchu przez moduł C (zależny od B, zależnego od A), B "echouje" gotowe pole zamiast przeliczać tę samą logikę od nowa.

**Uzasadnienie.** Jedno źródło prawdy dla każdej wartości. Duplikacja logiki oznacza dwa miejsca do synchronizacji przy każdej zmianie wzoru — prędzej czy później się rozjadą.

**Konsekwencja.** Ta sama zasada dotyczy treści, nie tylko kodu: gdy ten sam temat pojawia się w dwóch miejscach specyfikacji (typowy skutek organicznego rozrostu dużych dokumentów źródłowych), docelowa implementacja ma jedno miejsce z pełną logiką, a pozostałe **odsyłają**, zamiast duplikować (patrz rozdział 14 o wykrywaniu takich duplikatów).

## 1.4. Generyczny silnik zamiast dziesiątek podobnych implementacji

**Reguła.** Gdy dziesiątki funkcji różnią się tylko parametrami tego samego wzorca ("wpływ czynnika X na wynik Y"), buduje się **jeden generyczny silnik + tabela parametrów**, nie dziesiątki osobnych implementacji.

**Uzasadnienie.** To ten sam koncept co Zasada "profile jako dane, nie kod" (rozdział 02), tylko zastosowany na poziomie architektury obliczeń, nie tylko konfiguracji regionalnej. Konkretny, sprawdzony przykład: 29 funkcji "wpływ czynnika X na COP pompy ciepła" zaimplementowane jako jeden silnik z dropdownem czynnika, nie 29 osobnych ekranów i 29 osobnych implementacji.

**Konsekwencja.** Przed napisaniem N podobnych funkcji, sprawdź czy różnią się tylko parametrami — jeśli tak, napisz jeden silnik.

## 1.5. Struktura repozytorium (przykładowa, do adaptacji)

```
project/
├── app/ (lub src/)
│   ├── domain/            (core/)
│   │   ├── calculators/
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

**Reguła.** Każdy moduł domenowy (np. "Fundament", "Baterie", "Ogrzewanie") ma własne: modele danych, kalkulatory, walidatory, testy, definicje ostrzeżeń, dokumentację. Moduły nie piszą do siebie nawzajem — patrz 1.2.

## 1.7. Decyzje otwarte per projekt (do wypełnienia w `docs/memory.md`, nie tutaj)

Ten standard celowo nie narzuca: docelowego frameworku UI, formatu głównej bazy danych, sposobu synchronizacji między urządzeniami, dokładnego formatu systemu pluginów kalkulatorów, modelu uprawnień użytkowników, docelowego silnika 3D. To są decyzje per-projekt — zapisz je i ich uzasadnienie w `docs/memory.md` tego konkretnego projektu, nie zgaduj ani nie kopiuj bezmyślnie z innego projektu rodziny.
