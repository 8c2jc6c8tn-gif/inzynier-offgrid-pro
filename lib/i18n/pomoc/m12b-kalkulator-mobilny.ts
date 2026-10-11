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
        nazwa: "Cena paliwa [{waluta}/l]",
        cel: "Zamienia litry na pieniądze.",
        gdzie: "Aktualna cena na stacji.",
        zakres: "Aktualna cena.",
      },
      porownanie: {
        nazwa: "Koszt 1 kWh z innego źródła [{waluta}/kWh] (opcjonalnie)",
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
        nazwa: "Koszt przedłużacza / linii [{waluta}]",
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
        nazwa: "Cena energii z sieci [{waluta}/kWh]",
        cel: "Zamienia kWh na pieniądze.",
        gdzie: "Rachunek za prąd — cena brutto za kWh z opłatami zmiennymi; albo stawka umówiona z sąsiadem.",
        zakres: "Z rachunku.",
      },
      oplaty: {
        nazwa: "Stałe opłaty sieciowe [{waluta}/rok] (opcjonalnie)",
        cel:
          "Opłaty niezależne od zużycia (abonament, opłata stała) — przy małym zużyciu potrafią być większe niż sama energia.",
        gdzie: "Rachunek za prąd, pozycje stałe × liczba okresów w roku.",
        zakres: "Puste = brak.",
      },
      zestaw: {
        nazwa: "Koszt zestawu solarnego [{waluta}]",
        cel: "Jednorazowy wydatek po stronie słońca.",
        gdzie: "Suma cen: panel, akumulator, regulator, przewody, montaż.",
        zakres: "Z wyceny lub cennika.",
      },
      eksploatacja: {
        nazwa: "Roczny koszt utrzymania zestawu [{waluta}/rok] (opcjonalnie)",
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
        "Dla stacji: pojemność producenta × część do wykorzystania. Dla DIY: pojemność akumulatora [Ah] × napięcie × dopuszczalna głębokość rozładowania. Cena ÷ energia = {waluta} za 1 Wh. Opcjonalnie masa na 1 kWh.",
      poCo:
        "Stacja jest gotowa do pracy, ma gwarancję i serwis, ale płacisz więcej za każdą Wh. DIY jest tańszy i łatwiej go rozbudować, ale wymaga wiedzy (bezpieczniki, przewody) i pracy. Jeśli nie chcesz się bawić w kable — stacja. Jeśli lubisz majsterkować — DIY.",
      fizyka:
        "Energia akumulatora E = C [Ah] × U [V]. Użyteczna = E × DoD. Przykład ze źródła: stacja 500 Wh za 1200 zł to 2,4 zł/Wh; akumulator ołowiowy 100 Ah 12 V (przy DoD 50% ok. 600 Wh) z osprzętem za 700 zł to ok. 1,17 zł/Wh — ok. 2× więcej energii za te same pieniądze.",
    },
    pola: {
      cenaStacji: {
        nazwa: "Cena stacji [{waluta}]",
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
        nazwa: "Cena elementów DIY [{waluta}]",
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
  "panel-dla-urzadzenia": {
    migawka: {
      oCoChodzi: "Liczysz panel tylko do jednego urządzenia, nie do całego domu.",
      jakDziala:
        "Zużycie na dobę = moc × godziny pracy. Panel musi to oddać w ciągu dnia: moc panelu = zużycie ÷ (godziny pełnego słońca × uzysk). Jeśli wpiszesz panel, który masz, aplikacja porówna go z wynikiem.",
      poCo:
        "Za mały panel oznacza, że urządzenie z każdym dniem rozładowuje akumulator coraz bardziej. Wynik to minimum dla średniego dnia — pochmurne dni wymagają zapasu.",
      fizyka:
        "E = P × h. P_panel = E ÷ (h_słońca × uzysk). Przykład ze źródła: lodówka 50 W × 8 h = 400 Wh; panel 150 W przy uzysku 70% odda to w ok. 3,8 h pełnego słońca.",
    },
    pola: {
      moc: {
        nazwa: "Moc urządzenia [W]",
        cel: "Z mocy i czasu pracy wynika zużycie.",
        gdzie:
          "Tabliczka, instrukcja albo wyszukaj swój model. Dla lodówki ze sprężarką — moc średnia albo moc × czas pracy sprężarki.",
        zakres: "Z tabliczki Twojego urządzenia.",
      },
      godzinPracy: {
        nazwa: "Czas pracy na dobę [h]",
        cel: "Ile godzin dziennie urządzenie faktycznie pobiera prąd.",
        gdzie: "Twoje użytkowanie albo czas pracy sprężarki (lodówka pracuje cyklicznie).",
        zakres: "0–24 h.",
      },
      godzinSlonca: {
        nazwa: "Równoważne godziny pełnego słońca [h/dobę]",
        cel: "Przelicza moc panelu na energię dobową.",
        gdzie: "Moduł 1 (klimat i lokalizacja) albo mapa nasłonecznienia dla Twojego miesiąca.",
        zakres: "Z danych dla Twojej lokalizacji i miesiąca.",
      },
      uzysk: {
        nazwa: "Uzysk z mocy nominalnej panelu [%]",
        cel:
          "Panel rzadko oddaje pełną moc z tabliczki: temperatura, regulator, kable. Ta część mocy trafia realnie do urządzenia.",
        gdzie:
          "Karta panelu (współczynnik temperaturowy) i regulatora (sprawność). Źródło podaje przykład 70% — to przykład, nie reguła.",
        zakres: "Z kart urządzeń; aplikacja nie zgaduje.",
      },
      posiadany: {
        nazwa: "Moc panelu, który masz [W] (opcjonalnie)",
        cel: "Porównanie z wymaganą mocą.",
        gdzie: "Tabliczka panelu (Wp).",
        zakres: "Puste = tylko dobór.",
      },
    },
  },
  "laczenie-paneli-przenosnych": {
    migawka: {
      oCoChodzi: "Sprawdzasz, czy panele turystyczne da się połączyć ze sobą i z Twoją stacją zasilania.",
      jakDziala:
        "Aplikacja porównuje typ paneli i złącza. Powerbanków solarnych i wyjść USB nie łączy się — mają w środku regulator albo przetwornicę. Różne złącza wymagają fabrycznego adaptera. Różne panele połączyć można, ale z utratą mocy.",
      poCo:
        "Złe połączenie może uszkodzić wbudowany regulator albo wejście stacji. Złącza to pierwszy krok — napięcie i prąd sprawdzisz na ekranie „Panel do stacji zasilania”.",
      fizyka:
        "Szeregowo: napięcia się sumują, prąd = najmniejszy z paneli. Równolegle: prądy się sumują, napięcie = najniższe z paneli. Dlatego różne panele tracą część mocy.",
    },
    pola: {
      typ: {
        nazwa: "Typ panelu",
        cel: "Powerbank solarny ma własny regulator — nie łączy się go z innymi panelami.",
        gdzie: "Opis produktu: panel składany/mata ma tylko ogniwa i wtyk; powerbank ma akumulator i gniazda USB.",
        zakres: "Wybierz z listy.",
      },
      liczba: {
        nazwa: "Liczba paneli",
        cel: "Przy jednym panelu sprawdzasz tylko zgodność złącza ze stacją.",
        gdzie: "Ile paneli chcesz podłączyć naraz.",
        zakres: "1 i więcej.",
      },
      takieSame: {
        nazwa: "Ten sam model",
        cel: "Różne panele w jednym łańcuchu tracą moc do najsłabszego.",
        gdzie: "Porównaj tabliczki: Vmp, Imp i moc powinny być takie same.",
        zakres: "Tak / nie.",
      },
      zlaczePaneli: {
        nazwa: "Złącze wyjściowe paneli",
        cel: "Musi pasować do wejścia stacji albo do adaptera.",
        gdzie: "Końcówka kabla panelu; opis w instrukcji.",
        zakres: "Wybierz z listy.",
      },
      zlaczeWejscia: {
        nazwa: "Złącze wejścia PV",
        cel: "Do niego podłączasz panele.",
        gdzie: "Gniazdo „Solar/PV IN” na stacji albo zaciski regulatora; opis w instrukcji.",
        zakres: "Wybierz z listy.",
      },
      adapter: {
        nazwa: "Adapter między złączami",
        cel: "Pozwala połączyć różne złącza — o ile ma właściwą biegunowość i wytrzyma prąd.",
        gdzie: "Fabryczny adapter producenta stacji albo sprawdzony zamiennik z opisem prądu.",
        zakres: "Tak / nie.",
      },
    },
  },
  "powerbank-vs-akumulator": {
    migawka: {
      oCoChodzi: "Powerbank to wygoda, ale zestaw z akumulatorem to pojemność i moc.",
      jakDziala:
        "Aplikacja sprawdza, czy powerbank ma dość mocy ciągłej dla urządzenia, i liczy, ile razy każda opcja je naładuje (albo zasili przez dobę): energia × sprawność ÷ energia na jedno użycie.",
      poCo:
        "Telefon czy lampka to zadanie dla powerbanku. Lodówka turystyczna zwykle przekracza moc wyjścia powerbanku — wtedy potrzebny jest akumulator z przetwornicą.",
      fizyka:
        "n = E × η ÷ E_użycia. Akumulator: E = Ah × V × część użyteczna. Warunek mocy: P_urządzenia ≤ P_wyjścia powerbanku.",
    },
    pola: {
      mocUrzadzenia: {
        nazwa: "Moc urządzenia [W]",
        cel: "Porównanie z mocą wyjścia powerbanku.",
        gdzie: "Zasilacz/ładowarka urządzenia (W) albo tabliczka.",
        zakres: "Z tabliczki Twojego urządzenia.",
      },
      energiaUzycia: {
        nazwa: "Energia na jedno użycie [Wh]",
        cel: "Z niej wynika liczba naładowań albo dób.",
        gdzie: "Akumulator urządzenia (Wh na obudowie laptopa/telefonu) albo moc × godziny pracy na dobę.",
        zakres: "Z danych Twojego urządzenia.",
      },
      pbWh: {
        nazwa: "Pojemność powerbanku [Wh]",
        cel: "Energia zmagazynowana w powerbanku.",
        gdzie: "Etykieta. Jeśli podano tylko mAh: Wh = mAh × napięcie z etykiety ÷ 1000.",
        zakres: "Z etykiety.",
      },
      pbMoc: {
        nazwa: "Maks. moc wyjścia powerbanku [W]",
        cel: "Czy powerbank uciągnie urządzenie.",
        gdzie: "Etykieta/instrukcja — moc ciągła wyjścia, którego użyjesz (USB-C PD, DC, 230 V).",
        zakres: "Z etykiety.",
      },
      akAh: {
        nazwa: "Pojemność akumulatora [Ah]",
        cel: "Energia akumulatora.",
        gdzie: "Tabliczka akumulatora.",
        zakres: "Z tabliczki.",
      },
      akV: {
        nazwa: "Napięcie akumulatora [V]",
        cel: "Ah × V = Wh.",
        gdzie: "Tabliczka akumulatora.",
        zakres: "Z tabliczki.",
      },
      akUzyteczna: {
        nazwa: "Część pojemności do wykorzystania [%]",
        cel: "Akumulatora nie rozładowuje się do zera — ile wolno zużyć, zależy od chemii.",
        gdzie: "Karta akumulatora (głębokość rozładowania).",
        zakres: "Z karty; aplikacja nie zgaduje.",
      },
      sprawnosc: {
        nazwa: "Sprawność przetwarzania [%]",
        cel: "Przetwornice i kable tracą część energii po drodze do urządzenia.",
        gdzie: "Karta przetwornicy/ładowarki.",
        zakres: "Z kart urządzeń; aplikacja nie zgaduje.",
      },
    },
  },
  "blackout-minimum": {
    migawka: {
      oCoChodzi:
        "Blackout to egzamin — trzeba wiedzieć, co ratować w pierwszej kolejności. To nie projekt off-gridu, tylko minimum, żeby przetrwać awarię sieci bez paniki.",
      jakDziala:
        "Wpisz tylko odbiorniki krytyczne (np. 1. lodówka, 2. router, 3. oświetlenie, 4. ładowarki) i czas awarii. Aplikacja liczy energię, minimalny akumulator i moc przetwornicy; pokazuje też energię na 12, 24 i 48 h.",
      poCo:
        "Każdy dodatkowy odbiornik to większy i droższy zestaw. Lista priorytetów pozwala świadomie zdecydować, co wyłączyć, gdy awaria się przedłuża.",
      fizyka:
        "E_doba = Σ P × h. E = E_doba × T ÷ 24. Akumulator = E ÷ (η × U × część użyteczna). Przetwornica ≥ Σ P (plus zapas na rozruch — ekran Przetwornice).",
    },
    pola: {
      nazwa: {
        nazwa: "Nazwa odbiornika",
        cel: "Żeby lista priorytetów była czytelna.",
        gdzie: "Dowolna nazwa; wpisuj od najważniejszego.",
        zakres: "Tekst.",
      },
      moc: {
        nazwa: "Moc [W]",
        cel: "Energia i minimalna moc przetwornicy.",
        gdzie: "Tabliczka urządzenia albo pomiar watomierzem.",
        zakres: "Z tabliczki Twojego urządzenia.",
      },
      godziny: {
        nazwa: "Czas pracy na dobę [h]",
        cel: "Średnio w dobie — lodówka pracuje cyklicznie, router całą dobę.",
        gdzie: "Twoje użytkowanie; dla lodówki — czas pracy sprężarki (watomierz przez dobę).",
        zakres: "0–24 h.",
      },
      czas: {
        nazwa: "Czas blackoutu [h]",
        cel: "Na ile godzin ma starczyć zestaw.",
        gdzie: "Twoje doświadczenie z awariami w okolicy; źródło pokazuje warianty 12, 24 i 48 h.",
        zakres: "Twoja decyzja.",
      },
      napiecie: {
        nazwa: "Napięcie akumulatora [V]",
        cel: "Przelicza energię na Ah.",
        gdzie: "Tabliczka akumulatora.",
        zakres: "Z tabliczki.",
      },
      uzyteczna: {
        nazwa: "Część pojemności do wykorzystania [%]",
        cel: "Akumulatora nie rozładowuje się do zera.",
        gdzie: "Karta akumulatora (głębokość rozładowania).",
        zakres: "Z karty; aplikacja nie zgaduje.",
      },
      sprawnosc: {
        nazwa: "Sprawność przetwornicy [%]",
        cel: "Straty przy zamianie 12/24 V na 230 V.",
        gdzie: "Karta przetwornicy. Jeśli wszystko zasilasz bezpośrednio z 12 V — wpisz 100.",
        zakres: "Z karty; aplikacja nie zgaduje.",
      },
      posiadany: {
        nazwa: "Akumulator, który masz [Ah] (opcjonalnie)",
        cel: "Sprawdza, na ile godzin starczy.",
        gdzie: "Tabliczka akumulatora.",
        zakres: "Puste = tylko dobór.",
      },
    },
  },
  "akumulator-kampera": {
    migawka: {
      oCoChodzi: "Akumulator to serce kampera — a w pojeździe liczy się każdy kilogram.",
      jakDziala:
        "Wpisz zapotrzebowanie i dane konkretnych akumulatorów z kart. Aplikacja liczy, ile sztuk każdej technologii pokryje potrzeby przez zadaną liczbę dób, ile to waży i kosztuje, oraz koszt 1 kWh w całym życiu akumulatora.",
      poCo:
        "AGM jest tańszy na start, ale cięższy, pozwala zużyć mniejszą część pojemności i wytrzymuje mniej cykli. Koszt kWh w całym życiu i masa zwykle przesądzają. Pełne porównanie technologii: Moduł 4, Ekran 30.",
      fizyka:
        "E = zapotrzebowanie × doby. Sztuk = ⌈E ÷ (Ah × V × DoD)⌉. Koszt kWh = cena ÷ (Ah × V × DoD × cykle ÷ 1000).",
    },
    pola: {
      zapotrzebowanie: {
        nazwa: "Zapotrzebowanie na dobę [Wh]",
        cel: "Ile energii kamper zużywa w dobie.",
        gdzie: "Kalkulator „na weekend” (Moduł 12, Ekran 5) albo licznik w stacji/BMS.",
        zakres: "Z Twojego profilu zużycia.",
      },
      dni: {
        nazwa: "Doby bez ładowania",
        cel: "Na ile dób postoju bez słońca i jazdy ma starczyć akumulator.",
        gdzie: "Twój styl podróżowania.",
        zakres: "Twoja decyzja.",
      },
      napiecie: {
        nazwa: "Napięcie instalacji [V]",
        cel: "Ah × V = Wh.",
        gdzie: "Instalacja kampera (zwykle z tabliczki akumulatora).",
        zakres: "Z tabliczki.",
      },
      zapasMasy: {
        nazwa: "Zapas ładowności [kg] (opcjonalnie)",
        cel: "Sprawdza, czy akumulatory nie przekroczą ładowności pojazdu.",
        gdzie:
          "Dowód rejestracyjny: dopuszczalna masa całkowita minus masa pojazdu z wyposażeniem, pasażerami i bagażem.",
        zakres: "Puste = nie sprawdzaj.",
      },
      agmAh: {
        nazwa: "AGM: pojemność [Ah]",
        cel: "Energia jednej sztuki.",
        gdzie: "Tabliczka/karta akumulatora.",
        zakres: "Z karty.",
      },
      agmCena: {
        nazwa: "AGM: cena [{waluta}]",
        cel: "Koszt zakupu i koszt kWh.",
        gdzie: "Oferta sklepu.",
        zakres: "Twoja oferta.",
      },
      agmMasa: {
        nazwa: "AGM: masa [kg]",
        cel: "Masa całego zestawu.",
        gdzie: "Karta akumulatora.",
        zakres: "Z karty.",
      },
      agmDod: {
        nazwa: "AGM: dopuszczalna głębokość rozładowania [%]",
        cel: "Jaką część pojemności wolno zużyć.",
        gdzie: "Karta akumulatora. Moduł 4 podaje dla AGM {cykleAgm} cykli — to podpowiedź, nie dane Twojego modelu.",
        zakres: "Z karty; aplikacja nie zgaduje.",
      },
      agmCykle: {
        nazwa: "AGM: liczba cykli",
        cel: "Ile razy akumulator odda energię, zanim się zużyje.",
        gdzie: "Karta akumulatora — dla wpisanej głębokości rozładowania.",
        zakres: "Z karty; aplikacja nie zgaduje.",
      },
      lfpAh: {
        nazwa: "LiFePO4: pojemność [Ah]",
        cel: "Energia jednej sztuki.",
        gdzie: "Tabliczka/karta akumulatora.",
        zakres: "Z karty.",
      },
      lfpCena: {
        nazwa: "LiFePO4: cena [{waluta}]",
        cel: "Koszt zakupu i koszt kWh.",
        gdzie: "Oferta sklepu.",
        zakres: "Twoja oferta.",
      },
      lfpMasa: {
        nazwa: "LiFePO4: masa [kg]",
        cel: "Masa całego zestawu.",
        gdzie: "Karta akumulatora.",
        zakres: "Z karty.",
      },
      lfpDod: {
        nazwa: "LiFePO4: dopuszczalna głębokość rozładowania [%]",
        cel: "Jaką część pojemności wolno zużyć.",
        gdzie:
          "Karta akumulatora. Moduł 4 podaje dla LiFePO4 {cykleLfp} cykli — to podpowiedź, nie dane Twojego modelu.",
        zakres: "Z karty; aplikacja nie zgaduje.",
      },
      lfpCykle: {
        nazwa: "LiFePO4: liczba cykli",
        cel: "Ile razy akumulator odda energię, zanim się zużyje.",
        gdzie: "Karta akumulatora — dla wpisanej głębokości rozładowania.",
        zakres: "Z karty; aplikacja nie zgaduje.",
      },
    },
  },
  "panele-dach-kampera": {
    migawka: {
      oCoChodzi: "Dach kampera to mała elektrownia — ale dzielą go klimatyzator, świetliki i anteny.",
      jakDziala:
        "Zmierz wolne odcinki dachu między przeszkodami (wzdłuż pojazdu). Na każdym aplikacja układa siatkę paneli z marginesem i odstępami, w lepszej z dwóch orientacji, i sumuje moc.",
      poCo:
        "Dzielenie powierzchni dachu przez powierzchnię panelu zawyża wynik — panel nie może leżeć nad świetlikiem. Tu liczy się każdy odcinek osobno.",
      fizyka:
        "Paneli w rzędzie = ⌊(dostępna długość + odstęp) ÷ (bok panelu + odstęp)⌋. Dostępna = odcinek − 2 × margines. Na odcinku: rzędy wzdłuż × rzędy w poprzek.",
    },
    pola: {
      szerokosc: {
        nazwa: "Szerokość dachu [m]",
        cel: "Ile rzędów zmieści się w poprzek.",
        gdzie: "Zmierz płaską część dachu (bez zaokrąglonych krawędzi).",
        zakres: "Twój pomiar.",
      },
      margines: {
        nazwa: "Odstęp od krawędzi i przeszkód [m]",
        cel: "Miejsce na mocowania, spoilery i dostęp do świetlików.",
        gdzie: "Instrukcja mocowań paneli / producent kampera.",
        zakres: "Z instrukcji; aplikacja nie zgaduje.",
      },
      odstep: {
        nazwa: "Odstęp między panelami [m]",
        cel: "Miejsce na mocowania i wentylację.",
        gdzie: "Instrukcja mocowań.",
        zakres: "Z instrukcji.",
      },
      odcinekNazwa: {
        nazwa: "Nazwa odcinka",
        cel: "Żeby wiedzieć, który fragment dachu to który.",
        gdzie: "Dowolny opis, np. „przód do świetlika”.",
        zakres: "Tekst.",
      },
      odcinekDl: {
        nazwa: "Długość odcinka [m]",
        cel: "Wolny fragment dachu wzdłuż pojazdu, bez przeszkód.",
        gdzie: "Zmierz od krawędzi (albo przeszkody) do następnej przeszkody (albo krawędzi).",
        zakres: "Twój pomiar.",
      },
      panelDl: {
        nazwa: "Długość panelu [m]",
        cel: "Wymiar panelu.",
        gdzie: "Karta panelu.",
        zakres: "Z karty.",
      },
      panelSz: {
        nazwa: "Szerokość panelu [m]",
        cel: "Wymiar panelu.",
        gdzie: "Karta panelu.",
        zakres: "Z karty.",
      },
      panelMoc: {
        nazwa: "Moc panelu [W]",
        cel: "Łączna moc na dachu.",
        gdzie: "Tabliczka/karta panelu (Wp).",
        zakres: "Z karty.",
      },
    },
  },
  "panel-kampera": {
    migawka: {
      oCoChodzi: "Panel na dachu to jak kapelusz dla kampera — musi pasować i dawać moc.",
      jakDziala:
        "Wpisz dane dwóch konkretnych paneli z kart. Aplikacja liczy moc na kilogram (liczy się masa pojazdu), cenę za wat i cenę za wat na rok gwarancji (trwałość).",
      poCo:
        "Elastyczny jest lekki i pasuje do zaokrąglonego dachu, ale gorzej się chłodzi i zwykle krócej wytrzymuje. Sztywny jest cięższy, ale trwalszy i lepiej wentylowany od spodu.",
      fizyka:
        "W/kg = P ÷ m. {waluta}/W = cena ÷ P. {waluta}/(W·rok) = cena ÷ (P × lata gwarancji). Strata z nagrzewania = współczynnik temperaturowy × wzrost temperatury ogniw (Moduł 3).",
    },
    pola: {
      moc: {
        nazwa: "Moc [W]",
        cel: "Moc panelu w STC.",
        gdzie: "Tabliczka/karta panelu (Wp).",
        zakres: "Z karty.",
      },
      masa: {
        nazwa: "Masa [kg]",
        cel: "Moc na kilogram.",
        gdzie: "Karta panelu.",
        zakres: "Z karty.",
      },
      cena: {
        nazwa: "Cena [{waluta}]",
        cel: "Cena za wat.",
        gdzie: "Oferta sklepu.",
        zakres: "Twoja oferta.",
      },
      gwarancja: {
        nazwa: "Gwarancja mocy [lat]",
        cel: "Miara trwałości — ile lat producent gwarantuje moc.",
        gdzie: "Karta panelu / warunki gwarancji.",
        zakres: "Z karty.",
      },
      bezSzczeliny: {
        nazwa: "Montaż elastycznego bez szczeliny",
        cel: "Przyklejony płasko panel nie oddaje ciepła od spodu.",
        gdzie: "Twój plan montażu: klej na całej powierzchni = tak; na profilach/ramie = nie.",
        zakres: "Tak / nie.",
      },
    },
  },
  "alternator-vs-panele": {
    migawka: {
      oCoChodzi: "Jedziesz albo stoisz — ładowanie trzeba dobrać do stylu podróżowania.",
      jakDziala:
        "Alternator ładuje dużym prądem, ale tylko w czasie jazdy; panele słabiej, ale przez cały dzień postoju. Aplikacja liczy energię z obu na dobę, sumę wobec zapotrzebowania, czas ładowania i sprawdza napięcie ładowania dla typu akumulatora.",
      poCo:
        "Za wysokie napięcie ładowania niszczy ogniwa, za niskie nie naładuje akumulatora do pełna. LiFePO4 z alternatora ładuje się przez ładowarkę DC/DC.",
      fizyka:
        "E_alt = I × U × h_jazdy. E_PV = P × h_słońca × η. Czas do pełna ≈ Ah × (1 − SoC) ÷ I. Okno napięcia ładowania zależy od chemii (Biblia §12.31), dla 24/48 V × 2/× 4 — wynik pokazuje okno dla Twojego akumulatora.",
    },
    pola: {
      napiecie: {
        nazwa: "Napięcie akumulatora [V]",
        cel: "Przelicza prąd na energię i skaluje okno napięcia ładowania.",
        gdzie: "Tabliczka akumulatora (12, 24, 48 V).",
        zakres: "Z tabliczki.",
      },
      godzinJazdy: {
        nazwa: "Czas jazdy na dobę [h]",
        cel: "Tylko wtedy alternator ładuje.",
        gdzie: "Twój plan podróży.",
        zakres: "0–24 h.",
      },
      prad: {
        nazwa: "Prąd ładowania [A]",
        cel: "Ile amperów realnie płynie do akumulatora podczas jazdy.",
        gdzie: "Prąd znamionowy ładowarki DC/DC albo pomiar cęgami podczas jazdy.",
        zakres: "Z karty ładowarki albo pomiaru; aplikacja nie zgaduje.",
      },
      mocPanelu: {
        nazwa: "Moc paneli [W]",
        cel: "Energia z paneli.",
        gdzie: "Tabliczka paneli (Wp).",
        zakres: "Z karty.",
      },
      godzinSlonca: {
        nazwa: "Równoważne godziny pełnego słońca [h/dobę]",
        cel: "Przelicza moc paneli na energię.",
        gdzie: "Moduł 1 albo mapa nasłonecznienia dla miejsca i miesiąca.",
        zakres: "Z danych dla Twojej lokalizacji.",
      },
      sprawnosc: {
        nazwa: "Sprawność toru panel → akumulator [%]",
        cel: "Straty regulatora, kabli i ładowania.",
        gdzie: "Karty regulatora i akumulatora.",
        zakres: "Z kart; aplikacja nie zgaduje.",
      },
      zapotrzebowanie: {
        nazwa: "Zapotrzebowanie na dobę [Wh] (opcjonalnie)",
        cel: "Porównanie z sumą z obu źródeł.",
        gdzie: "Kalkulator „na weekend” (Ekran 5) albo licznik BMS.",
        zakres: "Puste = bez porównania.",
      },
      typ: {
        nazwa: "Typ akumulatora (opcjonalnie)",
        cel: "Każda chemia potrzebuje innego napięcia ładowania.",
        gdzie: "Tabliczka akumulatora.",
        zakres: "Wybierz z listy.",
      },
      dcdc: {
        nazwa: "Ładowarka DC/DC",
        cel: "Dopasowuje napięcie i ogranicza prąd z alternatora.",
        gdzie: "Twoja instalacja: urządzenie między akumulatorem rozruchowym a użytkowym.",
        zakres: "Tak / nie.",
      },
      napiecieLadowania: {
        nazwa: "Napięcie ładowania [V] (opcjonalnie)",
        cel: "Sprawdzenie z oknem dla typu akumulatora.",
        gdzie: "Karta/ustawienie prostownika, ładowarki DC/DC albo pomiar na zaciskach podczas jazdy.",
        zakres: "Puste = nie sprawdzaj.",
      },
      pojemnosc: {
        nazwa: "Pojemność [Ah] (opcjonalnie)",
        cel: "Czas ładowania do pełna.",
        gdzie: "Tabliczka akumulatora.",
        zakres: "Puste = bez czasu ładowania.",
      },
      soc: {
        nazwa: "Stan naładowania na start [%]",
        cel: "Od jakiego poziomu ładujesz.",
        gdzie: "Wskazanie BMS albo monitora baterii.",
        zakres: "0–100%.",
      },
    },
  },
  przetwornice: {
    migawka: {
      oCoChodzi: "Przetwornica dopasowuje napięcie do urządzenia — bez niej spalisz sprzęt albo nic nie zadziała.",
      jakDziala:
        "Wybierz rodzaj: ładowarka USB 5 V, przetwornica DC/DC (np. 12→24 V) albo falownik 230 V. Aplikacja liczy prąd po stronie urządzenia, prąd z akumulatora, a dla falownika minimalną moc ciągłą (suma × zapas) i szczyt przy rozruchu.",
      poCo:
        "Za słaba przetwornica się przegrzeje albo wyłączy; urządzenie z silnikiem (lodówka, pompa, narzędzie) przy starcie pobiera kilka razy więcej niż w pracy.",
      fizyka:
        "I_wy = P ÷ U_wy. I_akum = P ÷ (U_akum × η). Falownik: P_min = zapas × ΣP; szczyt = ΣP + największe P × (krotność − 1).",
    },
    pola: {
      napiecieAkumulatora: {
        nazwa: "Napięcie akumulatora [V]",
        cel: "Wejście przetwornicy — od niego zależy prąd pobierany z akumulatora.",
        gdzie: "Tabliczka akumulatora (12, 24, 48 V).",
        zakres: "Z tabliczki.",
      },
      sprawnosc: {
        nazwa: "Sprawność [%]",
        cel: "Straty w przetwornicy — przez nie z akumulatora płynie więcej, niż dostaje urządzenie.",
        gdzie: "Karta katalogowa przetwornicy/falownika.",
        zakres: "Z karty; aplikacja nie zgaduje.",
      },
      napiecieUrzadzenia: {
        nazwa: "Napięcie urządzenia [V]",
        cel: "Wyjście przetwornicy DC/DC.",
        gdzie: "Tabliczka albo zasilacz urządzenia.",
        zakres: "Z tabliczki.",
      },
      mocUrzadzenia: {
        nazwa: "Moc urządzenia [W]",
        cel: "Z niej liczony prąd wyjściowy i pobór z akumulatora.",
        gdzie: "Tabliczka urządzenia albo zasilacza (W, albo V × A).",
        zakres: "Z tabliczki.",
      },
      pradPrzetwornicy: {
        nazwa: "Prąd wyjściowy przetwornicy [A] (opcjonalnie)",
        cel: "Sprawdzenie, czy Twoja przetwornica/ładowarka nie będzie przeciążona.",
        gdzie: "Tabliczka przetwornicy albo ładowarki USB (np. 2,4 A, 3 A).",
        zakres: "Puste = nie sprawdzaj.",
      },
      nazwa: {
        nazwa: "Nazwa urządzenia",
        cel: "Tylko dla Twojej orientacji.",
        gdzie: "Dowolna.",
        zakres: "Tekst.",
      },
      moc: {
        nazwa: "Moc znamionowa [W]",
        cel: "Składnik sumy mocy pracujących jednocześnie.",
        gdzie: "Tabliczka urządzenia.",
        zakres: "Z tabliczki.",
      },
      krotnosc: {
        nazwa: "Krotność rozruchu [×]",
        cel: "Ile razy więcej urządzenie pobiera przy starcie (sprężarka, silnik).",
        gdzie: "Karta urządzenia (prąd rozruchowy ÷ prąd znamionowy) albo pomiar miernikiem z funkcją inrush.",
        zakres: "Puste = bez rozruchu (1×). Aplikacja nie zgaduje.",
      },
      zapas: {
        nazwa: "Zapas mocy [×]",
        cel: "Falownik nie powinien pracować stale na 100% mocy.",
        gdzie: "Biblia projektu podaje {zapasMin}–{zapasMax}× sumy obciążeń; wybierz sam.",
        zakres: "Mnożnik, np. {zapasMin}.",
      },
      mocFalownika: {
        nazwa: "Moc ciągła falownika [W] (opcjonalnie)",
        cel: "Sprawdzenie, czy Twój falownik wystarczy.",
        gdzie: "Karta falownika — moc ciągła (nie szczytowa).",
        zakres: "Puste = nie sprawdzaj.",
      },
      szczytFalownika: {
        nazwa: "Moc szczytowa falownika [W] (opcjonalnie)",
        cel: "Sprawdzenie, czy falownik uniesie rozruch silnika.",
        gdzie: "Karta falownika — moc szczytowa / surge (zwykle przez kilka sekund).",
        zakres: "Puste = tylko przypomnienie.",
      },
    },
  },
  "kreator-malego-odbiornika": {
    migawka: {
      oCoChodzi: "Jeden kreator dla małych odbiorników: światło awaryjne, alarm, brama, router, pompa, kocioł i inne.",
      jakDziala:
        "Wybierz scenariusz i wczytaj typowe składniki (same nazwy) albo dodaj własne. Wpisz moc i godziny pracy każdego składnika, wymagany czas podtrzymania i dane akumulatora — aplikacja policzy minimalny akumulator, falownik i opcjonalnie bilans z panelem.",
      poCo: "Zbyt mały akumulator padnie przed końcem awarii; silnik bez zapasu w falowniku nie wystartuje.",
      fizyka:
        "E_doba = Σ P × h. E_T = E_doba × T ÷ 24. C_min = E_T ÷ (U × u × η_falownika); bez falownika η = 1. Panel: E = P × h_słońca × η.",
    },
    pola: {
      scenariusz: {
        nazwa: "Scenariusz",
        cel: "Podpowiada typowe składniki i dodaje notę dla tego zastosowania.",
        gdzie: "Wybierz z listy najbliższy Twojemu odbiornikowi.",
        zakres: "Lista 16 scenariuszy; możesz też nic nie wybierać.",
      },
      nazwa: {
        nazwa: "Nazwa składnika",
        cel: "Tylko dla Twojej orientacji.",
        gdzie: "Dowolna.",
        zakres: "Tekst.",
      },
      moc: {
        nazwa: "Moc [W]",
        cel: "Składnik zużycia i mocy falownika.",
        gdzie: "Tabliczka urządzenia albo zasilacza.",
        zakres: "Z tabliczki; aplikacja nie podstawia typowych mocy.",
      },
      godziny: {
        nazwa: "Godziny pracy na dobę [h]",
        cel: "Zużycie energii składnika.",
        gdzie: "Ciągła praca = 24. Brama: liczba cykli × czas cyklu w sekundach ÷ 3600.",
        zakres: "0–24 h.",
      },
      krotnosc: {
        nazwa: "Krotność rozruchu [×]",
        cel: "Szczyt mocy przy starcie silnika (pompa, brama, sprężarka).",
        gdzie: "Karta urządzenia albo pomiar miernikiem z funkcją inrush.",
        zakres: "Puste = bez rozruchu (1×).",
      },
      czas: {
        nazwa: "Wymagany czas podtrzymania [h]",
        cel: "Jak długo odbiornik ma pracować bez sieci i bez ładowania.",
        gdzie: "Twoja ocena najdłuższej awarii.",
        zakres: "Godziny, np. 24 albo 48.",
      },
      napiecie: {
        nazwa: "Napięcie akumulatora [V]",
        cel: "Przelicza energię na Ah.",
        gdzie: "Tabliczka akumulatora.",
        zakres: "12, 24 albo 48 V.",
      },
      uzyteczna: {
        nazwa: "Część użyteczna pojemności [%]",
        cel: "Ile pojemności wolno zużyć bez szkody dla akumulatora.",
        gdzie: "Karta akumulatora (DoD).",
        zakres: "Z karty; aplikacja nie zgaduje.",
      },
      falownik: {
        nazwa: "Falownik 230 V",
        cel: "Falownik dodaje straty i musi unieść rozruch.",
        gdzie: "Czy odbiorniki są na 230 V, czy na 12/24 V.",
        zakres: "Tak / nie.",
      },
      sprawnoscFalownika: {
        nazwa: "Sprawność falownika [%]",
        cel: "Straty falownika powiększają potrzebny akumulator.",
        gdzie: "Karta falownika.",
        zakres: "Z karty; aplikacja nie zgaduje.",
      },
      posiadany: {
        nazwa: "Posiadany akumulator [Ah] (opcjonalnie)",
        cel: "Ile godzin podtrzyma Twój akumulator.",
        gdzie: "Tabliczka akumulatora.",
        zakres: "Puste = nie sprawdzaj.",
      },
      mocPanelu: {
        nazwa: "Moc panelu [W] (opcjonalnie)",
        cel: "Czy panel pokryje dobowe zużycie.",
        gdzie: "Tabliczka panelu (Wp).",
        zakres: "Puste = bez panelu.",
      },
      godzinSlonca: {
        nazwa: "Równoważne godziny pełnego słońca [h/dobę]",
        cel: "Przelicza moc panelu na energię.",
        gdzie: "Moduł 1 albo mapa nasłonecznienia dla miejsca i miesiąca (zimą mniej).",
        zakres: "Z danych dla Twojej lokalizacji.",
      },
      sprawnosc: {
        nazwa: "Sprawność toru panel → akumulator [%]",
        cel: "Straty regulatora, kabli i ładowania.",
        gdzie: "Karty regulatora i akumulatora.",
        zakres: "Z kart; aplikacja nie zgaduje.",
      },
    },
  },
  "lista-kemping": {
    migawka: {
      oCoChodzi: "Kemping to przygoda, ale prąd nie bierze się znikąd — trzeba go zabrać ze sobą.",
      jakDziala:
        "Wpisz liczbę osób, sezon, telefony i zaznacz, jaki sprzęt bierzesz. Aplikacja ułoży listę rzeczy związanych z zasilaniem, podzieloną na konieczne i opcjonalne, do odhaczania przy pakowaniu.",
      poCo:
        "Najczęściej brakuje drobiazgów: bezpiecznika zapasowego, miernika, taśmy. Gaśnica i miernik to podstawa bezpieczeństwa.",
      fizyka:
        "Lista nie liczy pojemności ani mocy — przy pozycjach są odnośniki do kalkulatorów, w których je dobierzesz.",
    },
    pola: {
      osoby: {
        nazwa: "Liczba osób",
        cel: "Liczba latarek czołowych.",
        gdzie: "Twój plan wyjazdu.",
        zakres: "Liczba całkowita.",
      },
      sezon: {
        nazwa: "Sezon",
        cel: "Zimą dochodzi osłona termiczna akumulatora, latem osłona przed słońcem.",
        gdzie: "Termin wyjazdu.",
        zakres: "Lato / wiosna-jesień / zima.",
      },
      telefony: {
        nazwa: "Telefony i tablety",
        cel: "Liczba ładowarek USB 12 V.",
        gdzie: "Policz urządzenia, które będziesz ładować na miejscu.",
        zakres: "Liczba całkowita; 0 = bez ładowarek.",
      },
      profil: {
        nazwa: "Co zabierasz",
        cel: "Każdy zaznaczony sprzęt dodaje swoje pozycje (np. panel → regulator).",
        gdzie: "Twój plan wyjazdu.",
        zakres: "Zaznacz dowolne.",
      },
    },
  },
  "szybka-diagnoza": {
    migawka: {
      oCoChodzi: "To odwrotność reszty aplikacji — zamiast projektować od zera, pomaga znaleźć, co już się zepsuło.",
      jakDziala:
        "Wybierz objaw. Aplikacja pokazuje po kolei kroki sprawdzające — od najczęstszej przyczyny. Odpowiadasz „w porządku” albo „tu jest problem”; pierwszy problem to prawdopodobna przyczyna, z odnośnikiem do kalkulatora, który pomoże ją usunąć.",
      poCo: "Szukanie usterki na chybił trafił trwa długo i bywa niebezpieczne. Kolejność kroków oszczędza czas.",
      fizyka:
        "Kroki to pytania tak/nie bez progów liczbowych — wartości (napięcie naładowanego akumulatora, przekrój) bierzesz z karty akumulatora i z kalkulatorów.",
    },
    pola: {
      objaw: {
        nazwa: "Objaw",
        cel: "Wybiera drzewo kroków diagnostycznych.",
        gdzie: "To, co widzisz: brak prądu, niskie napięcie, przegrzewanie, brak ładowania.",
        zakres: "Zmiana objawu czyści odpowiedzi.",
      },
    },
  },
  "urzadzenia-medyczne": {
    migawka: {
      oCoChodzi: "Tu nie chodzi o wygodę, tylko o zdrowie — zasilanie musi być pewne.",
      jakDziala:
        "Wpisz moc i czas pracy urządzenia oraz dane akumulatora. Aplikacja liczy akumulator na minimum {doby} doby bez ładowania i sprawdza, ile dób podtrzyma Twój. Brak drugiego niezależnego źródła zawsze daje ostrzeżenie.",
      poCo:
        "Zwykłe marginesy z innych kalkulatorów tu nie wystarczają — awaria może potrwać dłużej, a akumulator się starzeje.",
      fizyka: "E_doba = P × h. C_min = E_doba × {doby} ÷ (U × u × η_falownika); bez falownika η = 1.",
    },
    pola: {
      urzadzenie: {
        nazwa: "Urządzenie",
        cel: "Dla Twojej orientacji; obliczenie zależy od mocy i czasu pracy.",
        gdzie: "Wybierz rodzaj sprzętu.",
        zakres: "CPAP, koncentrator tlenu, inhalator, inne.",
      },
      moc: {
        nazwa: "Moc urządzenia [W]",
        cel: "Podstawa zużycia energii.",
        gdzie: "Tabliczka urządzenia, instrukcja albo pomiar watomierzem (z nawilżaczem/grzaniem rury, jeśli używasz).",
        zakres: "Z tabliczki; aplikacja nie podstawia typowych mocy.",
      },
      godziny: {
        nazwa: "Godziny pracy na dobę [h]",
        cel: "Zużycie energii na dobę.",
        gdzie: "Zalecenie lekarza; zwykle cała noc.",
        zakres: "0–24 h.",
      },
      napiecie: {
        nazwa: "Napięcie akumulatora [V]",
        cel: "Przelicza energię na Ah.",
        gdzie: "Tabliczka akumulatora.",
        zakres: "12, 24 albo 48 V.",
      },
      uzyteczna: {
        nazwa: "Część użyteczna pojemności [%]",
        cel: "Ile pojemności wolno zużyć.",
        gdzie: "Karta akumulatora (DoD).",
        zakres: "Z karty; aplikacja nie zgaduje.",
      },
      falownik: {
        nazwa: "Przez falownik 230 V",
        cel: "Falownik dodaje straty; zasilanie DC jest pewniejsze, jeśli producent je przewiduje.",
        gdzie: "Instrukcja urządzenia (wejście DC, kabel samochodowy).",
        zakres: "Tak / nie.",
      },
      sprawnoscFalownika: {
        nazwa: "Sprawność falownika [%]",
        cel: "Straty falownika powiększają potrzebny akumulator.",
        gdzie: "Karta falownika (najlepiej z czystą sinusoidą).",
        zakres: "Z karty; aplikacja nie zgaduje.",
      },
      posiadany: {
        nazwa: "Posiadany akumulator [Ah] (opcjonalnie)",
        cel: "Ile dób podtrzyma Twój akumulator.",
        gdzie: "Tabliczka akumulatora.",
        zakres: "Puste = nie sprawdzaj.",
      },
      zapas: {
        nazwa: "Drugie niezależne źródło",
        cel: "Redundancja — awaria jednego źródła nie może wyłączyć urządzenia.",
        gdzie: "Drugi naładowany akumulator, powerbank zatwierdzony przez producenta, agregat.",
        zakres: "Tak / nie; „nie wiem” traktowane jak „nie”.",
      },
    },
  },
  "urzadzenia-zabronione-falownik": {
    migawka: {
      oCoChodzi:
        "Mały falownik nie udźwignie wszystkiego — urządzenia z silnikiem i grzałką przy starcie pobierają dużo więcej.",
      jakDziala:
        "Wpisz moc ciągłą i szczytową falownika z karty oraz urządzenia z mocą i krotnością rozruchu. Każde dostaje ocenę: OK, ryzykowne albo zabronione.",
      poCo: "Zabronione urządzenie spali falownik albo będzie go wyłączać przy każdym starcie.",
      fizyka:
        "OK: P × k ≤ P_ciągła. Ryzykowne: P ≤ P_ciągła i P × k ≤ P_szczyt, ale P × k > P_ciągła (albo k nieznane). Zabronione: P > P_ciągła albo P × k > P_szczyt.",
    },
    pola: {
      mocCiagla: {
        nazwa: "Moc ciągła falownika [W]",
        cel: "Ile falownik daje bez przerwy.",
        gdzie: "Karta / tabliczka falownika (moc znamionowa, nie szczytowa).",
        zakres: "Z karty.",
      },
      mocSzczytowa: {
        nazwa: "Moc szczytowa falownika [W]",
        cel: "Ile falownik wytrzyma chwilowo przy rozruchu.",
        gdzie: "Karta falownika — peak / surge / przeciążalność (zwykle przez kilka sekund).",
        zakres: "Z karty; aplikacja nie zgaduje.",
      },
      nazwa: {
        nazwa: "Nazwa urządzenia",
        cel: "Rozpoznanie urządzenia w ocenie.",
        gdzie: "Dowolna; przyciski „+” dodają typowe ryzykowne urządzenia (tylko nazwy).",
        zakres: "Tekst.",
      },
      moc: {
        nazwa: "Moc urządzenia [W]",
        cel: "Moc w czasie pracy.",
        gdzie: "Tabliczka urządzenia.",
        zakres: "Z tabliczki.",
      },
      krotnosc: {
        nazwa: "Krotność rozruchu [×]",
        cel: "Ile razy więcej urządzenie pobiera przy starcie.",
        gdzie: "Karta urządzenia (prąd rozruchowy ÷ znamionowy) albo pomiar miernikiem z funkcją inrush.",
        zakres: "Puste = nieznane → ocena „ryzykowne”.",
      },
    },
  },
  "blackout-balkon": {
    migawka: {
      oCoChodzi: "W bloku nie masz działki, ale masz balkon — to Twoja minielektrownia na czas awarii.",
      jakDziala:
        "Wpisz odbiorniki krytyczne, czas blackoutu, stację zasilania i — opcjonalnie — panele na balustradzie. Aplikacja liczy, ile godzin wytrzyma sama stacja, ile paneli zmieści się na balustradzie i czy razem wystarczy na cały blackout.",
      poCo: "Stacja kupiona „na oko” często wystarcza na kilka godzin, a blackout trwa dłużej.",
      fizyka:
        "E_doba = Σ P × h. Magazyn = Wh × u × η. Panele: n = ⌊długość balustrady ÷ szerokość panelu⌋, E = n × P × h_słońca × η. Bilans = magazyn + panele × T/24 − E_doba × T/24.",
    },
    pola: {
      nazwa: {
        nazwa: "Nazwa odbiornika",
        cel: "Tylko dla Twojej orientacji.",
        gdzie: "Dowolna.",
        zakres: "Tekst.",
      },
      moc: {
        nazwa: "Moc [W]",
        cel: "Składnik zużycia.",
        gdzie: "Tabliczka urządzenia.",
        zakres: "Z tabliczki.",
      },
      godziny: {
        nazwa: "Godziny pracy na dobę [h]",
        cel: "Zużycie energii odbiornika.",
        gdzie: "Lodówka pracuje cyklicznie — wpisz realny czas pracy sprężarki; router 24 h.",
        zakres: "0–24 h.",
      },
      czas: {
        nazwa: "Czas blackoutu [h]",
        cel: "Ile godzin chcesz przetrwać.",
        gdzie: "Twoja ocena (np. 24 albo 48 h).",
        zakres: "Godziny.",
      },
      pojemnosc: {
        nazwa: "Pojemność stacji [Wh]",
        cel: "Energia magazynu.",
        gdzie: "Tabliczka stacji (Wh); dla akumulatora Ah × V.",
        zakres: "Z tabliczki.",
      },
      uzyteczna: {
        nazwa: "Część użyteczna [%]",
        cel: "Ile energii wolno wykorzystać.",
        gdzie: "Karta stacji / akumulatora.",
        zakres: "Z karty; aplikacja nie zgaduje.",
      },
      sprawnoscFalownika: {
        nazwa: "Sprawność falownika [%]",
        cel: "Straty przy zamianie na 230 V.",
        gdzie: "Karta stacji.",
        zakres: "Z karty; aplikacja nie zgaduje.",
      },
      balustrada: {
        nazwa: "Długość balustrady [m]",
        cel: "Ile paneli zmieści się w rzędzie.",
        gdzie: "Zmierz odcinek balustrady w słońcu.",
        zakres: "Puste = bez paneli.",
      },
      szerokoscPanelu: {
        nazwa: "Szerokość panelu [m]",
        cel: "Wymiar wzdłuż balustrady.",
        gdzie: "Karta panelu (wymiary).",
        zakres: "Z karty.",
      },
      mocPanelu: {
        nazwa: "Moc panelu [W]",
        cel: "Energia z jednego panelu.",
        gdzie: "Tabliczka panelu (Wp).",
        zakres: "Z karty.",
      },
      godzinSlonca: {
        nazwa: "Godziny pełnego słońca [h/dobę]",
        cel: "Przelicza moc na energię.",
        gdzie:
          "Moduł 1 albo mapa nasłonecznienia — na balkonie uwzględnij orientację i zacienienie (panel pionowy daje mniej).",
        zakres: "Z danych dla Twojego balkonu.",
      },
      sprawnosc: {
        nazwa: "Sprawność toru panel → magazyn [%]",
        cel: "Straty regulatora i ładowania.",
        gdzie: "Karta stacji (wejście PV).",
        zakres: "Z karty; aplikacja nie zgaduje.",
      },
    },
  },
  "szablony-zestawow": {
    migawka: {
      oCoChodzi:
        "Zamiast zaczynać od pustej kartki, wybierz typowy zestaw: kamper, jacht, domek, warsztat albo kemping.",
      jakDziala:
        "Szablon wczytuje nazwy typowych odbiorników. Ty wpisujesz ich moce i czasy, napięcie, DoD i słońce — aplikacja liczy zużycie, szczyt, akumulator na pobyt i na dobę, panel i minimalny prąd regulatora.",
      poCo: "Najczęstszy błąd to zapomniany odbiornik — szablon przypomina, o czym pomyśleć.",
      fizyka:
        "E_d = Σ P × h (× osoby). C_pobyt = E_d × dni ÷ (U × DoD), C_doba = E_d ÷ (U × DoD). P_PV = E_d ÷ (h_słońca × η), I_reg = P_PV ÷ U.",
    },
    pola: {
      dni: {
        nazwa: "Liczba dni",
        cel: "Długość pobytu — akumulator na cały pobyt bez słońca.",
        gdzie: "Twój plan wyjazdu.",
        zakres: "Dni.",
      },
      osoby: {
        nazwa: "Liczba osób",
        cel: "Mnoży odbiorniki liczone „na osobę” (telefony, ładowarki).",
        gdzie: "Twój plan.",
        zakres: "Osoby.",
      },
      nazwa: {
        nazwa: "Nazwa odbiornika",
        cel: "Tylko dla Twojej orientacji.",
        gdzie: "Z szablonu albo własna.",
        zakres: "Tekst.",
      },
      moc: {
        nazwa: "Moc [W]",
        cel: "Składnik zużycia i szczytu.",
        gdzie: "Tabliczka urządzenia.",
        zakres: "Z tabliczki; aplikacja nie zgaduje.",
      },
      godziny: {
        nazwa: "Godziny pracy na dobę [h]",
        cel: "Zużycie energii odbiornika.",
        gdzie: "Lodówka pracuje cyklicznie — wpisz realny czas pracy sprężarki.",
        zakres: "0–24 h.",
      },
      naOsobe: {
        nazwa: "Na osobę",
        cel: "Odbiornik liczony osobno dla każdej osoby.",
        gdzie: "Np. telefon każdego uczestnika.",
        zakres: "Tak / nie.",
      },
      napiecie: {
        nazwa: "Napięcie akumulatora [V]",
        cel: "Przelicza Wh na Ah i moc panelu na prąd regulatora.",
        gdzie: "Tabliczka akumulatora / system (12, 24 V).",
        zakres: "Napięcie znamionowe.",
      },
      dod: {
        nazwa: "Część użyteczna (DoD) [%]",
        cel: "Ile energii akumulatora wolno wykorzystać.",
        gdzie: "Karta katalogowa akumulatora.",
        zakres: "Z karty; aplikacja nie zgaduje.",
      },
      godzinSlonca: {
        nazwa: "Godziny pełnego słońca [h/dobę]",
        cel: "Dobór mocy panelu.",
        gdzie: "Moduł 1 albo mapa nasłonecznienia dla miejsca i miesiąca.",
        zakres: "0 = bez panelu.",
      },
      sprawnosc: {
        nazwa: "Sprawność toru panel → akumulator [%]",
        cel: "Straty regulatora, kabli i ładowania.",
        gdzie: "Karty regulatora i akumulatora.",
        zakres: "Z kart; aplikacja nie zgaduje.",
      },
    },
  },
  "test-akumulatora": {
    migawka: {
      oCoChodzi: "Nie musisz być elektronikiem, żeby sprawdzić, czy akumulator jeszcze żyje.",
      jakDziala:
        "Zmierz napięcie po {h} h spoczynku, potem pod znanym obciążeniem (np. żarówka). Ze spadku napięcia aplikacja liczy rezystancję wewnętrzną i porównuje ją z kartą katalogową.",
      poCo:
        "Zużyty akumulator ma wysoką rezystancję — pod obciążeniem napięcie mu „siada”, choć w spoczynku wygląda dobrze.",
      fizyka:
        "I = P ÷ U_obc. R = (U_spocz − U_obc) ÷ I. Wzrost = (R − R_karta) ÷ R_karta; ≥ 50% (próg z Modułu 4) = do wymiany. Ołów 12 V: ≤ 10,5 V w spoczynku = do wyrzucenia (Biblia), przeliczane przez liczbę ogniw 2 V.",
    },
    pola: {
      znamionowe: {
        nazwa: "Napięcie znamionowe [V]",
        cel: "Przelicza próg 10,5 V dla akumulatora 12 V na inne napięcia.",
        gdzie: "Tabliczka akumulatora (12, 24 V).",
        zakres: "Napięcie znamionowe.",
      },
      spoczynkowe: {
        nazwa: "Napięcie spoczynkowe [V]",
        cel: "Pierwszy, najprostszy sygnał stanu.",
        gdzie: "Miernik na zaciskach, po min. {h} h bez obciążenia i ładowania.",
        zakres: "Z pomiaru.",
      },
      mocObciazenia: {
        nazwa: "Moc obciążenia testowego [W]",
        cel: "Daje prąd testu I = P ÷ U.",
        gdzie: "Tabliczka obciążenia (np. żarówka 12 V).",
        zakres: "Puste = bez testu obciążeniowego.",
      },
      podObciazeniem: {
        nazwa: "Napięcie pod obciążeniem [V]",
        cel: "Spadek napięcia daje rezystancję wewnętrzną.",
        gdzie: "Miernik na zaciskach po kilku sekundach pracy obciążenia.",
        zakres: "Niższe niż spoczynkowe.",
      },
      rezystancjaKarta: {
        nazwa: "Rezystancja wewnętrzna z karty [mΩ]",
        cel: "Odniesienie dla nowego akumulatora.",
        gdzie: "Karta katalogowa producenta.",
        zakres: "Puste = brak odniesienia (wynik niejasny).",
      },
    },
  },
  "raport-bezpieczenstwa-maly": {
    migawka: {
      oCoChodzi: "Bezpieczeństwo to podstawa. Raport pokazuje, gdzie są słabe punkty.",
      jakDziala:
        "Przejdź siedem punktów z Biblii (bezpiecznik przy akumulatorze, dobór bezpieczników, bezpiecznik a przewód, przewody, ochrona przed rozładowaniem, wentylacja, połączenia) i zaznacz OK albo Błąd. Przy każdym błędzie dostajesz krok naprawczy i link do kalkulatora.",
      poCo:
        "W małych instalacjach najczęstszą przyczyną pożaru jest brak bezpiecznika przy akumulatorze i luźny styk — nie sam akumulator.",
      fizyka:
        "Bezpieczeństwo = OK ÷ wszystkie punkty × 100%. Niesprawdzony punkt nie liczy się jako OK. Brak bezpiecznika przy akumulatorze albo bezpiecznik większy niż obciążalność przewodu = stop 🔴.",
    },
    pola: {
      bezpiecznikAkumulatora: {
        nazwa: "Bezpiecznik przy akumulatorze",
        cel: "Chroni przewód od akumulatora przed zwarciem.",
        gdzie: "Plus akumulatora — bezpiecznik jak najbliżej zacisku.",
        zakres: "OK / Błąd.",
      },
      doborBezpiecznikow: {
        nazwa: "Dobór bezpieczników",
        cel: "Bezpiecznik nie może wyzwalać przy normalnej pracy odbiorników.",
        gdzie: "Porównaj prąd bezpiecznika z prądem odbiorników na tym obwodzie.",
        zakres: "OK / Błąd.",
      },
      bezpiecznikAPrzewod: {
        nazwa: "Bezpiecznik a przewód",
        cel: "Bezpiecznik ma chronić przewód: większy niż obciążalność przewodu nie zadziała, zanim przewód się przegrzeje.",
        gdzie: "Porównaj prąd bezpiecznika z obciążalnością przewodu (kalkulator kabli i bezpieczników).",
        zakres: "OK / Błąd. Błąd = stop 🔴.",
      },
      przekrojePrzewodow: {
        nazwa: "Przekroje przewodów",
        cel: "Za cienki przewód grzeje się i obniża napięcie.",
        gdzie: "Kalkulator kabli i bezpieczników małej instalacji.",
        zakres: "OK / Błąd.",
      },
      ochronaRozladowania: {
        nazwa: "Ochrona przed rozładowaniem",
        cel: "Głębokie rozładowanie niszczy akumulator.",
        gdzie: "BMS, LVD albo wyjście obciążenia regulatora.",
        zakres: "OK / Błąd.",
      },
      wentylacjaAkumulatora: {
        nazwa: "Wentylacja akumulatora",
        cel: "Wodór z ołowiowego, przegrzanie LiFePO4.",
        gdzie: "Miejsce montażu akumulatora.",
        zakres: "OK / Błąd.",
      },
      polaczenia: {
        nazwa: "Połączenia",
        cel: "Luźny styk grzeje się — częsta przyczyna pożaru.",
        gdzie: "Wszystkie końcówki i zaciski.",
        zakres: "OK / Błąd.",
      },
    },
  },
  "ladowanie-z-regulatora": {
    migawka: {
      oCoChodzi:
        "Regulator MPPT to nie jest „magiczny” kran: prąd do akumulatora zależy od mocy paneli, napięcia akumulatora i trzech limitów — regulatora, jego wejścia PV i samego akumulatora.",
      jakDziala:
        "Aplikacja dzieli moc paneli (do limitu wejścia PV regulatora) przez napięcie akumulatora, a potem obcina wynik kolejno do limitu prądu regulatora i prądu ładowania akumulatora. Mówi, który z nich faktycznie ogranicza. Jeśli podasz pojemność i zakres stanu naładowania, policzy też szybkość ładowania (C) i czas przy stałym prądzie.",
      poCo:
        "Żeby wiedzieć, ile prądu realnie wpłynie do akumulatora, czy regulator nie jest za mały dla paneli i czy trzeba ustawić limit prądu ładowania, zanim akumulator dostanie więcej, niż zaleca producent.",
      fizyka:
        "I = (P · η) / U. Moc paneli z tabliczki to warunki STC, więc to GÓRNA granica prądu — zimą i pod chmurami jest niższy. Czas t = (C · ΔSOC/100) / I jest DOLNĄ granicą, bo pod koniec ładowania prąd spada.",
    },
    pola: {
      mocPaneli: {
        nazwa: "Łączna moc paneli [W]",
        cel: "Z niej liczony jest prąd, jaki panele mogą dać. Przy kilku panelach wpisz sumę mocy wszystkich, które trafiają do tego regulatora.",
        gdzie: "Na tabliczce lub w karcie każdego panelu (moc w STC, „Pmax”).",
        zakres: "Z karty paneli — aplikacja nie zgaduje mocy.",
      },
      pradRegulatora: {
        nazwa: "Maks. prąd ładowania regulatora [A]",
        cel: "Regulator nie odda do akumulatora więcej niż ten prąd, nawet jeśli panele mogłyby dać więcej.",
        gdzie: "W karcie regulatora: „Maximum charge current”, „Nominal charge current”. Wybór modelu z katalogu wstawia tę wartość.",
        zakres: "Z karty regulatora; puste pole = limit nieznany, wtedy nie jest liczony.",
      },
      mocRegulatora: {
        nazwa: "Maks. moc wejścia PV regulatora [W]",
        cel: "Powyżej tej mocy nadmiar paneli jest obcinany, więc nie zwiększa prądu ładowania. Dla niektórych regulatorów moc zależy od napięcia akumulatora.",
        gdzie: "W karcie regulatora: „Maximum PV power”, „Max. PV array power” (przy 12/24/48 V).",
        zakres: "Z karty regulatora; puste pole = limit nieznany.",
      },
      sprawnosc: {
        nazwa: "Sprawność regulatora [%]",
        cel: "Straty w regulatorze zmniejszają moc docierającą do akumulatora. Bez wpisu aplikacja liczy bez strat (górna granica).",
        gdzie: "W karcie regulatora: „Peak efficiency”, „Sprawność szczytowa”. Sprawność szczytowa jest zwykle wyższa niż przeciętna w pracy.",
        zakres: "Od 0 do 100 %, z karty urządzenia; puste pole = bez strat.",
      },
      napiecie: {
        nazwa: "Napięcie akumulatora [V]",
        cel: "Prąd = moc ÷ napięcie, więc ten sam panel daje większy prąd przy 12 V niż przy 24 V.",
        gdzie: "Napięcie znamionowe akumulatora lub banku (12, 24, 48 V…).",
        zakres: "Z karty akumulatora.",
      },
      limitAkumulatora: {
        nazwa: "Maks. prąd ładowania akumulatora [A]",
        cel: "Powyżej tego prądu ładowanie skraca życie akumulatora lub grozi uszkodzeniem. Jeśli możliwy prąd jest większy, limit trzeba ustawić w regulatorze.",
        gdzie: "W karcie akumulatora: „Max. charge current”, często podawany jako ułamek pojemności (np. 0,3 C).",
        zakres: "Z karty akumulatora; puste pole = limit nieznany, wtedy brak oceny.",
      },
      pojemnosc: {
        nazwa: "Pojemność akumulatora [Ah]",
        cel: "Potrzebna do szybkości ładowania (prąd ÷ pojemność) i czasu ładowania.",
        gdzie: "Na naklejce akumulatora. Dla banku: suma pojemności połączeń równoległych.",
        zakres: "Z karty akumulatora; puste pole = bez czasu i C.",
      },
      socOd: {
        nazwa: "Stan naładowania na początku [%]",
        cel: "Początek zakresu, dla którego liczony jest czas ładowania.",
        gdzie: "Z woltomierza, BMS lub wskaźnika akumulatora.",
        zakres: "0–100 %, mniej niż stan na końcu.",
      },
      socDo: {
        nazwa: "Stan naładowania na końcu [%]",
        cel: "Koniec zakresu. Czas liczony jest przy stałym prądzie, więc dla ładowania do 100 % rzeczywisty czas jest dłuższy.",
        gdzie: "Docelowy stan, np. 80 % przy ładowaniu w trybie oszczędzającym akumulator.",
        zakres: "0–100 %, więcej niż stan na początku.",
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
        nazwa: "Fuel price [{waluta}/l]",
        cel: "Turns litres into money.",
        gdzie: "Current price at the filling station.",
        zakres: "Current price.",
      },
      porownanie: {
        nazwa: "Cost of 1 kWh from another source [{waluta}/kWh] (optional)",
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
        nazwa: "Extension cord / line cost [{waluta}]",
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
        nazwa: "Grid energy price [{waluta}/kWh]",
        cel: "Turns kWh into money.",
        gdzie: "Electricity bill — gross price per kWh with variable charges; or the rate agreed with a neighbour.",
        zakres: "From the bill.",
      },
      oplaty: {
        nazwa: "Fixed grid charges [{waluta}/year] (optional)",
        cel: "Charges independent of use (subscription, fixed fee) — with low use they can exceed the energy itself.",
        gdzie: "Electricity bill, fixed items × billing periods per year.",
        zakres: "Empty = none.",
      },
      zestaw: {
        nazwa: "Solar set cost [{waluta}]",
        cel: "The one-off expense on the solar side.",
        gdzie: "Sum of prices: panel, battery, charge controller, cables, mounting.",
        zakres: "From a quote or price list.",
      },
      eksploatacja: {
        nazwa: "Yearly upkeep of the set [{waluta}/year] (optional)",
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
        "For the station: manufacturer capacity × usable share. For DIY: battery capacity [Ah] × voltage × allowed depth of discharge. Price ÷ energy = {waluta} per 1 Wh. Optionally mass per 1 kWh.",
      poCo:
        "A station is ready to work and has warranty and service, but you pay more for every Wh. DIY is cheaper and easier to expand, but it needs knowledge (fuses, cables) and work. If you do not want to deal with cables — station. If you like tinkering — DIY.",
      fizyka:
        "Battery energy E = C [Ah] × U [V]. Usable = E × DoD. Example from the source: a 500 Wh station for 1200 PLN is 2.4 PLN/Wh; a 100 Ah 12 V lead-acid battery (about 600 Wh at 50% DoD) with accessories for 700 PLN is about 1.17 PLN/Wh — about 2× more energy for the same money.",
    },
    pola: {
      cenaStacji: {
        nazwa: "Station price [{waluta}]",
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
        nazwa: "DIY parts price [{waluta}]",
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
  "panel-dla-urzadzenia": {
    migawka: {
      oCoChodzi: "You size a panel for one device only, not for the whole house.",
      jakDziala:
        "Daily use = power × running hours. The panel must deliver it during the day: panel power = use ÷ (full-sun hours × yield). If you enter the panel you have, the app compares it with the result.",
      poCo:
        "A panel that is too small means the device drains the battery a bit more every day. The result is the minimum for an average day — cloudy days need a reserve.",
      fizyka:
        "E = P × h. P_panel = E ÷ (sun hours × yield). Example from the source: a 50 W fridge × 8 h = 400 Wh; a 150 W panel at 70% yield delivers it in about 3.8 full-sun hours.",
    },
    pola: {
      moc: {
        nazwa: "Device power [W]",
        cel: "Power and running time give the consumption.",
        gdzie:
          "Nameplate, manual or search for your model. For a compressor fridge — average power or power × compressor running time.",
        zakres: "From your device's nameplate.",
      },
      godzinPracy: {
        nazwa: "Running time per day [h]",
        cel: "How many hours a day the device actually draws power.",
        gdzie: "Your usage or compressor running time (a fridge cycles).",
        zakres: "0–24 h.",
      },
      godzinSlonca: {
        nazwa: "Equivalent full-sun hours [h/day]",
        cel: "Turns panel power into daily energy.",
        gdzie: "Module 1 (climate and location) or an insolation map for your month.",
        zakres: "From data for your location and month.",
      },
      uzysk: {
        nazwa: "Yield of the panel's rated power [%]",
        cel:
          "A panel rarely delivers its full nameplate power: temperature, controller, cables. This share really reaches the device.",
        gdzie:
          "Panel datasheet (temperature coefficient) and controller datasheet (efficiency). The source gives 70% as an example — an example, not a rule.",
        zakres: "From the datasheets; the app does not guess.",
      },
      posiadany: {
        nazwa: "Power of the panel you have [W] (optional)",
        cel: "Comparison with the required power.",
        gdzie: "Panel nameplate (Wp).",
        zakres: "Empty = sizing only.",
      },
    },
  },
  "laczenie-paneli-przenosnych": {
    migawka: {
      oCoChodzi: "You check whether camping panels can be connected together and to your power station.",
      jakDziala:
        "The app compares panel type and connectors. Solar power banks and USB outputs are not combined — they contain a controller or converter. Different connectors need a factory adapter. Different panels can be combined, but with a power loss.",
      poCo:
        "A wrong connection can damage a built-in controller or the station input. Connectors are the first step — check voltage and current on the “Panel for a power station” screen.",
      fizyka:
        "In series: voltages add up, current = the lowest of the panels. In parallel: currents add up, voltage = the lowest of the panels. That is why different panels lose part of the power.",
    },
    pola: {
      typ: {
        nazwa: "Panel type",
        cel: "A solar power bank has its own controller — it is not combined with other panels.",
        gdzie:
          "Product description: a folding panel/blanket has only cells and a plug; a power bank has a battery and USB sockets.",
        zakres: "Choose from the list.",
      },
      liczba: {
        nazwa: "Number of panels",
        cel: "With one panel you only check connector compatibility with the station.",
        gdzie: "How many panels you want to connect at once.",
        zakres: "1 or more.",
      },
      takieSame: {
        nazwa: "Same model",
        cel: "Different panels in one string lose power to the weakest one.",
        gdzie: "Compare nameplates: Vmp, Imp and power should be the same.",
        zakres: "Yes / no.",
      },
      zlaczePaneli: {
        nazwa: "Panel output connector",
        cel: "Must match the station input or an adapter.",
        gdzie: "The end of the panel cable; described in the manual.",
        zakres: "Choose from the list.",
      },
      zlaczeWejscia: {
        nazwa: "PV input connector",
        cel: "This is where you plug in the panels.",
        gdzie: "The “Solar/PV IN” socket on the station or the controller terminals; described in the manual.",
        zakres: "Choose from the list.",
      },
      adapter: {
        nazwa: "Adapter between connectors",
        cel: "Lets you join different connectors — if it has the right polarity and can carry the current.",
        gdzie: "A factory adapter from the station maker or a proven replacement with a stated current rating.",
        zakres: "Yes / no.",
      },
    },
  },
  "powerbank-vs-akumulator": {
    migawka: {
      oCoChodzi: "A power bank is convenience, but a battery set is capacity and power.",
      jakDziala:
        "The app checks whether the power bank has enough continuous power for the device and counts how many times each option charges it (or runs it for a day): energy × efficiency ÷ energy per use.",
      poCo:
        "A phone or a lamp is a job for a power bank. A camping fridge usually exceeds a power bank's output — then you need a battery with a converter.",
      fizyka: "n = E × η ÷ E_use. Battery: E = Ah × V × usable share. Power condition: P_device ≤ P_power bank output.",
    },
    pola: {
      mocUrzadzenia: {
        nazwa: "Device power [W]",
        cel: "Compared with the power bank output.",
        gdzie: "The device's power supply/charger (W) or nameplate.",
        zakres: "From your device's nameplate.",
      },
      energiaUzycia: {
        nazwa: "Energy per use [Wh]",
        cel: "Gives the number of charges or days.",
        gdzie: "The device battery (Wh on the laptop/phone case) or power × running hours per day.",
        zakres: "From your device's data.",
      },
      pbWh: {
        nazwa: "Power bank capacity [Wh]",
        cel: "Energy stored in the power bank.",
        gdzie: "Label. If only mAh is given: Wh = mAh × voltage on the label ÷ 1000.",
        zakres: "From the label.",
      },
      pbMoc: {
        nazwa: "Max power bank output [W]",
        cel: "Whether the power bank can run the device.",
        gdzie: "Label/manual — continuous power of the output you will use (USB-C PD, DC, 230 V).",
        zakres: "From the label.",
      },
      akAh: {
        nazwa: "Battery capacity [Ah]",
        cel: "Battery energy.",
        gdzie: "Battery nameplate.",
        zakres: "From the nameplate.",
      },
      akV: {
        nazwa: "Battery voltage [V]",
        cel: "Ah × V = Wh.",
        gdzie: "Battery nameplate.",
        zakres: "From the nameplate.",
      },
      akUzyteczna: {
        nazwa: "Usable share of capacity [%]",
        cel: "A battery is not discharged to zero — how much you may use depends on the chemistry.",
        gdzie: "Battery datasheet (depth of discharge).",
        zakres: "From the datasheet; the app does not guess.",
      },
      sprawnosc: {
        nazwa: "Conversion efficiency [%]",
        cel: "Converters and cables lose some energy on the way to the device.",
        gdzie: "Converter/charger datasheet.",
        zakres: "From the datasheets; the app does not guess.",
      },
    },
  },
  "blackout-minimum": {
    migawka: {
      oCoChodzi:
        "A blackout is a test — you need to know what to save first. This is not an off-grid design, just the minimum to get through a grid failure without panic.",
      jakDziala:
        "Enter only critical loads (e.g. 1. fridge, 2. router, 3. lighting, 4. chargers) and the outage time. The app computes the energy, the minimum battery and the converter power; it also shows the energy for 12, 24 and 48 h.",
      poCo:
        "Every extra load means a bigger and more expensive kit. A priority list lets you decide consciously what to switch off when the outage drags on.",
      fizyka:
        "E_day = Σ P × h. E = E_day × T ÷ 24. Battery = E ÷ (η × U × usable share). Converter ≥ Σ P (plus start-up margin — Converters screen).",
    },
    pola: {
      nazwa: {
        nazwa: "Load name",
        cel: "Keeps the priority list readable.",
        gdzie: "Any name; enter from the most important.",
        zakres: "Text.",
      },
      moc: {
        nazwa: "Power [W]",
        cel: "Energy and the minimum converter power.",
        gdzie: "Device nameplate or a plug-in power meter.",
        zakres: "From your device's nameplate.",
      },
      godziny: {
        nazwa: "Running time per day [h]",
        cel: "Average per day — a fridge cycles, a router runs all day.",
        gdzie: "Your usage; for a fridge — compressor running time (power meter over a day).",
        zakres: "0–24 h.",
      },
      czas: {
        nazwa: "Blackout duration [h]",
        cel: "How many hours the kit must last.",
        gdzie: "Your experience with outages in the area; the source shows 12, 24 and 48 h variants.",
        zakres: "Your decision.",
      },
      napiecie: {
        nazwa: "Battery voltage [V]",
        cel: "Converts energy to Ah.",
        gdzie: "Battery nameplate.",
        zakres: "From the nameplate.",
      },
      uzyteczna: {
        nazwa: "Usable share of capacity [%]",
        cel: "A battery is not discharged to zero.",
        gdzie: "Battery datasheet (depth of discharge).",
        zakres: "From the datasheet; the app does not guess.",
      },
      sprawnosc: {
        nazwa: "Converter efficiency [%]",
        cel: "Losses when turning 12/24 V into 230 V.",
        gdzie: "Converter datasheet. If everything runs directly from 12 V — enter 100.",
        zakres: "From the datasheet; the app does not guess.",
      },
      posiadany: {
        nazwa: "Battery you have [Ah] (optional)",
        cel: "Checks how many hours it lasts.",
        gdzie: "Battery nameplate.",
        zakres: "Empty = sizing only.",
      },
    },
  },
  "akumulator-kampera": {
    migawka: {
      oCoChodzi: "The battery is the heart of a camper — and in a vehicle every kilogram counts.",
      jakDziala:
        "Enter the demand and the data of specific batteries from their datasheets. The app computes how many units of each technology cover the needs for the given number of days, what that weighs and costs, and the cost of 1 kWh over the battery's lifetime.",
      poCo:
        "AGM is cheaper up front but heavier, lets you use a smaller share of its capacity and lasts fewer cycles. The lifetime kWh cost and the weight usually decide. Full technology comparison: Module 4, Screen 30.",
      fizyka: "E = demand × days. Units = ⌈E ÷ (Ah × V × DoD)⌉. kWh cost = price ÷ (Ah × V × DoD × cycles ÷ 1000).",
    },
    pola: {
      zapotrzebowanie: {
        nazwa: "Daily demand [Wh]",
        cel: "How much energy the camper uses per day.",
        gdzie: "The “weekend” calculator (Module 12, Screen 5) or the meter in the station/BMS.",
        zakres: "From your usage profile.",
      },
      dni: {
        nazwa: "Days without charging",
        cel: "How many days parked without sun or driving the battery must last.",
        gdzie: "Your travel style.",
        zakres: "Your decision.",
      },
      napiecie: {
        nazwa: "System voltage [V]",
        cel: "Ah × V = Wh.",
        gdzie: "The camper system (usually from the battery nameplate).",
        zakres: "From the nameplate.",
      },
      zapasMasy: {
        nazwa: "Payload reserve [kg] (optional)",
        cel: "Checks the batteries do not exceed the vehicle payload.",
        gdzie:
          "Registration document: gross vehicle weight minus the weight of the vehicle with equipment, passengers and luggage.",
        zakres: "Empty = do not check.",
      },
      agmAh: {
        nazwa: "AGM: capacity [Ah]",
        cel: "Energy of one unit.",
        gdzie: "Battery nameplate/datasheet.",
        zakres: "From the datasheet.",
      },
      agmCena: {
        nazwa: "AGM: price [{waluta}]",
        cel: "Purchase cost and kWh cost.",
        gdzie: "Shop offer.",
        zakres: "Your offer.",
      },
      agmMasa: {
        nazwa: "AGM: weight [kg]",
        cel: "Weight of the whole bank.",
        gdzie: "Battery datasheet.",
        zakres: "From the datasheet.",
      },
      agmDod: {
        nazwa: "AGM: allowed depth of discharge [%]",
        cel: "What share of the capacity you may use.",
        gdzie: "Battery datasheet. Module 4 gives {cykleAgm} cycles for AGM — a hint, not your model's data.",
        zakres: "From the datasheet; the app does not guess.",
      },
      agmCykle: {
        nazwa: "AGM: number of cycles",
        cel: "How many times the battery delivers energy before it wears out.",
        gdzie: "Battery datasheet — for the entered depth of discharge.",
        zakres: "From the datasheet; the app does not guess.",
      },
      lfpAh: {
        nazwa: "LiFePO4: capacity [Ah]",
        cel: "Energy of one unit.",
        gdzie: "Battery nameplate/datasheet.",
        zakres: "From the datasheet.",
      },
      lfpCena: {
        nazwa: "LiFePO4: price [{waluta}]",
        cel: "Purchase cost and kWh cost.",
        gdzie: "Shop offer.",
        zakres: "Your offer.",
      },
      lfpMasa: {
        nazwa: "LiFePO4: weight [kg]",
        cel: "Weight of the whole bank.",
        gdzie: "Battery datasheet.",
        zakres: "From the datasheet.",
      },
      lfpDod: {
        nazwa: "LiFePO4: allowed depth of discharge [%]",
        cel: "What share of the capacity you may use.",
        gdzie: "Battery datasheet. Module 4 gives {cykleLfp} cycles for LiFePO4 — a hint, not your model's data.",
        zakres: "From the datasheet; the app does not guess.",
      },
      lfpCykle: {
        nazwa: "LiFePO4: number of cycles",
        cel: "How many times the battery delivers energy before it wears out.",
        gdzie: "Battery datasheet — for the entered depth of discharge.",
        zakres: "From the datasheet; the app does not guess.",
      },
    },
  },
  "panele-dach-kampera": {
    migawka: {
      oCoChodzi: "A camper roof is a small power plant — but it is split by the A/C unit, skylights and antennas.",
      jakDziala:
        "Measure the free roof sections between obstacles (along the vehicle). On each, the app lays out a grid of panels with a margin and gaps, in the better of two orientations, and adds up the power.",
      poCo:
        "Dividing the roof area by the panel area overstates the result — a panel cannot sit over a skylight. Here each section is counted separately.",
      fizyka:
        "Panels in a row = ⌊(available length + gap) ÷ (panel side + gap)⌋. Available = section − 2 × margin. Per section: rows along × rows across.",
    },
    pola: {
      szerokosc: {
        nazwa: "Roof width [m]",
        cel: "How many rows fit across.",
        gdzie: "Measure the flat part of the roof (without rounded edges).",
        zakres: "Your measurement.",
      },
      margines: {
        nazwa: "Clearance from edges and obstacles [m]",
        cel: "Room for mounts, spoilers and skylight access.",
        gdzie: "Panel mounting instructions / camper maker.",
        zakres: "From the instructions; the app does not guess.",
      },
      odstep: {
        nazwa: "Gap between panels [m]",
        cel: "Room for mounts and ventilation.",
        gdzie: "Mounting instructions.",
        zakres: "From the instructions.",
      },
      odcinekNazwa: {
        nazwa: "Section name",
        cel: "To know which part of the roof is which.",
        gdzie: "Any description, e.g. “front to skylight”.",
        zakres: "Text.",
      },
      odcinekDl: {
        nazwa: "Section length [m]",
        cel: "A free stretch of roof along the vehicle, without obstacles.",
        gdzie: "Measure from the edge (or obstacle) to the next obstacle (or edge).",
        zakres: "Your measurement.",
      },
      panelDl: {
        nazwa: "Panel length [m]",
        cel: "Panel dimension.",
        gdzie: "Panel datasheet.",
        zakres: "From the datasheet.",
      },
      panelSz: {
        nazwa: "Panel width [m]",
        cel: "Panel dimension.",
        gdzie: "Panel datasheet.",
        zakres: "From the datasheet.",
      },
      panelMoc: {
        nazwa: "Panel power [W]",
        cel: "Total power on the roof.",
        gdzie: "Panel nameplate/datasheet (Wp).",
        zakres: "From the datasheet.",
      },
    },
  },
  "panel-kampera": {
    migawka: {
      oCoChodzi: "A roof panel is like a hat for a camper — it must fit and deliver power.",
      jakDziala:
        "Enter the data of two specific panels from their datasheets. The app computes power per kilogram (vehicle weight matters), price per watt and price per watt per warranty year (durability).",
      poCo:
        "A flexible panel is light and fits a curved roof but cools worse and usually lasts less. A rigid one is heavier but more durable and better ventilated from below.",
      fizyka:
        "W/kg = P ÷ m. {waluta}/W = price ÷ P. {waluta}/(W·year) = price ÷ (P × warranty years). Heat loss = temperature coefficient × cell temperature rise (Module 3).",
    },
    pola: {
      moc: {
        nazwa: "Power [W]",
        cel: "Panel power at STC.",
        gdzie: "Panel nameplate/datasheet (Wp).",
        zakres: "From the datasheet.",
      },
      masa: {
        nazwa: "Weight [kg]",
        cel: "Power per kilogram.",
        gdzie: "Panel datasheet.",
        zakres: "From the datasheet.",
      },
      cena: {
        nazwa: "Price [{waluta}]",
        cel: "Price per watt.",
        gdzie: "Shop offer.",
        zakres: "Your offer.",
      },
      gwarancja: {
        nazwa: "Power warranty [years]",
        cel: "A measure of durability — how many years the maker guarantees the power.",
        gdzie: "Panel datasheet / warranty terms.",
        zakres: "From the datasheet.",
      },
      bezSzczeliny: {
        nazwa: "Flexible mounted without a gap",
        cel: "A panel glued flat cannot shed heat from below.",
        gdzie: "Your mounting plan: adhesive over the whole surface = yes; on profiles/frame = no.",
        zakres: "Yes / no.",
      },
    },
  },
  "alternator-vs-panele": {
    migawka: {
      oCoChodzi: "You drive or you stay — charging must match your travel style.",
      jakDziala:
        "The alternator charges at a high current but only while driving; panels charge weaker but all day while parked. The app computes daily energy from both, the sum against demand, the charging time, and checks the charging voltage for the battery type.",
      poCo:
        "Too high a charging voltage destroys cells, too low never fully charges the battery. LiFePO4 is charged from the alternator through a DC/DC charger.",
      fizyka:
        "E_alt = I × U × h_drive. E_PV = P × h_sun × η. Time to full ≈ Ah × (1 − SoC) ÷ I. The charging voltage window depends on the chemistry (Bible §12.31), for 24/48 V × 2/× 4 — the result shows the window for your battery.",
    },
    pola: {
      napiecie: {
        nazwa: "Battery voltage [V]",
        cel: "Turns current into energy and scales the charging voltage window.",
        gdzie: "Battery nameplate (12, 24, 48 V).",
        zakres: "From the nameplate.",
      },
      godzinJazdy: {
        nazwa: "Driving time per day [h]",
        cel: "The alternator charges only then.",
        gdzie: "Your travel plan.",
        zakres: "0–24 h.",
      },
      prad: {
        nazwa: "Charging current [A]",
        cel: "How many amps really flow into the battery while driving.",
        gdzie: "Rated current of the DC/DC charger or a clamp-meter reading while driving.",
        zakres: "From the charger datasheet or a measurement; the app does not guess.",
      },
      mocPanelu: {
        nazwa: "Panel power [W]",
        cel: "Energy from the panels.",
        gdzie: "Panel nameplate (Wp).",
        zakres: "From the datasheet.",
      },
      godzinSlonca: {
        nazwa: "Equivalent full-sun hours [h/day]",
        cel: "Turns panel power into energy.",
        gdzie: "Module 1 or an insolation map for the place and month.",
        zakres: "From data for your location.",
      },
      sprawnosc: {
        nazwa: "Panel → battery path efficiency [%]",
        cel: "Controller, cable and charging losses.",
        gdzie: "Controller and battery datasheets.",
        zakres: "From the datasheets; the app does not guess.",
      },
      zapotrzebowanie: {
        nazwa: "Daily demand [Wh] (optional)",
        cel: "Compared with the sum of both sources.",
        gdzie: "The “weekend” calculator (Screen 5) or the BMS meter.",
        zakres: "Empty = no comparison.",
      },
      typ: {
        nazwa: "Battery type (optional)",
        cel: "Each chemistry needs a different charging voltage.",
        gdzie: "Battery nameplate.",
        zakres: "Choose from the list.",
      },
      dcdc: {
        nazwa: "DC/DC charger",
        cel: "Matches the voltage and limits the current from the alternator.",
        gdzie: "Your system: the device between the starter and leisure batteries.",
        zakres: "Yes / no.",
      },
      napiecieLadowania: {
        nazwa: "Charging voltage [V] (optional)",
        cel: "Checked against the window for the battery type.",
        gdzie: "Datasheet/setting of the charger or DC/DC, or a reading at the terminals while driving.",
        zakres: "Empty = do not check.",
      },
      pojemnosc: {
        nazwa: "Capacity [Ah] (optional)",
        cel: "Charging time to full.",
        gdzie: "Battery nameplate.",
        zakres: "Empty = no charging time.",
      },
      soc: {
        nazwa: "Starting state of charge [%]",
        cel: "The level you charge from.",
        gdzie: "BMS or battery monitor reading.",
        zakres: "0–100%.",
      },
    },
  },
  przetwornice: {
    migawka: {
      oCoChodzi: "A converter matches the voltage to the device — without it you burn the equipment or nothing works.",
      jakDziala:
        "Choose the type: USB 5 V charger, DC/DC converter (e.g. 12→24 V) or 230 V inverter. The app computes the device-side current, the battery current and, for an inverter, the minimum continuous power (total × margin) and the starting peak.",
      poCo:
        "Too weak a converter overheats or shuts down; a motor device (fridge, pump, tool) draws several times more at start than while running.",
      fizyka:
        "I_out = P ÷ U_out. I_batt = P ÷ (U_batt × η). Inverter: P_min = margin × ΣP; peak = ΣP + largest P × (multiple − 1).",
    },
    pola: {
      napiecieAkumulatora: {
        nazwa: "Battery voltage [V]",
        cel: "Converter input — sets the current drawn from the battery.",
        gdzie: "Battery nameplate (12, 24, 48 V).",
        zakres: "From the nameplate.",
      },
      sprawnosc: {
        nazwa: "Efficiency [%]",
        cel: "Converter losses — more flows from the battery than the device receives.",
        gdzie: "Converter/inverter datasheet.",
        zakres: "From the datasheet; the app does not guess.",
      },
      napiecieUrzadzenia: {
        nazwa: "Device voltage [V]",
        cel: "Output of the DC/DC converter.",
        gdzie: "Nameplate or power adapter of the device.",
        zakres: "From the nameplate.",
      },
      mocUrzadzenia: {
        nazwa: "Device power [W]",
        cel: "Used to compute the output current and the battery draw.",
        gdzie: "Nameplate of the device or adapter (W, or V × A).",
        zakres: "From the nameplate.",
      },
      pradPrzetwornicy: {
        nazwa: "Converter output current [A] (optional)",
        cel: "Checks that your converter/charger will not be overloaded.",
        gdzie: "Nameplate of the converter or USB charger (e.g. 2.4 A, 3 A).",
        zakres: "Empty = do not check.",
      },
      nazwa: {
        nazwa: "Device name",
        cel: "Only for your orientation.",
        gdzie: "Any.",
        zakres: "Text.",
      },
      moc: {
        nazwa: "Rated power [W]",
        cel: "Part of the total power running at the same time.",
        gdzie: "Device nameplate.",
        zakres: "From the nameplate.",
      },
      krotnosc: {
        nazwa: "Start surge multiple [×]",
        cel: "How many times more the device draws at start (compressor, motor).",
        gdzie: "Device datasheet (inrush current ÷ rated current) or a meter with an inrush function.",
        zakres: "Empty = no surge (1×). The app does not guess.",
      },
      zapas: {
        nazwa: "Power margin [×]",
        cel: "An inverter should not run at 100% continuously.",
        gdzie: "The project Bible gives {zapasMin}–{zapasMax}× the total load; choose yourself.",
        zakres: "Multiplier, e.g. {zapasMin}.",
      },
      mocFalownika: {
        nazwa: "Inverter continuous power [W] (optional)",
        cel: "Checks that your inverter is enough.",
        gdzie: "Inverter datasheet — continuous (not peak) power.",
        zakres: "Empty = do not check.",
      },
      szczytFalownika: {
        nazwa: "Inverter surge power [W] (optional)",
        cel: "Checks that the inverter can handle a motor start.",
        gdzie: "Inverter datasheet — peak / surge power (usually for a few seconds).",
        zakres: "Empty = reminder only.",
      },
    },
  },
  "kreator-malego-odbiornika": {
    migawka: {
      oCoChodzi: "One wizard for small loads: emergency light, alarm, gate, router, pump, boiler and more.",
      jakDziala:
        "Choose a scenario and load the typical components (names only) or add your own. Enter the power and running hours of each component, the required backup time and the battery data — the app computes the minimum battery, inverter and optionally the balance with a panel.",
      poCo: "Too small a battery dies before the outage ends; a motor without inverter headroom will not start.",
      fizyka:
        "E_day = Σ P × h. E_T = E_day × T ÷ 24. C_min = E_T ÷ (U × u × η_inverter); without an inverter η = 1. Panel: E = P × h_sun × η.",
    },
    pola: {
      scenariusz: {
        nazwa: "Scenario",
        cel: "Suggests typical components and adds a note for this use.",
        gdzie: "Choose the one closest to your load.",
        zakres: "List of 16 scenarios; you can also choose none.",
      },
      nazwa: {
        nazwa: "Component name",
        cel: "Only for your orientation.",
        gdzie: "Any.",
        zakres: "Text.",
      },
      moc: {
        nazwa: "Power [W]",
        cel: "Part of the consumption and of the inverter power.",
        gdzie: "Nameplate of the device or adapter.",
        zakres: "From the nameplate; the app does not insert typical powers.",
      },
      godziny: {
        nazwa: "Running hours per day [h]",
        cel: "Energy use of the component.",
        gdzie: "Continuous = 24. Gate: number of cycles × cycle time in seconds ÷ 3600.",
        zakres: "0–24 h.",
      },
      krotnosc: {
        nazwa: "Start surge multiple [×]",
        cel: "Power peak at motor start (pump, gate, compressor).",
        gdzie: "Device datasheet or a meter with an inrush function.",
        zakres: "Empty = no surge (1×).",
      },
      czas: {
        nazwa: "Required backup time [h]",
        cel: "How long the load must run without grid and without charging.",
        gdzie: "Your estimate of the longest outage.",
        zakres: "Hours, e.g. 24 or 48.",
      },
      napiecie: {
        nazwa: "Battery voltage [V]",
        cel: "Converts energy to Ah.",
        gdzie: "Battery nameplate.",
        zakres: "12, 24 or 48 V.",
      },
      uzyteczna: {
        nazwa: "Usable part of capacity [%]",
        cel: "How much capacity may be used without harming the battery.",
        gdzie: "Battery datasheet (DoD).",
        zakres: "From the datasheet; the app does not guess.",
      },
      falownik: {
        nazwa: "230 V inverter",
        cel: "An inverter adds losses and must handle the start surge.",
        gdzie: "Whether the loads are 230 V or 12/24 V.",
        zakres: "Yes / no.",
      },
      sprawnoscFalownika: {
        nazwa: "Inverter efficiency [%]",
        cel: "Inverter losses enlarge the battery needed.",
        gdzie: "Inverter datasheet.",
        zakres: "From the datasheet; the app does not guess.",
      },
      posiadany: {
        nazwa: "Battery you have [Ah] (optional)",
        cel: "How many hours your battery will hold.",
        gdzie: "Battery nameplate.",
        zakres: "Empty = do not check.",
      },
      mocPanelu: {
        nazwa: "Panel power [W] (optional)",
        cel: "Whether the panel covers the daily use.",
        gdzie: "Panel nameplate (Wp).",
        zakres: "Empty = no panel.",
      },
      godzinSlonca: {
        nazwa: "Equivalent full-sun hours [h/day]",
        cel: "Turns panel power into energy.",
        gdzie: "Module 1 or an insolation map for the place and month (less in winter).",
        zakres: "From data for your location.",
      },
      sprawnosc: {
        nazwa: "Panel → battery path efficiency [%]",
        cel: "Controller, cable and charging losses.",
        gdzie: "Controller and battery datasheets.",
        zakres: "From the datasheets; the app does not guess.",
      },
    },
  },
  "lista-kemping": {
    migawka: {
      oCoChodzi: "Camping is an adventure, but power does not come from nowhere — you have to bring it with you.",
      jakDziala:
        "Enter the number of people, the season, the phones and tick the gear you take. The app builds a list of power-related items, split into must-have and optional, to tick off while packing.",
      poCo:
        "Small things are most often missing: a spare fuse, a meter, tape. A fire extinguisher and a meter are the basis of safety.",
      fizyka: "The list does not compute capacity or power — the items link to calculators where you size them.",
    },
    pola: {
      osoby: {
        nazwa: "Number of people",
        cel: "Number of head torches.",
        gdzie: "Your trip plan.",
        zakres: "Whole number.",
      },
      sezon: {
        nazwa: "Season",
        cel: "In winter a thermal battery cover is added, in summer a sun cover.",
        gdzie: "Trip date.",
        zakres: "Summer / spring-autumn / winter.",
      },
      telefony: {
        nazwa: "Phones and tablets",
        cel: "Number of 12 V USB chargers.",
        gdzie: "Count the devices you will charge on site.",
        zakres: "Whole number; 0 = no chargers.",
      },
      profil: {
        nazwa: "What you take",
        cel: "Each ticked item adds its own entries (e.g. panel → controller).",
        gdzie: "Your trip plan.",
        zakres: "Tick any.",
      },
    },
  },
  "szybka-diagnoza": {
    migawka: {
      oCoChodzi:
        "The opposite of the rest of the app — instead of designing from scratch, it helps find what has already broken.",
      jakDziala:
        "Choose a symptom. The app shows the check steps one by one — from the most common cause. You answer “fine” or “problem here”; the first problem is the likely cause, with a link to the calculator that helps fix it.",
      poCo: "Hunting a fault at random takes long and can be dangerous. The step order saves time.",
      fizyka:
        "Steps are yes/no questions without numeric thresholds — values (charged battery voltage, cable size) come from the battery datasheet and the calculators.",
    },
    pola: {
      objaw: {
        nazwa: "Symptom",
        cel: "Selects the tree of diagnostic steps.",
        gdzie: "What you see: no power, low voltage, overheating, no charging.",
        zakres: "Changing the symptom clears the answers.",
      },
    },
  },
  "urzadzenia-medyczne": {
    migawka: {
      oCoChodzi: "This is not about comfort but health — the power supply must be certain.",
      jakDziala:
        "Enter the device power and running time and the battery data. The app sizes the battery for at least {doby} days without charging and checks how many days yours lasts. No second independent source always gives a warning.",
      poCo: "The usual margins of other calculators are not enough here — an outage may last longer and batteries age.",
      fizyka: "E_day = P × h. C_min = E_day × {doby} ÷ (U × u × η_inverter); without an inverter η = 1.",
    },
    pola: {
      urzadzenie: {
        nazwa: "Device",
        cel: "For your orientation; the result depends on power and running time.",
        gdzie: "Choose the type of equipment.",
        zakres: "CPAP, oxygen concentrator, nebuliser, other.",
      },
      moc: {
        nazwa: "Device power [W]",
        cel: "Basis of the energy use.",
        gdzie: "Device nameplate, manual or a wattmeter reading (with humidifier/heated tube if you use them).",
        zakres: "From the nameplate; the app does not insert typical powers.",
      },
      godziny: {
        nazwa: "Running hours per day [h]",
        cel: "Daily energy use.",
        gdzie: "Doctor's recommendation; usually the whole night.",
        zakres: "0–24 h.",
      },
      napiecie: {
        nazwa: "Battery voltage [V]",
        cel: "Converts energy to Ah.",
        gdzie: "Battery nameplate.",
        zakres: "12, 24 or 48 V.",
      },
      uzyteczna: {
        nazwa: "Usable part of capacity [%]",
        cel: "How much capacity may be used.",
        gdzie: "Battery datasheet (DoD).",
        zakres: "From the datasheet; the app does not guess.",
      },
      falownik: {
        nazwa: "Through a 230 V inverter",
        cel: "An inverter adds losses; DC supply is more reliable if the manufacturer provides for it.",
        gdzie: "Device manual (DC input, car cable).",
        zakres: "Yes / no.",
      },
      sprawnoscFalownika: {
        nazwa: "Inverter efficiency [%]",
        cel: "Inverter losses enlarge the battery needed.",
        gdzie: "Inverter datasheet (preferably pure sine wave).",
        zakres: "From the datasheet; the app does not guess.",
      },
      posiadany: {
        nazwa: "Battery you have [Ah] (optional)",
        cel: "How many days your battery lasts.",
        gdzie: "Battery nameplate.",
        zakres: "Empty = do not check.",
      },
      zapas: {
        nazwa: "Second independent source",
        cel: "Redundancy — failure of one source must not switch off the device.",
        gdzie: "A second charged battery, a manufacturer-approved power bank, a generator.",
        zakres: "Yes / no; “don't know” is treated as “no”.",
      },
    },
  },
  "urzadzenia-zabronione-falownik": {
    migawka: {
      oCoChodzi: "A small inverter cannot carry everything — motor and heater devices draw much more at start.",
      jakDziala:
        "Enter the inverter's continuous and peak power from the datasheet and the devices with power and start multiple. Each gets a rating: OK, risky or not allowed.",
      poCo: "A forbidden device burns the inverter or trips it at every start.",
      fizyka:
        "OK: P × k ≤ P_cont. Risky: P ≤ P_cont and P × k ≤ P_peak, but P × k > P_cont (or k unknown). Not allowed: P > P_cont or P × k > P_peak.",
    },
    pola: {
      mocCiagla: {
        nazwa: "Inverter continuous power [W]",
        cel: "What the inverter delivers non-stop.",
        gdzie: "Inverter datasheet / nameplate (rated, not peak power).",
        zakres: "From the datasheet.",
      },
      mocSzczytowa: {
        nazwa: "Inverter peak power [W]",
        cel: "What the inverter withstands briefly at start.",
        gdzie: "Inverter datasheet — peak / surge / overload (usually for a few seconds).",
        zakres: "From the datasheet; the app does not guess.",
      },
      nazwa: {
        nazwa: "Device name",
        cel: "Identifies the device in the rating.",
        gdzie: "Any; the “+” buttons add typical risky devices (names only).",
        zakres: "Text.",
      },
      moc: {
        nazwa: "Device power [W]",
        cel: "Power while running.",
        gdzie: "Device nameplate.",
        zakres: "From the nameplate.",
      },
      krotnosc: {
        nazwa: "Start multiple [×]",
        cel: "How many times more the device draws at start.",
        gdzie: "Device datasheet (inrush ÷ rated current) or an inrush meter reading.",
        zakres: "Empty = unknown → rated “risky”.",
      },
    },
  },
  "blackout-balkon": {
    migawka: {
      oCoChodzi: "In a flat you have no plot, but you have a balcony — your mini power plant for an outage.",
      jakDziala:
        "Enter the critical loads, the blackout time, the power station and — optionally — railing panels. The app computes how many hours the station alone lasts, how many panels fit on the railing and whether together they cover the whole blackout.",
      poCo: "A station bought “by eye” often lasts a few hours, while a blackout lasts longer.",
      fizyka:
        "E_day = Σ P × h. Storage = Wh × u × η. Panels: n = ⌊railing length ÷ panel width⌋, E = n × P × h_sun × η. Balance = storage + panels × T/24 − E_day × T/24.",
    },
    pola: {
      nazwa: {
        nazwa: "Load name",
        cel: "Only for your orientation.",
        gdzie: "Any.",
        zakres: "Text.",
      },
      moc: {
        nazwa: "Power [W]",
        cel: "Part of the consumption.",
        gdzie: "Device nameplate.",
        zakres: "From the nameplate.",
      },
      godziny: {
        nazwa: "Running hours per day [h]",
        cel: "Energy use of the load.",
        gdzie: "A fridge runs in cycles — enter the real compressor time; router 24 h.",
        zakres: "0–24 h.",
      },
      czas: {
        nazwa: "Blackout time [h]",
        cel: "How many hours you want to get through.",
        gdzie: "Your estimate (e.g. 24 or 48 h).",
        zakres: "Hours.",
      },
      pojemnosc: {
        nazwa: "Station capacity [Wh]",
        cel: "Storage energy.",
        gdzie: "Station nameplate (Wh); for a battery Ah × V.",
        zakres: "From the nameplate.",
      },
      uzyteczna: {
        nazwa: "Usable part [%]",
        cel: "How much energy may be used.",
        gdzie: "Station / battery datasheet.",
        zakres: "From the datasheet; the app does not guess.",
      },
      sprawnoscFalownika: {
        nazwa: "Inverter efficiency [%]",
        cel: "Losses converting to 230 V.",
        gdzie: "Station datasheet.",
        zakres: "From the datasheet; the app does not guess.",
      },
      balustrada: {
        nazwa: "Railing length [m]",
        cel: "How many panels fit in a row.",
        gdzie: "Measure the sunny stretch of railing.",
        zakres: "Empty = no panels.",
      },
      szerokoscPanelu: {
        nazwa: "Panel width [m]",
        cel: "Dimension along the railing.",
        gdzie: "Panel datasheet (dimensions).",
        zakres: "From the datasheet.",
      },
      mocPanelu: {
        nazwa: "Panel power [W]",
        cel: "Energy from one panel.",
        gdzie: "Panel nameplate (Wp).",
        zakres: "From the datasheet.",
      },
      godzinSlonca: {
        nazwa: "Full-sun hours [h/day]",
        cel: "Turns power into energy.",
        gdzie:
          "Module 1 or an insolation map — on a balcony account for orientation and shading (a vertical panel gives less).",
        zakres: "From data for your balcony.",
      },
      sprawnosc: {
        nazwa: "Panel → storage path efficiency [%]",
        cel: "Controller and charging losses.",
        gdzie: "Station datasheet (PV input).",
        zakres: "From the datasheet; the app does not guess.",
      },
    },
  },
  "szablony-zestawow": {
    migawka: {
      oCoChodzi:
        "Instead of starting from a blank page, pick a typical kit: camper van, yacht, cabin, workshop or camping.",
      jakDziala:
        "The template loads the names of typical devices. You enter their powers and times, voltage, DoD and sun — the app computes use, peak, battery for the stay and per day, the panel and the minimum controller current.",
      poCo: "The most common mistake is a forgotten device — the template reminds you what to think about.",
      fizyka:
        "E_d = Σ P × h (× people). C_stay = E_d × days ÷ (U × DoD), C_day = E_d ÷ (U × DoD). P_PV = E_d ÷ (h_sun × η), I_ctrl = P_PV ÷ U.",
    },
    pola: {
      dni: {
        nazwa: "Number of days",
        cel: "Length of the stay — battery for the whole stay without sun.",
        gdzie: "Your trip plan.",
        zakres: "Days.",
      },
      osoby: {
        nazwa: "Number of people",
        cel: "Multiplies devices counted “per person” (phones, chargers).",
        gdzie: "Your plan.",
        zakres: "People.",
      },
      nazwa: {
        nazwa: "Device name",
        cel: "Only for your orientation.",
        gdzie: "From the template or your own.",
        zakres: "Text.",
      },
      moc: {
        nazwa: "Power [W]",
        cel: "Part of the use and the peak.",
        gdzie: "Device nameplate.",
        zakres: "From the nameplate; the app does not guess.",
      },
      godziny: {
        nazwa: "Running hours per day [h]",
        cel: "Energy use of the device.",
        gdzie: "A fridge runs in cycles — enter the real compressor time.",
        zakres: "0–24 h.",
      },
      naOsobe: {
        nazwa: "Per person",
        cel: "Device counted separately for each person.",
        gdzie: "E.g. each participant's phone.",
        zakres: "Yes / no.",
      },
      napiecie: {
        nazwa: "Battery voltage [V]",
        cel: "Converts Wh to Ah and panel power to controller current.",
        gdzie: "Battery nameplate / system (12, 24 V).",
        zakres: "Nominal voltage.",
      },
      dod: {
        nazwa: "Usable share (DoD) [%]",
        cel: "How much battery energy may be used.",
        gdzie: "Battery datasheet.",
        zakres: "From the datasheet; the app does not guess.",
      },
      godzinSlonca: {
        nazwa: "Peak sun hours [h/day]",
        cel: "Sizing the panel power.",
        gdzie: "Module 1 or a solar map for the place and month.",
        zakres: "0 = no panel.",
      },
      sprawnosc: {
        nazwa: "Panel → battery path efficiency [%]",
        cel: "Controller, cable and charging losses.",
        gdzie: "Controller and battery datasheets.",
        zakres: "From the datasheets; the app does not guess.",
      },
    },
  },
  "test-akumulatora": {
    migawka: {
      oCoChodzi: "You do not need to be an electronics expert to check whether a battery is still alive.",
      jakDziala:
        "Measure the voltage after {h} h of rest, then under a known load (e.g. a bulb). From the voltage drop the app computes the internal resistance and compares it with the datasheet.",
      poCo: "A worn battery has high resistance — under load its voltage “sags”, even though it looks fine at rest.",
      fizyka:
        "I = P ÷ U_load. R = (U_rest − U_load) ÷ I. Growth = (R − R_sheet) ÷ R_sheet; ≥ 50% (Module 4 threshold) = replace. Lead 12 V: ≤ 10.5 V at rest = discard (Bible), scaled by the number of 2 V cells.",
    },
    pola: {
      znamionowe: {
        nazwa: "Nominal voltage [V]",
        cel: "Scales the 10.5 V threshold of a 12 V battery to other voltages.",
        gdzie: "Battery nameplate (12, 24 V).",
        zakres: "Nominal voltage.",
      },
      spoczynkowe: {
        nazwa: "Rest voltage [V]",
        cel: "The first, simplest sign of the state.",
        gdzie: "Meter on the terminals, after at least {h} h without load and charging.",
        zakres: "From the measurement.",
      },
      mocObciazenia: {
        nazwa: "Test load power [W]",
        cel: "Gives the test current I = P ÷ U.",
        gdzie: "Load nameplate (e.g. a 12 V bulb).",
        zakres: "Empty = no load test.",
      },
      podObciazeniem: {
        nazwa: "Voltage under load [V]",
        cel: "The voltage drop gives the internal resistance.",
        gdzie: "Meter on the terminals after a few seconds of load.",
        zakres: "Lower than at rest.",
      },
      rezystancjaKarta: {
        nazwa: "Datasheet internal resistance [mΩ]",
        cel: "Reference for a new battery.",
        gdzie: "Manufacturer's datasheet.",
        zakres: "Empty = no reference (unclear result).",
      },
    },
  },
  "raport-bezpieczenstwa-maly": {
    migawka: {
      oCoChodzi: "Safety comes first. The report shows where the weak points are.",
      jakDziala:
        "Go through the seven points from the Bible (battery fuse, fuse sizing, fuse vs cable, cables, discharge protection, ventilation, connections) and mark OK or Fault. Each fault gives a repair step and a link to a calculator.",
      poCo:
        "In small installations the most common fire cause is a missing battery fuse and a loose contact — not the battery itself.",
      fizyka:
        "Safety = OK ÷ all points × 100%. An unchecked point does not count as OK. No fuse at the battery = stop 🔴.",
    },
    pola: {
      bezpiecznikAkumulatora: {
        nazwa: "Fuse at the battery",
        cel: "Protects the battery cable from a short circuit.",
        gdzie: "Battery positive — fuse as close to the terminal as possible.",
        zakres: "OK / Fault.",
      },
      doborBezpiecznikow: {
        nazwa: "Fuse sizing",
        cel: "A fuse must not trip during normal operation of the loads.",
        gdzie: "Compare the fuse rating with the load current on that circuit.",
        zakres: "OK / Fault.",
      },
      bezpiecznikAPrzewod: {
        nazwa: "Fuse vs cable",
        cel: "The fuse protects the cable: one rated above the cable ampacity will not open before the cable overheats.",
        gdzie: "Compare the fuse rating with the cable ampacity (cables and fuses calculator).",
        zakres: "OK / Fault. Fault = stop 🔴.",
      },
      przekrojePrzewodow: {
        nazwa: "Cable cross-sections",
        cel: "A too-thin cable heats up and lowers the voltage.",
        gdzie: "Small installation cables and fuses calculator.",
        zakres: "OK / Fault.",
      },
      ochronaRozladowania: {
        nazwa: "Deep-discharge protection",
        cel: "Deep discharge destroys the battery.",
        gdzie: "BMS, LVD or the controller's load output.",
        zakres: "OK / Fault.",
      },
      wentylacjaAkumulatora: {
        nazwa: "Battery ventilation",
        cel: "Hydrogen from lead-acid, overheating of LiFePO4.",
        gdzie: "Where the battery is mounted.",
        zakres: "OK / Fault.",
      },
      polaczenia: {
        nazwa: "Connections",
        cel: "A loose contact heats up — a common fire cause.",
        gdzie: "All lugs and terminals.",
        zakres: "OK / Fault.",
      },
    },
  },
  "ladowanie-z-regulatora": {
    migawka: {
      oCoChodzi:
        "An MPPT regulator is not a magic tap: the current into the battery depends on the panel power, the battery voltage and three limits — the regulator's, its PV input and the battery's own.",
      jakDziala:
        "The app divides the panel power (up to the regulator's PV input limit) by the battery voltage, then caps the result by the regulator current limit and the battery charging current. It tells which of them actually limits. If you enter the capacity and a state-of-charge range, it also gives the charging rate (C) and the time at a constant current.",
      poCo:
        "To know how much current will really flow into the battery, whether the regulator is too small for the panels and whether a charging current limit must be set before the battery gets more than the manufacturer recommends.",
      fizyka:
        "I = (P · η) / U. The panel power from the plate is STC, so this is an UPPER bound of the current — lower in winter and under cloud. The time t = (C · ΔSOC/100) / I is a LOWER bound because the current falls near the end of the charge.",
    },
    pola: {
      mocPaneli: {
        nazwa: "Total panel power [W]",
        cel: "The current the panels can give is calculated from it. With several panels enter the sum of all that feed this regulator.",
        gdzie: "On the plate or in the datasheet of each panel (STC power, “Pmax”).",
        zakres: "From the panel datasheet — the app does not guess the power.",
      },
      pradRegulatora: {
        nazwa: "Regulator max. charging current [A]",
        cel: "The regulator will not give the battery more than this current even if the panels could deliver more.",
        gdzie: "In the regulator datasheet: “Maximum charge current”, “Nominal charge current”. Picking the model from the catalogue fills it in.",
        zakres: "From the regulator datasheet; empty = limit unknown, then it is not counted.",
      },
      mocRegulatora: {
        nazwa: "Regulator max. PV input power [W]",
        cel: "Above this power the panel surplus is cut off, so it does not raise the charging current. For some regulators the power depends on the battery voltage.",
        gdzie: "In the regulator datasheet: “Maximum PV power”, “Max. PV array power” (at 12/24/48 V).",
        zakres: "From the regulator datasheet; empty = limit unknown.",
      },
      sprawnosc: {
        nazwa: "Regulator efficiency [%]",
        cel: "Losses in the regulator lower the power reaching the battery. Without an entry the app counts without losses (an upper bound).",
        gdzie: "In the regulator datasheet: “Peak efficiency”. The peak efficiency is usually higher than the average in operation.",
        zakres: "0 to 100 %, from the device datasheet; empty = no losses.",
      },
      napiecie: {
        nazwa: "Battery voltage [V]",
        cel: "Current = power ÷ voltage, so the same panel gives more current at 12 V than at 24 V.",
        gdzie: "The nominal voltage of the battery or bank (12, 24, 48 V…).",
        zakres: "From the battery datasheet.",
      },
      limitAkumulatora: {
        nazwa: "Battery max. charging current [A]",
        cel: "Above this current charging shortens the battery's life or risks damage. If the possible current is higher, the limit has to be set in the regulator.",
        gdzie: "In the battery datasheet: “Max. charge current”, often given as a fraction of the capacity (e.g. 0.3 C).",
        zakres: "From the battery datasheet; empty = limit unknown, then no check.",
      },
      pojemnosc: {
        nazwa: "Battery capacity [Ah]",
        cel: "Needed for the charging rate (current ÷ capacity) and the charging time.",
        gdzie: "On the battery label. For a bank: the sum of the parallel capacities.",
        zakres: "From the battery datasheet; empty = no time and no C.",
      },
      socOd: {
        nazwa: "State of charge at the start [%]",
        cel: "The start of the range for which the charging time is calculated.",
        gdzie: "From a voltmeter, the BMS or the battery gauge.",
        zakres: "0–100 %, lower than the end value.",
      },
      socDo: {
        nazwa: "State of charge at the end [%]",
        cel: "The end of the range. The time assumes a constant current, so for charging to 100 % the real time is longer.",
        gdzie: "The target level, e.g. 80 % when charging gently for the battery.",
        zakres: "0–100 %, higher than the start value.",
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
        nazwa: "Цена топлива [{waluta}/л]",
        cel: "Переводит литры в деньги.",
        gdzie: "Текущая цена на заправке.",
        zakres: "Текущая цена.",
      },
      porownanie: {
        nazwa: "Стоимость 1 кВт·ч из другого источника [{waluta}/кВт·ч] (необязательно)",
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
        nazwa: "Стоимость удлинителя / линии [{waluta}]",
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
        nazwa: "Цена электроэнергии из сети [{waluta}/кВт·ч]",
        cel: "Переводит кВт·ч в деньги.",
        gdzie:
          "Счёт за электричество — цена брутто за кВт·ч с переменными платежами; или ставка, согласованная с соседом.",
        zakres: "Из счёта.",
      },
      oplaty: {
        nazwa: "Постоянные сетевые платежи [{waluta}/год] (необязательно)",
        cel:
          "Платежи, не зависящие от потребления (абонентская плата) — при малом потреблении могут превышать саму энергию.",
        gdzie: "Счёт за электричество, постоянные позиции × число периодов в году.",
        zakres: "Пусто = нет.",
      },
      zestaw: {
        nazwa: "Стоимость солнечного комплекта [{waluta}]",
        cel: "Разовый расход на солнечной стороне.",
        gdzie: "Сумма цен: панель, аккумулятор, контроллер, провода, монтаж.",
        zakres: "Из сметы или прайса.",
      },
      eksploatacja: {
        nazwa: "Годовые расходы на содержание комплекта [{waluta}/год] (необязательно)",
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
        "Для станции: ёмкость производителя × доступная часть. Для самодельного: ёмкость аккумулятора [А·ч] × напряжение × допустимая глубина разряда. Цена ÷ энергия = {waluta} за 1 Вт·ч. Дополнительно масса на 1 кВт·ч.",
      poCo:
        "Станция готова к работе, есть гарантия и сервис, но каждый Вт·ч дороже. Самодельный комплект дешевле и легче расширяется, но требует знаний (предохранители, провода) и работы. Не хотите возиться с кабелями — станция. Любите мастерить — самоделка.",
      fizyka:
        "Энергия аккумулятора E = C [А·ч] × U [В]. Полезная = E × DoD. Пример из источника: станция 500 Вт·ч за 1200 зл — 2,4 зл/Вт·ч; свинцовый аккумулятор 100 А·ч 12 В (около 600 Вт·ч при DoD 50%) с оснасткой за 700 зл — около 1,17 зл/Вт·ч, т.е. примерно в 2 раза больше энергии за те же деньги.",
    },
    pola: {
      cenaStacji: {
        nazwa: "Цена станции [{waluta}]",
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
        nazwa: "Цена элементов комплекта [{waluta}]",
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
  "panel-dla-urzadzenia": {
    migawka: {
      oCoChodzi: "Вы подбираете панель только для одного устройства, а не для всего дома.",
      jakDziala:
        "Потребление за сутки = мощность × часы работы. Панель должна отдать это днём: мощность панели = потребление ÷ (часы полного солнца × выработка). Если ввести имеющуюся панель, приложение сравнит её с результатом.",
      poCo:
        "Слишком маленькая панель означает, что устройство с каждым днём всё сильнее разряжает аккумулятор. Результат — минимум для среднего дня; пасмурные дни требуют запаса.",
      fizyka:
        "E = P × h. P_панели = E ÷ (часы солнца × выработка). Пример из источника: холодильник 50 Вт × 8 ч = 400 Вт·ч; панель 150 Вт при выработке 70% отдаст это примерно за 3,8 ч полного солнца.",
    },
    pola: {
      moc: {
        nazwa: "Мощность устройства [Вт]",
        cel: "Мощность и время работы дают потребление.",
        gdzie:
          "Табличка, инструкция или найдите свою модель. Для компрессорного холодильника — средняя мощность или мощность × время работы компрессора.",
        zakres: "С таблички вашего устройства.",
      },
      godzinPracy: {
        nazwa: "Время работы в сутки [ч]",
        cel: "Сколько часов в день устройство реально потребляет ток.",
        gdzie: "Ваше использование или время работы компрессора (холодильник работает циклами).",
        zakres: "0–24 ч.",
      },
      godzinSlonca: {
        nazwa: "Эквивалентные часы полного солнца [ч/сутки]",
        cel: "Переводит мощность панели в суточную энергию.",
        gdzie: "Модуль 1 (климат и местоположение) или карта инсоляции для вашего месяца.",
        zakres: "Из данных для вашего места и месяца.",
      },
      uzysk: {
        nazwa: "Выработка от номинальной мощности панели [%]",
        cel:
          "Панель редко отдаёт полную мощность с таблички: температура, контроллер, кабели. Эта часть реально доходит до устройства.",
        gdzie:
          "Паспорт панели (температурный коэффициент) и контроллера (КПД). Источник приводит 70% как пример — это пример, а не правило.",
        zakres: "Из паспортов; приложение не угадывает.",
      },
      posiadany: {
        nazwa: "Мощность имеющейся панели [Вт] (необязательно)",
        cel: "Сравнение с требуемой мощностью.",
        gdzie: "Табличка панели (Вт пик).",
        zakres: "Пусто = только подбор.",
      },
    },
  },
  "laczenie-paneli-przenosnych": {
    migawka: {
      oCoChodzi: "Вы проверяете, можно ли соединить туристические панели между собой и с вашей зарядной станцией.",
      jakDziala:
        "Приложение сравнивает тип панелей и разъёмы. Солнечные пауэрбанки и USB-выходы не соединяют — внутри у них контроллер или преобразователь. Разные разъёмы требуют заводского переходника. Разные панели соединить можно, но с потерей мощности.",
      poCo:
        "Неправильное соединение может повредить встроенный контроллер или вход станции. Разъёмы — первый шаг; напряжение и ток проверьте на экране «Панель для зарядной станции».",
      fizyka:
        "Последовательно: напряжения складываются, ток = наименьший из панелей. Параллельно: токи складываются, напряжение = наименьшее из панелей. Поэтому разные панели теряют часть мощности.",
    },
    pola: {
      typ: {
        nazwa: "Тип панели",
        cel: "У солнечного пауэрбанка свой контроллер — его не соединяют с другими панелями.",
        gdzie:
          "Описание товара: складная панель/коврик — только элементы и штекер; пауэрбанк — аккумулятор и USB-гнёзда.",
        zakres: "Выберите из списка.",
      },
      liczba: {
        nazwa: "Количество панелей",
        cel: "При одной панели проверяется только совместимость разъёма со станцией.",
        gdzie: "Сколько панелей вы хотите подключить одновременно.",
        zakres: "1 и больше.",
      },
      takieSame: {
        nazwa: "Одна модель",
        cel: "Разные панели в одной цепочке теряют мощность до уровня самой слабой.",
        gdzie: "Сравните таблички: Vmp, Imp и мощность должны совпадать.",
        zakres: "Да / нет.",
      },
      zlaczePaneli: {
        nazwa: "Выходной разъём панелей",
        cel: "Должен подходить к входу станции или к переходнику.",
        gdzie: "Конец кабеля панели; описание в инструкции.",
        zakres: "Выберите из списка.",
      },
      zlaczeWejscia: {
        nazwa: "Разъём PV-входа",
        cel: "К нему подключаются панели.",
        gdzie: "Гнездо «Solar/PV IN» на станции или клеммы контроллера; описание в инструкции.",
        zakres: "Выберите из списка.",
      },
      adapter: {
        nazwa: "Переходник между разъёмами",
        cel: "Позволяет соединить разные разъёмы — если у него правильная полярность и он выдержит ток.",
        gdzie: "Заводской переходник производителя станции или проверенная замена с указанным током.",
        zakres: "Да / нет.",
      },
    },
  },
  "powerbank-vs-akumulator": {
    migawka: {
      oCoChodzi: "Пауэрбанк — это удобство, а комплект с аккумулятором — ёмкость и мощность.",
      jakDziala:
        "Приложение проверяет, хватает ли пауэрбанку длительной мощности для устройства, и считает, сколько раз каждый вариант его зарядит (или обеспечит сутки работы): энергия × КПД ÷ энергия на одно использование.",
      poCo:
        "Телефон или лампа — задача для пауэрбанка. Туристический холодильник обычно превышает выходную мощность пауэрбанка — тогда нужен аккумулятор с преобразователем.",
      fizyka:
        "n = E × η ÷ E_исп. Аккумулятор: E = Ач × В × используемая часть. Условие мощности: P_устройства ≤ P_выхода пауэрбанка.",
    },
    pola: {
      mocUrzadzenia: {
        nazwa: "Мощность устройства [Вт]",
        cel: "Сравнивается с выходной мощностью пауэрбанка.",
        gdzie: "Блок питания/зарядка устройства (Вт) или табличка.",
        zakres: "С таблички вашего устройства.",
      },
      energiaUzycia: {
        nazwa: "Энергия на одно использование [Вт·ч]",
        cel: "Даёт число зарядок или суток.",
        gdzie: "Аккумулятор устройства (Вт·ч на корпусе ноутбука/телефона) или мощность × часы работы в сутки.",
        zakres: "Из данных вашего устройства.",
      },
      pbWh: {
        nazwa: "Ёмкость пауэрбанка [Вт·ч]",
        cel: "Энергия, запасённая в пауэрбанке.",
        gdzie: "Этикетка. Если указаны только мА·ч: Вт·ч = мА·ч × напряжение с этикетки ÷ 1000.",
        zakres: "С этикетки.",
      },
      pbMoc: {
        nazwa: "Макс. выходная мощность пауэрбанка [Вт]",
        cel: "Потянет ли пауэрбанк устройство.",
        gdzie: "Этикетка/инструкция — длительная мощность выхода, который вы используете (USB-C PD, DC, 230 В).",
        zakres: "С этикетки.",
      },
      akAh: {
        nazwa: "Ёмкость аккумулятора [Ач]",
        cel: "Энергия аккумулятора.",
        gdzie: "Табличка аккумулятора.",
        zakres: "С таблички.",
      },
      akV: {
        nazwa: "Напряжение аккумулятора [В]",
        cel: "Ач × В = Вт·ч.",
        gdzie: "Табличка аккумулятора.",
        zakres: "С таблички.",
      },
      akUzyteczna: {
        nazwa: "Используемая часть ёмкости [%]",
        cel: "Аккумулятор не разряжают до нуля — сколько можно использовать, зависит от химии.",
        gdzie: "Паспорт аккумулятора (глубина разряда).",
        zakres: "Из паспорта; приложение не угадывает.",
      },
      sprawnosc: {
        nazwa: "КПД преобразования [%]",
        cel: "Преобразователи и кабели теряют часть энергии по пути к устройству.",
        gdzie: "Паспорт преобразователя/зарядки.",
        zakres: "Из паспортов; приложение не угадывает.",
      },
    },
  },
  "blackout-minimum": {
    migawka: {
      oCoChodzi:
        "Блэкаут — это экзамен: нужно знать, что спасать в первую очередь. Это не проект автономной системы, а минимум, чтобы пережить отключение сети без паники.",
      jakDziala:
        "Введите только критичные нагрузки (напр. 1. холодильник, 2. роутер, 3. освещение, 4. зарядки) и время отключения. Приложение считает энергию, минимальный аккумулятор и мощность преобразователя; показывает также энергию на 12, 24 и 48 ч.",
      poCo:
        "Каждая дополнительная нагрузка — это больший и более дорогой комплект. Список приоритетов помогает осознанно решить, что отключить, если авария затягивается.",
      fizyka:
        "E_сут = Σ P × h. E = E_сут × T ÷ 24. Аккумулятор = E ÷ (η × U × используемая часть). Преобразователь ≥ Σ P (плюс запас на пуск — экран «Преобразователи»).",
    },
    pola: {
      nazwa: {
        nazwa: "Название нагрузки",
        cel: "Чтобы список приоритетов был понятен.",
        gdzie: "Любое название; вводите от самого важного.",
        zakres: "Текст.",
      },
      moc: {
        nazwa: "Мощность [Вт]",
        cel: "Энергия и минимальная мощность преобразователя.",
        gdzie: "Табличка устройства или измерение ваттметром.",
        zakres: "С таблички вашего устройства.",
      },
      godziny: {
        nazwa: "Время работы в сутки [ч]",
        cel: "В среднем за сутки — холодильник работает циклами, роутер круглосуточно.",
        gdzie: "Ваше использование; для холодильника — время работы компрессора (ваттметр на сутки).",
        zakres: "0–24 ч.",
      },
      czas: {
        nazwa: "Длительность блэкаута [ч]",
        cel: "На сколько часов должно хватить комплекта.",
        gdzie: "Ваш опыт отключений в округе; источник показывает варианты 12, 24 и 48 ч.",
        zakres: "Ваше решение.",
      },
      napiecie: {
        nazwa: "Напряжение аккумулятора [В]",
        cel: "Переводит энергию в Ач.",
        gdzie: "Табличка аккумулятора.",
        zakres: "С таблички.",
      },
      uzyteczna: {
        nazwa: "Используемая часть ёмкости [%]",
        cel: "Аккумулятор не разряжают до нуля.",
        gdzie: "Паспорт аккумулятора (глубина разряда).",
        zakres: "Из паспорта; приложение не угадывает.",
      },
      sprawnosc: {
        nazwa: "КПД преобразователя [%]",
        cel: "Потери при преобразовании 12/24 В в 230 В.",
        gdzie: "Паспорт преобразователя. Если всё питается напрямую от 12 В — введите 100.",
        zakres: "Из паспорта; приложение не угадывает.",
      },
      posiadany: {
        nazwa: "Имеющийся аккумулятор [Ач] (необязательно)",
        cel: "Проверяет, на сколько часов его хватит.",
        gdzie: "Табличка аккумулятора.",
        zakres: "Пусто = только подбор.",
      },
    },
  },
  "akumulator-kampera": {
    migawka: {
      oCoChodzi: "Аккумулятор — сердце кемпера, а в автомобиле важен каждый килограмм.",
      jakDziala:
        "Введите потребность и данные конкретных аккумуляторов из паспортов. Приложение считает, сколько штук каждой технологии покроют потребности на заданное число суток, сколько это весит и стоит, и стоимость 1 кВт·ч за весь срок службы.",
      poCo:
        "AGM дешевле на старте, но тяжелее, позволяет использовать меньшую часть ёмкости и выдерживает меньше циклов. Обычно решают стоимость кВт·ч за срок службы и масса. Полное сравнение технологий: Модуль 4, экран 30.",
      fizyka:
        "E = потребность × сутки. Штук = ⌈E ÷ (Ач × В × DoD)⌉. Стоимость кВт·ч = цена ÷ (Ач × В × DoD × циклы ÷ 1000).",
    },
    pola: {
      zapotrzebowanie: {
        nazwa: "Потребность в сутки [Вт·ч]",
        cel: "Сколько энергии кемпер расходует за сутки.",
        gdzie: "Калькулятор «на выходные» (Модуль 12, экран 5) или счётчик станции/BMS.",
        zakres: "Из вашего профиля потребления.",
      },
      dni: {
        nazwa: "Суток без зарядки",
        cel: "На сколько суток стоянки без солнца и езды должно хватить аккумулятора.",
        gdzie: "Ваш стиль путешествий.",
        zakres: "Ваше решение.",
      },
      napiecie: {
        nazwa: "Напряжение системы [В]",
        cel: "Ач × В = Вт·ч.",
        gdzie: "Система кемпера (обычно с таблички аккумулятора).",
        zakres: "С таблички.",
      },
      zapasMasy: {
        nazwa: "Запас грузоподъёмности [кг] (необязательно)",
        cel: "Проверяет, не превысят ли аккумуляторы грузоподъёмность.",
        gdzie: "Техпаспорт: разрешённая полная масса минус масса машины с оборудованием, пассажирами и багажом.",
        zakres: "Пусто = не проверять.",
      },
      agmAh: {
        nazwa: "AGM: ёмкость [Ач]",
        cel: "Энергия одной штуки.",
        gdzie: "Табличка/паспорт аккумулятора.",
        zakres: "Из паспорта.",
      },
      agmCena: {
        nazwa: "AGM: цена [{waluta}]",
        cel: "Стоимость покупки и стоимость кВт·ч.",
        gdzie: "Предложение магазина.",
        zakres: "Ваше предложение.",
      },
      agmMasa: {
        nazwa: "AGM: масса [кг]",
        cel: "Масса всего комплекта.",
        gdzie: "Паспорт аккумулятора.",
        zakres: "Из паспорта.",
      },
      agmDod: {
        nazwa: "AGM: допустимая глубина разряда [%]",
        cel: "Какую часть ёмкости можно использовать.",
        gdzie:
          "Паспорт аккумулятора. Модуль 4 указывает для AGM {cykleAgm} циклов — это подсказка, а не данные вашей модели.",
        zakres: "Из паспорта; приложение не угадывает.",
      },
      agmCykle: {
        nazwa: "AGM: число циклов",
        cel: "Сколько раз аккумулятор отдаст энергию, прежде чем износится.",
        gdzie: "Паспорт аккумулятора — для введённой глубины разряда.",
        zakres: "Из паспорта; приложение не угадывает.",
      },
      lfpAh: {
        nazwa: "LiFePO4: ёмкость [Ач]",
        cel: "Энергия одной штуки.",
        gdzie: "Табличка/паспорт аккумулятора.",
        zakres: "Из паспорта.",
      },
      lfpCena: {
        nazwa: "LiFePO4: цена [{waluta}]",
        cel: "Стоимость покупки и стоимость кВт·ч.",
        gdzie: "Предложение магазина.",
        zakres: "Ваше предложение.",
      },
      lfpMasa: {
        nazwa: "LiFePO4: масса [кг]",
        cel: "Масса всего комплекта.",
        gdzie: "Паспорт аккумулятора.",
        zakres: "Из паспорта.",
      },
      lfpDod: {
        nazwa: "LiFePO4: допустимая глубина разряда [%]",
        cel: "Какую часть ёмкости можно использовать.",
        gdzie:
          "Паспорт аккумулятора. Модуль 4 указывает для LiFePO4 {cykleLfp} циклов — это подсказка, а не данные вашей модели.",
        zakres: "Из паспорта; приложение не угадывает.",
      },
      lfpCykle: {
        nazwa: "LiFePO4: число циклов",
        cel: "Сколько раз аккумулятор отдаст энергию, прежде чем износится.",
        gdzie: "Паспорт аккумулятора — для введённой глубины разряда.",
        zakres: "Из паспорта; приложение не угадывает.",
      },
    },
  },
  "panele-dach-kampera": {
    migawka: {
      oCoChodzi: "Крыша кемпера — маленькая электростанция, но её делят кондиционер, люки и антенны.",
      jakDziala:
        "Измерьте свободные участки крыши между препятствиями (вдоль машины). На каждом приложение раскладывает сетку панелей с отступом и зазорами в лучшей из двух ориентаций и суммирует мощность.",
      poCo:
        "Деление площади крыши на площадь панели завышает результат — панель не может лежать над люком. Здесь каждый участок считается отдельно.",
      fizyka:
        "Панелей в ряду = ⌊(доступная длина + зазор) ÷ (сторона панели + зазор)⌋. Доступная = участок − 2 × отступ. На участке: ряды вдоль × ряды поперёк.",
    },
    pola: {
      szerokosc: {
        nazwa: "Ширина крыши [м]",
        cel: "Сколько рядов поместится поперёк.",
        gdzie: "Измерьте плоскую часть крыши (без скруглённых краёв).",
        zakres: "Ваше измерение.",
      },
      margines: {
        nazwa: "Отступ от краёв и препятствий [м]",
        cel: "Место для креплений, спойлеров и доступа к люкам.",
        gdzie: "Инструкция креплений панелей / производитель кемпера.",
        zakres: "Из инструкции; приложение не угадывает.",
      },
      odstep: {
        nazwa: "Зазор между панелями [м]",
        cel: "Место для креплений и вентиляции.",
        gdzie: "Инструкция креплений.",
        zakres: "Из инструкции.",
      },
      odcinekNazwa: {
        nazwa: "Название участка",
        cel: "Чтобы знать, какой это участок крыши.",
        gdzie: "Любое описание, напр. «перед до люка».",
        zakres: "Текст.",
      },
      odcinekDl: {
        nazwa: "Длина участка [м]",
        cel: "Свободный отрезок крыши вдоль машины, без препятствий.",
        gdzie: "Измерьте от края (или препятствия) до следующего препятствия (или края).",
        zakres: "Ваше измерение.",
      },
      panelDl: {
        nazwa: "Длина панели [м]",
        cel: "Размер панели.",
        gdzie: "Паспорт панели.",
        zakres: "Из паспорта.",
      },
      panelSz: {
        nazwa: "Ширина панели [м]",
        cel: "Размер панели.",
        gdzie: "Паспорт панели.",
        zakres: "Из паспорта.",
      },
      panelMoc: {
        nazwa: "Мощность панели [Вт]",
        cel: "Суммарная мощность на крыше.",
        gdzie: "Табличка/паспорт панели (Вт пик).",
        zakres: "Из паспорта.",
      },
    },
  },
  "panel-kampera": {
    migawka: {
      oCoChodzi: "Панель на крыше — как шляпа для кемпера: должна подходить и давать мощность.",
      jakDziala:
        "Введите данные двух конкретных панелей из паспортов. Приложение считает мощность на килограмм (масса машины важна), цену за ватт и цену за ватт на год гарантии (долговечность).",
      poCo:
        "Гибкая лёгкая и подходит к скруглённой крыше, но хуже охлаждается и обычно служит меньше. Жёсткая тяжелее, но долговечнее и лучше вентилируется снизу.",
      fizyka:
        "Вт/кг = P ÷ m. {waluta}/Вт = цена ÷ P. {waluta}/(Вт·год) = цена ÷ (P × годы гарантии). Потеря от нагрева = температурный коэффициент × рост температуры элементов (Модуль 3).",
    },
    pola: {
      moc: {
        nazwa: "Мощность [Вт]",
        cel: "Мощность панели при STC.",
        gdzie: "Табличка/паспорт панели (Вт пик).",
        zakres: "Из паспорта.",
      },
      masa: {
        nazwa: "Масса [кг]",
        cel: "Мощность на килограмм.",
        gdzie: "Паспорт панели.",
        zakres: "Из паспорта.",
      },
      cena: {
        nazwa: "Цена [{waluta}]",
        cel: "Цена за ватт.",
        gdzie: "Предложение магазина.",
        zakres: "Ваше предложение.",
      },
      gwarancja: {
        nazwa: "Гарантия мощности [лет]",
        cel: "Мера долговечности — сколько лет производитель гарантирует мощность.",
        gdzie: "Паспорт панели / условия гарантии.",
        zakres: "Из паспорта.",
      },
      bezSzczeliny: {
        nazwa: "Монтаж гибкой без зазора",
        cel: "Приклеенная плоско панель не отводит тепло снизу.",
        gdzie: "Ваш план монтажа: клей по всей поверхности = да; на профилях/раме = нет.",
        zakres: "Да / нет.",
      },
    },
  },
  "alternator-vs-panele": {
    migawka: {
      oCoChodzi: "Едете или стоите — зарядку нужно подобрать к стилю путешествий.",
      jakDziala:
        "Генератор заряжает большим током, но только во время езды; панели слабее, но весь день стоянки. Приложение считает энергию от обоих источников за сутки, сумму относительно потребности, время зарядки и проверяет напряжение заряда для типа аккумулятора.",
      poCo:
        "Слишком высокое напряжение заряда разрушает элементы, слишком низкое не зарядит аккумулятор полностью. LiFePO4 от генератора заряжают через DC/DC-зарядку.",
      fizyka:
        "E_ген = I × U × h_езды. E_PV = P × h_солнца × η. Время до полного ≈ Ач × (1 − SoC) ÷ I. Окно напряжения заряда зависит от химии (Библия §12.31), для 24/48 В × 2/× 4 — результат показывает окно для вашего аккумулятора.",
    },
    pola: {
      napiecie: {
        nazwa: "Напряжение аккумулятора [В]",
        cel: "Переводит ток в энергию и масштабирует окно напряжения заряда.",
        gdzie: "Табличка аккумулятора (12, 24, 48 В).",
        zakres: "С таблички.",
      },
      godzinJazdy: {
        nazwa: "Время езды в сутки [ч]",
        cel: "Генератор заряжает только тогда.",
        gdzie: "Ваш план поездки.",
        zakres: "0–24 ч.",
      },
      prad: {
        nazwa: "Ток заряда [А]",
        cel: "Сколько ампер реально идёт в аккумулятор во время езды.",
        gdzie: "Номинальный ток DC/DC-зарядки или замер клещами во время езды.",
        zakres: "Из паспорта зарядки или замера; приложение не угадывает.",
      },
      mocPanelu: {
        nazwa: "Мощность панелей [Вт]",
        cel: "Энергия от панелей.",
        gdzie: "Табличка панелей (Вт пик).",
        zakres: "Из паспорта.",
      },
      godzinSlonca: {
        nazwa: "Эквивалентные часы полного солнца [ч/сутки]",
        cel: "Переводит мощность панелей в энергию.",
        gdzie: "Модуль 1 или карта инсоляции для места и месяца.",
        zakres: "Из данных для вашего места.",
      },
      sprawnosc: {
        nazwa: "КПД пути панель → аккумулятор [%]",
        cel: "Потери контроллера, кабелей и заряда.",
        gdzie: "Паспорта контроллера и аккумулятора.",
        zakres: "Из паспортов; приложение не угадывает.",
      },
      zapotrzebowanie: {
        nazwa: "Потребность в сутки [Вт·ч] (необязательно)",
        cel: "Сравнение с суммой от обоих источников.",
        gdzie: "Калькулятор «на выходные» (экран 5) или счётчик BMS.",
        zakres: "Пусто = без сравнения.",
      },
      typ: {
        nazwa: "Тип аккумулятора (необязательно)",
        cel: "Каждой химии нужно своё напряжение заряда.",
        gdzie: "Табличка аккумулятора.",
        zakres: "Выберите из списка.",
      },
      dcdc: {
        nazwa: "DC/DC-зарядка",
        cel: "Согласует напряжение и ограничивает ток от генератора.",
        gdzie: "Ваша система: устройство между стартерным и бытовым аккумулятором.",
        zakres: "Да / нет.",
      },
      napiecieLadowania: {
        nazwa: "Напряжение заряда [В] (необязательно)",
        cel: "Проверка по окну для типа аккумулятора.",
        gdzie: "Паспорт/настройка зарядки или DC/DC, либо замер на клеммах во время езды.",
        zakres: "Пусто = не проверять.",
      },
      pojemnosc: {
        nazwa: "Ёмкость [Ач] (необязательно)",
        cel: "Время зарядки до полного.",
        gdzie: "Табличка аккумулятора.",
        zakres: "Пусто = без времени зарядки.",
      },
      soc: {
        nazwa: "Начальный уровень заряда [%]",
        cel: "С какого уровня вы заряжаете.",
        gdzie: "Показание BMS или монитора батареи.",
        zakres: "0–100%.",
      },
    },
  },
  przetwornice: {
    migawka: {
      oCoChodzi:
        "Преобразователь согласует напряжение с устройством — без него вы сожжёте технику или ничего не заработает.",
      jakDziala:
        "Выберите тип: USB-зарядка 5 В, DC/DC-преобразователь (напр. 12→24 В) или инвертор 230 В. Приложение считает ток на стороне устройства, ток от аккумулятора, а для инвертора — минимальную длительную мощность (сумма × запас) и пик при пуске.",
      poCo:
        "Слишком слабый преобразователь перегреется или отключится; устройство с двигателем (холодильник, насос, инструмент) при пуске берёт в несколько раз больше, чем в работе.",
      fizyka:
        "I_вых = P ÷ U_вых. I_акб = P ÷ (U_акб × η). Инвертор: P_min = запас × ΣP; пик = ΣP + наибольшая P × (кратность − 1).",
    },
    pola: {
      napiecieAkumulatora: {
        nazwa: "Напряжение аккумулятора [В]",
        cel: "Вход преобразователя — от него зависит ток от аккумулятора.",
        gdzie: "Табличка аккумулятора (12, 24, 48 В).",
        zakres: "С таблички.",
      },
      sprawnosc: {
        nazwa: "КПД [%]",
        cel: "Потери в преобразователе — от аккумулятора течёт больше, чем получает устройство.",
        gdzie: "Паспорт преобразователя/инвертора.",
        zakres: "Из паспорта; приложение не угадывает.",
      },
      napiecieUrzadzenia: {
        nazwa: "Напряжение устройства [В]",
        cel: "Выход DC/DC-преобразователя.",
        gdzie: "Табличка или блок питания устройства.",
        zakres: "С таблички.",
      },
      mocUrzadzenia: {
        nazwa: "Мощность устройства [Вт]",
        cel: "По ней считаются выходной ток и потребление от аккумулятора.",
        gdzie: "Табличка устройства или блока питания (Вт, или В × А).",
        zakres: "С таблички.",
      },
      pradPrzetwornicy: {
        nazwa: "Выходной ток преобразователя [А] (необязательно)",
        cel: "Проверка, не будет ли ваш преобразователь/зарядка перегружен.",
        gdzie: "Табличка преобразователя или USB-зарядки (напр. 2,4 А, 3 А).",
        zakres: "Пусто = не проверять.",
      },
      nazwa: {
        nazwa: "Название устройства",
        cel: "Только для вашего удобства.",
        gdzie: "Любое.",
        zakres: "Текст.",
      },
      moc: {
        nazwa: "Номинальная мощность [Вт]",
        cel: "Слагаемое суммы мощностей, работающих одновременно.",
        gdzie: "Табличка устройства.",
        zakres: "С таблички.",
      },
      krotnosc: {
        nazwa: "Кратность пуска [×]",
        cel: "Во сколько раз больше устройство берёт при пуске (компрессор, двигатель).",
        gdzie: "Паспорт устройства (пусковой ток ÷ номинальный) или прибор с функцией inrush.",
        zakres: "Пусто = без пуска (1×). Приложение не угадывает.",
      },
      zapas: {
        nazwa: "Запас мощности [×]",
        cel: "Инвертор не должен постоянно работать на 100% мощности.",
        gdzie: "Библия проекта даёт {zapasMin}–{zapasMax}× суммы нагрузок; выберите сами.",
        zakres: "Множитель, напр. {zapasMin}.",
      },
      mocFalownika: {
        nazwa: "Длительная мощность инвертора [Вт] (необязательно)",
        cel: "Проверка, хватит ли вашего инвертора.",
        gdzie: "Паспорт инвертора — длительная (не пиковая) мощность.",
        zakres: "Пусто = не проверять.",
      },
      szczytFalownika: {
        nazwa: "Пиковая мощность инвертора [Вт] (необязательно)",
        cel: "Проверка, выдержит ли инвертор пуск двигателя.",
        gdzie: "Паспорт инвертора — пиковая / surge мощность (обычно несколько секунд).",
        zakres: "Пусто = только напоминание.",
      },
    },
  },
  "kreator-malego-odbiornika": {
    migawka: {
      oCoChodzi: "Один мастер для малых нагрузок: аварийный свет, сигнализация, ворота, роутер, насос, котёл и другое.",
      jakDziala:
        "Выберите сценарий и загрузите типовые компоненты (только названия) или добавьте свои. Введите мощность и часы работы каждого компонента, нужное время резерва и данные аккумулятора — приложение рассчитает минимальный аккумулятор, инвертор и, по желанию, баланс с панелью.",
      poCo: "Слишком малый аккумулятор сядет до конца аварии; двигатель без запаса инвертора не запустится.",
      fizyka:
        "E_сут = Σ P × h. E_T = E_сут × T ÷ 24. C_min = E_T ÷ (U × u × η_инвертора); без инвертора η = 1. Панель: E = P × h_солнца × η.",
    },
    pola: {
      scenariusz: {
        nazwa: "Сценарий",
        cel: "Подсказывает типовые компоненты и добавляет примечание для этого применения.",
        gdzie: "Выберите ближайший к вашей нагрузке.",
        zakres: "Список из 16 сценариев; можно ничего не выбирать.",
      },
      nazwa: {
        nazwa: "Название компонента",
        cel: "Только для вашего удобства.",
        gdzie: "Любое.",
        zakres: "Текст.",
      },
      moc: {
        nazwa: "Мощность [Вт]",
        cel: "Слагаемое потребления и мощности инвертора.",
        gdzie: "Табличка устройства или блока питания.",
        zakres: "С таблички; приложение не подставляет типовые мощности.",
      },
      godziny: {
        nazwa: "Часы работы в сутки [ч]",
        cel: "Потребление энергии компонентом.",
        gdzie: "Непрерывно = 24. Ворота: число циклов × время цикла в секундах ÷ 3600.",
        zakres: "0–24 ч.",
      },
      krotnosc: {
        nazwa: "Кратность пуска [×]",
        cel: "Пик мощности при пуске двигателя (насос, ворота, компрессор).",
        gdzie: "Паспорт устройства или прибор с функцией inrush.",
        zakres: "Пусто = без пуска (1×).",
      },
      czas: {
        nazwa: "Нужное время резерва [ч]",
        cel: "Сколько нагрузка должна работать без сети и без зарядки.",
        gdzie: "Ваша оценка самой долгой аварии.",
        zakres: "Часы, напр. 24 или 48.",
      },
      napiecie: {
        nazwa: "Напряжение аккумулятора [В]",
        cel: "Переводит энергию в Ач.",
        gdzie: "Табличка аккумулятора.",
        zakres: "12, 24 или 48 В.",
      },
      uzyteczna: {
        nazwa: "Используемая часть ёмкости [%]",
        cel: "Сколько ёмкости можно использовать без вреда для аккумулятора.",
        gdzie: "Паспорт аккумулятора (DoD).",
        zakres: "Из паспорта; приложение не угадывает.",
      },
      falownik: {
        nazwa: "Инвертор 230 В",
        cel: "Инвертор добавляет потери и должен выдержать пуск.",
        gdzie: "Нагрузки на 230 В или на 12/24 В.",
        zakres: "Да / нет.",
      },
      sprawnoscFalownika: {
        nazwa: "КПД инвертора [%]",
        cel: "Потери инвертора увеличивают нужный аккумулятор.",
        gdzie: "Паспорт инвертора.",
        zakres: "Из паспорта; приложение не угадывает.",
      },
      posiadany: {
        nazwa: "Ваш аккумулятор [Ач] (необязательно)",
        cel: "Сколько часов продержит ваш аккумулятор.",
        gdzie: "Табличка аккумулятора.",
        zakres: "Пусто = не проверять.",
      },
      mocPanelu: {
        nazwa: "Мощность панели [Вт] (необязательно)",
        cel: "Покроет ли панель суточное потребление.",
        gdzie: "Табличка панели (Вт пик).",
        zakres: "Пусто = без панели.",
      },
      godzinSlonca: {
        nazwa: "Эквивалентные часы полного солнца [ч/сутки]",
        cel: "Переводит мощность панели в энергию.",
        gdzie: "Модуль 1 или карта инсоляции для места и месяца (зимой меньше).",
        zakres: "Из данных для вашего места.",
      },
      sprawnosc: {
        nazwa: "КПД пути панель → аккумулятор [%]",
        cel: "Потери контроллера, кабелей и заряда.",
        gdzie: "Паспорта контроллера и аккумулятора.",
        zakres: "Из паспортов; приложение не угадывает.",
      },
    },
  },
  "lista-kemping": {
    migawka: {
      oCoChodzi: "Кемпинг — это приключение, но электричество не берётся из ниоткуда — его нужно взять с собой.",
      jakDziala:
        "Введите число людей, сезон, телефоны и отметьте, какую технику берёте. Приложение составит список вещей для питания, разделённый на обязательные и по желанию, с отметками при сборах.",
      poCo:
        "Чаще всего не хватает мелочей: запасного предохранителя, мультиметра, изоленты. Огнетушитель и вольтметр — основа безопасности.",
      fizyka: "Список не считает ёмкость и мощность — у пунктов есть ссылки на калькуляторы, где вы их подберёте.",
    },
    pola: {
      osoby: {
        nazwa: "Число людей",
        cel: "Число налобных фонарей.",
        gdzie: "Ваш план поездки.",
        zakres: "Целое число.",
      },
      sezon: {
        nazwa: "Сезон",
        cel: "Зимой добавляется термочехол аккумулятора, летом — защита от солнца.",
        gdzie: "Дата поездки.",
        zakres: "Лето / весна-осень / зима.",
      },
      telefony: {
        nazwa: "Телефоны и планшеты",
        cel: "Число USB-зарядок 12 В.",
        gdzie: "Посчитайте устройства, которые будете заряжать на месте.",
        zakres: "Целое число; 0 = без зарядок.",
      },
      profil: {
        nazwa: "Что вы берёте",
        cel: "Каждая отмеченная техника добавляет свои пункты (напр. панель → контроллер).",
        gdzie: "Ваш план поездки.",
        zakres: "Отметьте любые.",
      },
    },
  },
  "szybka-diagnoza": {
    migawka: {
      oCoChodzi:
        "Противоположность остальному приложению — вместо проектирования с нуля помогает найти то, что уже сломалось.",
      jakDziala:
        "Выберите симптом. Приложение показывает шаги проверки по очереди — от самой частой причины. Вы отвечаете «в порядке» или «здесь проблема»; первая проблема — вероятная причина, со ссылкой на калькулятор, который поможет её устранить.",
      poCo: "Поиск неисправности наугад долог и бывает опасен. Порядок шагов экономит время.",
      fizyka:
        "Шаги — вопросы да/нет без числовых порогов; значения (напряжение заряженного аккумулятора, сечение) берутся из паспорта аккумулятора и калькуляторов.",
    },
    pola: {
      objaw: {
        nazwa: "Симптом",
        cel: "Выбирает дерево диагностических шагов.",
        gdzie: "Что вы видите: нет питания, низкое напряжение, перегрев, нет зарядки.",
        zakres: "Смена симптома очищает ответы.",
      },
    },
  },
  "urzadzenia-medyczne": {
    migawka: {
      oCoChodzi: "Речь не об удобстве, а о здоровье — питание должно быть надёжным.",
      jakDziala:
        "Введите мощность и время работы устройства и данные аккумулятора. Приложение подбирает аккумулятор минимум на {doby} суток без зарядки и проверяет, на сколько суток хватит вашего. Отсутствие второго независимого источника всегда даёт предупреждение.",
      poCo:
        "Обычных запасов из других калькуляторов здесь недостаточно — авария может длиться дольше, а аккумулятор стареет.",
      fizyka: "E_сут = P × h. C_min = E_сут × {doby} ÷ (U × u × η_инвертора); без инвертора η = 1.",
    },
    pola: {
      urzadzenie: {
        nazwa: "Устройство",
        cel: "Для вашего удобства; расчёт зависит от мощности и времени работы.",
        gdzie: "Выберите тип техники.",
        zakres: "CPAP, кислородный концентратор, ингалятор, другое.",
      },
      moc: {
        nazwa: "Мощность устройства [Вт]",
        cel: "Основа потребления энергии.",
        gdzie:
          "Табличка устройства, инструкция или замер ваттметром (с увлажнителем/подогревом трубки, если используете).",
        zakres: "С таблички; приложение не подставляет типовые мощности.",
      },
      godziny: {
        nazwa: "Часы работы в сутки [ч]",
        cel: "Суточное потребление.",
        gdzie: "Рекомендация врача; обычно вся ночь.",
        zakres: "0–24 ч.",
      },
      napiecie: {
        nazwa: "Напряжение аккумулятора [В]",
        cel: "Переводит энергию в Ач.",
        gdzie: "Табличка аккумулятора.",
        zakres: "12, 24 или 48 В.",
      },
      uzyteczna: {
        nazwa: "Используемая часть ёмкости [%]",
        cel: "Сколько ёмкости можно использовать.",
        gdzie: "Паспорт аккумулятора (DoD).",
        zakres: "Из паспорта; приложение не угадывает.",
      },
      falownik: {
        nazwa: "Через инвертор 230 В",
        cel: "Инвертор добавляет потери; питание DC надёжнее, если производитель его предусматривает.",
        gdzie: "Инструкция устройства (вход DC, автомобильный кабель).",
        zakres: "Да / нет.",
      },
      sprawnoscFalownika: {
        nazwa: "КПД инвертора [%]",
        cel: "Потери инвертора увеличивают нужный аккумулятор.",
        gdzie: "Паспорт инвертора (лучше с чистой синусоидой).",
        zakres: "Из паспорта; приложение не угадывает.",
      },
      posiadany: {
        nazwa: "Ваш аккумулятор [Ач] (необязательно)",
        cel: "На сколько суток хватит вашего аккумулятора.",
        gdzie: "Табличка аккумулятора.",
        zakres: "Пусто = не проверять.",
      },
      zapas: {
        nazwa: "Второй независимый источник",
        cel: "Резервирование — отказ одного источника не должен отключить устройство.",
        gdzie: "Второй заряженный аккумулятор, пауэрбанк, одобренный производителем, генератор.",
        zakres: "Да / нет; «не знаю» считается как «нет».",
      },
    },
  },
  "urzadzenia-zabronione-falownik": {
    migawka: {
      oCoChodzi:
        "Малый инвертор не выдержит всего — устройства с двигателем и нагревателем при пуске берут намного больше.",
      jakDziala:
        "Введите длительную и пиковую мощность инвертора из паспорта и устройства с мощностью и кратностью пуска. Каждое получает оценку: OK, рискованно или запрещено.",
      poCo: "Запрещённое устройство сожжёт инвертор или будет отключать его при каждом пуске.",
      fizyka:
        "OK: P × k ≤ P_длит. Рискованно: P ≤ P_длит и P × k ≤ P_пик, но P × k > P_длит (или k неизвестна). Запрещено: P > P_длит или P × k > P_пик.",
    },
    pola: {
      mocCiagla: {
        nazwa: "Длительная мощность инвертора [Вт]",
        cel: "Сколько инвертор даёт непрерывно.",
        gdzie: "Паспорт / табличка инвертора (номинальная, не пиковая).",
        zakres: "Из паспорта.",
      },
      mocSzczytowa: {
        nazwa: "Пиковая мощность инвертора [Вт]",
        cel: "Сколько инвертор выдерживает кратковременно при пуске.",
        gdzie: "Паспорт инвертора — peak / surge / перегрузка (обычно несколько секунд).",
        zakres: "Из паспорта; приложение не угадывает.",
      },
      nazwa: {
        nazwa: "Название устройства",
        cel: "Узнать устройство в оценке.",
        gdzie: "Любое; кнопки «+» добавляют типовые рискованные устройства (только названия).",
        zakres: "Текст.",
      },
      moc: {
        nazwa: "Мощность устройства [Вт]",
        cel: "Мощность в работе.",
        gdzie: "Табличка устройства.",
        zakres: "С таблички.",
      },
      krotnosc: {
        nazwa: "Кратность пуска [×]",
        cel: "Во сколько раз больше устройство берёт при пуске.",
        gdzie: "Паспорт устройства (пусковой ÷ номинальный ток) или замер прибором с функцией inrush.",
        zakres: "Пусто = неизвестно → оценка «рискованно».",
      },
    },
  },
  "blackout-balkon": {
    migawka: {
      oCoChodzi: "В многоэтажке нет участка, но есть балкон — ваша мини-электростанция на время аварии.",
      jakDziala:
        "Введите критические нагрузки, время блэкаута, зарядную станцию и — по желанию — панели на перилах. Приложение считает, сколько часов продержится одна станция, сколько панелей поместится на перилах и хватит ли вместе на весь блэкаут.",
      poCo: "Станция, купленная «на глаз», часто держит несколько часов, а блэкаут длится дольше.",
      fizyka:
        "E_сут = Σ P × h. Накопитель = Вт·ч × u × η. Панели: n = ⌊длина перил ÷ ширина панели⌋, E = n × P × h_солнца × η. Баланс = накопитель + панели × T/24 − E_сут × T/24.",
    },
    pola: {
      nazwa: {
        nazwa: "Название нагрузки",
        cel: "Только для вашего удобства.",
        gdzie: "Любое.",
        zakres: "Текст.",
      },
      moc: {
        nazwa: "Мощность [Вт]",
        cel: "Слагаемое потребления.",
        gdzie: "Табличка устройства.",
        zakres: "С таблички.",
      },
      godziny: {
        nazwa: "Часы работы в сутки [ч]",
        cel: "Потребление нагрузки.",
        gdzie: "Холодильник работает циклами — укажите реальное время работы компрессора; роутер 24 ч.",
        zakres: "0–24 ч.",
      },
      czas: {
        nazwa: "Время блэкаута [ч]",
        cel: "Сколько часов нужно продержаться.",
        gdzie: "Ваша оценка (напр. 24 или 48 ч).",
        zakres: "Часы.",
      },
      pojemnosc: {
        nazwa: "Ёмкость станции [Вт·ч]",
        cel: "Энергия накопителя.",
        gdzie: "Табличка станции (Вт·ч); для аккумулятора Ач × В.",
        zakres: "С таблички.",
      },
      uzyteczna: {
        nazwa: "Используемая часть [%]",
        cel: "Сколько энергии можно использовать.",
        gdzie: "Паспорт станции / аккумулятора.",
        zakres: "Из паспорта; приложение не угадывает.",
      },
      sprawnoscFalownika: {
        nazwa: "КПД инвертора [%]",
        cel: "Потери при преобразовании в 230 В.",
        gdzie: "Паспорт станции.",
        zakres: "Из паспорта; приложение не угадывает.",
      },
      balustrada: {
        nazwa: "Длина перил [м]",
        cel: "Сколько панелей поместится в ряд.",
        gdzie: "Измерьте солнечный участок перил.",
        zakres: "Пусто = без панелей.",
      },
      szerokoscPanelu: {
        nazwa: "Ширина панели [м]",
        cel: "Размер вдоль перил.",
        gdzie: "Паспорт панели (размеры).",
        zakres: "Из паспорта.",
      },
      mocPanelu: {
        nazwa: "Мощность панели [Вт]",
        cel: "Энергия от одной панели.",
        gdzie: "Табличка панели (Вт пик).",
        zakres: "Из паспорта.",
      },
      godzinSlonca: {
        nazwa: "Часы полного солнца [ч/сутки]",
        cel: "Переводит мощность в энергию.",
        gdzie:
          "Модуль 1 или карта инсоляции — на балконе учтите ориентацию и затенение (вертикальная панель даёт меньше).",
        zakres: "Из данных для вашего балкона.",
      },
      sprawnosc: {
        nazwa: "КПД пути панель → накопитель [%]",
        cel: "Потери контроллера и заряда.",
        gdzie: "Паспорт станции (вход PV).",
        zakres: "Из паспорта; приложение не угадывает.",
      },
    },
  },
  "szablony-zestawow": {
    migawka: {
      oCoChodzi: "Вместо чистого листа выберите типичный комплект: автодом, яхта, домик, мастерская или кемпинг.",
      jakDziala:
        "Шаблон загружает названия типичных потребителей. Вы вводите их мощности и время, напряжение, DoD и солнце — приложение считает потребление, пик, аккумулятор на пребывание и на сутки, панель и минимальный ток контроллера.",
      poCo: "Самая частая ошибка — забытый потребитель; шаблон напоминает, о чём подумать.",
      fizyka:
        "E_d = Σ P × h (× люди). C_пребыв = E_d × дни ÷ (U × DoD), C_сутки = E_d ÷ (U × DoD). P_PV = E_d ÷ (h_солнца × η), I_контр = P_PV ÷ U.",
    },
    pola: {
      dni: {
        nazwa: "Количество дней",
        cel: "Длительность пребывания — аккумулятор на всё время без солнца.",
        gdzie: "Ваш план поездки.",
        zakres: "Дни.",
      },
      osoby: {
        nazwa: "Количество человек",
        cel: "Умножает потребители «на человека» (телефоны, зарядки).",
        gdzie: "Ваш план.",
        zakres: "Люди.",
      },
      nazwa: {
        nazwa: "Название потребителя",
        cel: "Только для вашей ориентации.",
        gdzie: "Из шаблона или своё.",
        zakres: "Текст.",
      },
      moc: {
        nazwa: "Мощность [Вт]",
        cel: "Часть потребления и пика.",
        gdzie: "Табличка устройства.",
        zakres: "С таблички; приложение не угадывает.",
      },
      godziny: {
        nazwa: "Часы работы в сутки [ч]",
        cel: "Потребление энергии устройством.",
        gdzie: "Холодильник работает циклично — введите реальное время работы компрессора.",
        zakres: "0–24 ч.",
      },
      naOsobe: {
        nazwa: "На человека",
        cel: "Потребитель считается отдельно для каждого человека.",
        gdzie: "Например, телефон каждого участника.",
        zakres: "Да / нет.",
      },
      napiecie: {
        nazwa: "Напряжение аккумулятора [В]",
        cel: "Переводит Вт·ч в А·ч и мощность панели в ток контроллера.",
        gdzie: "Табличка аккумулятора / система (12, 24 В).",
        zakres: "Номинальное напряжение.",
      },
      dod: {
        nazwa: "Полезная часть (DoD) [%]",
        cel: "Сколько энергии аккумулятора можно использовать.",
        gdzie: "Паспорт аккумулятора.",
        zakres: "Из паспорта; приложение не угадывает.",
      },
      godzinSlonca: {
        nazwa: "Часы полного солнца [ч/сутки]",
        cel: "Подбор мощности панели.",
        gdzie: "Модуль 1 или карта инсоляции для места и месяца.",
        zakres: "0 = без панели.",
      },
      sprawnosc: {
        nazwa: "КПД пути панель → аккумулятор [%]",
        cel: "Потери контроллера, кабелей и заряда.",
        gdzie: "Паспорта контроллера и аккумулятора.",
        zakres: "Из паспортов; приложение не угадывает.",
      },
    },
  },
  "test-akumulatora": {
    migawka: {
      oCoChodzi: "Не нужно быть электронщиком, чтобы проверить, жив ли ещё аккумулятор.",
      jakDziala:
        "Измерьте напряжение после {h} ч покоя, затем под известной нагрузкой (например, лампой). По просадке напряжения приложение считает внутреннее сопротивление и сравнивает его с паспортом.",
      poCo:
        "У изношенного аккумулятора высокое сопротивление — под нагрузкой напряжение «проседает», хотя в покое всё выглядит нормально.",
      fizyka:
        "I = P ÷ U_нагр. R = (U_покой − U_нагр) ÷ I. Рост = (R − R_пасп) ÷ R_пасп; ≥ 50% (порог модуля 4) = замена. Свинец 12 В: ≤ 10,5 В в покое = утилизация (Библия), пересчёт по числу элементов 2 В.",
    },
    pola: {
      znamionowe: {
        nazwa: "Номинальное напряжение [В]",
        cel: "Пересчитывает порог 10,5 В для 12 В на другие напряжения.",
        gdzie: "Табличка аккумулятора (12, 24 В).",
        zakres: "Номинальное напряжение.",
      },
      spoczynkowe: {
        nazwa: "Напряжение покоя [В]",
        cel: "Первый, самый простой признак состояния.",
        gdzie: "Мультиметр на клеммах, не раньше чем через {h} ч без нагрузки и заряда.",
        zakres: "По измерению.",
      },
      mocObciazenia: {
        nazwa: "Мощность тестовой нагрузки [Вт]",
        cel: "Даёт ток теста I = P ÷ U.",
        gdzie: "Табличка нагрузки (например, лампа 12 В).",
        zakres: "Пусто = без нагрузочного теста.",
      },
      podObciazeniem: {
        nazwa: "Напряжение под нагрузкой [В]",
        cel: "Просадка напряжения даёт внутреннее сопротивление.",
        gdzie: "Мультиметр на клеммах через несколько секунд работы нагрузки.",
        zakres: "Ниже, чем в покое.",
      },
      rezystancjaKarta: {
        nazwa: "Внутреннее сопротивление по паспорту [мОм]",
        cel: "Ориентир для нового аккумулятора.",
        gdzie: "Паспорт производителя.",
        zakres: "Пусто = нет ориентира (результат неясен).",
      },
    },
  },
  "raport-bezpieczenstwa-maly": {
    migawka: {
      oCoChodzi: "Безопасность — основа. Отчёт показывает слабые места.",
      jakDziala:
        "Пройдите семь пунктов из Библии (предохранитель у аккумулятора, подбор предохранителей, предохранитель и провод, провода, защита от разряда, вентиляция, соединения) и отметьте «OK» или «Ошибка». Для каждой ошибки — шаг исправления и ссылка на калькулятор.",
      poCo:
        "В малых установках чаще всего пожар вызывают отсутствие предохранителя у аккумулятора и слабый контакт, а не сам аккумулятор.",
      fizyka:
        "Безопасность = OK ÷ все пункты × 100%. Непроверенный пункт не считается OK. Нет предохранителя у аккумулятора = стоп 🔴.",
    },
    pola: {
      bezpiecznikAkumulatora: {
        nazwa: "Предохранитель у аккумулятора",
        cel: "Защищает провод от аккумулятора от замыкания.",
        gdzie: "Плюс аккумулятора — предохранитель как можно ближе к клемме.",
        zakres: "OK / Ошибка.",
      },
      doborBezpiecznikow: {
        nazwa: "Подбор предохранителей",
        cel: "Предохранитель не должен срабатывать при нормальной работе нагрузки.",
        gdzie: "Сравните номинал с током нагрузки этой цепи.",
        zakres: "OK / Ошибка.",
      },
      bezpiecznikAPrzewod: {
        nazwa: "Предохранитель и провод",
        cel: "Предохранитель защищает провод: номинал выше допустимого тока провода не сработает до перегрева провода.",
        gdzie: "Сравните номинал с допустимым током провода (калькулятор кабелей и предохранителей).",
        zakres: "OK / Ошибка. Ошибка = стоп 🔴.",
      },
      przekrojePrzewodow: {
        nazwa: "Сечения проводов",
        cel: "Слишком тонкий провод греется и снижает напряжение.",
        gdzie: "Калькулятор кабелей и предохранителей малой установки.",
        zakres: "OK / Ошибка.",
      },
      ochronaRozladowania: {
        nazwa: "Защита от разряда",
        cel: "Глубокий разряд губит аккумулятор.",
        gdzie: "BMS, LVD или выход нагрузки контроллера.",
        zakres: "OK / Ошибка.",
      },
      wentylacjaAkumulatora: {
        nazwa: "Вентиляция аккумулятора",
        cel: "Водород от свинцового, перегрев LiFePO4.",
        gdzie: "Место установки аккумулятора.",
        zakres: "OK / Ошибка.",
      },
      polaczenia: {
        nazwa: "Соединения",
        cel: "Слабый контакт греется — частая причина пожара.",
        gdzie: "Все наконечники и клеммы.",
        zakres: "OK / Ошибка.",
      },
    },
  },
  "ladowanie-z-regulatora": {
    migawka: {
      oCoChodzi:
        "MPPT-контроллер — не волшебный кран: ток в аккумулятор зависит от мощности панелей, напряжения аккумулятора и трёх лимитов — контроллера, его PV-входа и самого аккумулятора.",
      jakDziala:
        "Приложение делит мощность панелей (до лимита PV-входа контроллера) на напряжение аккумулятора, затем ограничивает результат лимитом тока контроллера и током зарядки аккумулятора. Оно показывает, что именно ограничивает. Если указать ёмкость и диапазон уровня заряда, будут рассчитаны также скорость зарядки (C) и время при постоянном токе.",
      poCo:
        "Чтобы знать, какой ток реально потечёт в аккумулятор, не мал ли контроллер для панелей и нужно ли задать лимит тока зарядки, пока аккумулятор не получил больше, чем рекомендует производитель.",
      fizyka:
        "I = (P · η) / U. Мощность панелей с шильдика — это STC, поэтому ток — ВЕРХНЯЯ граница: зимой и в облачность он ниже. Время t = (C · ΔSOC/100) / I — НИЖНЯЯ граница, потому что к концу зарядки ток падает.",
    },
    pola: {
      mocPaneli: {
        nazwa: "Суммарная мощность панелей [Вт]",
        cel: "По ней считается ток, который могут дать панели. При нескольких панелях введите сумму всех, подключённых к этому контроллеру.",
        gdzie: "На шильдике или в карточке каждой панели (мощность в STC, «Pmax»).",
        zakres: "Из карточки панелей — приложение не угадывает мощность.",
      },
      pradRegulatora: {
        nazwa: "Макс. ток зарядки контроллера [А]",
        cel: "Контроллер не отдаст аккумулятору больше этого тока, даже если панели могли бы дать больше.",
        gdzie: "В карточке контроллера: «Maximum charge current», «Nominal charge current». Выбор модели из каталога подставляет это значение.",
        zakres: "Из карточки контроллера; пустое поле = лимит неизвестен, тогда он не учитывается.",
      },
      mocRegulatora: {
        nazwa: "Макс. мощность PV-входа контроллера [Вт]",
        cel: "Выше этой мощности избыток панелей срезается и не увеличивает ток зарядки. У некоторых контроллеров мощность зависит от напряжения аккумулятора.",
        gdzie: "В карточке контроллера: «Maximum PV power», «Max. PV array power» (при 12/24/48 В).",
        zakres: "Из карточки контроллера; пустое поле = лимит неизвестен.",
      },
      sprawnosc: {
        nazwa: "КПД контроллера [%]",
        cel: "Потери в контроллере уменьшают мощность, доходящую до аккумулятора. Без ввода приложение считает без потерь (верхняя граница).",
        gdzie: "В карточке контроллера: «Peak efficiency». Пиковый КПД обычно выше среднего в работе.",
        zakres: "От 0 до 100 %, из карточки устройства; пустое поле = без потерь.",
      },
      napiecie: {
        nazwa: "Напряжение аккумулятора [В]",
        cel: "Ток = мощность ÷ напряжение, поэтому одна и та же панель даёт больший ток при 12 В, чем при 24 В.",
        gdzie: "Номинальное напряжение аккумулятора или батареи (12, 24, 48 В…).",
        zakres: "Из карточки аккумулятора.",
      },
      limitAkumulatora: {
        nazwa: "Макс. ток зарядки аккумулятора [А]",
        cel: "Выше этого тока зарядка сокращает срок службы аккумулятора или грозит повреждением. Если возможный ток больше, лимит нужно задать в контроллере.",
        gdzie: "В карточке аккумулятора: «Max. charge current», часто в долях ёмкости (например, 0,3 C).",
        zakres: "Из карточки аккумулятора; пустое поле = лимит неизвестен, оценки нет.",
      },
      pojemnosc: {
        nazwa: "Ёмкость аккумулятора [А·ч]",
        cel: "Нужна для скорости зарядки (ток ÷ ёмкость) и времени зарядки.",
        gdzie: "На этикетке аккумулятора. Для батареи: сумма ёмкостей параллельных ветвей.",
        zakres: "Из карточки аккумулятора; пустое поле = без времени и C.",
      },
      socOd: {
        nazwa: "Уровень заряда в начале [%]",
        cel: "Начало диапазона, для которого считается время зарядки.",
        gdzie: "По вольтметру, BMS или индикатору аккумулятора.",
        zakres: "0–100 %, меньше значения в конце.",
      },
      socDo: {
        nazwa: "Уровень заряда в конце [%]",
        cel: "Конец диапазона. Время считается при постоянном токе, поэтому при зарядке до 100 % реальное время больше.",
        gdzie: "Целевой уровень, например 80 % при щадящей зарядке.",
        zakres: "0–100 %, больше значения в начале.",
      },
    },
  },
}
