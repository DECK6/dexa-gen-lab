#!/usr/bin/env bash
# Build + thumbnails, then copy the site into the dexa.art repo (adxdeck).
# git add/commit/push is never done here — that stays a manual, user-approved step.
set -euo pipefail
cd "$(dirname "$0")/.."

DEST="/Volumes/data/Dev/adxdeck-dexa-daily-main/gen"

bun run build
node scripts/thumbs.mjs
mkdir -p dist/thumbs
cp -R public/thumbs/. dist/thumbs/

STAGE="$(mktemp -d "${DEST}.staging.XXXXXX")"
cp -R dist/. "$STAGE/"
if [[ -d "$DEST" ]]; then
  trash "$DEST"
fi
mv "$STAGE" "$DEST"
echo "deployed dist/ → $DEST (git commit/push는 사용자 승인 후 수동)"
