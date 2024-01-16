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

export const store = createStore(appReducers);
export const persistor = persistStore(store);

export default store;