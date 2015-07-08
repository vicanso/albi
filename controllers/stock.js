'use strict';
const httpRequest = require('../helpers/http-request');
const _ = require('lodash');
exports.get = get;

function *get() {
  /*jshint validthis:true */
  let ctx = this;
  let url = 'http://ichart.yahoo.com/table.csv?s=' + ctx.params.code + '.SS&a=00&b=01&c=2015&d=06&e=01&f=2015&g=d';
  let result = yield httpRequest.get(url);
  let arr = result.split('\n');
  arr.shift();
  this.body = _.map(arr, function (str) {
    let tmpArr = str.split(',');
    return {
      date : tmpArr[0],
      open : tmpArr[1],
      high : tmpArr[2],
      low : tmpArr[3],
      close : tmpArr[4],
      volume : tmpArr[5]
    };
  });
}
