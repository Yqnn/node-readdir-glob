
const fs = require('fs');
const glob = require('../');

describe('multiple-weird-error', () => {

  // also test that silent:true is actually silent!
  it('multiple-weird-error', done => {
    spyOn(console, 'error').and.throwError('SILENCE, INSECT!');
    spyOn(fs, 'readdir').and.callFake((path, opts, cb) => cb(new Error('expected')));

    let count = 0;
    let max = 2;
    for(let i=0 ; i<max ; ++i) {
      glob('.', { silent: true, pattern:'*' }, function(err, files) {
        expect(err).toBeTruthy();
        count ++;
        if(count === max) {
          done();
        }
      });
    }
  });
});
