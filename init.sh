#!/bin/bash
set -e

printf "\e[95m_________ .__                   .___.__        
\_   ___ \|  | _____   __ __  __| _/|__|____   
/    \  \/|  | \__  \ |  |  \/ __ | |  \__  \  
\     \___|  |__/ __ \|  |  / /_/ | |  |/ __ \_
 \______  /____(____  /____/\____ | |__(____  /
        \/          \/           \/         \/ \e[0m\n"

printf "\e[1m> \e[33mClaudia Client\e[0m\e[1m initialisation script\e[0m\n"

BRANCH=$1
USERNAME=$2
TOKEN=$3
CURR_DIR=$PWD

# Check if branch is configured in args
if [ ! $BRANCH ]; then
  printf "  > Branch to init with:\e[0m\n"
  read -p "  > " BRANCH
fi

printf "\n\e[1m> Starting initialisation with branch:\e[0m\n"
printf "\e[34m  > ${BRANCH}\e[0m\n"

# Setup shared enviro
printf "\n\\e[1m> Installing \e[33mclaudia-shared\e[0m\e[1m environment\e[0m\n\n"

mkdir -p ../claudia-shared
cd ../claudia-shared

if [ ! -d "./.git" ]; then
  if [ $USERNAME ] && [ $TOKEN ]; then
    git clone -b $BRANCH "https://${USERNAME}:${TOKEN}@github.com/IronicPickle/claudia-shared.git" .
  else
    git clone -b $BRANCH git@github.com:IronicPickle/claudia-shared.git .
  fi
fi

cd $CURR_DIR

# Setup main enviro
printf "\n\\e[1m> Installing \e[33mclaudia-client\e[0m\e[1m environment\e[0m\n\n"

npm i

if [ ! -e .env ]; then
  printf "Generating .env file"
  echo "DENO_ENV=development" >> .env
  echo "" >> .env
  echo "VITE_DISCORD_CLIENT_ID=" >> .env
else
  printf ".env already exists, skipping..."
fi

printf "\n\\e[1m> Initialisation done, \e[33mClaudia Client\e[0m\e[1m ready\e[0m\n"
