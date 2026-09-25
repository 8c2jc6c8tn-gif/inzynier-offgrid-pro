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
