'use strict';

var gulp 						= require('gulp'),
		sass 						= require('gulp-sass'),
		bourbon 				= require('node-bourbon'),
		notify 					= require("gulp-notify"),
		plumber					= require("gulp-plumber"),
		autoprefixer 		= require('gulp-autoprefixer'),
		cleanCSS 				= require('gulp-clean-css'),
		rename 					= require('gulp-rename'),
		postcss 				= require('gulp-postcss'),
		mqpacker 				= require('css-mqpacker'),
		sourcemaps 			= require('gulp-sourcemaps'),
		gulpIf					= require('gulp-if'),
		del 						= require('del'),
		imagemin 				= require('gulp-imagemin'),
		cache 					= require('gulp-cache'),
		pngquant 				= require('imagemin-pngquant'),
		browserSync 		= require('browser-sync').create(),
		uglify 					= require('gulp-uglify'),
		include       	= require('gulp-include'),
		jade 						= require('gulp-jade'),
		spritesmith 		= require('gulp.spritesmith'),
		svgmin 					= require('gulp-svgmin'),
		svgstore 				= require('gulp-svgstore'),
		cheerio 				= require('gulp-cheerio'),
		replace 				= require('gulp-replace');

const pjson = require('./package.json');
const dirs = pjson.config.directories;
const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

gulp.task('browser-sync', function() {
	browserSync.init({
		server: 'app'
	});
	browserSync.watch('app/*.html').on('change', browserSync.reload);
	browserSync.watch('app/**/*.js').on('change', browserSync.reload);
});

gulp.task('jade', function() {
  return gulp.src('app/jade/*.jade')
  	.pipe(plumber({
			errorHandler: notify.onError()
		}))
    .pipe(jade({
    	pretty: true
    }))
    .pipe(gulp.dest('app/'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('scss', function () {
	return gulp.src(["app/blocks*/**/*.scss", "app/scss/**/*.scss"])
		.pipe(plumber({
			errorHandler: notify.onError()
		}))
		.pipe(gulpIf(isDevelopment, sourcemaps.init()))
		.pipe(sass({
			includePaths: bourbon.includePaths
		}))
		.pipe(autoprefixer(['last 15 versions']))
		.pipe(postcss([
			mqpacker({
				sort: true
			})
		]))
		.pipe(cleanCSS())
		.pipe(rename({suffix: '.min', prefix : ''}))
		.pipe(gulpIf(isDevelopment, sourcemaps.write()))
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task("libs:js", function() {
  return gulp.src(['app/libs/include-libs.js'])
    .pipe( include() )
    .pipe(rename('libs.min.js'))
    .pipe(uglify())
    .pipe( gulp.dest("app/js") )
});

gulp.task('blocks:js', function() {
	return gulp.src('app/blocks.project/includes.js')
		.pipe( include() )
    .pipe(rename('blocks.min.js'))
    .pipe(uglify())
		.pipe(gulp.dest('app/js'));
});

gulp.task('png-sprite', function () {
	var spriteData = gulp.src('app/img/icons/png/*.png')
		.pipe(spritesmith({
			imgName: 'png-sprite.png',
			cssName: '_png-sprite.scss',
			imgPath: '../img/png-sprite.png',
			padding: 3
		}));
	return spriteData.img.pipe(gulp.dest('app/img/')),
				 spriteData.css.pipe(gulp.dest('app/scss/'));
});

gulp.task('svg-sprite', function () {
  return gulp.src('app/img/icons/svg/*.svg')
  .pipe(svgmin())
	.pipe(cheerio({
		run: function ($) {
			//$('[fill]').removeAttr('fill');
			$('[stroke]').removeAttr('stroke');
			$('[style]').removeAttr('style');
		},
		parserOptions: {xmlMode: true}
	}))
	.pipe(replace('&gt;', '>'))
  .pipe(svgstore({
  	inlineSvg: true
  }))
  .pipe(rename('svg-sprite.svg'))
  .pipe(gulp.dest('app/img/'));
});

gulp.task('watch', function() {
	gulp.watch('app/**/*.jade', gulp.series('jade'));
	gulp.watch(['app/scss/**/*.scss', 'app/blocks*/**/*.scss'], gulp.series('scss'));
	gulp.watch('app/libs/include-libs.js', gulp.series('libs:js'));
	gulp.watch('app/blocks*/**/*.js', gulp.series('blocks:js'));
	gulp.watch('app/img/icons/png/*.png', gulp.series('png-sprite'));
	gulp.watch('app/img/icons/svg/*.svg', gulp.series('svg-sprite'));
});

gulp.task('clearcache', function (done) {
  return cache.clearAll(done);
});

gulp.task('default', gulp.parallel('watch', 'browser-sync'));

/*======= PRODUCTION =======*/
gulp.task('removedist', function() { 
	return del('dist'); 
});

gulp.task('assets', function () {
	return gulp.src(['app/*.html', 'app/css/*.css', 'app/js/**/*', 'app/fonts/**/*', 'app/.htaccess'], {base: 'app'})
		.pipe(gulp.dest('dist'));
});

gulp.task('imagemin', function() {
	return gulp.src('app/img/**/*')
		.pipe(cache(imagemin({
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest('dist/img')); 
});

gulp.task('build', gulp.series(
	'removedist', 'scss', 
	gulp.parallel('imagemin', 'assets')
));
/*======= PRODUCTION. END =======*/