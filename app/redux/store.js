import { createStore } from "redux";

import appReducers from ".";

const store = createStore(appReducers);

export default store;