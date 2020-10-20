// basic test
// show that it does the same thing by default as the shell.
const glob = require('../');
const path = require('path');
const bashResults = require('./bash-results.json');


const globs = Object.keys(bashResults);

// run from the root of the project
// this is usually where you're at anyway, but be sure.


beforeAll(() => {
  const fixtures = path.resolve(__dirname, 'fixtures');
  process.chdir(fixtures);
});


function alphasort (a, b) {
  a = a.toLowerCase();
  b = b.toLowerCase();
  return a > b ? 1 : a < b ? -1 : 0;
}

globs.forEach((pattern) => {
  let expectedFiles = bashResults[pattern];

  // anything regarding the symlink thing will fail on windows, so just skip it
  if (process.platform === 'win32') {
    expectedFiles = expectedFiles.filter(m => m.indexOf('symlink')===-1);
  }

  test(pattern, (done) => {
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
})

function cleanResults (m) {
  // normalize discrepancies in ordering, duplication,
  // and ending slashes.
  return m.sort(alphasort);
}
