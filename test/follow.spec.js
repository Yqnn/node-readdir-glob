const glob = require('../');

function skipIfWindows() {
  if (process.platform === 'win32') {
    pending('Symlinks not supported on Windows');
  }
}

describe('follow', () => {

  beforeEach(() => {
    process.chdir(__dirname + '/fixtures');
  });

  it('follow symlinks', done => {
    skipIfWindows();
    const pattern = 'a/symlink/**';
    const long = 'a/symlink/a/b/c/c/d';

    glob('.' ,{ pattern }, (er, res) => {
      expect(er).toBeFalsy();
      const noFollow = res.sort();
      expect(noFollow).not.toContain(long);

      glob('.', { follow: true, pattern }, (er, res) => {
        expect(er).toBeFalsy();
        const follow = res.sort();

        expect(follow).toContain(long);
        done();
      })
    })
  });
});