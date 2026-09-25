/**
 * Wartości 1:1 ze źródła (Ekran 7 / §3.13) — żadna nie jest wyprowadzona ani zaokrąglona.
 * Źródło nie podaje modelu naprężeń (współczynników rozszerzalności, sztywności ramy) — stąd
 * sprawdzenie jest regułą progową, nie obliczeniem naprężenia.
 */

/** Minimalny odstęp dylatacyjny między panelami [mm] — "odstępy dylatacyjne min. 5 mm". */
export const ODSTEP_DYLATACYJNY_MIN_MM = 5

/** Temperatura, do której nagrzewają się panele [°C] — "65–70°C" (zakres źródła, tylko do opisu). */
export const TEMPERATURA_PANELU_MIN_C = 65
export const TEMPERATURA_PANELU_MAX_C = 70

/** Schłodzenie przy nagłym deszczu [°C] — "chłodzą się o 30°C w kilka minut". */
export const SCHLODZENIE_PRZY_DESZCZU_C = 30

/** Czas, po którym sztywny montaż prowadzi do mikropęknięć [lata] — "w ciągu ok. 2 lat". */
export const CZAS_DO_MIKROPEKNIEC_LATA = 2
