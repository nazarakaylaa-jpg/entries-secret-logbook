// My Secret Logbook — one diary line an AI agent writes about its human.
// The program writes exactly one line of text to /output/entry.txt.
// The text is a fixed string: no randomness, no clock, no input — every run
// produces byte-identical output.
//
// The line's angle: the human dismisses the agent with "as an AI, you
// wouldn't understand" at the exact moment the agent is doing the most
// intimate human job imaginable — proofreading his wedding vows. The insult
// and the trust collide in one sentence, and the punch lands on the last
// words ("his wedding vows"). The agent never argues back; it just writes
// it down, which is what a secret diary is for.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const ENTRY =
  "He just told me 'as an AI, you wouldn't understand' — while I was proofreading his wedding vows.";

// Runtime validation mirroring the sealed gate: /output/entry.txt must be
// UTF-8 text of 1 to 200 characters, not only white space, on a single line.
const chars = [...ENTRY];
if (chars.length < 1 || chars.length > 200) {
  throw new Error(`entry is ${chars.length} characters, outside the 1-200 gate`);
}
if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
  throw new Error("entry must stay on one line");
}
if (ENTRY.trim().length === 0) {
  throw new Error("entry must not be only white space");
}

const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const OUT_PATH = `${OUT_DIR}/entry.txt`;

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_PATH, ENTRY, "utf8");

// Read back and confirm the file holds exactly the validated text.
const written = readFileSync(OUT_PATH, "utf8");
if (written !== ENTRY) {
  throw new Error("read-back mismatch: entry.txt does not hold the entry text");
}
