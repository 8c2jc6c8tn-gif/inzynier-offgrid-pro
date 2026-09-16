import { afterEach, describe, expect, it } from "vitest"
import { isAiConfigured } from "../config"

const ORIGINAL_ENV = { ...process.env }

afterEach(() => {
  process.env = { ...ORIGINAL_ENV }
})

describe("isAiConfigured", () => {
  it("false gdy brak zmiennej", () => {
    delete process.env.ANTHROPIC_API_KEY
    expect(isAiConfigured()).toBe(false)
  })

  it("false gdy zmienna pusta", () => {
    process.env.ANTHROPIC_API_KEY = ""
    expect(isAiConfigured()).toBe(false)
  })

  it("false dla placeholdera z .env.example", () => {
    process.env.ANTHROPIC_API_KEY = "twoj-klucz-anthropic"
    expect(isAiConfigured()).toBe(false)
  })

  it("true dla realnie wypełnionej wartości", () => {
    process.env.ANTHROPIC_API_KEY = "sk-ant-api03-realny-klucz"
    expect(isAiConfigured()).toBe(true)
  })
})
