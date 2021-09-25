const glob = require('../');

describe('skip', () => {
  beforeEach(() => {
    process.chdir(__dirname + '/fixtures');
  });


  // [cwd, options, expected]
  const cases = [
    [ 'a', { pattern:'**/*', mark: true, skip: ['*/g', 'cb'] }, [
      "abcdef/",
      "abcfed/",
      "b/",
      "b/c/",
      "b/c/d",
      "bc/",
      "bc/e/",
      "bc/e/f",
      "c/",
      "c/d/",
      "c/d/c/",
      "c/d/c/b",
      "symlink/",
      "symlink/a/",
      "symlink/a/b/",
      "symlink/a/b/c",
      "x/",
      "z/",
      ]
    ],
    [ 'a/c', { mark: true, skip: '**/c' }, [
      'd/',
      ]
    ]
  ];

  cases.forEach(c => {
    const cwd = c[0];
    const options = c[1];
    const expected = c[2].sort();
    it(cwd + ' ' + JSON.stringify(options), done => {
      glob(cwd, options, (er, res) => {
        expect(er).toBeFalsy();
        res.sort();
        expect(res).toEqual(expected);
        done();
      })
    })
  });
});