import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const backendRoot = path.resolve(process.cwd(), "../adhd-test-backend");
const apiPidFile = path.resolve(process.cwd(), ".e2e-api.pid");
const frontendPidFile = path.resolve(process.cwd(), ".e2e-frontend.pid");
const testDatabaseUrl = process.env.TEST_DATABASE_URL
  ?? "postgresql://adhd:adhd@localhost:55432/adhd_test_e2e?schema=public";

export default async function globalSetup() {
  runDatabaseAction("prepare");
  const apiServer = spawn(process.execPath, ["dist/main.js"], {
    cwd: backendRoot,
    env: { ...process.env, DATABASE_URL: testDatabaseUrl, PORT: "4000" },
    stdio: "ignore",
  });
  const frontendServer = spawn(
    process.execPath,
    ["node_modules/next/dist/bin/next", "start"],
    {
      cwd: process.cwd(),
      env: { ...process.env, PORT: "3000" },
      stdio: "ignore",
    },
  );
  fs.writeFileSync(apiPidFile, String(apiServer.pid), "utf8");
  fs.writeFileSync(frontendPidFile, String(frontendServer.pid), "utf8");
  apiServer.unref();
  frontendServer.unref();

  for (let attempt = 0; attempt < 40; attempt += 1) {
    if (apiServer.exitCode !== null) {
      throw new Error(`E2E API exited during startup with code ${apiServer.exitCode}`);
    }
    if (frontendServer.exitCode !== null) {
      throw new Error(
        `E2E frontend exited during startup with code ${frontendServer.exitCode}`,
      );
    }
    try {
      const [apiResponse, frontendResponse] = await Promise.all([
        fetch("http://localhost:4000/api/v1/health"),
        fetch("http://localhost:3000"),
      ]);
      if (apiResponse.ok && frontendResponse.ok) return;
    } catch {
      // One or both applications are still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("E2E applications did not become ready in time");
}

function runDatabaseAction(action: "prepare" | "clean") {
  const result = spawnSync(process.execPath, ["test/e2e-database.mjs", action], {
    cwd: backendRoot,
    env: process.env,
    stdio: "inherit",
  });
  if (result.status !== 0) throw new Error(`E2E database ${action} failed`);
}
