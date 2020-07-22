
const fs = require('fs');
const glob = require('../');
const { fail } = require('assert');

const readdir = fs.readdir;
const console_error = console.error;


beforeEach(() => {
  console.error = () => fail('SILENCE, INSECT!');
  fs.readdir = (path, opts, cb) => cb(new Error('expected'));
});

afterEach(() => {
  console.error = console_error;
  fs.readdir = readdir;
});

// also test that silent:true is actually silent!
test('multiple-weird-error', done => {
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
