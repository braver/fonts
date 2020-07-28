#!/bin/bash

cd "$(dirname $0)"

for i in ../resources/*/update.sh; do
  echo "Running $i"
  bash "$i";
done
