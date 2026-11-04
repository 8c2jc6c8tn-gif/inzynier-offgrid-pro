// Russian texts of ./ekrany-rozne.ts — the same keys as `pl` (a missing or an extra key is a compile error).
import type { pl } from "./ekrany-rozne"

type Klucz = keyof typeof pl

export const ru: Record<Klucz, string> = {
  "UI-OCHWIL-MOKRY-BMS-MIEDZIANE":
    "Мокрый BMS и медные шины — готовый рецепт короткого замыкания: конденсация — тихий убийца электроники. Модуль 4, экран 10.",
  "UI-OCHWIL-WYPELNIJ-DANE-ZEBY": "Заполните данные, чтобы увидеть оценку риска конденсации.",
  "UI-OCHWIL-PUNKT-ROSY": "Точка росы: {punktRosyC}°C",
  "UI-OCHWIL-OCHRONA-PRZED-WILGOCIA": "Защита от влаги и конденсации",
  "UI-OCHWIL-TEMPERATURA-OTOCZENIA": "Температура окружающей среды",
  "UI-OCHWIL-WILGOTNOSC-WZGLEDNA": "Относительная влажность",
  "UI-OCHWIL-TEMPERATURA-OBUDOWY-OGNIW": "Температура корпуса / ячеек",
  "UI-OCHWIL-KOD-OBUDOWY": "Код IP корпуса",
  "UI-OCHWIL-MIEJSCE-NARAZONE-WILGOC": "Место, подверженное влаге (гараж, наружный отсек)",
  "UI-OCHWIL-OCENIC-SPRAWDZ-WPISANE": "Невозможно оценить — проверьте введённые данные",
  "UI-OCHWIL-OBUDOWA-PONIZEJ-WYMAGANEGO": "Корпус ниже требуемого IP",
  "UI-OCHWIL-RYZYKO-KONDENSACJI": "Риск конденсации",
  "UI-OCHWIL-BEZ-RYZYKA-KONDENSACJI": "Нет риска конденсации",
  "UI-PRO-POGODA-SYSTEMU-ENERGETYCZNEG":
    "Это «погода» вашей энергосистемы — не только атмосферная, а вся: сколько у вас будет электроэнергии, сколько вы потратите и когда будет туго. Модуль 10, экран 1.",
  "UI-PRO-BILANS-DOBOWY-KWH": "Суточный баланс: {bilansKwh} кВт·ч",
  "UI-PRO-PRODUKCJA-KWH-ZUZYCIE":
    "Выработка {produkcjaLacznaKwh} кВт·ч, потребление {zuzycieLaczneKwh} кВт·ч. Пик потребления в {godzinaSzczytuZuzycia}:00.",
  "UI-PRO-PRODUKCJA": "Выработка [кВт]",
  "UI-PRO-ZUZYCIE": "Потребление [кВт]",
  "UI-PRO-PROGNOZY": "Прогнозы",
  "UI-PRO-WPISZ": "Введите среднюю мощность выработки PV и потребления в каждом 3-часовом окне (например, из прогноза инвертора, метеосервиса или ваших измерений). Я рассчитаю суточный баланс и час пика потребления.",
  "UI-PRO-WSTAW-PRZYKLAD": "Вставить пример (демо-данные)",
  "UI-PRO-WYCZYSC": "Очистить поля",
  "UI-PRO-UZUPELNIJ": "Заполните выработку и потребление во всех восьми окнах, чтобы увидеть суточный баланс.",
  "UI-PRO-SPRAWDZ": "Проверьте данные",
  "UI-OCHPRZROZ-DOZOWNIK-NAPIECIA-LVD":
    "Отключатель по низкому напряжению (LVD) отключает потребитель, прежде чем тот разрядит аккумулятор слишком глубоко. Модуль 12.",
  "UI-OCHPRZROZ-KWASOWY-ZALEWOWY": "Свинцово-кислотный (заливной)",
  "UI-OCHPRZROZ-LIFEPO4": "LiFePO4",
  "UI-OCHPRZROZ-WYBIERZ-TYP-NAPIECIE": "Выберите тип и напряжение аккумулятора, чтобы увидеть порог отключения.",
  "UI-OCHPRZROZ-OGNIWO-OGNIW-SZEREGU": "{progNaOgniwoV} В на элемент · {liczbaOgniw} элементов последовательно",
  "UI-OCHPRZROZ-OCHRONA-PRZED-ROZLADOWANIEM": "Защита аккумулятора от глубокого разряда",
  "UI-OCHPRZROZ-TYP-AKUMULATORA": "Тип аккумулятора",
  "UI-OCHPRZROZ-NAPIECIE-ZNAMIONOWE": "Номинальное напряжение",
  "UI-OCHPRZROZ-MAM-DOZOWNIK-NAPIECIA": "У меня есть отключатель по низкому напряжению (LVD)",
  "UI-OCHPRZROZ-ODBIORNIK-SAM-ODCINA": "Потребитель сам отключается при низком напряжении",
  "UI-OCHPRZROZ-LODOWKA-TURYSTYCZNA-WBUDOWAN":
    "Например, туристический холодильник со встроенной защитой аккумулятора.",
  "UI-OCHPRZROZ-AKUMULATOR-BEZ-OCHRONY": "Аккумулятор без защиты",
  "UI-OCHPRZROZ-PROG-ODCIECIA-DOZOWNIKA": "Порог отключения LVD",
  "UI-OCHPRZROZ-KARTY-PRODUCENTA": "по паспорту производителя",
  "UI-PANDOSTAZAS-STACJE-ZASILANIA-MAJA":
    "У портативных электростанций входные пределы ниже, чем у профессиональных MPPT-контроллеров, — панель, подобранная под «взрослую» установку, легко их повредит, особенно в мороз. Модуль 12.",
  "UI-PANDOSTAZAS-OPCJONALNIE-SPRAWDZENIE-PRAD": "Необязательно — проверка тока:",
  "UI-PANDOSTAZAS-WYPELNIJ-PIEC-PIERWSZYCH": "Заполните первые пять полей, чтобы увидеть результат.",
  "UI-PANDOSTAZAS-LIMITU-WEJSCIA": "{udzialLimituPct}% от предела входа",
  "UI-PANDOSTAZAS-PRZEKROCZONY-LIMIT-WEJSCIA": "Превышен предел входа станции",
  "UI-PANDOSTAZAS-GRANICY-SPRAWDZ": "На пределе — проверьте",
  "UI-PANDOSTAZAS-MOZNA-PODLACZYC": "Можно подключать",
  "UI-PANDOSTAZAS-LACZENIE-PANELI-STACJA": "Подключение панелей к портативной электростанции / пауэрбанку",
  "UI-PANDOSTAZAS-VOC-PANELU-STC": "Voc панели (STC)",
  "UI-PANDOSTAZAS-WSPOLCZYNNIK-TEMPERATUROWY-V": "Температурный коэффициент Voc (β)",
  "UI-PANDOSTAZAS-NAJNIZSZA-TEMPERATURA-PRACY": "Самая низкая рабочая температура",
  "UI-PANDOSTAZAS-PANELI-POLACZONYCH-SZEREGOWO": "Панелей, соединённых последовательно",
  "UI-PANDOSTAZAS-MAX-NAPIECIE-WEJSCIA": "Макс. напряжение солнечного входа станции",
  "UI-PANDOSTAZAS-PRAD-ZWARCIOWY-PANELU": "Ток короткого замыкания панели (Isc)",
  "UI-PANDOSTAZAS-GALEZI-ROWNOLEGLYCH": "Параллельных ветвей",
  "UI-PANDOSTAZAS-MAX-PRAD-WEJSCIA": "Макс. ток солнечного входа станции",
  "UI-PANDOSTAZAS-POLICZYC-SPRAWDZ-WPISANE": "Невозможно рассчитать — проверьте введённые данные",
  "UI-PANDOSTAZAS-PRAD-ZWARCIOWY": "· ток короткого замыкания {pradZwarciowyA} А",
  "UI-TRYLIV-PRZELACZNIK-MIEDZY-TRYBEM":
    "Переключатель между режимом «Проектирование» (плитки 1–12) и режимом «Live» (текущий мониторинг). Модуль 13, экран 1.",
  "UI-TRYLIV-TRYB-LIVE-CZERPIE":
    "Режим Live получает данные от инвертора/BMS в реальном времени через Modbus или MQTT — это соединение ещё не настроено. После подключения этот экран станет входом в библиотеку виджетов (экран 2: дашборд с выбираемыми виджетами — мощность PV, SoC батареи, аварии и другое, docs/zrodla/Tresc_Modul_13_Live_Ekrany.md).",
  "UI-TRYLIV-CZASU-PODLACZENIA-TELEMETRII":
    "До подключения телеметрии пользуйтесь остальными модулями в режиме проектирования — они считают по данным, которые вы вводите вручную, а не в реальном времени.",
  "UI-TRYLIV-TRYB-LIVE": "Режим Live",
  "UI-TRYLIV-BRAK-POLACZENIA-TELEMETRIA": "⚪ Нет соединения с телеметрией",
}
