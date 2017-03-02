"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var FlexFlux = exports.FlexFlux = function FlexFlux() {
  var state = {};

  var queue = [];
  var isRunning = false;
  var subscriptions = [];
  var preruns = [];

  var addToQueue = function addToQueue(modifier) {
    queue.push(modifier);
    if (!isRunning) runQueue();
  };

  var runQueue = function runQueue() {
    isRunning = true;
    var exec = Promise.resolve();
    exec.then(function () {
      return Promise.all(preruns.map(function (prerun) {
        if (typeof prerun === "function") {
          prerun();
        }
        return prerun;
      }));
    }).then(function () {
      var fn = queue.shift();
      if (fn) return fn(state);
    }).then(function () {
      if (queue.length) {
        runQueue();
      } else {
        isRunning = false;
      }
      subscriptions.forEach(function (fn) {
        return fn();
      });
    }).catch(console.log);
  };

  var subscribe = function subscribe(fn) {
    subscriptions.push(fn);
  };

  var addPrerun = function addPrerun(fn) {
    preruns.push(fn);
  };

  return {
    modifyState: function modifyState(modifier) {
      addToQueue(modifier);
    },
    getState: function getState() {
      return state;
    },
    subscribe: subscribe,
    addPrerun: addPrerun
  };
};