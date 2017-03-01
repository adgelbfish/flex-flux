export const FlexFlux = function (){
  const state = {};

  let queue = [];
  let isRunning = false;

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
      })
      .catch(console.log);
  };
  return {
    modifyState: modifier => {
      addToQueue(modifier);
    },
    getState: () => state
  };
};
