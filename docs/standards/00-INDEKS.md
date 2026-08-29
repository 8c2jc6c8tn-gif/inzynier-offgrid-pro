# Standard "Inżynier Pro" — indeks rozdziałów

Pakiet referencyjny dla wszystkich aplikacji rodziny (Offgrid Pro, Szkieletowy Pro, Kalkulator Inżyniera Pro i przyszłe kalkulatory domenowe). Jeden plik = jeden rozdział, każdy samodzielnie czytelny. Powiązany z `docs/memory.md` (specyfika tego konkretnego projektu) i `CLAUDE.md` (krótki punkt wejścia dla AI).

## Zalecana kolejność czytania

**Na starcie każdej sesji nad projektem z tej rodziny:** `CLAUDE.md` → `docs/memory.md` → [00](00-filozofia.md) → dokument tematyczny związany z zadaniem.

**Przy budowie nowego projektu od zera:** 00 → 01 → 02 → 03 → 04 → reszta wg potrzeby.

## Spis rozdziałów

| # | Rozdział | O czym |
|---|---|---|
| [00](00-filozofia.md) | Filozofia i jak czytać ten standard | Nadrzędność standardu nad kodem, filozofia produktowa i procesowa, skąd to się wzięło. |
| [01](01-architektura.md) | Architektura | Warstwy, kierunek zależności, wzorzec Kernela, echo pattern, generyczny silnik. |
| [02](02-model-danych.md) | Model danych i profile regionalne | Dane nie kod, model projektu, wersjonowanie schematu i migracje. |
| [03](03-jadro-obliczeniowe.md) | Jądro obliczeniowe | Kontrakt wyniku, status, podwójna weryfikacja, jednostki i zaokrąglenia, audit trail. |
| [04](04-walidacja-i-twarde-stopy.md) | Walidacja, ostrzeżenia i twarde stopy | Werdykt 🟢🟡🔴, Kontrakt Widżetu, zbiorczy rejestr twardych stopów. |
| [05](05-baza-danych-offline.md) | Baza danych i offline-first | Seed vs Wynik, StorageAdapter, offline jako wymóg. |
| [06](06-api-i-siec.md) | API i sieć | Proxy bez zmyślania danych, offline queue, sekrety server-side. |
| [07](07-bezpieczenstwo.md) | Bezpieczeństwo i prywatność | Mapowanie natywne→web, nagłówki, prywatność lokalna-domyślna. |
| [08](08-ui-ux.md) | UI/UX i treść | Taksonomia wzorców ekranu A-H, szablon Doradcy, tryb prosty/ekspercki. |
| [09](09-ai-w-produkcie.md) | Zasady i granice AI w produkcie | AI vs kalkulatory, architektura narzędziowa, ujawnianie niepewności. |
| [10](10-testy.md) | Testy | Minimalny zestaw per kalkulator, test integracyjny jądra, DoD. |
| [11](11-ci-deployment.md) | CI/Deployment | Jeden lockfile, CI niezależne od hostingu. |
| [12](12-freemium.md) | Freemium i płatności | Feature→tier jako dane, egzekwowanie server-side. |
| [13](13-droga-mobile.md) | Droga web → mobile | Punkty wymiany, etapowanie. |
| [14](14-proces-i-pamiec.md) | Proces, wersjonowanie i pamięć projektu | Dziennik zmian, znane luki, `docs/memory.md`. |
| [15](15-wspolpraca-z-ai.md) | Współpraca z asystentami AI | Integralność informacji, hierarchia źródeł prawdy, zgłaszanie konfliktów. Źródło `CLAUDE.md`. |

## Zasada dla tego pakietu samego w sobie

Ten standard podlega tym samym zasadom, które opisuje — w szczególności rozdziałowi 14 (jawna korekta zamiast cichego nadpisania) i rozdziałowi 15 (nigdy nie rozstrzygaj konfliktu samodzielnie). Zmiana reguły w jednym z projektów rodziny, która ma zastosować się do wszystkich, wraca tutaj — nie zostaje lokalną, niewidoczną modyfikacją w jednym repo.
