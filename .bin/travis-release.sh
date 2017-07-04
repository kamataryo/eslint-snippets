#!/usr/bin/env bash
set -e

if [ $TRAVIS != "true" ]; then
  echo "deploying only from Travis CI environment."
  exit 0
fi

if [ $TRAVIS_BRANCH != "master" ]; then
  echo "not deploying from $TRAVIS_BRANCH."
  exit 0
fi

if [ $TRAVIS_TAG != "" ]; then
  echo "not deploying from $TRAVIS_TAG."
  exit 0
fi

git config user.name 'kamataryo@travis'
git config user.email "kamataryo@users.noreply.github.com"
git remote remove origin
git remote add origin git@github.com:kamataryo/eslint-snippets.git
git checkout master

# Auto upgrade
if [ $TRAVIS_EVENT_TYPE == "cron" ]; then
  echo 'Auto-upgrade is performing.'

  yarn upgrade
  npm-check-updates -u

  if [[ $(git --no-pager diff) != "" ]]; then
    # rebuild
    npm run build
    git add .
    git commit -m "Upgrade package [made in travis cron]"
    git push origin master
  fi
  exit 0
fi

echo 'publishing...'

LATEST_SNIPPETS=$(curl https://raw.githubusercontent.com/kamataryo/eslint-snippets/latest/snippets/eslint.cson)
BUILT_SNIPPETS=$(cat ./snippets/eslint.cson)

if [[ $LATEST_SNIPPETS == "$BUILT_SNIPPETS" ]]; then
  RELEASE=false
else
  RELEASE=true
fi

mkdir __dist
cp -r ./snippets ./__dist/
cp ./*.md ./__dist/
cp ./package.json ./__dist/

# format package and apm publish
pushd __dist
git init
git config user.name 'kamataryo@travis'
git config user.email "kamataryo@users.noreply.github.com"
git remote add origin git@github.com:kamataryo/eslint-snippets.git
git checkout -b latest
git add .
git commit -m"Release [ci skip]"
git push -f origin latest
if [[ $RELEASE == "true" ]]; then
  apm publish patch
else
  echo 'nothing to release.'
  exit 0
fi
popd

# sync the version number on master branch
rm -rf __dist
npm version patch
git commit --amend -m"Sync version [ci skip]"
git push origin master
