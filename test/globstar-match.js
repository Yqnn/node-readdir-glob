const ReaddirGlob = require('..').ReaddirGlob;


test('globstar should not have dupe matches', done => {
  const pattern = 'a/**/[gh]';
  let cb;
  const cbSet = new Promise((resolve, _) => cb = resolve);
  const g = new ReaddirGlob('.', { cwd: __dirname, pattern }, (_, matches) => cb(matches));
  let matches = [];
  g.on('match', (m) => matches.push(m.relative));
  g.on('end', () => {
    cbSet.then((set) => {
      matches.sort();
      set.sort();
      expect(matches).toEqual(set);
      done();
    });
  });
});
