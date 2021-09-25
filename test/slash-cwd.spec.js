// regression test to make sure that slash-ended patterns
// don't match files when using a different cwd.
const glob = require('../');

const pattern = '{*.md,test}/';
const expected = [ 'test/' ];

describe('slash-cwd', () => {
  beforeEach(() => {
    process.chdir(__dirname + '/..');
  });

  it('slashes only match directories', done => {
    glob('.', {mark: true, pattern}, (er, async) => {
      expect(er).toBeFalsy();
      expect(async).toEqual(expected)
      done();
    })
  });
});