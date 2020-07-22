const glob = require('../');
const path = require('path');


if (process.platform === 'win32') {
  process.exit();
}


const fixtureDir = path.resolve(__dirname, 'fixtures');
const pattern = 'a/symlink/{*,**/*/*/*,*/*/**,*/*/*/*/*/*}';

beforeAll(() => {
  process.chdir(fixtureDir);
});

// options, results
// absolute:true set on each option
const cases = [
  [ {},
    [ 'a/symlink/a', 'a/symlink/a/b', 'a/symlink/a/b/c' ] ],

  [ { mark: true },
    [ 'a/symlink/a/', 'a/symlink/a/b/', 'a/symlink/a/b/c' ] ],

  [ { stat: true },
    [ 'a/symlink/a', 'a/symlink/a/b', 'a/symlink/a/b/c' ] ],

  [ { cwd: 'a' },
    [ 'symlink/a', 'symlink/a/b', 'symlink/a/b/c' ],
    pattern.substr(2) ],

  [ { cwd: 'a' },
    [],
    'no one here but us chickens' ]
];

cases.forEach(c => {
  const opt = c[0];

  test(JSON.stringify(opt), done => {
    let expected = c[1];
    if (!(opt.nonull && expected[0].match(/^no one here/))) {
      expected = expected.map(d => {
        d = (opt.cwd ? path.resolve(opt.cwd) : fixtureDir) + '/' + d;
        return d.replace(/\\/g, '/');
      });
    }
    const p = c[2] || pattern;
  
    opt.absolute = true;
    opt.pattern = p;

    glob(opt.cwd || '.', opt, function (er, async) {
      expect(er).toBeFalsy();
      expect(async).toEqual(expected)
      done();
    });
  });
});
