# lbenie/nogo

`lbenie/nogo` is a [Docker](https://www.docker.io) base image for static sites generated with [Hugo](http://gohugo.io).

Thanks to [publysher](https://github.com/publysher) for inspiring this image.

In contrary of his docker image, I've added [nodejs](https://nodejs.org/) to the image since I needed `npm` to build my projects dependencies.

## Prerequisites

The image is based on the following directory structure:

	.
	├── Dockerfile
	└── site
	    ├── config.toml
	    ├── content
	    │   └── ...
	    ├── layouts
	    │   └── ...
	    └── static
		└── ...

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

`docker.compose.yml`
```Docker
hugo:
  image: lucienb/nogo:latest
  volumes:
    - ./src/:/src
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
    - 80
  restart: always
```

There are two options for using the image you generated: 

- as a stand-alone image
- as a volume image for your webserver

Using your image as a stand-alone image is the easiest:

	docker run -p 1313:1313 my/image

This will automatically start `hugo server`, and your blog is now available on http://localhost:1313. 

If you are using `boot2docker`, you need to adjust the base URL: 

	docker run -p 1313:1313 -e HUGO_BASE_URL=http://YOUR_DOCKER_IP:1313 my/image

The image is also suitable for use as a volume image for a web server, such as [nginx](https://registry.hub.docker.com/_/nginx/)

	docker run -d -v /usr/share/nginx/html --name site-data my/image
	docker run -d --volumes-from site-data --name site-server -p 80:80 nginx
