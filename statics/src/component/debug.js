/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug.debug = debug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = require('component/ms');

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lowercased letter, i.e. "n".
 */

exports.formatters = {};

/**
 * Previously assigned color.
 */

var prevColor = 0;

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 *
 * @return {Number}
 * @api private
 */

function selectColor() {
	return exports.colors[prevColor++ % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function debug(namespace) {

	// define the `disabled` version
	function disabled() {}
	disabled.enabled = false;

	// define the `enabled` version
	function enabled() {

		var self = enabled;

		// set `diff` timestamp
		var curr = +new Date();
		var ms = curr - (prevTime || curr);
		self.diff = ms;
		self.prev = prevTime;
		self.curr = curr;
		prevTime = curr;

		// add the `color` if not set
		if (null == self.useColors) self.useColors = exports.useColors();
		if (null == self.color && self.useColors) self.color = selectColor();

		var args = Array.prototype.slice.call(arguments);

		args[0] = exports.coerce(args[0]);

		if ('string' !== typeof args[0]) {
			// anything else let's inspect with %o
			args = ['%o'].concat(args);
		}

		// apply any `formatters` transformations
		var index = 0;
		args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
			// if we encounter an escaped % then don't increase the array index
			if (match === '%%') return match;
			index++;
			var formatter = exports.formatters[format];
			if ('function' === typeof formatter) {
				var val = args[index];
				match = formatter.call(self, val);

				// now we need to remove `args[index]` since it's inlined in the `format`
				args.splice(index, 1);
				index--;
			}
			return match;
		});

		if ('function' === typeof exports.formatArgs) {
			args = exports.formatArgs.apply(self, args);
		}
		var logFn = enabled.log || exports.log || console.log.bind(console);
		logFn.apply(self, args);
	}
	enabled.enabled = true;

	var fn = exports.enabled(namespace) ? enabled : disabled;

	fn.namespace = namespace;

	return fn;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
	exports.save(namespaces);

	var split = (namespaces || '').split(/[\s,]+/);
	var len = split.length;

	for (var i = 0; i < len; i++) {
		if (!split[i]) continue; // ignore empty strings
		namespaces = split[i].replace(/\*/g, '.*?');
		if (namespaces[0] === '-') {
			exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
		} else {
			exports.names.push(new RegExp('^' + namespaces + '$'));
		}
	}
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
	exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
	var i, len;
	for (i = 0, len = exports.skips.length; i < len; i++) {
		if (exports.skips[i].test(name)) {
			return false;
		}
	}
	for (i = 0, len = exports.names.length; i < len; i++) {
		if (exports.names[i].test(name)) {
			return true;
		}
	}
	return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
	if (val instanceof Error) return val.stack || val.message;
	return val;
}



exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome && 'undefined' != typeof chrome.storage ? chrome.storage.local : localstorage();

/**
 * Colors.
 */

exports.colors = [
	'lightseagreen',
	'forestgreen',
	'goldenrod',
	'dodgerblue',
	'darkorchid',
	'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
	// is webkit? http://stackoverflow.com/a/16459606/376773
	return ('WebkitAppearance' in document.documentElement.style) ||
		// is firebug? http://stackoverflow.com/a/398120/376773
		(window.console && (console.firebug || (console.exception && console.table))) ||
		// is firefox >= v31?
		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
		(navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
	return JSON.stringify(v);
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs() {
	var args = arguments;
	var useColors = this.useColors;

	args[0] = (useColors ? '%c' : '') + this.namespace + (useColors ? ' %c' : ' ') + args[0] + (useColors ? '%c ' : ' ') + '+' + exports.humanize(this.diff);

	if (!useColors) return args;

	var c = 'color: ' + this.color;
	args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));

	// the final "%c" is somewhat tricky, because there could be other
	// arguments passed either before or after the %c, so we need to
	// figure out the correct index to insert the CSS into
	var index = 0;
	var lastC = 0;
	args[0].replace(/%[a-z%]/g, function(match) {
		if ('%%' === match) return;
		index++;
		if ('%c' === match) {
			// we only are interested in the *last* %c
			// (the user may have provided their own)
			lastC = index;
		}
	});

	args.splice(lastC, 0, c);
	return args;
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
	// this hackery is required for IE8/9, where
	// the `console.log` function doesn't have 'apply'
	return 'object' === typeof console && console.log && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
	try {
		if (null == namespaces) {
			exports.storage.removeItem('debug');
		} else {
			exports.storage.debug = namespaces;
		}
	} catch (e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
	var r;
	try {
		r = exports.storage.debug;
	} catch (e) {}
	return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
	try {
		return window.localStorage;
	} catch (e) {}
}