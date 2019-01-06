'use strict';

/*
  Imports
*/
import gulp from 'gulp';
import browserSync from 'browser-sync';
import pkg from './package.json';
import beeper from 'beeper';
import header from 'gulp-header';
import rename from 'gulp-rename';
import eslint from 'gulp-eslint';
import moment from 'moment';
import uglify from 'gulp-uglify';
import del from 'del';
import nodemon from 'nodemon';
import babel from 'gulp-babel';

/*
  Paths
*/
const PATHS = {
    SRC: 'src/simpleParallax.js',
    DEST: 'dist/'
}

/*
  Create header via package.json to add in JS and CSS media files
*/
const now = moment().format('DD-MM-YYYY H:m:s');
const banner = [
    '/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @date: <%= now %>',
    ' * @link <%= pkg.homepage %>',
    ' */',
    ''
].join('\n');

/*
  Error catcher
*/
export function onError(err) {
    beeper(2);
    console.log(err);
    this.emit('end');
}

/*
  Clear JS
*/
export function clearJS() {
    return del(PATHS.DEST.js);
}

/*
  build JS
*/
export const build = () =>
    gulp
        .src(PATHS.SRC)
        .pipe(babel({
            presets: ['env']
        }))
        //.pipe(uglify())
        //.pipe(header(banner, { pkg: pkg, now: now }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(PATHS.DEST))
        .pipe(browserSync.reload({ stream: true }));

/*
  ES Lint
*/
export const esLint = () =>
    gulp
        .src(['src/simpleParallax.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());

/*
  GULP server
*/
export const develop = () =>
    nodemon({
        script: './server.js',
        ext: 'js',
        watch: ['gulpfile.js', 'server.js'],
        ignore: ['./node_modules/'],
        env: {
            NODE_ENV: 'development'
        }
    });

/*
  GULP BROWSERSYNC
*/
export const launchBrowserSync = () =>
    browserSync.init(null, {
        proxy: 'http://localhost:3000',
        browser: 'chrome',
        port: 3001,
        open: true,
        browser: 'chrome',
        logFileChanges: true,
        logConnections: false,
        injectChanges: true,
        timestamps: false,
        ghostMode: {
            clicks: true,
            forms: true,
            scroll: false
        }
    });

/*
  GULP Watch
*/
export const watch = () => {
    gulp.watch(PATHS.SRC, { interval: 1000 }, build);
};

/*
  TASK: Default
*/
const dev = gulp.series(
    gulp.parallel(build),
    gulp.parallel(launchBrowserSync, develop, watch)
);
gulp.task('dev', dev);
export default dev;
