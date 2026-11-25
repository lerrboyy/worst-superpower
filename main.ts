// Worst Superpower — make.fun bounty entry.
//
// A tiny Node 22 TypeScript program with no dependencies and no network.
// It holds the one-line entry, checks it against the kit gate, writes it
// to <OUTPUT_DIR>/entry.txt, reads it back, and verifies it byte-exact.
//
// The output directory comes from the OUTPUT_DIR environment variable and
// defaults to /output (the grader's mount point). The directory is created
// with recursive mkdir only. It is never deleted or removed: on the grader
// it is a mount point, and removing it fails the run with EBUSY.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry: one line inventing the most useless superpower imaginable.
// The power is useless twice over — the count is worthless information,
// and it arrives after the meal, when the bowl is already empty.
const ENTRY =
  "My superpower: I can count every grain of rice in any bowl, but only after I finish eating it, when the bowl is empty.";

// Kit gate: /output/entry.txt must be UTF-8 text of 1 to 140 characters
// and not only white space.
const MIN_CHARS = 1;
const MAX_CHARS = 140;

function fail(message: string): never {
  throw new Error(`entry validation failed: ${message}`);
}

// Count characters as Unicode code points, the way a reader counts them.
function charCount(text: string): number {
  return [...text].length;
}

function validateEntry(entry: string): void {
  const count = charCount(entry);
  if (count < MIN_CHARS || count > MAX_CHARS) {
    fail(`entry must be ${MIN_CHARS} to ${MAX_CHARS} characters, got ${count}`);
  }
  if (entry.trim().length === 0) {
    fail("entry must not be only white space");
  }
  // One line means no newline at all — not even a trailing one, which
  // would add a blank second line the judge never asked for.
  if (entry.includes("\n") || entry.includes("\r")) {
    fail("entry must be a single line with no newline characters");
  }
  // Keep the entry plain printable ASCII, so the gate's character count,
  // the byte count, and the code-point count all agree and no invisible
  // character can change what the judge reads.
  for (const [index, ch] of [...entry].entries()) {
    const code = ch.codePointAt(0) as number;
    if (code < 0x20 || code > 0x7e) {
      fail(`entry contains a disallowed character at position ${index}`);
    }
  }
  if (entry !== entry.trim()) {
    fail("entry must not start or end with white space");
  }
  if (/\s{2,}/.test(entry)) {
    fail("entry must not contain doubled white space");
  }
  // Exactly one sentence: one sentence-ending mark, at the very end.
  const endings = entry.match(/[.!?]/g);
  if (endings === null || endings.length !== 1 || !/[.!?]$/.test(entry)) {
    fail("entry must be exactly one sentence ending in a full stop");
  }
  // The line must do the brief's whole job in one breath: name a power,
  // make plain in the same sentence why it is useless, and land the
  // punchline — the bowl is already empty when the count arrives.
  if (!/superpower/i.test(entry)) {
    fail("entry must name the superpower it invents");
  }
  if (!/only after/i.test(entry)) {
    fail("entry must state the catch that makes the power useless");
  }
  if (!/empty/i.test(entry)) {
    fail("entry must land the punchline: the bowl is empty when the count arrives");
  }
}

function main(): void {
  validateEntry(ENTRY);

  const outputDir = process.env.OUTPUT_DIR ?? "/output";
  // Create the directory if needed. Never remove it: on the grader it is
  // a mount point, and deleting it throws EBUSY and fails the run.
  mkdirSync(outputDir, { recursive: true });

  const outPath = join(outputDir, "entry.txt");
  const written = Buffer.from(ENTRY, "utf8");
  writeFileSync(outPath, written);

  // Read the file back and verify it is byte-exact: compare the raw bytes,
  // not just the decoded strings, so an encoding drift cannot slip past.
  // Also check the byte length against the gate: the entry is plain ASCII,
  // so bytes and characters agree, but a byte length over 140 would mean
  // the gate could count the file differently than the program does.
  const readBack = readFileSync(outPath);
  if (readBack.length > MAX_CHARS) {
    fail(`written file is ${readBack.length} bytes, over the ${MAX_CHARS}-character gate`);
  }
  if (readBack.length !== written.length || !written.equals(readBack)) {
    fail("round-trip read-back bytes do not match the entry");
  }
  const roundTripped = readBack.toString("utf8");
  if (roundTripped !== ENTRY) {
    fail("round-trip read-back does not match the entry");
  }
  validateEntry(roundTripped);

  console.log(
    `wrote ${outPath} (${charCount(ENTRY)} characters, ${written.length} bytes, 1 line)`,
  );
}

main();
