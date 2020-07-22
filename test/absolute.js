

const glob = require('../');
const bashResults = require('./bash-results.json');
const isAbsolute = require('path-is-absolute');

beforeAll(() => {
  process.chdir(__dirname + '/fixtures');
});


[ true, false ].forEach(function (mark) {

  test('Emits absolute matches if option set, mark=' + mark, function (done) {
    const pattern = 'a/b/**';
    let g = new glob.ReaddirGlob('.', { pattern });

    let matchCount = 0;
    g.on('match', (m) => {
      expect(isAbsolute(m.absolute)).toBe(true);
      matchCount++;
    });

    g.on('end', () => {
      expect(matchCount).toBe(bashResults[pattern].length);
      done();
    });
  })
})
