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
  "terminarz-przegladow": {
    migawka: {
      oCoChodzi: "Instalacja off-grid wymaga okresowych przeglądów — złącza się poluzowują, akumulatory starzeją, gaśnice mają termin. Tu masz jedną listę z terminami.",
      jakDziala: "Dla każdej pozycji wpisujesz datę ostatniego przeglądu i odstęp w miesiącach. Dodaję odstęp do daty (miesiące kalendarzowe) i liczę, ile dni zostało do terminu albo ile minęło po terminie. Pozycje są posortowane od najpilniejszej.",
      poCo: "Nie zapominasz o przeglądach, które decydują o bezpieczeństwie instalacji. Interwały bierzesz z instrukcji swoich urządzeń — aplikacja nie zna zaleceń producentów i nie ocenia, jak często coś trzeba sprawdzać.",
      fizyka: "Termin = data ostatniego przeglądu + interwał (miesiące kalendarzowe); dni do terminu = termin − dziś.",
    },
    pola: {
      nazwa: { nazwa: "Co przeglądasz", cel: "Tylko opis pozycji — pomaga rozpoznać ją na liście.", gdzie: "Np. dokręcenie złączy DC, kontrola akumulatorów, przegląd gaśnicy, czyszczenie paneli.", zakres: "Dowolny tekst." },
      ostatni: { nazwa: "Data ostatniego przeglądu", cel: "Od niej liczę następny termin.", gdzie: "Z Twojego dziennika, protokołu przeglądu albo faktury za serwis.", zakres: "Istniejąca data. Puste = termin nie jest liczony." },
      przypomnienia: { nazwa: "Przypominaj o przeglądach po terminie", cel: "Włącza powiadomienie przeglądarki, gdy któryś przegląd z listy jest po terminie.", gdzie: "Zaznacz pole i zezwól na powiadomienia, gdy przeglądarka zapyta. Powiadomienie pokazuje się raz dziennie przy otwarciu aplikacji, nie w tle.", zakres: "Włączone albo wyłączone, osobno na każdym urządzeniu. Bez zgody przeglądarki nic się nie pokaże; liczbę przeglądów po terminie zawsze widać na dzwonku pulpitu." },
      interwal: { nazwa: "Odstęp między przeglądami [miesiące]", cel: "Dodaję go do daty ostatniego przeglądu.", gdzie: "Z instrukcji urządzenia, zaleceń producenta albo wymagań ubezpieczyciela — aplikacja nie podaje wartości domyślnej.", zakres: "Liczba całkowita ≥ 1. Twoja instalacja." },
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
  "terminarz-przegladow": {
    migawka: {
      oCoChodzi: "An off-grid installation needs periodic inspections — connectors loosen, batteries age, extinguishers have an expiry date. Here is one list with the dates.",
      jakDziala: "For each item you enter the date of the last inspection and the interval in months. I add the interval to the date (calendar months) and count how many days are left or how long ago it passed. Items are sorted from the most urgent.",
      poCo: "You do not forget inspections that decide the safety of the installation. You take the intervals from your devices’ manuals — the app does not know manufacturers’ recommendations and does not judge how often something must be checked.",
      fizyka: "Date = last inspection + interval (calendar months); days left = date − today.",
    },
    pola: {
      nazwa: { nazwa: "What you inspect", cel: "Only a label of the item — it helps recognise it on the list.", gdzie: "E.g. tightening DC connectors, checking batteries, extinguisher service, cleaning panels.", zakres: "Any text." },
      ostatni: { nazwa: "Date of the last inspection", cel: "I count the next date from it.", gdzie: "From your logbook, the inspection report or the service invoice.", zakres: "An existing date. Empty = the date is not calculated." },
      przypomnienia: { nazwa: "Remind me about overdue inspections", cel: "Turns on a browser notification when any inspection on the list is overdue.", gdzie: "Tick the box and allow notifications when the browser asks. The notification appears once a day when you open the app, not in the background.", zakres: "On or off, separately on each device. Without the browser’s permission nothing is shown; the number of overdue inspections is always visible on the dashboard bell." },
      interwal: { nazwa: "Interval between inspections [months]", cel: "I add it to the date of the last inspection.", gdzie: "From the device manual, the manufacturer’s recommendations or your insurer’s requirements — the app gives no default.", zakres: "A whole number ≥ 1. Your installation." },
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
  "terminarz-przegladow": {
    migawka: {
      oCoChodzi: "Установке off-grid нужны периодические осмотры: соединения ослабевают, аккумуляторы стареют, у огнетушителей есть срок. Здесь один список со сроками.",
      jakDziala: "Для каждой позиции вы вводите дату последнего осмотра и интервал в месяцах. Я прибавляю интервал к дате (календарные месяцы) и считаю, сколько дней осталось или сколько прошло после срока. Позиции отсортированы от самой срочной.",
      poCo: "Вы не забываете об осмотрах, от которых зависит безопасность установки. Интервалы берёте из инструкций ваших устройств — приложение не знает рекомендаций производителей и не оценивает, как часто что-то нужно проверять.",
      fizyka: "Срок = дата последнего осмотра + интервал (календарные месяцы); дней до срока = срок − сегодня.",
    },
    pola: {
      nazwa: { nazwa: "Что осматриваете", cel: "Только подпись позиции — помогает узнать её в списке.", gdzie: "Например, подтяжка DC-соединений, проверка аккумуляторов, обслуживание огнетушителя, чистка панелей.", zakres: "Любой текст." },
      ostatni: { nazwa: "Дата последнего осмотра", cel: "От неё считаю следующий срок.", gdzie: "Из вашего журнала, протокола осмотра или счёта за обслуживание.", zakres: "Существующая дата. Пусто = срок не рассчитывается." },
      przypomnienia: { nazwa: "Напоминать о просроченных осмотрах", cel: "Включает уведомление браузера, когда какой-либо осмотр из списка просрочен.", gdzie: "Отметьте поле и разрешите уведомления, когда браузер спросит. Уведомление появляется раз в день при открытии приложения, не в фоне.", zakres: "Включено или выключено, отдельно на каждом устройстве. Без разрешения браузера ничего не покажется; количество просроченных осмотров всегда видно на колокольчике рабочего стола." },
      interwal: { nazwa: "Интервал между осмотрами [месяцы]", cel: "Прибавляю его к дате последнего осмотра.", gdzie: "Из инструкции устройства, рекомендаций производителя или требований страховщика — значения по умолчанию в приложении нет.", zakres: "Целое число ≥ 1. Ваша установка." },
    },
  },
}
