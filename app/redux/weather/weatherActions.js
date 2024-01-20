import {
    ADD_TO_FORECASTS,
    REMOVE_FROM_FORECASTS,
    UPDATE_FROM_FORECASTS,
} from './weatherTypes';

export const addToForecasts = (info = {}) => {
    return {
        type: ADD_TO_FORECASTS,
        payload: info,
    }
};

export const removeFromForecasts = (locationName = "") => {
    return {
        type: REMOVE_FROM_FORECASTS,
        payload: locationName,
    }
};

export const updateFromForecasts = (info = {}) => {
    return {
        type: UPDATE_FROM_FORECASTS,
        payload: info,
    }
};