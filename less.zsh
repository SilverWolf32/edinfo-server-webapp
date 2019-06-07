#!/bin/zsh -f

for file in *.less; do
	lessc ${file} .compiledcss/${file%.less}.css
done
