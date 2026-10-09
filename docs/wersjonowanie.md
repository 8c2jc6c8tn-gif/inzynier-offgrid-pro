# Wersjonowanie programu Inżynier Offgrid

**Status:** obowiązuje, potwierdzone przez właściciela 09.10.2026 („pasuje”); decyzja D82 w `rejestr-decyzji.md`. Numeracja startuje od **3.1.0**.

Wersja programu to pole `version` w `package.json` w formacie `PIERWSZA.DRUGA.TRZECIA`. Widać ją na wydrukach (stopka i blok „Wersja obliczeń i danych”), razem z krótkim znacznikiem builda (skrót commita) jako dodatkowym śladem. Po to jest: z samej wersji ma dać się ustalić, czy dany wynik policzono według tych samych zasad i danych, co dziś.

**Pytanie rozstrzygające:** czy ten sam zestaw danych wejściowych da teraz inną liczbę, albo czy stary zapis użytkownika przestanie działać? Jeśli tak, to nie jest zmiana trzeciej cyfry.

## Kiedy którą cyfrę podbijamy

| Cyfra | Kiedy | Przykłady |
|---|---|---|
| **Pierwsza** (zmiana zasad) | Zmieniły się zasady, według których program liczy, albo format danych użytkownika. | Nowy model obliczeń, wzór, norma, współczynnik albo próg w kalkulatorze, jeśli zmienia wyniki dla tych samych danych w sposób nieoczekiwany dla użytkownika (np. inny model nasłonecznienia, inna norma obciążeń). Zmiana formatu zapisanych szkiców bez automatycznej migracji (stare zapisy przestają działać). Usunięcie ekranu lub modułu. |
| **Druga** (coś nowego albo nowe dane) | Doszła funkcja albo dane, które mogą zmienić wynik lub zakres wyboru. | Nowy ekran, zakładka, moduł, tryb (np. wydruk oferty, tryb prosty). Nowa albo poprawiona partia danych: katalog paneli lub urządzeń, cennik, dane pogodowe. Poprawka błędu w obliczeniu, który zmieniał wynik (stary wynik był błędny). Nowa kontrola lub ostrzeżenie zmieniające ocenę (np. nowy próg 🔴). |
| **Trzecia** (bez wpływu na liczby) | Nic się nie zmienia w wynikach ani w zapisach. | Teksty i tłumaczenia, wygląd i układ, dostępność, wydajność, poprawki interfejsu, dokumentacja, testy, refaktoryzacja bez zmiany zachowania. |

## Zasady stosowania

1. Podbicie wyższej cyfry zeruje niższe (3.1.4 → 3.2.0 → 4.0.0).
2. **Jedno podbicie na pakiet zmian** (PR albo scalenie), według najwyższego poziomu wśród zmian; nie po każdym commicie. Podbicie i wpis w `docs/historia-wersji.md` idą w tym samym commicie co zmiana.
3. Wątpliwość między dwoma poziomami: wyższy.
4. Każdy wpis w historii ma linię **„Wpływ na liczby”**: „brak” albo co się zmienia i dla kogo (np. „wyniki Porównywarki przy włączonym wliczaniu osprzętu”). To właśnie ta linia pozwala sprawdzić, czy stary wynik jest nadal aktualny.
5. Wersja silnika kalkulatora (np. `CALCULATOR_VERSION` Porównywarki) jest podbijana tymi samymi regułami dla zmian w tym kalkulatorze. Zmiana silnika na poziomie pierwszej lub drugiej cyfry wymusza co najmniej ten sam poziom w wersji programu.
6. Znacznik builda (skrót commita) nie jest numerem wersji; zmienia się z każdym zbudowaniem, a wersja tylko wtedy, gdy ktoś ją świadomie podbije według powyższych zasad.
7. Test `lib/__tests__/wersja.test.ts` pilnuje, żeby wersja w `package.json` zgadzała się z najnowszym wpisem w `docs/historia-wersji.md`.
