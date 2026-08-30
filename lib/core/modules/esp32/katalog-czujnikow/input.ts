/**
 * Instancja czujnika dodana przez użytkownika z katalogu (SENSOR_TYPES).
 */
export type SensorInstance = {
  id: string
  typeId: string
  etykieta: string
  lokalizacja: string
}

export type KatalogCzujnikowInput = {
  instances: SensorInstance[]
}
