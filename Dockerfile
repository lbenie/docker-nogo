FROM alpine:latest
MAINTAINER Lucien Bénié <lucien.benie@gmail.com>

ENV HUGO_VERSION=0.10
RUN apk add --update wget ca-certificates nodejs && \
  npm install -g npm@latest && \
  cd /tmp/ && \
  wget https://github.com/spf13/hugo/releases/download/v${HUGO_VERSION}/hugo_${HUGO_VERSION}_linux_amd64.tar.gz && \
  tar xzf hugo_${HUGO_VERSION}_linux_amd64.tar.gz && \
  rm -r hugo_${HUGO_VERSION}_linux_amd64.tar.gz && \
  mv hugo*/hugo* /usr/bin/hugo && \
  apk del wget ca-certificates && \
  rm /var/cache/apk/*
  
COPY ./hugo.sh /hugo.sh

VOLUME /src
VOLUME /output

WORKDIR /src
RUN chmod +x /hugo.sh
CMD ["/hugo.sh"]

expose 1313
