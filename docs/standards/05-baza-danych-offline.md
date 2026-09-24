# 05 — Baza danych i offline-first

Powiązane: [01 Architektura](01-architektura.md) · [02 Model danych](02-model-danych.md) · [13 Droga web → mobile](13-droga-mobile.md)

---

## 5.1. Zapisuj Seed, nigdy Wynik

**Reguła.** Jedyną trwałą daną jest surowe wejście użytkownika ("Seed"). Wyniki obliczeń/decyzji ("Wynik") są zawsze przeliczane od nowa po wczytaniu — nigdy nie są jedynym źródłem prawdy zapisanym na dysku.

**Uzasadnienie.** Reguły i logika ewoluują. Jeśli zapiszemy wynik zamiast danych źródłowych, poprawka błędu w logice domenowej nigdy nie dotrze do już zapisanych danych — użytkownik zobaczy stary, błędny wynik na zawsze, mimo że aplikacja "naprawiła" logikę.

**Konsekwencja w kodzie.** Typy `PersistedState` (Seed) i `ComputedState` (Wynik) są rozdzielone na poziomie typów, nie tylko konwencji. Mechanizm trwałości (np. `persist` w store) ma trwałość ograniczoną wyłącznie do Seedów; po wczytaniu z dysku silnik obliczeniowy (rozdział 01, 1.2) przelicza wszystkie wyniki od zera.

## 5.2. StorageAdapter

**Reguła.** Cały stan aplikacji jest zapisywany/odczytywany przez jeden interfejs `StorageAdapter`, nigdy przez bezpośrednie wywołania konkretnej bazy rozsiane po kodzie aplikacji. Implementacja: IndexedDB (web) dziś, SQLite (mobile) jutro — bez zmiany logiki, która z adaptera korzysta.

**Zakaz.** `localStorage` jako baza danych stanu domenowego. Dopuszczalny wyłącznie dla drobnych, nieistotnych preferencji UI urządzenia (np. ostatnio wybrany motyw kolorystyczny) — nigdy dla danych domenowych.

[16.09.2026] ✅ DOPRECYZOWANO — źródło: właściciel repo, po znaleziskach inzynier-offgrid-pro i inzynier-szkieletowy-pro (U.4) o błysku przy odświeżeniu. `localStorage` dla drobnej preferencji UI eliminuje błysk tylko, jeśli odczyt i zastosowanie dzieje się **przed pierwszym malowaniem** (blokujący, synchroniczny `<script>` w `<head>`/na początku `<body>`, czytający `localStorage` i przełączający klasę/atrybut na `<html>` — wzorzec sprawdzony w praktyce dla motywu kolorystycznego w inzynier-offgrid-pro), **nie** jako efekt uruchamiany po hydratacji Reacta (`useEffect`) — ten drugi wzorzec daje dokładnie ten sam błysk co próba obsługi języka samym `localStorage` (17.4), z tego samego powodu: JS uruchamia się już PO pierwszym malowaniu.

**Rozróżnienie, które rozstrzyga który mechanizm zastosować.** Preferencja, której zmiana to wyłącznie przełączenie klasy/atrybutu CSS (motyw jasny/ciemny, wysoki kontrast, rozmiar czcionki) — blokujący skrypt pre-paint + `localStorage` w pełni wystarcza, bez potrzeby serwera. Preferencja wymagająca innej TREŚCI tekstowej w HTML (język UI) — dla projektu z twardym wymogiem offline (5.3) TEN SAM wzorzec (blokujący skrypt pre-paint) rozszerzony o treść wszystkich obsługiwanych języków w bundlu klienckim, cache'owanym przez service worker, nie cookie+server-side (17.4, korekta 16.09.2026 — cookie+server-side zostaje wyłącznie nazwanym wyjątkiem dla projektu z jawną, udokumentowaną decyzją "głównie online", jak zero-waste). Koszt większego payloadu (wszystkie języki naraz zamiast jednego dociąganego serwerowo) jest tu właściwym, zaakceptowanym kosztem offline-first, nie problemem do optymalizacji. Efekt uboczny po hydratacji (`useEffect`) w ŻADNYM z tych przypadków nie eliminuje błysku — jest poprawny wyłącznie dla stanu, którego początkowa wartość naprawdę nie ma znaczenia wizualnego (np. licznik, dane doładowywane asynchronicznie).

## 5.3. Offline-first jako wymóg, nie dodatek

**Reguła.** Funkcje podstawowe muszą działać w pełni offline po pierwszym pobraniu danych: otwieranie projektu/widoku, logika domenowa, zapis danych, dokumentacja zdjęciowa, raport roboczy, lokalne wyszukiwanie w dokumentacji. Funkcje wymagające sieci (synchronizacja chmurowa, ciężkie modele AI, aktualizacje danych zewnętrznych) są **dodatkiem**, nigdy warunkiem podstawowego działania.

**Konsekwencja (web).** Dane trwałe w IndexedDB, service worker do cache'owania assetów, jednorazowe zapytania online (np. dane referencyjne, geolokalizacja) buforowane na stałe po pierwszym pobraniu.

## 5.4. Struktura magazynu

**Reguła.** Jedna, scentralizowana baza (wersjonowana wg 2.4), z osobnymi "magazynami"/tabelami dla różnych klas danych — np. dane projektu (Seed) osobno od załączników binarnych (zdjęcia jako natywny `Blob`, nigdy base64 w tym samym rekordzie co dane tekstowe — narzut pamięciowy). Scentralizowanie ma celowo unikać rywalizacji wielu niezależnych baz o operacje strukturalne (np. `onupgradeneeded` w IndexedDB).

## 5.5. Odporność na uszkodzone/starsze dane

**Reguła.** Mechanizm wczytywania danych ma naprawiać typowe, znane uszkodzenia struktury (np. tablica zserializowana błędnie jako obiekt przez wcześniejszy bug) w jednym miejscu, z testami odzwierciedlającymi dokładnie historyczne przypadki, które taką naprawę uzasadniły. Nie jest to zamiennik migracji wersji schematu (2.4) — to dodatkowa warstwa odporności na błędy, które migracja nie przewidziała.

## 5.6. Blob po przejściu przez Web Workera: odtwórz przed zapisem do IndexedDB

**Reguła.** Gdy `Blob` powstaje w Web Workerze (np. wynik kompresji zdjęcia, przekazany do głównego wątku przez `postMessage`) i ma trafić do IndexedDB (5.2), odtwórz go z surowych bajtów tuż przed zapisem — `await blob.arrayBuffer()` → `new Blob([bytes], {type})` — zawsze, nie warunkowo dla jednej platformy.

**Uzasadnienie.** Ten sam kod (kompresja w Workerze → zapis `Blob` do IndexedDB) działa bez zarzutu na Chrome/Desktop, ale na Safari/iOS rzuca `UnknownError: Error preparing Blob/File data to be stored in object store` przy każdej próbie zapisu — Blob, który przeszedł przez granicę Workera, bywa tam niezapisywalny. Błąd nie ujawnia się w typowym CI: silniki testowe (jsdom/happy-dom) nie mają prawdziwej implementacji IndexedDB Safari, a e2e uruchamiany na Chromium tego wariantu nie widzi — realnie wykrywalny dopiero na fizycznym urządzeniu Apple.

**Konsekwencja.** Koszt odtworzenia Bloba jest znikomy — stosuj go zawsze przy tej ścieżce (Worker → IndexedDB), nie tylko po wykryciu problemu na Safari.

## 5.7. Autosave draftu formularza jako architektoniczny domyślny od Etapu 1, nie dobudowywany reaktywnie

[20.09.2026] ✅ DODANO — źródło: inzynier-offgrid-pro (U.4). Hook autosave draftu formularza (zapis do IndexedDB przy każdej zmianie pola, z debounce) powstał dopiero po tym, jak użytkownik zgłosił realną utratę danych (przeglądarka mobilna odświeżyła kartę w tle, formularz wrócił pusty) — do tego dnia zbudowano już ~90 ekranów kalkulatorów zwykłym `useState`, bez żadnej persystencji, co wymagało później osobnej, kosztownej konwersji (114 plików w jednej sesji).

**Reguła.** Każdy nowy projekt rodziny z formularzami wielopolowymi (czyli praktycznie każdy — profil całej rodziny, patrz 5.1 "Seed nie Wynik") ma gotowy, generyczny wzorzec autosave draftu formularza (Seed → `StorageAdapter`, zapis debounce'owany przy zmianie pola, async odczyt przy montowaniu ekranu) zbudowany **razem ze szkieletem architektury (Etap 1), zanim powstanie pierwszy ekran kalkulatora** — nie jako osobne zadanie dobudowywane reaktywnie po zgłoszeniu utraty danych. Ten sam wzorzec używany od pierwszego dnia przez **każdy** nowy ekran z polami formularza, bez wyjątków.

**Uzasadnienie.** Utrata wpisanych, jeszcze niezapisanych danych przy odświeżeniu/zamknięciu karty jest przewidywalnym z góry ryzykiem dla każdej aplikacji offline-first z formularzami — nie czymś, co trzeba było odkryć w praktyce przez zgłoszenie użytkownika. Budowanie dziesiątek ekranów bez tego wzorca, a potem osobna konwersja wszystkich naraz, kosztuje więcej niż wbudowanie go raz, na starcie.

**Konsekwencja procesowa (pomost do czasu wdrożenia powyższego w projekcie, który go jeszcze nie ma).** Patrz 15.19 — przed napisaniem nowego ekranu wg istniejącego wzorca, AI musi sprawdzić `docs/memory.md`/`docs/standards/` pod kątem najnowszej, aktualnej wersji tego wzorca, nie kopiować z pamięci/z najbliższego przykładu w kodzie bez tej weryfikacji.

[21.09.2026] ✅ DOPRECYZOWANO ZAKRES — źródło: właściciel repo. "Nowy projekt od Etapu 1" opisuje najtańszy moment wdrożenia, nie granicę obowiązku — **autosave draftu jest obowiązkowy w KAŻDYM projekcie rodziny z formularzami wielopolowymi, również już istniejących, nie tylko przyszłych**, tym samym rodzajem bezwarunkowej obowiązkowości co 9.0 (rozdz. 09) i 18.1 (rozdz. 18). Projekt istniejący bez tego wzorca ma dług, nie zwolnienie — konsekwencja procesowa wyżej (15.19, pomost do czasu wdrożenia) opisuje właśnie ten przypadek: wzorzec ma powstać (albo zostać dokończony retrofitem na już istniejących ekranach) przy najbliższej realnej okazji, nie zostać trwale pominięty jako "nie dotyczy, bo projekt już istniał przed tą regułą".

## 5.8. Service Worker własny, bez wtyczki bundlera (Next.js App Router)

[24.09.2026] ✅ DODANO — źródło: inzynier-szkieletowy-pro (U.4), Grupa B bloku PWA/SW — kontynuacja 11.8 (tam: ryzyko wtyczek sprzężonych z bundlerem przy migracji majora; tu: sam wzorzec konstrukcji Service Workera bez takiej wtyczki).

**Fakty architektoniczne, przed budową.** App Router (RSC) nie potrzebuje cache'u SW dla samej nawigacji — router sam wykonuje pełną nawigację offline, gdy dane są już zbuforowane; SW próbujący przechwycić i obsłużyć nawigację po swojemu dubluje ten mechanizm zamiast go uzupełniać. Manifest PWA idzie przez konwencję plikową Next.js (`app/manifest.ts`), nie przez ręczne pole `metadata.manifest` — framework generuje poprawny `<link rel="manifest">` sam, bez ręcznego wiązania. Opcja eksperymentalna `experimental.useOffline` jest pułapką przy tej architekturze: [24.09.2026, uzupełnienie po odczytaniu dosłownego źródła — poprzednia wersja tego zdania odsyłała do sprawdzenia mechanizmu u źródła, bez podania go wprost] zamiast przełączyć nawigację na stronę z precache przy braku sieci, **wstrzymuje nawigację do powrotu sieci** — dokładne przeciwieństwo efektu, którego architektura offline-first potrzebuje. W appce offline-first nie włączać tej flagi; wzorzec z reguły niżej (fallback RSC fetch → pełna nawigacja → precache SW) daje pożądany efekt bez niej. Przykład: `docs/przyklady/pwa/sw-rdzen.js`.

**Reguła — sam wzorzec.** Service Worker jako własny plik na standardowym Web API (`app/sw.js/route.ts` z `export const dynamic = 'force-static'`), nie wtyczka bundlera (11.8). Rdzeń logiki SW (routing żądań, strategia cache) pisany jako zwykły JS, testowalny w `node:vm` bez przeglądarki (10.8) — oddziela logikę od API przeglądarki (`self`, `caches`), które inaczej trzeba by mockować w każdym teście. Wersjonowanie cache'u per wpis (klucz: URL + `rev`/hash treści), nie jeden globalny numer wersji dla całego cache'u — pozwala unieważnić pojedynczy zasób bez unieważniania wszystkiego naraz. SW uruchamiany w trybie deweloperskim **samo-wyrejestrowuje się** (sprawdza swój tryb przy starcie, jeśli deweloperski — wyrejestrowanie i przeładowanie) — zapobiega sytuacji, w której zapomniany SW z wcześniejszej sesji dev nadal przechwytuje żądania i maskuje realny stan aplikacji.

**Precache i i18n — konsekwencja istniejącego wzorca 5.2.** Blokujący skrypt pre-paint dla języka (5.2, wariant "treść w bundlu klienckim") bywa wliczany w całości do precache SW, jeśli treść wszystkich języków cache'owana jest jako jeden monolityczny plik — realny pomiar: 33,9 MB → 2,7 MB po wydzieleniu treści per język do osobnych plików, cache'owanych/dociąganych niezależnie. Sam wzorzec 5.2 (treść wszystkich języków w bundlu klienckim) zostaje poprawny — to struktura plików tej treści, nie jej obecność, decyduje o rozmiarze precache.

## 5.9. Aktualizacja Service Workera — toast, nie cichy automatyczny reload

[24.09.2026] ✅ DODANO — źródło: inzynier-szkieletowy-pro (U.4), Grupa B bloku PWA/SW.

**Reguła.** Wykrycie nowej wersji Service Workera pokazuje użytkownikowi widoczny toast/baner z akcją "odśwież teraz" — nigdy automatyczny `skipWaiting()` + przeładowanie bez ostrzeżenia. Automatyczna aktualizacja w tle może przerwać niezapisaną pracę użytkownika (formularz w trakcie wypełniania — 5.7 łagodzi utratę danych przez autosave, ale nie eliminuje przerwania samego działania) w momencie, którego użytkownik nie wybrał.

**Rozróżnienie pierwszego `controllerchange` od realnej aktualizacji.** [24.09.2026, uzupełnienie po odczytaniu dosłownego źródła] Zdarzenie `controllerchange` na `navigator.serviceWorker` odpala się też przy **pierwszej** rejestracji SW (to `clients.claim()`, nie aktualizacja) — logika śledząca musi zapamiętać, czy karta miała już kontroler przed pierwszym zdarzeniem, inaczej pierwsza wizyta pokazuje fałszywy toast aktualizacji. Druga karta, która dostała nową wersję niezależnie od tej, w której użytkownik kliknął "odśwież" (albo przez kill-switch), dostaje osobny, informacyjny toast — nie jest cicho przeładowywana bez ostrzeżenia. Typ wiadomości między stroną a SW (`{typ: 'SKIP_WAITING'}`) trzymany jako jedna eksportowana stała, współdzielona między kodem strony i testem rdzenia SW — nie zduplikowany string literal w dwóch miejscach.

**Częstotliwość sprawdzania aktualizacji.** Przeglądarka sama sprawdza nową wersję tylko przy nawigacji — zainstalowana appka może zostać otwarta dniami bez nawigacji. Dodatkowe sprawdzenie przy powrocie karty na pierwszy plan (`visibilitychange` → `document.visibilityState === 'visible'`), nie częściej niż raz na ok. godzinę.

**Kill-switch.** Ten sam mechanizm co SW deweloperski (5.8, samo-wyrejestrowanie) — zmienna środowiskowa wyłączająca cały SW na czas diagnozy problemu produkcyjnego, bez potrzeby osobnego release'u kasującego rejestrację.

Przykład (dosłowny kod): `docs/przyklady/pwa/aktualizacja-sw.ts` + `docs/przyklady/pwa/sw-rejestracja.tsx`.

## 5.10. `navigator.storage.persist()` — zapamiętaj odmowę, nie zgodę

[24.09.2026] ✅ DODANO — źródło: inzynier-szkieletowy-pro (U.4), Grupa B bloku PWA/SW.

**Reguła.** Wywołanie `navigator.storage.persist()` bez zapamiętania wcześniejszej odmowy użytkownika pokazuje w Firefoksie okno zgody przeglądarki **przy każdym otwarciu aplikacji** — nie raz. Zapamiętuj w `localStorage` fakt **odmowy**, nie zgody — `navigator.storage.persisted()` (funkcja sprawdzająca bieżący stan) i tak zwraca `true` po przyznaniu, więc zgoda nie wymaga osobnego zapamiętania; tylko odmowa musi być zapamiętana, żeby nie prosić ponownie przy każdym uruchomieniu. Przykład: `docs/przyklady/pwa/trwaly-magazyn.ts`.

## 5.11. Kolizja wersji IndexedDB między kartami — cichy `VersionError`, nie blokada

[24.09.2026] ✅ DODANO — źródło: inzynier-szkieletowy-pro (U.4), Grupa B bloku PWA/SW, po odczytaniu dosłownej treści zgłoszenia (`docs/wklad-do-standardu.md`) — pozycja nieobjęta pierwotnym skróconym podziałem na 7 punktów Grupy B, dopisana przy budowie `docs/przyklady/pwa/`.

**Problem — realne ryzyko jest odwrotne od intuicji.** Blokada `onupgradeneeded` (jedna karta czeka, aż inne zamkną połączenie do tej samej bazy) jest rzadka przy krótkotrwałych połączeniach i zwykle widoczna. Realne, ciche ryzyko jest przeciwne: karta ze **starym** kodem, która nie wie, że inna karta (z nowszym kodem) podbiła wersję schematu bazy, dostaje `VersionError` przy **każdym kolejnym** `indexedDB.open()` w tej karcie — zapisy (np. autosave, 5.7) zaczynają cicho failować w tle, bez żadnego widocznego błędu użytkownikowi, dopóki karta nie zostanie odświeżona.

**Reguła.** Warstwa otwierająca połączenie do IndexedDB (poza React) nasłuchuje trzech zdarzeń na otwartym połączeniu/żądaniu: `onversionchange` (inna karta podbija wersję — ta karta zamyka swoje połączenie, żeby nie blokować upgrade'u, i zgłasza „wymagane odświeżenie”), `onblocked` (ta karta upgrade'uje i czeka, aż inne zamkną swoje połączenia — informacyjnie, żądanie samo kontynuuje po zwolnieniu) i `onerror` z `error.name === 'VersionError'` (baza jest już nowsza niż kod tej karty — też „wymagane odświeżenie”). Zdarzenie trafia do subskrybentów spoza React (moduł-level, nie hook — store często rehydruje się zanim UI zdąży się zamontować, więc zdarzenie bywa zapamiętane i odtworzone późnym subskrybentom). UI pokazuje trwały toast „odśwież” z akcją — **nie** automatyczny reload, żeby nie zgubić niezapisanych pól formularza (spójne z 5.9).

Przykład (dosłowny kod): `docs/przyklady/pwa/indexeddb-baza.ts` + `docs/przyklady/pwa/baza-wersja-listener.tsx`.
