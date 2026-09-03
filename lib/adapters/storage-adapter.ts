/**
 * StorageAdapter — docs/standards/05-baza-danych-offline.md, 5.2.
 * Jedyny interfejs, przez który cały stan projektu jest zapisywany/odczytywany.
 * Implementacja: IndexedDB (web) dziś, SQLite (mobile) jutro — bez zmiany kodu, który
 * z adaptera korzysta. Zapisujemy wyłącznie Seed (dane wejściowe), nigdy Wynik (5.1).
 *
 * Ten plik definiuje tylko kontrakt. Implementacja (np. IndexedDbStorageAdapter) to
 * osobne zadanie — świadomie poza zakresem tego kroku (patrz docs/memory.md). Nie budować
 * jej spekulacyjnie: dziś apka nie ma jeszcze żadnej funkcji zapisującej Seed projektu (każdy
 * kalkulator przelicza w locie z pól formularza) — pierwsza taka funkcja (np. "zapisz projekt")
 * jest właściwym momentem, żeby ten interfejs dostał realną implementację, nie wcześniej.
 * Zob. `docs/lista-do-zrobienia.md`.
 */
export interface StorageAdapter {
  getItem<T>(key: string): Promise<T | null>
  setItem<T>(key: string, value: T): Promise<void>
  removeItem(key: string): Promise<void>
}
