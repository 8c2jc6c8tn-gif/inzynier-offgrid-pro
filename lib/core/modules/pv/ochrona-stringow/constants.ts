/**
 * Współczynnik K1 (Załącznik B.2 normy HD 60364-7-712) — minimalna wartość normowa do wyliczenia
 * I_SC_MAX z katalogowego I_SC_STC. Norma dopuszcza wyższe K1 w warunkach szczególnych (odbicia,
 * zwiększone naświetlenie), ale nie podaje konkretnej wartości — nie zgadujemy, K1 stały na
 * minimum normowe.
 */
export const K1_ISC_MAX = 1.25

/** Współczynnik marginesu dolnego przy doborze zabezpieczenia (§712.431.102). */
export const WSPOLCZYNNIK_MARGINESU_DOLNEGO = 1.1

/** Współczynnik w teście obowiązkowości zabezpieczenia (§712.431.101). */
export const WSPOLCZYNNIK_TESTU_OBOWIAZKOWOSCI = 1.35

/**
 * Próg liczby stringów równoległych (Ns), poniżej którego norma wprost wyklucza wymóg
 * zabezpieczenia nadprądowego (§712.431.101: "En un grupo fotovoltaico con una o dos cadenas
 * fotovoltaicas en paralelo, no se requiere un dispositivo protector de sobreintensidad").
 */
export const PROG_LICZBY_STRINGOW = 2
