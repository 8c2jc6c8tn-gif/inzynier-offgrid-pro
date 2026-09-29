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
}
