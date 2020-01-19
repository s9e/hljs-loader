#!/bin/bash

cd "$(dirname $0)/../ext/highlight.js"
git pull

cd ../../scripts
php patchSource.php
./minify.sh
php patchReadme.php new
