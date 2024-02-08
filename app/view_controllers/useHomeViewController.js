import { useNavigation } from '@react-navigation/native';
import { useNetInfo } from '@react-native-community/netinfo';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import moment from "moment/moment";

import constants from '../config/constants';
import forecastApi from '../api/forecast';
import useLocation from '../hooks/useLocation';

import { showAlert } from '../utility/views';
import LOG from '../utility/logger';

import useHomeViewModel from '../view_models/useHomeViewModel';

const useHomeViewController = () => {
    // view model
    const {
        addToForecastsVm,
        currentLocation,
        displayedToHomeVm,
        homeDisplayedForecast,
        removeFromForecastsVm,
        savedCurrentLocation,
        savedLocations,
        setCurrentLocationVm,
        temperatureUnitSaved,
        updateFromForecastsVm,
    } = useHomeViewModel();

    // localizations
    const {t, i18n} = useTranslation('home');

    // hardware status
    const netInfo = useNetInfo();
    const [isInternetReachable, setIsInternetReachable] = useState(false);

    // navigation
    const navigation = useNavigation();
    
    // ui data
    const [weatherDetails, setWeatherDetails] = useState(constants.defaultForecast);

    // api
    const {
        data: weatherDetailData,
        error,
        loading,
        request: weatherRequestByCoordinate,
    } = useApi(forecastApi.getForecastByCoordinate);

    const {
        data: weatherDetailData2,
        error: error2,
        loading: loading2,
        request: weatherRequestByLocationName,
    } = useApi(forecastApi.getForecastByLocationName);

    // ui
    // detect device location (long, lat)
    const { location, getLocation: getDeviceLocation } = useLocation();
    // your location indicator
    // use the current location button
    const [useCurrentLocation, setUseCurrentLocation] = useState(false);
    // re-detect device location button display (top-left)
    const [detectLocation, setDetectLocation] = useState(false);
    // search button display (top-right)
    const [searchButton, setSearchButton] = useState(true);
    // snackbar visibility (no internet connection)
    const [snackbarVisible, setSnackbarVisible] = useState(false);

    const hasInterNetConnection = () => {
        return isInternetReachable
    };
    const cityName = () => {
        var datasource = constants.defaultForecast;
        if(weatherDetails && weatherDetails.city) {
            datasource = weatherDetails;
        }
        return datasource.city.name;
    };
    const temperature = () => {
        var datasource = constants.defaultForecast
        if (weatherDetails && weatherDetails.list) {
            datasource = weatherDetails;
        }
        return Math.round(datasource.list[0].main.temp);
    };
    const weather = () => {
        var datasource = constants.defaultForecast
        if (weatherDetails && weatherDetails.list) {
            datasource = weatherDetails;
        }
        return datasource.list[0].weather[0].description;
    }
    const weatherImage = () => {
        var datasource = constants.defaultForecast
        if (weatherDetails && weatherDetails.list) {
            datasource = weatherDetails;
        }
        return datasource.list[0].weather[0].main;
    };
    const forecastDate = () => {
        var datasource = constants.defaultForecast
        if (weatherDetails && weatherDetails.list) {
            datasource = weatherDetails;
        }
        // default forecast data
        if (datasource.list[0].dt == 0) {
            return "Unknown";
        }
        const momentDate = moment(datasource.list[0].dt * 1000);
        const forecastDate = momentDate.format('DD MMMM YYYY | hh:mm a');
        return forecastDate;
    };
    const temperatureUnit = () => {
        var datasource = constants.defaultForecast
        if (weatherDetails && weatherDetails.list) {
            datasource = weatherDetails;
        }
        return datasource.temperatureUnit;
    };
    const getForecastByIdentifier = (uuid) => {
        const validForecasts = savedLocations.filter((forecast) => {
            return forecast.uuid == uuid;
        });
        //LOG.info("[HomeScreen]/getForecastByIdentifier", uuid, savedLocations.length, validForecasts.length);
        return validForecasts[0];
    };
    const getForecastByCityName = (name) => {
        const validForecasts = savedLocations.filter((forecast) => {
            return forecast.city.name == name;
        });
        //LOG.info("[HomeScreen]/getForecastByIdentifier", uuid, savedLocations.length, validForecasts.length);
        return validForecasts[0];
    };
    const savedLocationsEnums = () => {
        let maps = savedLocations.map((forecast) => ({
            uuid: forecast.uuid,
            cityName: forecast.city.name
        }));
        return maps;
    };

    // calculated attributes
    const [triggerFromLocationButton, setTriggerFromLocationButton] = useState(false);

    // actions
    const refreshHandler = () => {
        LOG.info("[HomeScreen]/refreshHandler");

        if (!isInternetReachable) {
            showAlert(
                "You are Offline",
                "Please check your internet connection."
            );
            return;
        }

        if (weatherDetails.uuid && weatherDetails.city.name) {
            LOG.info("[HomeScreen]/refreshHandler/weatherDetails", weatherDetails.city.name);
            weatherRequestByLocationName(weatherDetails.city.name);
        }
    };
    const detectDeviceLocationHandler = () => {
        LOG.info("[HomeScreen]", "detectDeviceLocationHandler", hasInterNetConnection());
        setTriggerFromLocationButton(true);

        if (hasInterNetConnection()) {
            setUseCurrentLocation(true);
            //
            getDeviceLocation();
        }
        else {
            showAlert(
                "You are Offline",
                "Please check your internet connection."
            );
        }
    };
    const searchLocationsHandler = () => {
        LOG.info("[HomeScreen]", "searchLocationsHandler");
        navigation.navigate("Locations");
    };

    // convenience method
    const hasCurrentLocation = () => {
        return (currentLocation && currentLocation.place);
    };
    const hasHomeDisplayedForecast = () => {
        return (homeDisplayedForecast &&
            homeDisplayedForecast.uuid &&
            homeDisplayedForecast.city)
    };

    return {
        addToForecastsVm,
        cityName,
        currentLocation,
        detectDeviceLocationHandler,
        detectLocation,
        displayedToHomeVm,
        error,
        error2,
        forecastDate,
        getDeviceLocation,
        getForecastByCityName,
        hasCurrentLocation,
        hasHomeDisplayedForecast,
        hasInterNetConnection,
        homeDisplayedForecast,
        i18n,
        isInternetReachable,
        location,
        loading,
        loading2,
        netInfo,
        refreshHandler,
        removeFromForecastsVm,
        savedLocations,
        searchButton,
        searchLocationsHandler,
        setCurrentLocationVm,
        setDetectLocation,
        setIsInternetReachable,
        setSnackbarVisible,
        setTriggerFromLocationButton,
        setUseCurrentLocation,
        setWeatherDetails,
        snackbarVisible,
        temperature,
        temperatureUnit,
        temperatureUnitSaved,
        triggerFromLocationButton,
        updateFromForecastsVm,
        useCurrentLocation,
        weather,
        weatherDetailData,
        weatherDetailData2,
        weatherDetails,
        weatherImage,
        weatherRequestByCoordinate,
        weatherRequestByLocationName,
    };
};

export default useHomeViewController;