# 20 — Wymiana danych między appkami przez pośrednika (łącznik)

Powiązane: [18 Logowanie, konta i tożsamość](18-logowanie.md) (18.15, 18.16 — transfer plikiem i koperta) · [07 Bezpieczeństwo](07-bezpieczenstwo.md) (7.5 — zgoda na wysłanie do chmury) · [12 Freemium](12-freemium.md) · [19 Dane środowiskowe](19-dane-srodowiskowe.md) · [`docs/schematy-transferu/`](../schematy-transferu/)

---

## 20.0. Status i zakres

[18.10.2026] ✅ PROJEKT ZATWIERDZONY przez właściciela repo (wybory: szyfrowanie E2, premium P2, stos S1, parowanie kont), 🔎 **jeszcze niewdrożony i niezweryfikowany w praktyce.** Wzorzec **opcjonalny** jak 18.15: dotyczy wyłącznie klastrów appek rodziny, w których jedna realnie korzysta z danych drugiej. Do czasu zbudowania łącznika transfer idzie plikiem wg 18.16; ten rozdział opisuje **drugi transport** tej samej koperty. Kolejność wdrożenia: po pierwszym realnym transferze plikiem (da dane z praktyki, co użytkownicy przenoszą).

**Wymóg bezwzględny przed wdrożeniem: niezależny przegląd kryptograficzny** protokołu i implementacji (20.11). Standard wskazuje klasy rozwiązań, a nie wymyśla własnej kryptografii.

**Założenia (ustalone):**
1. **Transfer wyłącznie między własnymi kontami jednego użytkownika** (nadawca = odbiorca, ta sama osoba w dwóch aplikacjach). Udostępnianie danych innym osobom jest poza zakresem i wymagałoby osobnej decyzji (inny model zagrożeń).
2. **Parowanie kont, nie globalna nazwa użytkownika.** Łącznik nie ma rejestru nazw ani wyszukiwania użytkowników.
3. **Zawartością jest koperta z 18.16** (schemat z `docs/schematy-transferu/`). Koperta i schemat są niezależne od transportu.
4. **Szyfrowanie end-to-end (E2):** łącznik nigdy nie widzi treści.

## 20.1. Architektura: łącznik

**Reguła (stos S1).** Jedna mała, wspólna usługa — **łącznik** — z własnym projektem backendu, niezależnym od backendów aplikacji. Przechowuje wyłącznie: (a) zaszyfrowane koperty, (b) dane powiązań (pary) i (c) minimalne metadane. Nie przechowuje treści w postaci jawnej, nie zna kluczy, nie ma wspólnego konta ani globalnej nazwy użytkownika.

**Tożsamość bez wspólnego konta.** Łącznik weryfikuje tokeny **każdej aplikacji osobno**, przez klucze publiczne wystawcy (JWKS) z **rejestru zaufanych wystawców**; tożsamość użytkownika to para (wystawca, identyfikator konta w tamtej aplikacji). Dostawcy rodziny (Supabase, Keycloak) udostępniają JWKS. Aplikacje **nie rozmawiają ze sobą bezpośrednio** — wyłącznie przez łącznik; żadna aplikacja nie zależy infrastrukturalnie od drugiej (spójne z 18.15: osobne bazy, brak wspólnego `auth.uid()`).

**Region i operacje.** Region UE, brak logowania treści, limity rozmiaru i częstości, monitoring, kopie zapasowe nie zawierają szyfrogramów po upływie TTL (20.7). Wybór technologii hostingu należy do wykonawcy, pod warunkiem spełnienia tego rozdziału.

## 20.2. Parowanie kont

**Cel.** Jednorazowo powiązać konto w aplikacji A z kontem w aplikacji B jako należące do tej samej osoby i uzgodnić klucze między ich instancjami.

**Przepływ.**
1. Użytkownik zalogowany w A (preferowane uwierzytelnienie kluczem dostępu, 18.2) wybiera „Sparuj z inną aplikacją”. Instancja A **generuje po stronie klienta** kod parowania. Kod **nie jest wysyłany do łącznika w postaci jawnej.**
2. Użytkownik wpisuje kod w B (zalogowany w B). Obie instancje wykonują **protokół uwierzytelnionego uzgadniania kluczy z hasłem/kodem (PAKE)**, a łącznik jest wyłącznie przekaźnikiem wiadomości protokołu. Łącznik sprawdza oba tokeny i zapisuje parę (wystawca A + konto A) ↔ (wystawca B + konto B). Łącznik **nie może** wyprowadzić klucza z tego, co widzi.
3. Wynikiem są **klucze pary** po obu stronach (20.3) oraz zapis pary w łączniku.

**Parametry kodu (twarde):** jednorazowy; krótko ważny; związany z kontem inicjującym; limit prób i blokada po przekroczeniu liczone **po stronie łącznika** (zgadywanie kodu odbywa się wyłącznie online, przez łącznik); po użyciu lub wygaśnięciu nieważny. Konkretne wartości (długość kodu, czas ważności, limit prób) ustala wykonawca i zatwierdza przegląd kryptograficzny.

**Granularność.** Parowanie dotyczy **pary instancji (urządzenie + aplikacja)**. Nowe urządzenie paruje się od nowa (po zalogowaniu kluczem dostępu); stare urządzenie nie musi być dostępne.

## 20.3. Szyfrowanie i klucze

**Reguła.** Treść koperty jest szyfrowana **po stronie nadawcy** i odszyfrowywana **po stronie odbiorcy**. Klasa rozwiązań (do potwierdzenia w przeglądzie kryptograficznym):
- **Szyfrowanie uwierzytelnione (AEAD)** z unikalnym nonce na każdą kopertę (np. AES-256-GCM albo XChaCha20-Poly1305).
- **Klucz pary wyprowadzany** z wyniku uzgodnienia (20.2) funkcją wyprowadzającą klucze (np. HKDF) z etykietą kontekstu (rodzaj użycia).
- **Dane uwierzytelniane dodatkowo (AAD):** identyfikator pary, `schemat`, `wersjaSchematu`, identyfikator transferu — podmiana którejkolwiek wartości unieważnia kopertę.
- **Ochrona przed powtórzeniem:** identyfikator transferu jednorazowy; odbiorca odrzuca powtórkę.
- **Klucze niewyciągalne:** w przeglądarce klucz jako niewyciągalny `CryptoKey` w bezpiecznym magazynie przeglądarki; w aplikacji mobilnej w magazynie kluczy platformy. Klucze nigdy nie trafiają do `StorageAdapter` projektu ani do logów (analogicznie do 18.5).
- **Biblioteka o dobrej reputacji** (np. WebCrypto, libsodium); zakaz własnych implementacji prymitywów.

**Cykl życia kluczy.** Tworzone przy parowaniu; przechowywane na urządzeniu; **utrata urządzenia = ponowne parowanie**, bez utraty danych (źródło zostaje w aplikacji); ponowne parowanie **rotuje** klucze; po odzyskaniu konta wszystkie pary są unieważniane (20.8). **Brak kopii zapasowej kluczy** w pierwszej wersji — świadoma decyzja (kopia zapasowa osłabiałaby E2 i komplikowała odzyskiwanie).

**Do rozstrzygnięcia w przeglądzie kryptograficznym:** konkretny protokół PAKE, wymóg tajemnicy z wyprzedzeniem (forward secrecy) przy rzadkich, jednorazowych transferach (w v1 ratchet nie jest wymagany, rotacja przy ponownym parowaniu), wybór funkcji i parametrów.

## 20.4. Przepływ transferu

**Nadawca:** buduje kopertę wg 18.16 i waliduje ją schematem → szyfruje (20.3) → wysyła do łącznika (łącznik sprawdza token, parę, limit FREE z 20.6, rozmiar) → łącznik zapisuje szyfrogram z TTL.

**Odbiorca:** pobiera szyfrogram → odszyfrowuje; AEAD odrzuca zmodyfikowaną kopertę → **sprawdza sumę kontrolną i waliduje schematem** (jak przy pliku) → odrzuca `wersjaSchematu` wyższą niż znana → pokazuje **podgląd i dialog zgody** (7.5), nic nie trafia do projektu bez zgody → po zgodzie importuje i **potwierdza odbiór** → łącznik usuwa szyfrogram.

**Walidacja schematem po stronie odbiorcy jest obowiązkowa także przy pośredniku:** dane z serwera i od sparowanego urządzenia traktuje się jak wejście niezaufane (18.16 pkt 4), bo przejęte konto albo błąd nadawcy mogą dostarczyć złośliwą zawartość.

## 20.5. Retencja i prywatność (RODO)

- Szyfrogram jest usuwany **po potwierdzeniu odbioru albo po wygaśnięciu (TTL)**, zależnie od tego, co nastąpi pierwsze.
- **Metadane minimalne:** identyfikator pary, rozmiar, znaczniki czasu, wynik (dostarczono/wygasło/odrzucono). **Bez treści i bez nazwy projektu** (ta jest wewnątrz szyfrogramu). Krótko przechowywane.
- Użytkownik widzi **listę swoich par**, może **cofnąć parowanie** i **usunąć oczekujące koperty**. Usunięcie konta w którejkolwiek aplikacji usuwa jej pary i koperty w łączniku.
- Region UE; umowa powierzenia przetwarzania z dostawcą hostingu; podstawą przetwarzania jest świadczenie usługi użytkownikowi.
- **Parametry liczbowe (TTL, retencja metadanych) nie są wpisane w standard** — ustala je właściciel produktu po weryfikacji prawnej. Ten rozdział nie jest poradą prawną.

## 20.6. Bramka premium (rozdział 12)

**Reguła (wariant P2).** Transfer przez łącznik **nie jest synchronizacją** (jednorazowe przekazanie, nie ciągła kopia), więc nie podlega zasadzie „sync tylko w premium”. Limit: **konto FREE może wykonać jeden transfer; premium — bez ograniczeń.**
- **Egzekwowanie wyłącznie po stronie łącznika** (12.5): klient nie decyduje o uprawnieniu. Łącznik odczytuje uprawnienie z podpisanego tokenu wystawcy (claim) albo pyta backendu aplikacji.
- Licznik jest **per konto nadające**, zużywa się **po potwierdzonym odbiorze** (nieudany lub wygasły transfer go nie zużywa). Powrót z premium do FREE nie zeruje licznika.
- Subskrypcje są **per aplikacja** (18.15, „Granica”): uprawnienie nadawcy wynika z jego aplikacji; wspólny pakiet subskrypcji poza zakresem.
- Po zużyciu limitu aplikacja komunikuje to jawnie i proponuje premium; nigdy nie degraduje po cichu.

## 20.7. Stos S1 — wymagania na łącznik

Osobny projekt backendu, mała powierzchnia ataku, brak logiki domenowej aplikacji. Wymagane: weryfikacja tokenów przez rejestr wystawców (20.1), limity rozmiaru i częstości, blokada prób parowania, brak treści w logach, usuwanie po TTL i po odbiorze, monitorowanie błędów bez ujawniania danych, region UE, polityka kopii zapasowych zgodna z 20.5.

## 20.8. Ochrona przed podszywaniem się i przejęciem konta

| Zagrożenie | Zabezpieczenie |
|---|---|
| Zgadywanie kodu parowania | Kod jednorazowy, krótko ważny, związany z kontem inicjującym; limit prób i blokada po stronie łącznika; PAKE uniemożliwia zgadywanie offline |
| Podszycie się pod nadawcę | Tylko sparowane instancje znają klucz pary; koperta od niesparowanego nadawcy nie przejdzie AEAD |
| Przejęcie konta w jednej z aplikacji | Parowanie i cofnięcie wymagają ponownego uwierzytelnienia (preferowany klucz dostępu, 18.2); powiadomienie o nowym parowaniu; lista par z cofnięciem |
| Odzyskanie konta przez atakującego | Po odzyskaniu konta wszystkie pary są unieważniane; nowe parowanie ma okres karencji (długość ustala właściciel produktu) |
| Złośliwa zawartość koperty | Walidacja schematem, limit rozmiaru, lista dozwolonych rodzajów danych po stronie odbiorcy, podgląd i zgoda; nigdy automatyczne zastosowanie (20.4) |
| Kompromitacja łącznika | E2: atakujący widzi tylko szyfrogramy i minimalne metadane |
| Zgadywanie nazw użytkowników, spam od obcych | Brak globalnej nazwy i wyszukiwania; wiadomość może przyjść tylko od sparowanego konta tego samego użytkownika |
| Powtórzenie starej koperty | Jednorazowy identyfikator transferu w AAD |

## 20.9. Testy

Minimum (do rozszerzenia w przeglądzie): błędny kod parowania; kod wygasły; przekroczony limit prób; powtórzenie koperty; koperta od niesparowanego nadawcy; koperta zmodyfikowana (AEAD odrzuca); odbiorca z wyższą `wersjaSchematu`; **limit FREE egzekwowany po stronie łącznika (drugi transfer odrzucony, klient pominięty)**; usunięcie po odbiorze i po TTL; cofnięcie pary; unieważnienie par po odzyskaniu konta; brak treści jawnej w logach i metadanych (test na przechwyconym ruchu).

## 20.10. Granice

Poza zakresem: synchronizacja ciągła (rozdział 12 — tylko premium), udostępnianie innym osobom, backup kluczy, wspólna subskrypcja między appkami (18.15), transfer danych środowiskowych (19.13 — pobierane z paczki, nie przenoszone).

## 20.11. Definicja ukończenia wdrożenia

(1) Rozstrzygnięty protokół PAKE i parametry (20.3, 20.2). (2) **Niezależny przegląd kryptograficzny zakończony i jego uwagi zamknięte.** (3) Testy z 20.9 zielone. (4) Parametry liczbowe 20.5 zatwierdzone po weryfikacji prawnej. (5) Wpis w rejestrze decyzji każdego uczestniczącego projektu. (6) Rozważenie dopisania do rejestru Y.11 (obiektywnie sprawdzalne reguły kodowe) po pierwszym wdrożeniu.
