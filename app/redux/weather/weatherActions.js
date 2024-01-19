import {
    ADD_TO_FORECASTS,
    REMOVE_FROM_FORECASTS,
} from './weatherTypes';

export const addToForecasts = (info = {}) => {
    return {
        type: ADD_TO_FORECASTS,
        payload: info,
    }
};

export const removeFromForecasts = () => {
    return {
        type: REMOVE_FROM_FORECASTS,
    }
};