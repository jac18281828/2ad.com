FROM debian:stable-slim as builder

RUN export DEBIAN_FRONTEND=noninteractive && \
    apt update && \
    apt install -y -q --no-install-recommends \
    build-essential \
    python3 python3-pip && \
    apt clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /tools
ENV WORKPATH=/tools

COPY requirements.txt .

RUN python3 -m pip install --upgrade pip
RUN if [ -f requirements.txt ]; then python3 -m pip install -r requirements.txt; fi

RUN mkdir -p themes
RUN (cd themes && git clone https://github.com/alexandrevicenzi/Flex.git)

ADD . /htmltmp

WORKDIR /htmltmp

RUN for dir in 2ad emmycairns archiecairns minacairns kellycairns; do ln -sf ${WORKPATH}/themes $dir/themes; done

RUN make -C 2ad html &&\
        make -C emmycairns html &&\
        make -C archiecairns html &&\
        make -C minacairns html &&\
        make -C kellycairns html

FROM nginx
ARG VERSION

COPY --from=builder /htmltmp/2ad/output /usr/share/nginx/html
COPY --from=builder /htmltmp/emmycairns/output /usr/share/nginx/emmycairns
COPY --from=builder /htmltmp/archiecairns/output /usr/share/nginx/archiecairns
COPY --from=builder /htmltmp/minacairns/output /usr/share/nginx/minacairns
COPY --from=builder /htmltmp/kellycairns/output /usr/share/nginx/kellycairns

COPY sites/ /etc/nginx/conf.d/

LABEL org.label-schema.build-date=$BUILD_DATE \
    org.label-schema.name="2ad.com" \
    org.label-schema.description="2ad.com website" \
    org.label-schema.url="https://github.com/jac18281828/2ad.com" \
    org.label-schema.vcs-ref=$VCS_REF \
    org.label-schema.vcs-url="git@github.com:jac18281828/2ad.com.git" \
    org.label-schema.vendor="John Cairns" \
    org.label-schema.version=$VERSION \
    org.label-schema.schema-version="1.0"
