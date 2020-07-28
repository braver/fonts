#!/bin/bash

cd "$(dirname "$0")"

repo="be5invis/Iosevka"
filter='match(".*/ttf-iosevka-[^-]+\\.zip$"; "i").string'
source "../../scripts/update-github.sh"

curfiles=()
for i in normal/*.woff2; do
  curfiles+=("woff2/$(basename $i)")
done
7z -y e -o"normal/" "$file" "${curfiles[@]}" || exit 1

curfiles=()
for i in extended/*.woff2; do
  curfiles+=("woff2/$(basename $i)")
done
7z -y e -o"extended/" "$file" "${curfiles[@]}" || exit 1

echo "$tag" > ".tag"

source "../../scripts/update-commit.sh"
