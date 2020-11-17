'use strict';

const fs = require('fs').promises;

const bmp  = require('./bmp');
const util = require('./util');

// const popen   = Promise.promisify(fs.open);
// const pclose  = Promise.promisify(fs.close);
// const detect  = require('./detect');
// const type    = require('./type');

// TODO (explain why we read this amount);
// 16 - what it was
// 24 - header needed for BMP
// const HEADER_LENGTH = 16;
const HEADER_LENGTH = 24;

const TYPE_UNKNOWN = 0;
const TYPE_BMP = 1;

exports.measure = async function measure (path) {
  let fd = null;
  try {
    fd = await fs.open(path, 'r');

    const header = Buffer.alloc(HEADER_LENGTH);
    const res = await fd.read(header, 0, HEADER_LENGTH, 0);

    const type = detect(header);

    // Handle BMP images.
    if (type == TYPE_BMP) {
      return bmp.measure(header);
    }

    // Throw an error if a supported file type was not detected.
    throw new Error('file type not supported');
  } finally {
    if (fd) {
      await fd.close();
    }
  }
}

function detect (header) {
  if (util.ascii(header, 0, 2) === 'BM') {
    return TYPE_BMP;
  }
  return TYPE_UNKNOWN;
}


  // return popen(path, 'r')
  // .then(function (fd) {
  //   fileDescriptor = fd;
  //   return detect(fd, plugins);
  // })
  // .then(function (t) {
  //   if (t === type.BMP) {
  //     return bmp.measure(path, fileDescriptor)
  //   }
  // })
  // .finally(function () {
  //   return pclose(fileDescriptor);
  // })
  // .asCallback(callback);
// }

//module.exports = function () {
//  var args = Array.prototype.slice.call(arguments);
//
//  var plugins = args.map(function (arg) {
//    if (typeof arg === 'object') {
//      return arg;
//    } else {
//      return require('calipers-' + arg);
//    }
//  });
//
//  return {
//    measure: measure.bind(null, plugins)
//  };
//};
