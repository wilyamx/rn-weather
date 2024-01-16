import { combineReducers } from 'redux';

import themeReducer from './theme/themeReducer';

const appReducers = combineReducers({
    theme: themeReducer
});

export default appReducers;