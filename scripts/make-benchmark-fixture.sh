#!/bin/bash

export CDPATH=

tmp=${TMPDIR:-/tmp}
set -e
if ! [ -d $tmp/benchmark-fixture ]; then
  echo Making benchmark fixtures
  mkdir $tmp/benchmark-fixture
  cd $tmp/benchmark-fixture
  dirnames=`echo {0..9}/{0..9}/{0..9}/{0..9}` # 10000 dirs
  filenames=`echo {0..9}/{0..9}/{0..9}/{0..9}/{0..9}.txt`
  echo $dirnames | xargs mkdir -p
  echo $filenames | xargs touch
fi
