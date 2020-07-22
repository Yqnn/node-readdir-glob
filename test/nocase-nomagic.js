const fs = require('fs');
const glob = require('../');

const stat = fs.stat;
const lstat = fs.lstat;
const readdir = fs.readdir;


const cwd = process.cwd().toLowerCase();


function fakeStat(path) {
  let ret;
  switch (path.toLowerCase().replace(/\\/g, '/')) {
    case cwd+'/tmp':
    case cwd+'/tmp/':
      ret = { isDirectory: () => true, isSymbolicLink: () => false };
      break;
    case cwd+'/tmp/a':
      ret = { isDirectory: () => false, isSymbolicLink: () => false };
      break;
  }
  return ret;
}

function fakeReaddir(path, opts) {
  let ret;
  switch (path.toLowerCase().replace(/\\/g, '/')) {
    case cwd+'/tmp':
    case cwd+'/tmp/':
      ret = [ 'a', 'A' ].map(name => (opts.withFileTypes?{name, isDirectory:()=>false}:name));
      break;
    case cwd:
    case cwd+'/':
      ret = ['tmp', 'tMp', 'tMP', 'TMP'].map(name => (opts.withFileTypes?{name, isDirectory:()=>true}:name));
  }
  return ret;
}

beforeEach(() => {
  fs.stat =
  fs.lstat = (path, cb) => {
    const f = fakeStat(path);
    if (f) {
      process.nextTick(() => cb(null, f));
    } else {
      stat.call(fs, path, cb);
    }
  };

  fs.readdir = (path, opts, cb) => {
    const f = fakeReaddir(path, opts);
    if (f) {
      process.nextTick(() => cb(null, f));
    } else {
      readdir.call(fs, path, opts, cb);
    }
  };
});

afterEach(() => {
  fs.stat = stat;
  fs.lstat = lstat;
  fs.readdir = readdir;
});




test('nocase, nomagic', done => {
  let n = 2;
  const want = [
    'TMP/A',
    'TMP/a',
    'tMP/A',
    'tMP/a',
    'tMp/A',
    'tMp/a',
    'tmp/A',
    'tmp/a'
  ];
  glob('.', { nocase: true, pattern: 'tmp/a'}, (er, res) => {
    expect(er).toBeFalsy();
    res.sort();
    expect(res).toEqual(want);
    if (--n === 0) {
      done();
    }
  });
  glob('.', { nocase: true, pattern: 'tmp/A'}, (er, res) => {
    expect(er).toBeFalsy();
    res.sort();
    expect(res).toEqual(want);
    if (--n === 0) { 
      done();
    }
  });
});

test('nocase, with some magic', done => {
  const want = [
    'TMP/A',
    'TMP/a',
    'tMP/A',
    'tMP/a',
    'tMp/A',
    'tMp/a',
    'tmp/A',
    'tmp/a'
  ];
  if(process.platform.match(/^win/)) {
    want = want.map( p => drive + ':' + p);
  }

  glob('.', { nocase: true, pattern: 'tmp/*' }, (er, res) => {
    expect(er).toBeFalsy();
    if (process.platform.match(/^win/)) {
      res = res.map( r =>
        r.replace(/\\/g, '/').replace(new RegExp('^' + drive + ':', 'i'), drive+':')
      );
    }
    res.sort();
    expect(res).toEqual(want);
    done();
  });
});
