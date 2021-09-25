const glob = require('../');
const mkdirp = require('mkdirp');
const fs = require('fs');
const rimraf = require('rimraf');

const dir = __dirname + '/removed-files';


describe('removed-files', () => {
  beforeEach(() => {
    mkdirp.sync(dir);
    mkdirp.sync(dir+'/b');
    mkdirp.sync(dir+'/a');
    fs.writeFileSync(dir + '/a/a.txt', 'a', 'ascii');
    fs.writeFileSync(dir + '/a/b.txt', 'b', 'ascii');
  });

  afterEach(() => {
    rimraf.sync(dir);
  });

  it('removed file during exploration', done => {
    const g = glob(dir, {stat: true});
    const files = [];

    g.on('match', match => {
      if(/a\/.+/.test(match.relative)) {
        rimraf.sync(dir+'/a');
        files.push(match.relative);
      }
    });

    g.on('end', () => {
      expect(files.sort()).toEqual(['a/a.txt', 'a/b.txt']);
      done();
    });
  });

  it('folder turned into a file during exploration', done => {
    const g = glob(dir, {stat: true});
    const files = [];

    g.on('match', match => {
      if(match.relative === 'a') {
        rimraf.sync(dir+'/a');
        fs.writeFileSync(dir + '/a', 'oops', 'ascii');
      }
      files.push(match.relative);
    });

    g.on('end', () => {
      expect(files.sort()).toEqual(['a', 'b']);
      done();
    });
  });
});