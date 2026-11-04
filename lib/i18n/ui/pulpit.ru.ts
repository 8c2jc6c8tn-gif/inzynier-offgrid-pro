// Russian texts of ./pulpit.ts — the same keys as `pl` (a missing or an extra key is a compile error).
import type { pl } from "./pulpit"

type Klucz = keyof typeof pl

export const ru: Record<Klucz, string> = {
  "UI-PULPIT-PRESETY-TYTUL": "Что вы хотите сделать сейчас?",
  "UI-PULPIT-PRESETY-OPIS":
    "Отметьте одну или несколько категорий и примените — на панели останутся только нужные модули в подходящем порядке. Несколько категорий = все их модули вместе. Плитки «Дом – сеть» и «Фирма – сеть» остаются всегда. Всё можно изменить ниже.",
  "UI-PULPIT-PRESETY-ZASTOSUJ": "Применить к панели",
  "UI-PULPIT-PRESETY-ZASTOSOWANO": "Панель настроена. Скрытые модули вернёт кнопка «Показать».",
  "UI-PULPIT-PRESET-CALY-SYSTEM": "Вся автономная система",
  "UI-PULPIT-PRESET-CALY-SYSTEM-OPIS": "Все модули в порядке по умолчанию.",
  "UI-PULPIT-PRESET-PV": "Фотоэлектрическая установка",
  "UI-PULPIT-PRESET-PV-OPIS": "Панели и всё вокруг них; скрывает отопление, безопасность, электронику ESP32, сборку батарей, мобильный режим и Live.",
  "UI-PULPIT-PRESET-MAGAZYN": "Накопитель энергии / батареи",
  "UI-PULPIT-PRESET-MAGAZYN-OPIS": "Накопитель со сборкой батарей; скрывает отопление, безопасность, электронику ESP32, ИИ, мобильный режим и Live.",
  "UI-PULPIT-PRESET-ZAPOTRZEBOWANIE": "Потребность в энергии",
  "UI-PULPIT-PRESET-ZAPOTRZEBOWANIE-OPIS": "Баланс потребления с панелями, накопителем и быстрым калькулятором; остальное скрывает.",
  "UI-PULPIT-PRESET-OGRZEWANIE": "Отопление / тепловой насос",
  "UI-PULPIT-PRESET-OGRZEWANIE-OPIS": "Отопление с балансом, стресс-тестом и ИИ; остальное скрывает.",
  "UI-PULPIT-PRESET-ELEKTRYKA": "Электроустановка",
  "UI-PULPIT-PRESET-ELEKTRYKA-OPIS": "Кабели и защита с панелями, накопителем и безопасностью; остальное скрывает.",
  "UI-PULPIT-PRESET-ANALIZA": "Анализ / стресс-тест",
  "UI-PULPIT-PRESET-ANALIZA-OPIS": "Стресс-тест с данными, которые его питают, и ИИ; скрывает кабели, безопасность, электронику ESP32, сборку батарей, мобильный режим и Live.",
  "UI-PULPIT-PRESET-AUTOMATYKA": "Автоматика и ИИ",
  "UI-PULPIT-PRESET-AUTOMATYKA-OPIS": "Электроника ESP32, ИИ, режим Live и безопасность; остальное скрывает.",
  "UI-PULPIT-PRESET-MIKRO": "Кемпер, дачный домик или гараж",
  "UI-PULPIT-PRESET-MIKRO-OPIS": "Местоположение, мобильный режим, панели, аккумулятор, проводка и безопасность; скрывает отопление здания, стресс-тест, ESP32, ИИ, монтаж батарей и Live.",
  "UI-PULPIT-PRESET-SIEC": "Я подключён к сети",
  "UI-PULPIT-PRESET-SIEC-OPIS":
    "Сначала «Дом – сеть» и «Фирма – сеть», затем модули для перехода на автономное питание; скрывает кабели, электронику ESP32, ИИ, сборку батарей, мобильный режим и Live.",
}
