import { useDispatch, useSelector } from 'react-redux';
import { setCurrentLocation } from '../redux/location/locationActions';

import {
    addToForecasts,
    removeFromForecasts,
    updateFromForecasts,
    displayedToHome,
} from '../redux/weather/weatherActions';

const useHomeViewModel = () => {
    // redux
    const temperatureUnitSaved = useSelector(state => state.theme.temperatureUnit);
    const savedLocations = useSelector(state => state.weather.forecasts);
    const homeDisplayedForecast = useSelector(state => state.weather.homeDisplayForecast);
    const currentLocation = useSelector(state => state.location.currentLocation);
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

    // {
    //     latitude: location.latitude,
    //     longitude: location.longitude,
    //     place: weatherDetails.city.name,
    //     uuid: weatherDetails.uuid,
    // }
    const setCurrentLocationVm = (locationDetails) => dispatch(setCurrentLocation(locationDetails));

    return {
        addToForecastsVm,
        currentLocation,
        displayedToHomeVm,
        homeDisplayedForecast,
        removeFromForecastsVm,
        savedLocations,
        setCurrentLocationVm,
        temperatureUnitSaved,
        updateFromForecastsVm,
    };
};

export default useHomeViewModel;