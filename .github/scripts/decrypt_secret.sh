#!/bin/sh

# Decrypt the file
gpg --quiet --batch --yes --decrypt --passphrase="$GCP_JSON_KEY" \
--output xt-tickets/$GCP_JSON_KEY_NAME $GCP_JSON_KEY_NAME.gpg


