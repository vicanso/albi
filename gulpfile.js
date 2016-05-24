'use strict';
const gulp = require('gulp');
const del = require('del');
const stylus = require('gulp-stylus');
const base64 = require('gulp-base64');
const nib = require('nib');
const cssmin = require('gulp-cssmin');
const copy = require('gulp-copy');
const crc32 = require('buffer-crc32');
const path = require('path');
const through = require('through2');
const shell = require('gulp-shell');
const _ = require('lodash');
const fs = require('fs');
const assetsPath = 'assets';
// 保存静态文件的crc32版本号
const crc32Versions = {};
function version(opts) {
  function addVersion(file, encoding, cb) {
    let version = crc32.unsigned(file.contents);
    let extname = path.extname(file.path);
    let name = file.path.substring(file.base.length - 1);
    if (opts && opts.prefix) {
      name = opts.prefix + name;
    }
    crc32Versions[name] = version;
    file.path = file.path.replace(extname, '.' + version + extname);
    cb(null, file);
  }
  return through.obj(addVersion);
}

gulp.task('del:assets', function() {
  return del([assetsPath]);
});

gulp.task('del:build', function() {
  return del(['build']);
});

gulp.task('del:jspm', function() {
  return del(['jspm/config.*.js', 'jspm/bundles', 'jspm/packages/system.*.js']);
});
gulp.task('clean', ['crc32'], function() {
  return del(['build']);
});

gulp.task('reset', ['del:jspm', 'del:assets', 'del:build'], function() {
  return del(['jspm/packages', 'node_modules']);
});

gulp.task('stylus', ['del:assets', 'del:build'], function() {
  return gulp.src('public/**/*.styl')
    .pipe(stylus({
      use: nib()
    }))
    .pipe(base64())
    .pipe(cssmin())
    .pipe(gulp.dest('build'));
});

gulp.task('copy:others', ['del:assets', 'del:build'], function() {
  return gulp.src(['public/**/*',
    '!public/**/*.styl',
    '!public/**/*.js'
  ]).pipe(copy('build', {
    prefix: 1
  }));
});

gulp.task('static:css', ['stylus', 'copy:others'], function() {
  return gulp.src(['build/**/*.css'])
    .pipe(base64())
    .pipe(cssmin())
    .pipe(version())
    .pipe(gulp.dest(assetsPath));
});

gulp.task('static:js', ['copy:others'], function() {
  return gulp.src(['public/**/*.js', '!public/components/*.js'])
    .pipe(version())
    .pipe(gulp.dest(assetsPath));
});

gulp.task('jspm:bundle', ['del:jspm'], shell.task([
  'node node_modules/.bin/jspm bundle-sfx bootstrap.js jspm/bundles/bootstrap.js --inject --minify'
]));

gulp.task('static:jspm', ['jspm:bundle'], function() {
  return gulp.src(['jspm/*/system.js', 'jspm/config.js', 'jspm/*/bootstrap.js'])
    .pipe(version({
      prefix: '/jspm'
    }))
    .pipe(gulp.dest('jspm'));
});

gulp.task('static:img', ['copy:others'], function() {
  let maxSize = 10 * 1024;

  function sizeLimit(file, encoding, cb) {
    if (file.stat.size > maxSize) {
      let size = Math.ceil(file.stat.size / 1024);
      console.error('Warning, the size of ' + file.path + ' is ' +
        size + 'KB');
    }
    cb(null, file);
  }

  return gulp.src(['build/**/*.png', 'build/**/*.jpg',
      'build/**/*.gif', 'build/**/*.ico'
    ])
    .pipe(through.obj(sizeLimit))
    .pipe(version())
    .pipe(gulp.dest(assetsPath));
});

gulp.task('crc32', ['static:css', 'static:js', 'static:img', 'static:jspm'], function(cb) {
  const data = {};
  const keys = _.keys(crc32Versions).sort();
  _.forEach(keys, k => {
    data[k] = crc32Versions[k];
  });
  fs.writeFile(path.join(__dirname, 'versions.json'), JSON.stringify(data, null, 2), cb);
});

gulp.task('default', [
  'del:assets',
  'del:build',
  'stylus',
  'copy:others',
  'static:css',
  'static:js',
  'static:jspm',
  'crc32',
  'clean',
]);
