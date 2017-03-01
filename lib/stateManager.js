"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var FlexFlux = exports.FlexFlux = function FlexFlux() {
  var state = {};

  var queue = [];
  var isRunning = false;

  var addToQueue = function addToQueue(modifier) {
    queue.push(modifier);
    if (!isRunning) runQueue();
  };

  var runQueue = function runQueue() {
    isRunning = true;
    var exec = Promise.resolve();
    exec.then(function () {
      var fn = queue.shift();
      if (fn) return fn(state);
    }).then(function () {
      if (queue.length) {
        runQueue();
      } else {
        isRunning = false;
      }
    }).catch(console.log);
  };
  return {
    modifyState: function modifyState(modifier) {
      addToQueue(modifier);
    },
    getState: function getState() {
      return state;
    }
  };
};