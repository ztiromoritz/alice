#!/bin/bash
cd "$(dirname "$0")"
git archive master | tar -x -C ../alice/v1/

