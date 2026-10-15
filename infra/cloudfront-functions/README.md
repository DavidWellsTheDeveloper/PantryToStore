# CloudFront Functions

Edge functions associated with the Pantry to Store CloudFront distribution
(`EKBFC3WK2D7BU`, aliases `pantrytostore.com` and `www.pantrytostore.com`).

These run at the **viewer-request** stage, before the request reaches the S3
origin. They are version-controlled here so the URL/host behavior is reviewable
alongside the app, but deploying them is a manual AWS step (see below).

## `slash-normalize.js`

Handles URL canonicalization in a single 301 hop:

- **Host:** `www.pantrytostore.com` → `pantrytostore.com` (apex is canonical).
- **Path:** directory paths without a trailing slash get one appended
  (`/about` → `/about/`), matching the URLs emitted by the sitemap and
  canonical tags.
- **Rewrite:** directory requests are rewritten to `…/index.html` so S3 serves
  the pre-rendered page.

Requests with a file extension (`robots.txt`, `sitemap.xml`, `*.css`, …) are
passed through untouched except for the `www` host redirect.

This matters for SEO: the production host previously served both the `www` and
apex hostnames (duplicate content) and 301'd every subpath to a trailing slash
while the sitemap/canonicals declared the non-slash URL, which Search Console
flags as "Page with redirect".

## Deploying an update

CloudFront Functions are updated in two stages (DEVELOPMENT → LIVE):

```sh
# 1. Update the code (needs the current ETag from describe-function)
ETAG=$(aws cloudfront describe-function --name slash-normalize --query ETag --output text)
CODE_B64=$(base64 -w0 infra/cloudfront-functions/slash-normalize.js)
python3 - "$ETAG" "$CODE_B64" <<'PY' > /tmp/update-input.json
import json, sys
etag, code = sys.argv[1], sys.argv[2]
json.dump({
    "Name": "slash-normalize",
    "IfMatch": etag,
    "FunctionConfig": {
        "Comment": "301: www->apex, append trailing slash; rewrite dir -> index.html",
        "Runtime": "cloudfront-js-2.0",
    },
    "FunctionCode": code,
}, sys.stdout)
PY
aws cloudfront update-function --cli-input-json file:///tmp/update-input.json

# 2. Publish DEVELOPMENT -> LIVE
NEW_ETAG=$(aws cloudfront describe-function --name slash-normalize --query ETag --output text)
aws cloudfront publish-function --name slash-normalize --if-match "$NEW_ETAG"
```

The distribution already associates the function ARN at viewer-request, so no
distribution update is required — publishing to LIVE propagates it.

Verify:

```sh
curl -sI https://www.pantrytostore.com/about | grep -i location   # -> https://pantrytostore.com/about/
curl -sI https://pantrytostore.com/about   | grep -i location     # -> https://pantrytostore.com/about/
```
