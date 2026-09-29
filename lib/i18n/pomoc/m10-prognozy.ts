/**
 * Help content — Module 10 (forecasts). The screen runs on demonstration data and has no input
 * fields yet, so it gets a snapshot only; the text states what the engine really sums (TD7).
 */
import type { Tlumaczenie } from "./typy"

export const pl = {
  prognozy: {
    migawka: {
      oCoChodzi: "To jest „pogoda” Twojego systemu energetycznego — nie tylko atmosferyczna, ale cała: ile będziesz mieć prądu, ile zużyjesz i kiedy będzie ciasno.",
      jakDziala: "Sumuję produkcję i zużycie z punktów prognozy (co 3 godziny), liczę bilans doby i wskazuję godzinę największego zużycia. Na razie ekran pokazuje dane demonstracyjne — docelowo weźmie je z symulacji rocznej i prognozy pogody.",
      poCo: "Widzisz z wyprzedzeniem, czy doba zamknie się nadwyżką czy deficytem i kiedy przypada szczyt — żeby przesunąć duże odbiorniki na godziny ze słońcem.",
    },
    pola: {},
  },
}

export const en: Tlumaczenie<typeof pl> = {
  prognozy: {
    migawka: {
      oCoChodzi: "This is the “weather” of your energy system — not just the atmosphere but everything: how much power you'll have, how much you'll use and when it gets tight.",
      jakDziala: "I sum production and consumption from the forecast points (every 3 hours), compute the daily balance and show the hour of peak consumption. For now the screen shows demonstration data — eventually it will take them from the annual simulation and the weather forecast.",
      poCo: "You see ahead whether the day ends in surplus or deficit and when the peak falls — so you can move big loads to sunny hours.",
    },
    pola: {},
  },
}

export const ru: Tlumaczenie<typeof pl> = {
  prognozy: {
    migawka: {
      oCoChodzi: "Это «погода» вашей энергосистемы — не только атмосферная, а вся: сколько будет электричества, сколько вы потратите и когда станет туго.",
      jakDziala: "Суммирую выработку и потребление по точкам прогноза (каждые 3 часа), считаю баланс суток и показываю час наибольшего потребления. Пока экран показывает демонстрационные данные — в дальнейшем они будут браться из годовой симуляции и прогноза погоды.",
      poCo: "Вы заранее видите, закончатся ли сутки избытком или дефицитом и когда пик, — чтобы перенести крупные нагрузки на солнечные часы.",
    },
    pola: {},
  },
}
