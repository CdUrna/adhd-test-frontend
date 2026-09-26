import { defineConfig } from "@playwright/test";
import path from "node:path";

const frontendRoot = __dirname;

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
    channel: "msedge",
    headless: true,
    trace: "retain-on-failure",
  },
  webServer: {
      command: "node node_modules/next/dist/bin/next start",
      cwd: frontendRoot,
      url: "http://localhost:3000",
      reuseExistingServer: true,
      timeout: 30_000,
  },
});
