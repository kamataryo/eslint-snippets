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
fi

echo 'publishing...'

rm -rf .git
rm -rf .bin
rm -rf node_modules
rm .gitignore
rm .travis_rsa.enc
rm .travis.yml
rm image.gif
rm yarn.lock

git init
git config user.name 'kamataryo@travis'
git config user.email "kamataryo@users.noreply.github.com"
git remote add origin git@github.com:kamataryo/eslint-snippets.git
git checkout -b latest

git add .
git commit -m"Release [ci skip]"
git push -f origin latest

apm publish patch
