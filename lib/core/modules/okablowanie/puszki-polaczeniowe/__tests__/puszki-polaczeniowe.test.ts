import { describe, expect, it } from "vitest"
import { calculatePuszkiPolaczeniowe } from "../calculator"

describe("calculatePuszkiPolaczeniowe", () => {
  it("na zewnątrz -> IP66 z dławikami", () => {
    const result = calculatePuszkiPolaczeniowe({ miejsceMontazu: "zewnatrz" })
    expect(result.status).toBe("VALID")
    expect(result.value.wymaganyTyp).toBe("IP66 z dławikami")
  })

  it("w ziemi -> zalewana żywicą", () => {
    const result = calculatePuszkiPolaczeniowe({ miejsceMontazu: "w-ziemi" })
    expect(result.value.wymaganyTyp).toBe("Zalewana żywicą")
  })

  it("wewnątrz -> IP20", () => {
    const result = calculatePuszkiPolaczeniowe({ miejsceMontazu: "wewnatrz" })
    expect(result.value.wymaganyTyp).toBe("IP20")
  })

  it("INCOMPLETE — miejsce niewybrane", () => {
    const result = calculatePuszkiPolaczeniowe({ miejsceMontazu: null })
    expect(result.status).toBe("INCOMPLETE")
  })
})
