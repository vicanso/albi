!function(){"use strict";var e=angular.module("jt.service.httpLog",["LocalStorageModule"]),t=Date.now||function(){return(new Date).getTime()};e.factory("httpLog",["$q","$injector","CONST","localStorageService",function(e,r,n,o){function u(e){return e===f||-1!=e.indexOf("httplog=false")?!0:!1}function s(e,t){var r=e("JT-Deprecate");r&&"development"===n.env&&alert("url:"+t+"is deprecate, "+r)}function c(){o.set("httpLog",i)}function a(){var e=r.get("$http");(h.length||l.length)&&e.post(f,i).success(function(e){h.length=0,l.length=0,c(),setTimeout(a,g)}).error(function(e){setTimeout(a,g)})}var i=o.get("httpLog")||{success:[],error:[]},h=i.success,l=i.error,g=12e4,f="/sys/http-log";h.length+l.length>10?setTimeout(a,1):setTimeout(a,g);var p={request:function(e){return e._createdAt=t(),e},response:function(e){var r=e.config,n=r.url;if(s(e.headers,n),u(n))return e;var o=t()-r._createdAt;return h.push({url:n,method:r.method,use:o}),c(),e},requestError:function(t){return e.reject(t)},responseError:function(r){var n=r.config,o=n.url;return s(r.headers,o),u(o)?e.reject(r):(l.push({url:o,method:n.method,status:r.status,use:t()-n._createdAt}),c(),e.reject(r))}};return p}])}(this);