'use strict';
/**
 * [exports 响应ping请求]
 * @param  {[type]} url [description]
 * @return {[type]}     [description]
 */
module.exports = function(url){
  return function *(next){
    if(this.request.url === url){
      this.body = 'OK';
    }else{
      yield* next;
    }
  };
};