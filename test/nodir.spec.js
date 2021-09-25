const glob = require('../');



describe('nodir', () => {
  beforeEach(() => {
    process.chdir(__dirname + '/fixtures');
  });


  // [pattern, options, expected]
  const cases = [
    [ '*/**', { cwd: 'a' }, [
        'abcdef/g/h',
        'abcfed/g/h',
        'b/c/d',
        'bc/e/f',
        'c/d/c/b',
        'cb/e/f',
        'symlink/a/b/c'
      ]
    ],
    [ 'a/*b*/**', {}, [
        'a/abcdef/g/h',
        'a/abcfed/g/h',
        'a/b/c/d',
        'a/bc/e/f',
        'a/cb/e/f'
      ]
    ],
    [ 'a/*b*/**/', {}, [] ],
    [ '*/*', { cwd: 'a' }, [] ]
  ];

  cases.forEach(c => {
    const pattern = c[0];
    const options = c[1] || {};
    options.nodir = true;
    const expected = c[2].sort();
    it(pattern + ' ' + JSON.stringify(options), done => {
      glob(options.cwd || '.', {pattern, ...options}, (er, res) => {
        expect(er).toBeFalsy();
        res.sort();
        expect(res).toEqual(expected);
        done();
      })
    })
  });
});
