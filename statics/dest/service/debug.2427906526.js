!function(n){"use strict";function e(){}function t(n){var t=window.debug;if(t){var r=n.pattern;return r?t.enable(r):t.disable(),t}return function(){return e}}var r=angular.module("jt.service.debug",[]);t.$inject=["CONST"],r.factory("debug",t)}(this);