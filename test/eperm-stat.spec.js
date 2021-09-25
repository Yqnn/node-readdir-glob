const fs = require('fs');
const glob = require('../');


describe('eperm-stat', () => {
  beforeEach( () => {
    process.chdir(__dirname);
    const badPaths = /\ba[\\\/]?$|\babcdef\b/;
    const lstat = fs.lstat;
    spyOn(fs, 'lstat').and.callFake(function (path, cb) {
      // synthetically generate a non-ENOENT error
      if (badPaths.test(path)) {
        const er = new Error('synthetic');
        er.code = 'EPERM';
        return process.nextTick(cb.bind(null, er));
      }
      return lstat.call(fs, path, cb);
    });
  });


  function isNodeHigherOrEqual(version) {
    const requestedVersion = version.replace(/^v/, '').split('.').map((num) => parseInt(num, 10));
    const currentVersion = process.version.replace(/^v/, '').split('.').map((num) => parseInt(num, 10));
    return (requestedVersion[0] < currentVersion[0])
      || (requestedVersion[0] === currentVersion[0] && requestedVersion[1] < currentVersion[1])
      || (requestedVersion[0] === currentVersion[0] && requestedVersion[1] === currentVersion[1]  && requestedVersion[2] <= currentVersion[2]);
  }

  it('stat errors other than ENOENT are ok async', done => {
    const node10_10 = isNodeHigherOrEqual('v10.10.0');
    const expectedFiles = [
      'a/abcdef',
      'a/abcdef/g',
      'a/abcdef/g/h',
      'a/abcfed',
      'a/abcfed/g',
      'a/abcfed/g/h'
    ];
    glob('fixtures', { stat: true, pattern: 'a/*abc*/**' }, (er, matches) => {
      expect(er).toBeFalsy();
      expect(matches).toEqual(node10_10 ? expectedFiles : []);
      done();
    });
  });


  it('globstar with error in root async', done => {
    const node10_10 = isNodeHigherOrEqual('v10.10.0');
    let expectedFiles = [
      'a',
      'a/abcdef',
      'a/abcdef/g',
      'a/abcdef/g/h',
      'a/abcfed',
      'a/abcfed/g',
      'a/abcfed/g/h',
      'a/b',
      'a/b/c',
      'a/b/c/d',
      'a/bc',
      'a/bc/e',
      'a/bc/e/f',
      'a/c',
      'a/c/d',
      'a/c/d/c',
      'a/c/d/c/b',
      'a/cb',
      'a/cb/e',
      'a/cb/e/f',
      'a/symlink',
      'a/symlink/a',
      'a/symlink/a/b',
      'a/symlink/a/b/c',
      'a/x',
      'a/z'
    ];
    if (process.platform === 'win32') {
      expectedFiles = expectedFiles.filter(path => path.indexOf('/symlink') === -1);
    }

    const pattern = 'a/**';
    glob('fixtures', { pattern }, (er, matches) => {
      expect(er).toBeFalsy();
      expect(matches).toEqual(node10_10 ? expectedFiles : []);
      done();
    })
  });
});