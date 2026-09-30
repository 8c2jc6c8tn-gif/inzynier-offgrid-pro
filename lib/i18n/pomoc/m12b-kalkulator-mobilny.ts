/**
 * Help content — Module 12, screens built on 30.09.2026 (second file of the module, so work on the
 * older M12 screens in `m12-kalkulator-mobilny.ts` does not collide with this batch). Same rules:
 * ranges only from the engines' constants and sources in the repo (Directive #1).
 */
import type { Tlumaczenie } from "./typy"

export const pl = {
  "akumulator-samochodowy": {
    migawka: {
      oCoChodzi:
        "Ile godzin popracują urządzenia (lodówka, światło, ładowarki) na akumulatorze samochodowym — i kiedy trzeba przestać, żeby jeszcze odpalić silnik.",
      jakDziala:
        "Aplikacja bierze tylko tę część pojemności, którą wolno zużyć (wpisujesz ją sam), liczy prąd pobierany przez urządzenia (moc ÷ napięcie) i dzieli jedno przez drugie. Jeśli wpiszesz planowany czas, porówna go z wynikiem: dla akumulatora rozruchowego przekroczenie to czerwony stop.",
      poCo:
        "Akumulator samochodowy to nie powerbank. Rozruchowy ma mało energii do wykorzystania i nie lubi głębokiego rozładowania — użyty źle padnie szybciej, niż sugeruje naklejka, a rano auto nie zapali.",
      fizyka:
        "Prąd I = P / U (np. 50 W przy 12 V to ok. 4,2 A). Czas t = pojemność użyteczna [Ah] / I. Przykład ze źródła: 60 Ah rozruchowy, użyteczne ok. 30 Ah, lodówka 50 W → ok. 7 h.",
    },
    pola: {
      typ: {
        nazwa: "Typ akumulatora",
        cel: "Od typu zależy ocena: rozruchowy (zwykły samochodowy) nie jest zbudowany do głębokiego rozładowania, AGM i kwasowy głębokiego rozładowania znoszą je lepiej.",
        gdzie: "Na naklejce: zwykły akumulator w aucie to rozruchowy (podaje prąd rozruchu, np. „540 A EN”). Napis AGM — AGM. „Deep cycle”, „solar”, „trakcyjny” — kwasowy głębokiego rozładowania.",
        zakres: "Jedna z trzech opcji. Nie wiesz, a to akumulator z auta? Wybierz rozruchowy.",
      },
      pojemnosc: {
        nazwa: "Pojemność znamionowa [Ah]",
        cel: "Ile ładunku mieści akumulator. Z niej aplikacja bierze część użyteczną.",
        gdzie: "Na naklejce akumulatora, np. „60 Ah”.",
        zakres: "Z naklejki lub karty katalogowej akumulatora.",
      },
      napiecie: {
        nazwa: "Napięcie akumulatora [V]",
        cel: "Zamienia moc urządzeń na prąd (I = P / U).",
        gdzie: "Na naklejce: w autach osobowych 12 V, w ciężarówkach często 24 V (dwa akumulatory szeregowo).",
        zakres: "Zwykle 12 V albo 24 V.",
      },
      uzyteczna: {
        nazwa: "Część pojemności, którą wolno zużyć [%]",
        cel: "Tylko tę część aplikacja „wyjmuje” z akumulatora. Reszta zostaje na rozruch silnika i ochronę akumulatora.",
        gdzie: "Dla AGM i akumulatorów głębokiego rozładowania — z karty katalogowej (liczba cykli przy danej głębokości rozładowania).",
        zakres: "Dla rozruchowego źródło podaje zwykle {min}–{max}%. Aplikacja nie wybiera wartości za Ciebie.",
      },
      moc: {
        nazwa: "Łączna moc urządzeń [W]",
        cel: "Z mocy aplikacja liczy prąd pobierany z akumulatora.",
        gdzie: "Na tabliczkach urządzeń albo w instrukcji. Zsumuj urządzenia pracujące jednocześnie. Przy urządzeniach 230 V przez przetwornicę dodaj jej straty.",
        zakres: "Z tabliczek urządzeń.",
      },
      planowany: {
        nazwa: "Planowany czas pracy [h] (opcjonalnie)",
        cel: "Porównanie planu z wynikiem. Dla rozruchowego plan dłuższy niż wynik to czerwony stop.",
        gdzie: "Ile godzin chcesz zasilać urządzenia, np. przez noc na postoju.",
        zakres: "Puste = bez oceny planu.",
      },
    },
  },
}

export const en: Tlumaczenie<typeof pl> = {
  "akumulator-samochodowy": {
    migawka: {
      oCoChodzi:
        "How many hours devices (fridge, lights, chargers) can run on a car battery — and when to stop so you can still start the engine.",
      jakDziala:
        "The app takes only the share of capacity you may use (you enter it), works out the current drawn by the devices (power ÷ voltage) and divides one by the other. If you enter a planned runtime, it compares it with the result: for a starter battery, going beyond it is a red stop.",
      poCo:
        "A car battery is not a power bank. A starter battery has little usable energy and dislikes deep discharge — misused it dies sooner than the label suggests, and in the morning the car won't start.",
      fizyka:
        "Current I = P / U (e.g. 50 W at 12 V is about 4.2 A). Time t = usable capacity [Ah] / I. Source example: 60 Ah starter battery, about 30 Ah usable, 50 W fridge → about 7 h.",
    },
    pola: {
      typ: {
        nazwa: "Battery type",
        cel: "The verdict depends on the type: a starter battery (ordinary car battery) is not built for deep discharge; AGM and deep-cycle flooded batteries handle it better.",
        gdzie: "On the label: an ordinary car battery is a starter battery (it states cranking current, e.g. \"540 A EN\"). \"AGM\" — AGM. \"Deep cycle\", \"solar\", \"traction\" — deep-cycle flooded.",
        zakres: "One of three options. Not sure and it's the battery from the car? Choose starter.",
      },
      pojemnosc: {
        nazwa: "Rated capacity [Ah]",
        cel: "How much charge the battery holds. The app takes the usable share from it.",
        gdzie: "On the battery label, e.g. \"60 Ah\".",
        zakres: "From the label or the battery datasheet.",
      },
      napiecie: {
        nazwa: "Battery voltage [V]",
        cel: "Converts the devices' power into current (I = P / U).",
        gdzie: "On the label: 12 V in passenger cars, often 24 V in trucks (two batteries in series).",
        zakres: "Usually 12 V or 24 V.",
      },
      uzyteczna: {
        nazwa: "Share of capacity you may use [%]",
        cel: "Only this share is \"taken out\" of the battery. The rest stays for cranking and to protect the battery.",
        gdzie: "For AGM and deep-cycle batteries — from the datasheet (number of cycles at a given depth of discharge).",
        zakres: "For a starter battery the source gives usually {min}–{max}%. The app does not choose a value for you.",
      },
      moc: {
        nazwa: "Total power of devices [W]",
        cel: "From power the app works out the current drawn from the battery.",
        gdzie: "On the devices' nameplates or in the manual. Add up devices running at the same time. For 230 V devices on an inverter add its losses.",
        zakres: "From the devices' nameplates.",
      },
      planowany: {
        nazwa: "Planned runtime [h] (optional)",
        cel: "Compares the plan with the result. For a starter battery a plan longer than the result is a red stop.",
        gdzie: "How many hours you want to power the devices, e.g. overnight while parked.",
        zakres: "Empty = no check of the plan.",
      },
    },
  },
}

export const ru: Tlumaczenie<typeof pl> = {
  "akumulator-samochodowy": {
    migawka: {
      oCoChodzi:
        "Сколько часов проработают устройства (холодильник, свет, зарядки) от автомобильного аккумулятора — и когда нужно остановиться, чтобы ещё завести двигатель.",
      jakDziala:
        "Приложение берёт только ту часть ёмкости, которую можно израсходовать (её вводите вы), считает ток устройств (мощность ÷ напряжение) и делит одно на другое. Если ввести планируемое время, оно сравнит его с результатом: для стартерного аккумулятора превышение — красный стоп.",
      poCo:
        "Автомобильный аккумулятор — не пауэрбанк. У стартерного мало полезной энергии, и он не любит глубокого разряда — при неправильном использовании выйдет из строя быстрее, чем обещает наклейка, а утром машина не заведётся.",
      fizyka:
        "Ток I = P / U (например, 50 Вт при 12 В — около 4,2 А). Время t = полезная ёмкость [А·ч] / I. Пример из источника: стартерный 60 А·ч, полезных около 30 А·ч, холодильник 50 Вт → около 7 ч.",
    },
    pola: {
      typ: {
        nazwa: "Тип аккумулятора",
        cel: "От типа зависит оценка: стартерный (обычный автомобильный) не рассчитан на глубокий разряд, AGM и кислотный глубокого разряда переносят его лучше.",
        gdzie: "На наклейке: обычный аккумулятор в машине — стартерный (указан пусковой ток, например «540 A EN»). Надпись AGM — AGM. «Deep cycle», «solar», «тяговый» — кислотный глубокого разряда.",
        zakres: "Один из трёх вариантов. Не знаете, а это аккумулятор из машины? Выберите стартерный.",
      },
      pojemnosc: {
        nazwa: "Номинальная ёмкость [А·ч]",
        cel: "Сколько заряда вмещает аккумулятор. Из неё приложение берёт полезную часть.",
        gdzie: "На наклейке аккумулятора, например «60 Ah».",
        zakres: "С наклейки или из паспорта аккумулятора.",
      },
      napiecie: {
        nazwa: "Напряжение аккумулятора [В]",
        cel: "Переводит мощность устройств в ток (I = P / U).",
        gdzie: "На наклейке: в легковых машинах 12 В, в грузовиках часто 24 В (два аккумулятора последовательно).",
        zakres: "Обычно 12 В или 24 В.",
      },
      uzyteczna: {
        nazwa: "Часть ёмкости, которую можно израсходовать [%]",
        cel: "Только эту часть приложение «берёт» из аккумулятора. Остальное остаётся на пуск двигателя и защиту аккумулятора.",
        gdzie: "Для AGM и аккумуляторов глубокого разряда — из паспорта (число циклов при данной глубине разряда).",
        zakres: "Для стартерного источник даёт обычно {min}–{max}%. Приложение не выбирает значение за вас.",
      },
      moc: {
        nazwa: "Суммарная мощность устройств [Вт]",
        cel: "По мощности приложение считает ток, потребляемый от аккумулятора.",
        gdzie: "На табличках устройств или в инструкции. Сложите устройства, работающие одновременно. Для устройств 230 В через инвертор добавьте его потери.",
        zakres: "С табличек устройств.",
      },
      planowany: {
        nazwa: "Планируемое время работы [ч] (необязательно)",
        cel: "Сравнение плана с результатом. Для стартерного план длиннее результата — красный стоп.",
        gdzie: "Сколько часов вы хотите питать устройства, например ночью на стоянке.",
        zakres: "Пусто — без оценки плана.",
      },
    },
  },
}
