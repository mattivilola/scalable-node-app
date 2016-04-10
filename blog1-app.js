'use strict';
/**
 * Module dependencies
 */
var cluster = require('cluster');
var http = require('http');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */
const NUM_OF_WORKERS_PER_CPU = 1;

if (cluster.isMaster) {
  var osNumOfCPUs = require('os').cpus().length;
  var numOfWorkers = osNumOfCPUs * NUM_OF_WORKERS_PER_CPU;
  for (var i = 0; i < numOfWorkers; i++) {
    cluster.fork();
  }
  cluster.on('online', function(worker) {
    console.log('Worker process ' + worker.process.pid + ' is online!');
  });
  cluster.on('exit', function(worker, code, signal) {
    console.log('Worker process ' + worker.process.pid + ' has died with code: ' + code + ', and signal: ' + signal);
    console.log('We don\'t want that, so let\'s start a new worker..');
    cluster.fork();
  });
  console.log('Master started '+numOfWorkers+' workers.');
} else {
  http.createServer(function(req, res) {
    res.end('Hello from worker process: ' + process.pid);
  }).listen(8080);
}
