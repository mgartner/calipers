'use strict';

// const fs      = require('fs');
// const Promise = require('bluebird');
// const util    = require('./util');
// const type    = require('./type');
// const pread   = Promise.promisify(fs.read, { multiArgs: true });

// const DETECT_LENGTH = 16;

//Determines the appropriate plugin to use for the given file descriptor.
// module.exports = async function (fd, plugins) {
//   const res = await fd.read(new Buffer(DETECT_LENGTH), 0, DETECT_LENGTH, 0);
//   const buffer = res[0];

//   if (util.ascii(buffer, 0, 2) === 'BM') {
//     return type.BMP;
//   }

//   return type.UNKNOWN;

  // return pread(fd, new Buffer(DETECT_LENGTH), 0, DETECT_LENGTH, 0)
  // .spread(function (bytesRead, buffer) {
  //   if (util.ascii(buffer, 0, 2) === 'BM') {
  //     return type.BMP;
  //   }
  //   return type.UNKNOWN;
  // });
//};

