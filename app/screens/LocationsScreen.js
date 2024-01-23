import React, { useEffect } from 'react';
import LOG from '../utility/logger';
import uuid from 'react-native-uuid';
import { useState } from 'react';
import { Alert, FlatList, StyleSheet } from 'react-native';
import { Searchbar, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import forecastApi from '../api/forecast';
import useApi from '../hooks/useApi';
import {
    addToForecasts,
    removeFromForecasts,
    updateFromForecasts,
} from '../redux/weather/weatherActions';

import AppActivityIndicator from '../components/AppActivityIndicator';
import AppAlert from '../components/AppAlert';
import ListItemDeleteAction from '../components/lists/ListItemDeleteAction';
import LocationListItem from '../components/lists/LocationListItem';
import Screen from '../components/Screen';

function LocationsScreen({ navigation }) {
    // redux
    const temperatureUnit = useSelector(state => state.theme.temperatureUnit);
    const savedLocations = useSelector(state => state.weather.forecasts);
    const savedCurrentLocation = useSelector(state => state.location.currentLocation);
    const dispatch = useDispatch();

    // ui
    const [searchQuery, setSearchQuery] = useState('');
 
    // api
    const {
        data: weatherDetails,
        error,
        loading,
        request: weatherRequest
    } = useApi(forecastApi.getForecastByLocationName);

    // actions

    const handleDelete = async (location) => {
        LOG.info("[LocationScreen]/Remove-Selected-Forecast", location.city.name);
        dispatch(removeFromForecasts(location.city.name));
    };
    const handleSubmitSearchKey = async (key) => {
        if (key.length == 0) {
            Alert.alert(
                "Empty Searchbar",
                "Please input valid place.",
                [
                    { text: "OK" },
                ]
            );
            return;
        }
        weatherRequest(key, temperatureUnit);
    };
    const handleSelectedForecast = (forecast) => {
        console.log("[LocationScreen]/Selected-Location", forecast.city.id, forecast.city.name);
        navigation.navigate("Home");
    };
    
    useEffect(() => {
        console.info("[LocationsScreen]/Temperature-Unit-Saved", temperatureUnit);
    }, []);

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
            setSearchQuery("");
        }
        else {
            if (!savedLocationNames.includes(cityDetails.name)) {
                LOG.info("[LocationScreen]/Added-Location", cityDetails.name);
                dispatch(addToForecasts(weatherDetails));
                setSearchQuery("");
            }
            else {
                LOG.info("[LocationScreen]/Existing-Location", cityDetails.name);
                dispatch(updateFromForecasts(weatherDetails));
                setSearchQuery("");
            }
        }
    }, [weatherDetails]);

    return (
        <>
        <AppActivityIndicator visible={loading} />
        <Screen style={styles.container}>
            { error &&
                <>
                    <AppAlert
                        message={"No weather forecast available.\nPlease check location used."}
                    />
                </>
            }

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
                data={savedLocations}
                keyExtractor={item => uuid.v4()}
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