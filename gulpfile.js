const fs = require('fs');
const gulp = require('gulp');
const log = require('fancy-log');
const git = require('gulp-git');
const bump = require('gulp-bump');
const minimist = require('minimist');
const runSequence = require('run-sequence');
const changelog = require('gulp-conventional-changelog');

const version = () => JSON.parse(fs.readFileSync('./package.json', 'utf-8')).version;

const opts = minimist(process.argv.slice(2), {
  semver: process.env.SEMVER || 'patch',
});

const bumpDockerFile = version => fs.readFile('Dockerfile', 'utf-8', (err, data) => {
  if (err) {
    log.error(err);
    exit(-1);
  }

  const result = data.replace(/\d.+$/, version);

  fs.writeFile('Dockerfile', 'utf-8', err => {
    if (err) {
      log.error(err);
      exit(-1);
    }
  });
});

gulp.task('changelog', () => gulp
  .src('CHANGELOG.md', { buffer: false })
  .pipe(changelog({ preset: 'angular', releaseCount: 0 }))
  .pipe(gulp.dest('.')));

gulp.task('bump-version', () => gulp
  .src('package.json')
  .pipe(bump({
    type: opts.semver
  })).on('error', log.error)
  .pipe(gulp.dest('./'))
);

gulp.task('bump-version-dockerfile', done => {
  bumpDockerFile();

  done();
})

gulp.task('commit-changelog', () => gulp
  .src('.')
  .pipe(git.add())
  .pipe(git.commit(`docs(changelog): bumping version to ${version()}`))
);

gulp.task('push-changes', done => git.push('origin', 'master', done));


gulp.task('create-new-tag', done =>
  git.tag(`${version()}`, `Created Tag for version: ${version()}`, err => {
    if (err) {
      return done(err);
    }
    return git.push('origin', 'master', {
      args: '--tags',
    }, done);
  }));

gulp.task('release', done =>
  runSequence('bump-version', 'bump-version-dockerfile', 'changelog', 'commit-changelog', 'push-changes', 'create-new-tag', (err) => {
    if (err) {
      log.error(err.message);
    } else {
      log('RELEASE FINISHED SUCCESSFULLY');
    }
    done(err);
  }));

gulp.task('default', ['release']);
