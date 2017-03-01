"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _stateManager = require("./stateManager");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var _ref = new _stateManager.FlexFlux(),
    subscribe = _ref.subscribe,
    modifyState = _ref.modifyState,
    getState = _ref.getState;

var regularChecker = function regularChecker(fooState) {
  return new Promise(function (res, rej) {
    var modifierFunction = function modifierFunction(state) {
      state.foo = fooState;
      res(state.foo);
    };
    modifyState(modifierFunction);
  });
};

var promiseChecker = function promiseChecker(fooState) {
  return new Promise(function (res, rej) {
    var modifierFunction = function modifierFunction(state) {
      return new Promise(function (resolve, reject) {
        state.foo = fooState;
        res(state.foo);
        resolve();
      });
    };
    modifyState(modifierFunction);
  });
};

describe("modifyState", function () {
  it("should modify the state according to modifier functions", _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
    var fooVar;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regularChecker("Hello");

          case 2:
            fooVar = _context.sent;

            expect(fooVar).toEqual("Hello");

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));

  it("should be able to do it again", _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
    var fooVar;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return regularChecker("Hi");

          case 2:
            fooVar = _context2.sent;

            expect(fooVar).toEqual("Hi");

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  })));

  it("should work for a Promise", _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
    var fooVar;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return promiseChecker("Hello");

          case 2:
            fooVar = _context3.sent;

            expect(fooVar).toEqual("Hello");

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  })));

  it("should work for a Promise again", _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
    var fooVar;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return promiseChecker("Hi");

          case 2:
            fooVar = _context4.sent;

            expect(fooVar).toEqual("Hi");

          case 4:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  })));
});

describe("getState", function () {
  it("should return an object", function () {
    expect(_typeof(getState())).toBe("object");
  });
});

describe("subscribe", function () {
  it("should call the function that is passed to subscribe", _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
    var mockFn;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            mockFn = jest.fn(function () {});

            subscribe(mockFn);
            _context5.next = 4;
            return regularChecker("hi");

          case 4:
            _context5.next = 6;
            return promiseChecker("hello");

          case 6:
            expect(mockFn).toHaveBeenCalled();

          case 7:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  })));
});