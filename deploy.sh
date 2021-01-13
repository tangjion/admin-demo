#!/bin/sh

# Lint script
##########################################################################
##                                                                      ##
## please lint your script at https://www.shellcheck.net/ when modified ##
##                                                                      ##
##########################################################################

# Abort on error
set -e

# Fetch code
function_checkout_branch() {
  git status
  git fetch -vap --quiet
  git checkout -- .
  git clean -fd
  branch=$1
  git checkout "$branch"
}

# Git status
function_git_status() {
  msg "------ Last Commit: -------"
  git status | head -1
  git show -s --date=relative | head -3
  msg "---------------------------"
}

# Node setting
function_node_setting() {
  if [ -f ~/.nvm/nvm.sh ]; then
    . ~/.nvm/nvm.sh
    test -n "$NODE_VERSION" || NODE_VERSION="v8.15.1"
    nvm use $NODE_VERSION || nvm install $NODE_VERSION
  else
    msg '[Warning]: nvm not found, use provided node env instead'
  fi

  # Env info
  node -v
  npm -v
  msg "NODE_ENV is: $NODE_ENV"
}

function_permission_check() {
  # msg "npm config get prefix: $(ls -al "$(npm config get prefix)")"
  # msg "npm prefix: $(ls -al "$(npm prefix)")"
  if [ ! -n "$(find "$(npm config get prefix)" -user "$(whoami)" -print -prune -o -prune)" ]; then
    msg 'chown npm config get prefix'
    sudo chown -R $(whoami) $(npm config get prefix)
  fi

  if [ ! -n "$(find "$(npm prefix)" -user "$(whoami)" -print -prune -o -prune)" ]; then
    msg 'chown npm prefix'
    sudo chown -R $(whoami) $(npm prefix)
  fi
}

function_install_and_build() {
  if [ -f package-lock.json ]; then
    if npm ci --unsafe-perm; then
      success 'npm ci succeed'
    else
      error 'npm ci not enabled, use `npm install --unsafe-perm`'
      rm -rf node_modules
      npm install --unsafe-perm
    fi
  else
    rm -rf node_modules
    npm install --unsafe-perm
  fi

  npm run build:prod
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

if [ -n "$1" ]; then
  # function_permission_check
  function_checkout_branch $1
  function_node_setting
  function_install_and_build
  function_git_status
  success "Deploy Completed!"
else
  error "Please input branch name!"
fi
