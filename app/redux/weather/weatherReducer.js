import {
    ADD_TO_FORECASTS,
    REMOVE_FROM_FORECASTS,
    UPDATE_FROM_FORECASTS,
    DISPLAYED_TO_HOME,
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
        case REMOVE_FROM_FORECASTS:
            return {
                ...state,
                forecasts: state.forecasts.filter((forecast) => forecast.city.name !== action.payload)
            }
        case UPDATE_FROM_FORECASTS:
            return {
                ...state,
                forecasts: state.forecasts.map((forecast) => {
                    if (forecast.city.name === action.payload.city.name) {
                        return action.payload;
                    }
                    return forecast;
                })
            }
        case DISPLAYED_TO_HOME:
            return {
                ...state,
                forecasts: state.forecasts.map((forecast) => {
                    if (forecast.uuid === action.payload) {
                        console.log("DISPLAYED_TO_HOME", forecast.city.name, false)
                        return { ...forecast,
                            homeDisplayed: 1,
                        }
                    }
                    else {
                        console.log("DISPLAYED_TO_HOME", forecast.city.name, false)
                        return { ...forecast,
                            homeDisplayed: 0,
                        }
                    }
                })
            }
        default:
            return state
    }
};

export default weatherReducer;