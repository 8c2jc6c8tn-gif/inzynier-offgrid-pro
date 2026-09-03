# 13 — Droga web → mobile

Powiązane: [01 Architektura](01-architektura.md) · [05 Baza danych i offline-first](05-baza-danych-offline.md)

---

## 13.1. Zasada

**Reguła.** Aplikacja startuje jako web/PWA, z architekturą od pierwszego dnia gotową na przeniesienie na mobile (natywne lub React Native/podobne) bez przepisywania jądra domenowego. "Skóra się zmienia, serce zostaje."

**Warunek konieczny (patrz rozdział 01.1).** Cała logika domenowa jest w 100% przenośna, bo nie zależy od niczego platformowego. Jeśli ta zasada jest złamana gdziekolwiek w jądrze, migracja na mobile przestaje być "wymianą skóry" i staje się przepisaniem od zera.

## 13.2. Punkty wymiany przy migracji

| Warstwa web | Odpowiednik mobile |
|---|---|
| IndexedDB (przez `StorageAdapter`) | SQLite (przez ten sam interfejs `StorageAdapter`) |
| Service Worker | natywny mechanizm offline platformy |
| WebCrypto + HttpOnly cookies | Android Keystore / iOS Keychain |
| Next.js/React (warstwa prezentacji) | React Native / natywne widoki |

Żadna z tych zmian nie dotyka `domain/`/`core/` — dotyka wyłącznie `infrastructure/` i `presentation/` (rozdział 01).

## 13.3. Etapowanie (przykładowe, do adaptacji per projekt)

Poniższa kolejność to **jeden konkretny przykład** etapowania z jednego z naszych wcześniejszych projektów, nie obowiązujący dla wszystkich wzorzec: (1) desktop/tablet jako prototyp, (2) PWA responsywna z pełnym trybem offline, (3) warianty funkcjonalne zróżnicowane wg potrzeb (np. wersja podstawowa bez ciężkiego lokalnego AI / wersja premium z lokalnym asystentem i kamerą), (4) natywna aplikacja mobilna tam, gdzie uzasadnione, (5) rozszerzenia specjalistyczne (AR/VR/inne), jeśli domena tego wymaga. Każdy kolejny etap jest **nadbudową** nad tym samym jądrem domenowym, nie jego zamianą — większość projektów zatrzyma się na etapie 2 lub 3, i to jest normalne, nie niedokończenie.

Konkretna roadmapa i tempo etapowania to decyzja per projekt — należy do `docs/memory.md`, nie do tego standardu. Zasada procesowa: roadmapa opisuje kierunek, nie sztywny harmonogram; każda zmiana priorytetów jest zapisywana z uzasadnieniem, nie cicho.
