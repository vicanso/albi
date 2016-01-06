'use strict';
const gulp = require('gulp');
const del = require('del');
const stylus = require('gulp-stylus');
const nib = require('nib');
const base64 = require('gulp-base64');
const cssmin = require('gulp-cssmin');
const copy = require('gulp-copy');
const through = require('through2');
const crc32 = require('buffer-crc32');
const path = require('path');
const assetsPath = 'assets'
	// 保存静态文件的crc32版本号
const crc32Versions = {};

function version(opts) {
	function addVersion(file, encoding, cb) {
		let version = crc32.unsigned(file.contents);
		let extname = path.extname(file.path);
		let name = file.path.substring(file.base.length - 1);
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


gulp.task('stylus', ['del:assets', 'del:build'], function() {
	return gulp.src('public/**/*.styl')
		.pipe(stylus({
			use: nib()
		}))
		.pipe(base64())
		.pipe(cssmin())
		.pipe(gulp.dest('build'));
});

gulp.task('copy-others', ['del:assets', 'del:build'], function() {
	return gulp.src(['public/**/*',
		'!jspm_packages',
		'!public/**/*.styl',
		'!public/**/*.js'
	]).pipe(copy('build', {
		prefix: 1
	}));
});

gulp.task('static-css', ['stylus', 'copy-others'], function() {
	return gulp.src(['build/**/*.css'])
		.pipe(base64())
		.pipe(cssmin())
		.pipe(version())
		.pipe(gulp.dest(assetsPath));
});

// del:assets 清除生产环境的assets目录
// del:build 清除buid过程中生成的中间文件

// stylus stylus to css，依赖 del:assets, del:build

// copy-others 复制其它文件到build目录下

// static-css 压缩css文件，依赖 stylus, copy-others

gulp.task('default', ['del:assets', 'del:build', 'stylus', 'copy-others', 'static-css']);