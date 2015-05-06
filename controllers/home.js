'use strict';
var debug = require('../helpers/debug');
module.exports = function *(){
  this.state.viewData = {
    name : 'abcd',
    globals : {
      test : 1
    }
  };
};