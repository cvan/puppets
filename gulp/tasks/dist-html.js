'use strict';

const htmlminOptions = {
	removeComments: true,
	removeCommentsFromCDATA: true,
	removeCDATASectionsFromCDATA: true,
	collapseWhitespace: true,
	collapseBooleanAttributes: true,
	removeAttributeQuotes: true,
	removeRedundantAttributes: true,
	useShortDoctype: true,
	removeEmptyAttributes: true,
	removeScriptTypeAttributes: true,
	// lint: true,
	caseSensitive: true,
	minifyJS: true,
	minifyCSS: true
};

module.exports = function () {
	const gulp = require('gulp');
	const nunjucksRender = require('gulp-nunjucks-render');
	const data = require('gulp-data');
	const htmlmin = require('gulp-htmlmin');

	const config = require('../../config');
	const THREE = require('three');

	nunjucksRender.nunjucks.configure(['src/'], { watch: false });

	return gulp.src('src/html/index.html')
		.pipe(data(function (file) {
			const vars = {
				title: config.dev.title,
				scripts: [
					'index.js' //todo: use hash
				],
				ga: true
			};

			if (/^[0-9]+$/.test(THREE.REVISION)) {
				vars.scripts.unshift(
					// 'https://ajax.googleapis.com/ajax/libs/threejs/' + THREE.REVISION + '/three.min.js'
					'https://cdnjs.cloudflare.com/ajax/libs/three.js/' + THREE.REVISION + '/three.min.js'
				);
			}

			const firebaseVersion = require('firebase').SDK_VERSION;
			vars.scripts.unshift('https://www.gstatic.com/firebasejs/' + firebaseVersion + '/firebase.js');

			return vars;
		}))
		.pipe(nunjucksRender({
			path: 'src'
		}))
		.pipe(htmlmin(htmlminOptions))
		.pipe(gulp.dest('dist'));
};