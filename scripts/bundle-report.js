import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
const files = readdirSync("dist/assets")
  .filter((name) => /\.(js|css)$/.test(name))
  .map((name) => ({
    name,
    bytes: statSync("dist/assets/" + name).size,
    gzip: gzipSync(readFileSync("dist/assets/" + name)).length,
  }))
  .sort((a, b) => b.bytes - a.bytes);
const html = readFileSync("dist/index.html", "utf8");
const entry = files.filter((file) => html.includes(file.name));
const result = { entry, files };
console.log(JSON.stringify(result, null, 2));
writeFileSync("docs/bundle-final.json", JSON.stringify(result, null, 2) + "\n");
