// Russian texts of ./m14-przejscie-ekrany.ts — the same keys as `pl` (a missing or an extra key is a compile error).
import type { pl } from "./m14-przejscie-ekrany"

type Klucz = keyof typeof pl

export const ru: Record<Klucz, string> = {
  "UI-RYZ-TYTUL": "Риски отключения от сети",
  "UI-RYZ-OPIS":
    "Десять рисков полного отключения (сценарий D), а для фирмы — ещё три. Отмечайте каждый, когда проверите его. Знак у пункта показывает степень уверенности: ✅ закон, физика или практика без сомнений; 🔎A несколько согласующихся источников; 🔎B один источник или экспертное знание. M14, экран D9 / F9.",
  "UI-RYZ-SKUTEK": "Последствие: {tekst}",
  "UI-RYZ-CO-ZROBIC": "Что делать: {tekst}",
  "UI-RYZ-WSZYSTKIE": "Все риски проверены",
  "UI-RYZ-NASTEPNY": "Следующий шаг:",
  "UI-RYZ-LINK-PROCEDURA": "процедура отказа от подключения",
  "UI-RYZ-KROKI-ODWRACALNE": "— шаги 1–4 обратимы, начните с проверки автономной работы в течение полной зимы.",
  "UI-RYZ-SPRAWDZONO": "Проверено {n} из {wszystkie} рисков",
  "UI-REZ-TYTUL": "Как отказаться от подключения к сети",
  "UI-REZ-OPIS":
    "Семь шагов в порядке, который имеет значение. Шаги 1–4 можно отменить, 5–7 — уже нет. Внизу — сколько стоило бы вернуться к сети. M14, экран D10 / F10.",
  "UI-REZ-ODWRACALNE": "(обратимо)",
  "UI-REZ-NIEODWRACALNE": "(необратимо)",
  "UI-REZ-FIRMA": "Фирма: {tekst}",
  "UI-REZ-KOSZT-POWROTU": "Стоимость возврата к сети",
  "UI-REZ-KOSZT-OPIS":
    "K ≈ ставка платы за подключение ОСР [зл/кВт] × мощность подключения — группы IV–VI, стандартное расстояние. Ставку вы найдёте в тарифе своего ОСР (раздел о плате за подключение); в приложении её пока нет.",
  "UI-REZ-STAWKA": "Ставка платы за подключение",
  "UI-REZ-J-ZL-KW": "зл/кВт",
  "UI-REZ-MOC": "Мощность подключения",
  "UI-REZ-ODLEGLOSC": "Расстояние до сети",
  "UI-REZ-ODL-TAK": "В пределах стандартного расстояния по тарифу ОСР",
  "UI-REZ-ODL-NIE": "Дальше стандартного расстояния",
  "UI-REZ-UZUPELNIJ": "Дополните данные",
  "UI-REZ-POWROT": "Возврат к сети",
  "UI-REZ-WYCENA-INDYW": "Индивидуальная оценка ОСР",
  "UI-REZ-OK-NETTO": "ок. {kwota} нетто",
  "UI-REZ-PRZED-KROKIEM-5": "Перед шагом 5:",
  "UI-REZ-LINK-RYZYKA": "риски отключения",
  "UI-REZ-LINK-PRZELACZNIK": "переключатель сеть/автономия",
}
