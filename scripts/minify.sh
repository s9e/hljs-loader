#!/bin/bash
cd "$(dirname $0)/.."

BIN=./node_modules/google-closure-compiler-linux/compiler
IN=./loader.js
OUT=./loader.min.js

if [ ! -f $BIN ];
then
	npm install google-closure-compiler-linux
fi

$BIN                      \
	-O ADVANCED           \
	-W VERBOSE            \
	--jscomp_error "*"    \
	--js $IN              \
	--js_output_file $OUT
