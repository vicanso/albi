SRC = *.js \
	controllers/*.js \
	helpers/*.js \
	middlewares/*.js \
	tasks/*.js \
	services/*.js \
	router/*.js

TESTS = test/init.js \
	test/globals.js \
	test/helpers/*.js \
	test/middlewares/*.js \
	test/controllers/*.js \
	test/tasks/*.js \
	test/services/*.js \
	test/router.js

eslint:
	node ./node_modules/.bin/eslint \
		$(SRC)

cov:
	@NODE_ENV=test node \
		./node_modules/.bin/istanbul cover \
		./node_modules/.bin/_mocha \
		$(TESTS) \
		--

test:
	make eslint && make cov


build:
	node ./node_modules/.bin/gulp


init:
	npm install && node ./node_modules/.bin/jspm install


.PHONY: eslint cov test build init