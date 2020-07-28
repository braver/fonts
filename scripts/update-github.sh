#!/bin/bash

if [ -z "$info" ]; then
  tag_uri=${tag_uri:-latest}
  echo "Fetcing https://api.github.com/repos/$repo/releases/$tag_uri"
  info="$(curl -sL "https://api.github.com/repos/$repo/releases/$tag_uri")"
fi

release_name="$(jq -r '.name' <<< "$info")"
echo -e "Found release: $release_name"

tag="$(jq -r '.tag_name' <<< "$info")"
tag_uri="tags/$tag"
echo -e "tag: $tag"

if [ -z "$needs_update" -a -r ".tag" -a "$(cat .tag)" == $tag ]; then
  echo "Current tag $(cat .tag) does not need updating"
  exit 0
fi

if [ "$(type -t url_override)" = "function" ]; then
  url="$(url_override)"
else
  filter=${filter:-.}
  url="$(jq -r ".assets[].browser_download_url | $filter" <<< "$info")"
  echo -e "Found urls:\n$url"

  nl="$(wc -l <<< "$url")"

  if [ $nl -gt 1 ]; then
    echo -e "\e[1m\e[31mFound $nl files, but expected 1\e[0m\e[39m"
    exit
  fi

  url="$(head -n1 <<< "$url")"
fi

file="$(mktemp)"
exec 5<>$file
rm "$file"
file="/proc/$$/fd/5"
wget "$url" -O "$file"
