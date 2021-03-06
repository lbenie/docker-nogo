const fs = require('fs');
const gulp = require('gulp');
const log = require('fancy-log');
const git = require('gulp-git');
const runSequence = require('run-sequence');
const exec = require('child_process').exec;

let version;

const bumpDockerFile = version => fs.readFile('Dockerfile', 'utf-8', (err, data) => {
  if (err) {
    log.error(err);
    exit(-1);
  }

  const result = data.replace(/\d.+$/, version);

  fs.writeFile('Dockerfile', result, 'utf-8', err => {
    if (err) {
      log.error(err);
      exit(-1);
    }
  });
});

gulp.task('bump-version', done => {
  exec("curl -L -s -H 'Accept: application/json' https://github.com/gohugoio/hugo/releases/latest", (err, stdout, stderr) => {
    if (err) {
      log.error(err);
      done(err);
    }

    if (stderr) {
      log.error(stderr);
      done(err);
    }

    version  = /\d.+/g.exec(JSON.parse(stdout).tag_name)[0];
    bumpDockerFile(version);
  });

  done();
});


gulp.task('push-changes', done => gulp
  .src('.')
  .pipe(git.commit('New release'))
  .pipe(git.push('origin', 'master', done)));


gulp.task('create-new-tag', done =>
  git.tag(`${version}`, `Created Tag for version: ${version}`, err => {
    if (err) {
      return done(err);
    }
    return git.push('origin', 'master', {
      args: '--tags',
    }, done);
  }));

gulp.task('release', done =>
  runSequence('bump-version', 'push-changes', 'create-new-tag', err => {
    if (err) {
      log.error(err.message);
    } else {
      log('RELEASE FINISHED SUCCESSFULLY');
    }
    done(err);
  }));

gulp.task('default', ['release']);
