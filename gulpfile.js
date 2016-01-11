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
const shell = require('gulp-shell');
const fs = require('fs');
const _ = require('lodash');
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

gulp.task('del:jspm', function() {
	return del(['jspm/config.*.js', 'jspm/bundles', 'jspm/packages/system.*.js']);
});

gulp.task('del:assets', function() {
	return del([assetsPath]);
});

gulp.task('del:build', function() {
	return del(['build']);
});


gulp.task('clean', ['crc32'], function() {
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
		'!public/**/*.styl',
		'!public/**/*.js'
	]).pipe(copy('build', {
		prefix: 1
	}));
});


gulp.task('jspm-bundle', ['del:jspm'], shell.task([
	'node node_modules/.bin/jspm bundle-sfx bootstrap.js jspm/bundles/bootstrap.js --inject --minify'
]));



gulp.task('static-css', ['stylus', 'copy-others'], function() {
	return gulp.src(['build/**/*.css'])
		.pipe(base64())
		.pipe(cssmin())
		.pipe(version())
		.pipe(gulp.dest(assetsPath));
});

gulp.task('static-js', ['copy-others'], function() {
	return gulp.src(['public/**/*.js', '!public/components/*.js'])
		.pipe(version())
		.pipe(gulp.dest(assetsPath));
});

gulp.task('static-jspm', ['jspm-bundle'], function() {
	return gulp.src(['jspm/*/system.js', 'jspm/config.js', 'jspm/*/bootstrap.js'])
		.pipe(version({
			prefix: '/jspm'
		}))
		.pipe(gulp.dest('jspm'));
});


gulp.task('static-img', ['copy-others'], function() {
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

gulp.task('crc32', ['static-css', 'static-js', 'static-img', 'static-jspm'], function(cb) {
	const data = {};
	const keys = _.keys(crc32Versions).sort();
	_.forEach(keys, k => {
		data[k] = crc32Versions[k];
	});
	fs.writeFile(path.join(__dirname, 'versions.json'), JSON.stringify(data, null, 2), cb);
});

gulp.task('app-version', function(cb) {
	let file = path.join(__dirname, './package.json');
	var json = JSON.parse(fs.readFileSync(file));
	json.appVersion = (new Date()).toISOString();
	fs.writeFile(file, JSON.stringify(json, null, 2), cb);
});

// del:assets 清除生产环境的assets目录
// del:build 清除buid过程中生成的中间文件

// stylus stylus to css，依赖 del:assets, del:build

// copy-others 复制其它文件到build目录下

// static-css 压缩css文件，依赖 stylus, copy-others

// static-img 图片处理，依赖于copy-others

// crc32 文件版本号，依赖于static-css static-js static-img

// size-limit 依赖crc32

// app-version 生成版本号记录在package.json中

// node node_modules/.bin/jspm bundle js/bootstrap.js public/bundle/bootstrap.js --inject

gulp.task('default', [
	'del:assets',
	'del:build',
	'stylus',
	'copy-others',
	'static-css',
	'static-js',
	'static-jspm',
	'static-img',
	'crc32',
	'app-version',
	'clean'
]);