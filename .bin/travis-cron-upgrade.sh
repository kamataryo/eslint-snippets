#!/usr/bin/env bash
set -e

if [[ $TRAVIS_TAG != "" ]]; then
  echo "TRAVIS_TAG=$TRAVIS_TAG"
  echo 'Auto-upgrade will not be perfomed against tagged commit.'
  exit 0
fi

BRANCH_TO_DEPLOY="__travis-branch-to-deploy"

if [ $TRAVIS_EVENT_TYPE != "cron" ] || [ $TRAVIS_BRANCH != "master" ]; then
  echo "TRAVIS_EVENT_TYPE=$TRAVIS_EVENT_TYPE"
  echo "TRAVIS_BRANCH=$TRAVIS_BRANCH"
  echo 'Auto-upgrade will be perfomed only on cronjob and with `master` branch.'
  exit 0
fi

yarn upgrade
npm-check-updates -u

if [[ $(git --no-pager diff) == "" ]]; then
  echo 'nothing to deploy automatically.'
  exit 0
fi

git config user.name 'kamataryo@travis'
git config user.email "kamataryo@users.noreply.github.com"
git remote remove origin
git remote add origin git@github.com:$GH_REF.git

git branch $BRANCH_TO_DEPLOY

git checkout master
git add .
git commit -m "Upgrade package [made in travis cron]"
npm version patch -m "Upgrade package [made in travis cron]"

git checkout $BRANCH_TO_DEPLOY
