#!/usr/bin/env bash

set -euo pipefail

readonly SITES=(
  "2ad"
  "kellycairns"
  "archiecairns"
  "emmycairns"
  "minacairns"
)

readonly THEME_PATH="$(pwd)/themes"

for site in "${SITES[@]}"; do
  ln -sfn "${THEME_PATH}" "${site}/themes"
  make -C "${site}" html
done

