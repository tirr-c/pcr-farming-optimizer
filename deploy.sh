#!/bin/bash
set -euo pipefail; IFS=$'\n\t'

yarn build --prefix-paths
aws s3 --region "$REGION" sync \
  --acl public-read \
  --delete --exclude 'static/*' --exclude 'data/*' \
  public/ "${BUCKET}/farming-optimizer/"
aws s3 --region us-east-1 sync \
  --acl public-read --cache-control 'public, max-age=604800, immutable' \
  --delete \
  public/static/ "${BUCKET}/farming-optimizer/static/"
aws s3 --region us-east-1 sync \
  --acl public-read --cache-control 'no-cache' \
  --delete \
  public/data/ "${BUCKET}/farming-optimizer/data/"
