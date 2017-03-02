#FlexFlux
##A simpler flux
Inspired by https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367

Read more here: https://medium.com/@adg_88110/why-i-wrote-a-flux-implementation-5f94a0f7a5c2#.9gt012xwv

The basic idea of it is, usually, **the more flexible the coding is, the easier it is to develop, unless flexibility introduces problems**.
So FlexFlux tries to make it more flexible while still fixing the "good to unwanted state' problem caused by shared state mutated by multiple accessors.

(The problem occurs when the user requests an asynchronous call to update the data, then another call on the same data and the second one finishes before the first. With shared mutable state, even though the user expects the data to be as the first and then the second call mutated it, it is unpredictable to the developer. )

##Installing
`npm install --save flex-flux` or `yarn add flex-flux`

##Get started
make a file named something like `dataStore.js`
with the following code:
```javascript
import FlexFlux from 'flex-flux';
export const { modifyState, getState, subscribe } = new FlexFlux();
```

##The api
There are three exposed api entry points.

1. `modifyState` - takes a function that should accept the state object, and do whatever it wants with it.
2. `getState` - gets the current state.
3. `subscribe` - runs a function passed to it every time modifyState finishes.

## Examples

**modifyState** used to modify the state

```javascript
//replace with the relative location of your FlexFlux instance
import { getState, modifyState } from "./dataStore";

const initialModifier = state => {
  state.foo = "bar";
};

modifyState(initialModifier); //after this runs in the queue, state.foo will be "bar".

//you don't have do declare the functions first if you are only using them once.
modifyState(state => {
  state.foo = "baz";
});
//after that runs, state.foo will be "baz".

// now let's reset
modifyState(initialModifier); //this will leave the end result of state.foo to be "bar"

```

~~Currently FlexFlux does not have an api to notify when a change happens.~~

-- subscribe functionality added in 0.1.0


**getState** -- to get the state at the current moment
```javascript
getState(); //returns the state at the current moment, see following

//print the current state every second
setInterval(
  () => {
    console.log(getState());
  },
  1000
);
```
**subscribe** -- used to update the view when the state changes

```javascript
//commmon example from create-react-app modified to use FlexFlux
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import { getState, subscribe } from "./dataStore";

const renderApp = () =>
  ReactDOM.render(<App state={getState()} />, document.getElementById("root"));

renderApp();

subscribe(renderApp);

```


##And what about async?
###promises, promises, promises
Just return a promise instead of a synchronous function...
FlexFlux will wait until the promise resolves before running the next modifier.

```javascript
//axios because it's a popular use case scenario
import axios from "axios";

//modifier that implements a promise, demo taken from the axios readme
const promiseModifier = state => axios
  .get("/user?ID=12345")
  .then(response => {
    state.user = response;
  })
  .catch(err => state.userErr = err);

//pass it right in
modifyState(promiseModifier);
```