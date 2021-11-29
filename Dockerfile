ARG VERSION=stable-slim

FROM debian:${VERSION} 

RUN export DEBIAN_FRONTEND=noninteractive && \
        apt update && \
        apt install -y -q --no-install-recommends \
        build-essential python3 python3-pip 

RUN rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN python3 -m pip install --upgrade pip
RUN if [ -f requirements.txt ]; then python3 -m pip install -r requirements.txt; fi

ADD . /htmltmp

WORKDIR /htmltmp

CMD make -C 2ad html &&\
        make -C emmycairns html &&\
        make -C archiecairns html &&\
        make -C minacairns html &&\
        make -C kellycairns html 

