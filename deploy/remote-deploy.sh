#!/usr/bin/env bash
# Runs ON THE VPS as the `wassaphas` user. Called by .github/workflows/ci-cd.yml after
# it uploads release.tgz. Layout:
#   /srv/wassaphas/releases/<sha>/   one unpacked build per deploy
#   /srv/wassaphas/current           symlink to the live release
#   /srv/wassaphas/shared/.env       DATABASE_URL, ADMIN_PASSWORD, APP_SECRET (never in git)
# A release only becomes `current` after migrations succeed and it answers /api/health;
# otherwise the previous release is restored.
set -euo pipefail

SHA="${1:?usage: remote-deploy.sh <git-sha> <tarball>}"
TARBALL="${2:?usage: remote-deploy.sh <git-sha> <tarball>}"

APP_DIR=/srv/wassaphas
RELEASE="$APP_DIR/releases/$SHA"
ENV_FILE="$APP_DIR/shared/.env"
PORT=3100
KEEP=5

log() { echo "[deploy $SHA] $*"; }

[ -f "$ENV_FILE" ] || { log "missing $ENV_FILE"; exit 1; }

log "unpacking"
rm -rf "$RELEASE"
mkdir -p "$RELEASE"
tar -xzf "$TARBALL" -C "$RELEASE"
rm -f "$TARBALL"

log "migrating database"
node --env-file="$ENV_FILE" "$RELEASE/scripts/migrate.mjs"
# Seed only fills empty tables, so this is a no-op after the first deploy.
node --env-file="$ENV_FILE" "$RELEASE/scripts/seed.mjs"

PREVIOUS="$(readlink -f "$APP_DIR/current" 2>/dev/null || true)"

switch_to() {
  ln -sfn "$1" "$APP_DIR/current.tmp"
  mv -Tf "$APP_DIR/current.tmp" "$APP_DIR/current"
  pm2 startOrRestart "$APP_DIR/ecosystem.config.cjs" --update-env
}

healthy() {
  for _ in $(seq 1 20); do
    if curl -fsS "http://127.0.0.1:$PORT/api/health" | grep -q '"db":"ok"'; then
      return 0
    fi
    sleep 1
  done
  return 1
}

log "switching current -> $SHA"
switch_to "$RELEASE"

if healthy; then
  pm2 save >/dev/null
  log "healthy"
else
  log "health check FAILED"
  pm2 logs wassaphas --lines 40 --nostream || true
  if [ -n "$PREVIOUS" ] && [ -d "$PREVIOUS" ]; then
    log "rolling back to $(basename "$PREVIOUS")"
    switch_to "$PREVIOUS"
  fi
  exit 1
fi

log "pruning old releases (keeping $KEEP)"
cd "$APP_DIR/releases"
ls -1t | tail -n +$((KEEP + 1)) | while read -r old; do
  [ "$APP_DIR/releases/$old" = "$(readlink -f "$APP_DIR/current")" ] || rm -rf -- "$old"
done

log "done"
