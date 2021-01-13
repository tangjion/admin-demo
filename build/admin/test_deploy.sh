#!/bin/bash

# abort on errors
set -ex

PROJECT="klook-admin-traveller-platform-web"

function_copy(){
  rsync -r --exclude='node_modules' ./ $target_dir
  if [ "$?" = "1" ]; then
    echo "cp error and exit"
    exit 1
  fi
}

function_git_status(){
  echo "------ Last Commit: -------"
  git status | head -1
  git show -s --date=relative | head -3
  echo "-------------------------------"
}

function_checkout_branch(){
  git checkout -- .
  git fetch
  git checkout $branch
  if [ "$?" = "1" ]; then
      echo "checkout error and exit"
      exit 1
  fi
}

function_build(){
  if [ -f package-lock.json ]; then
    if npm ci; then
      success 'npm ci succeed'
    else
      error 'npm ci not enabled, use `npm install`'
      rm -rf node_modules
      npm install
      success 'npm install succeed'
    fi
  else
    error 'npm ci not enabled, use `npm install`'
    rm -rf node_modules
    npm install
    success 'npm install succeed'
  fi

  npm run build:stage:admin
  function_copy
  time_now=`date "+%Y-%m-%d %H:%M:%S"`
  commit_hash=`git log --pretty=oneline | head -n 1`
  echo "[$time_now] [build] branch=> $branch, hash => $commit_hash success " >> "/tmp/.${PROJECT}_log"
}

function_deploy(){
  deployDir="/srv/$PROJECT";

  if [ ! -d "$deployDir" ]; then
    mkdir -p $deployDir
  fi

  cd $deployDir
  # sync file from build folder to deploy folder
  echo -e "\033[32msync the dist from build to deploy.\033[0m"
  rsync -rvpog --checksum  "/opt/release/$PROJECT/" $deployDir

  time_now=`date "+%Y-%m-%d %H:%M:%S"`
  commit_hash=`git log --pretty=oneline | head -n 1`
  echo "[$time_now] [deploy] branch => $branch, node_env => $node_env , hash => $commit_hash success " >> "/srv/builds/.${PROJECT}_log"
}

function_change_node_version(){
  # use nvm
  . ~/.nvm/nvm.sh

  if [ "$NODE_ENV" = "test" ]; then
      node_env=$NODE_ENV
  fi


  echo "当前nvm版本"
  nvm --version

  test -n "$NODE_VERSION" || NODE_VERSION="v8.15.1"
  nvm use $NODE_VERSION || nvm install $NODE_VERSION

  echo "当前NODE_ENV"
  echo $node_env


  echo "当前node版本"
  node -v

  echo "当前npm版本"
  npm -v
}

msg() {
  printf '%b\n' "$1" >&2
}

success() {
  msg "\33[32m[✔]\33[0m ${1}${2}"
}

error() {
  msg "\33[31m[✘]\33[0m ${1}${2}"
}

cmd=$1 # build deploy
target_dir=$2 # test env dir
branch=$3 # branch name
node_env='production'

if [ -z "$branch" ]; then
  echo "\033[31mthe branch or tag or commit is null that default origin/master.\033[0m"
  branch='origin/master'
fi

function_change_node_version

if [ "$cmd" = "build" ]; then
  function_checkout_branch
  function_build
elif [ "$cmd" = "deploy" ]; then
  function_deploy
fi

function_git_status
success "Deploy succeed"
