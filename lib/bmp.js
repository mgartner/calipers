'use strict';

// TODO: document this
const OFFSET = 14;
const OS2_BYTE = 0xC;

exports.measure = function (header) {

  // If the BMP is OS2, the width and height are 8 bit unsigned integers.
  if (header[OFFSET] === 0xC) {
    return {
      type: 'bmp',
      pages: [{
        width: header.readUInt8(4+OFFSET),
        height: header.readUInt8(6+OFFSET),
      }]
    };
  }


  // If the BMP is not OS2, the width and height are 16 bit unsigned
  // little-endian integers.
  return {
    type: 'bmp',
    pages: [{
      width: header.readUInt16LE(4+OFFSET),
      height: header.readUInt16LE(8+OFFSET),
    }]
  };
};

// var Promise = require('bluebird');
// var pread   = Promise.promisify(fs.read, { multiArgs: true });
// var utils   = require('./utils');
// 
// function measureWindows (buffer) {
//   return {
//     type: 'bmp',
//     pages: [{
//       width: buffer.readUInt16LE(4),
//       height: buffer.readUInt16LE(8)
//     }]
//   };
// }
// 
// function measureOS2 (buffer) {
//   return {
//     type: 'bmp',
//     pages: [{
//       width: buffer.readUInt8(4),
//       height: buffer.readUInt8(6)
//     }]
//   };
// }
// 
// exports.detect = function (buffer) {
//   return utils.ascii(buffer, 0, 2) === 'BM';
// }
// 
// exports.measure = function (path, fd) {
//   return pread(fd, new Buffer(10), 0, 10, 14)
//   .spread(function (bytesRead, buffer) {
//     if (buffer[0] !== 0xC) {
//       return measureWindows(buffer);
//     }
// 
//     return measureOS2(buffer);
//   });
// }
