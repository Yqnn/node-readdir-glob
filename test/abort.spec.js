const glob = require('../');
const fs = require('fs');


describe('abort', () => {
  beforeEach(() => {
    process.chdir(__dirname);
  });

  it('abort prevents any action', done => {
    const globs = [
      glob('.', {pattern:'a/**'}),
      glob('.', {pattern:'a/'}),
      glob('.', {pattern:'a/'})
    ];

    globs.forEach(glob => spyOn(glob, 'emit').and.throwError(new Error('Invalid call')));
    spyOn(fs, 'readdir').and.throwError(new Error('Invalid call'));
    spyOn(fs, 'stat').and.throwError(new Error('Invalid call'));
    spyOn(fs, 'lstat').and.throwError(new Error('Invalid call'));

    globs.forEach(glob => glob.abort());

    setTimeout(function () {
      done();
    }, 100);
  });
});
