import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";

// npm includes propagated dependency findings. Never hide them behind a production-only audit.
let output;
try {
  output = execFileSync(
    process.platform === "win32" ? "cmd.exe" : "npm",
    process.platform === "win32"
      ? ["/d", "/s", "/c", "npm audit --json"]
      : ["audit", "--json"],
    { encoding: "utf8", timeout: 60000 },
  );
} catch (error) {
  output = error.stdout;
  if (!output) {
    process.stderr.write("Dependency audit could not reach the registry.\n");
    process.exit(1);
  }
}
const report = JSON.parse(output.replace(/^\uFEFF/, ""));
if (!report.metadata) {
  process.stderr.write(
    "Dependency audit returned an error, not a security result.\n",
  );
  process.exit(1);
}
writeFileSync(
  "docs/dependency-audit-final.json",
  JSON.stringify(report, null, 2) + "\n",
);
const counts = report.metadata.vulnerabilities;
console.log("Dependency advisories:", counts);
// Policy: no advisory exceptions. A future exception must be documented and reviewed explicitly.
process.exit(counts.total > 0 ? 1 : 0);
