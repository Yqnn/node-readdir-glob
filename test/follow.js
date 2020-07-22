const glob = require('../');


beforeAll(() => {
  process.chdir(__dirname + '/fixtures');
});

if (process.platform === 'win32') {
  process.exit();
}

test('follow symlinks', done => {
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
})
