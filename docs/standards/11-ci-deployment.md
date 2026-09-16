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

[16.09.2026] ✅ DOPRECYZOWANO — źródło: właściciel repo, pytanie kontrolne po przeglądzie `docs/przyklady/ci/`. **Dlaczego akurat "bezpośrednia zależność", a nie po prostu wszystko — czy to nie mniej bezpieczne?** Nie mniej bezpieczne — dopasowane do tego, co autor PR-a faktycznie może naprawić od ręki. Podatność w zależności bezpośredniej naprawia się od razu (bump wersji w `package.json`). Podatność w zależności **tranzytywnej** (pociągniętej przez coś innego, z czego korzystasz) często nie da się naprawić samodzielnie — czeka się, aż pakiet pośredni się zaktualizuje, czasem tygodniami. Blokowanie merge za coś, czego nie da się naprawić, to dokładnie ten sam mechanizm, który już uzasadnia wyżej próg `high`/`critical` zamiast wszystkiego: jeśli bramka jest czerwona z powodów poza kontrolą zespołu wystarczająco często, zespół uczy się ją obchodzić/ignorować, zamiast naprawiać to, co faktycznie może naprawić — odwrotny efekt od zamierzonego. **To nie znaczy "ignoruj tranzytywne"** — pokazuj je informacyjnie (nieblokująco) w tym samym uruchomieniu, żeby człowiek mógł je przejrzeć i świadomie zdecydować (aktualizacja, override, eskalacja), zamiast być zablokowanym bez żadnej ścieżki wyjścia. Konkretna implementacja tego rozróżnienia: 11.6, `docs/przyklady/ci/audit-gate.mjs`.

## 11.6. Przykład referencyjny: CI z dwoma niezależnymi jobami

[16.09.2026] ✅ DODANO — źródło: inzynier-offgrid-pro, zgłoszenie 16.09.2026 (DOBRA PRAKTYKA). 11.2 i 11.5 opisywały dotąd tylko **co** ma być prawdą, bez żadnego konkretnego, sprawdzonego przykładu **jak** to zbudować — dokładnie ten sam wzorzec luki co już zgłoszony dla rozdziału 09 (AI w produkcie: zasady są, kontraktu narzędzia nie było przed 9.3). Skutek w projekcie źródłowym: 11.5 istniało w standardzie od dnia wcześniej, ale realny plik CI powstał dopiero na wyraźne pytanie właściciela projektu.

**Przykład, zweryfikowany w boju** (dwa niezależne joby `quality`/`dependency-audit`, próg audytu na `high`/`critical` nie na wszystko, procedura włączania bramki bez obniżania progu, realna lekcja z 22 znalezionymi podatnościami naprawionymi bez wyjątków): [`docs/przyklady/ci/`](../przyklady/ci/). Transferowalny jest kształt decyzji, nie dosłowny YAML (stack źródłowy: Next.js/pnpm) — odpowiedniki dla innych menedżerów pakietów w tym samym pliku.
