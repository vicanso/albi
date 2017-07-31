FROM node:alpine

ADD ./ /app

RUN cd /app && npm i --production && sh ./clear.sh
CMD ["node", "/app/app"]