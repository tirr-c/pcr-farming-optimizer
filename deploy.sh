#!/bin/bash
set -euo pipefail; IFS=$'\n\t'

GATSBY_TELEMETRY_DISABLED=1 yarn build --prefix-paths
aws s3 --region "$REGION" sync \
  --acl public-read \
  --delete --exclude 'static/*' --exclude 'data/*' --exclude 'sw.js' \
  public/ "${BUCKET}/farming-optimizer/"
aws s3 --region us-east-1 sync \
  --acl public-read --cache-control 'public, max-age=604800, immutable' \
  --delete \
  public/static/ "${BUCKET}/farming-optimizer/static/"
aws s3 --region us-east-1 cp \
  --acl public-read --cache-control 'no-store' \
  public/sw.js "${BUCKET}/farming-optimizer/sw.js"
