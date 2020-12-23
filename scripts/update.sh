#!/bin/bash

cd "$(dirname $0)/../ext/highlight.js"
git fetch --tags -f
version=$(git tag -l --sort=version:refname | tail -n1)
git checkout "$version"

cd ../../scripts
php patchSource.php "$version"
./minify.sh
php patchReadme.php new
