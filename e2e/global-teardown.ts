import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

export default function globalTeardown() {
  const frontendRoot = process.cwd();
  const backendRoot = path.resolve(frontendRoot, "../adhd-test-backend");
  const pidFiles = [
    path.resolve(frontendRoot, ".e2e-api.pid"),
    path.resolve(frontendRoot, ".e2e-frontend.pid"),
  ];

  for (const pidFile of pidFiles) {
    if (!fs.existsSync(pidFile)) continue;

    const pid = Number(fs.readFileSync(pidFile, "utf8"));
    if (Number.isInteger(pid) && pid > 0) {
      try {
        process.kill(pid);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ESRCH") throw error;
      }
    }
    fs.rmSync(pidFile, { force: true });
  }

  const result = spawnSync(process.execPath, ["test/e2e-database.mjs", "clean"], {
    cwd: backendRoot,
    env: process.env,
    stdio: "inherit",
  });
  if (result.status !== 0) throw new Error("E2E database cleanup failed");
}
