#!/usr/bin/env bash

# Run lint and capture output
output=$(bun run lint 2>&1)

# Check if output contains "error" (case insensitive)
if echo "$output" | grep -qi "error"; then
  # Found errors - show full output and exit with code 2
  echo "$output"
  exit 2
else
  # No errors found - show output and exit with code 0
  echo "$output"
  exit 0
fi