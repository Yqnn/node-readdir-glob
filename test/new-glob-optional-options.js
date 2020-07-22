
const { ReaddirGlob } = require('..');
const path = require('path');


let f = 'test/'+path.basename(__filename);

test('new glob, with cb, and no options', done => {
  new ReaddirGlob('.', {pattern:f}, function(er, results) {
    expect(er).toBeFalsy();
    expect(results).toEqual([f]);
    done();
  });
});
