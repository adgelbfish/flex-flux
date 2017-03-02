import { FlexFlux } from "./stateManager";

const { subscribe, modifyState, getState, addPrerun } = new FlexFlux();

let regularChecker = fooState => new Promise((res, rej) => {
  let modifierFunction = state => {
    state.foo = fooState;
    res(state.foo);
  };
  modifyState(modifierFunction);
});

let promiseChecker = fooState => new Promise((res, rej) => {
  let modifierFunction = state => new Promise((resolve, reject) => {
    state.foo = fooState;
    res(state.foo);
    resolve();
  });
  modifyState(modifierFunction);
});

describe("modifyState", () => {
  it("should modify the state according to modifier functions", async () => {
    let fooVar = await regularChecker("Hello");
    expect(fooVar).toEqual("Hello");
  });

  it("should be able to do it again", async () => {
    let fooVar = await regularChecker("Hi");
    expect(fooVar).toEqual("Hi");
  });

  it("should work for a Promise", async () => {
    let fooVar = await promiseChecker("Hello");
    expect(fooVar).toEqual("Hello");
  });

  it("should work for a Promise again", async () => {
    let fooVar = await promiseChecker("Hi");
    expect(fooVar).toEqual("Hi");
  });
});

describe("getState", () => {
  it("should return an object", () => {
    expect(typeof getState()).toBe("object");
  });
});

describe("subscribe", () => {
  it("should call the function that is passed to subscribe", async () => {
    let mockFn = jest.fn(() => {});
    subscribe(mockFn);
    await regularChecker("hi");
    await promiseChecker("hello");
    expect(mockFn).toHaveBeenCalled();
  });
});

describe("addPrerun", () => {
  it("should call the function passed to prerun", async () => {
    let mockFn = jest.fn(() => {});
    addPrerun(mockFn);
    await regularChecker("hi");
    await promiseChecker("hi");
    expect(mockFn).toHaveBeenCalled();
  });

  it("should wait at least 100ms on a promise passed to prerun", async () => {
    let mockFn = jest.fn(() => {});
    addPrerun(new Promise(resolve => setTimeout(() => resolve(mockFn()), 100)));
    await regularChecker("hi");
    await promiseChecker("hi");
    expect(mockFn).toHaveBeenCalled();
  });
});
