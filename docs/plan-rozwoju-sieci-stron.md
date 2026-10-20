# Plan rozwoju sieci stron i domen rodziny „Inżynier Pro”

Żywa tablica (uzupełniana w kolejnych sesjach). Dotyczy wszystkich projektów rodziny, nie tylko Offgrid i Szkieletowy; nowe projekty dopisujemy jako kolejne wiersze i kolumny „Projekty”. Decyzje źródłowe: D104 (`rejestr-decyzji.md`, Offgrid) i D205 (`docs/biblia/rejestr-decyzji.md` w repo Szkieletowy).

## Zasady (ustalone z właścicielem)

- Kotwica `.pro` (angielska, wielojęzyczna) jest jedynym miejscem aplikacji, baz, logowania i poczty; wszystkie pozostałe domeny prowadzą tylko ruch do niej.
- Domeny polskie są wyłącznie po polsku. Zestaw „PL-4” na aplikację: jedna strona na domenie głównej, trzy pozostałe to przekierowania 301 ze zachowaniem ścieżki i `utm` (wariant A, wybór właściciela 20.10.2026; można go później zmienić).
- Domeny tematyczne to osobna sieć stron z artykułami, poza PL-4. Każda ma własną treść (nie kopię oferty), jawną informację o właścicielu i kontekstowy link do kotwicy z `utm`. Kupujemy dopiero, gdy istnieje pierwszy artykuł do publikacji (koszt roczny, pilnowanie odnowień). Wartość SEO nowej domeny na starcie zerowa (wiedza ogólna, niezweryfikowana na aktualnych wytycznych).
- Adresy tylko w ASCII, bez „ż”; polskie znaki wyłącznie w treści stron i w druku marki.
- Status rejestru z RDAP (404 = brak wpisu); wiążący jest koszyk rejestratora (cena premium, rezerwacje). Nic poniżej nie jest jeszcze kupione.

## A. Kotwice `.pro` i zabezpieczenia

| Domena | Rola | Projekty | Status 20.10.2026 | Uwagi |
|---|---|---|---|---|
| `offgrid-engineer.pro` | kotwica Offgrid | Offgrid | niezweryfikowany, rozbieżność rejestr/rejestrator | zamiennik: `offgridengineer.pro` (wolna) |
| `timber-frame-engineer.pro` | kotwica Szkieletowy | Szkieletowy | patrz D205 | alternatywy w D205 |
| `inzynierpro.com` | wizytówka rodziny | cała rodzina | wolna 18.10.2026 | dopiero przy ≥2 działających aplikacjach |

## B. Zestaw PL-4 (strona + 301)

| Aplikacja | Główna | Przekierowania 301 | Status |
|---|---|---|---|
| Offgrid | `inzynier-offgrid.pl` | `inżynier-offgrid.pl` (`xn--inynier-offgrid-jkd.pl`), `inzynieroffgrid.pl`, `inżynieroffgrid.pl` (`xn--inynieroffgrid-cdd.pl`) | wolne, niekupione |
| Szkieletowy | `inzynier-szkieletowy.pl` | `inżynier-szkieletowy.pl` (`xn--inynier-szkieletowy-cee.pl`), `inzynierszkieletowy.pl`, `inżynierszkieletowy.pl` (`xn--inynierszkieletowy-45d.pl`) | wolne, niekupione |
| każda kolejna | `inzynier-<nazwa>.pl` | trzy pozostałe kombinacje {ż} × {myślnik} | do dopisania |

## C. Sieć domen tematycznych (artykuły, poradniki, narzędzia)

Wszystkie poniżej wolne w rejestrze 20.10.2026, wybrane przez właściciela, niekupione.

| Domena | Temat / odbiorca | Projekty | Uwagi |
|---|---|---|---|
| `energetyczna-niezaleznosc.pl` | niezależność energetyczna, ogólnie | Offgrid | szeroki temat, wejście dla początkujących |
| `energetycznie-niezalezni.pl` | tożsamość: „energetycznie niezależni” | Offgrid | |
| `wolni-niezalezni.pl` | tożsamość: wolność i niezależność | Offgrid | szerszy styl życia, nie tylko energia |
| `offgridowcy.pl` | nazwa własna społeczności | Offgrid | kandydat na portal/forum |
| `zero-rachunkow.pl` | życie bez rachunków | Offgrid | krótsza wersja `zycie-bez-rachunkow.pl` |
| `zycie-bez-rachunkow.pl` | życie bez rachunków | Offgrid | pokrywa się tematem z `zero-rachunkow.pl` |
| `rachunek-zero.pl` | życie bez rachunków | Offgrid | trzecia wersja tego samego tematu; do rozstrzygnięcia, co z nią zrobić |
| `dom-bez-pradu.pl` | dom bez przyłącza | Offgrid | |
| `dzialka-bez-pradu.pl` | działka bez przyłącza | Offgrid | kupujący działkę, zapytanie konkretne |
| `dom-bez-ogrzewania.pl` | dom pasywny / bez ogrzewania | Offgrid, Szkieletowy | do rozstrzygnięcia, której aplikacji dotyczy |
| `samowystarczalny-dom.pl` | dom samowystarczalny | Offgrid, Szkieletowy | |
| `dom-offgrid.pl` | dom off-grid | Offgrid | |
| `poradnik-offgrid.pl` | poradnik | Offgrid | |
| `kalkulator-offgrid.pl` | kalkulator | Offgrid | wejście wprost do narzędzia |
| `kalkulator-paneli-pv.pl` | dobór paneli PV | Offgrid | pokrywa się z `kalkulator-offgrid.pl` |
| `dobor-paneli-pv.pl` | dobór paneli PV | Offgrid | pokrywa się z poprzednią |
| `panele-pv-poradnik.pl` | poradnik paneli PV | Offgrid | |
| `fotowoltaika-bez-sieci.pl` | fotowoltaika wyspowa | Offgrid | wpisano z „ścięci” jako `sieci` (literówka właściciela) |
| `magazyn-lifepo4.pl` | akumulatory LiFePO4 | Offgrid | |
| `kalkulator-lifepo4.pl` | kalkulator akumulatorów | Offgrid | |
| `lifepo4-poradnik.pl` | poradnik LiFePO4 | Offgrid | |
| `dom-szkieletowy-kalkulator.pl` | kalkulator domu szkieletowego | Szkieletowy | |
| `poradnik-dom-szkieletowy.pl` | poradnik | Szkieletowy | |
| `jak-budowac-dom-szkieletowy.pl` | „jak budować” | Szkieletowy | zapytanie wpisywane wprost |

Tematy z wielu domen o jednym zakresie (rachunki, dobór paneli PV) wymagają decyzji, czy to jedna strona z kilkoma adresami, czy osobne strony z odrębną treścią. Tego nie rozstrzygnięto.

## D. Do uzupełnienia

| Obszar | Projekty | Domeny / pomysły |
|---|---|---|
| Kolejne aplikacje rodziny | (do dopisania) | zestaw PL-4 + kotwica `.pro` + domeny tematyczne |
| Treści sieci | wszystkie | lista artykułów na start każdej domeny, właściciel strony, harmonogram |
| Odrzucone / zajęte | — | `niezaleznoscenergetyczna.pl`, `offgridpolska.pl`, `offgrid-polska.pl`, `domoffgrid.pl`, `ilepaneli.pl`, `poza-siecia.pl`, `samowystarczalni.pl`, `wlasny-prad.pl`, `akumulatory-lifepo4.pl`, `domyszkieletowe.pl`, `budowadomuszkieletowego.pl`, `konstrukcjeszkieletowe.pl`, `budowaszkieletowa.pl`, `szkieletowka.pl`, `konstrukcjadrewniana.pl` |
