import { access, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

export const runtimeReportDir = process.env.RUNTIME_REPORT_DIR ?? join(process.cwd(), "runtime-reports");

export function runtimeReportPath(filename) { return join(runtimeReportDir, filename); }

export async function writeRuntimeReport(filename, content) {
  await mkdir(runtimeReportDir, { recursive: true });
  const target = runtimeReportPath(filename);
  await writeFile(target, content, "utf8");
  return target;
}

export async function runtimeOrSnapshot(filename, snapshot) {
  const runtime = runtimeReportPath(filename);
  try { await access(runtime); return runtime; } catch { return snapshot; }
}
