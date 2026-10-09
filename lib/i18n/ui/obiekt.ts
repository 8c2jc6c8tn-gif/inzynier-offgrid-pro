/**
 * Rodzaj obiektu projektu (Ustawienia, `components/obiekt-sekcja.tsx`; model: `lib/obiekt/profil-obiektu.ts`).
 */
export const pl = {
  "UI-OBIEKT-TYTUL": "Rodzaj obiektu",
  "UI-OBIEKT-OPIS": "Wybierz, co zasilasz. Kamper, altana lub domek ROD i garaż to mikroinstalacje: aplikacja liczy je z listy odbiorników i miesięcy użytkowania, a nie ze strat ciepła budynku. Brak wyboru = aplikacja działa jak dotąd.",
  "UI-OBIEKT-RODZAJ": "Rodzaj obiektu",
  "UI-OBIEKT-WYBIERZ": "— nie wybrano —",
  "UI-OBIEKT-R-BUDYNEK": "Budynek (dom całoroczny)",
  "UI-OBIEKT-R-KAMPER": "Kamper lub przyczepa",
  "UI-OBIEKT-R-ALTANA-ROD": "Altana lub domek ROD (działka, domek letniskowy)",
  "UI-OBIEKT-R-GARAZ": "Garaż lub budka",
  "UI-OBIEKT-MIESIACE": "Miesiące, w których obiekt jest używany",
  "UI-OBIEKT-MIKRO-NOTA": "Zużycie mikroinstalacji liczę z Twojej listy odbiorników i zaznaczonych miesięcy. Miesiące bez zaznaczenia liczą się jako zerowe zużycie.",
  "UI-OBIEKT-LINK-ODBIORNIKI": "Uzupełnij listę odbiorników →",
  "UI-OBIEKT-BRAK-MIESIECY": "Zaznacz co najmniej jeden miesiąc użytkowania, żeby policzyć zużycie.",
} as const

type Klucz = keyof typeof pl

export const en: Record<Klucz, string> = {
  "UI-OBIEKT-TYTUL": "Type of site",
  "UI-OBIEKT-OPIS": "Choose what you are powering. A camper, a garden-plot cabin (ROD) and a garage are micro-installations: the app calculates them from your list of appliances and months of use, not from building heat losses. No choice = the app works as before.",
  "UI-OBIEKT-RODZAJ": "Type of site",
  "UI-OBIEKT-WYBIERZ": "— not chosen —",
  "UI-OBIEKT-R-BUDYNEK": "Building (year-round house)",
  "UI-OBIEKT-R-KAMPER": "Camper or trailer",
  "UI-OBIEKT-R-ALTANA-ROD": "Garden-plot cabin or summerhouse (ROD, holiday cabin)",
  "UI-OBIEKT-R-GARAZ": "Garage or small shed",
  "UI-OBIEKT-MIESIACE": "Months in which the site is used",
  "UI-OBIEKT-MIKRO-NOTA": "I calculate a micro-installation’s consumption from your list of appliances and the months you tick. Unticked months count as zero consumption.",
  "UI-OBIEKT-LINK-ODBIORNIKI": "Fill in the list of appliances →",
  "UI-OBIEKT-BRAK-MIESIECY": "Tick at least one month of use to calculate the consumption.",
}

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
}
