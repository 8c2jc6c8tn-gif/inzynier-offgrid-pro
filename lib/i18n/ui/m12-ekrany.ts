/**
 * M12 — screens built on 30.09.2026 (`UI-M12-<screen>-…`). Separate from `m12-mobilny.ts` (older M12
 * screens migrated by another session) so both can change without touching the same file.
 */
export const pl = {
  "UI-M12-X-H": "{x} h",
  "UI-M12-UZUPELNIJ": "Wypełnij wszystkie pola, żeby zobaczyć wynik.",
  "UI-M12-BLAD-DANYCH": "Nie da się policzyć — sprawdź wpisane dane",
  "UI-M12-AS-TYTUL": "Czas pracy na akumulatorze samochodowym",
  "UI-M12-AS-OPIS":
    "Ile popracują urządzenia na akumulatorze z auta — i kiedy przestać, żeby jeszcze odpalić silnik. Moduł 12, Ekran 16.",
  "UI-M12-AS-TYP": "Typ akumulatora",
  "UI-M12-AS-TYP-ROZRUCHOWY": "Rozruchowy (zwykły samochodowy)",
  "UI-M12-AS-TYP-AGM": "AGM",
  "UI-M12-AS-TYP-KWASOWY": "Kwasowy głębokiego rozładowania (trakcyjny, solarny)",
  "UI-M12-AS-POJEMNOSC": "Pojemność znamionowa",
  "UI-M12-AS-NAPIECIE": "Napięcie akumulatora",
  "UI-M12-AS-UZYTECZNA": "Część pojemności, którą wolno zużyć",
  "UI-M12-AS-MOC": "Łączna moc urządzeń",
  "UI-M12-AS-PLANOWANY": "Planowany czas pracy (opcjonalnie)",
  "UI-M12-AS-W-STOP": "Nie planuj tak długiej pracy na akumulatorze rozruchowym",
  "UI-M12-AS-W-UWAGA": "Wynik z zastrzeżeniem — przeczytaj ostrzeżenie",
  "UI-M12-AS-W-OK": "Czas pracy do granicy użytecznej pojemności",
  "UI-M12-AS-SZCZEGOLY": "Prąd: {prad} A · do wykorzystania: {ah} Ah ({wh} Wh)",
}

export const en: Record<keyof typeof pl, string> = {
  "UI-M12-X-H": "{x} h",
  "UI-M12-UZUPELNIJ": "Fill in all fields to see the result.",
  "UI-M12-BLAD-DANYCH": "Cannot calculate — check the data you entered",
  "UI-M12-AS-TYTUL": "Runtime on a car battery",
  "UI-M12-AS-OPIS":
    "How long devices will run on the car battery — and when to stop so you can still start the engine. Module 12, Screen 16.",
  "UI-M12-AS-TYP": "Battery type",
  "UI-M12-AS-TYP-ROZRUCHOWY": "Starter (ordinary car battery)",
  "UI-M12-AS-TYP-AGM": "AGM",
  "UI-M12-AS-TYP-KWASOWY": "Deep-cycle flooded (traction, solar)",
  "UI-M12-AS-POJEMNOSC": "Rated capacity",
  "UI-M12-AS-NAPIECIE": "Battery voltage",
  "UI-M12-AS-UZYTECZNA": "Share of capacity you may use",
  "UI-M12-AS-MOC": "Total power of devices",
  "UI-M12-AS-PLANOWANY": "Planned runtime (optional)",
  "UI-M12-AS-W-STOP": "Don't plan such a long runtime on a starter battery",
  "UI-M12-AS-W-UWAGA": "Result with a caveat — read the warning",
  "UI-M12-AS-W-OK": "Runtime to the usable capacity limit",
  "UI-M12-AS-SZCZEGOLY": "Current: {prad} A · usable: {ah} Ah ({wh} Wh)",
}

export const ru: Record<keyof typeof pl, string> = {
  "UI-M12-X-H": "{x} ч",
  "UI-M12-UZUPELNIJ": "Заполните все поля, чтобы увидеть результат.",
  "UI-M12-BLAD-DANYCH": "Невозможно рассчитать — проверьте введённые данные",
  "UI-M12-AS-TYTUL": "Время работы от автомобильного аккумулятора",
  "UI-M12-AS-OPIS":
    "Сколько проработают устройства от аккумулятора машины — и когда остановиться, чтобы ещё завести двигатель. Модуль 12, экран 16.",
  "UI-M12-AS-TYP": "Тип аккумулятора",
  "UI-M12-AS-TYP-ROZRUCHOWY": "Стартерный (обычный автомобильный)",
  "UI-M12-AS-TYP-AGM": "AGM",
  "UI-M12-AS-TYP-KWASOWY": "Кислотный глубокого разряда (тяговый, солнечный)",
  "UI-M12-AS-POJEMNOSC": "Номинальная ёмкость",
  "UI-M12-AS-NAPIECIE": "Напряжение аккумулятора",
  "UI-M12-AS-UZYTECZNA": "Часть ёмкости, которую можно израсходовать",
  "UI-M12-AS-MOC": "Суммарная мощность устройств",
  "UI-M12-AS-PLANOWANY": "Планируемое время работы (необязательно)",
  "UI-M12-AS-W-STOP": "Не планируйте такую долгую работу от стартерного аккумулятора",
  "UI-M12-AS-W-UWAGA": "Результат с оговоркой — прочтите предупреждение",
  "UI-M12-AS-W-OK": "Время работы до границы полезной ёмкости",
  "UI-M12-AS-SZCZEGOLY": "Ток: {prad} А · можно использовать: {ah} А·ч ({wh} Вт·ч)",
}
