# 18 — Logowanie, konta i tożsamość

Powiązane: [05 Baza danych i offline-first](05-baza-danych-offline.md) · [06 API i sieć](06-api-i-siec.md) · [07 Bezpieczeństwo](07-bezpieczenstwo.md) · [12 Freemium i płatności](12-freemium.md) · [13 Droga web → mobile](13-droga-mobile.md)

Dotyczy mechaniki logowania i tożsamości — kto może korzystać z aplikacji i jak. Co dokładnie odblokowuje płatność (FREE vs PRO) jest w rozdziale 12; ten rozdział mówi wyłącznie o samym mechanizmie konta.

Źródło: doświadczenie zero-waste (realnie zbudowany, działający system kont/multi-device/sync) + niezależne, zbieżne wnioski inzynier-szkieletowy-pro i inzynier-offgrid-pro, zebrane mechanizmem U.4 tego samego dnia (14.09.2026).

---

## 18.1. Zasada nadrzędna

Konto jest wymagane od pierwszego uruchomienia aplikacji, bez wyjątku. To rozszerzenie 5.3 ("pierwsze pobranie danych" obejmuje jednorazową aktywację/logowanie), nie jej złamanie — po jednorazowym zalogowaniu aplikacja działa w pełni offline (05), zgodnie z filozofią rodziny (wszystkie aplikacje są długotrwałego, powtarzalnego użytku, nie jednorazowego).

**Uzasadnienie — trzy niezależne, równorzędne powody:**
1. **Kontrolowany trial** — bez tożsamości nie da się bezpiecznie ograniczyć czasowego dostępu do PRO (12.6).
2. **Weryfikacja tier'u** — model subskrypcyjny (12.5) wymaga jednoznacznej tożsamości do odwołania/odnowienia/przeniesienia zakupu między urządzeniami.
3. **Ograniczenie botów i nadużyć** — w pełni anonimowy dostęp uniemożliwia skuteczny rate limiting (18.11); konto daje jednostkę, wobec której limity i blokady faktycznie działają.

## 18.2. Dostawcy logowania

Trzy równorzędne metody logowania od startu: **magic link e-mail** (passwordless), **Google**, **Apple**. Magic link eliminuje temat "reset hasła" jako kategorię — nie ma hasła, nie ma czego resetować.

**Apple Sign-In jest wymagany**, jeśli aplikacja oferuje jakikolwiek inny provider społecznościowy (Google) — zasada App Store, niezależnie od platformy docelowej (13). Koszt: Apple Developer Program, 99 USD/rok, do uwzględnienia w budżecie od dnia decyzji o dodaniu Google, nie odkładany "na wersję mobile".

2FA poza zakresem uniwersalnego wymogu v1 — decyzja per projekt.

## 18.3. Scalanie tożsamości

**Automatyczne** — ten sam zweryfikowany adres e-mail zalogowany przez różnych providerów to jedno konto, scalane automatycznie po adresie.

**Ręczne — gdy adresy nie mogą się zgodzić** (najczęstszy przypadek: Apple private relay, `@privaterelay.appleid.com`, zamiast prawdziwego adresu). System nie może się tego domyślić sam — żadnego dopasowywania po urządzeniu/fingerprintingu (złamałoby 7.5). Jedyny bezpieczny mechanizm:

1. **Inicjacja wyłącznie przez użytkownika**, z poziomu już zalogowanego konta: Ustawienia → "Dodaj/połącz metodę logowania".
2. **Weryfikacja = pełne, żywe uwierzytelnienie drugiej tożsamości w tej samej sesji.** Użytkownik przechodzi cały flow logowania dla drugiego konta, będąc już zalogowanym na pierwsze — skuteczne ukończenie tego uwierzytelnienia jest dowodem posiadania, tym samym poziomem zaufania co reszta systemu.
3. **Jeśli druga tożsamość jest już osobnym kontem z własnymi danymi** — ten sam wzorzec co dołączanie do grupy (18.7): migawka danych obu kont przed scaleniem + ręczne potwierdzenie duplikatów + pełny resync po scaleniu. Nigdy auto-merge.
4. Po scaleniu drugie konto przestaje istnieć jako osobny byt logowania (18.8), jego dane (Seed) żyją dalej pod kontem docelowym.

System może **proaktywnie zasugerować** ten flow, gdy przy zwykłym logowaniu adresy e-mail faktycznie się zgadzają — ale to tylko podpowiedź prowadząca do kroków 1–2, nie substytut ręcznej weryfikacji.

## 18.4. Supabase Auth jako wymóg

Wszystkie projekty rodziny korzystają z Supabase Auth, spójnie z wzorcem RLS-config (6.5) — nie osobna decyzja infrastrukturalna per projekt. Świadome odejście dopuszczalne wyłącznie jako jawna, udokumentowana decyzja (0.1 — nigdy cicha rozbieżność), nie domyślny wybór innego dostawcy z wygody chwili. Mechanizm auth ma przetrwać punkt wymiany web→mobile (13) bez przepisywania.

## 18.5. Sesja i tokeny — bezpieczeństwo

Token sesji wyłącznie w `HttpOnly` cookie, **nigdy** przez `StorageAdapter` projektu — spójne z już istniejącym 7.2 ("tokeny w HttpOnly cookies"). `StorageAdapter` (5.2) abstrahuje dane domenowe (Seed), nie sekrety sesji — łatwa pomyłka łamiąca 7.2 po cichu, warta jawnego zakazu.

## 18.6. Multi-device vs multi-user — dwa różne problemy

"To samo konto na wielu urządzeniach" (synchronizacja) i "wiele osób dzielących te same dane" (gospodarstwo domowe/zespół) to **dwa niezależne mechanizmy**, mylone na starcie. Pierwszy działa od razu z byle backendem auth. Drugi wymaga osobnego modelu członkostwa — nie da się go dorobić później bez migracji danych.

## 18.7. Model grupy współdzielonej (household/zespół)

Gdy projekt potrzebuje współdzielenia danych między kontami:

- **`grupa.id` jako samodzielna encja**, nigdy z twardym FK do konta założyciela — kaskadowe usunięcie konta założyciela nie może usunąć całej grupy.
- **RLS grupowe przez `security definer` helper** (`grupa_id_for(uid)`), nie rekurencyjne podzapytanie na tabeli członkostwa.
- **Dołączenie do grupy = migawka danych przed dołączeniem** + ręczne potwierdzenie duplikatów przez człowieka. Nigdy auto-merge.
- **Pełny resync po dołączeniu**, nie tylko delta — serwer ma zero rekordów pod nowym właścicielem grupowym.
- **Etykieta "kto zmienił"** na bannerze konfliktu pokazywana wyłącznie, gdy grupa ma >1 członka.

## 18.8. Usuwanie konta

Prawdziwy `DELETE`, nie tombstone, z `ON DELETE CASCADE` na kolumnie właściciela. Konto będące administratorem grupy z innymi członkami **nie może się usunąć**, dopóki nie przekaże roli administratora dalej.

## 18.9. Zakres synchronizacji: Seed, nigdy Wynik

Rozszerzenie 5.1 na chmurę — synchronizowane jest wyłącznie surowe wejście użytkownika, nigdy przeliczony wynik. Eliminuje klasę błędów "wynik z chmury niezgodny z nowszą wersją silnika obliczeniowego".

## 18.10. Zanim zbudujesz sync dla danego typu danych

Sprawdź (`grep`/audyt referencji), czy dany typ danych jest w ogóle gdziekolwiek wyświetlany z powrotem użytkownikowi, **zanim** zbudujesz dla niego mechanizm synchronizacji/retencji.

## 18.11. Niezawodność sync na hostingu serverless

Rate limiting liczony w zmiennej procesu **nie działa** na hostingu serverless (różne instancje = osobna pamięć) — licznik musi siedzieć w bazie danych. Minimalny, tani zestaw niezawodności: retry z backoffem + rate limit w bazie + monitoring błędów wąsko zakresowany do kilku znanych, krytycznych miejsc.

## 18.12. Offline-first a wymóg konta

Rdzeń domenowy (5.3) działa w pełni offline **po** jednorazowej aktywacji kontem — to nie złamanie 5.3, tylko rozróżnienie dwóch osobnych wymiarów: "offline-first" dotyczy dostępności funkcji bez sieci między sesjami, nie eliminacji wymogu tożsamości na starcie. Warte jawnego zapisania: dwa niezależne projekty (offgrid, szkieletowy-pro), wywodząc wniosek czysto z 5.3 w izolacji, doszły do "konto = rozszerzenie, nigdy brama" — sprzecznie z 18.1. Wymóg konta ma dwa niezależne uzasadnienia biznesowe/bezpieczeństwa (kontrolowany trial, anty-bot), o których 5.3 milczy — bez tego zdania każdy kolejny projekt popełni ten sam błąd wnioskowania.

## 18.13. Chmura wyłącznie po zakupie premium

Chmura/synchronizacja jest dostępna wyłącznie po zakupie premium, we wszystkich projektach rodziny (pełny podział FREE/PRO: rozdział 12). Konto FREE (sam fakt zalogowania) nie daje dostępu do chmury — dane pozostają w 100% lokalne (5.3). Moment zgody na wysyłkę do chmury (7.5) następuje przy zakupie premium / włączeniu synchronizacji, nie przy rejestracji.

## 18.14. Rozwiązywanie konfliktu synchronizacji (wzorzec opcjonalny)

**Status.** Nie jest to reguła obowiązkowa jak 18.1–18.13. Wzorzec włączany świadomie, per projekt, gdy realne jest ryzyko równoległej edycji offline tego samego rekordu na dwóch urządzeniach (ten sam mechanizm klasyfikacji co Y.10 GOD BOOK — moduły opcjonalne, nigdy dodawane automatycznie). Projekt jednourządzeniowy, albo taki, gdzie kolizje są w praktyce niemożliwe, może świadomie z niego zrezygnować na rzecz prostszego last-write-wins.

**Krok 1 — Wykrycie.** Każdy synchronizowany rekord (Seed, 18.9) niesie `base_version` — wersję serwera, od której urządzenie zaczęło swoje lokalne zmiany. Przy wypchnięciu zmian serwer porównuje przychodzący `base_version` z aktualną wersją. Zgodne → zapis wprost. Niezgodne → policz różnicę pole-po-polu między zmianami lokalnymi a już zapisanymi na serwerze (oba względem wspólnego przodka). Rozłączne pola → auto-merge, cicho. **To samo pole zmienione po obu stronach → prawdziwy konflikt** (dokładny próg, nie ocena "jak duże jest nakładanie się"), Krok 2.

**Krok 2 — Prezentacja użytkownikowi.** Pełny ekran (nie cichy baner), przy najbliższej okazji, gdy urządzenie z konfliktem jest online: nazwa rekordu, czytelne zestawienie różnic (08 UI/UX, nie surowy JSON), trzy opcje:
1. **Zachowaj wersję z tego urządzenia** — staje się kanoniczną wersją w chmurze.
2. **Zachowaj wersję z chmury** — odrzuć zmiany lokalne (nie bezpowrotnie, patrz Krok 3).
3. **Zachowaj obie** — użytkownik i tak wskazuje, która staje się kanoniczna (system zawsze potrzebuje jednej aktywnej wersji), druga trafia do archiwum jako przywracalny snapshot.

**Krok 3 — Model danych archiwalnej wersji.** Osobny magazyn `zapisane_rozbieznosci`, nigdy nadpisywanie w tym samym rekordzie co dane aktywne (czystość Kernela, 01). Pola: `rekord_id`, `tresc` (pełny Seed odrzuconej wersji, nigdy Wynik), `data_rozjazdu`, `powod` = stała etykieta **"zachowane na prośbę użytkownika"** (nie dowolny tekst — spójna, tłumaczalna fraza), `status`: dostępna do przywrócenia / przywrócona / usunięta trwale.

**Krok 4 — Widoczność w Profilu/Ustawieniach.** Sekcja "Synchronizacja", obok statusu "Zalogowano i zsynchronizowano ✅", dodatkowa podsekcja widoczna tylko gdy istnieją wpisy w `zapisane_rozbieznosci`: nazwa rekordu, data rozjazdu, etykieta "zachowane na prośbę użytkownika", dwie akcje — **Przywróć** (jawnie ponownie uruchamia Krok 1 wobec aktualnej wersji kanonicznej) i **Usuń trwale**.

**Krok 5 — Zasada nadrzędna.** Żadna z trzech opcji w Kroku 2 nie usuwa danych trwale bez osobnej, jawnej akcji użytkownika w Kroku 4. Rozszerzenie 0.4.4 (zero cichych luk) na przypadek konfliktu sync.
