import {
    ADD_TO_FORECASTS,
    REMOVE_FROM_FORECASTS,
} from './weatherTypes';

const initialState = {
    forecasts: [],
};

const weatherReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_FORECASTS: 
            return {
                ...state,
                forecasts: [...state.forecasts, action.payload]
            }
        default:
            return state
    }
};

export default weatherReducer;