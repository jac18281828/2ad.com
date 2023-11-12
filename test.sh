#!/usr/bin/env bash

VERSION=$(git rev-parse HEAD | cut -c 1-10)

PROJECT=jac18281828/2adcom

# list all config
# nginx -T

docker build . --progress plain -t ${PROJECT}:${VERSION} && \
    docker run -p 8080:80 --rm -i -t ${PROJECT}:${VERSION}

