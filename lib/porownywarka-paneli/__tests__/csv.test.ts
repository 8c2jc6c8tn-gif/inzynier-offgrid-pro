import { describe, expect, it } from "vitest"
import { rozbierzCsv, wykryjSeparator, zbudujCsv } from "../csv"

describe("wykryjSeparator", () => {
  it("wybiera separator najczęstszy w pierwszej niepustej linii poza cudzysłowem", () => {
    expect(wykryjSeparator("a;b;c\n1;2;3")).toBe(";")
    expect(wykryjSeparator("a,b,c\n1,2,3")).toBe(",")
    expect(wykryjSeparator("a\tb\tc")).toBe("\t")
    expect(wykryjSeparator('"a;b;c",d\n1,2')).toBe(",")
    expect(wykryjSeparator("\n\nnazwa;moc")).toBe(";")
  })
  it("jedna kolumna bez separatora → średnik (domyślny)", () => {
    expect(wykryjSeparator("nazwa\nX")).toBe(";")
  })
})

describe("rozbierzCsv", () => {
  it("BOM, CRLF, ostatni wiersz bez końca linii i puste wiersze", () => {
    expect(rozbierzCsv("﻿a;b\r\n1;2\r\n\r\n3;4")).toEqual([["a", "b"], ["1", "2"], ["3", "4"]])
  })
  it("pola w cudzysłowie: separator, nowa linia i podwójny cudzysłów w środku", () => {
    expect(rozbierzCsv('a;b\n"x;y";"linia1\nlinia2"\n"on ""cytuje""";z')).toEqual([["a", "b"], ["x;y", "linia1\nlinia2"], ['on "cytuje"', "z"]])
  })
  it("puste komórki zostają puste, a wiersz z samych pustych komórek jest pomijany", () => {
    expect(rozbierzCsv("a;b;c\n1;;3\n;;")).toEqual([["a", "b", "c"], ["1", "", "3"]])
  })
  it("pusty tekst → brak wierszy", () => {
    expect(rozbierzCsv("")).toEqual([])
  })
})

describe("zbudujCsv", () => {
  const pl = { separator: ";" as const, przecinekDziesietny: true }
  it("BOM, CRLF, przecinek dziesiętny, puste dla null i liczb nieskończonych", () => {
    expect(zbudujCsv([["a", "b"], [1.5, null], [Number.NaN, 2]], pl)).toBe("﻿a;b\r\n1,5;\r\n;2\r\n")
  })
  it("kropka dziesiętna i przecinek jako separator (angielski arkusz)", () => {
    expect(zbudujCsv([["a", "b"], [1.5, "x,y"]], { separator: ",", przecinekDziesietny: false })).toBe('﻿a,b\r\n1.5,"x,y"\r\n')
  })
  it("cudzysłów, separator i nowa linia w tekście → pole w cudzysłowie z podwojonym cudzysłowem", () => {
    expect(zbudujCsv([['on "x"; y', "a\nb"]], pl)).toBe('﻿"on ""x""; y";"a\nb"\r\n')
  })
  it("tekst zaczynający się jak formuła dostaje apostrof; liczba ujemna nie", () => {
    expect(zbudujCsv([["=1+1", "+cmd", "-x", "@a", "zwykły", -3]], pl)).toBe("﻿'=1+1;'+cmd;'-x;'@a;zwykły;-3\r\n")
  })
  it("odczyt zapisanego pliku daje te same komórki (tekst)", () => {
    const wiersze = [["Producent X; model", "500"], ['"cytat"', "1,5"]]
    expect(rozbierzCsv(zbudujCsv(wiersze, pl))).toEqual(wiersze)
  })
})
