#!/bin/bash

cd "$(dirname "$0")"

repo="mozilla/Fira"
url_override() {
	wget "https://github.com/$repo/raw/$tag/woff2/FiraMono-Regular.woff2" -O "fira.woff2" >&2
	wget "https://github.com/$repo/raw/$tag/woff2/FiraMono-Bold.woff2" -O "fira-bold.woff2" >&2
}
source "../../scripts/update-github.sh"

echo "$tag" > ".tag"

source "../../scripts/update-commit.sh"
