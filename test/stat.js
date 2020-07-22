
const glob = require('../');
const { Stats } = require('fs');
const dir = __dirname + '/fixtures';

test('stat all the things', done => {
  const g = new glob.ReaddirGlob(dir, { stat: true, pattern: 'a/*abc*/**' });
  let matches = [];
  g.on('match', (m) => {
    matches.push(m.relative);
    expect(m.stat instanceof Stats).toBe(true);
  });
  g.on('end', () => {
    expect(matches).toEqual([
      'a/abcdef',
      'a/abcdef/g',
      'a/abcdef/g/h',
      'a/abcfed',
      'a/abcfed/g',
      'a/abcfed/g/h'
    ]);
    done();
  })
})
