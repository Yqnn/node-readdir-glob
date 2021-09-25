const fs = require('fs');
const glob = require('../');

const cwd = process.cwd().toLowerCase().replace(/\\/g, '/');

function fakeStat(path) {
  let ret;
  switch (path.toLowerCase().replace(/\\/g, '/')) {
    case cwd+'/tmp':
    case cwd+'/tmp/':
      ret = { isDirectory: () => true, isSymbolicLink: () => false };
      break;
    case cwd+'/tmp/a':
      ret = { isDirectory: () => false, isSymbolicLink: () => false };
      break;
  }
  return ret;
}

function fakeReaddir(path, opts) {
  let ret;
  switch (path.toLowerCase().replace(/\\/g, '/')) {
    case cwd+'/tmp':
    case cwd+'/tmp/':
      ret = [ 'a', 'A' ].map(name => (opts.withFileTypes?{name, isDirectory:()=>false}:name));
      break;
    case cwd:
    case cwd+'/':
      ret = ['tmp', 'tMp', 'tMP', 'TMP'].map(name => (opts.withFileTypes?{name, isDirectory:()=>true}:name));
  }
  return ret;
}

describe('nocase-nomagic', () => {
  beforeEach(() => {
    const stat = fs.stat;
    const readdir = fs.readdir;

    const statMock = (path, cb) => {
      const f = fakeStat(path);
      if (f) {
        process.nextTick(() => cb(null, f));
      } else {
        stat.call(fs, path, cb);
      }
    };

    const readdirMock = (path, opts, cb) => {
      const f = fakeReaddir(path, opts);
      if (f) {
        process.nextTick(() => cb(null, f));
      } else {
        readdir.call(fs, path, opts, cb);
      }
    };

    spyOn(fs, 'stat').and.callFake(statMock);
    spyOn(fs, 'lstat').and.callFake(statMock);
    spyOn(fs, 'readdir').and.callFake(readdirMock);
  });

  it('nocase, nomagic', done => {
    let n = 2;
    const want = [
      'TMP/A',
      'TMP/a',
      'tMP/A',
      'tMP/a',
      'tMp/A',
      'tMp/a',
      'tmp/A',
      'tmp/a'
    ];
    glob('.', { nocase: true, pattern: 'tmp/a'}, (er, res) => {
      expect(er).toBeFalsy();
      res.sort();
      expect(res).toEqual(want);
      if (--n === 0) {
        done();
      }
    });
    glob('.', { nocase: true, pattern: 'tmp/A'}, (er, res) => {
      expect(er).toBeFalsy();
      res.sort();
      expect(res).toEqual(want);
      if (--n === 0) { 
        done();
      }
    });
  });

  it('nocase, with some magic', done => {
    const want = [
      'TMP/A',
      'TMP/a',
      'tMP/A',
      'tMP/a',
      'tMp/A',
      'tMp/a',
      'tmp/A',
      'tmp/a'
    ];

    glob('.', { nocase: true, pattern: 'tmp/*' }, (er, res) => {
      expect(er).toBeFalsy();
      res.sort();
      expect(res).toEqual(want);
      done();
    });
  });
});