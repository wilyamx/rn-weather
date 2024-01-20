import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import RBSheet from "react-native-raw-bottom-sheet";
import { useDispatch, useSelector } from 'react-redux';

import constants from '../config/constants';
import forecastApi from '../api/forecast';
import useLocation from '../hooks/useLocation';
import {
    addToForecasts,
    updateFromForecasts,
} from '../redux/weather/weatherActions';

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
    const location = useLocation();
    const [yourLocation, setYourLocation] = useState(false);

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

    useEffect(() => {
        setYourLocation(false);
    }, []);

    useEffect(() => {
        LOG.info("[HomeScreen]/Device-Location", location);
        if (location) {
            weatherRequest(
                location.latitude,
                location.longitude
            );
        }
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
    }, [weatherDetails]);

    return (
        <Screen>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <CircularIcon image={"map-marker"} backgroundColor={theme.colors.primary}/>
                    <View>
                        <Text style={styles.title} variant='titleLarge'>Forecast Report</Text>
                        <Text style={styles.date} variant='titleSmall'>
                            Mon, January 1, 2024
                        </Text>
                    </View>
                    <CircularIcon image={"magnify"} backgroundColor={theme.colors.primary} />
                </View>

                <View style={styles.weatherContainer}>
                    { yourLocation && <YourLocation /> }
                    <Text style={styles.location}>{cityName()}</Text>
                    <TemperatureUnit temperature={temperature()} fontSize={100}/>
                    <Text style={styles.weatherCondition}>{weather()}</Text>
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
                    onRefresh={() => console.log("Refresh")}
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
    headerContainer: {
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        width: "100%"
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
    },
    weatherCondition: {
        textAlign: "center",
        fontSize: 20,
    },
    weatherContainer: {
        alignItems: "center",
        justifyContent: "center",
        height: "82%"
    },
});

export default HomeScreen;