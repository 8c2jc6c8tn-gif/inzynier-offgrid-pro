/**
 * Ekran 27, Moduł 5 "Okablowanie i zabezpieczenia" — "Puszki połączeniowe"
 * (dawne 4.34, docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md). Wzorzec B.
 *
 * "Automatyczna lista punktów połączeniowych z tras" (Ekran 19) świadomie NIE zbudowana —
 * Ekran 19 (`trasy-kablowe`) nie ma modelu danych tras (to czysta treść bez pól wejściowych),
 * więc nie ma skąd wygenerować takiej listy bez wymyślania struktury danych.
 */

export type MiejsceMontazu = "zewnatrz" | "w-ziemi" | "wewnatrz"

export type PuszkiPolaczenioweInput = {
  miejsceMontazu: MiejsceMontazu | null
}
