#!/usr/bin/env bash
# Deploys run on GitHub Actions (.github/workflows/deploy.yml).
# This triggers that workflow for the current main branch and follows it.
# Usage: npm run deploy
set -euo pipefail

cd "$(dirname "$0")/.."

if [ -n "$(git status --porcelain)" ]; then
  echo "Uncommitted changes. Commit and push first, the workflow builds what is on GitHub." >&2
  exit 1
fi

gh workflow run deploy.yml --ref main
sleep 4
gh run watch "$(gh run list --workflow=deploy.yml --limit 1 --json databaseId --jq '.[0].databaseId')" --exit-status
echo "==> Done: https://ofurkan.co"
