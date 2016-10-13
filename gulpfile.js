/* eslint import/no-extraneous-dependencies:0 */
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
    const v = crc32.unsigned(file.contents);
    const extname = path.extname(file.path);
    let name = file.path.substring(file.base.length - 1);
    if (opts && opts.prefix) {
      name = opts.prefix + name;
    }
    crc32Versions[name] = v;
    /* eslint no-param-reassign:0 */
    file.path = file.path.replace(extname, `.${v}${extname}`);
    cb(null, file);
  }
  return through.obj(addVersion);
}

gulp.task('del:assets', () => del([assetsPath]));

gulp.task('del:build', () => del(['build']));

gulp.task('del:jspm', () => del(['jspm/config.*.js', 'jspm/bundles', 'jspm/packages/system.*.js']));
gulp.task('clean', ['crc32'], () => del(['build']));

/* eslint max-len:0 */
gulp.task('reset', ['del:jspm', 'del:assets', 'del:build'], () => del(['jspm/packages', 'node_modules']));

gulp.task('stylus', ['del:assets', 'del:build'], () => gulp.src('public/**/*.styl')
  .pipe(stylus({
    use: nib(),
  }))
  .pipe(base64())
  .pipe(cssmin())
  .pipe(gulp.dest('build'))
);

gulp.task('copy:others', ['del:assets', 'del:build'], () => gulp.src(['public/**/*',
    '!public/**/*.styl',
    '!public/**/*.js',
  ]).pipe(copy('build', {
    prefix: 1,
  }))
);

gulp.task('static:css', ['stylus', 'copy:others'], () => gulp.src(['build/**/*.css'])
  .pipe(base64())
  .pipe(cssmin())
  .pipe(version())
  .pipe(gulp.dest(assetsPath))
);

gulp.task('static:js', ['copy:others'], () => gulp.src(['public/**/*.js', '!public/components/*.js'])
  .pipe(version())
  .pipe(gulp.dest(assetsPath))
);

gulp.task('jspm:bundle', ['del:jspm'], shell.task([
  'node node_modules/.bin/jspm bundle-sfx bootstrap.js jspm/bundles/bootstrap.js --inject --minify',
]));

gulp.task('static:jspm', ['jspm:bundle'], () => gulp.src(['jspm/*/system.js', 'jspm/config.js', 'jspm/*/bootstrap.js'])
  .pipe(version({
    prefix: '/jspm',
  }))
  .pipe(gulp.dest('jspm'))
);

gulp.task('static:img', ['copy:others'], () => {
  const maxSize = 10 * 1024;

  const sizeLimit = (file, encoding, cb) => {
    if (file.stat.size > maxSize) {
      const size = Math.ceil(file.stat.size / 1024);
      console.error(`Warning, the size of ${file.path} is ${size}KB`);
    }
    cb(null, file);
  };

  return gulp.src([
    'build/**/*.png',
    'build/**/*.jpg',
    'build/**/*.gif',
    'build/**/*.ico',
  ])
  .pipe(through.obj(sizeLimit))
  .pipe(version())
  .pipe(gulp.dest(assetsPath));
});

gulp.task('crc32', ['static:css', 'static:js', 'static:img', 'static:jspm'], (cb) => {
  const data = {};
  const keys = _.keys(crc32Versions).sort();
  _.forEach(keys, (k) => {
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
