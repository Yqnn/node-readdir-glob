const fs = require('fs');
const glob = require('../');

describe('error-callack', () => {

  let logCalled = undefined;
  beforeEach( () => {
    logCalled = [];
    spyOn(fs, 'readdir').and.callFake((path, opts, cb) => {
      process.nextTick(() => cb(new Error('mock fs.readdir error')));
    });
    spyOn(console, 'error').and.callFake(function (...args) {
      args.forEach(arg => logCalled.push(arg));
    });
  });


  it('error callback', done => {
    glob('.', {pattern: '*'}, (err, res) => {
      expect(err).toBeTruthy();

      setTimeout(() => {
        expect(logCalled.length).toBe(1);
        expect(logCalled[0].message).toEqual('mock fs.readdir error');
        done();
      });
    });
  });

});