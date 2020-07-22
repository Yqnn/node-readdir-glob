const glob = require('../');
const fs = require('fs');
const fsCopy = {readdir: fs.readdir, stat: fs.stat, lstat: fs.lstat};

beforeAll(() => {
  process.chdir(__dirname);
});

afterAll(() => {
  fs.readdir = fsCopy.readdir;
  fs.stat = fsCopy.stat;
  fs.lstat = fsCopy.lstat;
});

test('abort prevents any action', async function (done) {
  glob('.', {pattern:'a/**'}).abort();
  glob('.', {pattern:'a/'}).abort();
  glob('.', {pattern:'a/b/*'}).abort();

  glob.ReaddirGlob.prototype.emit = fs.readdir = fs.stat = fs.lstat = fail;

  setTimeout(function () {
    done();
  }, 100);
})
