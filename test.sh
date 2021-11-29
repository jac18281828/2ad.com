#!/usr/bin/env bash

VERSION=$(date +%s)

docker build . -t 2adwww:${VERSION} && \
	docker run --rm -i -t 2adwww:${VERSION}
