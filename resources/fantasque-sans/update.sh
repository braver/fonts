#!/bin/bash

cd "$(dirname "$0")"

extract() {
  curfiles=()
  for i in *.woff2; do
    curfiles+=("Webfonts/$(basename $i)")
  done
  7z -y e -o"." "$file" "${curfiles[@]}" || exit 1
}

repo="belluzj/fantasque-sans"

filter='match(".*-Normal\\.zip"; "i").string'
source "../../scripts/update-github.sh"

extract

# no loop k

filter='match(".*mono-NoLoopK\\.zip"; "i").string'
source "../../scripts/update-github.sh"

pushd no-loop-k
extract
popd

echo "$tag" > ".tag"

source "../../scripts/update-commit.sh"
