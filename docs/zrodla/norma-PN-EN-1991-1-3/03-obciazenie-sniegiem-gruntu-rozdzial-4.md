# Rozdział 4 — Obciążenie śniegiem gruntu (str. 13)

## 4.1 Wartości charakterystyczne

1. Wartość charakterystyczną obciążenia śniegiem gruntu (`s_k`) należy wyznaczać zgodnie z
   EN 1990:2002, 4.1.2 (7)P. Wartości charakterystyczne, które należy stosować, są podane w
   załączniku krajowym (dla Polski: `zalacznik-krajowy-NA-NB.md`, Tablica NB.1).

   UWAGA 1: Załącznik krajowy może dodatkowo dopuścić uzgodnienie między inwestorem a
   odpowiednimi władzami innej wartości charakterystycznej niż podana, aby uwzględnić w
   indywidualnym projekcie wyjątkowe warunki miejscowe.

   UWAGA 2: W załączniku C podano europejską mapę obciążenia śniegiem gruntu, uzyskaną w wyniku
   prac zleconych DGIII/D3. Załącznik krajowy może odwołać się do tej mapy, aby usunąć lub
   zmniejszyć niezgodności występujące na granicach między państwami.

2. W specjalnych przypadkach, gdy potrzebne są bardziej szczegółowe dane, wartość charakterystyczna
   obciążenia śniegiem gruntu (`s_k`) może być uściślona za pomocą odpowiedniej analizy
   statystycznej wieloletnich danych pomiarowych z terenu dobrze osłoniętego od wiatru i
   położonego w pobliżu rozpatrywanego miejsca.

   UWAGA 1: W załączniku krajowym mogą być podane dodatkowe wskazówki na ten temat.

   UWAGA 2: Ponieważ zwykle występuje znaczna zmienność zmierzonych maksymalnych wartości
   zimowych, dane z okresu krótszego niż 20 lat w ogóle nie powinny być brane pod uwagę.

3. W szczególnych warunkach lokalizacyjnych, tam gdzie wyniki pomiarów obciążenia śniegiem
   wykazują pojedyncze wyjątkowe wartości, które nie mogą być opracowane zwykłymi metodami
   statystycznymi, wartości charakterystyczne należy wyznaczać nie biorąc pod uwagę tych wartości
   wyjątkowych. Mogą one być wzięte pod uwagę zgodnie z 4.3.

## 4.2 Inne wartości reprezentatywne

Zgodnie z EN 1990:2002, 4.1.3 inne wartości reprezentatywne obciążenia śniegiem dachu są
następujące:

- wartość kombinacyjna: `ψ0 s`
- wartość częsta: `ψ1 s`
- wartość prawie stała: `ψ2 s`

UWAGA: Wartości `ψ` mogą być ustalone w załączniku krajowym do EN 1990:2002. Zalecane wartości
współczynników `ψ0`, `ψ1` i `ψ2` dla budynków zależą od ich lokalizacji i powinny być brane z
EN 1990:2002, tablica A1.1 lub z poniższej Tablicy 4.1. W obu tablicach informacja odnosząca się
do obciążenia śniegiem jest identyczna.

### Tablica 4.1 — Zalecane wartości współczynników ψ₀, ψ₁ i ψ₂ dla różnych lokalizacji budynków

| Region | ψ₀ | ψ₁ | ψ₂ |
|---|---|---|---|
| Finlandia, Islandia, Norwegia, Szwecja | 0,70 | 0,50 | 0,20 |
| Pozostałe państwa członkowskie CEN, dla miejsc położonych na wysokości H > 1000 m powyżej poziomu morza | 0,70 | 0,50 | 0,20 |
| Pozostałe państwa członkowskie CEN, dla miejsc położonych na wysokości H ≤ 1000 m powyżej poziomu morza | 0,50 | 0,20 | 0,00 |

## 4.3 Sposób wyznaczania wyjątkowego obciążenia śniegiem gruntu

Dla lokalizacji, gdzie może wystąpić wyjątkowe obciążenie śniegiem gruntu, może być ono
wyznaczone z wzoru:

```
s_Ad = C_esl × s_k    (4.1)
```

gdzie:
- `s_Ad` — wartość obliczeniowa wyjątkowego obciążenia śniegiem gruntu dla danej lokalizacji;
- `C_esl` — współczynnik wyjątkowego obciążenia śniegiem;
- `s_k` — wartość charakterystyczna obciążenia śniegiem gruntu dla danej lokalizacji.

UWAGA: Współczynnik `C_esl` może być ustalony w załączniku krajowym. Zalecaną wartością `C_esl`
jest 2,0 (patrz też 2(3)).

**Polska (NB1.4): ten wzór (4.1) NIE ma zastosowania w Polskiej Normie** — wyjątkowe obciążenie
śniegiem gruntu nie jest tu rozpatrywane, tylko wyjątkowe zaspy śnieżne (osobny mechanizm,
załącznik B) są traktowane jako oddziaływanie wyjątkowe na całym terytorium kraju (NB1.5).
