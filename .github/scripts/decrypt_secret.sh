#!/bin/sh

# Decrypt the file
mkdir ~/secrets
# --batch to prevent interactive command
# --yes to assume "yes" for questions $HOME
gpg --quiet --batch --yes --decrypt --passphrase="$GCP_JSON_KEY" \
--output ~/secrets/xtickets-ab876349e8b0.json xtickets-ab876349e8b0.json.gpg