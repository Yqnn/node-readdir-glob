
const { ReaddirGlob } = require('..');
const path = require('path');

beforeAll(() => {
  process.chdir(__dirname + '/fixtures');
});

test('new glob, with cb, and no options', done => {
  new ReaddirGlob('./a/bc/e/', function(er, results) {
    expect(er).toBeFalsy();
    expect(results).toEqual(['f']);
    done();
  });
});
