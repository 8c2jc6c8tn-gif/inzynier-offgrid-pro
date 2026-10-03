/**
 * Help content — Module 13 (live mode). Telemetry (Modbus/MQTT) is not connected yet and the
 * screen has no input fields, so it gets a snapshot only.
 */
import type { Tlumaczenie } from "./typy"

export const pl = {
  "tryb-live": {
    migawka: {
      oCoChodzi: "Aplikacja ma dwa tryby: „Projektowanie” — liczysz system na danych wpisanych ręcznie — i „Live” — patrzysz, co Twoja instalacja robi w tej chwili.",
      jakDziala: "Tryb Live będzie czytał dane prosto z falownika i BMS przez Modbus lub MQTT i pokazywał je na widżetach (moc PV, SoC baterii, alarmy). To połączenie nie jest jeszcze skonfigurowane, więc ekran pokazuje tylko stan „brak telemetrii”.",
      poCo: "Żeby po zbudowaniu instalacji sprawdzać na żywo, czy działa tak, jak zaprojektowałeś — zamiast zgadywać z pojedynczych odczytów.",
    },
    pola: {},
  },
  "zrodla-telemetrii": {
    migawka: {
      oCoChodzi: "Tu rejestrujesz, skąd aplikacja bierze pomiary z Twojej instalacji, i wczytujesz dane z pliku CSV (np. eksport z falownika, BMS lub stacji pogodowej).",
      jakDziala: "Każde źródło dostaje nazwę i typ. Przy imporcie wskazujesz, która kolumna pliku to czas, a które to pomiary (jaka wielkość i w jakiej jednostce). Aplikacja zamienia jednostki na podstawowe, usuwa powtórzone próbki, zapisuje surowe próbki na urządzeniu i pokazuje raport jakości: luki, wartości spoza zakresu fizycznego czujnika, braki i serie bez zmian. Niczego nie dopełnia ani nie zgaduje — odstęp między pomiarami i strefę czasową podajesz Ty.",
      poCo: "Żeby wykresy i alarmy trybu Live oraz analizy historii opierały się na Twoich rzeczywistych pomiarach, a nie na założeniach — i żebyś od razu widział, czy dane z pliku nadają się do użycia.",
    },
    pola: {
      profilWybor: {
        nazwa: "Zapisany profil mapowania",
        cel: "Szybko wypełniasz mapowanie kolumn dla pliku, który już kiedyś wczytywałeś.",
        gdzie: "Lista profili zapisanych przyciskiem „Zapisz mapowanie jako profil”.",
        zakres: "Jeden z zapisanych profili. Profil nie zawiera kroku próbkowania — tego nie zgadujemy.",
      },
      profilNazwa: {
        nazwa: "Nazwa profilu",
        cel: "Pod tą nazwą zapiszesz bieżące mapowanie kolumn, żeby użyć go przy kolejnym pliku z tego samego urządzenia.",
        gdzie: "Dowolna, np. „Falownik – eksport z portalu”.",
        zakres: "Dowolny niepusty tekst; ta sama nazwa nadpisuje wcześniejszy profil.",
      },
      nazwa: {
        nazwa: "Nazwa źródła",
        cel: "Rozpoznajesz po niej źródło na listach i na wykresach.",
        gdzie: "Dowolna, np. „Falownik – eksport z portalu” albo „Stacja pogodowa”.",
        zakres: "Dowolny niepusty tekst.",
      },
      typ: {
        nazwa: "Typ źródła",
        cel: "Mówi aplikacji, jak odczytywać dane: z zaimportowanego pliku, z symulatora, czy z urządzenia po sieci.",
        gdzie: "Plik CSV — gdy masz eksport z falownika/BMS/stacji. Symulator — wyłącznie do oglądania ekranów bez sprzętu. HTTP — urządzenie ESP32 w sieci domowej.",
        zakres: "Do wyboru z listy; źródła Web Serial i Bluetooth dojdą po wyborze sprzętu.",
      },
      url: {
        nazwa: "Adres urządzenia",
        cel: "Pod ten adres aplikacja odpytuje urządzenie o aktualne pomiary.",
        gdzie: "Adres z konfiguracji urządzenia (jego firmware) w sieci domowej. Strona otwarta przez HTTPS nie może wołać zwykłego http w sieci lokalnej.",
        zakres: "Pełny adres zaczynający się od http:// lub https://.",
      },
      coS: {
        nazwa: "Odpytywanie co",
        cel: "Jak często aplikacja pyta urządzenie o nowe pomiary.",
        gdzie: "Wybierz nie rzadziej, niż urządzenie zapisuje pomiary; zależy od firmware.",
        zakres: "Zwykle od 1 do 60 s; aplikacja żadnej wartości nie narzuca.",
      },
      zrodloDocelowe: {
        nazwa: "Źródło docelowe",
        cel: "Do tego źródła trafią próbki z pliku; po nim rozpoznasz je później na wykresach.",
        gdzie: "Lista źródeł typu „Plik CSV”, które dodałeś wyżej.",
        zakres: "Jedno źródło z listy.",
      },
      bezNaglowka: {
        nazwa: "Plik bez wiersza nagłówka",
        cel: "Gdy plik nie ma nazw kolumn w pierwszym wierszu, kolumny trzeba wskazywać numerem.",
        gdzie: "Otwórz plik w edytorze tekstu i zobacz, czy pierwszy wiersz zawiera nazwy, czy od razu liczby.",
        zakres: "Zaznacz tylko, gdy pierwszy wiersz to już dane.",
      },
      kolCzasu: {
        nazwa: "Kolumna czasu",
        cel: "Z niej aplikacja odczytuje moment każdego pomiaru.",
        gdzie: "Nazwa kolumny z pierwszego wiersza pliku (albo numer od 0, gdy plik nie ma nagłówka).",
        zakres: "Nazwa zgodna co do znaków z nagłówkiem albo liczba całkowita od 0.",
      },
      formatCzasu: {
        nazwa: "Format czasu",
        cel: "Mówi, jak zapisany jest czas w pliku, żeby poprawnie go odczytać.",
        gdzie: "Spójrz na pierwszy wiersz z danymi: „2026-01-31 14:00” to ISO, „31.01.2026” to DD.MM.RRRR, długa liczba to epoch.",
        zakres: "Jeden z formatów z listy; zły wybór kończy się pominięciem wierszy, nie błędnymi danymi.",
      },
      kolGodziny: {
        nazwa: "Kolumna godziny",
        cel: "Potrzebna, gdy data i godzina są w osobnych kolumnach.",
        gdzie: "Nazwa lub numer kolumny z godziną (np. 14:00).",
        zakres: "Pole używane tylko przy formatach z osobną godziną.",
      },
      przesuniecie: {
        nazwa: "Przesunięcie zegara pliku względem UTC [min]",
        cel: "Czas w pliku bez oznaczenia strefy aplikacja przelicza na UTC tym przesunięciem; zły wpis przesuwa wszystkie próbki.",
        gdzie: "Strefa, w której zapisywał logger: czas środkowoeuropejski zimą to 60, latem 120; UTC to 0. Sprawdź w ustawieniach urządzenia.",
        zakres: "Od -720 do 840 minut; puste = 0 (UTC).",
      },
      krok: {
        nazwa: "Odstęp między pomiarami w pliku [min]",
        cel: "Na jego podstawie wykrywane są luki w danych. Aplikacja nie zgaduje go z danych.",
        gdzie: "Ustawienie częstotliwości zapisu w loggerze lub falowniku (np. co 1, 5 lub 15 min).",
        zakres: "Liczba większa od zera, zwykle 1–60 min.",
      },
      znaczniki: {
        nazwa: "Znaczniki braku pomiaru",
        cel: "Wartości, którymi urządzenie oznacza „brak odczytu” — zostaną potraktowane jako brak, nie jako liczba.",
        gdzie: "Dokumentacja loggera lub plik: często -999, ///, N/A. Wpisz po przecinku.",
        zakres: "Puste = brak takich znaczników.",
      },
      kolNazwa: {
        nazwa: "Kolumna z pomiarem",
        cel: "Z tej kolumny pochodzą wartości jednej wielkości.",
        gdzie: "Nazwa kolumny z nagłówka pliku (albo numer od 0 bez nagłówka).",
        zakres: "Nazwa jak w pliku albo liczba całkowita od 0.",
      },
      kanal: {
        nazwa: "Kanał (urządzenie)",
        cel: "Odróżnia pomiary z różnych urządzeń w jednym źródle, np. dwóch baterii.",
        gdzie: "Własna etykieta, np. „bms-1”, „mppt-a”.",
        zakres: "Dowolny niepusty tekst.",
      },
      wielkosc: {
        nazwa: "Wielkość fizyczna",
        cel: "Określa, co mierzy kolumna; dobiera jednostkę podstawową i zakres sensowności czujnika.",
        gdzie: "Z dokumentacji urządzenia lub nagłówka kolumny.",
        zakres: "Lista wielkości; zakresy to granice sensowności czujnika, nie normy.",
      },
      jednostka: {
        nazwa: "Jednostka w pliku",
        cel: "W niej zapisane są liczby w pliku; aplikacja przelicza je na jednostkę podstawową.",
        gdzie: "Nagłówek kolumny lub dokumentacja loggera (np. kW, mA, °F).",
        zakres: "Znana jednostka danej wielkości; nieznana kończy się odrzuceniem wiersza, nie zgadywaniem.",
      },
    },
  },
  "pomiary-na-zywo": {
    migawka: {
      oCoChodzi: "Tu widzisz, co Twoja instalacja robi teraz: ostatnie wartości pomiarów, wykres mocy z wybranego okna czasu i alarmy, gdy pomiar przekroczy próg, który sam ustawisz.",
      jakDziala: "Aplikacja czyta zapisane próbki wybranego źródła i co kilka sekund odświeża widok. Dla każdego pomiaru pokazuje najnowszą poprawną wartość (braki i wartości spoza zakresu czujnika są pomijane, nigdy nie zamieniane na zero). Alarm powstaje, gdy ostatnia wartość jest poniżej albo powyżej progu, który wpisałeś — aplikacja nie ma własnych progów, bo zależą od Twojego akumulatora i instalacji.",
      poCo: "Żeby od razu zobaczyć, czy coś wymaga reakcji, i żeby alarmy opierały się na limitach z dokumentacji Twojego sprzętu, a nie na ogólnych założeniach.",
    },
    pola: {
      zrodloId: {
        nazwa: "Źródło danych",
        cel: "Z którego źródła pokazać pomiary.",
        gdzie: "Lista źródeł dodanych na ekranie „Źródła danych telemetrii”.",
        zakres: "Jedno źródło z listy.",
      },
      oknoH: {
        nazwa: "Okno czasu wykresu",
        cel: "Jak szeroki fragment ostatniej historii obejmuje wykres i lista pomiarów.",
        gdzie: "Krótkie okno pokazuje szczegóły chwili, długie — przebieg doby.",
        zakres: "1, 6 lub 24 godziny wstecz od teraz.",
      },
      maxWiekS: {
        nazwa: "Po ilu sekundach dane uznać za nieaktualne",
        cel: "Po przekroczeniu tego czasu bez nowej próbki aplikacja ostrzeże, że widok może nie odpowiadać stanowi instalacji.",
        gdzie: "Wpisz zgodnie z tym, jak często urządzenie wysyła pomiary (kilka razy częściej niż jego okres). Puste = bez kontroli.",
        zakres: "Dodatnia liczba sekund; pusta wyłącza ostrzeżenie.",
      },
      scenariusz: {
        nazwa: "Scenariusz symulatora",
        cel: "Wybiera, jakie dane demonstracyjne wygeneruje symulator.",
        gdzie: "Tylko do oglądania ekranów bez sprzętu; dane są ilustracją, nie pomiarem.",
        zakres: "Normalna praca, zima bez słońca, alarm BMS lub zwarcie.",
      },
      progWielkosc: {
        nazwa: "Wielkość progu",
        cel: "Mówi, którego pomiaru dotyczy alarm (np. stan naładowania, temperatura).",
        gdzie: "Wybierz wielkość, którą chcesz pilnować.",
        zakres: "Jedna z wielkości fizycznych aplikacji.",
      },
      progKanal: {
        nazwa: "Kanał (opcjonalnie)",
        cel: "Zawęża alarm do jednego urządzenia, np. „bms”.",
        gdzie: "Nazwa kanału widoczna na kafelkach „Teraz” nad wartością; puste = każdy kanał tej wielkości.",
        zakres: "Dowolny tekst albo puste.",
      },
      progKierunek: {
        nazwa: "Kierunek progu",
        cel: "Określa, czy alarm ma się włączyć poniżej progu (np. niski SoC), czy powyżej (np. wysoka temperatura).",
        gdzie: "Wybierz zależnie od zagrożenia, które pilnujesz.",
        zakres: "Poniżej lub powyżej; wartość równa progowi nie wywołuje alarmu.",
      },
      progWartosc: {
        nazwa: "Wartość progu",
        cel: "Granica, po przekroczeniu której pojawia się alarm.",
        gdzie: "Weź ją z dokumentacji akumulatora/BMS lub falownika — aplikacja żadnej nie podpowiada, bo zależy od Twojego sprzętu.",
        zakres: "Liczba w jednostce wybranej wielkości; pusta nie tworzy alarmu.",
      },
      progPriorytet: {
        nazwa: "Priorytet alarmu",
        cel: "Pokazuje, jak pilna jest reakcja: informacja, ostrzeżenie (wkrótce) albo krytyczny (natychmiast).",
        gdzie: "Krytyczny wybierz dla zagrożeń bezpieczeństwa, np. przegrzania; ostrzeżenie dla spraw, które mogą poczekać.",
        zakres: "Informacja, ostrzeżenie lub krytyczny.",
      },
    },
  },
}

export const en: Tlumaczenie<typeof pl> = {
  "tryb-live": {
    migawka: {
      oCoChodzi: "The app has two modes: “Design” — you size the system from data you type in — and “Live” — you see what your installation is doing right now.",
      jakDziala: "Live mode will read data straight from the inverter and BMS over Modbus or MQTT and show it on widgets (PV power, battery SoC, alarms). That connection is not configured yet, so the screen only shows the “no telemetry” state.",
      poCo: "So that once the installation is built you can check live whether it works as designed — instead of guessing from single readings.",
    },
    pola: {},
  },
  "zrodla-telemetrii": {
    migawka: {
      oCoChodzi: "Here you register where the app gets measurements from your installation and load data from a CSV file (e.g. an export from the inverter, BMS or a weather station).",
      jakDziala: "Every source gets a name and a type. On import you point to which file column is the time and which are measurements (which quantity, in which unit). The app converts units to base ones, removes repeated samples, stores the raw samples on the device and shows a quality report: gaps, values outside the sensor's physical range, missing values and series that never change. It fills in or guesses nothing — you provide the interval between measurements and the time zone.",
      poCo: "So that Live mode charts and alarms and the history analyses rest on your real measurements rather than assumptions — and so that you immediately see whether the file's data is usable.",
    },
    pola: {
      profilWybor: {
        nazwa: "Saved mapping profile",
        cel: "Quickly fills in the column mapping for a file you have loaded before.",
        gdzie: "The list of profiles saved with the “Save the mapping as a profile” button.",
        zakres: "One of the saved profiles. A profile does not hold the sampling step — that is never guessed.",
      },
      profilNazwa: {
        nazwa: "Profile name",
        cel: "Under this name you save the current column mapping to reuse it for the next file from the same device.",
        gdzie: "Any, e.g. “Inverter – portal export”.",
        zakres: "Any non-empty text; the same name overwrites the earlier profile.",
      },
      nazwa: {
        nazwa: "Source name",
        cel: "You recognise the source by it in lists and on charts.",
        gdzie: "Any, e.g. “Inverter – portal export” or “Weather station”.",
        zakres: "Any non-empty text.",
      },
      typ: {
        nazwa: "Source type",
        cel: "Tells the app how to read the data: from an imported file, from the simulator, or from a device over the network.",
        gdzie: "CSV file — when you have an export from an inverter/BMS/station. Simulator — only for looking at the screens without hardware. HTTP — an ESP32 device on your home network.",
        zakres: "Pick from the list; Web Serial and Bluetooth sources will come after the hardware is chosen.",
      },
      url: {
        nazwa: "Device address",
        cel: "The app asks the device for current measurements at this address.",
        gdzie: "The address from the device configuration (its firmware) on your home network. A page opened over HTTPS cannot call plain http on a local network.",
        zakres: "A full address starting with http:// or https://.",
      },
      coS: {
        nazwa: "Poll every",
        cel: "How often the app asks the device for new measurements.",
        gdzie: "Choose no less often than the device records measurements; depends on the firmware.",
        zakres: "Usually 1 to 60 s; the app imposes no value.",
      },
      zrodloDocelowe: {
        nazwa: "Target source",
        cel: "The file's samples are stored in this source; you recognise it later on charts.",
        gdzie: "The list of “CSV file” sources you added above.",
        zakres: "One source from the list.",
      },
      bezNaglowka: {
        nazwa: "File without a header row",
        cel: "When the file has no column names in the first row, columns have to be given by number.",
        gdzie: "Open the file in a text editor and see whether the first row holds names or numbers right away.",
        zakres: "Tick only when the first row is already data.",
      },
      kolCzasu: {
        nazwa: "Time column",
        cel: "The app reads the moment of every measurement from it.",
        gdzie: "The column name from the first row of the file (or a number from 0 when the file has no header).",
        zakres: "A name matching the header exactly, or an integer from 0.",
      },
      formatCzasu: {
        nazwa: "Time format",
        cel: "Says how the time is written in the file so it can be read correctly.",
        gdzie: "Look at the first data row: “2026-01-31 14:00” is ISO, “31.01.2026” is DD.MM.YYYY, a long number is epoch.",
        zakres: "One of the listed formats; a wrong choice ends with rows skipped, not with wrong data.",
      },
      kolGodziny: {
        nazwa: "Time-of-day column",
        cel: "Needed when the date and the time are in separate columns.",
        gdzie: "The name or number of the column with the time (e.g. 14:00).",
        zakres: "Used only with the formats that have a separate time column.",
      },
      przesuniecie: {
        nazwa: "Offset of the file's clock from UTC [min]",
        cel: "A time without a zone mark is converted to UTC with this offset; a wrong entry shifts every sample.",
        gdzie: "The zone the logger wrote in: Central European Time is 60 in winter, 120 in summer; UTC is 0. Check the device settings.",
        zakres: "From -720 to 840 minutes; empty = 0 (UTC).",
      },
      krok: {
        nazwa: "Interval between measurements in the file [min]",
        cel: "Gaps in the data are detected from it. The app does not guess it from the data.",
        gdzie: "The recording frequency set in the logger or inverter (e.g. every 1, 5 or 15 min).",
        zakres: "A number greater than zero, usually 1–60 min.",
      },
      znaczniki: {
        nazwa: "No-measurement markers",
        cel: "Values the device uses for “no reading” — treated as missing, not as a number.",
        gdzie: "The logger documentation or the file: often -999, ///, N/A. Enter them separated by commas.",
        zakres: "Empty = no such markers.",
      },
      kolNazwa: {
        nazwa: "Measurement column",
        cel: "The values of one quantity come from this column.",
        gdzie: "The column name from the file header (or a number from 0 without a header).",
        zakres: "A name as in the file or an integer from 0.",
      },
      kanal: {
        nazwa: "Channel (device)",
        cel: "Tells measurements from different devices in one source apart, e.g. two batteries.",
        gdzie: "Your own label, e.g. “bms-1”, “mppt-a”.",
        zakres: "Any non-empty text.",
      },
      wielkosc: {
        nazwa: "Physical quantity",
        cel: "Defines what the column measures; selects the base unit and the sensor sanity range.",
        gdzie: "From the device documentation or the column header.",
        zakres: "A list of quantities; the ranges are sensor sanity bounds, not standards.",
      },
      jednostka: {
        nazwa: "Unit in the file",
        cel: "The numbers in the file are written in it; the app converts them to the base unit.",
        gdzie: "The column header or the logger documentation (e.g. kW, mA, °F).",
        zakres: "A known unit of that quantity; an unknown one ends with the row rejected, not guessed.",
      },
    },
  },
  "pomiary-na-zywo": {
    migawka: {
      oCoChodzi: "Here you see what your installation is doing now: the latest measurement values, a power chart for the chosen time window and alarms when a measurement crosses a threshold you set yourself.",
      jakDziala: "The app reads the stored samples of the chosen source and refreshes the view every few seconds. For every measurement it shows the newest valid value (missing values and values outside the sensor range are skipped, never turned into zero). An alarm appears when the latest value is below or above the threshold you entered — the app has no thresholds of its own, because they depend on your battery and installation.",
      poCo: "So you see at once whether anything needs a reaction, and so alarms rest on the limits from your equipment's documentation rather than on generic assumptions.",
    },
    pola: {
      zrodloId: {
        nazwa: "Data source",
        cel: "Which source to show measurements from.",
        gdzie: "The list of sources added on the “Telemetry data sources” screen.",
        zakres: "One source from the list.",
      },
      oknoH: {
        nazwa: "Chart time window",
        cel: "How wide a slice of recent history the chart and measurement list cover.",
        gdzie: "A short window shows the detail of the moment, a long one the course of the day.",
        zakres: "1, 6 or 24 hours back from now.",
      },
      maxWiekS: {
        nazwa: "After how many seconds data counts as stale",
        cel: "Once this time passes without a new sample the app warns that the view may not match the installation's state.",
        gdzie: "Enter it according to how often the device sends measurements (a few times its period). Empty = no check.",
        zakres: "A positive number of seconds; empty turns the warning off.",
      },
      scenariusz: {
        nazwa: "Simulator scenario",
        cel: "Chooses what demonstration data the simulator generates.",
        gdzie: "Only for looking at the screens without hardware; the data is an illustration, not a measurement.",
        zakres: "Normal operation, winter without sun, BMS alarm or short circuit.",
      },
      progWielkosc: {
        nazwa: "Threshold quantity",
        cel: "Says which measurement the alarm concerns (e.g. state of charge, temperature).",
        gdzie: "Pick the quantity you want to watch.",
        zakres: "One of the app's physical quantities.",
      },
      progKanal: {
        nazwa: "Channel (optional)",
        cel: "Narrows the alarm to one device, e.g. “bms”.",
        gdzie: "The channel name shown on the “Now” tiles above the value; empty = every channel of that quantity.",
        zakres: "Any text or empty.",
      },
      progKierunek: {
        nazwa: "Threshold direction",
        cel: "Decides whether the alarm fires below the threshold (e.g. low SoC) or above it (e.g. high temperature).",
        gdzie: "Choose according to the hazard you are watching.",
        zakres: "Below or above; a value equal to the threshold raises no alarm.",
      },
      progWartosc: {
        nazwa: "Threshold value",
        cel: "The limit beyond which an alarm appears.",
        gdzie: "Take it from the battery/BMS or inverter documentation — the app suggests none, because it depends on your equipment.",
        zakres: "A number in the unit of the chosen quantity; empty creates no alarm.",
      },
      progPriorytet: {
        nazwa: "Alarm priority",
        cel: "Shows how urgent the reaction is: information, warning (soon) or critical (immediately).",
        gdzie: "Choose critical for safety hazards such as overheating; warning for matters that can wait.",
        zakres: "Information, warning or critical.",
      },
    },
  },
}

export const ru: Tlumaczenie<typeof pl> = {
  "tryb-live": {
    migawka: {
      oCoChodzi: "В приложении два режима: «Проектирование» — вы рассчитываете систему по введённым вручную данным — и «Live» — вы видите, что установка делает прямо сейчас.",
      jakDziala: "Режим Live будет читать данные напрямую с инвертора и BMS по Modbus или MQTT и показывать их на виджетах (мощность PV, SoC батареи, аварии). Это подключение ещё не настроено, поэтому экран показывает только состояние «нет телеметрии».",
      poCo: "Чтобы после монтажа проверять в реальном времени, работает ли установка так, как спроектировано, — а не гадать по отдельным показаниям.",
    },
    pola: {},
  },
  "zrodla-telemetrii": {
    migawka: {
      oCoChodzi: "Здесь вы регистрируете, откуда приложение берёт измерения вашей установки, и загружаете данные из файла CSV (например, экспорт из инвертора, BMS или метеостанции).",
      jakDziala: "Каждый источник получает название и тип. При импорте вы указываете, какой столбец файла — время, а какие — измерения (какая величина и в какой единице). Приложение приводит единицы к базовым, удаляет повторяющиеся измерения, сохраняет исходные данные на устройстве и показывает отчёт о качестве: пропуски, значения вне физического диапазона датчика, отсутствующие значения и серии без изменений. Ничего не дополняется и не угадывается — интервал между измерениями и часовой пояс указываете вы.",
      poCo: "Чтобы графики и тревоги режима Live и анализ истории опирались на ваши реальные измерения, а не на допущения, — и чтобы сразу видеть, пригодны ли данные из файла.",
    },
    pola: {
      profilWybor: {
        nazwa: "Сохранённый профиль сопоставления",
        cel: "Быстро заполняет сопоставление столбцов для файла, который вы уже загружали.",
        gdzie: "Список профилей, сохранённых кнопкой «Сохранить сопоставление как профиль».",
        zakres: "Один из сохранённых профилей. Профиль не содержит шага измерений — он никогда не угадывается.",
      },
      profilNazwa: {
        nazwa: "Название профиля",
        cel: "Под этим названием вы сохраняете текущее сопоставление столбцов, чтобы использовать его для следующего файла с того же устройства.",
        gdzie: "Любое, например «Инвертор – экспорт с портала».",
        zakres: "Любой непустой текст; такое же название перезаписывает прежний профиль.",
      },
      nazwa: {
        nazwa: "Название источника",
        cel: "По нему вы узнаёте источник в списках и на графиках.",
        gdzie: "Любое, например «Инвертор – экспорт с портала» или «Метеостанция».",
        zakres: "Любой непустой текст.",
      },
      typ: {
        nazwa: "Тип источника",
        cel: "Сообщает приложению, как читать данные: из импортированного файла, из симулятора или с устройства по сети.",
        gdzie: "Файл CSV — когда есть экспорт из инвертора/BMS/станции. Симулятор — только для просмотра экранов без оборудования. HTTP — устройство ESP32 в домашней сети.",
        zakres: "Выбор из списка; источники Web Serial и Bluetooth появятся после выбора оборудования.",
      },
      url: {
        nazwa: "Адрес устройства",
        cel: "По этому адресу приложение запрашивает у устройства текущие измерения.",
        gdzie: "Адрес из конфигурации устройства (его прошивки) в домашней сети. Страница, открытая по HTTPS, не может обращаться к обычному http в локальной сети.",
        zakres: "Полный адрес, начинающийся с http:// или https://.",
      },
      coS: {
        nazwa: "Опрашивать каждые",
        cel: "Как часто приложение запрашивает у устройства новые измерения.",
        gdzie: "Выбирайте не реже, чем устройство записывает измерения; зависит от прошивки.",
        zakres: "Обычно от 1 до 60 с; приложение значение не навязывает.",
      },
      zrodloDocelowe: {
        nazwa: "Целевой источник",
        cel: "Измерения из файла попадут в этот источник; позже вы узнаете его на графиках.",
        gdzie: "Список источников типа «Файл CSV», добавленных выше.",
        zakres: "Один источник из списка.",
      },
      bezNaglowka: {
        nazwa: "Файл без строки заголовка",
        cel: "Если в первой строке файла нет названий столбцов, столбцы нужно указывать номером.",
        gdzie: "Откройте файл в текстовом редакторе и посмотрите, что в первой строке: названия или сразу числа.",
        zakres: "Отмечайте только если первая строка — уже данные.",
      },
      kolCzasu: {
        nazwa: "Столбец времени",
        cel: "Из него приложение читает момент каждого измерения.",
        gdzie: "Название столбца из первой строки файла (или номер с 0, если заголовка нет).",
        zakres: "Название, точно совпадающее с заголовком, или целое число с 0.",
      },
      formatCzasu: {
        nazwa: "Формат времени",
        cel: "Сообщает, как записано время в файле, чтобы его правильно прочитать.",
        gdzie: "Посмотрите на первую строку данных: «2026-01-31 14:00» — ISO, «31.01.2026» — ДД.ММ.ГГГГ, длинное число — epoch.",
        zakres: "Один из форматов списка; неверный выбор приведёт к пропуску строк, а не к неверным данным.",
      },
      kolGodziny: {
        nazwa: "Столбец времени суток",
        cel: "Нужен, когда дата и время находятся в отдельных столбцах.",
        gdzie: "Название или номер столбца со временем (например, 14:00).",
        zakres: "Используется только в форматах с отдельным столбцом времени.",
      },
      przesuniecie: {
        nazwa: "Смещение часов файла относительно UTC [мин]",
        cel: "Время без указания пояса приводится к UTC этим смещением; неверное значение сдвигает все измерения.",
        gdzie: "Пояс, в котором писал логгер: центральноевропейское время зимой — 60, летом — 120; UTC — 0. Проверьте настройки устройства.",
        zakres: "От -720 до 840 минут; пусто = 0 (UTC).",
      },
      krok: {
        nazwa: "Интервал между измерениями в файле [мин]",
        cel: "По нему обнаруживаются пропуски в данных. Приложение не угадывает его по данным.",
        gdzie: "Частота записи, заданная в логгере или инверторе (например, каждые 1, 5 или 15 мин).",
        zakres: "Число больше нуля, обычно 1–60 мин.",
      },
      znaczniki: {
        nazwa: "Маркеры отсутствия измерения",
        cel: "Значения, которыми устройство обозначает «нет показаний», — считаются пропуском, а не числом.",
        gdzie: "Документация логгера или файл: часто -999, ///, N/A. Вводите через запятую.",
        zakres: "Пусто = таких маркеров нет.",
      },
      kolNazwa: {
        nazwa: "Столбец с измерением",
        cel: "Из этого столбца берутся значения одной величины.",
        gdzie: "Название столбца из заголовка файла (или номер с 0 без заголовка).",
        zakres: "Название как в файле или целое число с 0.",
      },
      kanal: {
        nazwa: "Канал (устройство)",
        cel: "Отличает измерения разных устройств в одном источнике, например двух батарей.",
        gdzie: "Ваша метка, например «bms-1», «mppt-a».",
        zakres: "Любой непустой текст.",
      },
      wielkosc: {
        nazwa: "Физическая величина",
        cel: "Определяет, что измеряет столбец; подбирает базовую единицу и диапазон допустимости датчика.",
        gdzie: "Из документации устройства или заголовка столбца.",
        zakres: "Список величин; диапазоны — границы допустимости датчика, а не нормы.",
      },
      jednostka: {
        nazwa: "Единица в файле",
        cel: "В ней записаны числа в файле; приложение приводит их к базовой единице.",
        gdzie: "Заголовок столбца или документация логгера (например, kW, mA, °F).",
        zakres: "Известная единица этой величины; неизвестная приводит к отклонению строки, а не к угадыванию.",
      },
    },
  },
  "pomiary-na-zywo": {
    migawka: {
      oCoChodzi: "Здесь вы видите, что делает ваша установка сейчас: последние значения измерений, график мощности за выбранный период и тревоги, когда измерение выходит за порог, который вы задали сами.",
      jakDziala: "Приложение читает сохранённые измерения выбранного источника и обновляет вид каждые несколько секунд. Для каждого измерения показывает последнее корректное значение (пропуски и значения вне диапазона датчика пропускаются, но никогда не заменяются нулём). Тревога возникает, когда последнее значение ниже или выше введённого вами порога — собственных порогов у приложения нет, потому что они зависят от вашего аккумулятора и установки.",
      poCo: "Чтобы сразу видеть, требуется ли реакция, и чтобы тревоги опирались на пределы из документации вашего оборудования, а не на общие допущения.",
    },
    pola: {
      zrodloId: {
        nazwa: "Источник данных",
        cel: "Из какого источника показывать измерения.",
        gdzie: "Список источников, добавленных на экране «Источники данных телеметрии».",
        zakres: "Один источник из списка.",
      },
      oknoH: {
        nazwa: "Период графика",
        cel: "Какой фрагмент недавней истории охватывают график и список измерений.",
        gdzie: "Короткий период показывает детали момента, длинный — ход суток.",
        zakres: "1, 6 или 24 часа назад от текущего момента.",
      },
      maxWiekS: {
        nazwa: "Через сколько секунд данные считать устаревшими",
        cel: "Если за это время нет новых измерений, приложение предупредит, что вид может не соответствовать состоянию установки.",
        gdzie: "Укажите с учётом того, как часто устройство присылает измерения (в несколько раз больше его периода). Пусто = без проверки.",
        zakres: "Положительное число секунд; пусто отключает предупреждение.",
      },
      scenariusz: {
        nazwa: "Сценарий симулятора",
        cel: "Определяет, какие демонстрационные данные создаст симулятор.",
        gdzie: "Только для просмотра экранов без оборудования; данные — иллюстрация, а не измерение.",
        zakres: "Обычная работа, зима без солнца, тревога BMS или короткое замыкание.",
      },
      progWielkosc: {
        nazwa: "Величина порога",
        cel: "Указывает, какого измерения касается тревога (например, уровень заряда, температура).",
        gdzie: "Выберите величину, за которой хотите следить.",
        zakres: "Одна из физических величин приложения.",
      },
      progKanal: {
        nazwa: "Канал (необязательно)",
        cel: "Ограничивает тревогу одним устройством, например «bms».",
        gdzie: "Название канала над значением на плитках «Сейчас»; пусто = любой канал этой величины.",
        zakres: "Любой текст или пусто.",
      },
      progKierunek: {
        nazwa: "Направление порога",
        cel: "Определяет, срабатывает ли тревога ниже порога (например, низкий SoC) или выше (например, высокая температура).",
        gdzie: "Выберите в зависимости от опасности, за которой следите.",
        zakres: "Ниже или выше; значение, равное порогу, тревогу не вызывает.",
      },
      progWartosc: {
        nazwa: "Значение порога",
        cel: "Граница, при пересечении которой появляется тревога.",
        gdzie: "Возьмите её из документации аккумулятора/BMS или инвертора — приложение ничего не подсказывает, так как это зависит от вашего оборудования.",
        zakres: "Число в единице выбранной величины; пусто не создаёт тревоги.",
      },
      progPriorytet: {
        nazwa: "Приоритет тревоги",
        cel: "Показывает срочность реакции: информация, предупреждение (скоро) или критический (немедленно).",
        gdzie: "Критический выбирайте для угроз безопасности, например перегрева; предупреждение — для вопросов, которые могут подождать.",
        zakres: "Информация, предупреждение или критический.",
      },
    },
  },
}
