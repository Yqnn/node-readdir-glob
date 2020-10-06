const fs = require('fs');
const glob = require('../');

const readdir = fs.readdir;
const lstat = fs.lstat;


beforeAll(() => {
  process.chdir(__dirname + '/fixtures');

  // Replace readdir function so that it behaves as if the withFileTypes
  // option was not supported
  fs.readdir = function (p, opts, cb) {
    readdir(p, opts, function(err, files) {
      cb(err, files.map(f => f.name));
    });
  };

  const badStatPaths = /\/c$/;
  fs.lstat = function (path, cb) {
    // synthetically generate a non-ENOENT error
    if (badStatPaths.test(path)) {
      const er = new Error('synthetic');
      er.code = 'EPERM';
      return process.nextTick(cb.bind(null, er));
    }
    return lstat.call(fs, path, cb);
  };
});

afterAll(() => {
  process.chdir(__dirname + '/fixtures');
  fs.readdir = readdir;
  fs.lstat = lstat;
});


test('withFileTypes option unsupported',  done => {
  glob('a/c', (er, res) => {
    expect(er).toBeFalsy();
    res.sort();
    expect(res).toEqual([
      'd',
      'd/c' // This folder cannot be explored because lstat returned an error on it
    ]);
    done();
  });
});
