import { combineReducers, createStore } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "@react-native-async-storage/async-storage";

import themeReducer from "./theme/themeReducer";

const persistConfig = {
    key: "root",
    storage,
};

const appReducers = combineReducers({
    theme: persistReducer(persistConfig, themeReducer)
});

// https://github.com/rt2zz/redux-persist

export default () => {
    let store = createStore(appReducers);
    let persistor = persistStore(store);
    return {
        store, persistor
    }
};