/**
 * perspektywy — text of the "Outlook of projects" section (`app/perspektywy`, `docs/perspektywy-projektow.md`):
 * the index and the articles about technologies and patents seen as "the future of energy", each with an
 * energy and cost calculation. Every number here comes from `docs/perspektywy-projektow.md` (marked there as
 * source / manufacturer claim / our calculation / assumption); change the numbers there first.
 */
export const pl = {
  "UI-PERSP-LINK": "Perspektywy",
  "UI-PERSP-TYTUL": "Perspektywy projektów",
  "UI-PERSP-OPIS":
    "Ciekawostki: technologie i patenty, które ktoś pokazuje jako przyszłość energetyki. Każda z rachunkiem energii i kosztu, oceną realności i wyraźnym podziałem na to, co sprawdzone, i to, co tylko deklaracja producenta.",
  "UI-PERSP-WROC": "← Perspektywy projektów",
  "UI-PERSP-OCENA": "Ocena",
  "UI-PERSP-DATA": "Stan na {data}",
  "UI-PERSP-H-JAK": "Jak to działa",
  "UI-PERSP-H-DEKLARACJE": "Co deklaruje producent (bez niezależnych pomiarów)",
  "UI-PERSP-H-BILANS": "Bilans energii (nasze wyliczenie)",
  "UI-PERSP-H-RYNKI": "Czy się opłaca: Polska, Norwegia, Holandia",
  "UI-PERSP-H-OFFGRID": "Sens dla Offgrid",
  "UI-PERSP-H-ZRODLA": "Źródła i co jest sprawdzone",
  "UI-PERSP-AIRCELA-TYTUL": "Aircela: benzyna z powietrza",
  "UI-PERSP-AIRCELA-KARTA": "Maszyna wielkości lodówki robi benzynę z CO₂ z powietrza, wody i prądu. Ile to kosztuje energii i gdzie się opłaca.",
  "UI-PERSP-AIRCELA-OCENA": "obserwować, nie budować",
  "UI-PERSP-AIRCELA-LEAD":
    "Technicznie wykonalne, bo każdy etap jest znaną technologią. Opłacalność zależy od ceny prądu i ceny paliwa: wg tego rachunku w Polsce się nie opłaca, w Norwegii jest na granicy, w Holandii tylko przy nadwyżkowym prądzie.",
  "UI-PERSP-AIRCELA-JAK-1": "Wychwyt CO₂ z powietrza ciekłym sorbentem, który jest regenerowany w maszynie.",
  "UI-PERSP-AIRCELA-JAK-2": "Elektroliza wody: wodór zostaje w maszynie, tlen wychodzi na zewnątrz.",
  "UI-PERSP-AIRCELA-JAK-3": "Synteza metanolu z CO₂ i wodoru.",
  "UI-PERSP-AIRCELA-JAK-4": "Zamiana metanolu na benzynę (proces MTG, dwa etapy katalityczne).",
  "UI-PERSP-AIRCELA-DEKL-1": "Ok. 1 galon amerykański benzyny na dobę (3,785 l), ok. 10 kg CO₂ na dobę, zbiornik do 17 galonów.",
  "UI-PERSP-AIRCELA-DEKL-2": "Ok. 75 kWh prądu na galon i sprawność „powyżej 50%” (liczona od energii galonu ok. 37 kWh).",
  "UI-PERSP-AIRCELA-DEKL-3": "Cena urządzenia 15–20 tys. USD na początek; sprzedaż w wybranych stanach USA ok. końca 2026 (z drugiej ręki).",
  "UI-PERSP-AIRCELA-BILANS-1": "Z chemii: na galon potrzeba ok. 1,21 kg wodoru i ok. 8,8 kg CO₂.",
  "UI-PERSP-AIRCELA-BILANS-2":
    "Elektroliza 60–66 kWh plus wychwyt CO₂ 12–28 kWh daje od ok. 73 do ok. 94 kWh na galon, jeszcze bez strat sprężania, pomp i ogrzewania. Realnie 85–100 kWh, czyli 22–26 kWh na litr.",
  "UI-PERSP-AIRCELA-BILANS-3": "Deklarowane 75 kWh leży na samym dole tego zakresu. Przy 100 kWh sprawność względem energii paliwa wynosi ok. 33%.",
  "UI-PERSP-AIRCELA-BILANS-4":
    "Jedno urządzenie pobiera 3–4 kW ciągle; do całorocznej pracy potrzebuje 26–38 kWp paneli, a daje ok. 1,4 tys. litrów rocznie.",
  "UI-PERSP-AIRCELA-RYNKI-WSTEP":
    "Liczymy próg: przy jakiej cenie prądu litr z maszyny kosztuje tyle, co na stacji. Założenia (nie dane): urządzenie za 15–20 tys. USD służy 10 lat i pracuje 90% czasu, kursy 0,92 €/USD i 4,0 zł/€; bez serwisu, sorbentu, opłat sieciowych i podatków od paliwa własnej produkcji.",
  "UI-PERSP-AIRCELA-RYNKI-PL":
    "Polska: stacja 6,85–7,55 zł/l (ok. 1,7–1,9 €/l). Próg: ok. 0,01–0,04 €/kWh (ok. 0,03–0,16 zł/kWh), poniżej realnej ceny prądu z PV z magazynem. Nie opłaca się.",
  "UI-PERSP-AIRCELA-RYNKI-NO":
    "Norwegia: stacja 2,42 €/l (średnia tygodniowa UE, wrzesień 2026). Próg: ok. 0,036–0,066 €/kWh. Cena stała Norgespris to 0,40 NOK/kWh bez VAT (ok. 0,037 €/kWh, bez opłat sieciowych). Na granicy: koszt bliski cenie na stacji, bez zysku.",
  "UI-PERSP-AIRCELA-RYNKI-NL":
    "Holandia: stacja 2,31 €/l (koniec października 2026). Próg: ok. 0,031–0,061 €/kWh. Prąd domowy to ok. 0,24–0,28 €/kWh, czyli 4–8 razy za drogo. Wychodzi tylko w godzinach z hurtową ceną poniżej progu, ale wtedy maszyna pracuje część doby.",
  "UI-PERSP-AIRCELA-RYNKI-WNIOSEK":
    "Przy pracy przez połowę doby koszt urządzenia na litr rośnie prawie dwukrotnie i wynik się pogarsza. Opłacalność zależy więc od taniego prądu przez całą dobę.",
  "UI-PERSP-AIRCELA-OFFGRID-1":
    "Samochód elektryczny zużywa 7–10 razy mniej energii na kilometr niż auto na taką benzynę, a łańcuch prąd → benzyna → agregat → prąd odzyskuje tylko 7–13% energii.",
  "UI-PERSP-AIRCELA-OFFGRID-2":
    "Dla zwykłej instalacji off-grid taniej dołożyć paneli i kupić paliwo do agregatu. E-paliwo ma sens tam, gdzie paliwa nie da się zastąpić prądem, i tam, gdzie prąd jest bardzo tani.",
  "UI-PERSP-AIRCELA-ZRODLA-OPIS":
    "Deklaracje producenta pochodzą z mediów, nie z pomiarów. Ceny paliw: tygodniowy biuletyn UE; ceny prądu i liczby o energii wychwytu CO₂ i elektrolizerów pochodzą ze streszczeń wyszukiwań i trzeba je sprawdzić w oryginałach. Pełny rachunek i luki: docs/perspektywy-projektow.md.",
}

export const en: Record<keyof typeof pl, string> = {
  "UI-PERSP-LINK": "Outlook",
  "UI-PERSP-TYTUL": "Project outlook",
  "UI-PERSP-OPIS":
    "Curiosities: technologies and patents someone presents as the future of energy. Each comes with an energy and cost calculation, a reality check and a clear split between what is verified and what is only the manufacturer's claim.",
  "UI-PERSP-WROC": "← Project outlook",
  "UI-PERSP-OCENA": "Verdict",
  "UI-PERSP-DATA": "As of {data}",
  "UI-PERSP-H-JAK": "How it works",
  "UI-PERSP-H-DEKLARACJE": "What the manufacturer claims (no independent measurements)",
  "UI-PERSP-H-BILANS": "Energy balance (our calculation)",
  "UI-PERSP-H-RYNKI": "Does it pay: Poland, Norway, the Netherlands",
  "UI-PERSP-H-OFFGRID": "Relevance for off-grid",
  "UI-PERSP-H-ZRODLA": "Sources and what is verified",
  "UI-PERSP-AIRCELA-TYTUL": "Aircela: petrol from air",
  "UI-PERSP-AIRCELA-KARTA": "A fridge-sized machine makes petrol from CO₂ in the air, water and electricity. How much energy it takes and where it pays.",
  "UI-PERSP-AIRCELA-OCENA": "watch, do not build",
  "UI-PERSP-AIRCELA-LEAD":
    "Technically feasible, because every step is a known technology. Whether it pays depends on the electricity and fuel prices: by this calculation not in Poland, borderline in Norway, in the Netherlands only with surplus electricity.",
  "UI-PERSP-AIRCELA-JAK-1": "CO₂ is captured from the air by a liquid sorbent that is regenerated inside the machine.",
  "UI-PERSP-AIRCELA-JAK-2": "Water electrolysis: the hydrogen stays in the machine, the oxygen is released.",
  "UI-PERSP-AIRCELA-JAK-3": "Methanol synthesis from CO₂ and hydrogen.",
  "UI-PERSP-AIRCELA-JAK-4": "Methanol is turned into petrol (the MTG process, two catalytic steps).",
  "UI-PERSP-AIRCELA-DEKL-1": "About 1 US gallon of petrol a day (3.785 l), about 10 kg of CO₂ a day, a tank of up to 17 gallons.",
  "UI-PERSP-AIRCELA-DEKL-2": "About 75 kWh of electricity per gallon and an efficiency “above 50%” (counted against a gallon's energy of about 37 kWh).",
  "UI-PERSP-AIRCELA-DEKL-3": "Machine price of USD 15,000–20,000 at the start; sales in selected US states around the end of 2026 (second-hand report).",
  "UI-PERSP-AIRCELA-BILANS-1": "From the chemistry: a gallon needs about 1.21 kg of hydrogen and about 8.8 kg of CO₂.",
  "UI-PERSP-AIRCELA-BILANS-2":
    "Electrolysis 60–66 kWh plus CO₂ capture 12–28 kWh gives about 73 to 94 kWh per gallon, before compression, pump and heating losses. Realistically 85–100 kWh, that is 22–26 kWh per litre.",
  "UI-PERSP-AIRCELA-BILANS-3": "The claimed 75 kWh sits at the very bottom of this range. At 100 kWh the efficiency against the fuel's energy is about 33%.",
  "UI-PERSP-AIRCELA-BILANS-4":
    "One machine draws 3–4 kW continuously; to run all year it needs 26–38 kWp of panels and delivers about 1,400 litres a year.",
  "UI-PERSP-AIRCELA-RYNKI-WSTEP":
    "We compute a threshold: the electricity price at which a litre from the machine costs the same as at the pump. Assumptions (not data): the machine costs USD 15,000–20,000, lasts 10 years and runs 90% of the time; rates 0.92 €/USD and 4.0 PLN/€; no servicing, sorbent, grid fees or tax on home-made fuel.",
  "UI-PERSP-AIRCELA-RYNKI-PL":
    "Poland: pump 6.85–7.55 PLN/l (about 1.7–1.9 €/l). Threshold: about 0.01–0.04 €/kWh (about 0.03–0.16 PLN/kWh), below the real price of PV electricity with storage. It does not pay.",
  "UI-PERSP-AIRCELA-RYNKI-NO":
    "Norway: pump 2.42 €/l (EU weekly average, September 2026). Threshold: about 0.036–0.066 €/kWh. The fixed Norgespris is 0.40 NOK/kWh excluding VAT (about 0.037 €/kWh, without grid fees). Borderline: cost close to the pump price, no profit.",
  "UI-PERSP-AIRCELA-RYNKI-NL":
    "Netherlands: pump 2.31 €/l (end of October 2026). Threshold: about 0.031–0.061 €/kWh. Household electricity is about 0.24–0.28 €/kWh, 4–8 times too dear. It works only in hours when the wholesale price is below the threshold, but then the machine runs part of the day.",
  "UI-PERSP-AIRCELA-RYNKI-WNIOSEK":
    "If the machine runs half of the day, the machine cost per litre almost doubles and the result gets worse. So it pays only with cheap electricity around the clock.",
  "UI-PERSP-AIRCELA-OFFGRID-1":
    "An electric car uses 7–10 times less energy per kilometre than a car running on such petrol, and the chain electricity → petrol → generator → electricity recovers only 7–13% of the energy.",
  "UI-PERSP-AIRCELA-OFFGRID-2":
    "For an ordinary off-grid system it is cheaper to add panels and buy fuel for the generator. E-fuel makes sense where fuel cannot be replaced by electricity, and where electricity is very cheap.",
  "UI-PERSP-AIRCELA-ZRODLA-OPIS":
    "The manufacturer's claims come from the media, not from measurements. Fuel prices: the EU weekly bulletin; electricity prices and the figures on CO₂ capture and electrolyser energy come from search summaries and must be checked in the originals. Full calculation and gaps: docs/perspektywy-projektow.md.",
}

export const ru: Record<keyof typeof pl, string> = {
  "UI-PERSP-LINK": "Перспективы",
  "UI-PERSP-TYTUL": "Перспективы проектов",
  "UI-PERSP-OPIS":
    "Любопытные технологии и патенты, которые выдают за будущее энергетики. К каждой — расчёт энергии и стоимости, оценка реальности и чёткое разделение: что проверено, а что лишь заявление производителя.",
  "UI-PERSP-WROC": "← Перспективы проектов",
  "UI-PERSP-OCENA": "Оценка",
  "UI-PERSP-DATA": "По состоянию на {data}",
  "UI-PERSP-H-JAK": "Как это работает",
  "UI-PERSP-H-DEKLARACJE": "Что заявляет производитель (без независимых измерений)",
  "UI-PERSP-H-BILANS": "Энергетический баланс (наш расчёт)",
  "UI-PERSP-H-RYNKI": "Окупается ли: Польша, Норвегия, Нидерланды",
  "UI-PERSP-H-OFFGRID": "Смысл для off-grid",
  "UI-PERSP-H-ZRODLA": "Источники и что проверено",
  "UI-PERSP-AIRCELA-TYTUL": "Aircela: бензин из воздуха",
  "UI-PERSP-AIRCELA-KARTA": "Машина размером с холодильник делает бензин из CO₂ воздуха, воды и электричества. Сколько это стоит энергии и где окупается.",
  "UI-PERSP-AIRCELA-OCENA": "наблюдать, не строить",
  "UI-PERSP-AIRCELA-LEAD":
    "Технически осуществимо, потому что каждый этап — известная технология. Окупаемость зависит от цен на электричество и топливо: по этому расчёту в Польше не окупается, в Норвегии на грани, в Нидерландах — только при избытке электричества.",
  "UI-PERSP-AIRCELA-JAK-1": "CO₂ извлекается из воздуха жидким сорбентом, который регенерируется внутри машины.",
  "UI-PERSP-AIRCELA-JAK-2": "Электролиз воды: водород остаётся в машине, кислород выходит наружу.",
  "UI-PERSP-AIRCELA-JAK-3": "Синтез метанола из CO₂ и водорода.",
  "UI-PERSP-AIRCELA-JAK-4": "Превращение метанола в бензин (процесс MTG, два каталитических этапа).",
  "UI-PERSP-AIRCELA-DEKL-1": "Около 1 американского галлона бензина в сутки (3,785 л), около 10 кг CO₂ в сутки, бак до 17 галлонов.",
  "UI-PERSP-AIRCELA-DEKL-2": "Около 75 кВт·ч электричества на галлон и КПД «выше 50%» (считая от энергии галлона около 37 кВт·ч).",
  "UI-PERSP-AIRCELA-DEKL-3": "Цена устройства 15–20 тыс. USD на старте; продажи в отдельных штатах США около конца 2026 года (из вторых рук).",
  "UI-PERSP-AIRCELA-BILANS-1": "По химии: на галлон нужно около 1,21 кг водорода и около 8,8 кг CO₂.",
  "UI-PERSP-AIRCELA-BILANS-2":
    "Электролиз 60–66 кВт·ч плюс улавливание CO₂ 12–28 кВт·ч дают от 73 до 94 кВт·ч на галлон, ещё без потерь на сжатие, насосы и нагрев. Реалистично 85–100 кВт·ч, то есть 22–26 кВт·ч на литр.",
  "UI-PERSP-AIRCELA-BILANS-3": "Заявленные 75 кВт·ч лежат на самом дне этого диапазона. При 100 кВт·ч КПД относительно энергии топлива около 33%.",
  "UI-PERSP-AIRCELA-BILANS-4":
    "Одна машина постоянно потребляет 3–4 кВт; для работы круглый год нужно 26–38 кВт пиковой мощности панелей, а выдаёт она около 1,4 тыс. литров в год.",
  "UI-PERSP-AIRCELA-RYNKI-WSTEP":
    "Считаем порог: при какой цене электричества литр из машины стоит столько же, сколько на заправке. Допущения (не данные): устройство за 15–20 тыс. USD служит 10 лет и работает 90% времени, курсы 0,92 €/USD и 4,0 зл/€; без обслуживания, сорбента, сетевых платежей и налогов на топливо собственного производства.",
  "UI-PERSP-AIRCELA-RYNKI-PL":
    "Польша: заправка 6,85–7,55 зл/л (около 1,7–1,9 €/л). Порог: около 0,01–0,04 €/кВт·ч (около 0,03–0,16 зл/кВт·ч), ниже реальной цены электричества от PV с накопителем. Не окупается.",
  "UI-PERSP-AIRCELA-RYNKI-NO":
    "Норвегия: заправка 2,42 €/л (недельное среднее по ЕС, сентябрь 2026). Порог: около 0,036–0,066 €/кВт·ч. Фиксированная цена Norgespris — 0,40 NOK/кВт·ч без НДС (около 0,037 €/кВт·ч, без сетевых платежей). На грани: стоимость близка к цене на заправке, без прибыли.",
  "UI-PERSP-AIRCELA-RYNKI-NL":
    "Нидерланды: заправка 2,31 €/л (конец октября 2026). Порог: около 0,031–0,061 €/кВт·ч. Бытовое электричество стоит около 0,24–0,28 €/кВт·ч, то есть в 4–8 раз дороже. Получается только в часы, когда оптовая цена ниже порога, но тогда машина работает часть суток.",
  "UI-PERSP-AIRCELA-RYNKI-WNIOSEK":
    "Если машина работает полсуток, стоимость устройства на литр растёт почти вдвое, и результат ухудшается. Окупаемость зависит от дешёвого электричества круглые сутки.",
  "UI-PERSP-AIRCELA-OFFGRID-1":
    "Электромобиль расходует в 7–10 раз меньше энергии на километр, чем машина на таком бензине, а цепочка электричество → бензин → генератор → электричество возвращает лишь 7–13% энергии.",
  "UI-PERSP-AIRCELA-OFFGRID-2":
    "Для обычной системы off-grid дешевле добавить панелей и купить топливо для генератора. Э-топливо имеет смысл там, где топливо нельзя заменить электричеством, и там, где электричество очень дёшево.",
  "UI-PERSP-AIRCELA-ZRODLA-OPIS":
    "Заявления производителя взяты из СМИ, а не из измерений. Цены на топливо: недельный бюллетень ЕС; цены на электричество и данные об энергии улавливания CO₂ и электролизёров — из кратких выдержек поиска, их нужно проверить по первоисточникам. Полный расчёт и пробелы: docs/perspektywy-projektow.md.",
}
