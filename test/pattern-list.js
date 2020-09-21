const glob = require('../');

beforeAll(() => {
  process.chdir(__dirname + '/fixtures');
});


// [cwd, options, expected]
const cases = [
  [ 'a', { pattern:['abcdef/*', 'z'], mark: true}, [
    "abcdef/g/",
    "z/",
    ]
  ]
];

cases.forEach(c => {
  const cwd = c[0];
  const options = c[1];
  const expected = c[2].sort();
  test(cwd + ' ' + JSON.stringify(options), done => {
    glob(cwd, options, (er, res) => {
      expect(er).toBeFalsy();
      res.sort();
      expect(res).toEqual(expected);
      done();
    })
  })
})
