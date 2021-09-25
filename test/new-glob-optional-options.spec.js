
const { ReaddirGlob } = require('..');
const path = require('path');

describe('new-glob-optional-options', () => {
  beforeEach(() => {
    process.chdir(__dirname + '/fixtures');
  });

  it('new glob, with cb, and no options', done => {
    new ReaddirGlob('./a/bc/e/', function(er, results) {
      expect(er).toBeFalsy();
      expect(results).toEqual(['f']);
      done();
    });
  });
});