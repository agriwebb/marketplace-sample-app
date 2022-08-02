#!/usr/bin/env bash
set -euo pipefail

# aws sts assume-role --role-arn arn:aws:iam::${TARGET_ENV_ACCOUNT_ID}:role/system/ops-admin --role-session-name Buildkite
export $(printf "AWS_ACCESS_KEY_ID=%s AWS_SECRET_ACCESS_KEY=%s AWS_SESSION_TOKEN=%s" \
$(aws sts assume-role \
--role-arn arn:aws:iam::${ACCOUNT_ID}:role/system/ops-admin \
--role-session-name buildkite \
--query "Credentials.[AccessKeyId,SecretAccessKey,SessionToken]" \
--output text))

echo "--- :npm: Installing dependencies..."
npm ci

echo "--- :serverless: Deploy..."
npx serverless deploy --stage ${STAGE} --region ap-southeast-2 --verbose
