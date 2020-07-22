const origCwd = process.cwd();
afterAll(() => {
  process.chdir(origCwd); // not sure it's needed
});