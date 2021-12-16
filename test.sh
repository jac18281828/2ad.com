#!/usr/bin/env bash

VERSION=$(date +%s)

PROJECT=jac18281828/2adwww

docker build . -t ${PROJECT}:${VERSION} && \
	docker run -p 8080:80 --rm -i -t ${PROJECT}:${VERSION}
