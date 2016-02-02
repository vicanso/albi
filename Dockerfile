FROM vicanso/node

ADD ./ /app

RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
	&& cd /app \
	&& npm rebuild --registry=https://registry.npm.taobao.org --disturl=https://npm.taobao.org/dist

CMD cd /app && node app.js