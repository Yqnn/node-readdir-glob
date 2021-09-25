// basic test
// show that it does the same thing by default as the shell.
const glob = require('../');
const path = require('path');

function alphasort (a, b) {
  a = a.toLowerCase();
  b = b.toLowerCase();
  return a > b ? 1 : a < b ? -1 : 0;
}

function cleanResults (m) {
  // normalize discrepancies in ordering, duplication,
  // and ending slashes.
  return m
    .map(m => m.replace(/\/+/g, '/').replace(/\/$/, ''))
    .sort(alphasort)
    .reduce((set, f) => {
      if (f !== set[set.length - 1]) {
        set.push(f);
      }
      return set;
    }, [])
    .map((f) =>
      // de-windows
      process.platform !== 'win32' ? f : f.replace(/^[a-zA-Z]:[\/\\]+/, '/').replace(/[\\\/]+/g, '/')
    )
    .sort(alphasort);
}

describe('bash-comparison', () => {
  beforeEach(() => {
    process.chdir(__dirname+'/fixtures');
  });

  ['a/{b,c,d,e,f}/**/g'].forEach((pattern) => {
    const expectedFiles = [];

    // anything regarding the symlink thing will fail on windows, so just skip it
    if (process.platform === 'win32' && expectedFiles.some((m) => /\bsymlink\b/.test(m))) {
      return;
    }

  it(pattern, (done) => {
      const g = glob('.', {pattern});
      let matches = [];
      g.on('match', (match) => {
        matches.push(match.relative);
      })
      g.on('end', () => {
        // sort and unmark, just to match the shell results
        matches = cleanResults(matches);
        expect(matches).toEqual(expectedFiles);
        done();
      });
    });
  });
});
