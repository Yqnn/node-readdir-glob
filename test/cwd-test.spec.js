const path = require('path');
const glob = require('../');

describe('cwd-test', () => {
  beforeEach(() => {
    process.chdir(__dirname + '/fixtures');
  });




  it('changing cwd and searching for **/d, "."', done => {
    glob('.', {pattern:'**/d'}, (er, matches) => {
      expect(er).toBeFalsy();
      expect(matches).toEqual([ 'a/b/c/d', 'a/c/d' ]);
      done();
    })
  });

  it('changing cwd and searching for **/d, "a"', done => {
    glob(path.resolve('a'), {pattern:'**/d'}, (er, matches) => {
      expect(er).toBeFalsy();
      expect(matches).toEqual([ 'b/c/d', 'c/d' ]);
      done();
    })
  })

  it('changing cwd and searching for **/d, "a/b"', done => {
    glob(path.resolve('a/b'), {pattern:'**/d'}, (er, matches) => {
      expect(er).toBeFalsy();
      expect(matches).toEqual([ 'c/d' ]);
      done();
    })
  });

  it('changing cwd and searching for **/d, "a/b/"', done => {
    glob(path.resolve('a/b/'), {pattern:'**/d'}, (er, matches) => {
      expect(er).toBeFalsy();
      expect(matches).toEqual([ 'c/d' ]);
      done();
    })
  });

  it('changing cwd and searching for **/d, process.cwd()', done => {
    glob(process.cwd(), {pattern:'**/d'}, (er, matches) => {
      expect(er).toBeFalsy();
      expect(matches).toEqual([ 'a/b/c/d', 'a/c/d' ]);
      done();
    })
  });


  it('non-dir cwd should raise error', done => {
    const notdir = 'a/b/c/d';
    const abs = path.resolve(notdir);

    glob(notdir, { pattern: '*' }, (er, results) => {
      expect(er).toBeTruthy();
      expect(er.code).toEqual('ENOTDIR');
      expect(er.path).toEqual(abs);
      done();
    })
  });

});
