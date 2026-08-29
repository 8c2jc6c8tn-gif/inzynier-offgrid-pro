import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import path from "node:path"

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    include: ["lib/**/*.test.{ts,tsx}", "lib/**/__tests__/**/*.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "."),
    },
  },
})
