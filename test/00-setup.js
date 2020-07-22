// just a little pre-run script to set up the fixtures.
// zz-finish cleans it up
const mkdirp = require('mkdirp');
const path = require('path');
const fsPromises = require('fs').promises;
const rimraf = require('rimraf');

  
function cleanResults (m) {
  // normalize discrepancies in ordering, duplication,
  // and ending slashes.
  return m.map(m => m.replace(/\/+/g, '/').replace(/\/$/, ''))
  .sort(alphasort).reduce(function (set, f) {
    if (f !== set[set.length - 1]) set.push(f);
    return set;
  }, [])
  .sort(alphasort)
  .map(function (f) {
    // de-windows
    return (process.platform !== 'win32') ? f
           : f.replace(/^[a-zA-Z]:\\\\/, '/').replace(/\\/g, '/');
  })
}

function flatten (chunks) {
  let s = 0;
  chunks.forEach(function (c) { s += c.length });
  const out = new Buffer(s);
  s = 0;
  chunks.forEach(function (c) {
    c.copy(out, s);
    s += c.length;
  });
  return out.toString().trim();
}

function alphasort (a, b) {
  a = a.toLowerCase();
  b = b.toLowerCase();
  return a > b ? 1 : a < b ? -1 : 0;
}


module.exports = async function () {
  const fixtureDir = path.resolve(__dirname, 'fixtures');
  
  let files = [
    'a/.abcdef/x/y/z/a',
    'a/abcdef/g/h',
    'a/abcfed/g/h',
    'a/b/c/d',
    'a/bc/e/f',
    'a/c/d/c/b',
    'a/cb/e/f',
    'a/x/.y/b',
    'a/z/.y/b'
  ];
  
  const symlinkTo = path.resolve(fixtureDir, 'a/symlink/a/b/c');
  const symlinkFrom = '../../../b';
  
  files = files.map(f => path.resolve(fixtureDir, f));
  
  await new Promise((resolve, reject) => rimraf(fixtureDir, resolve));
  
  for(let f of files) {
    f = path.resolve(fixtureDir, f);
    const d = path.dirname(f);
    await mkdirp(d, '0755');
    await fsPromises.writeFile(f, 'i like tests');
  }
  
  if (process.platform !== 'win32') {
    const d = path.dirname(symlinkTo);
    await mkdirp(d, '0755');
    await fsPromises.symlink(symlinkFrom, symlinkTo, 'dir');
  }
  
  // generate the bash pattern test-fixtures if possible
  if (process.platform === 'win32' || !process.env.TEST_REGEN) {
    //console.info('Windows, or TEST_REGEN unset.  Using cached fixtures.');
    return;
  }
  
  const spawn = require('child_process').spawn;
  const globs = [
    // put more patterns here.
    // anything that would be directly in / should be in /tmp/glob-test
    'a/{b,c,d,e,f}/**/g',
    'a/b/**',
    '**/g',
    'a/abc{fed,def}/g/h',
    'a/abc{fed/g,def}/**/',
    'a/abc{fed/g,def}/**///**/',
    '**/a/**/',
    '+(a|b|c)/a{/,bc*}/**',
    '*/*/*/f',
    '**/f',
    'a/!(symlink)/**',
    'a/symlink/a/**/*'
  ];
  const bashOutput = {};
  
  try {
    for(const pattern of globs) {
      const opts = [
        '-O', 'globstar',
        '-O', 'extglob',
        '-O', 'nullglob',
        '-c',
        'for i in ' + pattern + '; do echo $i; done'
      ];
      const cp = spawn('bash', opts, { cwd: fixtureDir });
      let out = [];
      cp.stdout.on('data', function (c) {
        out.push(c);
      });
      cp.stderr.pipe(process.stderr);
      await new Promise((resolve, reject) => {
        cp.on('close', (code) => {
          if(code !== 0) {
            reject();
          }
          out = flatten(out);
          if (!out) {
            out = [];
          } else {
            out = cleanResults(out.split(/\r*\n/));
          }
    
          bashOutput[pattern] = out;
          resolve();
        });
      });
    }
  } catch(e) {
    // Something went wrong when using bash, bash-results.json should not be overriden.
    console.error('Unable to regenerate bash-results.json');
    return;
  }
  
  const fname = path.resolve(__dirname, 'bash-results.json');
  const data = JSON.stringify(bashOutput, null, 2) + '\n';
  await fsPromises.writeFile(fname, data);
};