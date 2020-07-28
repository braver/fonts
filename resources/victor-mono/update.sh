#!/bin/bash

cd "$(dirname "$0")"

repo="rubjo/victor-mono"
url_override() {
  echo "https://github.com/$repo/raw/$tag/public/VictorMonoAll.zip"
}
source "../../scripts/update-github.sh"

curfiles=()
for i in *.woff2; do
  curfiles+=("WOFF2/$i")
done
7z -y e -o"." "$file" "${curfiles[@]}" || exit 1

echo "$tag" > ".tag"

source "../../scripts/update-commit.sh"
