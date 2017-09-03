FROM node:8-alpine

EXPOSE 5018

ADD ./ /app

RUN cd /app \
  && npm i \
  && npm run docs \
  && rm -rf node_modules \
  && npm i --production \
  && sh ./clear.sh
CMD ["node", "/app/app"]
