const fs = require('fs');
const glob = require('../');
const path = require('path');
const readdir = fs.readdir;

beforeAll(() => {
  process.chdir(__dirname + '/fixtures');
  fs.readdir = function (p, opts, cb) {
    if (allowedDirs.indexOf(path.resolve(p)) === -1 && !p.match(/[\\\/]node_modules[\\\/]/)) {
      setTimeout(() => {
        sawAsyncENOTSUP = true;
        er = new Error('ENOTSUP: Operation not supported');
        er.path = path;
        er.code = 'ENOTSUP';
        return cb(er);
      })
    } else {
      readdir.call(fs, p, opts, cb);
    }
  }
});

afterAll(() => {
  process.chdir(__dirname + '/fixtures');
  fs.readdir = readdir;
});


let sawAsyncENOTSUP = false;
const fixtureDir = path.resolve(__dirname, 'fixtures');
const allowedDirs = [
  path.resolve(fixtureDir),
  path.resolve(fixtureDir, 'a'),
  path.resolve(fixtureDir, 'a', 'abcdef'),
  path.resolve(fixtureDir, 'a', 'abcfed'),
  path.resolve(fixtureDir, 'a', 'abcdef', 'g'),
  path.resolve(fixtureDir, 'a', 'abcfed', 'g')
];
const pattern = 'a/**/h';

test(pattern,  done => {
  glob('.', {pattern}, (er, res) => {
    expect(er).toBeFalsy();
    expect(sawAsyncENOTSUP).toBeTruthy();
    res.sort();
    expect(res).toEqual([ 'a/abcdef/g/h', 'a/abcfed/g/h' ]);
    done();
  });
});
