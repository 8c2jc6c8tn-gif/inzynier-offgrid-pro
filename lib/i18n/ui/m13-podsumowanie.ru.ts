// Russian texts of ./m13-podsumowanie.ts — the same keys as `pl` (a missing or an extra key is a compile error).
import type { pl } from "./m13-podsumowanie"

export const ru: Record<keyof typeof pl, string> = {
  "UI-M13-POD-TYTUL": "Сводка и экспорт измерений",
  "UI-M13-POD-OPIS": "Мин., макс., среднее и энергия из мощности для каждой серии в выбранном диапазоне, а также экспорт выборок в CSV. Модуль 13.",
  "UI-M13-POD-BRAK-ZRODEL": "Нет источников данных",
  "UI-M13-POD-BRAK-ZRODEL-OPIS": "Сначала добавьте источник на экране «Источники данных телеметрии» и соберите или импортируйте измерения.",
  "UI-M13-POD-ZAKRES-TYTUL": "Источник и диапазон",
  "UI-M13-POD-ZRODLO": "Источник данных",
  "UI-M13-POD-OKNO": "Диапазон",
  "UI-M13-POD-OKNO-24": "Последние 24 часа",
  "UI-M13-POD-OKNO-168": "Последние 7 дней",
  "UI-M13-POD-OKNO-720": "Последние 30 дней",
  "UI-M13-POD-MAX-PRZERWA": "Наибольший пропуск, учитываемый в энергии",
  "UI-M13-POD-BRAK-PROBEK": "Нет выборок в этом диапазоне",
  "UI-M13-POD-BRAK-PROBEK-OPIS": "В источнике нет сохранённых измерений за выбранный диапазон.",
  "UI-M13-POD-SERIE": "Серии измерений",
  "UI-M13-POD-STATY": "Мин. {min}, макс. {max}, среднее {srednia} {jednostka}",
  "UI-M13-POD-PROBKI": "Корректных выборок: {n}, пропущено (отсутствуют, вне диапазона): {pominiete}",
  "UI-M13-POD-ENERGIA": "Энергия из мощности: {kwh} кВт·ч",
  "UI-M13-POD-ENERGIA-LUKI": "Пропущено пауз длиннее лимита: {n}",
  "UI-M13-POD-ENERGIA-BEZ-LIMITU": "Укажите наибольший пропуск, чтобы посчитать энергию — без него приложение не гадает, означает ли отсутствие выборок простой или сбой.",
  "UI-M13-POD-BRAK-WARTOSCI": "нет корректных выборок",
  "UI-M13-POD-EKSPORT-TYTUL": "Экспорт CSV",
  "UI-M13-POD-EKSPORT-OPIS": "Файл содержит все выборки диапазона (время ISO, канал, величина, значение в базовой единице, качество). Пропуски пустые, не ноль.",
  "UI-M13-POD-EKSPORT-PRZYCISK": "Скачать CSV",
}
