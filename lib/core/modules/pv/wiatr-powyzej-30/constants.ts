import { CF_WIATA_MAX_KAT_DEG, KAT_PIONOWY_DEG } from "../eurokod-1/wiatr"

/** Dolna granica (wyłączona): do tego kąta panele na konstrukcji obejmuje norma (Tablica 7.6). */
export const KAT_NORMOWY_MAX_DEG = CF_WIATA_MAX_KAT_DEG
/** Górna granica (włączona): panel pionowy. */
export const KAT_MAX_DEG = KAT_PIONOWY_DEG

/** Zakresy wysokości — te same co w Porównywarce paneli (jedno źródło, Porównywarka je stąd bierze). */
export const WYSOKOSC_NPM_ZAKRES_M: readonly [number, number] = [-50, 2500]
export const WYSOKOSC_KONSTRUKCJI_ZAKRES_M: readonly [number, number] = [0.1, 200]
