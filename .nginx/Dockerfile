FROM nginx:latest

ARG IMAGE_NAME_3000
ARG IMAGE_NAME_3001
ARG IMAGE_NAME_3002

COPY . ./

RUN sed -i "s/{IMAGE_NAME_3000}/$IMAGE_NAME_3000/" nginx.conf
RUN sed -i "s/{IMAGE_NAME_3001}/$IMAGE_NAME_3001/" nginx.conf
RUN sed -i "s/{IMAGE_NAME_3002}/$IMAGE_NAME_3002/" nginx.conf

RUN mv nginx.conf /etc/nginx/nginx.conf
