const glob = require('../');
const mkdirp = require('mkdirp');
const fs = require('fs');
const rimraf = require('rimraf');

const dir = __dirname + '/package';

beforeAll(() => {
  mkdirp.sync(dir);
  fs.writeFileSync(dir + '/package.json', '{}', 'ascii');
  fs.writeFileSync(dir + '/README', 'x', 'ascii');
});

afterAll(() => {
  rimraf.sync(dir);
});

test('glob', done => {
  const opt = {
    pattern: 'README?(.*)',
    nocase: true,
    mark: true
  };

  glob(dir, opt, (er, files) => {
    expect(er).toBeFalsy();
    expect(files).toEqual(['README']);
    done();
  });
});
