import { useDispatch, useSelector } from 'react-redux';

import {
    addToForecasts,
    removeFromForecasts,
    updateFromForecasts,
    displayedToHome,
} from '../redux/weather/weatherActions';

const useLocationsViewModel = () => {
    // redux
    const temperatureUnit = useSelector(state => state.theme.temperatureUnit);
    const savedLocations = useSelector(state => state.weather.forecasts);
    const homeDisplayedForecast = useSelector(state => state.weather.homeDisplayForecast);
    const savedCurrentLocation = useSelector(state => state.location.currentLocation);
    const dispatch = useDispatch();

    const removeFromForecastsVm = (cityName) => {
        dispatch(removeFromForecasts(cityName));
    };
    const addToForecastsVm = (weatherDetails) => {
        dispatch(addToForecasts(weatherDetails));
    };
    const displayedToHomeVm = (weatherDetails) => {
        dispatch(displayedToHome(weatherDetails));
    };
    const updateFromForecastsVm = (weatherDetails) => {
        dispatch(updateFromForecasts(weatherDetails));
    };

    return {
        addToForecastsVm,
        displayedToHomeVm,
        homeDisplayedForecast,
        removeFromForecastsVm,
        temperatureUnit,
        savedCurrentLocation,
        savedLocations,
        updateFromForecastsVm,
    };
};

export default useLocationsViewModel;