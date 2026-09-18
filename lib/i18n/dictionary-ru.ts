/**
 * Słownik tłumaczeń — rosyjski. Klucze i placeholdery `{nazwa}` muszą dokładnie odpowiadać
 * `dictionary-pl.ts` — `satisfies Record<KluczTlumaczenia, string>` niżej wymusza to typem
 * (brakujący/dodatkowy klucz = błąd kompilacji, nie cichy fallback, docs/standards/17-i18n.md 17.1).
 */
import type { KluczTlumaczenia } from "./dictionary-pl"

export const dictionaryRu = {
  "WARTOSC-NIEDODATNIA": 'Значение поля "{label}" должно быть больше нуля.',
  "SPRAWNOSC-POZA-ZAKRESEM": "КПД должен быть числом в диапазоне (0, 1].",
  "SPRAWNOSC-NISKA": "Указанный КПД необычно низкий — проверьте, не перепутали ли вы единицы измерения.",
  "MOC-NIETYPOWO-WYSOKA": "Это необычно высокое значение мощности — проверьте, не перепутали ли вы единицы измерения.",
  "SPRAWNOSC-DOMYSLNA": "КПД системы принят равным {efficiency} (значение по умолчанию, не измерено).",
  "WARTOSC-POZA-ZAKRESEM": 'Значение поля "{label}" должно быть в диапазоне {min}–{max}.',
  "POZYCJA-NIEDODATNIA": 'Выбранный элемент "{label}" должен иметь мощность больше нуля.',
  "BRAK-ZAZNACZONYCH": "Не выбран ни один критический потребитель.",
  "POZYCJA-WARTOSC-DOMYSLNA": '"{label}" принято со значением мощности по умолчанию {value} Вт (не редактировалось).',
  "COP-POZA-ZAKRESEM": "COP должен быть в диапазоне {min}–{max} для типичного теплового насоса.",
  "MOC-CIEPLNA-NIETYPOWO-WYSOKA":
    "Это необычно высокое значение тепловой мощности — проверьте, не перепутали ли вы единицы измерения (кВт, а не Вт).",
  "COP-ZALEZY-OD-TEMPERATURY":
    "COP зависит от температуры наружного воздуха — указанное значение относится только к текущим " +
    "условиям и не остаётся постоянным в течение всего сезона (см. кривую COP производителя).",
  "DANE-KLIMATYCZNE-TRYB-OFFLINE":
    "Данные об инсоляции/климатической зоне в итоге потребуют интеграции с PVGIS/PVWatts (онлайн) — " +
    "на этом этапе доступен только офлайн-режим с ручным вводом минимальной температуры.",
  "LICZBA-DOMOWNIKOW-POZA-ZAKRESEM": "Количество членов домохозяйства должно быть в диапазоне {min}–{max}.",
  "CWU-ZAKRES-ORIENTACYJNY":
    "Диапазон {min}–{max} л ГВС на человека в сутки — ориентировочное значение из источника, не измеренное.",
  "ZAPOTRZEBOWANIE-UJEMNE": "Суточная потребность не может быть отрицательной.",
  "SPRAWNOSC-PROCENT-POZA-ZAKRESEM": "КПД инвертора должен быть в диапазоне 0–100%.",
  "DOD-POZA-ZAKRESEM": "DoD (глубина разряда) должна быть в диапазоне 0–100%.",
  "WPLYW-NA-MAGAZYN":
    "При {dni} днях автономии и введённых параметрах накопителю требуется примерно {pojemnosc} кВт·ч " +
    "полезной ёмкости (оценка — полный расчёт: Модуль 4, Экран 1).",
  "COS-FI-POZA-ZAKRESEM": "Коэффициент мощности (cos φ) должен быть в диапазоне 0–1.",
  "MOC-POZORNA-INFO":
    "Ватты на шильдике — это не вся картина: инвертор реально несёт нагрузку {va} ВА, а не {w} Вт.",
  "SZACUNEK-MAGAZYNU-WYMAGA-DANYCH":
    "Оценка влияния на размер накопителя требует ввода суточной потребности, КПД инвертора и DoD.",
} satisfies Record<KluczTlumaczenia, string>
