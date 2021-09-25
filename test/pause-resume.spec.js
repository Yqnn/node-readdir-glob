const {ReaddirGlob} = require('../');
const bashResults = require('./bash-results.json');

const pattern = 'a/!(symlink)/**';

describe('pause-resume', () => {
  beforeEach(() => {
    process.chdir(__dirname + '/fixtures');
  });

  function alphasort (a, b) {
    a = a.toLowerCase();
    b = b.toLowerCase();
    return a > b ? 1 : a < b ? -1 : 0;
  }

  function cleanResults (m) {
    // normalize discrepancies in ordering, duplication,
    // and ending slashes.
    return m.map(m =>  m.replace(/\/+/g, '/').replace(/\/$/, ''))
      .sort(alphasort)
      .reduce((set, f) => {
        if (f !== set[set.length - 1]) {
          set.push(f);
        }
        return set;
      }, [])
      .sort(alphasort)
      .map(f => (process.platform !== 'win32') ? f : f.replace(/^[a-zA-Z]:\\\\/, '/').replace(/\\/g, '/'));
  }

  it('use a ReaddirGlob object, and pause/resume it', done => {
    let globResults = [];

    let cb;
    const cbSet = new Promise((resolve, _) => cb = resolve);

    const g = new ReaddirGlob('.', {pattern}, (_, matches) => cb(matches));
    const expected = bashResults[pattern];

    g.on('match', m => {
      expect(g.paused).toBeFalsy();
      globResults.push(m.relative);
      g.pause();
      expect(g.paused).toBeTruthy();
      setTimeout(g.resume.bind(g), 10);
    });

    g.on('end', () => {
      cbSet.then((matches) => {
        globResults = cleanResults(globResults);
        matches = cleanResults(matches);
        expect(matches).toEqual(globResults);
        expect(matches).toEqual(expected);
        done();
      });
    });
  });
});
