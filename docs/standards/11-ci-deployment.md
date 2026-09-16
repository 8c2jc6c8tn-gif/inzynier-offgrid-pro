# 11 — CI/Deployment

Powiązane: [10 Testy](10-testy.md) · [14 Proces i pamięć](14-proces-i-pamiec.md)

---

## 11.1. Jeden menedżer pakietów, wymuszony automatycznie

**Reguła.** Repozytorium ma dokładnie jeden lockfile jednego menedżera pakietów, od pierwszego commita. Obecność drugiego (nawet nieaktualnego, "zapomnianego") jest blokowana automatycznie — nie ręcznym przeglądem, tylko hookiem/kontrolą uruchamianą przy każdej próbie dodania pliku.

**Uzasadnienie.** Udokumentowany, realny incydent w jednym z naszych wcześniejszych projektów: nieaktualny drugi lockfile obok żywego spowodował, że hosting wybierał zły menedżer pakietów i failował instalację na każdym PR przez kilka dni, niezależnie od treści zmian — przyczyna była całkowicie niezwiązana z rzeczywistą treścią commitów, co maksymalnie utrudniło diagnozę.

## 11.2. CI niezależne od dashboardu hostingu

**Reguła.** Lint + typecheck + testy uruchamiane jawnie na każdym PR w CI repozytorium (np. GitHub Actions), nie tylko pośrednio przez build hostingu.

**Uzasadnienie.** Gdy jedynym źródłem sygnału o awarii jest dashboard zewnętrznego hostingu, diagnoza problemu (np. wspomniany wyżej konflikt lockfile) wymaga ręcznego grzebania w panelu zewnętrznej usługi zamiast bycia widoczną wprost w repozytorium — to wydłuża czas naprawy z minut do dni.

## 11.3. Rytuał domykania większej zmiany

**Reguła.** Zamknięcie nietrywialnej zmiany (nowy moduł, większy refaktoring) wymaga przejścia całego łańcucha: typecheck → testy → build → (jeśli dotyczy UI) weryfikacja w przeglądarce, oraz wpisu w `docs/memory.md` (rozdział 14) jeśli decyzja/pułapka jest warta zapamiętania.

## 11.4. Świadomość dodatkowych branchy narzędziowych

Niektóre narzędzia startowe (np. generatory projektów, buildery wizualne) tworzą własne, dodatkowe branche jako punkt odniesienia dla swoich wdrożeń, poza normalnym przepływem PR-ów zespołu. Przypadkowe usunięcie takiego brancha potrafi zerwać integrację niezależnie od treści commitów w PR-ach zespołu. Jeśli projekt startuje z takiego narzędzia — odnotuj ten fakt w `docs/memory.md` od razu, zanim ktoś (człowiek lub AI) "posprząta" branch wyglądający na nieużywany.

## 11.5. Skanowanie podatności zależności w CI

[15.09.2026] ✅ DODANO — źródło: właściciel repo, audyt zabezpieczenia sesji (rozdz. 07). **Reguła.** CI uruchamia audyt podatności zależności (`npm audit`/`pnpm audit`/Dependabot albo równoważnik menedżera pakietów z 11.1) na każdym PR, tym samym mechanizmem co lint/typecheck/testy (11.2) — nie tylko ręcznie od czasu do czasu. Podatność o poziomie krytycznym/wysokim w bezpośredniej zależności blokuje merge, chyba że świadomie zaakceptowana i odnotowana (z powodem — np. brak dostępnej łatki, ryzyko nie dotyczy sposobu użycia biblioteki w tym projekcie) w `docs/memory.md`.

**Uzasadnienie.** Ten sam powód co 11.2 — poleganie na tym, że "ktoś kiedyś zauważy" ostrzeżenie w logu instalacji albo w dashboardzie zewnętrznej usługi, zamiast na jawnym, wymuszonym sygnale w CI, systematycznie kończy się tym, że znana, załatana podatność siedzi w produkcji miesiącami.
