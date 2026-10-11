# Tryb mikroinstalacji — kamper, altana lub domek ROD, garaż (specyfikacja)

**Status:** etap O1 wykonany 09.10.2026; pytania z sekcji 6 rozstrzygnięte 11.10.2026 (sekcja 7); kolejne etapy: O4, O5 (sekcja 5).
**Źródło:** prośba właściciela 09.10.2026 i jego wybór na karcie decyzji: „Rodzaj obiektu” (jedna aplikacja, wybór rodzaju obiektu zmienia dane w całej aplikacji), z dopiskiem „altana lub domek ROD”.

## 1. Problem (audyt stanu z 09.10.2026)

- Pełny proces (Moduły 1–7) liczy budynek: straty ciepła, zużycie z rachunku (M14 „Moje zużycie miesięcznie”), panele z miejscem na dachu i działce.
- Moduł 12 (`kalkulator-mobilny`, 40 ekranów) ma samodzielne kalkulatory kampera i małych zestawów (lista odbiorników, akumulator kampera, panele na dach kampera, dobór regulatora PWM/MPPT, kable i bezpieczniki małej instalacji, Webasto nie jest osobnym ekranem).
- Brakowało **wspólnego wyboru rodzaju obiektu**: ekrany pełnego procesu nie wiedziały, że liczysz kamper albo altanę, więc czytały dane budynku (np. Porównywarka paneli brała zużycie z M14).
- Dane między ekranami przepływają przez nazwane drafty (`useOdczytDraftu`) i `lib/profil-sprzetu`; to ten sam mechanizm, którego użyto tu.

## 2. Model (etap O1, wykonany)

`lib/obiekt/profil-obiektu.ts`, draft `profil-obiektu`:
- `rodzaj`: `budynek | kamper | altana-rod | garaz | ""` (pusty = zachowanie sprzed zmiany, nic nie jest zgadywane);
- `miesiaceUzytkowania`: 12 znaczników od stycznia (altana lub domek ROD i kamper bywają używane tylko część roku);
- `czyMikroinstalacja(rodzaj)`: kamper, altana lub domek ROD, garaż.

Zużycie mikroinstalacji (`lib/obiekt/zuzycie-z-odbiornikow.ts`) = dobowe zużycie listy odbiorników z Modułu 12 (`zuzycie-per-urzadzenie`: moc × czas × współczynnik pracy dla cyklicznych) × liczba dni miesiąca użytkowania; miesiące bez zaznaczenia = 0 kWh. Brak odbiorników, lista niekompletna albo brak zaznaczonych miesięcy = `null` (wtedy ekrany liczą „na sucho”, tak jak przy braku zużycia budynku).

Dni w miesiącach: kalendarz roku zwykłego (luty 28), nie założenie inżynierskie.

## 3. Gdzie wybór działa już teraz (O1)

| Miejsce | Zachowanie |
|---|---|
| Ustawienia → „Rodzaj obiektu” | Wybór rodzaju + miesiące użytkowania (autosave, PL/EN/RU, „?” przy polach). |
| Pulpit: preset „Kamper, altana lub garaż” | Lokalizacja, tryb mobilny, panele, akumulator, okablowanie, bezpieczeństwo; ukrywa ogrzewanie budynku, stress-test, ESP32, AI, montaż baterii, Live. |
| Porównywarka paneli PV | Dla mikroinstalacji zużycie bierze z listy odbiorników i miesięcy użytkowania zamiast z M14; komunikat i link do właściwego ekranu. |

## 4. Czego mikroinstalacja NIE liczy (zgodnie z prośbą właściciela)

Przenikania ciepła i strat budynku. Cele mikroinstalacji to: naładowanie akumulatora, nagrzanie wody latem (grzałka), zasilenie Webasto zimą (pobór elektryczny pompki i wentylatora wpisuje użytkownik z karty — aplikacja nie zakłada wartości), lodówka, oświetlenie.

## 5. Kolejne etapy (propozycja, do decyzji właściciela)

| Etap | Zakres | Zależności |
|---|---|---|
| O2 (**ładowanie akumulatora z regulatora ✅ 11.10.2026**, ekran `ladowanie-z-regulatora`, spec 47 Porównywarki; zostaje tablica 1–4 paneli w samej Porównywarce) | Tablica 1–4 paneli z regulatorem MPPT albo mikroinwerterem w Porównywarce: dopasowanie napięcia/prądu do katalogu urządzeń PV (część 1 gotowa), ładowanie akumulatora (prąd ładowania z regulatora vs pojemność). | A4 Porównywarki; katalog urządzeń; `dobor-regulatora-pwm-mppt`, `akumulator-kampera`. |
| O3 (**✅ 11.10.2026 w interpretacji „odbiorniki sezonowe z miesiącami pracy”, spec 48 Porównywarki — do potwierdzenia przez właściciela**) | Cele zasilania: ładowanie akumulatora, woda latem (grzałka ze zużyciem z listy), Webasto zimą jako odbiornik z danymi z karty. | O1; `grzalka-cwu`, `bojler-cwu`. |
| O4 | Pozostałe ekrany pełnego procesu czytają rodzaj obiektu (zapotrzebowanie, magazyn energii, okablowanie): ukrywanie pól dotyczących budynku, domyślne podpowiedzi 12/24 V. | Audyt ekran po ekranie (ok. 270 ekranów) — dzielić na partie. |
| O5 | Szablony zestawów (kamper, kemping, jacht, domek, warsztat — M12/E3) jako punkt startu listy odbiorników. | M12/E3 `szablony-zestawow`. |

## 6. Pytania do właściciela (rozstrzygnięte 11.10.2026 — patrz sekcja 7)

1. Czy „altana lub domek ROD” ma mieć własny szablon odbiorników (lodówka turystyczna, oświetlenie LED, pompa wody, ładowanie narzędzi), czy wystarczy wspólna lista M12?
2. Czy garaż to osobny rodzaj (pozostawiony), czy scalić z altaną?
3. Napięcie systemu (12/24/48 V) jako część profilu obiektu — wybór raz dla całej mikroinstalacji?

## 7. Decyzje właściciela z 11.10.2026 (odpowiedź na pytania z sekcji 6)

1. **Altana lub domek ROD:** wspólna lista odbiorników Modułu 12 (bez osobnego szablonu), ale **odbiorniki wybiera się osobno dla każdego obiektu** — wersja 3.27.0: pole `obiekty` przy urządzeniu na ekranie „Zużycie energii per urządzenie” (brak = każdy obiekt). Szablony zestawów zostają w O5.
2. **Garaż:** osobny rodzaj obiektu (bez scalania z altaną).
3. **Napięcie systemu:** tak, wybór raz w profilu obiektu — `napiecieUkladuV` (12 / 24 / 48 V, puste do wyboru). Ekrany tylko podpowiadają wartość przyciskiem (`NapiecieZProfilu`), nie wpisują jej same. Podpięte: `akumulator-kampera`, `ladowanie-z-regulatora`, `dobor-regulatora-pwm-mppt`; pozostałe ekrany Modułu 12 z polem napięcia (ok. 30) czekają na kolejne partie — komponent jest gotowy, dodanie to jedna linia na ekran. Lista Porównywarki (`akumV`) zostaje bez podpowiedzi, bo jej wybór jest ograniczony do napięć obsługiwanych przez wybrane urządzenie.
4. **O3 (odbiorniki sezonowe jako zwykłe odbiorniki z miesiącami pracy):** zostaje bez osobnego ekranu „celów zasilania”.

