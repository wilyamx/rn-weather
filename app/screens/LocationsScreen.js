import React, { useCallback, useEffect } from 'react';
import LOG from '../utility/logger';
import { useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Searchbar, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import * as Network from 'expo-network';
import { useNetInfo } from '@react-native-community/netinfo';

import constants from '../config/constants';
import forecastApi from '../api/forecast';
import useApi from '../hooks/useApi';
import {
    addToForecasts,
    removeFromForecasts,
    updateFromForecasts,
    displayedToHome,
} from '../redux/weather/weatherActions';
import { showAlert } from '../utility/views';

import AppActivityIndicator from '../components/AppActivityIndicator';
import ListItemDeleteAction from '../components/lists/ListItemDeleteAction';
import LocationListItem from '../components/lists/LocationListItem';
import Screen from '../components/Screen';

const OFFLINE = constants.offlineMode;

function LocationsScreen({ navigation }) {
    // redux
    const temperatureUnit = useSelector(state => state.theme.temperatureUnit);
    const savedLocations = useSelector(state => state.weather.forecasts);
    const homeDisplayedForecast = useSelector(state => state.weather.homeDisplayForecast);
    const savedCurrentLocation = useSelector(state => state.location.currentLocation);
    const dispatch = useDispatch();

    // hardware status
    const netInfo = useNetInfo();
    const [isInternetReachable, setIsInternetReachable] = useState(false);

    // ui
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [savedLocationsFiltered, setSavedLocationsFiltered] = useState([]);

    // api
    const {
        data: weatherDetails,
        error,
        loading,
        request: weatherRequest,
        responseStatus
    } = useApi(forecastApi.getForecastByLocationName);

    // actions

    const handleDelete = async (location) => {
        LOG.info("[LocationScreen]/Remove-Selected-Forecast", location.city.name);
        if (homeDisplayedForecast.city.name == location.city.name) {
            showAlert(
                "Deleting Selected Location",
                `You cannot delete this (${location.city.name}) because currently displayed from home.`
            );
            return;
        }
        dispatch(removeFromForecasts(location.city.name));

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
        
        LOG.info("[LocationScreen]/Selected-Location", params);
        navigation.navigate("Home", params);
    };
    const handlePullToRefresh = () => {
        LOG.info("[LocationScreen]/handlePullToRefresh");

        let savedLocationNames = savedLocationsFiltered.map((forecast) => ({
            cityName: forecast.city.name,
            homeDisplayed: forecast.homeDisplayed
        }));
        LOG.info("[LocationScreen]/Saved-Locations", savedLocationNames);
        LOG.info("[LocationScreen]/Home-Displayed-Forecast", homeDisplayedForecast.city);

        filterSavedLocationBySearchKey(searchQuery);
    };

    const filterSavedLocationBySearchKey = (text) => {
        LOG.info("[LocationsScreen]/filterSavedLocationBySearchKey", text);
        var data = [];
        if (text) {
            let keyFormatted = text.toLowerCase();
            let filteredData = savedLocations.slice().filter((forecast) => {
                let cityName = forecast.city.name.toLowerCase();
                return cityName.includes(keyFormatted);
            });
            //let mapData = filteredData.map((forecast) => forecast.city.name);
            //LOG.info("[LocationsScreen]/filteredData", mapData);
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
        setSavedLocationsFiltered(savedLocations);

        (async () => {
            var network = await Network.getNetworkStateAsync();
            if (OFFLINE) {
                network = {
                    isInternetReachable: false,
                    type: "None",
                    isConnected: false
                }
            }
            if (network.isConnected) {
                setIsInternetReachable(true);
            }
            else {
                setIsInternetReachable(false);
            }
        })();
    }, []);

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
            if (network.isConnected) {
                setIsInternetReachable(true);
            }
            else {
                setIsInternetReachable(false);
            }
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
        let savedLocationNames = savedLocations.map((forecast) => forecast.city.name);
        LOG.info("[LocationScreen]/Saved-Locations", savedLocationNames);

        if (!weatherDetails) return;

        if (!weatherDetails.list) return;
        if (weatherDetails.list.length == 0) return;

        if (!weatherDetails.city) return;

        let cityDetails = weatherDetails.city;
        let forecasts = weatherDetails.list;

        if (savedLocations.length == 0) {
            dispatch(addToForecasts(weatherDetails));
            dispatch(displayedToHome(weatherDetails));
            showAlert(
                "New place added",
                `(${cityDetails.name}) has been added to the list!`
            );
        }
        else {
            if (!savedLocationNames.includes(cityDetails.name)) {
                LOG.info("[LocationScreen]/Added-Location", cityDetails.name);
                dispatch(addToForecasts(weatherDetails));
                showAlert(
                    "New place added",
                    `(${cityDetails.name}) has been added to the list!`
                );
            }
            else {
                LOG.info("[LocationScreen]/Existing-Location", cityDetails.name);
                dispatch(updateFromForecasts(weatherDetails));
            }
            dispatch(displayedToHome(weatherDetails));
            LOG.info("[LocationsScreen]/homeDisplayedForecast/1");
        }

        setSearchQuery("");

    }, [weatherDetails]);

    return (
        <>
        <AppActivityIndicator visible={loading} />
        <Screen style={styles.container}>
            <Text style={styles.title} variant='titleLarge'>Pick Locations</Text>
            <Text style={styles.subtitle} variant='titleSmall'>
                Find the city that you want to know{'\n'} the detailed weather into at this time.
            </Text>
            <Searchbar
                placeholder="Search for a place"
                autoCorrect={false}
                value={searchQuery}
                style={styles.searchBar}
                onChangeText={setSearchQuery}
                onSubmitEditing={() => handleSubmitSearchKey(searchQuery)}
            />

            <FlatList
                data={savedLocationsFiltered}
                keyExtractor={item => item.uuid.toString()}
                renderItem={({ item }) => 
                    <LocationListItem
                        currentLocation={savedCurrentLocation}
                        location={item}
                        onPress={() => handleSelectedForecast(item)}
                        renderRightActions={() => 
                            <ListItemDeleteAction onPress={() => handleDelete(item)}/>
                        }
                    />
                }
                refreshing={refreshing}
                onRefresh={handlePullToRefresh}
            />
        </Screen>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    searchBar: {
        marginBottom: 15,
    },
    subtitle: {
        padding: 10,
        textAlign: "center"
    },
    title: {
        textAlign: "center",
        fontWeight: "bold",
    },
});

export default LocationsScreen;