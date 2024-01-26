import {
    ADD_TO_FORECASTS,
    DISPLAYED_TO_HOME,
    REMOVE_FROM_FORECASTS,
    UPDATE_FROM_FORECASTS,
} from './weatherTypes';

// info - weather details
export const addToForecasts = (info = {}) => {
    return {
        type: ADD_TO_FORECASTS,
        payload: info,
    }
};

// locationName - city name
export const removeFromForecasts = (locationName = "") => {
    return {
        type: REMOVE_FROM_FORECASTS,
        payload: locationName,
    }
};

// info - weather details
export const updateFromForecasts = (info = {}) => {
    return {
        type: UPDATE_FROM_FORECASTS,
        payload: info,
    }
};

// info - uuid
export const displayedToHome = (info = {}) => {
    return {
        type: DISPLAYED_TO_HOME,
        payload: info,
    }
};