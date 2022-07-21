FROM alpine as client-local-build

RUN apk add --update nodejs npm

EXPOSE 3000

ARG APP_HOME=/app

WORKDIR ${APP_HOME}

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

COPY ./frontend/package*.json .

COPY ./frontend .

RUN npm install

RUN npm ci --production

RUN ["npm","run","build"]


FROM nginx:1.21-alpine
WORKDIR /usr/share/nginx/html
## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

COPY --from=client-local-build /app/build/ /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
COPY ./frontend/nginx/nginx.conf /etc/nginx/conf.d
CMD [ "nginx","-g","daemon off;" ]
