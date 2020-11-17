'use strict';

const fs     = require('fs');
const path   = require('path');
const expect = require('chai').expect;
const calipers    = require('../lib/index');

describe('bmp', function () {

  const fixtures = path.resolve(__dirname, '../test/fixtures/bmp');
  const files = fs.readdirSync(fixtures);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileSplit = file.split(/x|\./);
    const width = parseInt(fileSplit[0]);
    const height = parseInt(fileSplit[1]);
    const expectedOutput = {
      type: 'bmp',
      pages: [{ width, height }]
    };

    it('should return the correct dimensions for ' + file, async function () {
      var bmpPath = path.resolve(fixtures, file);

      const result = await calipers.measure(bmpPath);
      expect(result).to.eql(expectedOutput);
    });
  }

});
