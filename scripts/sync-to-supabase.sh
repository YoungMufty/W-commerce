#!/usr/bin/env bash
# ==============================================================================
# W-COMMERCE: SYNC LOCAL SQLITE TO SUPABASE (BASH)
# ==============================================================================
# Transfers all 17,258 records (Users, Stores, Products, Orders, Wallets, PayAI)
# from local SQLite to your Supabase PostgreSQL instance in foreign key order.
# ==============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

TARGET_URL="$1"
DRY_RUN=false
VERBOSE=false

for arg in "$@"; do
  case "$arg" in
    --dry-run|-d)
      DRY_RUN=true
      ;;
    --verbose|-v)
      VERBOSE=true
      ;;
    --help|-h)
      echo "Usage: ./scripts/sync-to-supabase.sh [SUPABASE_URL] [--dry-run] [--verbose]"
      exit 0
      ;;
    postgres://*|postgresql://*)
      TARGET_URL="$arg"
      ;;
  esac
done

NODE_ARGS=("$ROOT_DIR/scripts/seed-from-sqlite.cjs")

if [ "$DRY_RUN" = true ]; then
  NODE_ARGS+=("--dry-run")
fi

if [ "$VERBOSE" = true ]; then
  NODE_ARGS+=("--verbose")
fi

if [ -n "$TARGET_URL" ]; then
  NODE_ARGS+=("$TARGET_URL")
fi

node "${NODE_ARGS[@]}"
