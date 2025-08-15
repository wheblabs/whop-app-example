#!/usr/bin/env bash

# Run lint and capture output and exit code
output=$(bun run lint 2>&1)
exit_code=$?

# Handle based on exit code
if [ $exit_code -eq 0 ]; then
  # Lint passed - show output and exit with code 0
  echo "$output"
  exit 0
elif [ $exit_code -eq 2 ]; then
  # Lint returned 2 - show output to stderr and exit with code 2
  echo "$output" >&2
  exit 2
elif [ $exit_code -eq 1 ]; then
  # Lint returned 1 - check if output contains "error"
  if echo "$output" | grep -qi "error"; then
    # Found errors - show output to stderr and exit with code 2
    echo "$output" >&2
    exit 2
  else
    # No errors found - show output and exit with code 0
    echo "$output"
    exit 0
  fi
else
  # Unexpected exit code - show output to stderr and pass through exit code
  echo "$output" >&2
  exit $exit_code
fi