# PROMPT — CI referencyjny + mechanizm strażniczy i18n

> Skrócony, samodzielny blok — do wklejenia jako pierwsza wiadomość nowej sesji AI budującej
> CI/mechanizm strażniczy i18n od zera w innym projekcie rodziny (albo poza nią). Pełne
> uzasadnienia i przykład kodu: [`ci/`](ci/), [`i18n/`](i18n/).

```
PROMPT: CI (lint/typecheck/test/build + audyt podatności) i mechanizm strażniczy i18n

Buduję CI dla tego projektu. Wymagania:

1. Dwa niezależne joby w CI: "quality" (lint, typecheck, testy, build) i "dependency-audit"
   (skaner podatności zależności twojego menedżera pakietów: `npm audit`/`pnpm audit`/`pip-audit`/
   itd., z progiem odcięcia na high/critical, --audit-level=high albo odpowiednik).
2. PRZED włączeniem bramki audytu: uruchom go ręcznie. Jeśli nie przechodzi, NIE obniżaj progu i
   NIE dodawaj wyjątku od razu — sprawdź każdą pozycję, napraw to, co się da w granicach już
   zadeklarowanych zakresów wersji (bump w ramach ^/~, nie zmiana major), włącz bramkę tylko na
   czystym stanie. Po każdej zmianie zależności: pełny lint/typecheck/test/build musi przejść.
3. Jeśli projekt ma już migrację i18n w toku (klucze tłumaczeń zamiast gotowego tekstu w warstwie
   domenowej, migrowane moduł-po-module, nie big bang): zbuduj skrypt weryfikujący AST (nie regex)
   plików domenowych modułów JUŻ zmigrowanych (explicit allowlist, nie automatyczna detekcja),
   który blokuje nowy hardcodowany tekst w polach user-facing (typowo: "message"/"assumptions" czy
   ich odpowiedniki w tym stacku) — ale NIE w polach technicznych (komunikat deweloperski, wzór
   symboliczny, kod/identyfikator). Zanim uznasz skrypt za gotowy: wstrzyknij prawdziwą regresję do
   prawdziwego, już zmigrowanego pliku (nie do wymyślonego przykładu) i sprawdź, że skrypt ją
   złapie — szczególnie dla wzorców warunkowych (`warunek ? tekst1 : tekst2`), nie tylko
   bezpośredniego przypisania.
4. Wpnij oba (audyt + guard i18n, jeśli dotyczy) jako kroki w CI, gating merge PR.
```

## PROMPT — PWA / Service Worker własny, bez wtyczki bundlera

> Pełne uzasadnienie i przykład kodu: [`pwa/`](pwa/).

```
PROMPT: Service Worker offline (App Router) — własny, bez wtyczki bundlera

Buduję PWA/offline dla tego projektu (App Router). Wymagania:

1. Własny Service Worker jako zwykły JS bez importów (serwowany dosłownie przez Route Handler,
   `dynamic = 'force-static'`), NIE wtyczka bundlera (next-pwa/Serwist i im podobne) — sprzężenie
   z wewnętrznym mechanizmem bundlera to udokumentowane ryzyko migracji majora frameworka (11.8).
2. Wersja SW = hash (np. sha256 obcięty) listy precache, nie numer buildu — nowa wersja tylko gdy
   realnie zmienił się zestaw/rev cachowanych URL-i.
3. Precache: strony cache-first z fallbackiem na stronę "nie znaleziono", `/api/**` i inne
   non-GET/cross-origin/RSC-fetch NIGDY nie cachowane, idą zawsze na sieć wprost. NIE włączaj
   `experimental.useOffline` w architekturze offline-first — wstrzymuje nawigację do powrotu
   sieci zamiast przełączyć na cache, przeciwieństwo zamierzonego efektu.
4. Aktualizacja SW: nowa wersja instaluje się i CZEKA, przełączenie tylko po kliknięciu w
   toast/banner (nigdy automatyczny cichy reload — gubi stan niezapisanego formularza). Rozróżnij
   pierwszy `controllerchange` (to `clients.claim()` przy pierwszej wizycie) od realnej
   aktualizacji.
5. Jeśli projekt ma IndexedDB: dodaj osobny mechanizm na kolizję wersji schematu między kartami
   (`onversionchange`/`onblocked`/`VersionError`) — stara karta dostaje cichy `VersionError` przy
   KAŻDYM kolejnym otwarciu bazy po podbiciu wersji przez nowszą kartę, więc zapisy (autosave)
   zaczynają failować bez widocznego błędu. Fix: subskrybowalne zdarzenie poza React + trwały
   toast "odśwież" (nie automatyczny reload).
6. Jeśli projekt woła `navigator.storage.persist()`: zapamiętaj ODMOWĘ w localStorage, nie pytaj
   ponownie przy każdym uruchomieniu — Firefox inaczej pokazuje prompt na każde otwarcie appki.
7. Wskaźnik stanu online: `useSyncExternalStore`, snapshot serwera zawsze `true` (unika hydration
   mismatch), subskrypcja `online`/`offline` na `window` wydzielona jako czysta funkcja.
8. Jeśli projekt korzysta z biblioteki liczącej cokolwiek przez WASM (np. renderer PDF): dodaj
   `'wasm-unsafe-eval'` do CSP `script-src` (NIE szerszy `'unsafe-eval'`) i zweryfikuj CSP przez
   KLIKNIĘCIE tej akcji, nie tylko load strony — kompilacja WASM bywa leniwa, dopiero przy akcji.
9. E2E offline bez nowych zależności: `node --test` + biblioteka `playwright` (nie
   `@playwright/test`) przeciwko dwóm prawdziwym kolejnym buildom produkcyjnym. Zawrzyj strażnika
   "pusty przelot" (żądanie spoza SW musi jawnie failować offline, inaczej błąd w
   `context.setOffline` daje fałszywie zielone testy) i sprawdzaj `response.fromServiceWorker()`.
```
