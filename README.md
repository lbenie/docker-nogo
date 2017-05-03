# lbenie/docker-nogo

[![Docker Build Statu](https://img.shields.io/docker/build/lucienb/docker-nogo.svg)]()
[![Docker Automated buil](https://img.shields.io/docker/automated/lucienb/docker-nogo.svg)]()
[![Docker Pulls](https://img.shields.io/docker/pulls/lucienb/docker-nogo.svg)]()
[![Docker Stars](https://img.shields.io/docker/stars/lucienb/docker-nogo.svg)]()

`lbenie/docker-nogo` is a [Docker](https://www.docker.io) base image for static sites generated with [Hugo](http://gohugo.io).

Thanks to [publysher](https://github.com/publysher) for inspiring this image.

In contrary of his docker image, I've added [nodejs](https://nodejs.org/) to the image since I needed `npm` to build my projects dependencies with bitbucket pipelines.
Also it contains openssh for transfering files with scp over my production server.

The build is relatively small at ~25MB.

## Prerequisites

The image is based on the following directory structure:
```
.
├── Dockerfile
├── docker-compose.yml
├── config.toml
├── content
│   └── ...
├── layouts
│   └── ...
└── static
    └── ...
```
### Dockerfile

```Docker
  FROM lucienb/docker-nogo:latest
```

## Building your site

Based on this structure, you can easily build an image for your site:
```sh
  docker build -t my/image .
```
Your site is automatically generated during this build. 

## Using your site

Using this docker image together with nginx for serving static data.

`docker-compose.yml`
```Docker
hugo:
  image: lucienb/docker-nogo:latest
  volumes:
    - .:/src
    - ./output/:/output
  environment:
    - HUGO_REFRESH_TIME=3600 # rebuilds the project every hour if HUGO_WATCH is not set
    - HUGO_THEME=mytheme
    - HUGO_BASEURL=mydomain.com
    - HUGO_WATCH=true # for development
  restart: always
web:
  image: jojomi/nginx-static
  volumes:
    - ./output:/var/www
  environment:
    - VIRTUAL_HOST=mydomain.com
  ports:
    - "80:80"
  restart: always
```

In your terminal run
```sh
docker-compose up
```

and Voilà !

Happy coding ;)
