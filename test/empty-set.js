const glob = require('..');

// Patterns that cannot match anything
const patterns = [
  '# comment',
  ' ',
  '\n',
  'just doesnt happen to match anything so this is a control'
];

patterns.forEach((p) => {
  test('Empty-set: '+JSON.stringify(p), done => {
    glob('.', {pattern:p}, (e, f) => {
      expect(e).toBeNull();
      expect(f).toEqual([]);
      done();
    });
  });
});
