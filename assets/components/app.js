webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var angular = __webpack_require__(2);
	var _ = __webpack_require__(4);
	var globals = __webpack_require__(8);

	var http = __webpack_require__(20);
	__webpack_require__(21);
	__webpack_require__(18);

	var app = angular.module(globals.get('CONFIG.app'), globals.getAngularModules());

	__webpack_require__(22);

	app.config(['$httpProvider', function ($httpProvider, CONST) {
		// 对ajax的请求添加特定header
		$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

		_.forEach(http.interceptors, function (interceptor) {
			$httpProvider.interceptors.push(interceptor);
		});
	}]).config(['$provide', function ($provide) {
		var params = ['$log', '$injector', angularErrorHandler];
		$provide.decorator('$exceptionHandler', params);
	}]);

	app.run(['rest', function (rest) {
		statistics(rest);
		init();
	}]);

	function statistics(rest) {
		// post performance
		var data = {
			screen: _.pick(globals.get('screen'), 'width height availWidth availHeight'.split(' ')),
			template: globals.get('CONFIG.template')
		};
		var timing = globals.get('TIMING');
		if (timing) {
			timing.end('page');
			data.timing = timing.toJSON();
		}

		var performance = globals.get('performance');
		if (performance) {
			data.performance = performance.timing;
			if (performance.getEntries) {
				data.entries = _.filter(performance.getEntries(), function (tmp) {
					return tmp.initiatorType !== 'xmlhttprequest';
				});
			}
		}
		rest.statistics(data);
	}

	function angularErrorHandler($log, $injector) {
		return function (exception, cause) {
			if (globals.get('CONFIG.env') === 'development') {
				alert(exception.message);
				$log.error.apply($log, arguments);
			} else {
				var rest = $injector.get('rest');
				rest.statsException({
					message: exception.message,
					stack: exception.stack,
					cause: cause,
					type: 'uncaughtException'
				});
			}
		};
	}

	function init() {
		globals.set('onerror', function (msg, url, line, row, err) {
			var stack = '';
			if (err) {
				stack = err.stack;
			}
			var data = {
				url: url,
				line: line,
				row: row,
				msg: msg,
				stack: stack,
				type: 'uncaughtException'
			};
			if (global.get('CONFIG.env') === 'development') {
				alert(JSON.stringify(data));
			}
			http.statsException(data);
		});
	}
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _ = __webpack_require__(4);
	var angularModule = [];
	// MOCK
	// TIMING
	// screen
	// CONFIG

	exports.get = get;
	exports.set = set;
	exports.addAngularModule = addAngularModule;
	exports.getAngularModules = getAngularModules;

	function get(path, defaultValue) {
		return _.get(window, path, defaultValue);
	}

	function set(path, value) {
		_.set(window, path, value);
	}

	function addAngularModule(name) {
		angularModule.push(name);
	}

	function getAngularModules() {
		return angularModule;
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

	var isarray = __webpack_require__(10);

	/**
	 * Expose `pathToRegexp`.
	 */
	module.exports = pathToRegexp;
	module.exports.parse = parse;
	module.exports.compile = compile;
	module.exports.tokensToFunction = tokensToFunction;
	module.exports.tokensToRegExp = tokensToRegExp;

	/**
	 * The main path matching regexp utility.
	 *
	 * @type {RegExp}
	 */
	var PATH_REGEXP = new RegExp([
	// Match escaped characters that would otherwise appear in future matches.
	// This allows the user to escape special characters that won't transform.
	'(\\\\.)',
	// Match Express-style parameters and un-named parameters with a prefix
	// and optional suffixes. Matches appear as:
	//
	// "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
	// "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
	// "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
	'([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))'].join('|'), 'g');

	/**
	 * Parse a string for the raw tokens.
	 *
	 * @param  {String} str
	 * @return {Array}
	 */
	function parse(str) {
	  var tokens = [];
	  var key = 0;
	  var index = 0;
	  var path = '';
	  var res;

	  while ((res = PATH_REGEXP.exec(str)) != null) {
	    var m = res[0];
	    var escaped = res[1];
	    var offset = res.index;
	    path += str.slice(index, offset);
	    index = offset + m.length;

	    // Ignore already escaped sequences.
	    if (escaped) {
	      path += escaped[1];
	      continue;
	    }

	    // Push the current path onto the tokens.
	    if (path) {
	      tokens.push(path);
	      path = '';
	    }

	    var prefix = res[2];
	    var name = res[3];
	    var capture = res[4];
	    var group = res[5];
	    var suffix = res[6];
	    var asterisk = res[7];

	    var repeat = suffix === '+' || suffix === '*';
	    var optional = suffix === '?' || suffix === '*';
	    var delimiter = prefix || '/';
	    var pattern = capture || group || (asterisk ? '.*' : '[^' + delimiter + ']+?');

	    tokens.push({
	      name: name || key++,
	      prefix: prefix || '',
	      delimiter: delimiter,
	      optional: optional,
	      repeat: repeat,
	      pattern: escapeGroup(pattern)
	    });
	  }

	  // Match any characters still remaining.
	  if (index < str.length) {
	    path += str.substr(index);
	  }

	  // If the path exists, push it onto the end.
	  if (path) {
	    tokens.push(path);
	  }

	  return tokens;
	}

	/**
	 * Compile a string to a template function for the path.
	 *
	 * @param  {String}   str
	 * @return {Function}
	 */
	function compile(str) {
	  return tokensToFunction(parse(str));
	}

	/**
	 * Expose a method for transforming tokens into the path function.
	 */
	function tokensToFunction(tokens) {
	  // Compile all the tokens into regexps.
	  var matches = new Array(tokens.length);

	  // Compile all the patterns before compilation.
	  for (var i = 0; i < tokens.length; i++) {
	    if (_typeof(tokens[i]) === 'object') {
	      matches[i] = new RegExp('^' + tokens[i].pattern + '$');
	    }
	  }

	  return function (obj) {
	    var path = '';
	    var data = obj || {};

	    for (var i = 0; i < tokens.length; i++) {
	      var token = tokens[i];

	      if (typeof token === 'string') {
	        path += token;

	        continue;
	      }

	      var value = data[token.name];
	      var segment;

	      if (value == null) {
	        if (token.optional) {
	          continue;
	        } else {
	          throw new TypeError('Expected "' + token.name + '" to be defined');
	        }
	      }

	      if (isarray(value)) {
	        if (!token.repeat) {
	          throw new TypeError('Expected "' + token.name + '" to not repeat, but received "' + value + '"');
	        }

	        if (value.length === 0) {
	          if (token.optional) {
	            continue;
	          } else {
	            throw new TypeError('Expected "' + token.name + '" to not be empty');
	          }
	        }

	        for (var j = 0; j < value.length; j++) {
	          segment = encodeURIComponent(value[j]);

	          if (!matches[i].test(segment)) {
	            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"');
	          }

	          path += (j === 0 ? token.prefix : token.delimiter) + segment;
	        }

	        continue;
	      }

	      segment = encodeURIComponent(value);

	      if (!matches[i].test(segment)) {
	        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"');
	      }

	      path += token.prefix + segment;
	    }

	    return path;
	  };
	}

	/**
	 * Escape a regular expression string.
	 *
	 * @param  {String} str
	 * @return {String}
	 */
	function escapeString(str) {
	  return str.replace(/([.+*?=^!:${}()[\]|\/])/g, '\\$1');
	}

	/**
	 * Escape the capturing group by escaping special characters and meaning.
	 *
	 * @param  {String} group
	 * @return {String}
	 */
	function escapeGroup(group) {
	  return group.replace(/([=!:$\/()])/g, '\\$1');
	}

	/**
	 * Attach the keys as a property of the regexp.
	 *
	 * @param  {RegExp} re
	 * @param  {Array}  keys
	 * @return {RegExp}
	 */
	function attachKeys(re, keys) {
	  re.keys = keys;
	  return re;
	}

	/**
	 * Get the flags for a regexp from the options.
	 *
	 * @param  {Object} options
	 * @return {String}
	 */
	function flags(options) {
	  return options.sensitive ? '' : 'i';
	}

	/**
	 * Pull out keys from a regexp.
	 *
	 * @param  {RegExp} path
	 * @param  {Array}  keys
	 * @return {RegExp}
	 */
	function regexpToRegexp(path, keys) {
	  // Use a negative lookahead to match only capturing groups.
	  var groups = path.source.match(/\((?!\?)/g);

	  if (groups) {
	    for (var i = 0; i < groups.length; i++) {
	      keys.push({
	        name: i,
	        prefix: null,
	        delimiter: null,
	        optional: false,
	        repeat: false,
	        pattern: null
	      });
	    }
	  }

	  return attachKeys(path, keys);
	}

	/**
	 * Transform an array into a regexp.
	 *
	 * @param  {Array}  path
	 * @param  {Array}  keys
	 * @param  {Object} options
	 * @return {RegExp}
	 */
	function arrayToRegexp(path, keys, options) {
	  var parts = [];

	  for (var i = 0; i < path.length; i++) {
	    parts.push(pathToRegexp(path[i], keys, options).source);
	  }

	  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

	  return attachKeys(regexp, keys);
	}

	/**
	 * Create a path regexp from string input.
	 *
	 * @param  {String} path
	 * @param  {Array}  keys
	 * @param  {Object} options
	 * @return {RegExp}
	 */
	function stringToRegexp(path, keys, options) {
	  var tokens = parse(path);
	  var re = tokensToRegExp(tokens, options);

	  // Attach keys back to the regexp.
	  for (var i = 0; i < tokens.length; i++) {
	    if (typeof tokens[i] !== 'string') {
	      keys.push(tokens[i]);
	    }
	  }

	  return attachKeys(re, keys);
	}

	/**
	 * Expose a function for taking tokens and returning a RegExp.
	 *
	 * @param  {Array}  tokens
	 * @param  {Array}  keys
	 * @param  {Object} options
	 * @return {RegExp}
	 */
	function tokensToRegExp(tokens, options) {
	  options = options || {};

	  var strict = options.strict;
	  var end = options.end !== false;
	  var route = '';
	  var lastToken = tokens[tokens.length - 1];
	  var endsWithSlash = typeof lastToken === 'string' && /\/$/.test(lastToken);

	  // Iterate over the tokens and create our regexp string.
	  for (var i = 0; i < tokens.length; i++) {
	    var token = tokens[i];

	    if (typeof token === 'string') {
	      route += escapeString(token);
	    } else {
	      var prefix = escapeString(token.prefix);
	      var capture = token.pattern;

	      if (token.repeat) {
	        capture += '(?:' + prefix + capture + ')*';
	      }

	      if (token.optional) {
	        if (prefix) {
	          capture = '(?:' + prefix + '(' + capture + '))?';
	        } else {
	          capture = '(' + capture + ')?';
	        }
	      } else {
	        capture = prefix + '(' + capture + ')';
	      }

	      route += capture;
	    }
	  }

	  // In non-strict mode we allow a slash at the end of match. If the path to
	  // match already ends with a slash, we remove it for consistency. The slash
	  // is valid at the end of a path match, not in the middle. This is important
	  // in non-ending mode, where "/test/" shouldn't match "/test//route".
	  if (!strict) {
	    route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?';
	  }

	  if (end) {
	    route += '$';
	  } else {
	    // In non-ending mode, we need the capturing groups to match as much as
	    // possible by using a positive lookahead to the end or next path segment.
	    route += strict && endsWithSlash ? '' : '(?=\\/|$)';
	  }

	  return new RegExp('^' + route, flags(options));
	}

	/**
	 * Normalize the given path string, returning a regular expression.
	 *
	 * An empty array can be passed in for the keys, which will hold the
	 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
	 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
	 *
	 * @param  {(String|RegExp|Array)} path
	 * @param  {Array}                 [keys]
	 * @param  {Object}                [options]
	 * @return {RegExp}
	 */
	function pathToRegexp(path, keys, options) {
	  keys = keys || [];

	  if (!isarray(keys)) {
	    options = keys;
	    keys = [];
	  } else if (!options) {
	    options = {};
	  }

	  if (path instanceof RegExp) {
	    return regexpToRegexp(path, keys, options);
	  }

	  if (isarray(path)) {
	    return arrayToRegexp(path, keys, options);
	  }

	  return stringToRegexp(path, keys, options);
	}

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';

	module.exports = Array.isArray || function (arr) {
	  return Object.prototype.toString.call(arr) == '[object Array]';
	};

/***/ },
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var debug = __webpack_require__(14);
	var global = __webpack_require__(8);
	var pattern = global.get('CONFIG.pattern');
	var app = global.get('CONFIG.app');
	if (pattern) {
		debug.names.push(new RegExp('^' + pattern.replace(/\*/g, '.*?') + '$'));
	}

	module.exports = debug('jt.' + app);

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(19);

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var angular = __webpack_require__(2);
	var globals = __webpack_require__(8);
	var moduleName = 'jt.lazy-load';
	globals.addAngularModule(moduleName);

	var angularModuel = angular.module(moduleName, []);

	angularModuel.directive('lazyLoadImage', lazyLoadImage);

	function lazyLoadImage() {
		function link(scope, element, attr) {
			var imgSrc = attr.imageSrc;
			if (imgSrc) {
				element.append('<img src="' + imgSrc + '" />');
			}
		}

		return {
			restrict: 'A',
			link: link
		};
	}

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var globals = __webpack_require__(8);
	var angular = __webpack_require__(2);
	var debug = __webpack_require__(17);
	var pathToRegexp = __webpack_require__(9);
	var moduleName = 'jt.http';

	var interceptors = [globalRequestHandler];

	var angularModule = angular.module(moduleName, []);

	angularModule.factory('rest', ['$http', service]);
	globals.addAngularModule(moduleName);

	exports.interceptors = interceptors;
	exports.timeout = 5 * 1000;

	function service($http) {
		return {
			parse: function parse(desc) {
				return _parse($http, desc);
			},
			statistics: _parse($http, 'POST /stats/statistics'),
			statsAjax: getDebouncePost($http, '/stats/ajax'),
			statsException: getDebouncePost($http, '/stats/exception')
		};
	}

	var isReject = (function () {
		var prefix = globals.get('CONFIG.appUrlPrefix', '');
		var rejectUrls = _.map(['/sys/', '/stats/'], function (item) {
			return prefix + item;
		});
		debug('rejectUrls:%j', rejectUrls);
		return function (url) {
			return !!_.find(rejectUrls, function (item) {
				return url.indexOf(item) === 0;
			});
		};
	})();

	/**
	 * [globalRequestHandler description]
	 */
	function globalRequestHandler($q, $injector) {
		var prefix = globals.get('CONFIG.appUrlPrefix', '');
		var uuid = 0;
		var doningRequest = {};

		function begin(config) {
			var key = config.method + config.url;
			var requestId = ++uuid;
			debug('request[%d] %s', requestId, key);
			if (!doningRequest[key]) {
				doningRequest[key] = 0;
			}

			var count = ++doningRequest[key];

			if (count > 1) {
				// 相同的请求同时并发数超过1
				var rest = $injector.get('rest');
				debug('parallelRequest:%s', key);
				rest.statsException({
					key: key,
					count: count,
					type: 'parallelRequest'
				});
			}
			config._startAt = Date.now();
		}

		function end(config, res) {
			var method = config.method;
			var url = config.url;
			var key = method + url;
			doningRequest[key]--;
			if (isReject(url)) {
				return;
			};
			var data = {
				method: method,
				url: url,
				use: Date.now() - config._startAt,
				status: _.get(res, 'status', -1),
				hit: false
			};
			if (res && parseInt(res.headers('X-Hits') || 0)) {
				data.hit = true;
			}
			var rest = $injector.get('rest');
			rest.statsAjax(data);
		}

		return {
			request: function request(config) {
				config.url = prefix + config.url;
				begin(config);
				return config;
			},
			requestError: function requestError(rejection) {
				end(rejection.config);
				return $q.reject(rejection);
			},
			response: function response(res) {
				end(res.config, res);
				return res;
			},
			responseError: function responseError(rejection) {
				end(rejection.config);
				return $q.reject(rejection);
			}
		};
	}
	globalRequestHandler.$inject = ['$q', '$injector'];

	function _parse($http, desc) {
		var arr = desc.split(' ');
		if (arr.length < 2) {
			throw new Error('request description is invalid');
		}
		var method = arr[0].toUpperCase();
		var url = arr[1];
		var paramKeys = pathToRegexp(url).keys;
		return function () {
			var args = _.toArray(arguments);
			var cloneUrl = url;
			_.forEach(paramKeys, function (key) {
				cloneUrl = cloneUrl.replace(':' + key.name, args.shift());
			});
			var data = args[0];
			var headers = args[1];
			var options = {
				method: method,
				url: cloneUrl
			};
			if (exports.timeout) {
				options.timeout = exports.timeout;
			}
			if (method === 'GET' || method === 'DELETE' || method === 'HEAD') {
				options.params = data;
			} else {
				options.data = data;
			}
			return $http(options);
		};
	}

	function getDebouncePost($http, url, interval) {
		interval = interval || 3000;
		var dataList = [];
		var post = _parse($http, 'POST ' + url);
		var debouncePost = _.debounce(function () {
			post(dataList.slice());
			dataList.length = 0;
		}, interval);
		return function (data) {
			if (data) {
				if (_.isArray(data)) {
					dataList.push.apply(dataList, data);
				} else {
					dataList.push(data);
				}
				debouncePost();
			}
		};
	}

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var globals = __webpack_require__(8);
	var angular = __webpack_require__(2);
	var _ = __webpack_require__(4);
	var debug = __webpack_require__(17);
	var moduleName = 'jt.dom';
	globals.addAngularModule(moduleName);

	var angularModule = angular.module(moduleName, []);

	angularModule.factory('dom', service);

	function service($rootScope, $window) {
		var scope = $rootScope.$new();

		angular.element($window).on('scroll', _.throttle(function () {
			var offset = {
				top: $window.pageYOffset,
				left: $window.pageXOffset,
				height: $window.innerHeight
			};
			scope.$emit('scroll', offset);
		}, 300));

		return {
			on: _.bind(scope.$on, scope)
		};
	}

	service.$inject = ['$rootScope', '$window'];

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var angular = __webpack_require__(2);
	var globals = __webpack_require__(8);

	ctrl.$inject = ['$scope'];

	angular.module(globals.get('CONFIG.app')).controller('NavController', ctrl);

	function ctrl($scope) {
		var self = this;

		self.selected = function (url, e) {
			console.dir(url);
			e.preventDefault();
		};

		return self;
	}

/***/ }
]);