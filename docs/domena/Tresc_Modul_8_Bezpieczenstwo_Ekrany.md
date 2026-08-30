# Moduł 8 (Kafel 8): Bezpieczeństwo i sytuacje awaryjne — treść ekranów

**Etap 3 — kontynuacja.** Szósty w pełni opisany moduł treściowy. Ten moduł jest cross-cuttingowy — zbiera funkcje z trzech różnych rozdziałów źródłowych (6, 11, 12). Audyt wzorców zgodny z §21 Zasad UX: hardware i AI dla tego samego fizycznego podsystemu scalone w jeden ekran.

---

## EKRAN 1: Awaryjne źródło ciepła (kominek, koza, piec na drewno)
*(dawne 6.19 — Wzorzec D)*

**A:** typ źródła (kominek/koza/piec), moc, sposób integracji z instalacją grzewczą (Moduł 6).
**B:** integracja z buforem ciepła — źródło spalinowe podgrzewa bufor, stamtąd ciepło rozprowadza się po domu; profil użytkowania (kiedy się pali, ile drewna).
**C:** *"Kominek 8 kW z płaszczem wodnym podłączony do bufora 400l może pokryć 60% zapotrzebowania grzewczego w mroźny dzień, odciążając pompę ciepła."*
**D:** *"Ogień to najstarsze źródło ciepła ludzkości — w off-gridzie wraca jako sensowna rezerwa, o ile jest bezpiecznie zintegrowany z resztą systemu, nie stoi obok niego osobno."*

---

## EKRAN 2: Bezpieczeństwo pożarowe przy dogrzewaniu paliwem stałym
*(dawne 6.25 — Wzorzec D)*

**A:** typ paliwa (drewno/pellet/węgiel), lokalizacja komina, odległości od materiałów palnych, obecność czujnika CO.
**B:** sprawdzenie minimalnych odległości bezpieczeństwa, wymaganej wentylacji nawiewnej dla spalania, obecności wymaganych czujników (dym, CO, ciepło).
**C:** *"Piec na drewno wymaga minimum 40 cm odstępu od materiałów palnych i osobnego nawiewu powietrza do spalania — bez tego ryzyko niedotlenienia i cofki spalin."*
🔴 brak czujnika czadu (CO) w pomieszczeniu z otwartym źródłem spalania — to jest zagrożenie życia, nie tylko mienia.
**D:** *"Otwarty ogień w domu to realna odpowiedzialność — spalanie zużywa tlen z pomieszczenia i produkuje czad, który nie ma zapachu i zabija we śnie."*

---

## EKRAN 3: Siłowniki drzwi i zamki elektromagnetyczne
*(dawne 11.51 — Wzorzec D)*

**A:** typ drzwi ewakuacyjnych, typ zamka (elektromagnetyczny/elektrozaczep), obecność zasilania awaryjnego.
**B:** w normalnym trybie drzwi zamknięte; po wykryciu pożaru lub naciśnięciu przycisku ewakuacyjnego ESP32 odłącza napięcie z zamka, zwalniając blokadę — kontaktron potwierdza stan otwarcia.
**C:** *"Drzwi wejściowe: zwolnione. Droga ewakuacyjna otwarta."*
🔴 zamek elektromagnetyczny bez zasilania awaryjnego — przy zaniku prądu drzwi mogą pozostać zablokowane, jeśli logika zwalniania nie jest zaprojektowana na "fail-safe" (odblokuj przy braku prądu, nie odwrotnie).
**D:** *"W pożarze nie może być zablokowanych drzwi — dobra zasada projektowa to 'fail-safe': brak prądu = drzwi otwarte, nigdy odwrotnie."*

---

## EKRAN 4: Moduł gaśniczy / elektrozawór gazu — sprzęt i logika AI
*(scala dawne: 11.52 + 12.51 — Wzorzec D)*

### Sekcja A
typ środka gaśniczego (gaz obojętny/mgła wodna/aerozol), konfiguracja stref gaśniczych, liczba czujników wymaganych do potwierdzenia alarmu.

### Sekcja B — sprzęt i logika AI dla tego samego systemu
1. **Sterowanie fizyczne** (dawne 11.52): elektrozawór/moduł inicjujący uruchamia się dopiero po potwierdzeniu alarmu (np. dwa niezależne czujniki, żeby uniknąć fałszywego zadziałania); jednoczesne odłączenie wentylacji i zamknięcie klap, żeby środek gaśniczy nie uciekł.
2. **Dowódca akcji AI** (dawne 12.51): po wykryciu pożaru AI realizuje sekwencję w ściśle określonej kolejności: (1) odłącza zasilanie PV/baterii w zagrożonej strefie, (2) wyłącza wentylację i zamyka klapy, (3) zwalnia zamki drzwi ewakuacyjnych, (4) uruchamia oświetlenie ewakuacyjne, (5) odłącza zbędne obwody, (6) uruchamia gaszenie.

### Sekcja C
*"Pożar w strefie baterii. Odłączono zasilanie, zwolniono drzwi, uruchomiono oświetlenie ewakuacyjne. Akcja gaśnicza: aktywna. Ewakuuj się najbliższym wyjściem."*
🔴 *"Moduł gaśniczy: rozładowany — wymień."* (status krytyczny, system musi to sygnalizować proaktywnie, nie tylko podczas pożaru)

### Sekcja D
*"Człowiek może nie zdążyć pomyśleć we właściwej kolejności podczas pożaru — AI działa jak dowódca straży pożarnej, realizując sprawdzoną sekwencję kroków w ciągu sekund."*

**Przypomnienie krytyczne (z Modułu 4):** dla baterii LiFePO4 proszek gaśniczy i CO2 **nie gaszą** wewnętrznej reakcji chemicznej ogniwa — wymagany jest agregat wodny/mgłowy lub specjalny środek do magazynów energii. Dobór środka gaśniczego w Sekcji A musi to uwzględniać dla strefy baterii.

---

## EKRAN 5: Wejścia dla centrali sygnalizacji pożaru
*(dawne 11.53 — Wzorzec D)*

**A:** typ interfejsu z centralą (styki bezpotencjałowe/RS485), lista podłączonych czujek.
**B:** ESP32 jako moduł rozszerzeń centrali — odbiera sygnały alarmu/awarii/rozbrojenia, umożliwia zdalne potwierdzenie alarmu, loguje wszystkie zdarzenia.
**C:** *"Centrala SSP: alarm w strefie 2 (bateria)."*
🔴 *"Awaria centrali pożarowej — sprawdź zasilanie."* (status awarii samej centrali musi być traktowany priorytetowo)
**D:** *"Centrala pożarowa to serce ochrony przeciwpożarowej — ESP32 musi z nią 'rozmawiać' bez zakłóceń, bo to od niej zależy, czy reszta systemu w ogóle się dowie o zagrożeniu."*

---

## EKRAN 6: UPS krytyczny — sprzęt i zarządzanie AI
*(scala dawne: 11.54 + 12.54 — Wzorzec D)*

### Sekcja A
lista urządzeń krytycznych do podtrzymania (ESP32, router, siłowniki, centrala pożarowa, oświetlenie awaryjne), ich łączny pobór mocy, wymagany czas podtrzymania.

### Sekcja B — dwie warstwy
1. **Dobór sprzętowy** (dawne 11.54): dobór modułu UPS/przetwornicy z akumulatorem podtrzymującym pod sumaryczny pobór wszystkich urządzeń krytycznych.
2. **Zarządzanie priorytetami AI** (dawne 12.54): przy zbliżającym się rozładowaniu UPS, AI ogranicza zasilanie mniej ważnych obwodów krytycznych wg priorytetu — najpierw centrala pożarowa i ESP32, potem router, na końcu siłowniki.

### Sekcja C
*"UPS aktywny. Czas podtrzymania: 45 minut."*
*"UPS rozładuje się za 10 minut. Wyłączono zasilanie siłowników, żeby centrala pożarowa i ESP32 działały jak najdłużej."*
🔴 stan "akumulator UPS słaby" zignorowany — przy realnej awarii systemu podtrzymanie może nie zadziałać wcale.

### Sekcja D
*"W pożarze często pada normalne zasilanie — UPS daje systemowi te kluczowe minuty na wykonanie sekwencji bezpieczeństwa z Ekranu 4, zamiast zamilknąć w najgorszym momencie."*

---

## EKRAN 7: Oświetlenie awaryjne — sprzęt i adaptacyjna ewakuacja AI
*(scala dawne: 11.55 + 12.52 — Wzorzec D)*

### Sekcja A
konfiguracja lamp awaryjnych (zasilanie z UPS lub własne akumulatory), mapa dróg ewakuacyjnych budynku (Moduł 1), lokalizacja czujników pożaru/dymu.

### Sekcja B — sprzęt i inteligentne prowadzenie
1. **Sterowanie fizyczne** (dawne 11.55): po alarmie zapala światło wzdłuż dróg wyjścia + oświetlenie zewnętrzne dla służb; okresowe testy lamp.
2. **Adaptacyjna trasa AI** (dawne 12.52): AI wyznacza najbezpieczniejszą drogę ewakuacji biorąc pod uwagę lokalizację pożaru i kierunek rozprzestrzeniania dymu; jeśli jedna droga zostanie odcięta, natychmiast wyznacza alternatywną i przełącza oświetlenie na nową trasę.

### Sekcja C
*"Droga ewakuacyjna: korytarz → wyjście boczne. Oświetlenie naprowadzające włączone."*
*"Główna droga zablokowana. Wyznaczono trasę zapasową przez garaż."*
🔴 *"Lampa awaryjna #3 nie działa — sprawdź."* (awaria elementu na trasie ewakuacji musi być widoczna zanim będzie potrzebna)

### Sekcja D
*"W dymie nie widać drogi, a zwykłe oświetlenie ewakuacyjne świeci zawsze tą samą trasą, nawet jeśli akurat tamtędy idzie ogień — adaptacyjne prowadzenie reaguje na to, gdzie realnie jest bezpiecznie, nie gdzie 'zwykle' jest wyjście."*

---

## EKRAN 8: Klapy pożarowe i wentylacja — sprzęt i kontrola AI
*(scala dawne: 11.56 + 12.56 — Wzorzec D)*

### Sekcja A
konfiguracja klap odcinających w kanałach wentylacyjnych, obecność wentylacji oddymiającej, integracja z rekuperacją (Moduł 6).

### Sekcja B — sprzęt i logika AI
1. **Sterowanie fizyczne** (dawne 11.56): zamyka klapy odcinające po wykryciu pożaru, wyłącza rekuperację (żeby nie tłoczyć dymu po domu), uruchamia wentylację oddymiającą w strefie zagrożonej.
2. **Kontrola AI** (dawne 12.56): ta sama logika sterowana inteligentnie — po ugaszeniu pożaru AI automatycznie przewietrza budynek i resetuje klapy do stanu normalnego.

### Sekcja C
*"Zamknięto klapy pożarowe, wyłączono rekuperację, uruchomiono oddymianie strefy 2."*
*"Pożar ugaszony. Rozpoczynam przewietrzanie budynku."*

### Sekcja D
*"Dym zabija szybciej niż ogień — trzeba go zatrzymać, żeby się nie rozprzestrzenił, a potem sprawnie usunąć, żeby dało się bezpiecznie wrócić."*

---

## EKRAN 9: Predykcja ryzyka pożaru i zwarcia łukowego
*(dawne 12.53 — Wzorzec D; wchłania też duplikat 12.23 z Modułu 10)*

**A:** parametry instalacji na żywo (temperatura połączeń, rezystancja, prądy, napięcia, harmoniczne — z widżetów Modułu 13), dane z czujników dymu/gazów/wilgotności/pyłu, historia zdarzeń.
**B:** model AI ocenia ryzyko zwarcia łukowego, przegrzania styków, uszkodzenia izolacji na podstawie wczesnych oznak (iskrzenie, nagrzewanie, luźne połączenia wykryte przez czujniki termiczne — cross-ref Moduł 5, Ekran 3).
**C:** *"Ryzyko pożaru w rozdzielni: 75% w ciągu 30 dni. Wykryto luźne połączenie na szynie głównej. Dokręć śruby i sprawdź termowizyjnie szynę."*
**D:** *"AI 'czuje', że coś się przegrzewa, zanim buchnie ogniem — to predykcja, nie tylko reakcja na alarm, który włącza się dopiero gdy jest już źle."*

---

## EKRAN 10: Integracja z syreną, monitoringiem i służbami
*(dawne 12.55 — Wzorzec D)*

**A:** konfiguracja powiadomień i kontaktów alarmowych, obecność kamer monitoringu, zgoda użytkownika na automatyczne wzywanie służb.
**B:** po wykryciu krytycznego zagrożenia: uruchomienie syreny/sygnalizatora, włączenie i zapis z kamer, wysłanie powiadomień (użytkownik/rodzina/ochrona), w skrajnych przypadkach automatyczne wezwanie służb ratunkowych — **tylko za wcześniejszą, wyraźną zgodą użytkownika**.
**C:** *"Pożar potwierdzony. Wysłano powiadomienie do użytkownika i służb. Syrena aktywna. Monitoring: nagrywanie aktywne."*
**D:** *"AI nie tylko wykrywa zagrożenie, ale też może wezwać pomoc — to ostatnia deska ratunku, gdy nikogo nie ma w domu, żeby zadzwonić samemu."*

---

## EKRAN 11: Autonomiczny audyt bezpieczeństwa pożarowego — RAPORT
*(dawne 12.57 — Wzorzec G)*

Ekran cykliczny, generowany automatycznie, nie wymaga akcji użytkownika poza reagowaniem na wykryte braki.

**Sprawdzane elementy:** działanie czujników dymu, obecność i sprawność gaśnic, drożność dróg ewakuacyjnych, poprawna reakcja klap pożarowych, historia testów i przeglądów.
**Przykład:** *"Audyt bezpieczeństwa: 92% gotowości. Braki: gaśnica w kuchni wymaga wymiany. Czujnik dymu w sypialni nie odpowiada — sprawdź baterię."*
**D:** *"AI regularnie sprawdza, czy w razie pożaru wszystko zadziała tak, jak powinno — żeby nie odkryć zepsutego czujnika dopiero w trakcie prawdziwego pożaru."*

---

## Załącznik: Tabela pułapek inżynierskich (z oryginalnej Biblii v1.5)

Ta tabela z oryginalnego dokumentu (Załącznik A) to w praktyce zbiorcza lista twardych stopów i ostrzeżeń z całej aplikacji, warto ją zachować jako punkt odniesienia przy implementacji — każdy wiersz odpowiada konkretnemu ekranowi w modułach 3-7:

| Pułapka | Skutek | Gdzie w aplikacji jest zaadresowana |
|---|---|---|
| Zbyt cienkie kable DC | Straty, ryzyko pożaru | Moduł 5, Ekran 1 |
| Napięcie Voc przy mrozie | Uszkodzenie MPPT | Moduł 3, Ekran 5/14 |
| Mikropęknięcia termiczne | Spadek mocy po 2 latach | Moduł 3, Ekran 7 |
| Brak wentylacji pod panelami | Spadek mocy 18% latem | Moduł 3, Ekran 10 |
| Pominięcie cos φ | Falownik wyłącza się mimo poprawnych W | Moduł 2 |
| Pominięcie prądów rozruchowych | Falownik przeciążany przy starcie | Moduł 5, Ekran 7 |
| Brak mat grzewczych BMS | Blokada ładowania przy mrozie | Moduł 4, Ekran 5 |
| Wampiry energetyczne | Ciągły pobór standby | Moduł 2 (moduł zbiorczy) |
| Łączenie Cu-Al bez złączki | Korozja galwaniczna, przegrzanie | Moduł 5, Ekran 4 |
| Brak SPD | Przepięcie niszczy elektronikę | Moduł 5, Ekran 2 |
| Brak monitoringu izolacji (IT) | Niewykryte doziemienie, pożar | Moduł 5, Ekran 18 |
| Brak selektywności | Zwarcie wyłącza cały system | Moduł 5, Ekran 13 |
| Brak pre-charge | Iskrzenie, uszkodzenie styków | Moduł 4, Ekran 7 |
| Brak testów powykonawczych | Ukryte wady, ryzyko pożaru | Moduł 5, Ekran 29 |

**Rekomendacja:** ta tabela powinna zostać zaimplementowana jako osobny, przeszukiwalny "Rejestr twardych stopów" w Kaflu 14 (Ustawienia), agregujący wszystkie 🔴 ze wszystkich modułów w jednym miejscu — pomocne przy audycie bezpieczeństwa całej instalacji na koniec projektowania.

---

## Podsumowanie modułu

**11 ekranów**, pokrywających 15 pierwotnych funkcji (4 pary sprzęt+AI scalone w jeden ekran każda, plus wchłonięty duplikat 12.23 z Modułu 10).

**Twarde stopy zidentyfikowane w tym module:** brak czujnika CO przy otwartym źródle spalania (Ekran 2 — zagrożenie życia), zamek drzwi ewakuacyjnych bez logiki fail-safe (Ekran 3), niewłaściwy środek gaśniczy dla baterii LiFePO4 (Ekran 4), zignorowany status "UPS słaby" (Ekran 6), niesprawny element na trasie ewakuacyjnej niewykryty przed sytuacją kryzysową (Ekran 7, 11).

---

**Wersja:** 1.0 — pełna treść Modułu 8 (Etap 3)
**Data:** Sierpień 2026
**Status:** Wszystkie 11 ekranów gotowe do przekazania deweloperowi.
**Powiązane dokumenty:** Biblia_Offgrid_v2_0_Architektura_Modulowa.md, Zasady_UX_Doradca_v2_1.md, Tresc_Modul_5_Okablowanie_Ekrany.md, Tresc_Modul_3_PV_Ekrany.md, Tresc_Modul_4_Baterie_Ekrany.md, Tresc_Modul_6_Ogrzewanie_Ekrany.md, Tresc_Modul_7_StressTest_Ekrany.md
