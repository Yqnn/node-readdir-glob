#!/bin/bash

export CDPATH=
cd `dirname "$0"`
cd ..

set -e

tmp=${TMPDIR:-/tmp}
bash ./scripts/make-benchmark-fixture.sh
wd=$PWD
cd $tmp/benchmark-fixture

node --prof -e '
  var glob=require(process.argv[1]);
  glob(".", {pattern:"**/*.txt"}, function (er, files) {
    console.log(files.length)
  })
  //console.log(glob.sync("**/*.txt").length);
  ' "$wd"
mv *v8.log "$wd/v8.log"
cd "$wd"
./node_modules/.bin/node-tick-processor > profile.txt

bash ./scripts/clean-benchmark-fixture.sh