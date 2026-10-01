/**
 * Instancja komponentu dodana przez użytkownika z katalogu Modułu 9 (Wzorzec H, standard 8.2) — czujnika (Katalog 1),
 * aktuatora (Katalog 2), protokołu (Katalog 3) albo elementu interfejsu lokalnego (Katalog 4).
 */
export type KomponentInstance = {
  id: string
  typeId: string
  etykieta: string
  lokalizacja: string
}

export type KatalogKomponentowInput = {
  instances: KomponentInstance[]
}
