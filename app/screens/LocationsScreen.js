import React, { useCallback, useEffect } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Searchbar, Text } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import * as Network from 'expo-network';

import LOG from '../utility/logger';
import constants from '../config/constants';
import { showAlert } from '../utility/views';

import AppActivityIndicator from '../components/AppActivityIndicator';
import ListItemDeleteAction from '../components/lists/ListItemDeleteAction';
import LocationListItem from '../components/lists/LocationListItem';
import Screen from '../components/Screen';

import useLocationsViewController from '../view_controllers/useLocationsViewController';

const OFFLINE = constants.offlineMode;

function LocationsScreen({ navigation }) {

    const {
        addToForecastsVm,
        displayedToHomeVm,
        error,
        filterSavedLocationBySearchKey,
        handleDelete,
        handlePullToRefresh,
        handleSelectedForecast,
        handleSubmitSearchKey,
        i18n,
        loading,
        netInfo,
        refreshing,
        responseStatus,
        savedCurrentLocation,
        savedLocations,
        savedLocationsFiltered,
        searchQuery,
        setIsInternetReachable,
        setSavedLocationsFiltered,
        setSearchQuery,
        updateFromForecastsVm,
        weatherDetails,
    } = useLocationsViewController();

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

    return (
        <>
        <AppActivityIndicator visible={loading} />
        <Screen style={styles.container}>
            <Text style={styles.title} variant='titleLarge'>{i18n.t('pickLocations', { ns: 'locations' })}</Text>
            <Text style={styles.subtitle} variant='titleSmall'>
                {i18n.t('instructions', { ns: 'locations' })}
            </Text>
            <Searchbar
                placeholder={i18n.t('searchForAPlace', { ns: 'locations' })}
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