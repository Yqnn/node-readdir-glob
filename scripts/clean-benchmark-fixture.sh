#!/bin/bash

tmp=${TMPDIR:-/tmp}

if [ -d "$tmp/benchmark-fixture" ]; then
  rm -rf "$tmp/benchmark-fixture"
fi
