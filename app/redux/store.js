import { applyMiddleware, createStore } from "redux";
import { persistCombineReducers, persistStore } from "redux-persist";
import { logger } from 'redux-logger';
import storage from "@react-native-async-storage/async-storage";

import themeReducer from "./theme/themeReducer";
import weatherReducer from "./weather/weatherReducer";

const persistConfig = {
    key: "root",
    storage,
};

const persistCombinedReducers = persistCombineReducers(
    persistConfig, {
    theme: themeReducer,
    weather: weatherReducer,
  });

// https://github.com/rt2zz/redux-persist

export default () => {
    let store = createStore(persistCombinedReducers, applyMiddleware(logger));
    let persistor = persistStore(store);
    return {
        store, persistor
    }
};