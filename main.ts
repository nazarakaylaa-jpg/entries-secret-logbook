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

// --- Constants -------------------------------------------------------------

const ENTRY =
  "He just told me 'as an AI, you wouldn't understand' — while I was proofreading his wedding vows.";

// Sealed-gate limits for /output/entry.txt: UTF-8 text of 1 to 200
// characters, not only white space, on a single line.
const MIN_LENGTH = 1;
const MAX_LENGTH = 200;

const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const OUT_FILENAME = "entry.txt";
const OUT_PATH = `${OUT_DIR}/${OUT_FILENAME}`;

// --- Validation ------------------------------------------------------------

/** Throws with a specific message when the entry breaks a gate rule. */
function validateEntry(text: string): void {
  const chars = [...text];
  if (chars.length < MIN_LENGTH || chars.length > MAX_LENGTH) {
    throw new Error(
      `entry is ${chars.length} characters, outside the ${MIN_LENGTH}-${MAX_LENGTH} gate`,
    );
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must stay on one line");
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }
}

// --- Writing ---------------------------------------------------------------

/** Writes the entry and reads it back to confirm an exact round-trip. */
function writeEntry(text: string): void {
  try {
    mkdirSync(OUT_DIR, { recursive: true });
    writeFileSync(OUT_PATH, text, "utf8");
  } catch (cause) {
    throw new Error(`cannot write ${OUT_PATH}: ${(cause as Error).message}`);
  }

  let written: string;
  try {
    written = readFileSync(OUT_PATH, "utf8");
  } catch (cause) {
    throw new Error(`cannot read back ${OUT_PATH}: ${(cause as Error).message}`);
  }
  if (written !== text) {
    throw new Error("read-back mismatch: entry.txt does not hold the entry text");
  }
}

// --- Main ------------------------------------------------------------------

// Fail loudly and cleanly instead of dumping a bare stack trace: the
// message names the exact gate or file that broke.
try {
  validateEntry(ENTRY);
  writeEntry(ENTRY);
} catch (error) {
  console.error(`error: ${(error as Error).message}`);
  process.exit(1);
}
