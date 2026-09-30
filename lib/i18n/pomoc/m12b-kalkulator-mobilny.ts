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
  "mam-akumulator": {
    migawka: {
      oCoChodzi:
        "Sprawdzasz, co faktycznie możesz podłączyć do akumulatora, który już masz — i jak długo każde urządzenie na nim popracuje.",
      jakDziala:
        "Aplikacja liczy energię do wykorzystania: pojemność × napięcie × dopuszczalna głębokość rozładowania × sprawność przetwornicy. Potem dzieli ją przez moc każdego urządzenia (czas pracy osobno) i przez sumę mocy (wszystko naraz). Jeśli podasz maksymalny prąd akumulatora, ostrzeże przed urządzeniem, które pobiera więcej.",
      poCo:
        "To odwrotność typowego pytania: zamiast „jaki akumulator kupić” — „co zrobię z tym, co mam”. Duże odbiorniki (czajnik, suszarka) szybko wyczerpią akumulator, a ich prąd może przekroczyć możliwości akumulatora albo BMS.",
      fizyka:
        "Energia E = C × U × DoD × η. Czas t = E / P. Prąd z akumulatora I = P / (U × η). Przykład ze źródła: 12 V 100 Ah, użyteczne 1,2 kWh — lodówka 50 W ok. 24 h, LED 20 W ok. 60 h, czajnik 1000 W ok. 1,2 h (prąd ok. 100 A).",
    },
    pola: {
      chemia: {
        nazwa: "Typ akumulatora",
        cel: "Od typu zależy, jak głęboko wolno go rozładować — podpowiedź przy polu DoD.",
        gdzie: "Na naklejce lub w karcie katalogowej: AGM, LiFePO4 (litowy), kwasowy zalewany (z korkami).",
        zakres: "Jedna z trzech opcji.",
      },
      pojemnosc: {
        nazwa: "Pojemność znamionowa [Ah]",
        cel: "Ile ładunku mieści akumulator.",
        gdzie: "Na naklejce, np. „100 Ah”.",
        zakres: "Z naklejki lub karty katalogowej.",
      },
      napiecie: {
        nazwa: "Napięcie akumulatora [V]",
        cel: "Zamienia pojemność [Ah] na energię [Wh] i moc urządzeń na prąd.",
        gdzie: "Na naklejce: 12 V, 24 V albo 48 V.",
        zakres: "Zwykle 12, 24 albo 48 V.",
      },
      dod: {
        nazwa: "Dopuszczalna głębokość rozładowania — DoD [%]",
        cel:
          "Jaką część pojemności wolno zużyć bez skracania życia akumulatora. Tylko tę część aplikacja bierze do obliczeń.",
        gdzie: "Karta katalogowa akumulatora (liczba cykli przy danej głębokości rozładowania).",
        zakres:
          "Dla LiFePO4 typowo {min}–{max}%. Dla AGM i kwasowego — z karty katalogowej; aplikacja nie wybiera wartości za Ciebie.",
      },
      sprawnosc: {
        nazwa: "Sprawność przetwornicy [%]",
        cel:
          "Urządzenia 230 V zasilane przez przetwornicę zabierają z akumulatora więcej, niż same pobierają. Straty przetwornicy skracają czas pracy.",
        gdzie:
          "Karta katalogowa przetwornicy (sprawność przy typowym obciążeniu). Urządzenia 12/24 V podłączone wprost — wpisz 100.",
        zakres: "Z karty przetwornicy; 100 bez przetwornicy.",
      },
      maksPrad: {
        nazwa: "Maksymalny prąd ciągły akumulatora [A] (opcjonalnie)",
        cel:
          "Porównanie z prądem każdego urządzenia — za duży prąd może wyłączyć BMS, przegrzać połączenia albo zniszczyć akumulator.",
        gdzie: "Karta katalogowa akumulatora albo BMS („max continuous discharge current”).",
        zakres: "Z karty; puste = bez oceny prądu.",
      },
      nazwa: {
        nazwa: "Nazwa urządzenia",
        cel: "Żebyś rozpoznał urządzenie na liście wyników.",
        gdzie: "Dowolna nazwa, np. „lodówka”.",
        zakres: "Dowolny tekst.",
      },
      moc: {
        nazwa: "Moc urządzenia [W]",
        cel: "Z mocy aplikacja liczy czas pracy i prąd.",
        gdzie:
          "Tabliczka znamionowa, instrukcja albo wyszukaj swój model w internecie. Dla lodówki ze sprężarką wpisz moc średnią, jeśli ją znasz.",
        zakres: "Z tabliczki Twojego urządzenia.",
      },
    },
  },
  "agregat-paliwo": {
    migawka: {
      oCoChodzi:
        "Agregat to mały smok, który pije paliwo — trzeba wiedzieć, ile zje i ile kosztuje każda kilowatogodzina z niego.",
      jakDziala:
        "Zużycie paliwa z karty agregatu [l/h] × godziny pracy na dobę = litry na dobę. Litry × cena = koszt. Moc × obciążenie × godziny = energia oddana na dobę. Koszt ÷ energia = cena 1 kWh. Do tego pytania bezpieczeństwa: gdzie stoi agregat i jak jest podłączony.",
      poCo:
        "Agregat pracuje zwykle tylko wtedy, gdy akumulator jest niski. Wiedząc, ile kosztuje kWh z paliwa, łatwiej zdecydować, czy dołożyć panel albo akumulator zamiast palić benzynę.",
      fizyka:
        "Przykład ze źródła: agregat 2 kW przy obciążeniu 50% zużywa 0,5 l/h; przy 3 h/dobę spali 1,5 l (ok. 10 zł/dobę) i odda 2 × 0,5 × 3 = 3 kWh.",
    },
    pola: {
      moc: {
        nazwa: "Moc znamionowa agregatu [kW]",
        cel: "Z mocy i obciążenia aplikacja liczy energię oddaną na dobę.",
        gdzie: "Tabliczka lub karta agregatu — moc ciągła (znamionowa), nie maksymalna.",
        zakres: "Z karty agregatu.",
      },
      obciazenie: {
        nazwa: "Średnie obciążenie [%]",
        cel: "Jaką część mocy znamionowej faktycznie pobierają odbiorniki i ładowarka w czasie pracy.",
        gdzie: "Suma mocy tego, co podłączasz (ładowarka, odbiorniki) ÷ moc agregatu × 100.",
        zakres: "0–100%.",
      },
      zuzycie: {
        nazwa: "Zużycie paliwa [l/h]",
        cel: "Podstawa wyniku — ile litrów agregat spala w godzinę przy wpisanym obciążeniu.",
        gdzie:
          "Karta katalogowa agregatu (zużycie przy danym obciążeniu, często podane dla 50% i 75%) albo własny pomiar: zatankuj do pełna, pracuj godzinę, dolej i zmierz.",
        zakres: "Z karty agregatu przy Twoim obciążeniu — aplikacja nie zgaduje krzywej zużycia.",
      },
      godziny: {
        nazwa: "Godziny pracy na dobę [h]",
        cel: "Agregat nie pracuje cały czas — tylko gdy akumulator jest niski albo trzeba zasilić duży odbiornik.",
        gdzie: "Twój plan lub obserwacja.",
        zakres: "0–24 h.",
      },
      cena: {
        nazwa: "Cena paliwa [zł/l]",
        cel: "Zamienia litry na złotówki.",
        gdzie: "Aktualna cena na stacji.",
        zakres: "Aktualna cena.",
      },
      porownanie: {
        nazwa: "Koszt 1 kWh z innego źródła [zł/kWh] (opcjonalnie)",
        cel: "Porównanie: ile razy drożej kosztuje kWh z agregatu.",
        gdzie: "Rachunek za prąd (cena brutto za kWh) albo koszt kWh z Twojego zestawu PV z innych ekranów.",
        zakres: "Puste = bez porównania.",
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
  "mam-akumulator": {
    migawka: {
      oCoChodzi:
        "You check what you can actually connect to the battery you already have — and how long each device will run on it.",
      jakDziala:
        "The app computes the usable energy: capacity × voltage × allowed depth of discharge × inverter efficiency. Then it divides it by the power of each device (runtime on its own) and by the total power (everything at once). If you enter the battery's maximum current, it warns about a device that draws more.",
      poCo:
        "It is the reverse of the usual question: instead of “which battery to buy” — “what can I do with what I have”. Large loads (kettle, hair dryer) drain the battery fast, and their current may exceed what the battery or BMS can deliver.",
      fizyka:
        "Energy E = C × U × DoD × η. Time t = E / P. Battery current I = P / (U × η). Example from the source: 12 V 100 Ah, 1.2 kWh usable — 50 W fridge about 24 h, 20 W LED about 60 h, 1000 W kettle about 1.2 h (current about 100 A).",
    },
    pola: {
      chemia: {
        nazwa: "Battery type",
        cel: "The type decides how deeply it may be discharged — see the hint at the DoD field.",
        gdzie: "On the label or in the datasheet: AGM, LiFePO4 (lithium), flooded lead-acid (with caps).",
        zakres: "One of three options.",
      },
      pojemnosc: {
        nazwa: "Rated capacity [Ah]",
        cel: "How much charge the battery holds.",
        gdzie: "On the label, e.g. “100 Ah”.",
        zakres: "From the label or datasheet.",
      },
      napiecie: {
        nazwa: "Battery voltage [V]",
        cel: "Turns capacity [Ah] into energy [Wh] and device power into current.",
        gdzie: "On the label: 12 V, 24 V or 48 V.",
        zakres: "Usually 12, 24 or 48 V.",
      },
      dod: {
        nazwa: "Allowed depth of discharge — DoD [%]",
        cel:
          "Which part of the capacity may be used without shortening battery life. Only this part goes into the calculation.",
        gdzie: "Battery datasheet (number of cycles at a given depth of discharge).",
        zakres:
          "For LiFePO4 typically {min}–{max}%. For AGM and flooded — from the datasheet; the app does not pick a value for you.",
      },
      sprawnosc: {
        nazwa: "Inverter efficiency [%]",
        cel:
          "230 V devices powered through an inverter take more from the battery than they consume themselves. Inverter losses shorten the runtime.",
        gdzie: "Inverter datasheet (efficiency at typical load). 12/24 V devices connected directly — enter 100.",
        zakres: "From the inverter datasheet; 100 without an inverter.",
      },
      maksPrad: {
        nazwa: "Maximum continuous battery current [A] (optional)",
        cel:
          "Compared with each device's current — too much current may trip the BMS, overheat connections or damage the battery.",
        gdzie: "Battery or BMS datasheet (“max continuous discharge current”).",
        zakres: "From the datasheet; empty = no current check.",
      },
      nazwa: {
        nazwa: "Device name",
        cel: "So you recognise the device in the results.",
        gdzie: "Any name, e.g. “fridge”.",
        zakres: "Any text.",
      },
      moc: {
        nazwa: "Device power [W]",
        cel: "The app uses the power to compute runtime and current.",
        gdzie:
          "Nameplate, manual or search for your model online. For a compressor fridge enter the average power if you know it.",
        zakres: "From your device's nameplate.",
      },
    },
  },
  "agregat-paliwo": {
    migawka: {
      oCoChodzi:
        "A generator is a small dragon that drinks fuel — you need to know how much it will eat and what every kilowatt-hour from it costs.",
      jakDziala:
        "Fuel consumption from the generator datasheet [l/h] × running hours per day = litres per day. Litres × price = cost. Power × load × hours = energy delivered per day. Cost ÷ energy = price of 1 kWh. Plus the safety questions: where the generator stands and how it is connected.",
      poCo:
        "A generator usually runs only when the battery is low. Knowing what a kWh from fuel costs makes it easier to decide whether to add a panel or a battery instead of burning petrol.",
      fizyka:
        "Example from the source: a 2 kW generator at 50% load uses 0.5 l/h; at 3 h/day it burns 1.5 l (about 10 PLN/day) and delivers 2 × 0.5 × 3 = 3 kWh.",
    },
    pola: {
      moc: {
        nazwa: "Generator rated power [kW]",
        cel: "Power and load give the energy delivered per day.",
        gdzie: "Generator nameplate or datasheet — continuous (rated) power, not maximum.",
        zakres: "From the generator datasheet.",
      },
      obciazenie: {
        nazwa: "Average load [%]",
        cel: "Which part of the rated power the loads and charger actually draw while running.",
        gdzie: "Total power of what you connect (charger, loads) ÷ generator power × 100.",
        zakres: "0–100%.",
      },
      zuzycie: {
        nazwa: "Fuel consumption [l/h]",
        cel: "The basis of the result — how many litres the generator burns per hour at the entered load.",
        gdzie:
          "Generator datasheet (consumption at a given load, often listed for 50% and 75%) or your own measurement: fill up, run for an hour, top up and measure.",
        zakres: "From the generator datasheet at your load — the app does not guess the consumption curve.",
      },
      godziny: {
        nazwa: "Running hours per day [h]",
        cel: "The generator does not run all the time — only when the battery is low or a large load must be powered.",
        gdzie: "Your plan or observation.",
        zakres: "0–24 h.",
      },
      cena: {
        nazwa: "Fuel price [PLN/l]",
        cel: "Turns litres into money.",
        gdzie: "Current price at the filling station.",
        zakres: "Current price.",
      },
      porownanie: {
        nazwa: "Cost of 1 kWh from another source [PLN/kWh] (optional)",
        cel: "Comparison: how many times more a kWh from the generator costs.",
        gdzie: "Electricity bill (gross price per kWh) or the cost of a kWh from your PV set from other screens.",
        zakres: "Empty = no comparison.",
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
  "mam-akumulator": {
    migawka: {
      oCoChodzi:
        "Вы проверяете, что реально можно подключить к уже имеющемуся аккумулятору — и сколько проработает на нём каждое устройство.",
      jakDziala:
        "Приложение считает доступную энергию: ёмкость × напряжение × допустимая глубина разряда × КПД инвертора. Затем делит её на мощность каждого устройства (время работы отдельно) и на сумму мощностей (всё сразу). Если указать максимальный ток аккумулятора, предупредит об устройстве, которое потребляет больше.",
      poCo:
        "Это обратный вопрос: не «какой аккумулятор купить», а «что я сделаю с тем, что есть». Мощные потребители (чайник, фен) быстро разряжают аккумулятор, а их ток может превысить возможности аккумулятора или BMS.",
      fizyka:
        "Энергия E = C × U × DoD × η. Время t = E / P. Ток аккумулятора I = P / (U × η). Пример из источника: 12 В 100 А·ч, доступно 1,2 кВт·ч — холодильник 50 Вт около 24 ч, LED 20 Вт около 60 ч, чайник 1000 Вт около 1,2 ч (ток около 100 А).",
    },
    pola: {
      chemia: {
        nazwa: "Тип аккумулятора",
        cel: "От типа зависит, насколько глубоко его можно разряжать — подсказка у поля DoD.",
        gdzie: "На наклейке или в паспорте: AGM, LiFePO4 (литиевый), заливной свинцово-кислотный (с пробками).",
        zakres: "Один из трёх вариантов.",
      },
      pojemnosc: {
        nazwa: "Номинальная ёмкость [А·ч]",
        cel: "Сколько заряда вмещает аккумулятор.",
        gdzie: "На наклейке, напр. «100 Ah».",
        zakres: "С наклейки или из паспорта.",
      },
      napiecie: {
        nazwa: "Напряжение аккумулятора [В]",
        cel: "Переводит ёмкость [А·ч] в энергию [Вт·ч], а мощность устройств — в ток.",
        gdzie: "На наклейке: 12 В, 24 В или 48 В.",
        zakres: "Обычно 12, 24 или 48 В.",
      },
      dod: {
        nazwa: "Допустимая глубина разряда — DoD [%]",
        cel: "Какую часть ёмкости можно использовать без сокращения срока службы. Только эта часть идёт в расчёт.",
        gdzie: "Паспорт аккумулятора (число циклов при данной глубине разряда).",
        zakres:
          "Для LiFePO4 обычно {min}–{max}%. Для AGM и заливного — из паспорта; приложение не выбирает значение за вас.",
      },
      sprawnosc: {
        nazwa: "КПД инвертора [%]",
        cel:
          "Устройства 230 В через инвертор забирают из аккумулятора больше, чем потребляют сами. Потери инвертора сокращают время работы.",
        gdzie: "Паспорт инвертора (КПД при типичной нагрузке). Устройства 12/24 В напрямую — введите 100.",
        zakres: "Из паспорта инвертора; 100 без инвертора.",
      },
      maksPrad: {
        nazwa: "Максимальный длительный ток аккумулятора [А] (необязательно)",
        cel:
          "Сравнение с током каждого устройства — слишком большой ток может отключить BMS, перегреть соединения или повредить аккумулятор.",
        gdzie: "Паспорт аккумулятора или BMS («max continuous discharge current»).",
        zakres: "Из паспорта; пусто = без проверки тока.",
      },
      nazwa: {
        nazwa: "Название устройства",
        cel: "Чтобы узнать устройство в списке результатов.",
        gdzie: "Любое название, напр. «холодильник».",
        zakres: "Любой текст.",
      },
      moc: {
        nazwa: "Мощность устройства [Вт]",
        cel: "По мощности приложение считает время работы и ток.",
        gdzie:
          "Табличка, инструкция или найдите свою модель в интернете. Для компрессорного холодильника введите среднюю мощность, если знаете.",
        zakres: "С таблички вашего устройства.",
      },
    },
  },
  "agregat-paliwo": {
    migawka: {
      oCoChodzi:
        "Генератор — маленький дракон, который пьёт топливо: нужно знать, сколько он съест и сколько стоит каждый киловатт-час от него.",
      jakDziala:
        "Расход топлива из паспорта генератора [л/ч] × часы работы в сутки = литры в сутки. Литры × цена = стоимость. Мощность × нагрузка × часы = энергия за сутки. Стоимость ÷ энергия = цена 1 кВт·ч. Плюс вопросы безопасности: где стоит генератор и как он подключён.",
      poCo:
        "Генератор обычно работает только когда аккумулятор разряжен. Зная цену кВт·ч из топлива, проще решить, не добавить ли панель или аккумулятор вместо сжигания бензина.",
      fizyka:
        "Пример из источника: генератор 2 кВт при нагрузке 50% расходует 0,5 л/ч; при 3 ч/сутки сожжёт 1,5 л (около 10 зл/сутки) и отдаст 2 × 0,5 × 3 = 3 кВт·ч.",
    },
    pola: {
      moc: {
        nazwa: "Номинальная мощность генератора [кВт]",
        cel: "По мощности и нагрузке считается энергия за сутки.",
        gdzie: "Табличка или паспорт генератора — длительная (номинальная) мощность, не максимальная.",
        zakres: "Из паспорта генератора.",
      },
      obciazenie: {
        nazwa: "Средняя нагрузка [%]",
        cel: "Какую часть номинальной мощности реально потребляют нагрузки и зарядное устройство.",
        gdzie: "Сумма мощностей подключаемого (зарядное, нагрузки) ÷ мощность генератора × 100.",
        zakres: "0–100%.",
      },
      zuzycie: {
        nazwa: "Расход топлива [л/ч]",
        cel: "Основа результата — сколько литров генератор сжигает за час при введённой нагрузке.",
        gdzie:
          "Паспорт генератора (расход при данной нагрузке, часто для 50% и 75%) или свой замер: заправьте до полного, поработайте час, долейте и измерьте.",
        zakres: "Из паспорта генератора при вашей нагрузке — приложение не угадывает кривую расхода.",
      },
      godziny: {
        nazwa: "Часы работы в сутки [ч]",
        cel:
          "Генератор работает не всё время — только когда аккумулятор разряжен или нужно запитать мощный потребитель.",
        gdzie: "Ваш план или наблюдение.",
        zakres: "0–24 ч.",
      },
      cena: {
        nazwa: "Цена топлива [зл/л]",
        cel: "Переводит литры в деньги.",
        gdzie: "Текущая цена на заправке.",
        zakres: "Текущая цена.",
      },
      porownanie: {
        nazwa: "Стоимость 1 кВт·ч из другого источника [зл/кВт·ч] (необязательно)",
        cel: "Сравнение: во сколько раз дороже кВт·ч от генератора.",
        gdzie: "Счёт за электричество (цена брутто за кВт·ч) или стоимость кВт·ч вашего набора PV с других экранов.",
        zakres: "Пусто = без сравнения.",
      },
    },
  },
}
