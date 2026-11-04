/**
 * perspektywy — text of the "Outlook of projects" section (`app/perspektywy`, `docs/perspektywy-projektow.md`):
 * the index and the articles about technologies and patents seen as "the future of energy", each with an
 * energy and cost calculation. Every number here comes from `docs/perspektywy-projektow.md` (marked there as
 * source / manufacturer claim / our calculation / assumption); change the numbers there first.
 */
// English: ./perspektywy.en.ts, Russian: ./perspektywy.ru.ts (one language per file, so each is its own lazy chunk — lib/i18n/rejestr-slownikow.ts).
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
