// Russian texts of ./m14-agregat.ts — the same keys as `pl` (a missing or an extra key is a compile error).
import type { pl } from "./m14-agregat"

type Klucz = keyof typeof pl

export const ru: Record<Klucz, string> = {
  "UI-AGZ-TYTUL": "Генератор как резерв",
  "UI-AGZ-OPIS":
    "Сколько часов и топлива нужно, чтобы генератор покрыл дефицит худшего месяца без сети, — и как его безопасно подключить. Тот же расчёт, что на экране «Электрогенератор» (модуль 2). M14 «Дом – сеть», экран D6.",
  "UI-AGZ-NAJPIERW": "Сначала рассчитайте зиму без сети",
  "UI-AGZ-L-ZIMA": "Зима без сети →",
  "UI-AGZ-BEZ-NIEDOBORU": "Без дефицита",
  "UI-AGZ-BEZ-NIEDOBORU-OPIS":
    "В месячном балансе ни в одном месяце не хватает энергии. Серия пасмурных дней всё равно может потребовать резерва — проверьте зимний стресс-тест (модуль 7).",
  "UI-AGZ-NAJGORSZY": "Худший месяц без сети:",
  "UI-AGZ-BRAKUJE": ", не хватает {kwh} кВт·ч.",
  "UI-AGZ-MOC": "Мощность генератора",
  "UI-AGZ-ZUZYCIE": "Расход топлива при нагрузке 80%",
  "UI-AGZ-CENA": "Цена топлива",
  "UI-AGZ-BMS": "BMS / инвертор имеет выход для автоматического запуска генератора",
  "UI-AGZ-SPRAWDZ": "Проверьте введённые данные",
  "UI-AGZ-BEZPIECZENSTWO": "Безопасность генератора",
  "UI-AGZ-W-MIESIACU": "Генератор в месяце {miesiac}",
  "UI-AGZ-GODZINY": "{h} ч работы",
  "UI-AGZ-PALIWO": "Топливо {litry} л, стоимость {koszt}. Переключатель сеть/автономия и генератор:",
  "UI-AGZ-L-STYK": "безопасность точки соединения →",
}
