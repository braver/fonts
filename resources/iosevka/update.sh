#!/bin/bash

cd "$(dirname "$0")"

repo="be5invis/Iosevka"
# CHANGE ME!!!
#tag_uri="tags/v4.5.0"
filter='match(".*/webfont-iosevka-[^-]+\\.zip$"; "i").string'
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
