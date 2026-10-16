import { cleanup, render } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { BobStanu } from "@/components/ui/bob-stanu"
import { ustawIkonyKafli } from "@/lib/wyglad/storage"

describe("Bob in interface states follows the module-illustration choice (D87)", () => {
  beforeEach(() => window.localStorage.clear())
  afterEach(() => {
    cleanup()
    window.localStorage.clear()
  })

  it("shows Bob by default", () => {
    const { container } = render(<BobStanu stan="pusty" />)
    expect(container.querySelector("img")).not.toBeNull()
  })

  it("renders nothing when 3D icons are chosen", () => {
    ustawIkonyKafli("3d")
    const { container } = render(<BobStanu stan="pusty" />)
    expect(container.querySelector("img")).toBeNull()
  })
})
