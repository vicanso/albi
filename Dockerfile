FROM mhart/alpine-node:base

ADD ./ /app

CMD cd /app && node app.js
