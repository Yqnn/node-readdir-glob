const fs = require('fs');
const glob = require('../');

const console_error = console.error;
const readdir = fs.readdir;


let logCalled = undefined;
beforeEach( () => {
  fs.readdir = (path, opts, cb) => {
    process.nextTick(() => cb(new Error('mock fs.readdir error')));
  };
  console.error = function (...args) {
    logCalled = [].slice.call(arguments, 0);
    console.error = console_error;
  };
});

afterEach( () => {
  fs.readdir = readdir;
  console.error = console_error;
});


test('error callback', done => {
  glob('.', {pattern: '*'}, (err, res) => {
    expect(err).toBeTruthy();

    setTimeout(() => {
      expect(logCalled.length).toBe(1);
      expect(logCalled[0].message).toEqual('mock fs.readdir error');
      done();
    });
  });
});
