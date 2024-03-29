import { applyMiddleware, createStore } from "redux";
import { persistCombineReducers, persistStore } from "redux-persist";
import { logger } from 'redux-logger';
import storage from "@react-native-async-storage/async-storage";

import locationReducer from "./location/locationReducer";
import themeReducer from "./theme/themeReducer";
import weatherReducer from "./weather/weatherReducer";

const persistConfig = {
    key: "root",
    storage,
};

const persistCombinedReducers = persistCombineReducers(
    persistConfig, {
    location: locationReducer,
    theme: themeReducer,
    weather: weatherReducer,
  });

// https://github.com/rt2zz/redux-persist
// TODO: https://redux-toolkit.js.org/introduction/getting-started

export default () => {
    var store = createStore(persistCombinedReducers);
    if (process.env.NODE_ENV === 'development') {
        store = createStore(persistCombinedReducers, applyMiddleware(logger));
    }

    let persistor = persistStore(store);
    return {
        store, persistor
    }
};