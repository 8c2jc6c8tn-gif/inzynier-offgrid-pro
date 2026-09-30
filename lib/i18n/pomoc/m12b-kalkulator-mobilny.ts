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
  "solar-vs-przedluzacz": {
    migawka: {
      oCoChodzi:
        "Czasem nie opłaca się ciągnąć kabla — słońce jest za darmo. Tu sprawdzasz, co wyjdzie taniej w Twoim horyzoncie.",
      jakDziala:
        "Przedłużacz: koszt jednorazowy + co roku (zużycie × cena energii + opłaty stałe). Zestaw: koszt zakupu + co roku jego utrzymanie. Aplikacja sumuje oba przez wybraną liczbę lat i liczy, po ilu latach zwróci się dopłata do zestawu.",
      poCo:
        "Na działce daleko od sieci, przy małym zużyciu (weekendy), zestaw solarny często wygrywa. Przy dużym zużyciu i bliskim gniazdku — przedłużacz. Liczby decydują, nie przeczucie.",
      fizyka:
        "Zwrot = (koszt zestawu − koszt przedłużacza) ÷ (roczny koszt prądu z sieci − roczne utrzymanie zestawu). Koszt całkowity po n latach = inwestycja + n × koszt roczny. Bez inflacji.",
    },
    pola: {
      przedluzacz: {
        nazwa: "Koszt przedłużacza / linii [zł]",
        cel: "Jednorazowy wydatek po stronie kabla.",
        gdzie: "Wycena: kabel (ziemny przy układaniu w ziemi), wykop, osłona, gniazda i zabezpieczenia.",
        zakres: "Z wyceny lub cennika sklepu.",
      },
      zuzycie: {
        nazwa: "Zużycie energii w roku [kWh/rok]",
        cel: "Ile prądu pobierzesz przez rok — z niego koszt energii z sieci.",
        gdzie: "Suma z ekranów zużycia (np. „Zużycie per urządzenie”) × liczba dni pobytu w roku.",
        zakres: "Twoje zużycie.",
      },
      cena: {
        nazwa: "Cena energii z sieci [zł/kWh]",
        cel: "Zamienia kWh na złotówki.",
        gdzie: "Rachunek za prąd — cena brutto za kWh z opłatami zmiennymi; albo stawka umówiona z sąsiadem.",
        zakres: "Z rachunku.",
      },
      oplaty: {
        nazwa: "Stałe opłaty sieciowe [zł/rok] (opcjonalnie)",
        cel:
          "Opłaty niezależne od zużycia (abonament, opłata stała) — przy małym zużyciu potrafią być większe niż sama energia.",
        gdzie: "Rachunek za prąd, pozycje stałe × liczba okresów w roku.",
        zakres: "Puste = brak.",
      },
      zestaw: {
        nazwa: "Koszt zestawu solarnego [zł]",
        cel: "Jednorazowy wydatek po stronie słońca.",
        gdzie: "Suma cen: panel, akumulator, regulator, przewody, montaż.",
        zakres: "Z wyceny lub cennika.",
      },
      eksploatacja: {
        nazwa: "Roczny koszt utrzymania zestawu [zł/rok] (opcjonalnie)",
        cel: "Np. odkładane pieniądze na wymianę akumulatora po latach — cena akumulatora ÷ jego żywotność w latach.",
        gdzie: "Karta akumulatora (żywotność) i jego cena.",
        zakres: "Puste = brak.",
      },
      horyzont: {
        nazwa: "Horyzont porównania [lat]",
        cel: "Przez ile lat sumować koszty obu opcji.",
        gdzie: "Jak długo planujesz korzystać z działki/miejsca.",
        zakres: "Twój plan.",
      },
    },
  },
  "stacja-vs-diy": {
    migawka: {
      oCoChodzi:
        "Stacja to telefon, DIY to komputer: jedno wygodne, drugie wydajne. Tu porównujesz, ile płacisz za energię, którą naprawdę wykorzystasz.",
      jakDziala:
        "Dla stacji: pojemność producenta × część do wykorzystania. Dla DIY: pojemność akumulatora [Ah] × napięcie × dopuszczalna głębokość rozładowania. Cena ÷ energia = zł za 1 Wh. Opcjonalnie masa na 1 kWh.",
      poCo:
        "Stacja jest gotowa do pracy, ma gwarancję i serwis, ale płacisz więcej za każdą Wh. DIY jest tańszy i łatwiej go rozbudować, ale wymaga wiedzy (bezpieczniki, przewody) i pracy. Jeśli nie chcesz się bawić w kable — stacja. Jeśli lubisz majsterkować — DIY.",
      fizyka:
        "Energia akumulatora E = C [Ah] × U [V]. Użyteczna = E × DoD. Przykład ze źródła: stacja 500 Wh za 1200 zł to 2,4 zł/Wh; akumulator ołowiowy 100 Ah 12 V (przy DoD 50% ok. 600 Wh) z osprzętem za 700 zł to ok. 1,17 zł/Wh — ok. 2× więcej energii za te same pieniądze.",
    },
    pola: {
      cenaStacji: {
        nazwa: "Cena stacji [zł]",
        cel: "Mianownik porównania — ile płacisz za gotowe urządzenie.",
        gdzie: "Oferta sklepu.",
        zakres: "Z oferty.",
      },
      pojemnoscStacji: {
        nazwa: "Pojemność stacji [Wh]",
        cel: "Ile energii mieści stacja wg producenta.",
        gdzie: "Karta produktu (np. „512 Wh”).",
        zakres: "Z karty produktu.",
      },
      uzytecznaStacji: {
        nazwa: "Część pojemności stacji do wykorzystania [%]",
        cel: "Nie cała energia z karty trafia do urządzeń (zabezpieczenia BMS, straty przetwornicy).",
        gdzie: "Karta produktu lub testy stacji. Jeśli producent podaje już pojemność użyteczną — wpisz 100.",
        zakres: "Z karty stacji; aplikacja nie zgaduje.",
      },
      masaStacji: {
        nazwa: "Masa stacji [kg] (opcjonalnie)",
        cel: "Porównanie mobilności — kilogramy na 1 kWh.",
        gdzie: "Karta produktu.",
        zakres: "Puste = bez porównania masy.",
      },
      cenaDiy: {
        nazwa: "Cena elementów DIY [zł]",
        cel: "Wszystko, co trzeba kupić, żeby zestaw działał jak stacja.",
        gdzie: "Suma: akumulator, regulator ładowania, przetwornica, przewody, bezpieczniki, obudowa.",
        zakres: "Z ofert sklepów.",
      },
      pojemnoscDiy: {
        nazwa: "Pojemność akumulatora [Ah]",
        cel: "Z niej i z napięcia wynika energia zestawu.",
        gdzie: "Naklejka lub karta akumulatora.",
        zakres: "Z karty akumulatora.",
      },
      napiecieDiy: {
        nazwa: "Napięcie akumulatora [V]",
        cel: "Zamienia Ah na Wh.",
        gdzie: "Naklejka: 12, 24 albo 48 V.",
        zakres: "Zwykle 12, 24 albo 48 V.",
      },
      dodDiy: {
        nazwa: "Dopuszczalna głębokość rozładowania — DoD [%]",
        cel: "Jaką część pojemności wolno zużyć bez skracania życia akumulatora.",
        gdzie: "Karta akumulatora (cykle przy danej głębokości rozładowania).",
        zakres: "Dla LiFePO4 typowo {min}–{max}%. Dla ołowiowych — z karty; aplikacja nie wybiera za Ciebie.",
      },
      masaDiy: {
        nazwa: "Masa zestawu [kg] (opcjonalnie)",
        cel: "Porównanie mobilności — kilogramy na 1 kWh.",
        gdzie: "Suma mas z kart elementów (akumulator waży najwięcej).",
        zakres: "Puste = bez porównania masy.",
      },
    },
  },
  weekend: {
    migawka: {
      oCoChodzi: "Jedziesz na działkę na dwa, trzy dni i chcesz wiedzieć, czy Twój zestaw da radę.",
      jakDziala:
        "Aplikacja sumuje zużycie na dobę: moc × godziny pracy każdego urządzenia (a te „na osobę” — razy liczba osób). Mnoży przez liczbę dni i porównuje z energią akumulatora (pojemność × napięcie × dopuszczalna głębokość rozładowania). Jeśli dodasz panel, doliczy jego średnią produkcję co dobę.",
      poCo:
        "Pochmurny weekend to realny scenariusz — sprawdzasz, czy sam akumulator wystarczy bez słońca, a jeśli nie, czy panel nadrobi brak. Grzałki, czajniki i suszarki szybko przekreślą każdy mały zestaw.",
      fizyka:
        "Zużycie doby E = Σ P × h. Akumulator E = C × U × DoD. Panel na dobę = P × godziny pełnego słońca × sprawność toru. Bilans pobytu = akumulator + dni × panel − dni × zużycie.",
    },
    pola: {
      dni: {
        nazwa: "Liczba dni pobytu",
        cel: "Przez tyle dób sumuje się zużycie.",
        gdzie: "Twój plan wyjazdu.",
        zakres: "Zwykle 2–3 dni na weekend.",
      },
      osoby: {
        nazwa: "Liczba osób",
        cel: "Mnoży urządzenia oznaczone „osobno dla każdej osoby”.",
        gdzie: "Ile osób jedzie.",
        zakres: "Twoja liczba.",
      },
      nazwa: {
        nazwa: "Nazwa urządzenia",
        cel: "Żebyś rozpoznał urządzenie na liście.",
        gdzie: "Dowolna nazwa.",
        zakres: "Dowolny tekst.",
      },
      moc: {
        nazwa: "Moc urządzenia [W]",
        cel: "Z mocy i godzin pracy wynika zużycie.",
        gdzie: "Tabliczka znamionowa, instrukcja albo wyszukaj swój model w internecie.",
        zakres: "Z tabliczki Twojego urządzenia.",
      },
      godziny: {
        nazwa: "Godziny pracy na dobę [h]",
        cel: "Ile godzin dziennie urządzenie jest włączone.",
        gdzie: "Twoje przyzwyczajenia — np. oświetlenie wieczorem 4–5 h.",
        zakres: "0–24 h.",
      },
      naOsobe: {
        nazwa: "Osobno dla każdej osoby",
        cel:
          "Zaznacz, jeśli każda osoba ma swoje (np. telefon do ładowania) — zużycie zostanie pomnożone przez liczbę osób.",
        gdzie: "—",
        zakres: "Tak/nie.",
      },
      pojemnosc: {
        nazwa: "Pojemność akumulatora [Ah]",
        cel: "Z niej wynika energia akumulatora.",
        gdzie: "Naklejka akumulatora.",
        zakres: "Z naklejki.",
      },
      napiecie: {
        nazwa: "Napięcie akumulatora [V]",
        cel: "Zamienia Ah na Wh.",
        gdzie: "Naklejka: 12 albo 24 V.",
        zakres: "Zwykle 12 albo 24 V.",
      },
      dod: {
        nazwa: "Dopuszczalna głębokość rozładowania — DoD [%]",
        cel: "Tylko tę część pojemności aplikacja bierze do obliczeń.",
        gdzie: "Karta akumulatora.",
        zakres: "Dla LiFePO4 typowo {min}–{max}%. Dla ołowiowych — z karty; aplikacja nie wybiera za Ciebie.",
      },
      mocPanelu: {
        nazwa: "Moc panelu [W] (opcjonalnie)",
        cel: "Doładowanie w ciągu dnia.",
        gdzie: "Tabliczka panelu (Wp).",
        zakres: "Puste = bez panelu.",
      },
      godzinSlonca: {
        nazwa: "Równoważne godziny pełnego słońca [h/dobę]",
        cel: "Ile godzin panel pracowałby z pełną mocą — przelicza moc na energię dobową.",
        gdzie: "Moduł 1 (klimat i lokalizacja) albo mapa nasłonecznienia dla Twojego miesiąca.",
        zakres: "Z danych dla Twojej lokalizacji i miesiąca.",
      },
      sprawnosc: {
        nazwa: "Sprawność toru panel → akumulator [%]",
        cel: "Straty w regulatorze, kablach i przy ładowaniu.",
        gdzie: "Karta regulatora (sprawność) i akumulatora (sprawność ładowania).",
        zakres: "Z kart urządzeń; aplikacja nie zgaduje.",
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
  "solar-vs-przedluzacz": {
    migawka: {
      oCoChodzi:
        "Sometimes running a cable is not worth it — the sun is free. Here you check what comes out cheaper over your horizon.",
      jakDziala:
        "Extension cord: one-off cost + every year (use × energy price + fixed charges). Set: purchase cost + its yearly upkeep. The app adds both over the chosen number of years and computes after how many years the extra outlay for the set pays back.",
      poCo:
        "On a plot far from the grid with low use (weekends), a solar set often wins. With high use and a socket nearby — the extension cord. Numbers decide, not gut feeling.",
      fizyka:
        "Payback = (set cost − cord cost) ÷ (yearly grid power cost − yearly set upkeep). Total cost after n years = investment + n × yearly cost. No inflation.",
    },
    pola: {
      przedluzacz: {
        nazwa: "Extension cord / line cost [PLN]",
        cel: "The one-off expense on the cable side.",
        gdzie: "Quote: cable (direct-burial if laid in the ground), trench, conduit, sockets and protection.",
        zakres: "From a quote or shop price list.",
      },
      zuzycie: {
        nazwa: "Energy use per year [kWh/year]",
        cel: "How much power you will draw per year — the grid energy cost comes from it.",
        gdzie: "Sum from the consumption screens (e.g. “Consumption per device”) × days of stay per year.",
        zakres: "Your consumption.",
      },
      cena: {
        nazwa: "Grid energy price [PLN/kWh]",
        cel: "Turns kWh into money.",
        gdzie: "Electricity bill — gross price per kWh with variable charges; or the rate agreed with a neighbour.",
        zakres: "From the bill.",
      },
      oplaty: {
        nazwa: "Fixed grid charges [PLN/year] (optional)",
        cel: "Charges independent of use (subscription, fixed fee) — with low use they can exceed the energy itself.",
        gdzie: "Electricity bill, fixed items × billing periods per year.",
        zakres: "Empty = none.",
      },
      zestaw: {
        nazwa: "Solar set cost [PLN]",
        cel: "The one-off expense on the solar side.",
        gdzie: "Sum of prices: panel, battery, charge controller, cables, mounting.",
        zakres: "From a quote or price list.",
      },
      eksploatacja: {
        nazwa: "Yearly upkeep of the set [PLN/year] (optional)",
        cel: "E.g. money set aside to replace the battery after years — battery price ÷ its life in years.",
        gdzie: "Battery datasheet (service life) and its price.",
        zakres: "Empty = none.",
      },
      horyzont: {
        nazwa: "Comparison horizon [years]",
        cel: "Over how many years to add up the costs of both options.",
        gdzie: "How long you plan to use the plot/place.",
        zakres: "Your plan.",
      },
    },
  },
  "stacja-vs-diy": {
    migawka: {
      oCoChodzi:
        "A station is a phone, DIY is a computer: one convenient, the other efficient. Here you compare what you pay for the energy you can really use.",
      jakDziala:
        "For the station: manufacturer capacity × usable share. For DIY: battery capacity [Ah] × voltage × allowed depth of discharge. Price ÷ energy = PLN per 1 Wh. Optionally mass per 1 kWh.",
      poCo:
        "A station is ready to work and has warranty and service, but you pay more for every Wh. DIY is cheaper and easier to expand, but it needs knowledge (fuses, cables) and work. If you do not want to deal with cables — station. If you like tinkering — DIY.",
      fizyka:
        "Battery energy E = C [Ah] × U [V]. Usable = E × DoD. Example from the source: a 500 Wh station for 1200 PLN is 2.4 PLN/Wh; a 100 Ah 12 V lead-acid battery (about 600 Wh at 50% DoD) with accessories for 700 PLN is about 1.17 PLN/Wh — about 2× more energy for the same money.",
    },
    pola: {
      cenaStacji: {
        nazwa: "Station price [PLN]",
        cel: "What you pay for the ready-made device.",
        gdzie: "Shop offer.",
        zakres: "From the offer.",
      },
      pojemnoscStacji: {
        nazwa: "Station capacity [Wh]",
        cel: "How much energy the station holds per the manufacturer.",
        gdzie: "Product sheet (e.g. “512 Wh”).",
        zakres: "From the product sheet.",
      },
      uzytecznaStacji: {
        nazwa: "Usable share of station capacity [%]",
        cel: "Not all the energy on the sheet reaches the devices (BMS limits, inverter losses).",
        gdzie: "Product sheet or station tests. If the manufacturer already gives usable capacity — enter 100.",
        zakres: "From the station sheet; the app does not guess.",
      },
      masaStacji: {
        nazwa: "Station mass [kg] (optional)",
        cel: "Mobility comparison — kilograms per 1 kWh.",
        gdzie: "Product sheet.",
        zakres: "Empty = no mass comparison.",
      },
      cenaDiy: {
        nazwa: "DIY parts price [PLN]",
        cel: "Everything you must buy for the set to work like a station.",
        gdzie: "Sum: battery, charge controller, inverter, cables, fuses, enclosure.",
        zakres: "From shop offers.",
      },
      pojemnoscDiy: {
        nazwa: "Battery capacity [Ah]",
        cel: "Together with voltage it gives the set's energy.",
        gdzie: "Battery label or datasheet.",
        zakres: "From the battery datasheet.",
      },
      napiecieDiy: {
        nazwa: "Battery voltage [V]",
        cel: "Turns Ah into Wh.",
        gdzie: "Label: 12, 24 or 48 V.",
        zakres: "Usually 12, 24 or 48 V.",
      },
      dodDiy: {
        nazwa: "Allowed depth of discharge — DoD [%]",
        cel: "Which part of the capacity may be used without shortening battery life.",
        gdzie: "Battery datasheet (cycles at a given depth of discharge).",
        zakres:
          "For LiFePO4 typically {min}–{max}%. For lead-acid — from the datasheet; the app does not pick for you.",
      },
      masaDiy: {
        nazwa: "Set mass [kg] (optional)",
        cel: "Mobility comparison — kilograms per 1 kWh.",
        gdzie: "Sum of masses from the parts' sheets (the battery weighs the most).",
        zakres: "Empty = no mass comparison.",
      },
    },
  },
  weekend: {
    migawka: {
      oCoChodzi: "You are going to the plot for two or three days and want to know if your set will cope.",
      jakDziala:
        "The app adds up daily consumption: power × running hours of each device (and the “per person” ones — times the number of people). It multiplies by the number of days and compares with the battery energy (capacity × voltage × allowed depth of discharge). If you add a panel, it adds its average daily production.",
      poCo:
        "A cloudy weekend is a real scenario — you check whether the battery alone lasts without sun and, if not, whether the panel makes up for it. Heaters, kettles and hair dryers quickly rule out any small set.",
      fizyka:
        "Daily use E = Σ P × h. Battery E = C × U × DoD. Panel per day = P × full-sun hours × path efficiency. Stay balance = battery + days × panel − days × use.",
    },
    pola: {
      dni: {
        nazwa: "Days of stay",
        cel: "Consumption is summed over this many days.",
        gdzie: "Your trip plan.",
        zakres: "Usually 2–3 days for a weekend.",
      },
      osoby: {
        nazwa: "Number of people",
        cel: "Multiplies the devices marked “separately for each person”.",
        gdzie: "How many people are going.",
        zakres: "Your number.",
      },
      nazwa: {
        nazwa: "Device name",
        cel: "So you recognise the device on the list.",
        gdzie: "Any name.",
        zakres: "Any text.",
      },
      moc: {
        nazwa: "Device power [W]",
        cel: "Power and running hours give the consumption.",
        gdzie: "Nameplate, manual or search for your model online.",
        zakres: "From your device's nameplate.",
      },
      godziny: {
        nazwa: "Running hours per day [h]",
        cel: "How many hours a day the device is on.",
        gdzie: "Your habits — e.g. lighting in the evening 4–5 h.",
        zakres: "0–24 h.",
      },
      naOsobe: {
        nazwa: "Separately for each person",
        cel:
          "Tick if each person has their own (e.g. a phone to charge) — consumption is multiplied by the number of people.",
        gdzie: "—",
        zakres: "Yes/no.",
      },
      pojemnosc: {
        nazwa: "Battery capacity [Ah]",
        cel: "Gives the battery energy.",
        gdzie: "Battery label.",
        zakres: "From the label.",
      },
      napiecie: {
        nazwa: "Battery voltage [V]",
        cel: "Turns Ah into Wh.",
        gdzie: "Label: 12 or 24 V.",
        zakres: "Usually 12 or 24 V.",
      },
      dod: {
        nazwa: "Allowed depth of discharge — DoD [%]",
        cel: "Only this part of the capacity goes into the calculation.",
        gdzie: "Battery datasheet.",
        zakres:
          "For LiFePO4 typically {min}–{max}%. For lead-acid — from the datasheet; the app does not pick for you.",
      },
      mocPanelu: {
        nazwa: "Panel power [W] (optional)",
        cel: "Recharging during the day.",
        gdzie: "Panel nameplate (Wp).",
        zakres: "Empty = no panel.",
      },
      godzinSlonca: {
        nazwa: "Equivalent full-sun hours [h/day]",
        cel: "How many hours the panel would run at full power — turns power into daily energy.",
        gdzie: "Module 1 (climate and location) or an insolation map for your month.",
        zakres: "From data for your location and month.",
      },
      sprawnosc: {
        nazwa: "Panel → battery path efficiency [%]",
        cel: "Losses in the controller, cables and charging.",
        gdzie: "Controller datasheet (efficiency) and battery datasheet (charge efficiency).",
        zakres: "From the datasheets; the app does not guess.",
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
  "solar-vs-przedluzacz": {
    migawka: {
      oCoChodzi:
        "Иногда тянуть кабель невыгодно — солнце бесплатное. Здесь вы проверяете, что выйдет дешевле на вашем горизонте.",
      jakDziala:
        "Удлинитель: разовая стоимость + каждый год (потребление × цена энергии + постоянные платежи). Комплект: стоимость покупки + его годовое содержание. Приложение суммирует оба варианта за выбранное число лет и считает, через сколько лет окупится доплата за комплект.",
      poCo:
        "На участке далеко от сети при малом потреблении (выходные) солнечный комплект часто выигрывает. При большом потреблении и близкой розетке — удлинитель. Решают цифры, а не интуиция.",
      fizyka:
        "Окупаемость = (стоимость комплекта − стоимость удлинителя) ÷ (годовая стоимость электричества из сети − годовое содержание комплекта). Полная стоимость за n лет = вложение + n × годовые расходы. Без инфляции.",
    },
    pola: {
      przedluzacz: {
        nazwa: "Стоимость удлинителя / линии [зл]",
        cel: "Разовый расход на стороне кабеля.",
        gdzie: "Смета: кабель (подземного типа при прокладке в земле), траншея, защитная труба, розетки и защита.",
        zakres: "Из сметы или прайса магазина.",
      },
      zuzycie: {
        nazwa: "Потребление энергии в год [кВт·ч/год]",
        cel: "Сколько электричества вы возьмёте за год — из этого стоимость энергии из сети.",
        gdzie: "Сумма с экранов потребления (напр. «Потребление по устройствам») × число дней пребывания в году.",
        zakres: "Ваше потребление.",
      },
      cena: {
        nazwa: "Цена электроэнергии из сети [зл/кВт·ч]",
        cel: "Переводит кВт·ч в деньги.",
        gdzie:
          "Счёт за электричество — цена брутто за кВт·ч с переменными платежами; или ставка, согласованная с соседом.",
        zakres: "Из счёта.",
      },
      oplaty: {
        nazwa: "Постоянные сетевые платежи [зл/год] (необязательно)",
        cel:
          "Платежи, не зависящие от потребления (абонентская плата) — при малом потреблении могут превышать саму энергию.",
        gdzie: "Счёт за электричество, постоянные позиции × число периодов в году.",
        zakres: "Пусто = нет.",
      },
      zestaw: {
        nazwa: "Стоимость солнечного комплекта [зл]",
        cel: "Разовый расход на солнечной стороне.",
        gdzie: "Сумма цен: панель, аккумулятор, контроллер, провода, монтаж.",
        zakres: "Из сметы или прайса.",
      },
      eksploatacja: {
        nazwa: "Годовые расходы на содержание комплекта [зл/год] (необязательно)",
        cel:
          "Напр. деньги, откладываемые на замену аккумулятора через годы — цена аккумулятора ÷ его срок службы в годах.",
        gdzie: "Паспорт аккумулятора (срок службы) и его цена.",
        zakres: "Пусто = нет.",
      },
      horyzont: {
        nazwa: "Горизонт сравнения [лет]",
        cel: "За сколько лет суммировать расходы обоих вариантов.",
        gdzie: "Как долго вы планируете пользоваться участком/местом.",
        zakres: "Ваш план.",
      },
    },
  },
  "stacja-vs-diy": {
    migawka: {
      oCoChodzi:
        "Станция — это телефон, самоделка — компьютер: одно удобно, другое эффективно. Здесь вы сравниваете, сколько платите за реально доступную энергию.",
      jakDziala:
        "Для станции: ёмкость производителя × доступная часть. Для самодельного: ёмкость аккумулятора [А·ч] × напряжение × допустимая глубина разряда. Цена ÷ энергия = зл за 1 Вт·ч. Дополнительно масса на 1 кВт·ч.",
      poCo:
        "Станция готова к работе, есть гарантия и сервис, но каждый Вт·ч дороже. Самодельный комплект дешевле и легче расширяется, но требует знаний (предохранители, провода) и работы. Не хотите возиться с кабелями — станция. Любите мастерить — самоделка.",
      fizyka:
        "Энергия аккумулятора E = C [А·ч] × U [В]. Полезная = E × DoD. Пример из источника: станция 500 Вт·ч за 1200 зл — 2,4 зл/Вт·ч; свинцовый аккумулятор 100 А·ч 12 В (около 600 Вт·ч при DoD 50%) с оснасткой за 700 зл — около 1,17 зл/Вт·ч, т.е. примерно в 2 раза больше энергии за те же деньги.",
    },
    pola: {
      cenaStacji: {
        nazwa: "Цена станции [зл]",
        cel: "Сколько вы платите за готовое устройство.",
        gdzie: "Предложение магазина.",
        zakres: "Из предложения.",
      },
      pojemnoscStacji: {
        nazwa: "Ёмкость станции [Вт·ч]",
        cel: "Сколько энергии вмещает станция по данным производителя.",
        gdzie: "Карточка товара (напр. «512 Wh»).",
        zakres: "Из карточки товара.",
      },
      uzytecznaStacji: {
        nazwa: "Доступная часть ёмкости станции [%]",
        cel: "Не вся энергия из карточки доходит до устройств (ограничения BMS, потери инвертора).",
        gdzie: "Карточка товара или тесты станции. Если производитель уже указывает полезную ёмкость — введите 100.",
        zakres: "Из карточки станции; приложение не угадывает.",
      },
      masaStacji: {
        nazwa: "Масса станции [кг] (необязательно)",
        cel: "Сравнение мобильности — килограммы на 1 кВт·ч.",
        gdzie: "Карточка товара.",
        zakres: "Пусто = без сравнения массы.",
      },
      cenaDiy: {
        nazwa: "Цена элементов комплекта [зл]",
        cel: "Всё, что нужно купить, чтобы комплект работал как станция.",
        gdzie: "Сумма: аккумулятор, контроллер заряда, инвертор, провода, предохранители, корпус.",
        zakres: "Из предложений магазинов.",
      },
      pojemnoscDiy: {
        nazwa: "Ёмкость аккумулятора [А·ч]",
        cel: "Вместе с напряжением даёт энергию комплекта.",
        gdzie: "Наклейка или паспорт аккумулятора.",
        zakres: "Из паспорта аккумулятора.",
      },
      napiecieDiy: {
        nazwa: "Напряжение аккумулятора [В]",
        cel: "Переводит А·ч в Вт·ч.",
        gdzie: "Наклейка: 12, 24 или 48 В.",
        zakres: "Обычно 12, 24 или 48 В.",
      },
      dodDiy: {
        nazwa: "Допустимая глубина разряда — DoD [%]",
        cel: "Какую часть ёмкости можно использовать без сокращения срока службы.",
        gdzie: "Паспорт аккумулятора (циклы при данной глубине разряда).",
        zakres: "Для LiFePO4 обычно {min}–{max}%. Для свинцовых — из паспорта; приложение не выбирает за вас.",
      },
      masaDiy: {
        nazwa: "Масса комплекта [кг] (необязательно)",
        cel: "Сравнение мобильности — килограммы на 1 кВт·ч.",
        gdzie: "Сумма масс из паспортов элементов (больше всего весит аккумулятор).",
        zakres: "Пусто = без сравнения массы.",
      },
    },
  },
  weekend: {
    migawka: {
      oCoChodzi: "Вы едете на дачу на два-три дня и хотите знать, справится ли ваш комплект.",
      jakDziala:
        "Приложение суммирует потребление за сутки: мощность × часы работы каждого устройства (а устройства «на человека» — умножает на число людей). Умножает на число дней и сравнивает с энергией аккумулятора (ёмкость × напряжение × допустимая глубина разряда). Если добавить панель, прибавит её среднюю суточную выработку.",
      poCo:
        "Пасмурные выходные — реальный сценарий: вы проверяете, хватит ли одного аккумулятора без солнца, а если нет — восполнит ли нехватку панель. Обогреватели, чайники и фены быстро перечеркнут любой малый комплект.",
      fizyka:
        "Потребление за сутки E = Σ P × h. Аккумулятор E = C × U × DoD. Панель за сутки = P × часы полного солнца × КПД цепи. Баланс пребывания = аккумулятор + дни × панель − дни × потребление.",
    },
    pola: {
      dni: {
        nazwa: "Число дней пребывания",
        cel: "Потребление суммируется за столько суток.",
        gdzie: "Ваш план поездки.",
        zakres: "Обычно 2–3 дня на выходные.",
      },
      osoby: {
        nazwa: "Число человек",
        cel: "Умножает устройства, отмеченные «отдельно на каждого человека».",
        gdzie: "Сколько человек едет.",
        zakres: "Ваше число.",
      },
      nazwa: {
        nazwa: "Название устройства",
        cel: "Чтобы узнать устройство в списке.",
        gdzie: "Любое название.",
        zakres: "Любой текст.",
      },
      moc: {
        nazwa: "Мощность устройства [Вт]",
        cel: "Мощность и часы работы дают потребление.",
        gdzie: "Табличка, инструкция или найдите свою модель в интернете.",
        zakres: "С таблички вашего устройства.",
      },
      godziny: {
        nazwa: "Часы работы в сутки [ч]",
        cel: "Сколько часов в день устройство включено.",
        gdzie: "Ваши привычки — напр. освещение вечером 4–5 ч.",
        zakres: "0–24 ч.",
      },
      naOsobe: {
        nazwa: "Отдельно на каждого человека",
        cel: "Отметьте, если у каждого своё (напр. телефон для зарядки) — потребление умножится на число людей.",
        gdzie: "—",
        zakres: "Да/нет.",
      },
      pojemnosc: {
        nazwa: "Ёмкость аккумулятора [А·ч]",
        cel: "Даёт энергию аккумулятора.",
        gdzie: "Наклейка аккумулятора.",
        zakres: "С наклейки.",
      },
      napiecie: {
        nazwa: "Напряжение аккумулятора [В]",
        cel: "Переводит А·ч в Вт·ч.",
        gdzie: "Наклейка: 12 или 24 В.",
        zakres: "Обычно 12 или 24 В.",
      },
      dod: {
        nazwa: "Допустимая глубина разряда — DoD [%]",
        cel: "Только эта часть ёмкости идёт в расчёт.",
        gdzie: "Паспорт аккумулятора.",
        zakres: "Для LiFePO4 обычно {min}–{max}%. Для свинцовых — из паспорта; приложение не выбирает за вас.",
      },
      mocPanelu: {
        nazwa: "Мощность панели [Вт] (необязательно)",
        cel: "Подзарядка в течение дня.",
        gdzie: "Табличка панели (Вт пик).",
        zakres: "Пусто = без панели.",
      },
      godzinSlonca: {
        nazwa: "Эквивалентные часы полного солнца [ч/сутки]",
        cel: "Сколько часов панель работала бы на полной мощности — переводит мощность в суточную энергию.",
        gdzie: "Модуль 1 (климат и местоположение) или карта инсоляции для вашего месяца.",
        zakres: "Из данных для вашего места и месяца.",
      },
      sprawnosc: {
        nazwa: "КПД цепи панель → аккумулятор [%]",
        cel: "Потери в контроллере, кабелях и при зарядке.",
        gdzie: "Паспорт контроллера (КПД) и аккумулятора (КПД заряда).",
        zakres: "Из паспортов; приложение не угадывает.",
      },
    },
  },
}
