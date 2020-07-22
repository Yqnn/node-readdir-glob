#!/bin/bash

export CDPATH=
cd `dirname "$0"`
cd ..

bash ./scripts/make-benchmark-fixture.sh

tmp=${TMPDIR:-/tmp}
wd=$PWD
cd $tmp/benchmark-fixture

set -e

if [[ "`bash --version`" =~ version\ 4 ]]; then
  echo Bash timing:
  time bash -c 'shopt -s globstar; echo **/*.txt | wc -w'
fi

echo
if type zsh 2> /dev/null; then
  echo Zsh timing:
  time zsh -c 'echo **/*.txt | wc -w'
fi

echo

echo Node statSync and readdirSync timing:
time node -e '
  var fs=require("fs");
  var count = 0;
  function walk (path) {
    if (path.slice(-4) === ".txt") count++;
    var stat = fs.statSync(path);
    if (stat.isDirectory()) {
      fs.readdirSync(path).forEach(function(entry) {
        walk(path + "/" + entry);
      })
    }
  }
  walk(".");
  console.log(count)'
echo

echo Node glob timing:
time node -e '
  var glob=require(process.argv[1]);
  glob(".", {nodir: true} ,function (er, files) {
    console.log(files.length)
  })' "$wd"
echo

echo Node glob with pattern timing:
time node -e '
  var glob=require(process.argv[1]);
  glob(".", {pattern:"**/*.txt"}, function (er, files) {
    console.log(files.length)
  })' "$wd"
echo

echo Node glob with pattern and stat timing:
time node -e '
  var glob=require(process.argv[1]);
  glob(".", {stat:true, pattern:"**/*.txt"}, function (er, files) {
    console.log(files.length)
  })' "$wd"
echo

echo Node glob with pattern and follow timing:
time node -e '
  var glob=require(process.argv[1]);
  glob(".", {follow:true, pattern:"**/*.txt"}, function (er, files) {
    console.log(files.length)
  })' "$wd"
echo

echo Node glob with --prof
cd $wd
bash ./scripts/profile.sh


bash ./scripts/clean-benchmark-fixture.sh