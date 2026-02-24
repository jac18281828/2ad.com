# -------------------------------
# Stage 1: Build yamlfmt
# -------------------------------
FROM golang:1 AS go-builder
ARG TARGETARCH
WORKDIR /yamlfmt
RUN go install github.com/google/yamlfmt/cmd/yamlfmt@v0.16.0 && \
    strip "$(which yamlfmt)" && \
    yamlfmt --version

# -------------------------------
# Stage 2: node-js setup
# -------------------------------
FROM debian:stable-slim AS node-slim
RUN export DEBIAN_FRONTEND=noninteractive && \
    apt-get update && \
    apt-get install -y -q --no-install-recommends \
      ca-certificates curl git gnupg2 && \
    apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
ENV NODE_VERSION=v22.16.0
ENV NVM_DIR=/usr/local/nvm
RUN mkdir -p ${NVM_DIR}
ADD https://raw.githubusercontent.com/creationix/nvm/master/install.sh /usr/local/etc/nvm/install.sh
RUN bash /usr/local/etc/nvm/install.sh

# -------------------------------
# Stage 3: dev container setup
# -------------------------------
FROM debian:stable-slim

# need python for pelican
RUN export DEBIAN_FRONTEND=noninteractive && \
   apt-get update && \
   apt-get install -y -q --no-install-recommends \
     awscli \
     build-essential \
     curl \
     git \
     python3 \
     python3-pip \
     ripgrep \     
     sudo \
     unzip && \
   apt-get clean && \
   rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# User
ENV USER=2ad
RUN useradd --create-home --shell /bin/bash ${USER} && \
    usermod -a -G sudo ${USER} && \
    echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

# yamlfmt
COPY --chown=${USER}:${USER} --from=go-builder /go/bin/yamlfmt /go/bin/yamlfmt

# Switch user
USER 2ad
ENV PATH=${PATH}:/go/bin
ARG PROJECT=2ad.com
WORKDIR /workspaces/${PROJECT}

COPY --chown=${USER}:${USER} . .


# Node via NVM copied from node stage
ENV NODE_VERSION=v22.16.0
ENV NVM_DIR=/usr/local/nvm
ENV NVM_NODE_PATH=${NVM_DIR}/versions/node/${NODE_VERSION}
ENV NODE_PATH=${NVM_NODE_PATH}/lib/node_modules
ENV PATH=${NVM_NODE_PATH}/bin:$PATH
COPY --from=node-slim --chown=${USER}:${USER} /usr/local/nvm /usr/local/nvm
RUN bash -c ". $NVM_DIR/nvm.sh && nvm install $NODE_VERSION && nvm alias default $NODE_VERSION && nvm use default" && \
    npm install -g npm yarn


# Bun installer
ADD --chown=${USER}:${USER} --chmod=555 https://bun.sh/install /bun/install.sh
RUN /bun/install.sh

ENV PATH=${PATH}:/home/${USER}/.bun/bin

LABEL org.label-schema.name="aws2ad" \
    org.label-schema.description="2ad aws cdk deployment image" \
    org.label-schema.url="https://github.com/jac18281828/2ad.com" \
    org.label-schema.vcs-url="git@github.com:jac18281828/2ad.com.git" \
    org.label-schema.vendor="John Cairns" \
    org.label-schema.schema-version="1.0" \
    org.opencontainers.image.description="2ad aws cdk deployment image"
