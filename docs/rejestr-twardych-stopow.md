# Rejestr twardych stopów — Inżynier Offgrid Pro

Zbiorczy, przeszukiwalny indeks wszystkich warunków, które w dowolnym module aplikacji muszą
**zawsze** skutkować werdyktem 🔴 (`docs/standards/04-walidacja-i-twarde-stopy.md`, 4.3). To jest
**indeks**, nie duplikat logiki walidacji — każda pozycja odsyła do modułu/ekranu i pliku, gdzie
warunek jest faktycznie sprawdzany. Aktualizacja: przy każdym nowym module, który wprowadza własny
twardy stop, dopisz go tutaj (nie usuwaj starych pozycji przy zmianach — `docs/standards/15`, 15.3).

Zakres tego rejestru: **fakty inżynierskie/bezpieczeństwa** ("to jest niebezpieczne/uszkodzi
sprzęt"), nie generyczna walidacja formularza ("pole musi być większe od zera"). Ta druga kategoria
istnieje jednolicie w niemal każdym kalkulatorze (`notPositive`/`outOfRange` w plikach
`warnings.ts`) i jest opisana zbiorczo w sekcji na końcu tego pliku zamiast wypisana pozycja po
pozycji — patrz uzasadnienie 4.3: rejestr służy do audytu bezpieczeństwa *zainstalowanego systemu*,
nie do audytu poprawności formularza webowego.

---

## Elektryczne / pożarowe

- **Zdolność wyłączania (AIC) bezpiecznika niższa niż prąd zwarciowy pakietu** — bezpiecznik
  rozerwie się, tworząc łuk plazmowy, zamiast bezpiecznie przerwać obwód.
  (M4/E24 — `lib/core/modules/baterie/dobor-bezpiecznika-dc/warnings.ts`,
  `aicPonizejPraduZwarciowego`, kod `AIC-PONIZEJ-PRADU-ZWARCIOWEGO`)
- **Pasta miedziowa na aluminium** — korozja galwaniczna połączenia.
  (M4/E11 — `lib/core/modules/baterie/moment-dokrecania-srub/constants.ts`,
  `OSTRZEZENIA_STALE`; cross-ref M5/E4)
- **Widoczne puchnięcie obudowy ogniwa LiFePO4 po demontażu** — ogniwo do wycofania z
  eksploatacji, nie do ponownego montażu.
  (M11/A8 — `lib/core/modules/montaz-baterii/ocena-zuzycia/warnings.ts`, `widoczneWybrzuszenie`,
  kod `WIDOCZNE-WYBRZUSZENIE`)
- **Metalowe przedmioty luzem na stanowisku montażu baterii** — ryzyko zwarcia podczas pracy przy
  odkrytych terminalach.
  (M11/A7 — `lib/core/modules/montaz-baterii/przygotowanie-stanowiska/constants.ts`,
  pozycja checklisty `brak-metalu-luzem`)
- **Załączenie głównego bezpiecznika/stycznika bez procedury pre-charge kondensatorów
  falownika** — zaiskrzenie i uszkodzenie styków bezpiecznika.
  (M11/A4 — `lib/core/modules/montaz-baterii/podlaczenie-bms/constants.ts`, `OSTRZEZENIA_STALE`)
- **Brak wentylacji pomieszczenia z akumulatorami kwasowo-ołowiowymi podczas ładowania** —
  gromadzący się wodór grozi wybuchem.
  (M11/B2 — `lib/core/modules/montaz-baterii/montaz-mechaniczny-olow/constants.ts`,
  `OSTRZEZENIA_STALE`)
- **Ładowanie ogniwa LiFePO4 poniżej -10°C** — całkowicie zablokowane w źródle; ładowanie w tych
  warunkach trwale uszkadza ogniwa (osadzanie litu metalicznego).
  (M4/E12 — `lib/core/modules/baterie/cold-c-rate/warnings.ts`, `blokadaCalkowita`, kod
  `BLOKADA-LADOWANIA-MROZ`)
- **Obudowa poniżej IP55 w środowisku narażonym na wilgoć (garaż, komora zewnętrzna)** —
  kondensacja w środku prowadzi do zwarcia na mokrym BMS/szynach.
  (M4/E10 — `lib/core/modules/baterie/ochrona-wilgoc/warnings.ts`, `ipPonizejWymaganego`, kod
  `IP-PONIZEJ-WYMAGANEGO`) **[28.09.2026]** Ten sam stop (echo, bez nowego progu) także w M12/E23
  (`lib/core/modules/kalkulator-mobilny/wilgoc-male-instalacje/`) — garaż/piwnica/namiot/jacht.
  **[28.09.2026, D44]** W M12/E23 namiot i jacht narażone na wilgoć mają wyższy próg: poniżej **IP65** 🔴
  (`namiotJachtPonizejIp65`, kod `WMI-NAMIOT-JACHT-PONIZEJ-IP65`, zastępuje tam stop IP55 — jeden stop na miejsce).
  Próg to praktyka właściciela („większe ryzyko”), nie norma; namiot/jacht zawsze traktowane jako wilgotne (stop nie zależy
  od odpowiedzi o wilgoci). IP55–IP64 w miejscu z wilgocią (garaż, piwnica) oraz IP65–IP66 w namiocie/na jachcie → tylko 🟡, nie stop.
- **Prąd zwarciowy pakietu przekracza zdolność łączeniową tranzystorów BMS** — zwykły
  bezpiecznik (~10ms) jest za wolny, wymagana funkcja e-Fuse (<100µs).
  (M4/E9 — `lib/core/modules/baterie/detekcja-zwarcia-efuse/warnings.ts`, `wymaganyEFuse`, kod
  `WYMAGANY-E-FUSE`)
- **Brak monitora izolacji (IMD) i różnicówki DC** — przebicie w panelu spowoduje pojawienie się
  niebezpiecznego potencjału na ramie bez wykrycia; prąd stały trzyma ofiarę porażenia mocniej
  niż zmienny.
  (M4/E29 — `lib/core/modules/baterie/detekcja-doziemienia/warnings.ts`, `brakZabezpieczenia`,
  kod `BRAK-ZABEZPIECZENIA-DOZIEMIENIA`)
- **Napięcie stringu PV w mrozie (Voc rośnie przy spadku temperatury) przekracza limit wejściowy
  MPPT falownika** — źródło określa to wprost jako "jeden z najważniejszych twardych stopów w
  całej aplikacji": przekroczenie limitu to gwarantowane uszkodzenie wejścia DC falownika, nie
  tylko ryzyko. Mroźny, słoneczny poranek jest groźniejszy niż upalne lato.
  (M3/E5 — `lib/core/modules/pv/stress-test-mppt/warnings.ts`, `przekroczonyLimitMppt`, kod
  `PRZEKROCZONY-LIMIT-MPPT`)
- **Brak zabezpieczenia nadprądowego przy stringach PV połączonych równolegle, gdy norma
  HD 60364-7-712 tego wymaga** — przy zwarciu jednego stringa prąd z pozostałych popłynie
  wstecz przez uszkodzony, ryzyko pożaru. **[06.09.2026] PRZEPISANE wg normy** (poprzednio:
  sztywny próg "≥3 stringi", kod `BRAK-ZABEZPIECZEN-PRZY-3-STRINGACH" — ZASTĄPIONE, mylił
  współczynnik K1 z Załącznika B.2 z rzeczywistym warunkiem obowiązkowości §712.431.101). Teraz:
  test `1,35×I_MOD_MAX_OCPR < (Ns−1)×I_SC_MAX` dla Ns>2, plus osobny twardy stop gdy sam zakres
  bezpiecznika `[1,1×I_SC_MAX, I_MOD_MAX_OCPR]` jest sprzeczny (dolna granica > górna).
  (M3/E22 — `lib/core/modules/pv/ochrona-stringow/warnings.ts`, `ochronaObowiazkowaBrak` kod
  `OCHRONA-OBOWIAZKOWA-BRAK`, `zakresBezpiecznikaNiepoprawny` kod
  `ZAKRES-BEZPIECZNIKA-NIEPOPRAWNY`)
- **[28.09.2026] Mikroinwertery w instalacji off-grid bez falownika wyspowego obsługującego sprzężenie AC
  (albo „nie wiem”)** — mikroinwerter to falownik sieciowy (nadążny), bez napięcia odniesienia nie wystartuje;
  instalacja nie zadziała. ✏️ Uzupełnienie eksperckie spoza źródła (źródło rekomenduje mikroinwertery przy
  cieniu bez tego zastrzeżenia), poziom 🔴 — decyzja właściciela projektu 28.09.2026.
  (M3/E21 — `lib/core/modules/pv/mikroinwertery-vs-centralny/warnings.ts`, `mikroinwerterBezFalownikaWyspowego`,
  kod `MIKROINWERTER-OFFGRID-BEZ-FALOWNIKA-WYSPOWEGO`)
- **Odległość źródła spalania paliwa stałego od materiałów palnych poniżej 40 cm** — realne
  ryzyko pożaru, próg podany wprost przez źródło jako liczba, nie zakres.
  (M8/E2 — `lib/core/modules/bezpieczenstwo/dogrzewanie-paliwem-stalym/warnings.ts`,
  `zaMalaOdleglosc`, kod `ZA-MALA-ODLEGLOSC`)
- **Brak osobnego nawiewu powietrza do spalania przy źródle paliwa stałego** — ryzyko
  niedotlenienia pomieszczenia i cofki spalin.
  (M8/E2 — `lib/core/modules/bezpieczenstwo/dogrzewanie-paliwem-stalym/warnings.ts`,
  `brakNawiewu`, kod `BRAK-NAWIEWU`)
- **Brak czujnika czadu (CO) w pomieszczeniu z otwartym źródłem spalania paliwa stałego** —
  zagrożenie życia, nie tylko mienia; czad nie ma zapachu i zabija we śnie.
  (M8/E2 — `lib/core/modules/bezpieczenstwo/dogrzewanie-paliwem-stalym/warnings.ts`,
  `brakCzujnikaCo`, kod `BRAK-CZUJNIKA-CO`)
- **[28.09.2026] Zamek drzwi ewakuacyjnych, który przy zaniku prądu blokuje drzwi (albo nie wiadomo,
  co robi), bez zasilania awaryjnego** — w pożarze, gdy padnie zasilanie, droga ewakuacji zostaje
  zamknięta. Twardy stop źródła.
  (M8/E3 — `lib/core/modules/bezpieczenstwo/zamki-drzwi-ewakuacyjnych/warnings.ts`,
  `zamekBlokujeBezZasilaniaAwaryjnego`, kod `ZAMEK-BLOKUJE-BEZ-ZASILANIA-AWARYJNEGO`)
- **[28.09.2026] Proszek lub CO2 jako środek gaśniczy w strefie magazynu LiFePO4** — nie gaszą
  wewnętrznej reakcji ogniwa; wymagana mgła wodna lub środek do magazynów energii.
  (M8/E4 — `lib/core/modules/bezpieczenstwo/modul-gasniczy/warnings.ts`,
  `srodekNieskutecznyLifepo4`, kod `GASZ-SRODEK-NIESKUTECZNY-LIFEPO4`)
- **[28.09.2026] Moduł gaśniczy rozładowany** — status krytyczny, sygnalizowany proaktywnie, nie
  dopiero w pożarze.
  (M8/E4 — `lib/core/modules/bezpieczenstwo/modul-gasniczy/warnings.ts`, `modulRozladowany`, kod
  `GASZ-MODUL-ROZLADOWANY`)
- **[28.09.2026] Awaria centrali sygnalizacji pożaru** — dopóki centrala nie działa, system nie dowie się o
  pożarze; status priorytetowy.
  (M8/E5 — `lib/core/modules/bezpieczenstwo/centrala-ssp/warnings.ts`, `awariaCentrali`, kod `SSP-AWARIA-CENTRALI`)
- **[28.09.2026] Niesprawna lampa awaryjna na drodze ewakuacji** — awaria musi być widoczna, zanim będzie potrzebna.
  (M8/E7 — `lib/core/modules/bezpieczenstwo/oswietlenie-awaryjne/warnings.ts`, `lampaNiesprawna`, kod
  `OSW-LAMPA-NIESPRAWNA`)
- **[28.09.2026] Automatyczne wezwanie służb bez wyraźnej zgody użytkownika** — reguła produktowa źródła; kalkulator
  zwraca wezwanie jako nieaktywne.
  (M8/E10 — `lib/core/modules/bezpieczenstwo/powiadomienia-alarmowe/warnings.ts`, `wezwanieBezZgody`, kod
  `ALARM-WEZWANIE-BEZ-ZGODY`)
- **[28.09.2026] BMS bez obejścia / redundancji (SPOF)** — awaria BMS wyłącza cały system w kilka sekund.
  (M7/E10 — `lib/core/modules/stress-test/analiza-spof/warnings.ts`, `bmsBezObejscia`, kod `SPOF-BMS`)
- **[28.09.2026] Przegrzewanie budynku nocą z baterii (Pre-Heat)** — „zrujnuje magazyn energii”, twardy stop źródła.
  (M7/E18 — `lib/core/modules/stress-test/pre-heat/warnings.ts`, `grzanieNocaZBaterii`, kod
  `PREHEAT-GRZANIE-NOCA-Z-BATERII`)
- **[28.09.2026] ESP32 zasilany bezpośrednio z magistrali 12/24/48 V** — spala stabilizator płytki.
  (M9/E2 — `lib/core/modules/esp32/zasilanie-esp32/warnings.ts`, `bezposrednioZMagistrali`, kod `ESP-BEZ-PRZETWORNICY`)
- **[28.09.2026] Najwyższe napięcie magistrali ponad maks. napięcie wejściowe przetwornicy** — przetwornica uszkodzona
  przy ładowaniu (poziom 🔴 do potwierdzenia przez właściciela).
  (M9/E2 — `napiecieWejsciaPrzekroczone`, kod `ESP-PRZETWORNICA-ZA-NISKIE-WEJSCIE`)
- **[28.09.2026] GPIO 3,3 V bezpośrednio na magistrali RS485, bez transceivera** — uszkodzenie portu.
  (M9/E4 — `lib/core/modules/esp32/architektura-komunikacji/warnings.ts`, `rs485BezTransceivera`, kod
  `KOM-RS485-BEZ-TRANSCEIVERA`)
- **[28.09.2026] Konflikt przypisania pinu GPIO.**
  (M9/E5 — `lib/core/modules/esp32/przydzial-pinow/warnings.ts`, `konfliktPinu`, kod `PIN-KONFLIKT`)
- **[28.09.2026] Aktualizacja OTA bez weryfikacji podpisu cyfrowego** — ryzyko złośliwego/uszkodzonego firmware.
  (M9/E6 — `lib/core/modules/esp32/niezawodnosc-esp32/warnings.ts`, `otaBezPodpisu`, kod `OTA-BEZ-PODPISU`)

## Bateryjne

- **Brak BMS z balancerem przed montażem pakietu LiFePO4** — bez balancera ogniwa rozjeżdżają się
  napięciowo, montaż jest niebezpieczny.
  (M11/A1 — `lib/core/modules/montaz-baterii/weryfikacja-ogniw/warnings.ts`, `brakBmsZBalancerem`,
  kod `BRAK-BMS-Z-BALANSEREM`)
- **Różnica napięć między ogniwami LiFePO4 przekracza 0,05 V przed połączeniem w pakiet** —
  wymaga wstępnego zbalansowania.
  (M11/A1 — `lib/core/modules/montaz-baterii/weryfikacja-ogniw/warnings.ts`,
  `roznicaNapiecOgniwZaDuza`, kod `ROZNICA-NAPIEC-OGNIW-ZA-DUZA`)
- **Demontaż pakietu LiFePO4 przy napięciu ogniwa powyżej zalecanych 3,2 V** — pakiet wciąż
  naładowany, ryzyko iskrzenia i uszkodzenia terminali przy odłączaniu.
  (M11/A6 — `lib/core/modules/montaz-baterii/demontaz-pakietu/warnings.ts`,
  `pakietWciazNaladowany`, kod `PAKIET-WCIAZ-NALADOWANY`)
- **Próba ratowania ogniwa LiFePO4 zmierzonego na 0 V** — prawdopodobne przebicie separatora,
  ładowanie grozi pożarem; zalecana utylizacja, nie ratunek.
  (M11/A9 — `lib/core/modules/montaz-baterii/ratowanie-ogniwa/warnings.ts`, `ogniwoZeroWoltowe`,
  kod `OGNIWO-ZERO-WOLTOWE`)
- **Agregat podłączony bezpośrednio do baterii, bez ładowarki/MPPT pomiędzy** — uszkodzenie ogniw.
  (M7/E5 — `lib/core/modules/stress-test/procedura-black-start/constants.ts`, `OSTRZEZENIA_STALE`)
- **Klucz udarowy zamiast dynamometrycznego na terminalach ogniw** — uszkodzenie połączenia/obudowy
  ogniwa.
  (M4/E11 — `lib/core/modules/baterie/moment-dokrecania-srub/constants.ts`, pozycja checklisty
  `terminal-m6`, pole `uwaga`)
- **Podkładki sprężyste bezpośrednio na terminalu ogniwa** — obniża pewność połączenia.
  (M4/E11 — `lib/core/modules/baterie/moment-dokrecania-srub/constants.ts`, `OSTRZEZENIA_STALE`)
- **≥2 akumulatory kwasowo-ołowiowe w szeregu bez balansera zewnętrznego** — z czasem rozjeżdżają
  się napięciowo (brak wbudowanego BMS-balancera jak w LiFePO4), najsłabszy ogranicza cały zestaw.
  (M11/B4 — `lib/core/modules/montaz-baterii/balansery-zewnetrzne-olow/warnings.ts`,
  `brakBalanseraZewnetrznego`, kod `BRAK-BALANSERA-ZEWNETRZNEGO`)
- **Przechowywanie rozładowanego akumulatora kwasowo-ołowiowego w mrozie** — elektrolit o niskiej
  gęstości zamarza i pęka obudowa.
  (M11/B12 — `lib/core/modules/montaz-baterii/przechowywanie-recykling-olow/constants.ts`,
  pozycja `mroz` w `PRZECHOWYWANIE_FAKTY`)
- **Docisk na pakiet ogniw pryzmatycznych poza zakresem 300-400 kgf** — za mały: utrata kontaktu
  wewnętrznego, przyspieszona degradacja; za duży: uszkodzenie mechaniczne ogniw.
  (M4/E21 — `lib/core/modules/baterie/pozycjonowanie-ogniw/warnings.ts`, `dociskZaMaly` /
  `dociskZaDuzy`, kody `DOCISK-ZA-MALY` / `DOCISK-ZA-DUZY`)
- **Rezystancja wewnętrzna ogniwa wzrosła o 50%+ względem wartości fabrycznej** — ogniwo
  straciło znaczącą część pojemności, do wymiany.
  (M4/E14 — `lib/core/modules/baterie/soh-per-ogniwo/warnings.ts`, `ogniwoDoWymiany`, kod
  `OGNIWO-DO-WYMIANY`)
- **Różnica napięć >0,2V między dwiema bateriami łączonymi równolegle** — ryzyko iskrzenia w
  chwili połączenia (prąd wyrównawczy `ΔV/(R1+R2)`).
  (M4/E18 — `lib/core/modules/baterie/mixing-rownolegle/warnings.ts`, `roznicaNapiecZaDuza`,
  kod `ROZNICA-NAPIEC-ZA-DUZA`)
- **Mieszanie różnych chemii ogniw w połączeniu równoległym bez izolacji galwanicznej** —
  niebezpieczne (np. LiFePO4 + AGM w tym samym obwodzie).
  (M4/E18 — `lib/core/modules/baterie/mixing-rownolegle/warnings.ts`, `innaChemiaBezIzolacji`,
  kod `INNA-CHEMIA-BEZ-IZOLACJI`)
- **Temperatura poniżej 5°C, brak produkcji PV i SoC poniżej 30%** — brak źródła prądu na
  grzałki BMS, grzanie wstrzymane, BMS blokuje ładowanie do czasu pojawienia się PV lub wzrostu
  SoC.
  (M4/E5 — `lib/core/modules/baterie/grzalki-bms-mroz/warnings.ts`, `grzanieWstrzymane`,
  kod `GRZANIE-WSTRZYMANE`)
- **Akumulator kwasowy/AGM bez dozownika napięcia (LVD), zasilający odbiornik bez własnego
  zabezpieczenia przed niskim napięciem** — realne ryzyko trwałego uszkodzenia przez głębokie rozładowanie.
  [27.09.2026] (M12/E9 — `lib/core/modules/kalkulator-mobilny/ochrona-przed-rozladowaniem/warnings.ts`,
  `brakDozownikaOlowiowy`, kod `LVD-BRAK-OCHRONY-OLOWIOWY`)
- **[28.09.2026] Akumulator kwasowy (zalewowy, otwarty) bez wentylacji w kamperze albo przy ładowaniu w
  zamkniętym garażu** — wydziela wodór, w małej kubaturze ryzyko wybuchu. Poziom 🔴 tylko dla zalewowego;
  AGM (VRLA) — 🟡 (gazuje znacznie mniej). Alert Biblii §12.33/§12.51, lista twardych stopów `Tresc_Modul_12`
  go nie wymienia — poziom to decyzja właściciela projektu 28.09.2026. Wymiarowanie wentylacji (EN IEC 62485-2)
  poza zakresem — normy brak w repo.
  (M12/E22 i E36 — `lib/core/modules/kalkulator-mobilny/bezpieczenstwo-kamper/warnings.ts`,
  `brakWentylacjiOlowiowy`, kody `BK-OLOW-BEZ-WENTYLACJI`, `LG-OLOW-BEZ-WENTYLACJI`)
- **Urządzenie o wąskiej tolerancji napięciowej podłączone wprost do akumulatora bez stabilizacji** — napięcie
  ładowania (do 14,5 V dla 12 V) przekracza górną granicę tolerancji urządzenia, ryzyko uszkodzenia.
  **[28.09.2026] ZMIENIONO:** górna granica nie jest już stałą 14,5 V — to maks. napięcie ładowania z ustawień
  regulatora usera (decyzja właściciela; rozbieżność `Tresc` 14,5 V vs Biblia 14,6 V i wyrównywanie ołowiowego).
  [27.09.2026] (M12/E27 — `lib/core/modules/kalkulator-mobilny/urzadzenie-12v-bezposrednio/warnings.ts`,
  `przepieciePrzyLadowaniu`, kod `U12-PRZEPIECIE-PRZY-LADOWANIU`)
- **Voc paneli w mrozie powyżej max napięcia wejścia solarnego stacji zasilania/powerbanka** — stacje mają niższe
  limity niż profesjonalne MPPT, przekroczenie uszkadza wejście.
  [27.09.2026] (M12/E39 — `lib/core/modules/kalkulator-mobilny/panel-do-stacji-zasilania/warnings.ts`,
  `przekroczoneNapiecieWejscia`, kod `PST-PRZEKROCZONE-NAPIECIE-WEJSCIA`)
- **Przeciążenie gniazda zapalniczki samochodowej** — suma prądów urządzeń powyżej bezpiecznika gniazda, ryzyko
  przepalenia bezpiecznika lub przegrzania przewodów instalacji pojazdu.
  [27.09.2026] (M12/E30 — `lib/core/modules/kalkulator-mobilny/gniazdo-zapalniczki/warnings.ts`,
  `przeciazenieGniazda`, kod `GZ-PRZECIAZENIE-GNIAZDA`)
- **Bezpiecznik nie chroni kabla przed przeciążeniem (In > Iz)** — sprawdzany przekrój przechodzi obciążalność i
  spadek napięcia, ale bezpiecznik 1,25 × I jest większy niż obciążalność kabla (PN-IEC 60364-4-43, 433.2).
  [27.09.2026] (M12/E2, E15 — `lib/core/modules/kalkulator-mobilny/kable-bezpieczniki-male/warnings.ts`,
  `przekrojPonizejMinimum`, kod `MK-BEZPIECZNIK-NIE-CHRONI-KABLA`)

## Cieplne / systemowe

- **Napięcie systemu off-grid poniżej minimalnego napięcia pracy pompy ciepła** — przy
  rozładowanej baterii pompa wyłącza się dokładnie w najgorszym możliwym momencie (mróz +
  rozładowana bateria), gdy jest najbardziej potrzebna.
  (M6/dawne 5.63 — `lib/core/modules/ogrzewanie/ryzyko-niskiego-napiecia/warnings.ts`,
  `pompaSieWylaczy`, kod `POMPA-SIE-WYLACZY`)

- **Temperatura czynnika roboczego (solanki) dolnego źródła zbliżająca się do punktu
  zamarzania** — dłuższa praca ciągła pompy schładza grunt wokół kolektora bez przerwy na
  regenerację; zamarznięcie dolnego źródła to koniec pracy pompy i ryzyko uszkodzenia
  wymiennika. Treść informacyjna (Wzorzec C, bez kalkulatora — źródło nie podaje wzoru
  wiążącego temperaturę gruntu/głębokość kolektora/stężenie glikolu/czas pracy z temperaturą
  solanki, tylko jeden ilustracyjny przykład), nie automatycznie wykrywany warunek.
  (M6/dawne 5.46 — `app/kalkulatory/ryzyko-zamarzniecia-dolnego-zrodla/page.tsx`)

## Bezpieczeństwo życia / montaż

- **Rozpoczęcie montażu baterii LiFePO4 bez pełnego kompletu: mata izolacyjna, klucz
  dynamometryczny z nasadkami izolowanymi, rękawice, okulary, gaśnica w zasięgu ręki** — checklist
  musi być potwierdzona w całości przed werdyktem "Stanowisko gotowe do montażu".
  (M11/A7 — `lib/core/modules/montaz-baterii/przygotowanie-stanowiska/calculator.ts`, status
  `VALID` tylko gdy wszystkie pozycje potwierdzone)
- **Krok procedury Black Start potwierdzony poza kolejnością** — kolejność ma znaczenie (np.
  naładowanie baterii przed podłączeniem agregatu do ładowarki), zła kolejność rozruchu może
  uszkodzić sprzęt.
  (M7/E5 — `lib/core/modules/stress-test/procedura-black-start/calculator.ts`, kod
  `KROK-POZA-KOLEJNOSCIA` — poziom `critical` od 07.09.2026, patrz "Znane luki" niżej po historię)
- **Praca bez okularów ochronnych przy akumulatorach kwasowo-ołowiowych z korkami** — ryzyko
  pryśnięcia kwasu przy sprawdzaniu poziomu elektrolitu.
  (M11/B8 — `lib/core/modules/montaz-baterii/bezpieczenstwo-kwas/constants.ts`,
  `OSTRZEZENIA_STALE`)
- **Wylewanie kwasu z akumulatora kwasowo-ołowiowego do kanalizacji lub gruntu** — kategoryczny
  zakaz źródła.
  (M11/B12 — `lib/core/modules/montaz-baterii/przechowywanie-recykling-olow/constants.ts`,
  pozycja `zakaz-wylewania` w `RECYKLING_FAKTY`)
- **[26.09.2026] Planowany balast stelaża PV mniejszy niż balast projektowy przeciw oderwaniu
  (PN-EN 1990, EQU)** — przy silnym wietrze stelaż może zostać oderwany. Źródło: Moduł 3, lista
  twardych stopów ("niewystarczający balast/kotwienie względem naporu wiatru (Ekran 6)").
  (M3/E6 — `lib/core/modules/pv/napor-wiatru/warnings.ts`, `balastNiewystarczajacy`, kod
  `NW-BALAST-NIEWYSTARCZAJACY`; sprawdzany tylko, gdy użytkownik wpisze planowany balast. Przesuw i
  wywracanie niesprawdzane — brak współczynnika tarcia i punktu przyłożenia siły.)
- **[27.09.2026] Obciążenie śniegiem przekraczające nośność dachu** — osobno: (a) obciążenie normowe
  `s = μ1·Ce·Ct·sk` (PN-EN 1991-1-3 + NB) większe niż nośność z projektu konstrukcji, (b) ciężar
  zmierzonej warstwy `γ·h` (górne γ z Tablicy E.1) większy niż ta nośność. Źródło: Moduł 7, Ekran 23
  ("obciążenie zbliżające się lub przekraczające dopuszczalną nośność konstrukcji").
  (M7/E23 — `lib/core/modules/stress-test/obciazenie-dachu-sniegiem/warnings.ts`,
  `normowePrzekraczaNosnosc` / `aktualnePrzekraczaNosnosc`, kody `SNIEG-NORMOWE-PRZEKRACZA-NOSNOSC`,
  `SNIEG-AKTUALNE-PRZEKRACZA-NOSNOSC`; sprawdzany tylko, gdy użytkownik wpisze nośność. Wariant
  „zbliżające się” — **[28.09.2026, D30]** 🟡 (nie twardy stop) od 80% nośności, próg ustalony przez
  właściciela, nie z normy: kody `SNIEG-NORMOWE-ZBLIZA-SIE-DO-NOSNOSCI`, `SNIEG-AKTUALNE-ZBLIZA-SIE-DO-NOSNOSCI`.)
- **[27.09.2026] PVC (izolacja, osłona, złączka) w miejscu o minimalnej temperaturze poniżej −10°C** —
  PVC sztywnieje i pęka. Źródło: Moduł 7, Ekran 13.
  (M7/E13 — `lib/core/modules/stress-test/sztywnienie-izolacji/warnings.ts`, `pvcPonizejProgu`, kod
  `MROZ-PVC-PONIZEJ-PROGU`; XLPE poniżej −40°C tylko 🟡 — źródło nie wpisuje go jako twardego stopu.)
- **[27.09.2026] BMS w miejscu, gdzie minimalna temperatura spada poniżej jego minimalnej temperatury pracy** —
  BMS nie wystartuje, bateria bez nadzoru/niedostępna. Źródło: Moduł 7, Ekran 19.
  (M7/E19 — `lib/core/modules/stress-test/elektronika-w-mrozie/warnings.ts`, `bmsPonizejMin`, kod
  `ELEKTRONIKA-BMS-PONIZEJ-MIN`; próg = wartość z karty katalogowej wpisana przez użytkownika. Inne typy
  urządzeń tylko 🟡 — decyzja o rozszerzeniu zbioru krytycznych: `docs/lista-do-zrobienia.md`.)
- **[28.09.2026, D31] Przetwornica/falownik w miejscu poniżej jej minimalnej temperatury pracy** — nie
  wystartuje, brak 230 V w całym domu. Decyzja właściciela (źródło nazywa 🔴 tylko BMS).
  (M7/E19 — `przetwornicaPonizejMin`, kod `ELEKTRONIKA-PRZETWORNICA-PONIZEJ-MIN`; zbiór krytycznych
  `TYPY_KRYTYCZNE` w `constants.ts`. Regulator ładowania — 🟡.)
- **[28.09.2026, D32] Zwykły olej napędowy przy temperaturze miejsca agregatu/paliwa poniżej +5°C** (do 1.1.0: ≤ 0°C) — bardzo
  duże ryzyko, że agregat nie wystartuje (parafinowanie). Próg z praktyki właściciela, nie z normy;
  zastępuje sprzeczne progi źródła (B: −20°C, C: −15°C). Źródło: Moduł 7, Ekran 8.
  (M7/E8 — `lib/core/modules/stress-test/agregat-w-mrozie/warnings.ts`, `dieselParafinizacja`, kod
  `AGREGAT-DIESEL-PARAFINIZACJA`; +5…+10°C i ≤ −10°C (każdy diesel) tylko 🟡. Doprecyzowanie właściciela 28.09: paliwo
  zimowe od +5°C, arktyczne poniżej −10°C, kontrola świec obowiązkowa, dodatek zimowy zalecany.)
- **[28.09.2026] Instalacja w gruncie (kabel, rura, uziom) ułożona płycej niż strefa przemarzania** —
  zamarzający, pęczniejący grunt ją uszkodzi. Źródło: Moduł 7, Ekran 22 (tryb Grunt).
  (M7/E22 — `lib/core/modules/stress-test/ryzyko-zamarzniecia/warnings.ts`, `plycejNizPrzemarzanie`, kod
  `ZAMARZ-PLYCEJ-NIZ-PRZEMARZANIE`; strefa przemarzania wpisywana przez użytkownika.)
- **[28.09.2026] Rozmrażanie zamarzniętej rury otwartym ogniem / palnikiem** — ryzyko pęknięcia rury i pożaru.
  Źródło: Moduł 7, Ekran 22 (sekcja wspólna rozmrażania).
  (M7/E22 — `rozmrazanieOgniem`, kod `ZAMARZ-ROZMRAZANIE-OGIEN`.)

## Znane luki (świadomie, nie przeoczenie)

- **Moduł 8 (Bezpieczeństwo pożarowe), Ekran 11** — mechanizm agregacji (dowolna pozycja checklisty
  ze statusem `critical` → werdykt czerwony) już działa, ale same dane (`SAMPLE_AUDIT_ITEMS`) są
  demonstracyjne, nie realnym zestawem twardych stopów instalacji. Realne kryteria (np. "brak
  czujnika dymu w sypialni", "gaśnica po terminie ważności") do zdefiniowania, gdy ekran zostanie
  spięty z Modułami 8/9/13 (`docs/rejestr-pokrycia.md`).
- ~~**`KROK-POZA-KOLEJNOSCIA` (Black Start) jest `warning`, nie `critical`**~~ — **[07.09.2026]
  ROZSTRZYGNIĘTE**: właściciel projektu potwierdził podniesienie do `critical` (pytanie otwarte od
  03.09.2026, zgłoszone bez samodzielnego rozstrzygania — `docs/standards/15`, 15.4). Wpis
  zachowany jako historia (zasada "nie usuwaj — oznacz").
- Moduły z ekranami wciąż `todo` (większość Modułu 2, Moduł 1 ekrany 2–4, reszta ekranów 3/4/5/8/9)
  mogą kryć kolejne twarde stopy w treści źródłowej (`docs/zrodla/`), jeszcze nieprzepisane do
  kodu — ten rejestr rośnie razem z `docs/rejestr-pokrycia.md`, nie wyprzedza go.
- **Ekran B5 (Moduł 11, Ścieżka B — dobór kabli/bezpieczników) zablokowany, nie zbudowany.**
  Źródło wprost każe użyć "tego samego silnika co Moduł 5, Ekran 1", ale ten ekran jeszcze nie
  istnieje w kodzie — świadomie nie budowano tymczasowego, równoległego silnika doboru przekroju
  kabla, żeby nie wymyślać norm/tabel obciążalności bez realnego źródła. Gdy Moduł 5 Ekran 1
  powstanie, B5 powinien go re-używać (wzorzec "echo", nie duplikować logiki), patrz
  `docs/rejestr-pokrycia.md`. **[06.09.2026] KOREKTA:** norma dostarczona (patrz niżej) — pozostaje
  wyłącznie zależność od Moduł 5/Ekran 1, nie brak źródła.
- **Moduł 5, Ekran 1 (Dobór przekroju kabla) sam też zablokowany — ten sam powód co B5.**
  Sprawdzone (2026-09-03): źródło (`docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md`, linie 9–52)
  odwołuje się do "tabeli normatywnej (PN-IEC 60364-5-52)" dla obciążalności bazowej kabla wg
  przekroju/materiału, ale samej tabeli nie podaje — tylko po jednej przykładowej wartości
  współczynnika korekcyjnego (`k1=0,87` dla 40°C, `k2=0,70` dla 4 kabli w wiązce), nie pełne
  tabele dla wszystkich kombinacji temperatury/liczby kabli/sposobu ułożenia, których silnik by
  wymagał. Budowa tego ekranu bez kompletnej tabeli oznaczałaby wymyślenie norm bezpieczeństwa —
  wprost zakazane (CLAUDE.md, "Nie wymyślaj brakujących danych, norm ani współczynników
  bezpieczeństwa"). Czeka na dostarczenie pełnej tabeli normatywnej przez właściciela projektu.
  **[06.09.2026] KOREKTA — dostarczona i zweryfikowana:** norma PN-HD 60364-5-52:2011 kupiona przez
  właściciela projektu (05.09.2026), Załącznik B (pełne tabele obciążalności, wszystkie kombinacje
  temperatury/liczby kabli/ułożenia) w pełni zweryfikowany strona po stronie
  (`docs/zrodla/norma-PN-HD-60364-5-52/`). **Ekran nie jest już blokowany brakiem normy** — pozostaje
  wyłącznie zadanie implementacyjne (transkrypcja konkretnych tabel do kodu kalkulatora). Status
  odświeżony na `todo` w `docs/rejestr-pokrycia.md`. **[06.09.2026] ZBUDOWANY:**
  `lib/core/modules/okablowanie/dobor-przekroju-kabla/` — status `**done**` w `docs/rejestr-pokrycia.md`.
  Twardy stop 🔴 zaimplementowany dokładnie jak w źródle: opcja "sprawdź mój przekrój" zwraca
  `PRZEKROJ-PONIZEJ-WYLICZONEGO` (level `critical`), gdy user ręcznie wybrał przekrój mniejszy niż
  wyliczone minimum (ryzyko przegrzania izolacji/pożaru). Dodatkowo: OUT_OF_SCOPE (nie zgadywanie) gdy
  temperatura otoczenia lub liczba kabli w wiązce wykracza poza zakres tabel normy dla PVC.
- **Moduł 4, Ekran 12 (Cold C-Rate) — luka w samej tabeli źródła dla zakresu 5–10°C.** Tabela
  limitów C-rate wg temperatury (`docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md`, linie 156–162) ma
  4 wiersze (`<-10°C`, `-10 do 0°C`, `0 do 5°C`, `>10°C`) — zakres 5–10°C nie jest zdefiniowany
  żadnym wierszem. Sprawdzone dwukrotnie (odczyt źródła + niezależne przeliczenie w Pythonie)
  przed implementacją. Kalkulator (`lib/core/modules/baterie/cold-c-rate/calculator.ts`) zwraca
  dla tego zakresu status `OUT_OF_SCOPE` z jawnym komunikatem o luce, zamiast interpolować
  wymyśloną wartość pośrednią między 0,2C a "pełny prąd".
- **Moduł 4, Ekran 25 (Szyny zbiorcze i połączenia międzypakietowe) zablokowany, nie
  zbudowany.** Sekcja C źródła daje tylko ilustracyjne przykłady nierównego rozkładu prądu
  ("20% więcej na ogniwie #1", "40% vs 15% między bateriami"), ale nie podaje wzoru wiążącego
  długość/przekrój/rezystancję kabla z wielkością tego rozkładu — ten sam rodzaj luki co M5/E1 i
  M11/B5 (brak tabeli/wzoru normatywnego). Budowa oznaczałaby wymyślenie zależności fizycznej —
  wprost zakazane (CLAUDE.md). **[06.09.2026] KOREKTA:** norma PN-HD 60364-5-52 (tabele
  obciążalności) już dostarczona i zweryfikowana — luka fizyczna (brak wzoru na rozkład prądu
  między bateriami) pozostaje odrębna i wciąż nierozwiązana, ale nie jest to już kwestia tej samej
  brakującej normy co M5/E1.
- **Moduł 4, Ekran 5 (Grzałki BMS i ochrona przed mrozem) — luka na granicy SoC=30%.** Źródło
  (`docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md`, linie 67–72) podaje warunki "SoC > 30% → grzanie
  z baterii" i "SoC < 30% → grzanie wstrzymane" jako dwa osobne, rozłączne warunki — wartość
  dokładnie SoC=30% nie należy do żadnego z nich. Kalkulator
  (`lib/core/modules/baterie/grzalki-bms-mroz/calculator.ts`) zwraca dla tej wartości status
  `OUT_OF_SCOPE`, zamiast przypisywać ją arbitralnie do jednej ze stron progu.

## Walidacja danych wejściowych (wzorzec ogólny, nie wypisany pozycja po pozycji)

Niemal każdy kalkulator ma parę `notPositive`/`outOfRange` (albo odpowiednik specyficzny dla pola)
zwracającą `level: "critical"`, gdy wartość wejściowa jest niepoprawna (ujemna/zero/poza fizycznym
zakresem). To nie są fakty domenowe o niebezpieczeństwie — to bramka "dane się nie liczą, dopóki są
bez sensu". Pełna lista plików: `lib/core/modules/*/warnings.ts` (funkcje `notPositive`,
`outOfRange`, `efficiencyOutOfRange`, `copOutOfRange`, `pojemnoscNotPositive`,
`selectedItemNotPositive`).
