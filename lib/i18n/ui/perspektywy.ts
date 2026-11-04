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
    "Technicznie wykonalne, bo każdy etap jest znaną technologią. Opłacalność zależy od ceny prądu, ceny paliwa i od tego, jak często maszyna pracuje: wg tego rachunku nie opłaca się w Polsce ani na własnych panelach w Norwegii i Holandii; w Norwegii jest na granicy tylko przy stałej cenie prądu z elektrowni wodnych przez całą dobę.",
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
  "UI-PERSP-AIRCELA-RYNKI-PV-1":
    "Własne PV zamiast sieci: energia z paneli kosztuje ok. 0,04–0,09 €/kWh (zakres dla instalacji naziemnych w Niemczech, jako przybliżenie), ale maszyna pracuje tylko przy słońcu. Przy panelach 2–4 razy mocniejszych od maszyny działa ok. 18–33% czasu w roku (uzysk ok. 900 kWh/kWp, zimą w Norwegii niemal zero).",
  "UI-PERSP-AIRCELA-RYNKI-PV-2":
    "Wtedy dominuje koszt urządzenia, nie energii: samo urządzenie (15–20 tys. USD, 10 lat) to 3,0–7,2 €/l, energia 0,9–3,0 €/l, razem 4,0–9,8 €/l, wobec 2,31 €/l (Holandia) i 2,42 €/l (Norwegia) na stacji. Nawet przy darmowej energii samo urządzenie kosztuje więcej niż litr na stacji.",
  "UI-PERSP-AIRCELA-RYNKI-PV-3":
    "Opłacałoby się dopiero, gdyby urządzenie kosztowało ok. 1–6 tys. USD (kilka do kilkunastu razy taniej) albo pracowało całą dobę przez cały rok na tanim prądzie, jak w Norwegii przy stałej cenie z elektrowni wodnych.",
  "UI-PERSP-AIRCELA-RYNKI-WNIOSEK":
    "Przy pracy przez część doby koszt urządzenia na litr rośnie wielokrotnie. Opłacalność zależy więc od taniego prądu przez całą dobę, a nie tylko od ceny energii.",
  "UI-PERSP-AIRCELA-OFFGRID-1":
    "Samochód elektryczny zużywa 7–10 razy mniej energii na kilometr niż auto na taką benzynę, a łańcuch prąd → benzyna → agregat → prąd odzyskuje tylko 7–13% energii.",
  "UI-PERSP-AIRCELA-OFFGRID-2":
    "Dla zwykłej instalacji off-grid taniej dołożyć paneli i kupić paliwo do agregatu. E-paliwo ma sens tam, gdzie paliwa nie da się zastąpić prądem, i tam, gdzie prąd jest bardzo tani.",
  "UI-PERSP-H-POROWNANIE": "Oba scenariusze obok siebie",
  "UI-PERSP-AIRCELA-POR-WSTEP":
    "Ta sama maszyna (1 galon na dobę, 15–20 tys. USD, 10 lat życia) w dwóch sposobach zasilania. A. Praca ciągła na prądzie z sieci albo po stałej cenie (90% czasu w roku). B. Tylko własne PV: maszyna pracuje wyłącznie w słońcu, przy panelach 2–4 razy mocniejszych od niej. Wszystko w euro, a w nawiasie w złotych po 4,0 zł/€.",
  "UI-PERSP-AIRCELA-POR-ZALOZENIA":
    "Cena energii w scenariuszu A: Polska 0,20 zł/kWh (parametr, nie taryfa), Norwegia 0,037 €/kWh (cena stała Norgespris, bez opłat sieciowych), Holandia 0,24–0,28 €/kWh (cena domowa). Scenariusz B: energia z PV 0,04–0,09 €/kWh, uzysk 900 kWh/kWp rocznie. Zakres to najlepszy i najgorszy układ założeń. Kursów walut nie sprawdzano.",
  "UI-PERSP-AIRCELA-POR-WNIOSEK":
    "Przy pracy ciągłej decyduje cena energii: Norwegia jest na granicy, Holandia i Polska odpadają. Na własnym PV decyduje urządzenie, bo pracuje kilka razy mniej godzin i jego koszt rozkłada się na kilka razy mniej litrów, więc nie opłaca się w żadnym z trzech krajów. Uwaga, że w Holandii i Norwegii się opłaca, a z własnego PV oczywiście też, potwierdza się więc tylko częściowo.",
  "UI-PERSP-POR-OPIS-TABELI": "Koszt litra benzyny z maszyny w dwóch scenariuszach, w euro (w nawiasie w złotych), obok ceny na stacji.",
  "UI-PERSP-POR-KOL-RYNEK": "Scenariusz i rynek",
  "UI-PERSP-POR-KOL-LITRY": "Litrów rocznie",
  "UI-PERSP-POR-KOL-URZADZENIE": "Urządzenie na litr",
  "UI-PERSP-POR-KOL-ENERGIA": "Energia na litr",
  "UI-PERSP-POR-KOL-RAZEM": "Razem na litr",
  "UI-PERSP-POR-KOL-STACJA": "Stacja, litr",
  "UI-PERSP-POR-KOL-WNIOSEK": "Wniosek",
  "UI-PERSP-POR-SC-CIAGLY": "A. Praca ciągła",
  "UI-PERSP-POR-SC-PV": "B. Własne PV",
  "UI-PERSP-POR-KRAJ-PL": "Polska",
  "UI-PERSP-POR-KRAJ-NO": "Norwegia",
  "UI-PERSP-POR-KRAJ-NL": "Holandia",
  "UI-PERSP-POR-OCENA-TAK": "opłaca się",
  "UI-PERSP-POR-OCENA-GRANICA": "na granicy",
  "UI-PERSP-POR-OCENA-NIE": "nie opłaca się",
  "UI-PERSP-POR-LITRY-JEDEN": "ok. {l}",
  "UI-PERSP-POR-LITRY-ZAKRES": "{min}–{max}",
  "UI-PERSP-POR-CENA-JEDNA": "{eur} € ({zl} zł)",
  "UI-PERSP-POR-CENA-ZAKRES": "{eurMin}–{eurMax} € ({zlMin}–{zlMax} zł)",
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
    "Technically feasible, because every step is a known technology. Whether it pays depends on the electricity price, the fuel price and how often the machine runs: by this calculation it does not pay in Poland, nor on own panels in Norway and the Netherlands; in Norway it is borderline only with a fixed hydro-power electricity price around the clock.",
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
  "UI-PERSP-AIRCELA-RYNKI-PV-1":
    "Own PV instead of the grid: panel electricity costs about 0.04–0.09 €/kWh (a range for ground-mounted plants in Germany, used as an approximation), but the machine runs only in the sun. With panels 2–4 times the machine's power it runs about 18–33% of the year (yield about 900 kWh/kWp, almost nothing in winter in Norway).",
  "UI-PERSP-AIRCELA-RYNKI-PV-2":
    "Then the machine cost dominates, not the energy: the machine alone (USD 15,000–20,000, 10 years) is 3.0–7.2 €/l, energy 0.9–3.0 €/l, together 4.0–9.8 €/l, against 2.31 €/l (Netherlands) and 2.42 €/l (Norway) at the pump. Even with free energy the machine alone costs more than a litre at the pump.",
  "UI-PERSP-AIRCELA-RYNKI-PV-3":
    "It would pay only if the machine cost about USD 1,000–6,000 (several to over ten times cheaper) or ran around the clock all year on cheap electricity, as in Norway with the fixed hydro-power price.",
  "UI-PERSP-AIRCELA-RYNKI-WNIOSEK":
    "If the machine runs only part of the day, the machine cost per litre multiplies. So it pays only with cheap electricity around the clock, not just a low energy price.",
  "UI-PERSP-AIRCELA-OFFGRID-1":
    "An electric car uses 7–10 times less energy per kilometre than a car running on such petrol, and the chain electricity → petrol → generator → electricity recovers only 7–13% of the energy.",
  "UI-PERSP-AIRCELA-OFFGRID-2":
    "For an ordinary off-grid system it is cheaper to add panels and buy fuel for the generator. E-fuel makes sense where fuel cannot be replaced by electricity, and where electricity is very cheap.",
  "UI-PERSP-H-POROWNANIE": "Both scenarios side by side",
  "UI-PERSP-AIRCELA-POR-WSTEP":
    "The same machine (1 gallon a day, USD 15–20 thousand, 10-year life) powered two ways. A. Continuous operation on grid power or at a fixed price (90% of the year). B. Own PV only: the machine runs only in the sun, with panels 2–4 times its own power. Everything in euro, with zloty in brackets at 4.0 PLN/EUR.",
  "UI-PERSP-AIRCELA-POR-ZALOZENIA":
    "Energy price in scenario A: Poland 0.20 PLN/kWh (a parameter, not a tariff), Norway EUR 0.037/kWh (fixed Norgespris price, no grid fees), the Netherlands EUR 0.24–0.28/kWh (household price). Scenario B: PV energy EUR 0.04–0.09/kWh, yield 900 kWh/kWp a year. The range is the best and the worst combination of assumptions. Exchange rates were not checked.",
  "UI-PERSP-AIRCELA-POR-WNIOSEK":
    "With continuous operation the energy price decides: Norway is borderline, the Netherlands and Poland are out. On own PV the machine decides, because it runs several times fewer hours and its cost is spread over several times fewer litres, so it does not pay in any of the three countries. The remark that it pays in the Netherlands and Norway, and on own PV obviously too, is only partly confirmed.",
  "UI-PERSP-POR-OPIS-TABELI": "Cost of a litre of petrol from the machine in the two scenarios, in euro (zloty in brackets), next to the pump price.",
  "UI-PERSP-POR-KOL-RYNEK": "Scenario and market",
  "UI-PERSP-POR-KOL-LITRY": "Litres a year",
  "UI-PERSP-POR-KOL-URZADZENIE": "Machine per litre",
  "UI-PERSP-POR-KOL-ENERGIA": "Energy per litre",
  "UI-PERSP-POR-KOL-RAZEM": "Total per litre",
  "UI-PERSP-POR-KOL-STACJA": "Pump, per litre",
  "UI-PERSP-POR-KOL-WNIOSEK": "Verdict",
  "UI-PERSP-POR-SC-CIAGLY": "A. Continuous operation",
  "UI-PERSP-POR-SC-PV": "B. Own PV",
  "UI-PERSP-POR-KRAJ-PL": "Poland",
  "UI-PERSP-POR-KRAJ-NO": "Norway",
  "UI-PERSP-POR-KRAJ-NL": "Netherlands",
  "UI-PERSP-POR-OCENA-TAK": "pays off",
  "UI-PERSP-POR-OCENA-GRANICA": "borderline",
  "UI-PERSP-POR-OCENA-NIE": "does not pay",
  "UI-PERSP-POR-LITRY-JEDEN": "about {l}",
  "UI-PERSP-POR-LITRY-ZAKRES": "{min}–{max}",
  "UI-PERSP-POR-CENA-JEDNA": "€{eur} ({zl} PLN)",
  "UI-PERSP-POR-CENA-ZAKRES": "€{eurMin}–{eurMax} ({zlMin}–{zlMax} PLN)",
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
    "Технически осуществимо, потому что каждый этап — известная технология. Окупаемость зависит от цены электричества, цены топлива и от того, как часто работает машина: по этому расчёту не окупается в Польше и на собственных панелях в Норвегии и Нидерландах; в Норвегии на грани только при фиксированной цене электричества от ГЭС круглые сутки.",
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
  "UI-PERSP-AIRCELA-RYNKI-PV-1":
    "Собственные панели вместо сети: электричество от панелей стоит около 0,04–0,09 €/кВт·ч (диапазон для наземных станций в Германии, как приближение), но машина работает только при солнце. При панелях в 2–4 раза мощнее машины она работает около 18–33% времени в году (выработка около 900 кВт·ч/кВт, зимой в Норвегии почти ноль).",
  "UI-PERSP-AIRCELA-RYNKI-PV-2":
    "Тогда преобладает стоимость устройства, а не энергии: само устройство (15–20 тыс. USD, 10 лет) — 3,0–7,2 €/л, энергия 0,9–3,0 €/л, вместе 4,0–9,8 €/л, против 2,31 €/л (Нидерланды) и 2,42 €/л (Норвегия) на заправке. Даже при бесплатной энергии само устройство стоит дороже литра на заправке.",
  "UI-PERSP-AIRCELA-RYNKI-PV-3":
    "Окупилось бы лишь при цене устройства около 1–6 тыс. USD (в несколько раз и более дешевле) или при работе круглые сутки весь год на дешёвом электричестве, как в Норвегии при фиксированной цене от ГЭС.",
  "UI-PERSP-AIRCELA-RYNKI-WNIOSEK":
    "Если машина работает лишь часть суток, стоимость устройства на литр растёт в разы. Окупаемость зависит от дешёвого электричества круглые сутки, а не только от цены энергии.",
  "UI-PERSP-AIRCELA-OFFGRID-1":
    "Электромобиль расходует в 7–10 раз меньше энергии на километр, чем машина на таком бензине, а цепочка электричество → бензин → генератор → электричество возвращает лишь 7–13% энергии.",
  "UI-PERSP-AIRCELA-OFFGRID-2":
    "Для обычной системы off-grid дешевле добавить панелей и купить топливо для генератора. Э-топливо имеет смысл там, где топливо нельзя заменить электричеством, и там, где электричество очень дёшево.",
  "UI-PERSP-H-POROWNANIE": "Оба сценария рядом",
  "UI-PERSP-AIRCELA-POR-WSTEP":
    "Одна и та же машина (1 галлон в сутки, 15–20 тыс. USD, срок службы 10 лет) при двух способах питания. A. Непрерывная работа от сети или по фиксированной цене (90% времени в году). B. Только своя ФЭС: машина работает лишь при солнце, панели в 2–4 раза мощнее машины. Всё в евро, в скобках в злотых по 4,0 зл/€.",
  "UI-PERSP-AIRCELA-POR-ZALOZENIA":
    "Цена энергии в сценарии A: Польша 0,20 зл/кВт·ч (параметр, не тариф), Норвегия 0,037 €/кВт·ч (фиксированная цена Norgespris, без сетевых платежей), Нидерланды 0,24–0,28 €/кВт·ч (бытовая цена). Сценарий B: энергия ФЭС 0,04–0,09 €/кВт·ч, выработка 900 кВт·ч/кВт·пик в год. Диапазон — лучшее и худшее сочетание допущений. Курсы валют не проверялись.",
  "UI-PERSP-AIRCELA-POR-WNIOSEK":
    "При непрерывной работе решает цена энергии: Норвегия на грани, Нидерланды и Польша не подходят. На своей ФЭС решает сама машина: она работает в несколько раз меньше часов, и её стоимость делится на в несколько раз меньше литров, поэтому не окупается ни в одной из трёх стран. Замечание, что в Нидерландах и Норвегии это окупается, а на своей ФЭС тем более, подтверждается лишь частично.",
  "UI-PERSP-POR-OPIS-TABELI": "Стоимость литра бензина из машины в двух сценариях, в евро (в скобках в злотых), рядом с ценой на заправке.",
  "UI-PERSP-POR-KOL-RYNEK": "Сценарий и рынок",
  "UI-PERSP-POR-KOL-LITRY": "Литров в год",
  "UI-PERSP-POR-KOL-URZADZENIE": "Машина на литр",
  "UI-PERSP-POR-KOL-ENERGIA": "Энергия на литр",
  "UI-PERSP-POR-KOL-RAZEM": "Итого на литр",
  "UI-PERSP-POR-KOL-STACJA": "Заправка, литр",
  "UI-PERSP-POR-KOL-WNIOSEK": "Вывод",
  "UI-PERSP-POR-SC-CIAGLY": "A. Непрерывная работа",
  "UI-PERSP-POR-SC-PV": "B. Своя ФЭС",
  "UI-PERSP-POR-KRAJ-PL": "Польша",
  "UI-PERSP-POR-KRAJ-NO": "Норвегия",
  "UI-PERSP-POR-KRAJ-NL": "Нидерланды",
  "UI-PERSP-POR-OCENA-TAK": "окупается",
  "UI-PERSP-POR-OCENA-GRANICA": "на грани",
  "UI-PERSP-POR-OCENA-NIE": "не окупается",
  "UI-PERSP-POR-LITRY-JEDEN": "около {l}",
  "UI-PERSP-POR-LITRY-ZAKRES": "{min}–{max}",
  "UI-PERSP-POR-CENA-JEDNA": "{eur} € ({zl} зл)",
  "UI-PERSP-POR-CENA-ZAKRES": "{eurMin}–{eurMax} € ({zlMin}–{zlMax} зл)",
  "UI-PERSP-AIRCELA-ZRODLA-OPIS":
    "Заявления производителя взяты из СМИ, а не из измерений. Цены на топливо: недельный бюллетень ЕС; цены на электричество и данные об энергии улавливания CO₂ и электролизёров — из кратких выдержек поиска, их нужно проверить по первоисточникам. Полный расчёт и пробелы: docs/perspektywy-projektow.md.",
}
