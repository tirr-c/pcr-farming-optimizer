#!/bin/bash
set -euo pipefail; IFS=$'\n\t'

aws s3 --region us-east-1 sync \
  --acl public-read --cache-control 'no-cache' \
  --delete --size-only \
  static/data/ "${BUCKET}/farming-optimizer/data/"
