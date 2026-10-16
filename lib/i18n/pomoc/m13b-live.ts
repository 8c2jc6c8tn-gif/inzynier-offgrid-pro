/**
 * Help content — Module 13, screen "Tryb wyjazdu i tryb nocny" (widgets 7.27 + 7.49 without telemetry). The app does not judge which
 * appliances are safety-critical (Directive #1) — the user chooses what stays on.
 */
import type { Tlumaczenie } from "./typy"

export const pl = {
  "tryb-ograniczonego-zuzycia": {
    migawka: {
      oCoChodzi: "To „plan oszczędzania” energii: wskazujesz, które odbiorniki mają zostać włączone podczas wyjazdu albo w nocy, a ja liczę, ile energii dzięki temu oszczędzisz.",
      jakDziala: "Biorę dobowe zużycie odbiorników z listy „Zużycie energii per urządzenie”. Suma wszystkich to zużycie normalne, suma tych, które zaznaczysz jako zostające włączone — zużycie w trybie ograniczonym. W trybie wyjazdu mnożę przez liczbę dób nieobecności; w trybie nocnym biorę h/24 doby (zakładam równomierne zużycie, bo lista nie niesie pór pracy). Z energią użyteczną baterii liczę, na ile dób albo nocy wystarczy bez ładowania z paneli.",
      poCo: "Wiesz z góry, ile prądu zabierze nieobecność lub noc i czy bateria to utrzyma — oraz które odbiorniki warto wyłączyć, żeby wystarczyło. Co jest krytyczne (lodówka, alarm, pompa), decydujesz Ty: aplikacja tego nie ocenia.",
      fizyka: "E_ogr = Σ E_i (zostają); E_okres = E_ogr · N_dni; E_noc = E_ogr · h/24; t_bat = C / E.",
    },
    pola: {
      tryb: { nazwa: "Tryb", cel: "Wyjazd liczy zużycie w całym okresie nieobecności, noc — w oknie nocnym.", gdzie: "Wybierz sytuację, którą planujesz.", zakres: "Lista." },
      dni: { nazwa: "Liczba dób nieobecności", cel: "Przez nią mnożę dobowe zużycie w trybie wyjazdu.", gdzie: "Od dnia wyjazdu do powrotu, razem z pełnymi dobami po drodze.", zakres: "> 0. Twój plan." },
      godziny: { nazwa: "Długość okna nocnego [h]", cel: "Tyle godzin doby liczę w trybie nocnym (zużycie × h/24).", gdzie: "Np. od wyłączenia świateł do rana.", zakres: "Więcej niż 0, najwyżej 24. Twój plan." },
      pojemnosc: { nazwa: "Energia użyteczna baterii [kWh]", cel: "Z niej liczę, na ile dób (wyjazd) albo nocy (noc) wystarczy bez ładowania z paneli.", gdzie: "Pojemność znamionowa × dopuszczalna głębokość rozładowania, z karty baterii.", zakres: "> 0. Puste = bez tego wyniku. Twoja bateria." },
      zostaje: { nazwa: "Odbiornik zostaje włączony", cel: "Zaznaczone odbiorniki liczą się do zużycia w trybie ograniczonym, niezaznaczone są wyłączone.", gdzie: "Zaznacz to, co musi pracować (np. lodówka, router, alarm). Aplikacja nie ocenia, co jest ważne.", zakres: "Tak / nie. Twoja decyzja." },
    },
  },
}

export const en: Tlumaczenie<typeof pl> = {
  "tryb-ograniczonego-zuzycia": {
    migawka: {
      oCoChodzi: "This is an “energy saving plan”: you point out which appliances stay on during a trip or at night, and I calculate how much energy you save.",
      jakDziala: "I take the daily consumption of the appliances from the “Energy use per device” list. The sum of all is the normal consumption, the sum of those you tick as staying on is the consumption in the limited mode. In trip mode I multiply by the number of days away; in night mode I take h/24 of the day (assuming uniform use, because the list has no operating times). With the battery’s usable energy I calculate for how many days or nights it lasts without charging from the panels.",
      poCo: "You know in advance how much electricity an absence or a night takes and whether the battery holds — and which appliances are worth switching off so that it lasts. What is critical (fridge, alarm, pump) is your decision: the app does not judge it.",
      fizyka: "E_lim = Σ E_i (stay on); E_period = E_lim · N_days; E_night = E_lim · h/24; t_bat = C / E.",
    },
    pola: {
      tryb: { nazwa: "Mode", cel: "Trip calculates the consumption over the whole absence, night — in the night window.", gdzie: "Pick the situation you plan.", zakres: "List." },
      dni: { nazwa: "Number of days away", cel: "I multiply the daily consumption by it in trip mode.", gdzie: "From departure to return, counting the full days in between.", zakres: "> 0. Your plan." },
      godziny: { nazwa: "Length of the night window [h]", cel: "So many hours of the day I count in night mode (consumption × h/24).", gdzie: "E.g. from lights-out to the morning.", zakres: "More than 0, at most 24. Your plan." },
      pojemnosc: { nazwa: "Usable battery energy [kWh]", cel: "I use it to calculate for how many days (trip) or nights (night) it lasts without charging from the panels.", gdzie: "Nominal capacity × permitted depth of discharge, from the battery datasheet.", zakres: "> 0. Empty = no such result. Your battery." },
      zostaje: { nazwa: "The appliance stays on", cel: "Ticked appliances count in the limited-mode consumption, unticked ones are switched off.", gdzie: "Tick what must keep running (e.g. fridge, router, alarm). The app does not judge what is important.", zakres: "Yes / no. Your decision." },
    },
  },
}

export const ru: Tlumaczenie<typeof pl> = {
  "tryb-ograniczonego-zuzycia": {
    migawka: {
      oCoChodzi: "Это «план экономии» энергии: вы указываете, какие приборы остаются включёнными во время отъезда или ночью, а я считаю, сколько энергии вы сэкономите.",
      jakDziala: "Беру суточное потребление приборов из списка «Потребление энергии по устройствам». Сумма всех — обычное потребление, сумма отмеченных как остающиеся включёнными — потребление в ограниченном режиме. В режиме отъезда умножаю на число суток отсутствия; в ночном — беру h/24 суток (считаю потребление равномерным, потому что в списке нет времени работы). С полезной энергией батареи считаю, на сколько суток или ночей её хватит без зарядки от панелей.",
      poCo: "Вы заранее знаете, сколько электричества заберёт отсутствие или ночь и выдержит ли батарея — и какие приборы стоит выключить, чтобы хватило. Что критично (холодильник, сигнализация, насос), решаете вы: приложение этого не оценивает.",
      fizyka: "E_огр = Σ E_i (остаются); E_период = E_огр · N_сут; E_ночь = E_огр · h/24; t_бат = C / E.",
    },
    pola: {
      tryb: { nazwa: "Режим", cel: "Отъезд считает потребление за весь период отсутствия, ночь — в ночном окне.", gdzie: "Выберите планируемую ситуацию.", zakres: "Список." },
      dni: { nazwa: "Число суток отсутствия", cel: "На него умножаю суточное потребление в режиме отъезда.", gdzie: "От отъезда до возвращения, считая полные сутки между ними.", zakres: "> 0. Ваш план." },
      godziny: { nazwa: "Длительность ночного окна [ч]", cel: "Столько часов суток считаю в ночном режиме (потребление × h/24).", gdzie: "Например, от выключения света до утра.", zakres: "Больше 0, не более 24. Ваш план." },
      pojemnosc: { nazwa: "Полезная энергия батареи [кВт·ч]", cel: "По ней считаю, на сколько суток (отъезд) или ночей (ночь) хватит без зарядки от панелей.", gdzie: "Номинальная ёмкость × допустимая глубина разряда, из паспорта батареи.", zakres: "> 0. Пусто = без этого результата. Ваша батарея." },
      zostaje: { nazwa: "Прибор остаётся включённым", cel: "Отмеченные приборы учитываются в потреблении ограниченного режима, неотмеченные выключены.", gdzie: "Отметьте то, что должно работать (например, холодильник, роутер, сигнализация). Приложение не оценивает, что важно.", zakres: "Да / нет. Ваше решение." },
    },
  },
}
