# Wspólna paczka środowiskowa — narzędzia konsumenta (19.13)

Źródło decyzji: właściciel repo, 07.10.2026 — jedna metoda dla obecnych i przyszłych projektów; wszystkie dostają ten sam plik tym samym kanałem, żadna aplikacja nie ma własnego formatu ani własnej bazy.

## Co tu jest

| Plik | Rola | Edycja w projekcie |
|---|---|---|
| [`pobierz-dane-srodowiskowe.mjs`](pobierz-dane-srodowiskowe.mjs) | pobiera paczkę z GitHub Release repo `dane-srodowiskowe`, sprawdza SHA-256, zapisuje do `vendor/dane-srodowiskowe/`, przypina wersję w locku; bez argumentów tylko weryfikuje kopię (bez sieci) | tylko stała `REPO` |
| [`generuj-modul.mjs`](generuj-modul.mjs) | z paczki i `meteo.konsument.json` generuje moduł TS (`wyjscie`); błąd przy nieznanym polu/lokalizacji/źródle/schemacie | nie |
| [`meteo.konsument.json`](meteo.konsument.json) | **jedyne miejsce, w którym aplikacje się różnią**: które lokalizacje, źródła, pola klimatu i opadów, czy strefy normowe | tak — to deklaracja projektu |
| [`dane-srodowiskowe.lock.json`](dane-srodowiskowe.lock.json) | przypięta wersja i SHA-256 (przykład: 0.1.0) | tylko przez `--zaktualizuj` |

## Wdrożenie w nowym projekcie (4 kroki)

1. Skopiuj oba `.mjs` do `scripts/` projektu, `meteo.konsument.json` do korzenia; ustaw `wyjscie`.
2. Token tylko-do-odczytu repo `dane-srodowiskowe` jako sekret CI i w środowisku sesji: `DANE_SRODOWISKOWE_TOKEN`.
3. `node scripts/pobierz-dane-srodowiskowe.mjs --zaktualizuj <wersja>` → commit `vendor/` i locka. Potem `node scripts/generuj-modul.mjs` → commit wygenerowanego modułu.
4. W CI: `node scripts/pobierz-dane-srodowiskowe.mjs` (bez argumentów; pada, gdy `vendor/` nie zgadza się z lockiem) i test zgodności modułu z wydaniem (19.11).

## Co sprawdzono (07.10.2026)

Na prawdziwej paczce 0.1.0 (build lokalny z repo danych, `--zrodlo-lokalne`): pobranie z weryfikacją sum, ponowne uruchomienie bez zmian, wykrycie podmienionego pliku w `vendor/`, odmowa przy nieznanym polu, odmowa przy locku z inną sumą (bez zapisu na dysk), wygenerowany moduł przechodzi `tsc --strict`. **Nie sprawdzono na żywym GitHubie** (ścieżka HTTP: Release API dla prywatnego repo + pobranie assetu) — pierwszy tag wydania w repo danych jest jej testem; do tego czasu `--zrodlo-lokalne` jest pewną ścieżką.

## Ograniczenia

- Przykład generuje najprostszy kształt modułu (dane jako literały, typy pól z deklaracji). Projekt może rozszerzyć generator (np. własne helpery), ale **nie wolno** zmieniać formatu pobieranej paczki ani jej kanału (19.13 pkt 5).
- `STREFY_NORMOWE` przepuszcza `normy` jako `unknown` — typowanie do wypełnienia przy pierwszym konsumencie, który ich używa.
