export const FlexFlux = function() {
  const state = {};

  let queue = [];
  let isRunning = false;
  let subscriptions = [];

  const addToQueue = modifier => {
    queue.push(modifier);
    if (!isRunning) runQueue();
  };

  const runQueue = () => {
    isRunning = true;
    let exec = Promise.resolve();
    exec
      .then(() => {
        let fn = queue.shift();
        if (fn) return fn(state);
      })
      .then(() => {
        if (queue.length) {
          runQueue();
        } else {
          isRunning = false;
        }
        subscriptions.forEach(fn => fn());
      })
      .catch(console.log);
  };

  const subscribe = fn => {
    subscriptions.push(fn);
  };
  return {
    modifyState: modifier => {
      addToQueue(modifier);
    },
    getState: () => state,
    subscribe: fn => subscribe(fn)
  };
};
