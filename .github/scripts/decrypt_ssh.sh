#!/usr/bin/env bash

mkdir -m 700 -p ~/.ssh

for keyfile in www-key www-key.pub
do
    echo "Decrypt ${keyfile}"
    gpg --quiet --batch --yes --decrypt --passphrase="${WWW_RSYNC}" --output ${HOME}/.ssh/${keyfile} .github/distribution/${keyfile}.gpg
    chmod 400 ${HOME}/.ssh/${keyfile}
    sha256sum ${HOME}/distribution/${keyfile}
done


cat << CONFIG > ${HOME}/.ssh/config
Host *
  IdentitiesOnly=yes
Host 2ad.com
  IdentityFile ~/.ssh/www-key
Host github.com
  IdentityFile ~/.ssh/www-key
CONFIG


    
