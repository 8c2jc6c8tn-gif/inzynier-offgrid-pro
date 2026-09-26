# Indeks — Poradnik PN-EN 12831 (Purmo), Nowa metoda obliczania projektowego obciążenia cieplnego

Źródło: `79967189-Poradnik-Purmo-Nowa-Metoda-Obliczania-12831-01-2012.pdf` (Michał Strzeszewski,
Piotr Wereszczyński, wyd. Purmo, Warszawa 2009, wersja poradnika 1.10, 87 stron). **To nie jest
sama norma PN-EN 12831** — to komercyjny/branżowy poradnik metodyczny wydawcy grzejników,
z zastrzeżeniem autorów wprost w tekście: *"poradnik nie zastępuje Polskiej Normy i nie może
służyć jako podstawa prowadzenia obliczeń projektowych"* — traktować jako materiał pomocniczy do
zrozumienia metody, nie jako normatywne źródło współczynników prawnie wiążących.

Dokument tekstowy natywnie (nie skan) — ekstrakcja bezpośrednia, bez OCR, wysoka wiarygodność
warstwy tekstowej. Treść surowa (kolejność akapitów z PDF, bez ręcznego formatowania na rozdziały):
[`01-tresc-surowa.txt`](01-tresc-surowa.txt) — 87 stron, ~154 tys. znaków.

## Zawartość (wg spisu treści w pliku)

Metodyka obliczania projektowego obciążenia cieplnego pomieszczeń/budynków wg PN-EN 12831 —
różnice względem starszej PN-B-03406:1994, straty ciepła przez przenikanie (współczynniki H_T),
straty na wentylację (H_V), moc na dogrzanie po przerwie (nastawa nocna), przykłady liczbowe
krok po kroku.

## Trafność w domenie off-grid PV

Bezpośrednio istotne dla **Modułu 6 (Ogrzewanie)** — projekt off-grid musi znać zapotrzebowanie
cieplne budynku, żeby dobrać źródło ogrzewania i policzyć bilans energetyczny zimą (Moduł 7,
stress-test zimowy). Obecnie w `lib/core/modules/` **nic jeszcze nie implementuje** pełnej metody
PN-EN 12831 (współczynniki H_T/H_V per przegroda) — sprawdź `docs/rejestr-pokrycia.md` przed użyciem.

## Status wykorzystania

Przeanalizowany (ekstrakcja tekstu), **niewykorzystany jeszcze w kodzie**. Przed użyciem
jakiegokolwiek współczynnika w kalkulatorze — zweryfikować względem oryginalnej normy PN-EN 12831
(ten poradnik to interpretacja wydawcy, nie tekst normatywny), zgodnie z zasadą "nie zgaduj
brakujących norm" z CLAUDE.md.

## Weryfikacja ekstrakcji (25.09.2026)

- **Tekst i tabele — poprawne** (warstwa tekstowa PDF, bez OCR; tabele sprawdzone wyrywkowo z renderem,
  m.in. Tabela 2.1 temperatur projektowych −16/−18/−20/−22/−24 °C — zgodna z PN-82/B-02403 Tablica 1,
  Tabela 6.4 nmin).
- **Wszystkie 39 wzorów numerowanych rozsypały się** w `01-tresc-surowa.txt` na luźne znaki (wzory w PDF
  złożone z pojedynczych znaków rozrzuconych po pozycjach). **Odczytane i zweryfikowane w
  [`02-wzory-zweryfikowane.md`](02-wzory-zweryfikowane.md)** (dane PDF + kontrola wizualna); w
  `01-tresc-surowa.txt` przy każdej etykiecie wzoru dopisano linię `[WZÓR (x.y) — odczyt zweryfikowany …]`.
- **Pułapka:** font Symbol w tym PDF wyświetla „+” niekompletnie (wygląda jak „−”) — przy przepisywaniu
  z podglądu wzory (3.1), (7.6), (9.1) wychodzą ze złym znakiem. Rozstrzygają dane PDF — opis w `02-…`.
- **Rozbieżność wersji (nie rozstrzygnięta):** poradnik (2009) opisuje **PN-EN 12831:2006**;
  `docs/normy-brakujace.md` wymienia aktualną **PN-EN 12831-1:2017**. Metoda obciążenia cieplnego
  (ΦHL = ΦT + ΦV + ΦRH) ta sama co do zasady, szczegóły (współczynniki, tablice NA) mogą się różnić — przy
  budowie kalkulatora oznaczyć jako założenie.
