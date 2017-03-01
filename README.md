#FlexFlux
##A simple flux implementation
inspired by https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367

##Installing
`npm install --save flex-flux` or `yarn add flex-flux`

##Hey, boilerplate
yup, there's a tiny bit of boilerplate added in 1.0.0 
in order for the api to be able to return a constructor

###but have no fear
it's just a tiny file that is named something like
`FlexFluxInstance.js`
with the following code:
```javascript
import FlexFlux from 'flex-flux';
const { modifyState, getState } = new FlexFlux();
export { modifyState, getState }
```

##The api
There are two exposed api entry points.

1. `modifyState` - a function that takes a function that should accept the state, _and mutate it_.
2. `getState` - a function that simply returns the state.

## Examples

```javascript
//replace with the relative location of your FlexFlux instance
import { getState, modifyState } from "./FlexFluxInstance";

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

Currently FlexFlux does not have an api to notify when a change happens.
A function that needs to be exectued only after change in state
can be executed inline as follows:
 
```javascript
//the thing you want to do
const thingToDo = (stuff) => console.log(stuff);

//add your modifier
modifyState(state => {
  state.foo = "bam";
  //you can do this if it needs to be executed as soon as possible:
  thingToDo(state);
});

//...or add it next, though this doesn't guarantee it happening right away
//it will execute at some point after the first one
modifyState(state => {
  thingToDo(state);
});
```
what's `getState`?, well, suppose you wanted the state at the current moment, here it is
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