// Russian texts of ./komponenty-wzorce.ts — the same keys as `pl` (a missing or an extra key is a compile error).
import type { pl } from "./komponenty-wzorce"

type Klucz = keyof typeof pl

export const ru: Record<Klucz, string> = {
  "UI-EKRCHECHE-AGM-VRLA-SZCZELNY": "AGM (VRLA, герметичный)",
  "UI-EKRCHECHE-KWASOWY-ZALEWOWY": "Свинцово-кислотный (заливной)",
  "UI-EKRCHECHE-WYBIERZ-TYP-AKUMULATORA": "Выберите тип аккумулятора, чтобы увидеть контрольный список.",
  "UI-EKRCHECHE-TYP-AKUMULATORA": "Тип аккумулятора",
  "UI-EKRCHECHE-POTWIERDZONO": "Подтверждено {potwierdzone} / {razem}",
  "UI-EKRCHECHE-POTWIERDZONO-POZYCJI": "Подтверждено {potwierdzone} / {razem} пунктов",
  "UI-EKRKABMALINS-SWOBODNIE-SCIANIE-POWIETRZU": "Свободно (на стене, в воздухе)",
  "UI-EKRKABMALINS-PESZLU-RURZE-INSTALACYJNEJ": "В гофротрубе / монтажной трубе",
  "UI-EKRKABMALINS-ZIEMI": "В земле",
  "UI-EKRKABMALINS-WIAZCE-INNYMI-KABLAMI": "В пучке с другими кабелями",
  "UI-EKRKABMALINS-WYPELNIJ-PRAD-NAPIECIE": "Заполните ток, напряжение, длину, температуру и допустимое падение.",
  "UI-EKRKABMALINS-BEZPIECZNIK": "{przekrojMm2} мм² · предохранитель ≥ {bezpiecznikMinA} А",
  "UI-EKRKABMALINS-OBCIAZALNOSC-SPADEK-NAPIECIA":
    "Допустимый ток {obciazalnoscA} А · падение напряжения {spadekNapieciaPct}%",
  "UI-EKRKABMALINS-PRAD-OBCIAZENIA": "Ток нагрузки",
  "UI-EKRKABMALINS-NAPIECIE-INSTALACJI": "Напряжение установки",
  "UI-EKRKABMALINS-DLUGOSC-TRASY-JEDNA": "Длина трассы (в одну сторону)",
  "UI-EKRKABMALINS-SPOSOB-ULOZENIA": "Способ прокладки",
  "UI-EKRKABMALINS-LICZBA-KABLI-WIAZCE": "Количество кабелей в пучке",
  "UI-EKRKABMALINS-TEMPERATURA-OTOCZENIA": "Температура окружающей среды",
  "UI-EKRKABMALINS-DOPUSZCZALNY-SPADEK-NAPIECIA": "Допустимое падение напряжения",
  "UI-EKRKABMALINS-SPRAWDZ-MOJ-PRZEKROJ": "Проверить моё сечение вместо автоматического выбора",
  "UI-EKRKABMALINS-MOJ-PRZEKROJ": "Моё сечение",
  "UI-EKRKABMALINS-POLICZYC-SPRAWDZ-WPISANE": "Невозможно рассчитать — проверьте введённые данные",
  "UI-EKRKABMALINS-POZA-ZAKRESEM-TABLIC": "Вне диапазона таблиц",
  "UI-EKRKABMALINS-PRZEKROJ-PONIZEJ-MINIMUM": "Сечение ниже минимума",
  "UI-EKRKABMALINS-PRZEKROJ": "Ваше сечение",
  "UI-EKRKABMALINS-MINIMALNY-PRZEKROJ": "Минимальное сечение",
  "UI-EKRKABMALINS-MINIMUM": "· минимум {wymaganyMm2} мм²",
  "UI-EKRCHECHE-LIFEPO4": "LiFePO4",
}
