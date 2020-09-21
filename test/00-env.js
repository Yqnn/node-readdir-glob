const origCwd = process.cwd();
afterAll(() => {
  process.chdir(origCwd);
});