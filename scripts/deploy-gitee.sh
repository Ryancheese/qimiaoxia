#!/usr/bin/env bash
set -euo pipefail

REPO_NAME="${GITEE_REPO:-ryan-toolbox}"
GITEE_USER="${GITEE_USER:?请设置环境变量 GITEE_USER（Gitee 用户名）}"
GITEE_TOKEN="${GITEE_TOKEN:?请设置环境变量 GITEE_TOKEN（私人令牌）}"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "→ 构建 Gitee Pages 产物…"
npm run build:gitee

echo "→ 确保远端仓库存在…"
HTTP_CODE=$(curl -s -o /tmp/gitee-repo.json -w "%{http_code}" \
  "https://gitee.com/api/v5/repos/${GITEE_USER}/${REPO_NAME}?access_token=${GITEE_TOKEN}")

if [[ "$HTTP_CODE" == "404" ]]; then
  echo "→ 创建仓库 ${GITEE_USER}/${REPO_NAME}…"
  curl -s -X POST "https://gitee.com/api/v5/user/repos" \
    -H "Content-Type: application/json;charset=UTF-8" \
    -d "{
      \"access_token\": \"${GITEE_TOKEN}\",
      \"name\": \"${REPO_NAME}\",
      \"description\": \"Ryan 的工具箱\",
      \"private\": false,
      \"has_issues\": true,
      \"has_wiki\": false,
      \"auto_init\": false
    }" >/tmp/gitee-create.json
  echo "  已创建"
elif [[ "$HTTP_CODE" == "200" ]]; then
  echo "  仓库已存在"
else
  echo "查询仓库失败 HTTP ${HTTP_CODE}"
  cat /tmp/gitee-repo.json
  exit 1
fi

echo "→ 推送 dist 到 gitee pages 分支…"
TMP="$(mktemp -d)"
cleanup() { rm -rf "$TMP"; }
trap cleanup EXIT

cp -R dist/. "$TMP/"
cd "$TMP"
git init -b pages
git config user.email "deploy@gitee.local"
git config user.name "Gitee Pages Deploy"
git add -A
git commit -m "deploy: Ryan 的工具箱"
git remote add origin "https://oauth2:${GITEE_TOKEN}@gitee.com/${GITEE_USER}/${REPO_NAME}.git"
git push -f origin pages

echo ""
echo "✓ 代码已推送"
echo "下一步（需在网页点一次）："
echo "1. 打开 https://gitee.com/${GITEE_USER}/${REPO_NAME}/pages"
echo "2. 部署分支选 pages，目录填 /"
echo "3. 勾选强制 HTTPS，点「启动」"
echo "4. 访问 https://${GITEE_USER}.gitee.io/${REPO_NAME}/"
