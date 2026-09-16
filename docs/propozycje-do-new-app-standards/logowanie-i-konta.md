# PROPOZYCJA dla `new-app-standards` — Nowy rozdział: Logowanie i konta użytkownika

> **✅ Status (15.09.2026): ROZSTRZYGNIĘTE.** `new-app-standards` dodał `docs/standards/18-logowanie.md`
> (18.1–18.14) — źródło jawnie wymienia wnioski tego projektu (obok zero-waste i inzynier-szkieletowy-pro)
> jako jeden z wkładów. Ta propozycja zostaje niżej w całości jako historyczny zapis analizy luki
> (Część D GOD BOOK — nie usuwamy, tylko oznaczamy) — nie jest już aktualnym źródłem prawdy o temacie,
> patrz `docs/standards/18-logowanie.md`. Projekt nie ma jeszcze wdrożonego logowania w kodzie —
> to osobne zadanie, patrz `docs/lista-do-zrobienia.md`.

> **Status oryginalny (przy powstaniu, nieaktualny): SZKIELET, nie propozycja gotowa do przyjęcia.** Ten plik to szkic rozszerzenia,
> powiązany ze zgłoszeniem w `docs/wklad-do-standardu.md`. **Nie jest częścią `docs/standards/`** i
> nie ma mocy obowiązującej. W odróżnieniu od pozostałych plików w tym folderze — ten **celowo nie
> jest dokończony**: właściciel projektu zlecił, żeby rekomendacje logowania bazowały na realnej
> implementacji w apce `zero-waste` (siostrzany projekt rodziny), a ta sesja nie miała dostępu do
> tamtego repo. Poniżej: (A) dlaczego to prawdziwa luka, nie tylko luka tego dokumentu, (B) co
> generyczny standard architektoniczny może ustalić NIEZALEŻNIE od konkretnej implementacji
> zero-waste, (C) jawna lista pytań, na które trzeba odpowiedzieć PO przejrzeniu zero-waste, zanim
> ten dokument będzie gotowy do konsolidacji.

## A. Skala luki — sprawdzone, nie zgadywane

W obecnym standardzie (`docs/standards/00`-`16`, sprawdzone w tej sesji) oraz w GOD BOOK
(`instrukcja-uniwersalna-biblii-projektu-v2_8.md`) **żaden rozdział nie wspomina logowania, kont
użytkownika, uwierzytelniania ani autoryzacji** — zero trafień na te terminy w obu dokumentach. To
nie jest luka tylko tego projektu (`inzynier-offgrid-pro` też nie ma żadnego kodu auth) — to luka na
poziomie samego pakietu `new-app-standards`, którą każdy kolejny projekt rodziny odkryje od nowa,
dopóki nie powstanie tu chociaż szkielet reguł.

## B. Co da się ustalić już teraz, bez zero-waste — echo istniejących zasad standardu

Nawet bez konkretnej implementacji, kilka reguł wynika wprost z zasad **już przyjętych** gdzie
indziej w standardzie — spójność wymaga, żeby nowy rozdział o logowaniu ich nie naruszył:

1. **Offline-first (rozdział 05) musi przetrwać brak konta.** Skoro tryb offline jest wymogiem
   funkcji podstawowych, logowanie nie może być bramką blokującą dostęp do rdzenia aplikacji —
   najwyżej do funkcji wymagających synchronizacji/chmury (podobnie jak `CLOUD_ASSISTED` w
   rozdziale 09 dla AI). Konto = opcjonalne rozszerzenie, nie warunek wejścia.
2. **Prywatność lokalna-domyślna (rozdział 07)** już ustala, że dane zostają lokalnie, chyba że user
   jawnie zgodzi się na chmurę — logowanie/konto to dokładnie ten moment zgody, więc nowy rozdział
   powinien się do 07 odwoływać, nie duplikować.
3. **Egzekwowanie freemium wyłącznie server-side (rozdział 12)** — jeśli konto ma odblokowywać
   płatne funkcje, sprawdzanie uprawnień nigdy nie może żyć tylko w kliencie, ta sama zasada co już
   istnieje dla feature→tier.
4. **`StorageAdapter` (rozdział 05)** to naturalne miejsce na dane sesji/tokenu — nie nowy,
   równoległy mechanizm przechowywania.
5. **Droga web→mobile (rozdział 13)** — jeśli logowanie ma działać tak samo na przyszłej wersji
   natywnej, mechanizm auth powinien żyć za tym samym punktem wymiany (adapters), nie być wpleciony
   bezpośrednio w kod web.

To są ograniczenia brzegowe (czego NIE robić), nie gotowa specyfikacja (JAK to zrobić) — stąd status
"szkielet".

## C. Pytania do rozstrzygnięcia po przejrzeniu zero-waste

Właściciel projektu wskazał `zero-waste` jako wzorzec — tam trzeba sprawdzić i przenieść tutaj
odpowiedzi (nie zgadywać z góry):

1. **Dostawca/mechanizm auth** — własna implementacja (hasła+sesje), czy zewnętrzny dostawca
   (np. Supabase/Clerk/NextAuth/Firebase czy inny)? Jeśli zewnętrzny: czy to zależność akceptowalna
   dla całej rodziny apek, czy specyficzna decyzja zero-waste?
2. **Model konta** — jedno konto = jeden projekt/apka, czy jedno konto rodziny na wszystkie apki
   (współdzielone logowanie między Offgrid, zero-waste, przyszłymi projektami)? To ma duże
   konsekwencje architektoniczne (wspólny identity provider vs niezależne per-apka).
3. **Co dokładnie wymaga konta** — cała apka za logowaniem, czy (zgodnie z zasadą B.1 wyżej) tylko
   funkcje synchronizacji/chmury/płatności?
4. **Offline↔online spięcie danych** — jak zero-waste rozwiązuje scenariusz "user pracował offline
   bez konta, potem się zalogował" (merge danych lokalnych z kontem, czy nadpisanie, czy ręczny
   wybór)? To bezpośrednio dotyka rozdziału 05 (Seed vs Wynik) i wymaga wspólnej reguły.
5. **Role/uprawnienia** — czy istnieje coś poza pojedynczym typem użytkownika (np. właściciel
   projektu vs współpracownik/podgląd), istotne dla aplikacji tej rodziny używanych zespołowo
   (np. instalator + klient)?
6. **Reset hasła / weryfikacja email / 2FA** — zakres bezpieczeństwa faktycznie wdrożony, do
   odzwierciedlenia w rozdziale 07 (Bezpieczeństwo) tego nowego materiału.

## Następny krok

Właściciel projektu dołączy repo `zero-waste` do przyszłej sesji (tej albo kolejnej) pracującej nad
tym tematem — po przejrzeniu realnego kodu, sekcja C wyżej ma zostać zastąpiona konkretnymi
odpowiedziami, a ten plik przejść do statusu "propozycja gotowa do konsolidacji" (jak pozostałe pliki
w tym folderze). Do tego czasu żadna z powyższych opcji nie jest rekomendacją — to lista pytań, nie
odpowiedzi.
