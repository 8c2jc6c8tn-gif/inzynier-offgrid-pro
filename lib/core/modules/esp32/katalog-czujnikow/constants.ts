/**
 * Moduł 9 "Elektronika / ESP32 / sensoryka" — KATALOG 1: Czujniki (21 pozycji)
 * (docs/zrodla/Tresc_Modul_9_ESP32_Ekrany.md). Wzorzec H — katalog komponentów:
 * user dodaje dowolną liczbę instancji każdego typu, każda konfigurowana osobno
 * (docs/standards/08-ui-ux.md, 8.2). Dane 1:1 ze źródła.
 */

export type SensorType = {
  id: string
  pozycja: string
  modelTechnologia: string
  kluczoweDaneDoboru: string
}

export const SENSOR_TYPES: SensorType[] = [
  { id: "napiecie-dc", pozycja: "Napięcie DC", modelTechnologia: "Dzielnik napięcia + ADS1115", kluczoweDaneDoboru: "zakres pomiarowy (np. 0–60V), rezystancja wejściowa" },
  { id: "prad-dc", pozycja: "Prąd DC", modelTechnologia: "INA219 (do 26V/3,2A) lub INA228 (do 85V/20A, precyzyjny)", kluczoweDaneDoboru: "zakres prądu, rezystor shunt" },
  { id: "prad-ac", pozycja: "Prąd AC", modelTechnologia: "SCT-013 (przekładnik, np. 100A/50mA)", kluczoweDaneDoboru: "montaż na otwieranym rdzeniu, kalibracja" },
  { id: "moc-ac", pozycja: "Moc AC", modelTechnologia: "PZEM-004T (RS485) lub PZEM-003 (UART)", kluczoweDaneDoboru: "pomiar mocy czynnej, napięcia, prądu, częstotliwości, energii; wymaga izolacji galwanicznej" },
  { id: "prad-rozruchu", pozycja: "Prąd rozruchu/zwarć", modelTechnologia: "Czujnik Halla (np. ACS758), czas reakcji <10µs", kluczoweDaneDoboru: "szybkie próbkowanie ADC" },
  { id: "temp-baterii", pozycja: "Temperatura ogniw/baterii", modelTechnologia: "DS18B20 (cyfrowy, 1-Wire, ±0,5°C) lub NTC 10kΩ", kluczoweDaneDoboru: "liczba punktów pomiarowych" },
  { id: "temp-otoczenia", pozycja: "Temperatura otoczenia/wilgotność", modelTechnologia: "BME280 (I2C, +ciśnienie) lub SHT31", kluczoweDaneDoboru: "lokalizacja montażu" },
  { id: "naslonecznienie", pozycja: "Nasłonecznienie", modelTechnologia: "BH1750 (cyfrowy, I2C, 0–65535 lx) lub LDR", kluczoweDaneDoboru: "przelicznik na przybliżone nasłonecznienie" },
  { id: "dym-gaz", pozycja: "Dym/gaz/wodór", modelTechnologia: "MQ-2 (dym, LPG, metan) lub MQ-8 (wodór)", kluczoweDaneDoboru: "24h czasu nagrzewania przy pierwszym uruchomieniu — krytyczne dla dokładności" },
  { id: "zalanie-wyciek", pozycja: "Zalanie/wyciek wody", modelTechnologia: "czujnik przewodowy lub bezprzewodowy", kluczoweDaneDoboru: "miejsca montażu: pod zlewem, przy bojlerze, w piwnicy" },
  { id: "cisnienie-atm", pozycja: "Ciśnienie atmosferyczne", modelTechnologia: "BMP280 (I2C)", kluczoweDaneDoboru: "dane do prognozy pogody i korekty nasłonecznienia" },
  { id: "ruch-obecnosc", pozycja: "Ruch/obecność", modelTechnologia: "PIR (tani) lub radar mmWave (dokładniejszy)", kluczoweDaneDoboru: "zastosowanie w automatyce oświetlenia" },
  { id: "otwarcie-drzwi", pozycja: "Otwarcie drzwi/obudowy", modelTechnologia: "kontaktron/czujnik magnetyczny", kluczoweDaneDoboru: "monitoring obudów falownika, baterii, rozdzielni" },
  { id: "zalanie-szafy", pozycja: "Zalanie rur/szafy elektrycznej", modelTechnologia: "czujnik wilgoci", kluczoweDaneDoboru: "przy wykryciu — automatyczne odłączenie zasilania szafy" },
  { id: "przegrzanie-szyn", pozycja: "Przegrzanie szyn/połączeń", modelTechnologia: "czujnik kontaktowy (DS18B20 w obudowie termoprzewodzącej)", kluczoweDaneDoboru: "progi: ostrzeżenie 60°C, alarm 80°C" },
  { id: "jakosc-powietrza", pozycja: "Jakość powietrza (CO2/LZO)", modelTechnologia: "SGP30 lub SCD30 (dokładniejszy)", kluczoweDaneDoboru: "czas nagrzewania, kalibracja" },
  { id: "wibracje", pozycja: "Wibracje/wstrząsy", modelTechnologia: "MPU6050 lub ADXL345", kluczoweDaneDoboru: "montaż na falowniku, pompie ciepła, agregacie — wczesne wykrycie awarii" },
  { id: "deszcz-opady", pozycja: "Deszcz/opady", modelTechnologia: "pojemnościowy (wilgoć na powierzchni) lub wagowy", kluczoweDaneDoboru: "integracja z prognozą i produkcją PV" },
  { id: "wiatr", pozycja: "Wiatr — prędkość/kierunek", modelTechnologia: "anemometr impulsowy lub RS485 (cyfrowy)", kluczoweDaneDoboru: "cross-ref Moduł 3 (aerodynamika), Moduł 7 (turbina)" },
  { id: "poziom-wody", pozycja: "Poziom wody w zbiorniku", modelTechnologia: "ultradźwiękowy (bezkontaktowy) lub hydrostatyczny", kluczoweDaneDoboru: "wymiary zbiornika do kalibracji" },
  { id: "prad-uplywu", pozycja: "Prąd upływu / ochrona różnicowa", modelTechnologia: "przekładnik różnicowy", kluczoweDaneDoboru: "uzupełnienie sprzętowego RCD (Moduł 5, Ekran 16) o odczyt cyfrowy" },
]

export const MIGAWKA_KATALOGU =
  "Każdy czujnik to dodatkowe „zmysły” Twojego systemu — dodajesz tyle, ile potrzebujesz, " +
  "tam gdzie potrzebujesz, a system uczy się o Twojej instalacji więcej z każdym kolejnym."
