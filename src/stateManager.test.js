import { FlexFlux } from "./stateManager";

const { modifyState, getState } = new FlexFlux();

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
    resolve()
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
