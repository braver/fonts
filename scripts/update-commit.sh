#!/bin/bash

name="$(basename $PWD)"

git add .
git commit -m "Update $name to $tag"
