var gulp = require('gulp');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var moment = require('moment');
var fs = require('fs');


gulp.task('jshint', function() {
  return gulp.src(['*.js', '**/*.js', '!node_modules/*.js', '!node_modules/**/*.js', '!statics/src/component/*.js'])
    .pipe(jshint({
      predef : ['require', 'module'],
      node : true,
      esnext : true
    }))
    .pipe(jshint.reporter('default'));
});


gulp.task('version', function(cbf) {
  var version = moment().format('YYYY-MM-DDTHH:mm:ss.SSS');
  var pm2Json = JSON.parse(fs.readFileSync('./pm2.json'));
  pm2Json.env.APP_VERSION = version;
  fs.writeFileSync('./pm2.json', JSON.stringify(pm2Json, null, 2));
  cbf();
});


gulp.task('default', ['jshint', 'version']);
