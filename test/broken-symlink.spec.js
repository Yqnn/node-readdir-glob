const fs = require('fs');
const glob = require('../');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');

function skipIfWindows() {
  if (process.platform === 'win32') {
    pending('Symlinks not supported on Windows');
  }
}

function cleanup () {
  rimraf.sync('broken-symlink');
}

describe('broken-symlink', () => {
  beforeEach(() => {
    process.chdir(__dirname);
    mkdirp.sync(process.cwd()+'/broken-symlink/a/broken-link');
    fs.symlinkSync('this-does-not-exist', 'broken-symlink/a/broken-link/link');
  });

  afterEach(() => {
    process.chdir(__dirname);
    cleanup();
  });

  const link = 'broken-symlink/a/broken-link/link';
  const patterns = [
    'broken-symlink/a/broken-link/*',
    'broken-symlink/a/broken-link/**',
    'broken-symlink/a/broken-link/**/link',
    'broken-symlink/a/broken-link/**/*',
    'broken-symlink/a/broken-link/link',
    'broken-symlink/a/broken-link/{link,asdf}',
    'broken-symlink/a/broken-link/+(link|asdf)',
    'broken-symlink/a/broken-link/!(asdf)'
  ];
  const opts = [
    null,
    { nonull: true },
    { mark: true },
    { stat: true },
    { follow: true }
  ];



  patterns.forEach((pattern) => {
    opts.forEach((opt) => {
      it('async test pattern='+pattern+', opts='+JSON.stringify(opt), done => {
        skipIfWindows();
        glob('.', {...opt, pattern}, (er, res) => {
          if (er) {
            fail(er);
            return done();
          }
          expect(res.indexOf(link)).not.toBe(-1);
          done();
        });
      })
    });
  });

});

