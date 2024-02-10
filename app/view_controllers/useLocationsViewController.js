import { useNavigation } from '@react-navigation/native';
import { useNetInfo } from '@react-native-community/netinfo';
import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import * as Network from 'expo-network';

import LOG from '../utility/logger';
import constants from '../config/constants';
import forecastApi from '../api/forecast';
import useApi from '../hooks/useApi';
import { showAlert } from '../utility/views';

import useLocationsViewModel from "../view_models/useLocationsViewModel";

const OFFLINE = constants.offlineMode;

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

    // hooks

    useEffect(() => {
        LOG.info("[LocationScreen]/initialize");

        // initialize the listing display
        let newList = savedLocations.slice()
        setSavedLocationsFiltered(newList);
        LOG.info("[LocationScreen]/savedLocations", newList.length);

        (async () => {
            var network = await Network.getNetworkStateAsync();
            // for testin only
            if (OFFLINE) {
                network = {
                    isInternetReachable: false,
                    type: "None",
                    isConnected: false
                }
            }
            setIsInternetReachable(network.isConnected);
        })();
    }, []);

    useFocusEffect(
        useCallback(() => {
            LOG.info("[LocationScreen]/useFocusEffect");
        }, [])
    );

    useEffect(() => {
        LOG.info("[LocationScreen]/searchQuery", searchQuery);
        filterSavedLocationBySearchKey(searchQuery);
    }, [searchQuery]);

    // this will update every time change in internet connection status
    // user turn off/on the device wifi
    useEffect(() => {
        (async () => {
            var network = await Network.getNetworkStateAsync();
            if (OFFLINE) {
                network = {
                    isInternetReachable: false,
                    type: "None",
                    isConnected: false
                }
            }
            setIsInternetReachable(network.isConnected);
        })();
    }), [netInfo.isInternetReachable];

    useEffect(() => {
        LOG.info("[LocationScreen]/error", error);
    }, [error]);

    useEffect(() => {
        LOG.info("[LocationScreen]/responseStatus", responseStatus);
        if (responseStatus == 404) {
            showAlert(
                "Location not found!",
                `Please use different name.\nUnable to find (${searchQuery}) from the places.`
            );
        }
    }, [responseStatus]);

    useEffect(() => {
        LOG.info("[LocationScreen]/useEffect/weatherDetails");
        //
        let savedLocationNames = savedLocations.map((forecast) => forecast.city.name);
        LOG.info("[LocationScreen]/Saved-Locations", savedLocationNames);

        if (!weatherDetails) return;
        if (!weatherDetails.list) return;
        if (weatherDetails.list.length == 0) return;
        if (!weatherDetails.city) return;

        LOG.info("[LocationScreen]/useEffect/weatherDetails/validated");
        let cityDetails = weatherDetails.city;

        if (savedLocations.length == 0) {
            addToForecastsVm(weatherDetails);
            displayedToHomeVm(weatherDetails);
            showAlert(
                "New place added",
                `(${cityDetails.name}) has been added to the list!`
            );
        }
        else {
            if (!savedLocationNames.includes(cityDetails.name)) {
                LOG.info("[LocationScreen]/Added-Location", cityDetails.name);
                addToForecastsVm(weatherDetails);
                showAlert(
                    "New place added",
                    `(${cityDetails.name}) has been added to the list!`
                );
            }
            else {
                LOG.info("[LocationScreen]/Existing-Location", cityDetails.name);
                updateFromForecastsVm(weatherDetails);
            }
            displayedToHomeVm(weatherDetails);
        }

        // clear the searchbar
        setSearchQuery("");

    }, [weatherDetails]);

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