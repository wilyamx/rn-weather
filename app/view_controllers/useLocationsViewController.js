import { useNavigation } from '@react-navigation/native';
import { useNetInfo } from '@react-native-community/netinfo';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import LOG from '../utility/logger';
import forecastApi from '../api/forecast';
import useApi from '../hooks/useApi';

import useLocationsViewModel from "../view_models/useLocationsViewModel";

const useLocationsViewController = () => {
    // view model
    const {
        addToForecastsVm,
        displayedToHomeVm,
        homeDisplayedForecast,
        temperatureUnit,
        removeFromForecastsVm,
        savedCurrentLocation,
        savedLocations,
        updateFromForecastsVm,
    } = useLocationsViewModel();

    // api
    const {
        data: weatherDetails,
        error,
        loading,
        request: weatherRequest,
        responseStatus
    } = useApi(forecastApi.getForecastByLocationName);

    // localizations
    const { t, i18n } = useTranslation(['locations']);

    // hardware status
    const netInfo = useNetInfo();
    const [isInternetReachable, setIsInternetReachable] = useState(false);

    // navigation
    const navigation = useNavigation();

    // ui
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [savedLocationsFiltered, setSavedLocationsFiltered] = useState([]);

    // actions
    const handleDelete = async (location) => {
        LOG.info("[useLocationsViewController]/Remove-Selected-Forecast", location.city.name);
        if (homeDisplayedForecast.city.name == location.city.name) {
            showAlert(
                "Deleting Selected Location",
                `You cannot delete this (${location.city.name}) because currently displayed from home.`
            );
            return;
        }
        removeFromForecastsVm(location.city.name)

        let list = savedLocationsFiltered.slice().filter((forecast) => {
            return forecast.city.name != location.city.name
        });
        setSavedLocationsFiltered(list);
    };
    const handleSubmitSearchKey = async (key) => {
        if (!isInternetReachable) {
            showAlert("You are Offline", "Please check your internet connection.");
            return;
        }
        if (key.length == 0) {
            showAlert("Empty Searchbar", "Please input valid place.");
            return;
        }
        weatherRequest(key, temperatureUnit);
    };
    const handleSelectedForecast = (forecast) => {
        const isCurrentLocation = savedCurrentLocation.place == forecast.city.name
        
        let params = {
            locationId: forecast.uuid,
            cityId: forecast.city.id,
            name: forecast.city.name,
            isCurrentLocation: isCurrentLocation,
        }
        
        LOG.info("[useLocationsViewController]/Selected-Location", params);
        navigation.navigate("Home", params);
    };
    const handlePullToRefresh = () => {
        LOG.info("[useLocationsViewController]/handlePullToRefresh");

        let savedLocationNames = savedLocationsFiltered.map((forecast) => ({
            cityName: forecast.city.name,
            homeDisplayed: forecast.homeDisplayed
        }));
        LOG.info("[useLocationsViewController]/Saved-Locations", savedLocationNames);
        LOG.info("[useLocationsViewController]/Home-Displayed-Forecast", homeDisplayedForecast.city);

        filterSavedLocationBySearchKey(searchQuery);
    };

    // convenience methods
    const filterSavedLocationBySearchKey = (text) => {
        LOG.info("[useLocationsViewController]/filterSavedLocationBySearchKey", text);
        //
        var data = [];
        if (text) {
            let keyFormatted = text.toLowerCase();
            let filteredData = savedLocations.slice().filter((forecast) => {
                let cityName = forecast.city.name.toLowerCase();
                return cityName.includes(keyFormatted);
            });
            //let mapData = filteredData.map((forecast) => forecast.city.name);
            //LOG.info("[useLocationsViewController]/filteredData", mapData);
            data = filteredData;
        }
        else {
            data = savedLocations;
        }

        let sortedData = data.sort((a, b) => a.city.name.localeCompare(b.city.name))
        setSavedLocationsFiltered(sortedData);
    };

    return {
        addToForecastsVm,
        displayedToHomeVm,
        error,
        filterSavedLocationBySearchKey,
        handleDelete,
        handlePullToRefresh,
        handleSelectedForecast,
        handleSubmitSearchKey,
        homeDisplayedForecast,
        i18n,
        isInternetReachable,
        loading,
        netInfo,
        refreshing,
        removeFromForecastsVm,
        responseStatus,
        savedCurrentLocation,
        savedLocations,
        savedLocationsFiltered,
        searchQuery,
        setIsInternetReachable,
        setSavedLocationsFiltered,
        setSearchQuery,
        temperatureUnit,
        updateFromForecastsVm,
        weatherDetails,
    };
};

export default useLocationsViewController;