const gulp = require('gulp');
const webpack = require('webpack');
const exec = require('child_process').exec;
const util = require('gulp-util');
const gulpSequence = require('gulp-sequence');
const opn = require("opn");

const osSeparator = /^win/.test(process.platform) ? '&' : ';';

function spawnProcess(cmd, done) {
  const ls = exec(cmd);
  ls.stdout.on('data', data => { console.log(data); });
  ls.stderr.on('data', data => { console.log(data); });
  ls.on('close', () => { done && done(); });
}

gulp.task('local:web', done => { spawnProcess('cd merchants/web ' + osSeparator + 'webpack-dev-server', done); });

gulp.task('local:navigate', () => { opn("http://localhost:8080"); });

// Start application locally for development
gulp.task('local', gulpSequence(['local:web', 'local:navigate']));
