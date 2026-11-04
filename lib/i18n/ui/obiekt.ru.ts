// Russian texts of ./obiekt.ts — the same keys as `pl` (a missing or an extra key is a compile error).
import type { pl } from "./obiekt"

type Klucz = keyof typeof pl

export const ru: Record<Klucz, string> = {
  "UI-OBIEKT-TYTUL": "Тип объекта",
  "UI-OBIEKT-OPIS": "Выберите, что вы питаете. Кемпер, дачный домик (ROD) и гараж — микроустановки: приложение считает их по списку потребителей и месяцам использования, а не по теплопотерям здания. Без выбора приложение работает как раньше.",
  "UI-OBIEKT-RODZAJ": "Тип объекта",
  "UI-OBIEKT-WYBIERZ": "— не выбрано —",
  "UI-OBIEKT-R-BUDYNEK": "Здание (дом на весь год)",
  "UI-OBIEKT-R-KAMPER": "Кемпер или прицеп",
  "UI-OBIEKT-R-ALTANA-ROD": "Беседка или дачный домик (ROD, летний домик)",
  "UI-OBIEKT-R-GARAZ": "Гараж или будка",
  "UI-OBIEKT-MIESIACE": "Месяцы, когда объект используется",
  "UI-OBIEKT-MIKRO-NOTA": "Потребление микроустановки я считаю по вашему списку потребителей и отмеченным месяцам. Неотмеченные месяцы считаются нулевым потреблением.",
  "UI-OBIEKT-LINK-ODBIORNIKI": "Заполнить список потребителей →",
  "UI-OBIEKT-BRAK-MIESIECY": "Отметьте хотя бы один месяц использования, чтобы посчитать потребление.",
  "UI-OBIEKT-NAPIECIE": "Напряжение системы (необязательно)",
  "UI-OBIEKT-NAPIECIE-PODPOWIEDZ": "Из профиля объекта: напряжение системы {v} В.",
  "UI-OBIEKT-NAPIECIE-UZYJ": "Ввести {v} В",
  "UI-OBIEKT-UKRYTO-EKRANY": "Часть экранов о здании скрыта, потому что тип объекта — кемпер. Их по-прежнему можно открыть по ссылкам на других экранах.",
  "UI-OBIEKT-UKRYTO-POLA": "Поля о здании скрыты, потому что тип объекта — кемпер.",
  "UI-OBIEKT-UKRYTO-USTAWIENIA": "Тип объекта можно изменить в Настройках.",
}
