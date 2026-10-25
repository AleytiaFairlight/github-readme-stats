// @ts-check
/**
 * Renders cards to SVG files without running a server, for self-hosted
 * scheduled updates (e.g. a daily job that commits the files to a profile repo).
 *
 * Usage: node scripts/generate-cards.js <config.json> <output dir>
 *
 * The config is a list of cards, each naming an endpoint in api/ and its query:
 *   [{ "file": "stats.svg", "api": "index", "query": { "username": "me" } }]
 *
 * Tokens come from PAT_1, PAT_2, ... like the API. A card that renders an error
 * leaves the existing file untouched and makes the script exit non-zero.
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const [configPath, outDir] = process.argv.slice(2);
if (!configPath || !outDir) {
  console.error(
    "Usage: node scripts/generate-cards.js <config.json> <out dir>",
  );
  process.exit(2);
}

const cards = JSON.parse(readFileSync(configPath, "utf8"));
mkdirSync(outDir, { recursive: true });

let failed = 0;
for (const card of cards) {
  const { default: handler } = await import(`../api/${card.api}.js`);
  let body = "";
  const res = {
    setHeader: () => {},
    send: (/** @type {string} */ svg) => {
      body = svg;
    },
  };
  await handler({ query: card.query }, res);

  if (!body || body.includes("Something went wrong!")) {
    failed++;
    console.error(`${card.file}: render failed\n${body}`);
    continue;
  }
  writeFileSync(join(outDir, card.file), body);
  console.log(`${card.file}: ok`);
}

process.exit(failed ? 1 : 0);
