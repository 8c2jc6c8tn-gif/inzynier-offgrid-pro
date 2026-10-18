# 08 — UI/UX i treść

Powiązane: [03 Jądro logiki domenowej](03-jadro-obliczeniowe.md) · [04 Walidacja i twarde stopy](04-walidacja-i-twarde-stopy.md) · [09 Zasady i granice AI](09-ai-w-produkcie.md)

---

## 8.1. Zasada nadrzędna: aplikacja jest doradcą, nie encyklopedią

Ekran dotyczący decyzji użytkownika o realnych konsekwencjach (dobór, kompatybilność, konfiguracja, "czy to jest bezpieczne/dopuszczalne w tej sytuacji") nie może kończyć się na "oto reguła i wynik". Musi: przyjąć realne dane/kontekst użytkownika jako wejście (nie generyczne przykłady), ocenić wybór względem granic bezpieczeństwa/dopuszczalności, wydać jednoznaczny werdykt (rozdział 04), wytłumaczyć **dlaczego** — mechanizm rzeczywisty, nie "przekroczono limit" — i twardo ostrzec, gdy opcja grozi realną szkodą (fizyczną, zdrowotną, finansową czy prawną, zależnie od domeny).

## 8.2. Taksonomia wzorców ekranu

Punkt startowy, nie zamknięta lista — jeśli funkcja nie pasuje dobrze do żadnego wzorca, tworzy się nowy dedykowany, zamiast naciągać istniejący (naciąganie na siłę pogarsza UX bardziej niż dodanie kolejnego wzorca).

| Wzorzec | Kiedy stosować |
|---|---|
| **A — Przełącznik trybu** | Opcje wzajemnie się wykluczają i są równoważne (ten sam typ wejścia/wyjścia, inna reguła/wzór). |
| **B — Karty porównawcze** | User wybiera produkt/wariant z opisową charakterystyką, niekoniecznie własne dane na wejściu. |
| **C — Akordeon / informacja** | Tematy uzupełniają się, nie wykluczają — user może chcieć przeczytać wszystkie. |
| **D — Doradca** | Dobór/ocena z werdyktem bezpieczeństwa lub dopuszczalności. Patrz 8.3-8.4. **Zawsze wygrywa nad A/B/C**, gdy się kwalifikuje. |
| **E — Checklist weryfikacyjna** | Sekwencja "zrób i potwierdź", opcjonalnie z wynikiem pomiaru/obserwacji porównanym do progu — nie kalkulacja. |
| **F — Przewodnik z ilustracją** | Zasada przestrzenna/wizualna, do której się zagląda podczas pracy — bez pól do wpisania, rysunek + reguła. |
| **G — Raport/podsumowanie** | Ekran tylko do odczytu, zagregowany wynik, koniec ścieżki decyzyjnej, nie jej część. |
| **H — Katalog komponentów** | User dodaje dowolną liczbę niewykluczających się elementów (różni się od A: nie wybiera JEDNEGO wariantu). |

## 8.3. Kryteria kwalifikacji do wzorca D (Doradca)

Funkcja **musi** być Doradcą, jeśli odpowiedź na którekolwiek z poniższych brzmi "tak":
- Czy dotyczy doboru/oceny jednej rzeczy względem parametrów/kontekstu innej (np. komponent do instalacji, produkt do terminu ważności, wydatek do budżetu)?
- Czy błędny wybór może fizycznie zaszkodzić użytkownikowi/mieniu, spowodować utratę zdrowia, albo stratę finansową?
- Czy błędny wybór unieważnia gwarancję, narusza przepis, albo ma inną trwałą, nieodwracalną konsekwencję?
- Czy istnieją jasne, liczbowe granice bezpieczeństwa/dopuszczalności (np. limit, próg, data, kwota)?
- Czy tytuł/nazwa funkcji zawiera: *dobór, kompatybilność, zabezpieczenie, ochrona, koordynacja, limit, ryzyko*?

Jeśli żadne z powyższych nie zachodzi, a funkcja tylko wyjaśnia zjawisko lub pokazuje dane — wystarczy wzorzec B lub C. To jest obiektywny test, nie uznaniowa decyzja.

## 8.4. Obowiązkowy szablon ekranu Doradcy (wzorzec D)

Cztery sekcje, w tej kolejności:

- **Sekcja A — Twoje dane/kontekst.** Pola do wpisania realnych parametrów (nie placeholder w stylu "np. 40V" — prawdziwe dane od użytkownika, np. z etykiety produktu czy karty katalogowej urządzenia). Wartość domyślna dopuszczalna tylko wtedy, gdy jest bezpieczna — **dane wpływające na bezpieczeństwo nigdy nie są ukryte jako wartość domyślna** (patrz 8.6).
- **Sekcja B — Silnik oceny.** Dla każdej rozważanej opcji: wartości robocze i ekstremalne (nie tylko warunki nominalne — też scenariusz brzegowy), werdykt trójstopniowy (rozdział 04), uzasadnienie w jednym zdaniu.
- **Sekcja C — Rekomendacja.** Wyróżniona wizualnie najlepsza opcja spośród ocenionych na 🟢, z krótkim podsumowaniem dlaczego.
- **Sekcja D — Migawka edukacyjna.** Krótkie "o co chodzi" tłumaczenie zjawiska/mechanizmu stojącego za oceną. Treść pochodzi z pól `formula`/`assumptions` wyniku (rozdział 03) — nigdy nie jest przepisywana ręcznie osobno od logiki, która ją wyprodukowała.
  [29.09.2026] ✅ DOPRECYZOWANO — decyzja właściciela repo (wariant a): Sekcja D **zostaje pod wynikiem** — w Doradcy wyjaśnienie przy wyniku jest częścią porady, schowane w okienku łatwo je przeoczyć. Ta sama treść jest dostępna także w zakładce „Fizyka” informacji „i” przy tytule (8.4b) — renderowana z tych samych danych wyniku tym samym komponentem, nigdy jako drugi, ręcznie przepisany tekst.

Każdy parametr liczbowy na dowolnym ekranie (nie tylko Doradcy) ma mały znak `?` obok etykiety — popover z pełną nazwą, jednym zdaniem "do czego służy", gdzie to znaleźć, typowym zakresem wartości. To jest **inny** poziom wyjaśnienia niż Migawka (Migawka tłumaczy całą funkcję/zjawisko, `?` tłumaczy pojedyncze oznaczenie/pole) — oba mogą występować na tym samym ekranie i się uzupełniają.

[29.09.2026] ✅ DOPRECYZOWANO — źródło: inzynier-offgrid-pro (U.4), decyzja właściciela repo. **`?` otwiera się kliknięciem/dotknięciem na każdym urządzeniu.** Chmurka `?` zbudowana na prymitywie typu tooltip (otwierany wyłącznie najechaniem kursorem) na telefonie nie otwiera się wcale — w aplikacji mobile-first (8.9) cała warstwa wyjaśnień pól była niewidoczna dla głównej grupy użytkowników, a na desktopie przeszła przegląd bez uwag. Reguła: `?` to popover otwierany kliknięciem, dotknięciem i klawiszem (Enter/Spacja) na każdym urządzeniu — nigdy tooltip hover-only. Dodatkowe otwieranie najechaniem na urządzeniach z kursorem jest dopuszczalne, ale nigdy jako jedyny sposób. Test e2e chmurki także z emulacją dotyku (np. Playwright `devices[...]` + `tap`), nie tylko myszą.

## 8.4a. Kryterium audytu pokrycia: "sekcja wypełniona" ≠ "ma wzór"

[20.09.2026] ✅ DODANO — źródło: inzynier-offgrid-pro (U.4). Audyt pokrycia funkcji oznaczył dwie funkcje jako "gotowe do budowy — pełna treść Doradcy z formułą" na podstawie tego, że źródło miało wypełniony pełny szablon sekcji A/B/C/D. Przy faktycznej implementacji okazało się, że Sekcja B (Silnik) miała tylko narrację słowną + jeden przykład liczbowy, bez ogólnego wzoru wiążącego wejścia z wynikiem — obie funkcje błędnie zaklasyfikowane jako gotowe do Wzorca D, zamiast do Wzorca C (8.2).

**Reguła.** Przy audycie pokrycia (GOD BOOK Część N) klasyfikującym funkcję jako "gotową do budowy jako Doradca (Wzorzec D)", nie wystarczy sprawdzić, że Sekcja B źródła jest wypełniona tekstem — trzeba jawnie potwierdzić, że zawiera **odtwarzalny wzór matematyczny/logiczny** (nie tylko opis słowny mechanizmu i pojedynczy przykład liczbowy, z którego wzoru nie da się jednoznacznie wyprowadzić). Sam przykład liczbowy bez ogólnego wzoru klasyfikuje funkcję z automatu jako kandydata do Wzorca C (informacyjny) — nie D (kalkulator) — dopóki ktoś nie dostarczy albo nie wyprowadzi brakującego wzoru.

**Uzasadnienie.** "Sekcja ma treść" i "sekcja ma wzór" to dwa różne stany, łatwe do pomylenia przy pobieżnym audycie opartym o samą strukturę szablonu — dotyczy każdego projektu rodziny opartego o szablon Doradcy A/B/C/D, nie specyfiki jednego projektu.

## 8.4b. Informacja „i” przy tytule ekranu — zakładki „Po ludzku” i „Fizyka”

[29.09.2026] ✅ DODANO — źródło: inzynier-offgrid-pro (U.4, D51 pkt 3 tamtego projektu: `MigawkaInfo` z zakładkami „Po ludzku” / „Fizyka”), decyzja właściciela repo (wariant a, nazwy zakładek z tamtego projektu). Rozstrzyga ⚠️ z 8.12 krok 4.

**Podział ról.** `?` (8.4) objaśnia jedno pole; „i” objaśnia cały ekran. Oba otwierają się tak samo — kliknięciem/dotknięciem/klawiszem na każdym urządzeniu, nigdy tylko najechaniem (8.4) — na telefonie jako panel od dołu, na desktopie jako popover przy ikonie.

**Zakładka 1 — „Po ludzku” (otwiera się domyślnie).** Pisana ręcznie, językiem dla laika, od razu we wszystkich językach minimalnego zestawu (8.12):
- **o co chodzi** — co ekran liczy/ocenia, jednym–dwoma zdaniami;
- **jak to liczy** — krok po kroku, bez wzorów;
- **po co** — jaką decyzję pomaga podjąć, kiedy go użyć, co idzie źle bez niego; czego ekran nie obejmuje i gdzie to policzyć (jeśli dotyczy).

Pisana w tej samej zmianie co opis narzędzia AI (9.0a, "kiedy użyć") — mówią o tym samym i nie mogą się rozjechać.

**Zakładka 2 — „Fizyka”.** Co naprawdę policzono:
- **wzór i założenia bieżącego wyniku** — z pól `formula`/`assumptions` wyniku (rozdział 03), ta sama treść co Sekcja D Migawki (8.4) na ekranie Doradcy; nigdy przepisane ręcznie. Przed obliczeniem (brak wyniku) tej części nie ma;
- **opcjonalne tło** — prawo fizyczne, norma, punkt przepisu, znaczenie symboli; tekst statyczny w plikach tłumaczeń, ale **liczby, które silnik trzyma w stałych, wchodzą przez parametry** (np. `{nazwa}`), nigdy przepisane w każdym języku (jedno źródło prawdy, 03).

Nazwa zakładki 2 w projekcie spoza dziedzin technicznych (np. finanse, żywność) może być domenowa — ta sama rola („Zasady”, „Jak liczymy”), jedna nazwa w całym projekcie.

**Ekran bez wzoru i bez tła** (czysto informacyjny, wzorzec A/B) — „i” pokazuje tylko treść „Po ludzku”, **bez paska zakładek** (nigdy pusta zakładka).

**Treść pomocy w jednym miejscu na ekran** (np. `lib/i18n/pomoc/<moduł>.ts`: obiekt na ekran z treścią „i” i `?` wszystkich pól), typowana tak, że brak tłumaczenia albo błędny identyfikator ekranu/pola to błąd kompilacji (17.1). Obecność „i” na każdym nagłówku ekranu pilnuje strażnik (8.12, 11.9).

## 8.5. Tryb prosty vs Tryb zaawansowany

**Reguła.** Globalny przełącznik, stan trwały w preferencjach użytkownika. Domyślnie tryb prosty (suwaki, kafle, mniej pól). Tryb zaawansowany odsłania parametry dodatkowe (dla projektu technicznego: protokoły komunikacji, momenty dokręcania; dla innej domeny: pełne dane źródłowe, zaawansowane filtry — dobór wg projektu). **Menu pozostaje zawsze dostępne, również w trybie prowadzonym/prostym** — nigdy nie zamyka użytkownika w liniowej ścieżce bez wyjścia.

[16.10.2026] ✅ DODANO — źródło: inzynier-offgrid-pro (U.4, wpis z 09.10.2026), decyzja właściciela repo (wariant B). **Tryb ekranu na szkicu.** Dla ekranu z wieloma polami (prosty: kilka pytań i jedna rekomendacja „po ludzku”; pełny: wszystkie ustawienia) oba tryby działają na **tym samym szkicu**, więc przełączanie niczego nie gubi. Domyślny tryb nowego szkicu to nadal tryb prosty z globalnego przełącznika; dla ekranów z wieloma polami dopuszcza się **domyślny tryb wyliczony z zawartości szkicu** („pusty = prosty, są dane = pełny”), ale pod warunkiem: (1) wyliczenie następuje **raz, przy pierwszym renderze szkicu**, a wynik jest **zapisany w szkicu** — nigdy wyliczany na żywo (inaczej tryb przeskakuje w trakcie wpisywania pierwszej liczby); (2) po zapisaniu trybu zmienia go wyłącznie użytkownik; (3) rekomendacja trybu prostego jest **tabelą decyzyjną na liczbach, które ekran pełny też pokazuje** (bez nowych wag i progów — 3.7 pkt 4), a przy sprzeczności kryteriów pokazuje kompromis zamiast wskazywać zwycięzcę (8.14 reguła 3). Odstępstwo od „zawsze domyślnie prosty” jest więc dozwolone tylko w tej postaci i nie zastępuje globalnego przełącznika.

## 8.6. Bezpieczne wartości domyślne

**Reguła.** Dane wpływające na bezpieczeństwo nie mogą mieć ukrytej wartości domyślnej, którą użytkownik przeoczy. Jeśli pole ma wartość domyślną, musi być jawnie oznaczone jako domyślne/orientacyjne, nie wyglądać jak dana wpisana świadomie przez użytkownika.

## 8.7. Powiązania Bloków (propagacja i nawigacja)

**Reguła.** Pole `powiazania: string[]` (identyfikatory innych modułów/funkcji) jest częścią definicji każdego modułu. UI pokazuje je jako linki nawigacyjne; silnik używa ich do propagacji danych między modułami (rozdział 01, wzorzec Kernela). Z każdego ekranu Doradcy powinno dać się przejść bezpośrednio do powiązanej funkcji, bez cofania się do pulpitu głównego ("brak ślepych zaułków").

**Konsekwencja nawigacyjna.** Przycisk Wstecz zawsze w tym samym miejscu, zachowuje stan wpisanych danych. Okruszki (breadcrumb) pokazujące pozycję w strukturze modułów — istotne zwłaszcza gdy jeden ekran scala treść wielu dawnych, drobniejszych funkcji.

## 8.8. Styl komunikatów

**Reguła.** Komunikaty są proste, konkretne, bez straszenia, bez udawania pewności, której nie ma.

Przykład: *"Brakuje informacji o dacie otwarcia opakowania. Wynik został policzony orientacyjnie dla wartości domyślnej i nie powinien być traktowany jako pewność."*

[16.09.2026] ✅ DODANO — źródło: inzynier-offgrid-pro (U.4). Reguła wyżej dotyczy stylu treści w języku bazowym — dla projektu z i18n (rozdz. 17) obowiązuje w **każdym** obsługiwanym języku, nie tylko oryginale. Ton komunikatu (prosty, konkretny, bez straszenia, bez udawanej pewności) jest częścią kryterium jakości tłumaczenia, sprawdzaną tak samo jak poprawność merytoryczna przy nadawaniu tłumaczeniu statusu `reviewed` (17.7) — tłumaczenie może być poprawne językowo i jednocześnie łamać ten styl (np. bardziej alarmistyczne albo bardziej stanowcze niż oryginał), co status `reviewed` powinien wyłapać.

## 8.9. Mobile-first

**Reguła.** Projektuje się pod telefon jako pierwszy cel (dotyk ≥44px, input ≥16px, brak auto-zoom iOS na focusie pola), potem rozwija na tablet/desktop. Scenariusz użycia "w terenie"/poza biurkiem (jeśli dotyczy projektu) wymaga dodatkowo: automatycznego zapisu, dużych przycisków, trybu wysokiego kontrastu, czytelności w jasnym otoczeniu, obsługi jedną ręką.

## 8.10. Dostępność

Nie polegaj wyłącznie na kolorze do przekazania informacji (werdykty 🟢🟡🔴 mają też kształt/ikonę, nie tylko barwę). [17.10.2026] ✅ DODANO — źródło: inzynier-offgrid-pro (U.4, wpis z 16.10.2026), decyzja właściciela repo: poziom werdyktu ma znak o **odrębnym kształcie** (np. liniowe SVG ✓ / ▲ / ✕ malowane kolorem tekstu), a **emoji nie są nośnikiem znaczenia** — renderują się inaczej w każdym systemie i nie dają spójności ze stylem aplikacji. Test regresji: panel werdyktu renderuje `<svg aria-hidden>` oraz etykietę tekstową. Zachowaj odpowiedni kontrast. Etykiety dla czytników ekranu. Nie blokuj powiększenia. Obsługa klawiaturą. Unikaj migających elementów.

**`id` pola formularza generowany unikalnie, nigdy z tekstu etykiety.** [25.09.2026] ✅ DODANO — źródło: inzynier-offgrid-pro (U.4). Współdzielony komponent pola formularza budował `id` wyłącznie z tekstu etykiety — w liście (`.map()`) z powtarzającą się etykietą N pól dostało to samo `id`: `<label for>` wiąże się tylko z pierwszym, klik w etykietę i czytnik ekranu trafiają w złe pole, a `getByLabel` Playwrighta znajduje jeden element. Błąd niewidoczny dla typecheck, lint i testów jednostkowych. Reguła: `id` z generatora unikalnego identyfikatora frameworka (React: `useId()`) albo przekazany jawnie przez wywołującego — treść etykiety nigdy nie jest identyfikatorem.

## 8.11. Wskaźnik stanu offline

[24.09.2026] ✅ DODANO — źródło: inzynier-szkieletowy-pro (U.4), Grupa B bloku PWA/SW (5.8-5.10).

**Reguła.** Wskaźnik stanu połączenia (online/offline) czytany przez `useSyncExternalStore` (albo odpowiednik frameworka), z **serwerowym snapshotem zawsze `true`** (online) — zapobiega błędowi hydracji, który wystąpiłby, gdyby serwer (bez dostępu do `navigator.onLine`) i klient renderowały różny stan początkowy. Wskaźnik zajmuje **stały region** oznaczony `role="status"` (nie pojawia się/znika, zmienia tylko treść wewnątrz) — czytnik ekranu ogłasza zmianę bez utraty orientacji, gdzie w drzewie DOM ten komunikat żyje. Wyjaśnienie stanu (np. "dane mogą być nieaktualne") idzie w popoverze/tooltipie dotykowym, **nigdy w atrybucie `title`** — `title` nie jest dostępny na dotyk (mobile-first, 8.9), więc jedyne wyjaśnienie byłoby niewidoczne dla większości użytkowników rodziny projektów.

**Ponawianie po powrocie online.** Nasłuch zdarzenia `online` ponawia żądania odłożone offline — z pamięcią **trwałej odmowy uprawnień** (np. użytkownik raz odrzucił prośbę o dostęp do czegoś wymaganego do ponowienia) tak, żeby nie ponawiać w nieskończoność próby skazanej na tę samą odmowę.

**Wzorzec implementacji.** [24.09.2026, uzupełnienie po odczytaniu dosłownego źródła] `useOnline() = useSyncExternalStore(subskrybujOnline, () => navigator.onLine, () => true)` — subskrypcja zdarzeń `online`/`offline` na `window` wydzielona jako czysta funkcja (nie zagnieżdżona w hooku), testowalna w środowisku `node` bez `jsdom` (`vi.stubGlobal`). `navigator.onLine === true` nie gwarantuje działającego internetu (słabe łącze, portal Wi-Fi) — `false` jest za to wiarygodne, więc wskaźnik "offline" nie kłamie, co najwyżej czasem się nie pokaże mimo realnego braku sieci. Weryfikacja e2e: Playwright (biblioteka, nie `@playwright/test`), `context.setOffline(true)` poprawnie odpala zdarzenia `online`/`offline` w Chromium.

Przykład (dosłowny kod): `docs/przyklady/pwa/use-online.ts`.

## 8.12. Kolejność budowy ekranu i definicja ukończenia ekranu

[29.09.2026] ✅ DODANO — źródło: inzynier-offgrid-pro (U.4, D51 / Dyrektywa #15 tamtego projektu), decyzja właściciela repo: połączyć w jedną regułę. Dotąd kolejność budowy ekranu była zapisana tylko w 9.0a (kalkulator → klucze i18n → opis narzędzia AI), a autosave (5.7) i `?` przy polu (8.4) obowiązywały bez miejsca w tej kolejności; 10.4 (DoD) nie wymieniała żadnej z tych warstw. Skutek w inzynier-offgrid-pro: z 220 ekranów tylko 7 miało `?`, a 30 z 36 ekranów zbudowanych już po lokalnej decyzji "nowe ekrany od razu z chmurkami" znowu ich nie miało — każda sesja kopiowała sąsiedni ekran; ~640 pól do uzupełnienia drugi raz, w trzech językach.

**Reguła — jedna kolejność dla każdego ekranu. To miejsce jest kanoniczne; 9.0a, 5.7, 17.1a i 10.4 odsyłają tutaj.**
1. **Kalkulator** — input/silnik/walidacja/ostrzeżenia + testy (03, 04, 10).
2. **Klucze i18n** — Kernel zwraca klucze, nie tekst (17.2).
3. **Ekran z autosave draftu** (5.7) — od pierwszej wersji ekranu, nie dobudowany później.
4. **Pomoc** — `?` przy każdym parametrze (8.4) + informacja „i” przy tytule ekranu; pisana po ustabilizowaniu pól, przed oddaniem ekranu. [29.09.2026] ⚠️ Wewnętrzna forma „i” (np. zakładki "do czego służy" / "jak liczymy") i jej relacja do Migawki edukacyjnej (8.4, Sekcja D) — do ustalenia przez właściciela repo, patrz `docs/lista-do-zrobienia.md`. Do tego czasu: „i” mówi, do czego służy ekran i kiedy go użyć. [29.09.2026] ✅ ROZSTRZYGNIĘTO — forma „i”: zakładki „Po ludzku” i „Fizyka”, Sekcja D Doradcy zostaje pod wynikiem (8.4b, dopisek w 8.4).
5. **Opis narzędzia AI** — na końcu (uzasadnienie tej pozycji: 9.0a, bez zmian); `description` narzędzia mówi, kiedy go użyć.

Kroki 2–5 powstają od razu **we wszystkich językach minimalnego zestawu projektu** (17.1a: PL+EN+RU) — tłumaczenie jest częścią budowy ekranu, nie późniejszym retrofitem (tempo "moduł po module" z 17.9 dotyczy wyłącznie nadrabiania ekranów zbudowanych wcześniej bez tłumaczeń). Tłumaczenie wygenerowane przez AI ma status `draft` (17.7), dopóki nie zostanie zweryfikowane.

**Zmiana istniejącego ekranu podlega tej samej regule.** Nowe pole dodane do już istniejącego ekranu dostaje w tej samej zmianie: miejsce w autosave draftu (z poprawnym odczytem starego szkicu bez tego pola — 5.5), klucze i tłumaczenia we wszystkich językach, `?` przy polu, aktualizację opisu narzędzia AI (`.describe()` pola). Istniejący ekran, który nie ma jeszcze autosave, dostaje go przy pierwszej takiej zmianie — nie "przy okazji kiedyś".

**Definicja ukończenia ekranu.** Ekran (nowy albo zmieniony) jest ukończony dopiero wtedy, gdy ma wszystkie kroki 1–5 — obok ogólnej DoD z 10.4. Brak któregokolwiek = ekran nieukończony, nie "gotowy z drobnym długiem".

**Pilnowanie mechaniczne.** Kroki 3–5 mają strażnika w CI wg 11.9 (np. każde pole ma `?`, każdy nagłówek ekranu ma „i”, każda strona z polami używa autosave albo ma jawny komentarz z powodem, każdy kalkulator ma zarejestrowane narzędzie AI z opisem "kiedy użyć"). Reguła bez strażnika dryfuje w ciągu dni, bo nowy kod powstaje przez kopiowanie sąsiedniego (15.19).

**Uzasadnienie.** Te same warstwy — i18n, autosave, rejestr AI (17.1a, 5.7, 9.0a), a teraz pomoc — jeden projekt odkrył osobno, każdą przez kosztowny retrofit. Jedna lista w jednym miejscu jest tańsza niż składanie jej z czterech rozdziałów przy każdym ekranie, a zrobienie wszystkiego naraz, łącznie z tłumaczeniami, oszczędza czas i tokeny, bo kontekst ekranu jest już załadowany.

## 8.13. Prezentacja wyniku normowego: jedna liczba obowiązująca, jawna niepewność, podpowiedź przed bramką

[07.10.2026] ✅ DODANO — źródło: inzynier-szkieletowy-pro (U.4, wpisy z 05–06.10.2026, D153 tamtego projektu), decyzja właściciela repo. Uzupełnia 3.7 pkt 6 o stronę UI.

**Reguła 1 — jedna liczba obowiązująca.** Gdy metoda normowa daje przedział (kres górny/dolny, wariant uproszczony i dokładny), ekran pokazuje **jedną liczbę oznaczoną jako obowiązującą** i jedno zdanie „który wynik obowiązuje i dlaczego”; granice pokazuje się osobno jako przedział niepewności z opisem. Nie pokazuj trzech równorzędnych liczb (myli użytkownika) ani samej jednej bez widocznej niepewności (ukrywa ją). Narzędzie AI dostaje wynik obowiązujący **i** granice z opisem.

**Reguła 2 — `ESTIMATE` jest widoczny w każdym miejscu, gdzie widać liczbę** (3.3): znacznik 🔎 i dopisek „norma liczy X, to nasza interpretacja”; w eksporcie/raporcie także.

**Praktyka zalecana (nie reguła) — podpowiedź na etapie, bramka przy przejściu dalej.** Gdy domyślny/świeży projekt uczciwie nie spełnia wymagania (np. domyślna ściana REI 15 < wymagane 30), w trakcie konfiguracji pokaż **podpowiedź z propozycją poprawy**, a twardy błąd/bramkę uruchom dopiero przy próbie przejścia do następnego etapu. Nie zmieniaj obliczeń ani nie wyciszaj testów po to, by świeży projekt był „zielony” (10.10 pkt 3). Rozstrzygnięcie lokalne projektu może być inne — stąd status praktyki, nie reguły.


## 8.14. Porównywarki i rankingi opcji: widoczne kryteria i wagi, brak danych to „nie do porównania”, skala względna

[16.10.2026] ✅ DODANO — źródło: inzynier-offgrid-pro (U.4, wpis z 08.10.2026, wzorzec z `docs/porownywarka-paneli-pv-specyfikacja.md` tamtego projektu), decyzja właściciela repo (pełny podrozdział, bo porównywarki innych typów — falowniki, baterie, materiały, dostawcy — mogą się pojawić w kolejnych aplikacjach rodziny). Dotyczy każdego ekranu, który **szereguje lub ocenia kilka opcji względem siebie**; uzupełnia 3.7 pkt 1 (brak danych nigdy nie staje się zerem) o stronę UI.

**Reguła 1 — kryterium jest osobnym polem z zaznaczeniem.** Każde kryterium porównania to oddzielne pole z checkboxem: zaznaczone = liczone, odznaczone = pomijane w rankingu. Użytkownik widzi, co wchodzi do oceny, i może to wyłączyć; nie ma kryteriów ukrytych.

**Reguła 2 — wagi są zawsze widoczne i sumują się do 100%.** Wagi widać przy kryteriach, a po zmianie zaznaczenia lub wagi przeliczają się automatycznie tak, by suma pozostała 100%. Ranking nigdy nie opiera się na wadze, której użytkownik nie widzi.

**Reguła 3 — brak parametru to „nie do porównania”, nigdy zero ani wartość domyślna.** Gdy element nie ma wartości kryterium (brak w karcie katalogowej, dane nieznane), jest ona `null`, a kryterium dla **tego elementu** jest jawnie oznaczone „nie do porównania” (z powodem, jeśli znany). Nie wolno jej uzupełniać zerem, wartością typową ani średnią zestawu, bo wypaczyłoby to ranking po cichu — to szczególny przypadek 3.7 pkt 1. Wpływ braku na wynik zbiorczy jest widoczny (np. wynik liczony z mniejszej liczby kryteriów jest tak oznaczony), a zgodnie z 3.7 pkt 2 ocena zbiorcza nie ukrywa najsłabszego ogniwa.

**Reguła 4 — skala względna jest nazwana wprost.** Gdy oceny (gwiazdki, punkty, kolory) wynikają z pozycji w danym zestawie, ekran mówi, że skala jest względna w obrębie porównywanych opcji: te same gwiazdki w innym zestawie znaczą co innego. Nie sugeruj skali bezwzględnej, jeśli jej nie ma.

**Reguła 5 — tekst w obsługiwanych językach.** Nazwy kryteriów, komunikaty „nie do porównania” i opis skali względnej przechodzą przez słownik i18n (17.1a); w ranking nie wchodzi tekst zależny od języka.

**Reguła 6 — źródło każdej liczby z katalogu jest pod ręką użytkownika.** [16.10.2026] ✅ DODANO — źródło: inzynier-offgrid-pro (U.4, wpis z 08.10.2026), decyzja właściciela repo (wariant A+C). Gdy dane porównania pochodzą z katalogu przepisanego z kart katalogowych (panele, falowniki, baterie, materiały), ekran pokazuje przy każdym wpisie wstawionym z katalogu **wskazanie źródła**; zalecaną formą jest link „Zobacz kartę katalogową” do **obrazu karty serwowanego przez samą aplikację** (użytkownik sam sprawdza, że liczba pochodzi z karty). Zasady:
- **Link znika po ręcznej zmianie.** Gdy użytkownik zmieni liczbę pochodzącą z karty, link do karty przy tej liczbie znika, a wartość jest oznaczona jako wpisana ręcznie — dane przestają być potwierdzone źródłem. Nigdy nie zostawiaj linku do karty przy liczbie, która z niej już nie pochodzi.
- **Wpis katalogu niesie ścieżkę źródła.** Katalog zawiera dla każdego wpisu ścieżkę do obrazu karty (albo, gdy obrazu nie wolno serwować, nazwę dokumentu i stronę); brak źródła to jawny stan „źródło niedostępne”, nie ukryty link.
- **Licencja przed udostępnieniem (19.10).** Obraz karty to materiał strony trzeciej, a aplikacje rodziny są użyciem komercyjnym (rozdz. 12) — obraz wolno serwować dopiero po rozstrzygnięciu praw do niego (zgoda producenta albo licencja dopuszczająca użycie komercyjne). Bez tego zostaje wariant bez obrazu: nazwa dokumentu, strona i ewentualnie link zewnętrzny.
- **Rozmiar offline (5.3).** Obrazy kart nie wchodzą automatycznie do precache; decyzja o ich buforowaniu uwzględnia rozmiar instalacji i uprzedzenie użytkownika (5.3 — precache od instalacji z testem offline).
- **Test istnienia plików.** Test sprawdza, że każda ścieżka źródła z katalogu wskazuje istniejący plik oraz że link znika po ręcznej zmianie liczby (rozdz. 10).

**Testy (rozdz. 10).** Co najmniej: (a) suma wag = 100% po każdej kombinacji zaznaczeń, w tym po odznaczeniu wszystkich bez jednego; (b) opcja z `null` w kryterium nigdy nie dostaje punktów za to kryterium i jest oznaczona; (c) zmiana kolejności opcji w danych wejściowych nie zmienia ich oceny względem siebie.

## 8.15. Wydruki i raporty: ślad wersji na każdej stronie, stopka jako `<tfoot>`

[16.10.2026] ✅ DODANO — źródło: inzynier-offgrid-pro (U.4, wpis z 09.10.2026 „Stopka powtarzana na każdej stronie wydruku”), decyzja właściciela repo. Dotyczy wydruku/PDF generowanego z HTML (Chromium).

**Reguła — ślad wersji na wydruku.** Wydruk lub PDF z wynikiem obliczeń niesie ślad wersji z 3.8 pkt 6 (numer wersji programu, identyfikator builda, wersje danych, w razie potrzeby wersja silnika). Powtarza się na każdej stronie, jeśli dokument ma więcej niż jedną.

**Praktyka zalecana (nie reguła) — stopka jako `<tfoot>`, nie `position: fixed`.** Stopka, która ma być na każdej stronie i nie nachodzić na treść, najpewniej działa jako `<tfoot>` tabeli otaczającej dokument: przeglądarka powtarza ją na każdej stronie i rezerwuje na nią miejsce. `position: fixed` też powtarza element, ale zasłania treść dochodzącą do dołu strony. **Zakres weryfikacji:** sprawdzone w druku do PDF w Chromium (3 strony A4); zachowanie w Safari i Firefox nie zostało potwierdzone — projekt, który je wspiera, sprawdza wydruk w nich sam, zanim uzna wzorzec za obowiązujący u siebie.

## 8.16. Rozmiar ilustracji i ikon: z tokenu, nie z liczby w komponencie

[17.10.2026] ✅ DODANO część zasadniczą, 🔎 liczby nieustalone — źródło: inzynier-offgrid-pro (U.4, wpis z 16.10.2026 i jego uzupełnienie z odpowiedziami na pytania tej sesji, decyzja właściciela repo: wniesienie dopiero po odpowiedzi projektu). Projekt wprost zastrzegł, że liczbowego minimum czytelności i minimalnej grubości kreski **nie należy traktować jako gotowych liczb do standardu** — poniżej zasada sprawdzona w kodzie oraz osobno hipotezy ze statusem 🔎.

**Reguła (sprawdzona w kodzie i testem) — rozmiar z tokenu.** Rozmiar ilustracji (kafle, banery modułów) pochodzi z **tokenu CSS zależnego od szerokości ekranu** (np. `--ikona-kafel`: jedna wartość dla telefonu, większa od progu szerokości), a nie z liczby wpisanej w komponencie. Komponent ilustracji nie ma propsa `size`. Wartości tokenów leżą na jednej skali (w projekcie źródłowym wielokrotności 4 px: 16, 20, 24, 32, 48, 64, 80, 96, 112, 128). Test sprawdza minimum trzy rzeczy: token istnieje i leży na skali, wartość dla telefonu jest nie większa niż dla tabletu, a komponent nie ma rozmiaru wpisanego w kodzie. Nie definiuj tokenów, których nic nie używa (martwy kod).

**Ilustracje a ikony interfejsu.** To dwie klasy o różnych zasadach: ilustracje (duże, rysowane z cienką kreską, w `viewBox` np. 256) podlegają zasadom tej sekcji; ikony interfejsu (małe, liniowe, `viewBox` np. 24, rozmiary 16/20/24) mają własne rozmiary i nie podlegają minimum ilustracji. Wspólne jest tylko: rozmiar z jednej skali, nie z przypadkowych liczb.

**SVG skaluje się z gęstością pikseli samo** — osobne pakiety rozdzielczości (@1x/@2x/@3x) dla SVG są zbędne. Raster jest potrzebny tylko tam, gdzie rozmiar narzuca system lub manifest (ikony PWA, `apple-icon`, favicon); te rysuje się osobno, prosto, w rozmiarze, w którym mają być czytelne, i nie obejmuje ich minimum ilustracji.

**🔎 Hipotezy niezweryfikowane — nie traktować jako reguł.**
1. **Minimum czytelności ilustracji (w projekcie źródłowym 80 px)** to **ocena autora z zapisu decyzji, nie pomiar**; nie sprawdzono jej na prawdziwym telefonie (tylko emulacja Chromium 390×844 przy gęstości 1×).
2. **Minimalna grubość kreski niosącej treść** (propozycja: wyświetlana co najmniej 1 px na minimalnym rozmiarze, czyli w `viewBox` 256 przy 80 px co najmniej 3,2 jednostki) to **obliczenie, nie próba**, i istniejące ilustracje projektu źródłowego jej nie spełniają. Propozycja: napisy w ilustracjach niedozwolone, znaczenie niosą kształty.
3. Warunek zdjęcia 🔎: próba na prawdziwych telefonach przy gęstości 1×/2×/3× i **decyzja właściciela** projektu. Do tego czasu projekt ustala minimum **wprost** i zapisuje w swoim dokumencie, **jak je ustalił** (pomiar na urządzeniach / ocena), nie podając oceny jako pomiaru.

**Luka testowa do uniknięcia.** Test tokenu nie wykaże, że ilustracja nigdy nie wyświetli się poniżej minimum — kontener w wąskiej siatce może ją skurczyć mimo poprawnego tokenu. Jeśli projekt ma minimum, sprawdza **faktycznie wyrenderowany rozmiar** (np. pomiar elementu w teście przeglądarkowym), a nie tylko wartość tokenu.

[18.10.2026] ✅ DODANO — źródło: inzynier-offgrid-pro (U.4, wpis z 18.10.2026, decyzja D90 właściciela tamtego projektu), decyzja właściciela repo (wariant A). **Minimum czytelności jest tokenem obok limitu, z testem.** Minimum czytelności ilustracji (w projekcie źródłowym `--ikona-min` = 80 px) zapisuje się jako **token CSS obok górnego limitu** (`--ikona-kafel`), a opakowania ilustracji stosują oba (`min-w-(--ikona-min)` obok limitu). Test sprawdza, że token istnieje, ma zapisaną wartość, a opakowania ilustracji go używają. Liczba nie siedzi w opisie ani w komponencie. **Status liczby 80 px:** to **decyzja właściciela projektu źródłowego (D90), wartość z oceny, nie z pomiaru na urządzeniach** — dla innych projektów punkt wyjścia do własnej decyzji, nie norma rodziny. Hipotezy 2 (minimalna grubość kreski, zakaz napisów w ilustracjach) i 3 (próba na prawdziwych telefonach 1×/2×/3×) zostają 🔎, bez zmian.

