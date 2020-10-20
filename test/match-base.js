
const glob = require('../');
const path = require('path');


const fixtureDir = path.resolve(__dirname, 'fixtures');
const pattern = 'a*';
let expected = [
  'a',
  'a/.abcdef/x/y/z/a',
  'a/abcdef',
  'a/abcfed',
  'a/symlink/a'
];
if (process.platform === 'win32') {
  expected = expected.filter(path => path.indexOf('/symlink') === -1);
}


test('chdir', done => {
  const origCwd = process.cwd();
  process.chdir(fixtureDir)
  glob('.', { matchBase: true, pattern }, (er, res) => {
    expect(er).toBeFalsy();
    expect(res).toEqual(expected);
    process.chdir(origCwd);
    done();
  });
});

test('cwd', done => {
  glob(fixtureDir, { matchBase: true, pattern }, (er, res) => {
    expect(er).toBeFalsy();
    expect(res).toEqual(expected);
    done();
  });
});


