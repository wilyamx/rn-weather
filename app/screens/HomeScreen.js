import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import moment from "moment/moment";
import RBSheet from "react-native-raw-bottom-sheet";
import * as Network from 'expo-network';

import constants from '../config/constants';
import forecastApi from '../api/forecast';
import useLocation from '../hooks/useLocation';
import {
    addToForecasts,
    updateFromForecasts,
} from '../redux/weather/weatherActions';
import { setCurrentLocation } from '../redux/location/locationActions';

import AppActivityIndicator from '../components/AppActivityIndicator';
import AppAlert from '../components/AppAlert';
import CircularIcon from '../components/CircularIcon';
import Screen from '../components/Screen';
import TemperatureUnit from '../components/TemperatureUnit';
import YourLocation from '../components/YourLocation';
import WeatherForecast from '../components/WeatherForecast';
import LOG from '../utility/logger';

const DEBUG = constants.debug;

const getTemperatureUnitSign = (
    forecastUnit,
    unitTemperature,
    debug = false) => {
        
    // forecastUnit - unit of the weather forecast from api response
    // unitTemperature - unit to display from the settings view

    var unit = unitTemperature;
    if (debug) {
        unit = forecastUnit
    }
    
    if (unit == constants.temperatureUnit.celsiusUnit) {
        return constants.temperatureUnitSign.celsiusUnit;
    }
    else if (unit == constants.temperatureUnit.fahrenheitUnit) {
        return constants.temperatureUnitSign.fahrenheitUnit;
    }
    else {
        return constants.temperatureUnitSign.kelvinUnit;
    }
};

const celsiusToFahrenheit = (celsius) => {
    return (celsius * 9 / 5) + 32;
};

const fahrenheitToCelsius = (fahrenheit) => {
    return (fahrenheit - 32) * 5 / 9;
};

const getTemperatureDisplay = (
    reading,
    fromDisplayUnit,
    temperatureUnit,
    withDecimal = false,
    debug = false) => {
    
    // LOG.info("[HomeScreen]/getTemperatureDisplay", reading);
    if (debug) return reading;

    var result = reading;

    // from: metric (celsius), to: metric (celsius)
    if (fromDisplayUnit == constants.temperatureUnit.celsiusUnit &&
        temperatureUnit == constants.temperatureUnit.celsiusUnit) {
            result = reading;
        }
    // from: imperial (fahrenheit), to: imperial (fahrenheit)
    else if (fromDisplayUnit == constants.temperatureUnit.fahrenheitUnit &&
        temperatureUnit == constants.temperatureUnit.fahrenheitUnit) {
            result = reading;
        }
    // from metric (celsius), to: imperial (fahrenheit)
    else if (fromDisplayUnit == constants.temperatureUnit.celsiusUnit &&
        temperatureUnit == constants.temperatureUnit.fahrenheitUnit) {
            result = celsiusToFahrenheit(reading);
        }
    // from imperial (fahrenheit), to: metric (celsius)
    else if (fromDisplayUnit == constants.temperatureUnit.fahrenheitUnit &&
        temperatureUnit == constants.temperatureUnit.celsiusUnit) {
            result = fahrenheitToCelsius(reading);
        }
    return withDecimal ? result.toFixed(2) : Math.round(result);
};

function HomeScreen({ route, navigation }) {
    LOG.info("[HomeScreen]", "function");

    // redux

    const temperatureUnitSaved = useSelector(state => state.theme.temperatureUnit);
    const savedLocations = useSelector(state => state.weather.forecasts);
    const dispatch = useDispatch();

    // hardware status

    const [isInternetReachable, setIsInternetReachable] = useState(false);
    (async () => {
        let networkState = await Network.getNetworkStateAsync();
        setIsInternetReachable(networkState.isInternetReachable);
        //
        //LOG.info("[HomeScreen]/networkState", isInternetReachable);
    })();

    // api

    const [weatherDetails, setWeatherDetails] = useState(constants.defaultForecast);
    
    const {
        data: weatherDetailData,
        error,
        loading,
        request: weatherRequest
    } = useApi(forecastApi.getForecastByCoordinate);

    const {
        data: weatherDetailData2,
        error: error2,
        loading: loading2,
        request: weatherRequest2
    } = useApi(forecastApi.getForecastByLocationName);

    // ui

    const theme = useTheme();
    const refRBSheet = useRef();
    // detect device location
    const { location, getLocation: getDeviceLocation } = useLocation();
    // your location indicator
    // use the current location button
    const [useCurrentLocation, setUseCurrentLocation] = useState(true);
    // re-detect device location button display
    const [detectLocation, setDetectLocation] = useState(false);
    // search button display
    const [searchButton, setSearchButton] = useState(true);

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

    // actions

    const refreshHandler = () => {
        LOG.info("[HomeScreen]", "refreshHandler");
        if (location) {
            // request forecast using device location
            weatherRequest(
                location.latitude,
                location.longitude
            );
        }
    };
    const detectDeviceLocationHandler = () => {
        LOG.info("[HomeScreen]", "detectDeviceLocationHandler");
        setUseCurrentLocation(true);
        //
        getDeviceLocation();
    };
    const searchLocationsHandler = () => {
        LOG.info("[HomeScreen]", "searchLocationsHandler");
        navigation.navigate("Locations");
    };

    // hooks

    // this will trigger once only
    useEffect(() => {
        LOG.info("[HomeScreen]/useEffect", "initialize");
        //
        setDetectLocation(false);

        // apply initially weather details in useState hook
        setWeatherDetails(weatherDetailData);
    }, []);

    useEffect(() => {
        LOG.info("[HomeScreen]/useEffect/Device-Location", location);
        //
        if (location) {
            LOG.info("[HomeScreen]/useEffect/weatherRequest");
            // request forecast using device location
            weatherRequest(
                location.latitude,
                location.longitude
            );
        }
        setDetectLocation(location != null);
    }, [location]);

    useEffect(() => {
        LOG.info("[HomeScreen]/useEffect/weatherDetailData");
        //
        setWeatherDetails(weatherDetailData);
    }, [weatherDetailData]);

    useEffect(() => {
        LOG.info("[HomeScreen]/useEffect/weatherDetailData2");
        //
        setWeatherDetails(weatherDetailData2);
    }, [weatherDetailData2]);

    useEffect(() => {
        LOG.info("[HomeScreen]/useEffect/weatherDetails");
        //
        let savedLocationNames = savedLocations.map((forecast) => forecast.city.name);
        LOG.info("[HomeScreen]/Saved-Locations", savedLocationNames);

        if (!weatherDetails) return;

        if (!weatherDetails.list) return;
        if (weatherDetails.list.length == 0) return;

        if (!weatherDetails.city) return;

        let uuid = weatherDetails.uuid;
        let cityDetails = weatherDetails.city;
        let forecasts = weatherDetails.list;
        
        if (savedLocations.length == 0 && uuid.length > 0) {
            dispatch(addToForecasts(weatherDetails));
        }
        else {
            if (!savedLocationNames.includes(cityDetails.name) && uuid.length > 0) {
                LOG.info("[HomeScreen]/useEffect/Added-Location", cityDetails.name);
                dispatch(addToForecasts(weatherDetails));
            }
            else {
                LOG.info("[HomeScreen]/useEffect/Existing-Location", cityDetails.name);
                dispatch(updateFromForecasts(weatherDetails));
            }
        }

        if (location && useCurrentLocation) {
            dispatch(setCurrentLocation({
                latitude: location.latitude,
                longitude: location.longitude,
                place: weatherDetails.city.name,
            }))
        }
    
    }, [weatherDetails]);

    // works every time the page is navigated even with same route params
    useFocusEffect(
        // routes
        useCallback(() => {
            if (route.params) {
                // from locations
                LOG.info("[HomeScreen]/useFocusEffect", route.params);
                //
                if (route.params.locationId &&
                    route.params.cityId &&
                    route.params.name) {
                    
                    setUseCurrentLocation(route.params.isCurrentLocation);
                    
                    let selectedForecast = getForecastByIdentifier(route.params.locationId);
                    setWeatherDetails(selectedForecast);

                    if (isInternetReachable) {
                        // request for updated weather forecast
                        LOG.info("[HomeScreen]/useFocusEffect/online");
                        LOG.info("[HomeScreen]/useFocusEffect/weatherRequest", selectedForecast.city.name);
                        weatherRequest2(selectedForecast.city.name)
                    }
                    else {
                        // just display the saved data
                        LOG.info("[HomeScreen]/useFocusEffect/offline");
                    }
                }
            }
        }, [route])
    );

    return (
        <>
        <AppActivityIndicator visible={loading || loading2} />
        <Screen>
            { (error || error2) &&
                <>
                    <AppAlert
                        message={"No weather forecast available from your location."}
                    />
                </>
            }

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
                    { useCurrentLocation && <YourLocation style={styles.yourLocation} marginBottom={20} /> }
                    <Text style={styles.location}>{cityName()}</Text>
                    <TemperatureUnit
                        temperature={
                            getTemperatureDisplay(
                                temperature(),
                                temperatureUnit(),
                                temperatureUnitSaved,
                                false,
                                DEBUG
                            )
                        }
                        fontSize={100}
                        color={theme.colors.tertiary}
                        unit={getTemperatureUnitSign(temperatureUnit, temperatureUnitSaved, DEBUG)}
                    />
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
        </>
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
        fontSize: 30,
        fontWeight: "600",
        textAlign: "center",
        textTransform: "uppercase",
    },
    title: {
        textAlign: "center",
        fontWeight: "bold",
    },
    weatherCondition: {
        textAlign: "center",
        fontSize: 25,
        textTransform: "capitalize",
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