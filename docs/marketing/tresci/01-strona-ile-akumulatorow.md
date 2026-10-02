---
adres: /kalkulator/ile-akumulatorow-do-domu-off-grid
title: Ile akumulatorów do domu off-grid? Kalkulator i wzór
meta_description: Policz pojemność magazynu energii do domu bez sieci: dni autonomii, sprawność falownika i głębokość rozładowania. Wzór, przykład i darmowy kalkulator.
fraza_glowna: ile akumulatorów do domu off grid
frazy_dodatkowe: magazyn energii do domu kalkulator; pojemność magazynu energii jak obliczyć; ile kwh magazyn energii do domu; ile akumulatorów do falownika 5kw
kalkulator_w_apce: baterie/dobor-pojemnosci (wzór 1:1 z kodu, wersja kalkulatora 1.0.0)
status: SZKIC — sprawdzić liczby w apce, akceptacja mentora
---

# Ile akumulatorów do domu off-grid?

**Krótka odpowiedź:** pojemność użyteczna = dobowe zużycie × dni autonomii ÷ (sprawność falownika × głębokość rozładowania). Resztę dzieli się przez pojemność jednego modułu.

[Tu osadzony mini‑kalkulator: pola 1–4 niżej, wynik w kWh i w liczbie modułów, werdykt 🟢/🟡/🔴.]

## Wzór

```
C_użyteczna = (E_dobowe × d_autonomii) / (η_falownika × DoD)
```

- **E_dobowe**: ile kWh zużywa dom w ciągu doby. Najlepiej z pomiarów lub z listy urządzeń, a nie z rachunku, bo rachunek nie pokazuje, co działa w nocy ani zimą.
- **d_autonomii**: ile dób dom ma przeżyć bez słońca i bez agregatu. Apka podpowiada 1, 2, 3, 5 lub 7 dni.
- **η_falownika**: sprawność falownika. Apka podpowiada 95% jako punkt startu, ale to wartość do zmiany na tę z karty katalogowej Twojego falownika.
- **DoD**: ile pojemności wolno wyjąć. Dla LiFePO4 typowo 80–90%, ale to podpowiedź, nie limit. Sprawdź dokumentację producenta ogniw.

## Przykład (liczby z apki)

Dom zużywa **12 kWh na dobę**, ma mieć **3 dni autonomii**, falownik **95%**, DoD **80%**:

```
C = (12 × 3) / (0,95 × 0,80) = 36 / 0,76 ≈ 47,4 kWh
```

Zwróć uwagę: wiele prostych kalkulatorów pomija sprawność falownika i dochodzi do 45 kWh (36 / 0,80). Ta różnica ~2,4 kWh to realny magazyn, którego zabraknie w trzeci dzień.

## Ile to modułów

Jeśli moduł ma pojemność 5,12 kWh (typowy moduł 51,2 V / 100 Ah; sprawdź swój), to 47,4 / 5,12 ≈ 9,3, czyli **10 modułów**. Zawsze zaokrąglasz w górę.

## Czego ten wynik nie uwzględnia

To jest ważniejsze niż sam wzór:
1. **Starzenia.** Kalkulator wprost zaznacza, że bufor na utratę pojemności z czasem nie jest doliczony. Po latach pojemność spada.
2. **Zimy.** Autonomia „3 dni” w lipcu a w styczniu to dwie różne rzeczy: zużycie rośnie, produkcja z paneli spada. Zobacz [Magazyn energii na zimę].
3. **Temperatury.** Ładowanie LiFePO4 w mrozie wymaga ostrożności (zobacz [Ładowanie LiFePO4 w mrozie]).
4. **Prądów.** Pojemność w kWh nie mówi, czy magazyn uciągnie moc szczytową domu (rozruch pompy, czajnik, kuchnia indukcyjna).
5. **Kabli i zabezpieczeń.** Duży magazyn wymaga właściwego przekroju i bezpiecznika po stronie DC (zobacz [Przekrój kabla do akumulatora]).

> Prace przy instalacji akumulatorów i falownika wykonuje osoba z uprawnieniami. Ten kalkulator służy do planowania, nie zastępuje projektu.

## Dalej w apce

Pełna wersja zamienia ten wynik w komplet: zapotrzebowanie z listy urządzeń, zimę miesiąc po miesiącu, dobór paneli, kabli, bezpieczników i raport do wydruku. [Zapisz się na listę oczekujących → wyślemy Ci ten wynik i checklistę „10 błędów w off-grid”.]

*Sprawdził: [mentor] · Zaktualizowano: [data] · Źródło wzoru: kalkulator „Dobór pojemności baterii” w Inżynier Offgrid Pro.*
