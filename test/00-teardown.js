const path = require('path');
const rimraf = require('rimraf');

module.exports = async function () {
  await new Promise((resolve, reject) => rimraf(path.resolve(__dirname, 'fixtures'), resolve));
};