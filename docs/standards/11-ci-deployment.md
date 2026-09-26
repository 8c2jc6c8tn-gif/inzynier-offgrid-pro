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

## 11.7. Artefakty budowane z zainstalowanych pakietów — skrypt automatyczny, nigdy commitowany

[24.09.2026] ✅ DODANO — źródło: inzynier-offgrid-pro (U.4). Biblioteka z własnym Web Workerem (np. MapLibre GL 6) po zbundlowaniu przez Next.js/Turbopack: ścieżka workera wyliczona przez `new URL(..., import.meta.url)` nie istnieje po buildzie produkcyjnym — "Worker failed to load" bez dalszej przyczyny widocznej w konsoli (bundler nie kopiuje pliku workera biblioteki tam, gdzie kod runtime go potem szuka).

**Reguła.** Gdy zależność wymaga własnego pliku (worker, WASM, font, inny statyczny zasób) w miejscu serwowanym publicznie (`public/`), kopiowanie tego pliku z `node_modules` do `public/` jest krokiem **automatycznym** (skrypt `predev`/`prebuild`), tym samym mechanizmem antydryfu co lockfile (11.1) i audyt podatności (11.5) — nigdy ręcznym kopiowaniem raz, "do repo". Skopiowany plik zostaje w `.gitignore` (pochodna zainstalowanej paczki, nie treść projektu) — dzięki temu zawsze zgodny z wersją z lockfile'a, zero kodu biblioteki trzymanego w repo na stałe.

**Uzasadnienie.** Ten sam wzorzec ryzyka co 11.1 (drugi lockfile) i 11.4 (branch narzędziowy) — artefakt, którego istnienie/aktualność nikt świadomie nie sprawdza przy każdej zmianie, cicho się dezaktualizuje (bump wersji biblioteki zmienia zawartość/nazwę pliku workera, ręcznie skopiowana kopia zostaje starą wersją) i psuje się dopiero w runtime, nie przy buildzie/teście.

**Konsekwencja CSP.** Worker uruchamiany z takiego pliku wymaga dyrektywy `worker-src 'self' blob:` w Content-Security-Policy (7.3) — bez niej przeglądarka blokuje sam worker, niezależnie od tego, czy plik fizycznie istnieje pod właściwą ścieżką.

## 11.8. Ryzyko migracji majora frameworka

[24.09.2026] ✅ DODANO — źródło: inzynier-szkieletowy-pro (U.4). Dwa dopiski, ten sam temat (ryzyko przy uaktualnieniu frameworka do nowego majora), zebrane przy tej samej pracy co recepta migracji Next 15.5→16 przekazana zero-waste (`AKTUALIZACJE.md`, 24.09.2026).

**(1) Wtyczki sprzężone z bundlerem frameworka — dodatkowe ryzyko przy każdym majorze.** Wtyczka trzeciej strony podpięta pod wewnętrzny mechanizm budowania frameworka (np. `@ducanh2912/next-pwa` pod webpack/Turbopack Next.js) niesie ryzyko ponad zwykłą zależność — porzucenie albo rozjazd wtyczki z nowym majorem frameworka (`@ducanh2912/next-pwa`: porzucony od 18.09.2024) potrafi zablokować migrację całego projektu, nie tylko tej jednej funkcji. Tam, gdzie funkcja da się zbudować na standardowym Web API bez pośrednictwa wtyczki bundlera (np. Service Worker jako własny plik, 11.7/5.3), to wybór domyślny — nie dlatego, że wtyczki bundlera są zawsze złe, ale dlatego, że mechanizm niezależny od wewnętrznego API bundlera przeżywa migrację majora bez dodatkowego ryzyka.

**(2) Klasyfikacja zmian majora wg oficjalnego przewodnika migracji, nie z pamięci/changelogu.** Przed migracją do nowego majora frameworka, każda zmiana wpływająca na projekt jest sklasyfikowana wg oficjalnego przewodnika migracji (nie streszczenia z pamięci treningowej AI ani pobieżnego przeglądu changelogu) w trzy kategorie: **usunięte** (kod przestaje działać, wymaga zmiany przed buildem), **deprecated** (działa, ale ostrzega — zmiana odłożona, nie pilna), **domyślne z opcją rezygnacji** (zachowanie się zmieniło, ale stary tryb wciąż dostępny przez flagę — najtańsza ścieżka na czas migracji). Bez tego rozróżnienia ryzyko migracji bywa systematycznie przeszacowane (traktowanie "deprecated"/"domyślne z opcją rezygnacji" jak "usunięte" prowadzi do niepotrzebnie szerokiego, kosztownego refaktoringu) albo niedoszacowane (odwrotnie).

[25.09.2026] ✅ DODANO — źródło: zero-waste (U.4, bump Next 15→16, `rejestr-decyzji.md` D143–D146). Kolejny udokumentowany koszt wtyczki z punktu (1): własna tablica `runtimeCaching` w `@ducanh2912/next-pwa` po cichu **zastępuje** (nie uzupełnia) domyślne reguły wtyczki, w tym jedyną regułę stron offline; a pod Turbopackiem (16.3.6) build przechodzi bez błędu, ale SW nie jest w ogóle generowany. Oba błędy ciche — build zielony, brak offline wykrywalny tylko testem na buildzie produkcyjnym (10.9). Wzmacnia domyślny wybór z (1) i 5.8: SW własny, bez wtyczki bundlera.

**(3) Baseline przed bumpem, weryfikacja empiryczna, budżet podnoszony o zmierzoną deltę.** [25.09.2026] ✅ DODANO — źródło: zero-waste (U.4, bump Next 15→16). Przed bumpem majora: zmierz baseline (rozmiar JS, czasy buildu, wynik e2e) na **starej** wersji, w **tym samym** środowisku, w którym po bumpie zmierzysz nową — porównanie wyników z różnych środowisk nie mówi nic o wpływie bumpa. Ocenę ryzyka z (2) weryfikuj empirycznie na realnym buildzie, nie tylko lekturą changelogu — realny przypadek: projekt uznał rename `middleware`→`proxy` za obowiązkowy, a był wyłącznie deprecated (dokładnie błąd klasyfikacji, przed którym chroni (2)). Jeśli nowy framework przekracza budżet JS, budżet podnosi się **o zmierzoną deltę samego frameworka** (baseline vs po bumpie, bez zmian w kodzie aplikacji), z wpisem w rejestrze decyzji — nigdy "do wartości, przy której CI przechodzi".

**Uzasadnienie.** (1) zapobiega powtórce sytuacji "wtyczka porzucona, migracja zablokowana" w innym projekcie rodziny z inną biblioteką bundlerozależną. (2) jest metodologią ogólną — przenosi się na migrację dowolnego frameworka/biblioteki, nie tylko Next.js.
