'use strict';

// NOTE: To run these benchmarks, make sure you have ImageMagick installed.
// ImageMagick is used as a comparison for measuring PNG and JPEG files.

var path     = require('path');
var Promise  = require('bluebird');
var pexec    = Promise.promisify(require('child_process').exec);

var calipers = require('../lib/index');

var ITERATIONS  = 500;
var CONCURRENCY =  50;

var BMP_PATH  = path.resolve(__dirname, '../test/fixtures/bmp/233x143.bmp');

function runCalipersBenchmark (name, file) {
  var arr = new Array(ITERATIONS);
  console.time(name);
  return Promise.resolve(arr)
  .map(function () {
    return calipers.measure(file);
  }, { concurrency: CONCURRENCY })
  .then(function (res) {
    console.timeEnd(name);
  });
}

function runExecBenchmark (name, command, file) {
  var arr = new Array(ITERATIONS);
  console.time(name);
  return Promise.resolve(arr)
  .map(function () {
    return pexec(command + ' ' + file);
  }, { concurrency: CONCURRENCY })
  .then(function () {
    console.timeEnd(name);
  })
}

console.log('Running benchmarks with ' + ITERATIONS +
  ' iterations at concurrency: ' + CONCURRENCY + '.\n');

runCalipersBenchmark('BMP calipers', BMP_PATH)
.then(function () {
  return runExecBenchmark('BMP identify', 'identify', BMP_PATH);
});
