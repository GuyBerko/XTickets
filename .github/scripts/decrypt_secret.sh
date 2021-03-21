#!/bin/sh

# Decrypt the file
mkdir $HOME/secrets
# --batch to prevent interactive command
# --yes to assume "yes" for questions
gpg --quiet --batch --yes --decrypt --passphrase="$GCP_JSON_KEY" \
--output $HOME/xt-tickets/src/utils/xtickets-ab876349e8b0.json xtickets-ab876349e8b0.json.gpg