# Moduł 3 (Kafel 3): Instalacja PV — treść ekranów

**Etap 3 — kontynuacja.** Drugi w pełni opisany moduł treściowy. Wszystkie wzory, progi i przykłady liczbowe pochodzą z oryginalnego dokumentu źródłowego (Biblia Off-Grid PV v1.5) — żaden nie jest wymyślony na potrzeby tego dokumentu. Struktura zgodna z §3 Zasad UX (Sekcja A/B/C/D), audyt wzorców zgodny z §17.

---

## Ekrany infrastrukturalne (nie są samodzielnymi "Doradcami")

### INFRA-1: Baza modeli paneli PV
*(dawne 2.1)*

To jest fizyczna implementacja bazy komponentów z §15.2 Zasad UX — współdzielony komponent używany przez wszystkie ekrany tego i innych modułów, nie osobny ekran PV.

**Dane przechowywane per panel:** producent, model, Pmax (W), Voc (V), Isc (A), Vmp (V), Imp (A), współczynnik temperaturowy mocy γ (%/°C, typowo −0,3 do −0,45), współczynnik temperaturowy Voc β (%/°C, typowo −0,29 do −0,32), wymiary fizyczne, waga, technologia (PERC/TOPCon/HJT/cienkowarstwowe), certyfikaty.
**Walidacja przy trybie custom (ręczne wpisanie):** Vmp musi być < Voc, Imp musi być < Isc — jeśli nie, blokada zapisu z komunikatem błędu.
**Powiązanie:** każdy ekran w tym dokumencie, który odwołuje się do "danych panelu", czyta z tej bazy (albo z profilu sprzętu użytkownika, §10 Zasad UX, jeśli już wybrał konkretny model).

### INFRA-2: Dane nasłonecznienia (PVGIS/PVWatts)
*(dawne 2.2)*

Zasila Moduł 1 (Lokalizacja) i silnik symulacji rocznej z §15.1.

**Logika:** jednorazowe zapytanie API do PVGIS lub PVWatts przy tworzeniu projektu (gdy jest internet) — zwraca miesięczne wartości promieniowania całkowitego (kWh/m²) i temperatur dla danej lokalizacji. Dane zapisywane lokalnie (JSON), żeby aplikacja działała offline po pierwszym pobraniu. Użytkownik może nadpisać ręcznie.
**Komunikat po pobraniu:** *"Dane pobrane pomyślnie — możesz teraz pracować offline."*
**Koszt:** API PVGIS i PVWatts są darmowe.

---

## EKRAN 1: Kąt pochylenia i azymut
*(dawne 2.3 — Wzorzec D, suwaki interaktywne)*

### Sekcja A — Twoje dane
| Pole | Zakres | Podpowiedź `?` |
|---|---|---|
| Kąt pochylenia | 0–90° | "0° = panel leży płasko, 90° = panel stoi pionowo (ściana/ogrodzenie)." |
| Azymut | 0–360° | "Kierunek, w który patrzy panel: 180° = południe (najlepsze), 90° = wschód, 270° = zachód." |

Dla wybranej wcześniej połaci budynku (Ekran 2) system podpowiada aktualne wartości automatycznie.

### Sekcja B — Silnik oceny
Na podstawie danych PVGIS (INFRA-2) algorytm liczy produkcję miesięczną dla wybranego kąta/azymutu w czasie rzeczywistym, gdy user przesuwa suwak.

### Sekcja C — Rekomendacja
Wykres słupkowy 12 miesięcy, aktualizowany na żywo przy przesuwaniu suwaka. Pod wykresem: *"Roczna produkcja: 4200 kWh."*

### Sekcja D — Migawka
*"Kąt i kierunek panelu decydują, ile słońca złapie w ciągu roku — to jak ustawienie parasola tak, żeby łapał jak najwięcej deszczu, tylko na odwrót: chcemy złapać jak najwięcej słońca."*

---

## EKRAN 2: Typ montażu
*(scala dawne: 2.4, 2.5, 2.6, 2.7, 2.9 — Wzorzec A, przełącznik trybu)*

Pięć wariantów montażu to warianty tego samego pytania "gdzie i jak stoją panele" — jeden ekran z przełącznikiem, każdy tryb ma własne pola i własną logikę oceny.

### Tryb "Pionowy" (dawne 2.4)
**A:** wysokość paneli nad gruntem (m), wysokość trawy/zasp śniegu w okolicy (cm).
**B:** zimą słońce świeci nisko — pionowe panele mają lepszy kąt padania niż latem, co częściowo kompensuje krótsze dni. System liczy bilans: strata latem vs zysk zimą.
**C:** *"Montaż pionowy — strata latem 22%, zysk zimą 35%, rocznie o 5% więcej energii niż dach skośny."*
🟡 przy zaspie/trawie >30 cm: *"Dolne ogniwa będą zacienione — strata ok. 8%."*

### Tryb "Dach płaski / grunt" (dawne 2.5)
**A:** wymiary powierzchni, wysokość nad terenem, kąt nachylenia stelaża.
**B:** wysokość podniesienia górnej krawędzi: `h = L × sin(α)`. Siła naporu wiatru (pełny wzór i silnik → Ekran 6, Aerodynamika). Ryzyko zalegania śniegu rośnie przy kątach <30°.
**C:** *"Kąt 35° → podniesienie 1,2 m, napór wiatru 450 kg/moduł, wymagany balast 80 kg."*
🔴 przy kącie ~45° na gruncie: *"Siła ssania od spodu może zerwać panele — skonsultuj z konstruktorem."*

### Tryb "Dach skośny" (dawne 2.6)
**A:** wybór połaci z modelu 3D budynku (z Modułu 1) — kąt i azymut odczytywane automatycznie.
**C:** *"Połać południowo-zachodnia, kąt 38°, azymut 210° — roczny uzysk 4,8 MWh."*

### Tryb "Wielopołaciowy" (dawne 2.7)
**A:** lista wszystkich dostępnych powierzchni (dach, ściany, ogrodzenia) z checkboxami.
**B:** dla każdej powierzchni osobno liczona roczna produkcja i % efektywności względem optymalnej orientacji.
**C:** lista z sumą na żywo: *"Dach południowy: 4200 kWh (92%). Ogrodzenie wschodnie: 1800 kWh (42%)."*

### Tryb "Wiata/carport" (dawne 2.9)
**A:** wymiary prostokątnej powierzchni (dł. × szer.).
**B:** algorytm optymalnego pakowania paneli na powierzchni (bin packing); minimalny kąt 5-10° dla samooczyszczania.
**C:** *"Na wiacie 6×4 m zmieścisz 8 paneli (układ 4×2) — uzysk 3,2 kWp."*

### Migawka (wspólna dla wszystkich trybów)
*"Nie ma jednego 'najlepszego' montażu — jest najlepszy montaż dla Twojej konkretnej działki i dachu. Ten ekran pokazuje Ci realne liczby dla każdej opcji, nie ogólniki."*

---

## EKRAN 3: Tracker vs konstrukcja stała
*(dawne 2.8 — Wzorzec B, porównanie)*

**A:** liczba paneli w obu wariantach, koszt trackera (mechanizm+fundament), koszt dodatkowych paneli na stałym stelażu.
**B:** tracker zwiększa uzysk o 30-40%, ale generuje dużo większy napór wiatru (wymaga solidniejszego fundamentu).

| Parametr | Tracker (9 paneli) | Stały stelaż (15 paneli) |
|---|---|---|
| Koszt | +6000 zł | tyle samo |
| Uzysk roczny | 5200 kWh | 6800 kWh |
| Napór wiatru | 1800 kg | 450 kg |

**C:** *"Za cenę trackera możesz dokupić 6 paneli — uzysk o 30% większy, a ryzyko zerwania dużo mniejsze."*
**D:** *"Tracker brzmi zaawansowanie, ale w praktyce często taniej i bezpieczniej wyjdzie po prostu dokupić więcej paneli na stałym stelażu."*

---

## EKRAN 4: Symulacja liczby paneli (3 warianty)
*(dawne 2.10 — Wzorzec B)*

**A:** całkowite zapotrzebowanie dobowe (auto z Modułu 2).
**B:** trzy warianty liczone automatycznie: *Minimum* (pokrycie tylko miesięcy letnich), *Optymalnie* (cały rok z wiosną/jesienią), *Z zapasem* (najgorszy miesiąc zimowy).
**C:** trzy kafelki do wyboru:
- Minimum: 12 paneli, 4,2 kWp, 22 m²
- Optymalnie: 16 paneli, 5,6 kWp, 30 m²
- Z zapasem: 22 panele, 7,7 kWp, 41 m²

**D:** *"Im więcej paneli 'na zapas', tym mniej będziesz się martwić w grudniu — ale to też więcej miejsca i pieniędzy na start. Wybierz świadomie, nie automatycznie największy wariant."*

---

## EKRAN 5: Zimowy stress-test napięciowy MPPT (Voc max)
*(dawne 2.11 — Wzorzec D)*

### Sekcja A
| Pole | Jednostka | Podpowiedź `?` |
|---|---|---|
| Voc panelu (w warunkach STC, 25°C) | V | "Napięcie obwodu otwartego — z karty katalogowej panelu lub bazy komponentów." |
| Współczynnik temperaturowy Voc (β) | %/°C | "Ile procent Voc przybywa na każdy stopień poniżej 25°C — typowo −0,29 do −0,32%/°C (wartość ujemna oznacza, że Voc ROŚNIE przy spadku temperatury)." |
| Minimalna temperatura w lokalizacji (Tmin) | °C | *auto z Modułu 1* |
| Liczba paneli w stringu | szt. | z Ekranu konfiguratora stringów |
| Max napięcie wejściowe MPPT/falownika | V | "Z karty katalogowej falownika — przekroczenie tej wartości może trwale uszkodzić wejście DC." |

### Sekcja B — Silnik oceny
`Vmax = Voc × (1 + β × (Tmin − 25))`
`V_string = Vmax × liczba_paneli`
Werdykt: 🔴 jeśli `V_string > limit MPPT`; 🟡 jeśli `V_string > 0,95 × limit`; 🟢 w pozostałych przypadkach.

### Sekcja C — Rekomendacja
*"Przy −25°C napięcie stringu 8 paneli wyniesie 520 V — Twój MPPT ma limit 450 V! Zmień układ na 2 stringi po 4 panele."*

### Sekcja D — Migawka
*"Panele PV zachowują się odwrotnie niż można by się spodziewać — im zimniej, tym WYŻSZE napięcie dają na biegu jałowym. Mroźny, słoneczny poranek to najbardziej niebezpieczny moment dla falownika, nie upalne lato."*

**To jest jeden z najważniejszych twardych stopów w całej aplikacji — przekroczenie tego limitu to gwarantowane uszkodzenie sprzętu, nie tylko "ryzyko".**

---

## EKRAN 6: Aerodynamika — napór wiatru i ssanie
*(dawne 2.12 — Wzorzec D)*

### Sekcja A
strefa wiatrowa/prędkość referencyjna v (auto z Modułu 1), wysokość montażu, kąt nachylenia, powierzchnia panelu.

### Sekcja B
`F_napór = 0,5 × ρ × v² × A × Cd` (Cd dla paneli: 1,2–1,5; ρ powietrza ≈ 1,225 kg/m³)
Dodatkowo liczona jest **siła ssania od spodu** (efekt skrzydła) — szczególnie groźna dla paneli naziemnych/wiat. System liczy moment wywracający i wymagany balast.

### Sekcja C
*"Przy wietrze 120 km/h na każdy panel działa siła 350 N do przodu i 280 N do góry — zastosuj balast 60 kg na moduł."*

### Sekcja D
*"Panel działa trochę jak żagiel — wiatr może go pchać, ale też może pod niego 'zajrzeć' i ciągnąć do góry jak skrzydło samolotu. Balast chroni przed obydwoma efektami naraz."*
🔴 brak wystarczającego balastu/kotwienia przy obliczonej sile.

---

## EKRAN 7: Mikropęknięcia termiczne
*(dawne 2.13 — Wzorzec C)*

Wyjaśnienie zjawiska: panele nagrzewają się do 65-70°C, a przy nagłym deszczu chłodzą się o 30°C w kilka minut — przy sztywnym montażu bez dylatacji aluminium i krzem rozszerzają się inaczej, co prowadzi do mikropęknięć w ciągu ok. 2 lat.
**Rekomendacja:** podkładki EPDM, odstępy dylatacyjne min. 5 mm.
**D:** *"Materiały 'oddychają' przy zmianach temperatury inaczej — trzeba im dać trochę luzu, inaczej pękają od środka, niewidocznie."*

---

## EKRAN 8: Straty na okablowaniu DC (efekt Joule'a)
*(dawne 2.14 — Wzorzec D)*

### Sekcja A
długość kabla panel→falownik (m), prąd (Imp), napięcie (Vmp) — auto z konfiguracji paneli.

### Sekcja B
`R = ρ × L / S` (ρ_Cu = 0,0175 Ω·mm²/m)
`ΔU = I × R`
`P_strata = I² × R`
Silnik iteruje po dostępnych przekrojach, cel: strata <2-3%.

### Sekcja C
*"Dla odległości 30 m i prądu 15 A: kabel 4 mm² → strata 6%, 6 mm² → 4%, 10 mm² → 2,4%. Zalecamy 10 mm². Strata roczna ok. 80 kWh (~80 zł/rok przy 4 mm²)."*

**Uwaga integracyjna:** ten ekran częściowo pokrywa się z mega-Doradcą doboru kabla w Module 5 (Ekran 1) — przy pełnej integracji obu modułów warto, żeby to był jeden wspólny silnik obliczeniowy wywoływany z dwóch miejsc (PV i Okablowanie), a nie dwie osobne implementacje tego samego wzoru.

**D:** *"Prąd płynący kablem zawsze trochę 'grzeje' po drodze — to normalne, ale zbyt cienki kabel zamienia w ciepło więcej energii niż powinien."*

---

## EKRAN 9: Optymalizator "Złotego Środka" (kąt)
*(dawne 2.17 — Wzorzec D)*

### Sekcja A
dane z Ekranów 1, 6 i lokalizacji (wszystko już policzone wcześniej w sesji).

### Sekcja B
System nakłada trzy krzywe w funkcji kąta: (1) produkcja roczna — maksimum przy ok. 35°, (2) napór wiatru — rośnie z kątem, (3) ryzyko zalegania śniegu — maleje z kątem. Znajduje punkt minimalizujący sumaryczne ryzyko/koszt.

### Sekcja C
*"Twój Złoty Środek to kąt 22°. Stracisz tylko 6% energii względem 35°, ale zmniejszysz napór wiatru o 55% i unikniesz ryzyka zerwania."*

### Sekcja D
*"Najwyższa produkcja teoretyczna rzadko jest najlepszym wyborem w praktyce — czasem warto oddać 5-6% energii, żeby radykalnie obniżyć ryzyko uszkodzenia instalacji."*

---

## EKRAN 10: Konstrukcja wsporcza (BOM)
*(dawne 2.18 — Wzorzec D)*

**A:** wybrany układ paneli (z Ekranu 2), ich wymiary i liczba.
**B:** generowanie listy materiałów (profile aluminiowe/stalowe, śruby, podkładki, balast) na podstawie obciążenia śniegiem i wiatrem (z Ekranu 6). Sprawdzenie szczeliny wentylacyjnej (min. 10-15 cm).
**C:** *"Potrzebujesz X metrów profilu 40×40. Utrzymaj szczelinę 12 cm, inaczej latem panele osiągną 70°C i stracisz 18% mocy."*
**Zasila:** mechanizm BOM z §13.1 Zasad UX.

---

## EKRAN 11: Konfigurator stringów — szereg / równolegle / mieszany
*(scala dawne: 2.19, 2.20, 2.21 — Wzorzec A)*

*Ten ekran już zbudowany i zademonstrowany jako pierwszy przykład w tej konwersacji (przełącznik trybu + kalkulator na żywo).*

**A:** Vmp/Imp panelu, liczba paneli.
**B:** Szereg: `V = Vmp × n`, `I = Imp`. Równolegle: `V = Vmp`, `I = Imp × n`. Mieszany: podział na grupy, `V = Vmp × rozmiar_grupy`, `I = Imp × liczba_grup`.
**C:** wynik przelicza się na żywo przy zmianie przełącznika i pól.
**D:** *"Szereg dodaje napięcia, równoległe dodaje prądy — to jak łączenie baterii latarki: jedna za drugą (szereg) albo obok siebie (równolegle)."*

---

## EKRAN 12: Wpływ diod bocznikujących
*(dawne 2.22 — Wzorzec C)*

Wyjaśnienie: panel podzielony jest na sekcje (zwykle 3) z diodami bocznikującymi, które pozwalają prądowi ominąć zacienioną sekcję zamiast blokować cały panel.
**Przykład:** *"Zacienienie jednej sekcji panelu obniży moc o 33%, a nie o 100%, dzięki diodom bocznikującym."*
**D:** *"Diody to objazdy dla prądu — dzięki nim cień na kawałku panelu nie zatrzymuje całego panelu."*

---

## EKRAN 13: Symulacja zacienienia i wpływu na diody bocznikujące
*(scala dawne: 2.23, 2.49 — Wzorzec D)*

### Sekcja A
liczba paneli w stringu, stopień zacienienia (% powierzchni / liczba zacienionych sekcji), źródło cienia (auto z Modułu 1: analiza zacienienia).

### Sekcja B
W połączeniu szeregowym prąd całego stringu ogranicza się do prądu najbardziej zacienionego panelu. System liczy stratę mocy w zależności od liczby zacienionych sekcji: 1 sekcja → ok. 33% straty tego panelu, ale przy dużym stringu strata całego stringu może sięgać 55%+ (zależnie od konfiguracji).

### Sekcja C
*"Zacienienie jednego panelu w stringu 6 paneli obniży produkcję całego stringu o 55%. Zacienienie 2 sekcji jednego panelu: strata 66% tego panelu."*
🟡 rekomendacja mikroinwerterów przy regularnym/częściowym zacienieniu (cross-ref Ekran 18).

### Sekcja D
*"Jeden cień potrafi 'położyć' cały string, nie tylko zacieniony panel — to jak korek na jednym pasie, który spowalnia cały ruch, nie tylko ten jeden samochód."*

---

## EKRAN 14: Dopasowanie tablicy PV do falownika
*(scala dawne: 2.24, 2.25, 2.26, 2.27, 2.37, 2.42 — Wzorzec D, mega-scalenie)*

*Ten ekran już zbudowany i zademonstrowany jako trzeci przykład w tej konwersacji ("Doradca konfiguracji stringów" z realną logiką bezpieczeństwa).*

Sześć dawnych funkcji sprawdzało to samo pytanie z różnych stron — jeden zintegrowany silnik oceny sprawdza wszystkie kryteria naraz:

### Sekcja A
Voc, Vmp, Isc, Imp panelu, współczynnik temperaturowy Voc, liczba paneli w stringu; Max napięcie DC falownika, Max prąd/MPPT, zakres MPPT (min-max), min. napięcie startowe falownika, moc AC falownika.

### Sekcja B — sześć kryteriów sprawdzanych jednocześnie
1. **Napięcie zimowe vs limit falownika** (jak Ekran 5): `V_string_cold ≤ V_max_falownika`
2. **Napięcie robocze vs okno MPPT:** `MPPT_min ≤ V_string_STC ≤ MPPT_max`
3. **Prąd vs max MPPT:** `I_string ≤ I_max_MPPT`
4. **Napięcie startowe:** `V_string w najgorszych warunkach (upał, Vmp obniżone) ≥ V_min_start_falownika` — dawne 2.42: *"Falownik wymaga min. 150 V DC. Panele Vmp 35 V, w upał spada do 31 V → potrzeba minimum 5 paneli w stringu."*
5. **Współczynnik przewymiarowania DC/AC:** `moc_PV / moc_falownika_AC`, zalecany zakres 1,1–1,3 dla off-gridu (dawne 2.25).
6. **Ryzyko skrajności** (dawne 2.26): zbyt małe przewymiarowanie = niewykorzystany potencjał, zbyt duże = przegrzewanie i skrócona żywotność falownika, obcinanie mocy.

### Sekcja C — Rekomendacja
Werdykt zbiorczy uwzględniający wszystkie 6 kryteriów, z podświetleniem najlepszej konfiguracji liczby paneli w stringu, analogicznie do już zbudowanego przykładu.

### Sekcja D
*"Nie wystarczy sprawdzić jednego parametru — falownik i panele muszą pasować do siebie na kilku frontach naraz: napięcie zimą, napięcie latem, prąd, i stosunek mocy. Ten ekran sprawdza to wszystko za jednym razem."*

---

## EKRAN 15: Technologie paneli
*(scala dawne: 2.28, 2.29, 2.30, 2.43 — Wzorzec B, zakładki)*

*Ten ekran już zbudowany i zademonstrowany jako drugi przykład w tej konwersacji (karty porównawcze z zakładkami: Sprawność / Degradacja / Uzysk roczny / Cienkowarstwowe).*

Dane źródłowe: PERC (sprawność ~20%), Half-Cut (~21%), TOPCon (~22%), HJT (23%+); degradacja LID/LETID/PID — PERC ma LID do 3%, TOPCon i HJT bardziej odporne; uzysk roczny przy 4 kWp — TOPCon daje ok. 250 kWh więcej rocznie niż PERC; krystaliczne (19-22% sprawności, mniejsza powierzchnia) vs cienkowarstwowe (12-15%, lepsze przy słabym świetle, do dużych płaskich powierzchni).

---

## EKRAN 16: Panele bifacjalne
*(dawne 2.31 — Wzorzec D)*

**A:** współczynnik bifacjalności panelu (70-90%, z bazy komponentów), typ powierzchni pod spodem (biała membrana / jasny beton / piasek / trawa), wysokość montażu nad gruntem.
**B:** dodatkowy uzysk z tylnej strony wg albedo: biała membrana +10-20%, jasny beton +8-15%, piasek +10-18%, trawa +3-5%.
**C:** *"Panele bifacjalne na jasnym betonie zyskają 12% energii rocznie."*
🟡 *"Bez jasnego podłoża zysk z bifacjalności jest niewielki — nie przepłacaj za tę technologię, jeśli montujesz na trawie."*
**D:** *"Panele bifacjalne zbierają światło także z dołu — ale tylko jeśli dasz im jasne tło, od którego światło się odbije."*

---

## EKRAN 17: Niedopasowanie mocy paneli (mismatch)
*(scala dawne: 2.32, 2.41 — Wzorzec D)*

### Sekcja A
lista paneli w planowanym stringu/instalacji z ich mocą i prądem (Imp), typ połączenia (szereg/równolegle).

### Sekcja B
W szeregu prąd całego stringu ogranicza najsłabszy panel; w równoległym napięcie ogranicza panel o najniższym Vmp. System liczy stratę: przykład — panel 400W (Imp 11A) + panel 330W (Imp 9A) w szeregu → 2×9A×40V = 720W zamiast teoretycznych 730W (strata 1,4% przy małej różnicy, ale rośnie nieliniowo przy większej różnicy — przy 400W+330W realnie połączonych może sięgać nawet 18% wg dawnej analizy ryzyka 2.41).

### Sekcja C
*"Panel 400 W (Imp 11 A) i panel 330 W (Imp 9 A) w jednym stringu: strata do 18%. Rozdziel je na osobne MPPT albo połącz równolegle, jeśli mają zbliżone Vmp."*
🔴 różnica mocy paneli w jednym stringu >10-15% bez rozdzielenia na osobne MPPT.

### Sekcja D
*"String działa jak zespół wioślarzy — tempo narzuca najsłabszy. Mieszanie mocnych i słabych paneli w jednym stringu marnuje potencjał tych mocniejszych."*

---

## EKRAN 18: Wpływ temperatury na wydajność
*(dawne 2.33 — Wzorzec D)*

**A:** współczynnik temperaturowy mocy γ panelu (typowo −0,3 do −0,45%/°C), temperatura otoczenia.
**B:** `T_panel ≈ T_otoczenia + 25–30°C` (nagrzewanie od słońca); `P_rzeczywista = P_nominalna × (1 + γ × (T_panel − 25))`.
**C:** *"Przy 35°C na zewnątrz panel osiąga ok. 60°C i traci 15% mocy względem wartości katalogowej (mierzonej w 25°C)."*
**D:** *"Panele nie lubią upałów — paradoksalnie, najzimniejszy słoneczny dzień daje więcej mocy niż najgorętszy."*

---

## EKRAN 19: Degradacja paneli w czasie
*(dawne 2.34 — Wzorzec D, prognoza wieloletnia)*

**A:** typ technologii panelu (z bazy komponentów), lata eksploatacji do prognozy.
**B:** symulacja spadku mocy: LID (szybka degradacja w 1. roku), LETID (powolna w kolejnych latach), PID (zależna od napięcia systemu i wilgotności) — łączony model daje prognozę mocy po 10/15/25 latach.
**C:** *"Po 25 latach panel będzie miał ok. 84% mocy początkowej."*
🟡 jeśli prognozowana degradacja przekracza gwarancję producenta: *"Sprawdź warunki pracy — Twoja instalacja może degradować szybciej niż zakłada gwarancja."*
**D:** *"Panele powoli 'starzeją się' — to normalne, ale warto wiedzieć z góry, ile realnie stracisz w perspektywie dekad, żeby dobrze zaplanować wielkość instalacji."*

---

## EKRAN 20: Orientacja wschód-zachód
*(dawne 2.35 — Wzorzec D)*

**A:** kąty i azymuty obu połaci (wschód + zachód, z Modułu 1).
**B:** produkcja rozłożona bardziej równomiernie w ciągu dnia niż przy jednej orientacji południowej; typowy spadek sumy dobowej do 80-90% względem czystego południa.
**C:** *"Orientacja wschód-zachód da 85% energii południa, ale rozłożonej na dłużej w ciągu dnia — lepiej dopasowanej do profilu zużycia rannego i wieczornego."*
**D:** *"Nie masz idealnego południowego dachu? Wschód-zachód to nie kompromis, to inna strategia — czasem lepiej dopasowana do tego, kiedy realnie zużywasz prąd."*

---

## EKRAN 21: Mikroinwertery vs inwerter centralny
*(dawne 2.36 — Wzorzec B)*

| Kryterium | Mikroinwerter | Inwerter centralny |
|---|---|---|
| Odporność na zacienienie | wysoka (każdy panel niezależnie) | niska (ogranicza cały string) |
| Monitoring | na poziomie panelu | na poziomie stringu |
| Koszt | wyższy | niższy |
| Niezawodność | wiele punktów awarii | jeden punkt awarii |

**C:** *"Przy częściowym/regularnym zacienieniu wybierz mikroinwertery — to bezpośrednio łączy się z Ekranem 13."*
**D:** *"Cień to wróg klasycznej instalacji szeregowej. Mikroinwerter daje każdemu panelowi niezależność od sąsiadów."*

---

## EKRAN 22: Ochrona stringów (bezpieczniki, diody blokujące)
*(dawne 2.38 — Wzorzec D)*

**A:** Isc panelu, liczba stringów równoległych.
**B:** bezpiecznik per string = `1,25 × Isc`; przy ≥3 stringach równoległych diody blokujące/bezpieczniki stają się obowiązkowe (zapobiegają prądom wstecznym z pozostałych stringów podczas zwarcia w jednym).
**C:** *"Każdy string z bezpiecznikiem 15 A DC."*
🔴 *"Brak bezpieczników przy 3 stringach równoległych grozi pożarem przy zwarciu jednego stringa — prąd z pozostałych popłynie wstecz przez uszkodzony."*
**D:** *"Chroń każdy string osobno, żeby awaria jednego nie pociągnęła za sobą reszty instalacji."*
Cross-ref: Moduł 5, Ekrany 6, 14, 22 (bezpieczniki, wyłączniki DC, string box).

---

## EKRAN 23: Powłoki antyrefleksyjne
*(dawne 2.39 — Wzorzec C)*

Wyjaśnienie: powłoka zmniejsza odbicie światła, zwiększając ilość energii docierającej do ogniw — typowy wzrost uzysku 1-3%.
**Uwaga serwisowa:** *"Z czasem powłoka może się zabrudzić — myj panele delikatnie, unikaj ściernych środków czyszczących."*
**D:** *"Nie odbijaj słońca — wchłoń je. Powłoka antyrefleksyjna pomaga panelowi 'złapać' więcej z tego, co i tak na niego pada."*

---

## EKRAN 24: Czystość i śnieg na panelach
*(scala dawne: 2.16, 2.40, 2.44 — Wzorzec C, akordeon)*

*Ten ekran już zbudowany i zademonstrowany jako trzeci przykład wzorców UI w tej konwersacji (akordeon z trzema rozwijanymi sekcjami).*

**Sekcja "Kąt a samooczyszczanie" (dawne 2.44):** kąt <10° → woda i brud zalegają; 15-30° → deszcz spłukuje kurz; >30° → śnieg i liście zsuwają się łatwiej.
**Sekcja "Śnieg i dostępność serwisowa" (dawne 2.16):** *"W Twojej strefie występuje 15 dni z opadem śniegu >10 cm — panele dachowe będą nieproduktywne. Rozważ 2-3 panele naziemne jako łatwo dostępną rezerwę do odśnieżania."*
**Sekcja "Harmonogram czyszczenia — live" (dawne 2.40):** monitoring spadku produkcji przez zabrudzenie; próg rekomendacji mycia: strata >5-10%; uwzględnia prognozę opadów (deszcz może naturalnie oczyścić panele, więc system odracza rekomendację, jeśli deszcz nadchodzi w ciągu kilku dni).

---

## EKRAN 25: Dobór paneli do warunków nadmorskich i pylistych
*(dawne 2.45 — Wzorzec D)*

**A:** typ lokalizacji (nadmorska/pylista/standardowa — może być auto-wykryte z Modułu 1 na podstawie odległości od morza i typu terenu).
**B:** przy nadmorskiej: wymagany certyfikat IEC 61701 (odporność na mgłę solną), rama anodowana; przy pylistej: ryzyko rysowania szkła, zalecane częstsze czyszczenie; przy wysokiej wilgotności: podwyższone ryzyko PID (cross-ref technologie, Ekran 15).
**C:** *"Do lokalizacji nadmorskiej wybierz panele z ramą anodowaną i certyfikatem anty-PID."*
🟡 *"Sól niszczy standardowe złączki MC4 — stosuj złączki dedykowane do warunków morskich."* (cross-ref Moduł 5, Ekran 5 — złącza MC4)
**D:** *"Morze i pustynia to trudne środowiska dla elektroniki — nie każdy panel i nie każda złączka są do tego przystosowane."*

---

## EKRAN 26: Straty na złączkach MC4 w praktyce
*(dawne 2.46 — Wzorzec C, z elementami D)*

**Dane:** rezystancja pojedynczej złączki MC4 w dobrym stanie: 0,5-2 mΩ; złączka luźna/zaśniedziała: nawet 10× więcej.
**Przykład:** *"Przy 20 złączkach i prądzie 10 A: dobry styk → straty 2 W. Zły styk → straty 25 W i realne ryzyko przegrzania/pożaru."*
**D:** *"Małe złączki, duże znaczenie — luźny styk MC4 to jedna z najczęstszych przyczyn awarii i pożarów w instalacjach PV, mimo że wygląda niepozornie."*
Cross-ref: Moduł 5, Ekran 5 (dobór i kompatybilność złączek MC4).

---

## EKRAN 27: Roczny uzysk z uwzględnieniem technologii — RAPORT
*(dawne 2.50 — Wzorzec G, ekran wynikowy)*

Ten ekran **nie ma pól do wypełnienia** — to podsumowanie łączące wyniki wszystkich poprzednich ekranów tego modułu (technologia, degradacja, temperatura, kąt/orientacja, zacienienie) w jeden roczny wynik, docelowo zasilany przez silnik symulacji rocznej z §15.1.

**Przykładowy widok:**

| Wariant technologii | Roczny uzysk |
|---|---|
| PERC | 4,2 MWh |
| TOPCon | 4,5 MWh |
| HJT | 4,6 MWh |

**Rekomendacja:** *"Dopłata do TOPCon zwróci się po ok. 4 latach dodatkowej produkcji względem PERC."*

---

## Funkcje przeniesione z tego modułu (nie mają tu ekranu)

- **2.47 (Ochrona przeciwprzepięciowa stringów PV)** → treść dołączona do Modułu 5, Ekran 2 (SPD) — zobacz `Tresc_Modul_5_Okablowanie_Ekrany.md`.
- **2.48 (Monitoring wydajności paneli na żywo)** → staje się widżetem biblioteki Trybu Live (Moduł 13), nie ekranem projektowym w tym module.

---

## Podsumowanie modułu

**28 ekranów** (2 infrastrukturalne + 26 z pełną treścią Doradcy/porównania/raportu), pokrywających 50 pierwotnych funkcji źródłowych. Trzy ekrany (Konfigurator stringów, Dopasowanie do falownika, Technologie paneli, Czystość paneli) mają już gotowe, klikalne prototypy zbudowane w tej konwersacji — mogą posłużyć jako wzór interakcji przy przekazywaniu reszty modułu do implementacji.

**Twarde stopy zidentyfikowane w tym module:** przekroczenie napięcia MPPT przy mrozie (Ekran 5 i 14), niewystarczający balast/kotwienie względem naporu wiatru (Ekran 6), brak bezpieczników przy ≥3 stringach równoległych (Ekran 22), mieszanie paneli o mocy różniącej się >10-15% w jednym stringu bez rozdzielenia na osobne MPPT (Ekran 17).

---

**Wersja:** 1.0 — pełna treść Modułu 3 (Etap 3)
**Data:** Sierpień 2026
**Status:** Wszystkie 28 ekranów gotowe do przekazania deweloperowi, niezależnie od stacku technicznego.
**Powiązane dokumenty:** Biblia_Offgrid_v2_0_Architektura_Modulowa.md, Zasady_UX_Doradca_v2_1.md, Tresc_Modul_5_Okablowanie_Ekrany.md
