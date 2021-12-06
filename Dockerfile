ARG VERSION=stable-slim

FROM debian:${VERSION} 

RUN export DEBIAN_FRONTEND=noninteractive && \
        apt update && \
        apt install -y -q --no-install-recommends \
        build-essential python3 python3-pip git

RUN rm -rf /var/lib/apt/lists/*

WORKDIR /tools
ENV WORKPATH=/tools

COPY requirements.txt .

RUN python3 -m pip install --upgrade pip
RUN if [ -f requirements.txt ]; then python3 -m pip install -r requirements.txt; fi

RUN mkdir -p themes
RUN (cd themes && git clone https://github.com/alexandrevicenzi/Flex.git)

ADD . /htmltmp

WORKDIR /htmltmp

RUN for dir in 2ad emmycairns archiecairns minacairns kellycairns; do (cd $dir && ln -sf ${WORKPATH}/themes themes); done

CMD make -C 2ad html &&\
        make -C emmycairns html &&\
        make -C archiecairns html &&\
        make -C minacairns html &&\
        make -C kellycairns html 

