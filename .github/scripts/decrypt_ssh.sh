#!/usr/bin/env bash

TARGET_SSH=${HOME}/.ssh

mkdir -m 700 -p ${TARGET_SSH}

for keyfile in www-key www-key.pub
do
    echo "Decrypt ${keyfile}"
    gpg \
        --quiet \
        --batch \
        --yes \
        --decrypt \
        --passphrase="${WWW_RSYNC}" \
        --output ${TARGET_SSH}/${keyfile} \
        .github/distribution/${keyfile}.gpg
    chmod 400 ${TARGET_SSH}/${keyfile}
    sha256sum ${TARGET_SSH}/${keyfile}
done


cat << CONFIG > ${HOME}/.ssh/config
Host *
  IdentitiesOnly=yes
Host 2ad.com
  IdentityFile ~/.ssh/www-key
Host github.com
  IdentityFile ~/.ssh/www-key
CONFIG


    
