import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const backendRoot = path.resolve(process.cwd(), "../adhd-test-backend");
const pidFile = path.resolve(process.cwd(), ".e2e-api.pid");
const testDatabaseUrl = process.env.TEST_DATABASE_URL
  ?? "postgresql://adhd:adhd@localhost:55432/adhd_test_e2e?schema=public";

export default async function globalSetup() {
  runDatabaseAction("prepare");
  const server = spawn(process.execPath, ["dist/main.js"], {
    cwd: backendRoot,
    env: { ...process.env, DATABASE_URL: testDatabaseUrl, PORT: "4000" },
    stdio: "ignore",
  });
  fs.writeFileSync(pidFile, String(server.pid), "utf8");

  for (let attempt = 0; attempt < 40; attempt += 1) {
    if (server.exitCode !== null) {
      throw new Error(`E2E API exited during startup with code ${server.exitCode}`);
    }
    try {
      const response = await fetch("http://localhost:4000/api/v1/health");
      if (response.ok) return;
    } catch {
      // The API is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("E2E API did not become ready in time");
}

function runDatabaseAction(action: "prepare" | "clean") {
  const result = spawnSync(process.execPath, ["test/e2e-database.mjs", action], {
    cwd: backendRoot,
    env: process.env,
    stdio: "inherit",
  });
  if (result.status !== 0) throw new Error(`E2E database ${action} failed`);
}
