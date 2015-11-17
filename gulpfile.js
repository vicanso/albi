'use strict';
const rename = require("gulp-rename");
const gulp = require('gulp');
const del = require('del');
const jshint = require('gulp-jshint');
const stylus = require('gulp-stylus');
const nib = require('nib');
const base64 = require('gulp-base64');
const cssmin = require('gulp-cssmin');
const jtDev = require('jtdev');
const path = require('path');
const copy = require('gulp-copy');
const uglify = require('gulp-uglify');
const through = require('through2');
const crc32 = require('buffer-crc32');
const fs = require('fs');
// 保存静态文件的crc32版本号
const crc32Versions = {};

const productPath = 'statics/asset';

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

gulp.task('del:asset', function() {
	return del([productPath]);
});

gulp.task('del:build', function() {
	return del(['statics/build']);
});

gulp.task('jshint:node', function() {
	return gulp.src(['*.js', '**/*.js', '!node_modules/**', '!statics/**'])
		.pipe(jshint({
			predef: ['require', 'module', 'localRequire'],
			node: true,
			esnext: true
		}))
		.pipe(jshint.reporter('default'));
});

gulp.task('jshint:web', ['del:asset', 'del:build'], function() {
	return gulp.src(['statics/**/*.js', '!statics/**/libs/*.js',
			'!statics/**/component/debug.js', '!statics/**/component/emitter.js',
			'!statics/**/component/ms.js', '!statics/**/component/store.js',
			'!statics/**/component/superagent.js', '!statics/**/component/url.js'
		])
		.pipe(jshint({
			predef: ['require', 'module', 'window', '_', 'requirejs'],
			node: true,
			esnext: true
		}))
		.pipe(jshint.reporter('default'));
});

gulp.task('stylus', ['del:asset', 'del:build'], function() {
	return gulp.src('statics/src/**/*.styl')
		.pipe(stylus({
			use: nib()
		}))
		.pipe(base64())
		.pipe(cssmin())
		.pipe(gulp.dest('statics/build'));
});

gulp.task('requirejs', ['del:asset', 'del:build'], function() {
	return gulp.src('statics/src/component/*.js')
		.pipe(jtDev.requirejs({
			basePath: path.join(__dirname, 'statics/src')
		}))
		.pipe(gulp.dest('statics/build/component'));
});

gulp.task('copy-others', ['del:asset', 'del:build'], function() {
	return gulp.src(['statics/**/*', '!statics/**/*.styl', '!statics/src/component/**'])
		.pipe(copy('statics/build', {
			prefix: 2
		}));
});

gulp.task('static-css', ['stylus', 'copy-others'], function() {
	return gulp.src(['statics/build/**/*.css'])
		.pipe(base64())
		.pipe(cssmin())
		.pipe(version())
		.pipe(gulp.dest(productPath));
});

gulp.task('static-js', ['requirejs', 'copy-others'], function() {
	return gulp.src(['statics/build/**/*.js'])
		.pipe(uglify())
		.pipe(version())
		.pipe(gulp.dest(productPath));
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

	return gulp.src(['statics/build/**/*.png', 'statics/build/**/*.jpg',
			'statics/build/**/*.gif', 'statics/build/**/*.ico'
		])
		.pipe(through.obj(sizeLimit))
		.pipe(version())
		.pipe(gulp.dest('statics/asset'));
});

gulp.task('crc32', ['static-css', 'static-js', 'static-img'], function(cb) {
	fs.writeFile(path.join(__dirname, 'crc32.json'), JSON.stringify(crc32Versions, null, 2), cb);
});

gulp.task('app-version', function(cb) {
	let file = path.join(__dirname, './package.json');
	var json = JSON.parse(fs.readFileSync(file));
	json.appVersion = (new Date()).toISOString();
	fs.writeFile(file, JSON.stringify(json, null, 2), cb);
});

// del:asset 清除生产环境的asset目录
// del:build 清除buid过程中生成的中间文件

// jshint:node node.js代码做jshint检测
// jshint:web web前端代码做jshint检测，依赖 del:asset, del:build

// stylus stylus to css，依赖 del:asset, del:build

// requirejs 为requirejs的模块添加define

// copy-others 复制其它文件到build目录下

// static-css 压缩css文件，依赖 styls, copy-others

// static-js 压缩js文件，依赖 requirejs, copy-others

// static-img 图片处理，依赖于copy-others

// crc32 文件版本号，依赖于static-css static-js static-img

// size-limit 依赖crc32

// app-version 生成版本号记录在package.json中

gulp.task('default', ['del:asset', 'del:build', 'jshint:node', 'jshint:web', 'stylus', 'requirejs', 'copy-others', 'static-css', 'static-js', 'static-img', 'crc32', 'app-version']);