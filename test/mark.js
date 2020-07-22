const glob = require('../');

beforeAll(() => {
  process.chdir(__dirname + '/fixtures');
});


test('mark with cwd', done => {
  const pattern = '*/*';
  const opt = { mark: true };
  glob('a', {...opt, pattern}, (er, res) => {
    expect(er).toBeFalsy();

    let expected = [
      'abcdef/g/',
      'abcfed/g/',
      'b/c/',
      'bc/e/',
      'c/d/',
      'cb/e/',
    ].sort();

    if (process.platform !== 'win32') {
      expected.push('symlink/a/');
    }

    res.sort();
    expect(res).toEqual(expected);
    done();
  });
});

test('mark, with **', done => {
  const pattern = 'a/*b*/**';
  const opt = { mark: true };
  glob('.', {...opt, pattern}, (er, results) => {
    expect(er).toBeFalsy();
    let expected = [
      'a/abcdef/',
      'a/abcdef/g/',
      'a/abcdef/g/h',
      'a/abcfed/',
      'a/abcfed/g/',
      'a/abcfed/g/h',
      'a/b/',
      'a/b/c/',
      'a/b/c/d',
      'a/bc/',
      'a/bc/e/',
      'a/bc/e/f',
      'a/cb/',
      'a/cb/e/',
      'a/cb/e/f'
    ];

    expect(results).toEqual(expected);
    done();
  });
});

test('mark, no / on pattern', done => {
  const pattern = 'a/*';
  const opt = { mark: true };
  glob('.', {...opt, pattern}, (er, results) => {
    expect(er).toBeFalsy();
    let expected = [ 
      'a/abcdef/',
      'a/abcfed/',
      'a/b/',
      'a/bc/',
      'a/c/',
      'a/cb/',
      'a/x/',
      'a/z/'
    ];

    if (process.platform !== 'win32') {
      expected.push('a/symlink/');
    }

    expected.sort();

    expect(results).toEqual(expected);
    done();
  }).on('match', m => {
    expect(m.relative).toMatch(/\/$/);
  });
});

test('mark=false, no / on pattern', done => {
  const pattern = 'a/*';
  glob('.', {pattern}, (er, results) => {
    expect(er).toBeFalsy();
    let expected = [
      'a/abcdef',
      'a/abcfed',
      'a/b',
      'a/bc',
      'a/c',
      'a/cb',
      'a/x',
      'a/z'
    ];

    if (process.platform !== 'win32') {
      expected.push('a/symlink');
    }

    expected.sort();

    expect(results).toEqual(expected);
    done();
  }).on('match', m => {
    expect(m.relative).toMatch(/[^\/]$/);
  });
});

test('mark=true, / on pattern', done => {
  const pattern = 'a/*/';
  const opt = { mark: true };
  glob('.', {...opt, pattern}, (er, results) => {
    expect(er).toBeFalsy();
    let expected = [
      'a/abcdef/',
      'a/abcfed/',
      'a/b/',
      'a/bc/',
      'a/c/',
      'a/cb/',
      'a/x/',
      'a/z/'
    ];

    if (process.platform !== 'win32') {
      expected.push('a/symlink/');
    }

    expected.sort();

    expect(results).toEqual(expected);
    done();
  }).on('match', m => {
    expect(m.relative).toMatch(/\/$/);
  });
});

test('mark=false, / on pattern', done => {
  const pattern = 'a/*/';
  glob('.', {pattern}, (er, results) => {
    expect(er).toBeFalsy();
    let expected = [
      'a/abcdef',
      'a/abcfed',
      'a/b',
      'a/bc',
      'a/c',
      'a/cb',
      'a/x',
      'a/z'
    ];
    if (process.platform !== 'win32') {
      expected.push('a/symlink');
    }

    expected.sort();

    expect(results).toEqual(expected);
    done();
  });
});

