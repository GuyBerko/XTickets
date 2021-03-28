#!/bin/sh

# Decrypt the file
mkdir $HOME/secrets
# --batch to prevent interactive command
# --yes to assume "yes" for questions 
gpg --quiet --batch --yes --decrypt --passphrase="$GCP_JSON_KEY" \
--output xt-tickets/$GCP_JSON_KEY_NAME $GCP_JSON_KEY_NAME.gpg


