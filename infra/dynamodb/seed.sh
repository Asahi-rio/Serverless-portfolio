#!/usr/bin/env bash
set -e
REGION="ap-northeast-1"

# admins 1件
aws dynamodb put-item --region "$REGION" --table-name admins --item '{
  "id": {"S": "admin001"},
  "password": {"S": "$2b$10$examplehash"}
}'

# tasks 1件
aws dynamodb put-item --region "$REGION" --table-name tasks --item '{
  "subject": {"S": "〇〇について"}
}'
echo "Seed inserted."

