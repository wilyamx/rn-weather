import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import moment from "moment/moment";
import RBSheet from "react-native-raw-bottom-sheet";

import constants from '../config/constants';
import forecastApi from '../api/forecast';
import useLocation from '../hooks/useLocation';
import {
    addToForecasts,
    updateFromForecasts,
} from '../redux/weather/weatherActions';
import { setCurrentLocation } from '../redux/location/locationActions';

import CircularIcon from '../components/CircularIcon';
import Screen from '../components/Screen';
import TemperatureUnit from '../components/TemperatureUnit';
import YourLocation from '../components/YourLocation';
import WeatherForecast from '../components/WeatherForecast';
import LOG from '../utility/logger';

function HomeScreen(props) {
    // redux
    const savedLocations = useSelector(state => state.weather.forecasts);
    const dispatch = useDispatch();

    // api

    const {
        data: weatherDetails,
        error,
        loading,
        request: weatherRequest
    } = useApi(forecastApi.getForecastByCoordinate);

    // ui

    const theme = useTheme();
    const refRBSheet = useRef();
    // detect device location
    const { location, getLocation: getDeviceLocation } = useLocation();
    // your location indicator
    const [yourLocation, setYourLocation] = useState(false);
    // re-detect device location button display
    const [detectLocation, setDetectLocation] = useState(false);
    // search button display
    const [searchButton, setSearchButton] = useState(false);

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
        return Math.round(datasource.list[datasource.list.length - 1].main.temp);
    };
    const weather = () => {
        var datasource = constants.defaultForecast
        if (weatherDetails && weatherDetails.list) {
            datasource = weatherDetails;
        }
        return datasource.list[datasource.list.length - 1].weather[0].main;
    }
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
        return forecastDate
    };

    // actions

    const refreshHandler = () => {
        console.log("[HomeScreen]", "refreshHandler");
        if (location) {
            // request forecast using device location
            weatherRequest(
                location.latitude,
                location.longitude
            );
        }
    };
    const detectDeviceLocationHandler = () => {
        console.log("[HomeScreen]", "detectDeviceLocationHandler");
        getDeviceLocation();
    };
    const searchLocationsHandler = () => {
        console.log("[HomeScreen]", "searchLocationsHandler");
    };

    // listeners

    useEffect(() => {
        setDetectLocation(false);
        setSearchButton(false);
        setYourLocation(false);
    }, []);

    useEffect(() => {
        LOG.info("[HomeScreen]/Device-Location", location);
        if (location) {
            // request forecast using device location
            weatherRequest(
                location.latitude,
                location.longitude
            );
        }
        setDetectLocation(location != null);
        setSearchButton(location == null);
    }, [location]);

    useEffect(() => {
        let savedLocationNames = savedLocations.map((forecast) => forecast.city.name);
        LOG.info("[HomeScreen]/Saved-Locations", savedLocationNames);

        if (!weatherDetails) return;

        if (!weatherDetails.list) return;
        if (weatherDetails.list.length == 0) return;

        if (!weatherDetails.city) return;

        let cityDetails = weatherDetails.city;
        let forecasts = weatherDetails.list;

        if (savedLocations.length == 0) {
            dispatch(addToForecasts(weatherDetails));
            setYourLocation(true);
        }
        else {
            if (!savedLocationNames.includes(cityDetails.name)) {
                LOG.info("[HomeScreen]/Added-Location", cityDetails.name);
                dispatch(addToForecasts(weatherDetails));
                setYourLocation(true);
            }
            else {
                LOG.info("[HomeScreen]/Existing-Location", cityDetails.name);
                dispatch(updateFromForecasts(weatherDetails));
                setYourLocation(true);
            }
        }

        if (location) {
            dispatch(setCurrentLocation({
                latitude: location.latitude,
                longitude: location.longitude,
                place: weatherDetails.city.name,
            }))
        }
    }, [weatherDetails]);

    return (
        <Screen>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <View style={styles.headerSideButtonContainer}>
                    { detectLocation &&
                        <CircularIcon
                            image={"map-marker"}
                            backgroundColor={theme.colors.primary}
                            onPress={detectDeviceLocationHandler}
                        />
                    }
                    </View>

                    <View style={styles.headerCenterContainer}>
                        <Text style={styles.title} variant='titleLarge'>Forecast Report</Text>
                        <Text style={[styles.date, { color: theme.colors.tertiary }]} variant='titleSmall'>
                            {forecastDate()}
                        </Text>
                    </View>
                    
                    <View style={styles.headerSideButtonContainer}>
                    { searchButton &&
                        <CircularIcon
                            image={"magnify"}
                            backgroundColor={theme.colors.primary}
                            onPress={searchLocationsHandler}
                        />
                    }
                    </View>
                </View>

                <View style={styles.weatherContainer}>
                    { yourLocation && <YourLocation style={styles.yourLocation} marginBottom={20} /> }
                    <Text style={styles.location}>{cityName()}</Text>
                    <TemperatureUnit temperature={temperature()} fontSize={100}/>
                    <Text style={[styles.weatherCondition, { color: theme.colors.tertiary }]}>{weather()}</Text>
                </View>

                <CircularIcon
                    image={"plus-circle"}
                    backgroundColor={theme.colors.primary}
                    size={40}
                    onPress={() => refRBSheet.current.open()}
                />
            </View>

            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={false}
                closeOnPressMask={false}
                customStyles={{
                    wrapper: {
                        backgroundColor: "transparent"
                    },
                    draggableIcon: {
                        backgroundColor: theme.colors.primary
                    },
                    container: {
                        backgroundColor: theme.colors.onSecondary,
                        borderRadius: 40,
                        overflow: "hidden",
                    },
                }}
                height={350}
            >
                <WeatherForecast
                    forecast={weatherDetails.list}
                    onRefresh={refreshHandler}
                    onDismiss={() => refRBSheet.current.close()}
                />
            </RBSheet>

        </Screen>
    );
}

const styles = StyleSheet.create({
    date: {
        textAlign: "center",
    },
    container: {
        padding: 20,
        alignItems: "center",
    },
    headerSideButtonContainer: {
        minWidth: "20%",
        alignItems:'center',
        justifyContent: "center",
    },
    headerCenterContainer: {
        minWidth: "60%",
    },
    headerContainer: {
        flexDirection: "row",
    },
    iconContainer: {
        alignItems: "center",
        borderRadius: 25,
        justifyContent: "center",
        width: 50,
        height: 50,
        backgroundColor: "orange"
    },
    location: {
        textAlign: "center",
        fontSize: 30,
    },
    title: {
        textAlign: "center",
        fontWeight: "bold",
    },
    weatherCondition: {
        textAlign: "center",
        fontSize: 25,
    },
    weatherContainer: {
        alignItems: "center",
        justifyContent: "center",
        height: "82%"
    },
    yourLocation: {
        marginBottom: 20,
    },
});

export default HomeScreen;