# lbenie/nogo

`lbenie/nogo` is a [Docker](https://www.docker.io) base image for static sites generated with [Hugo](http://gohugo.io).

Thanks to [publysher](https://github.com/publysher) for inspiring this image.

In contrary of his docker image, I've added [nodejs](https://nodejs.org/) to the image since I needed `npm` to build my projects dependencies.

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
  FROM lucienb/nogo:latest
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
  image: lucienb/nogo:latest
  volumes:
    - .:/src
    - ./output/:/output
  environment:
    - HUGO_REFRESH_TIME=3600
    - HUGO_THEME=mytheme
    - HUGO_BASEURL=mydomain.com
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
```sh
docker-compose up
```

and Voila !

Happy coding
