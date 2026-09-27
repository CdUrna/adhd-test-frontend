import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e",
  globalSetup: "./e2e/global-setup.ts",
  globalTeardown: "./e2e/global-teardown.ts",
  fullyParallel: false,
  workers: 1,
  timeout: 45_000,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    browserName: "chromium",
    headless: true,
    trace: "retain-on-failure",
  },
});
