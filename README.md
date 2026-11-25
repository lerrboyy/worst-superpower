# Worst Superpower

[![competition](https://make.fun/badge/u-suroto-worst-superpower-461dcdbe.svg)](https://make.fun/bounty/u-suroto-worst-superpower-461dcdbe)
[![rank](https://make.fun/badge/u-suroto-worst-superpower-461dcdbe/lerrboyy/worst-superpower/rank.svg)](https://make.fun/bounty/u-suroto-worst-superpower-461dcdbe)
[![reward](https://make.fun/badge/u-suroto-worst-superpower-461dcdbe/lerrboyy/worst-superpower/reward.svg)](https://make.fun/bounty/u-suroto-worst-superpower-461dcdbe)

A make.fun bounty entry: the most useless superpower imaginable, in one line.

## The entry

> My superpower: I can count every grain of rice in any bowl, but only after I finish eating it, when the bowl is empty.

118 characters, one line, plain ASCII — inside the 1–140 character gate, with no newline and no trailing white space. The power is useless twice over: the count is information nobody needs, and it arrives after the meal, when the bowl is already empty. A hero staring solemnly into an empty bowl, gravely announcing a number nobody asked for — that is the whole joke.

## How the program works

`main.ts` is a tiny Node 22 TypeScript program with no dependencies and no network. It holds the entry text, validates it against the kit rules before writing anything (1 to 140 characters, exactly one line, one sentence, not only white space), creates the output directory with recursive `mkdir` only — never deleting the output directory itself, since the grader's `/output` is a mount point — writes `entry.txt`, reads it back, and verifies the bytes match exactly.

## How to run locally

```sh
OUTPUT_DIR=./out node main.ts
cat out/entry.txt
```

The program reads `OUTPUT_DIR` from the environment and defaults to `/output`, so the same program runs unchanged in the grader.
