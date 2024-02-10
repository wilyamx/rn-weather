import { useNavigation } from '@react-navigation/native';
import { useNetInfo } from '@react-native-community/netinfo';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import moment from "moment/moment";
import * as Network from 'expo-network';

import constants from '../config/constants';
import forecastApi from '../api/forecast';
import useLocation from '../hooks/useLocation';

import { SaveLocationModel } from '../models/SaveLocationModel';
import { showAlert } from '../utility/views';
import LOG from '../utility/logger';

import useHomeViewModel from '../view_models/useHomeViewModel';

// to show the actual temperature unit saved locally
const OFFLINE = constants.offlineMode;

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
    // search button display (top-right)
    const [searchButton, setSearchButton] = useState(true);
    // snackbar visibility (no internet connection)
    const [snackbarVisible, setSnackbarVisible] = useState(false);

    const refRBSheet = useRef();

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
        //LOG.info("[useHomeViewController]/getForecastByIdentifier", uuid, savedLocations.length, validForecasts.length);
        return validForecasts[0];
    };
    const getForecastByCityName = (name) => {
        const validForecasts = savedLocations.filter((forecast) => {
            return forecast.city.name == name;
        });
        //LOG.info("[useHomeViewController]/getForecastByIdentifier", uuid, savedLocations.length, validForecasts.length);
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
        LOG.info("[useHomeViewController]/refreshHandler");

        if (!isInternetReachable) {
            showAlert(
                "You are Offline",
                "Please check your internet connection."
            );
            return;
        }

        if (weatherDetails.uuid && weatherDetails.city.name) {
            LOG.info("[useHomeViewController]/refreshHandler/weatherDetails", weatherDetails.city.name);
            weatherRequestByLocationName(weatherDetails.city.name);
        }
    };
    const detectDeviceLocationHandler = () => {
        LOG.info("[useHomeViewController]/detectDeviceLocationHandler", hasInterNetConnection().toString());
        setTriggerFromLocationButton(true);

        if (hasInterNetConnection()) {
            if (hasCurrentLocation(), currentLocation.place == weatherDetails.city.name) {
                setUseCurrentLocation(true);
            }
            else {
                setUseCurrentLocation(false);
            }
            //
            getDeviceLocation(true);
        }
        else {
            showAlert(
                "You are Offline",
                "Please check your internet connection."
            );
        }
    };
    const searchLocationsHandler = () => {
        LOG.info("[useHomeViewController]", "searchLocationsHandler");
        navigation.navigate("Locations");
    };

    const navigateWithRouteParamsHandler = (route) => {
        if (route.params) {
            // from locations
            LOG.info("[useHomeViewController]/useFocusEffect/route.params", route.params);
            LOG.info("[useHomeViewController]/useFocusEffect/homeDisplayedForecast", homeDisplayedForecast.city);
            
            // user selected a location from locations tab and navigate to home tab
            if (route.params.locationId &&
                route.params.cityId &&
                route.params.name) {
                
                const selectedForecast = getForecastByCityName(route.params.name);
                if (!selectedForecast) {
                    LOG.info("[useHomeViewController]/useFocusEffect/selectedForecast/none");
                    return;
                }

                LOG.info("[useHomeViewController]/useFocusEffect/selectedForecast", selectedForecast.city.name);
                displayedToHomeVm(selectedForecast)
                setUseCurrentLocation(route.params.isCurrentLocation);

                if (hasInterNetConnection()) {
                    LOG.info("[useHomeViewController]/useFocusEffect/online");
                    LOG.info("[useHomeViewController]/useFocusEffect/weatherRequest", selectedForecast.city.name);
                    // request for updated weather forecast
                    weatherRequestByLocationName(selectedForecast.city.name)
                }
                else {
                    // just display the saved data
                    LOG.info("[useHomeViewController]/useFocusEffect/offline");
                    setWeatherDetails(selectedForecast);
                }
            }
            // user just switch from location tab to home tab only
            else {
                LOG.info("[useHomeViewController]/useFocusEffect/no.route.params");

                if (!hasCurrentLocation() && !hasHomeDisplayedForecast()) {
                    LOG.info("[useHomeViewController]/noData");
                    setUseCurrentLocation(false);
                    return;
                }

                var selectedForecast = null;

                // home displayed
                if (hasHomeDisplayedForecast()) {
                    selectedForecast = getForecastByCityName(homeDisplayedForecast.city.name);
                    if (!selectedForecast) return;  
                }
                
                if (selectedForecast && selectedForecast.city) {
                    setUseCurrentLocation(selectedForecast.city.name == currentLocation.place);
                }

                if (hasInterNetConnection()) {
                    LOG.info("[useHomeViewController]/useFocusEffect/online");
                    LOG.info("[useHomeViewController]/useFocusEffect/weatherRequest", selectedForecast.city.name);
                    // request for updated weather forecast
                    // only if current displayed is not the home displayed location
                    if (weatherDetails.uuid != selectedForecast.uuid) {
                        weatherRequestByLocationName(selectedForecast.city.name)
                    }
                }
                else {
                    // just display the saved data
                    LOG.info("[useHomeViewController]/useFocusEffect/offline");
                    setWeatherDetails(selectedForecast);
                }
            }
           
        }
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

    // hooks

    // trigger when reload
    // this will trigger once only
    useEffect(() => {
        LOG.info("#1.0 [useHomeViewController]/useEffect/initialize");
        LOG.info("#1.1 [useHomeViewController]/useEffect/initialize/weatherDetailData", weatherDetailData);

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
            if (network.isConnected) {
                LOG.info("#1.2 [useHomeViewController]/internetConnect", network);
                LOG.info("#1.2 [useHomeViewController]/isInternetReachable", isInternetReachable);

                // your location indicator
                if (hasCurrentLocation()) {
                    LOG.info("#1.2 [useHomeViewController]/currentLocation", currentLocation.place);
                    const forecast = getForecastByCityName(currentLocation.place);

                    if (hasHomeDisplayedForecast()) {
                        setUseCurrentLocation(forecast.city.name == homeDisplayedForecast.city.name);
                    }
                    else {
                        setUseCurrentLocation(false);
                    }
                }
                
                if (hasHomeDisplayedForecast()) {
                    LOG.info("#1.2 [useHomeViewController]/homeDisplayedForecast", homeDisplayedForecast.city.name);
                    // show home displayed forecast
                    setWeatherDetails(homeDisplayedForecast)
                }

                if (!hasCurrentLocation() && !hasHomeDisplayedForecast()) {
                    LOG.info("#1.2 [useHomeViewController]/noData");
                    setUseCurrentLocation(false);
                }
            }
            else {
                LOG.info("#1.3 [useHomeViewController]/internetNotConnected");
                LOG.info("#1.3 [useHomeViewController]/homeDisplayedForecast", homeDisplayedForecast.city.name);
                LOG.info("#1.3 [useHomeViewController]/currentLocation", currentLocation.place);

                // your location indicator
                const selectedForecast = getForecastByCityName(currentLocation.place);
                setUseCurrentLocation(selectedForecast.city.name == homeDisplayedForecast.city.name);

                // show home displayed forecast
                setWeatherDetails(homeDisplayedForecast)
            }
        })();
    }, []);

    useEffect(() => {
        LOG.info("#2.0 [useHomeViewController]/isInternetReachable", isInternetReachable);
        setSnackbarVisible(!isInternetReachable);
    }, [isInternetReachable]);

    useEffect(() => {
        LOG.info("#3.0 [useHomeViewController]/useEffect/weatherDetailData");
        //
        // Update the home display status from locations tab
        let data = weatherDetailData;
        
        if (!data) return;
        if (!data.list) return;
        if (data.list.length == 0) return;
        if (!data.city) return;

        data.homeDisplayed = true;

        LOG.info("#3.1 [useHomeViewController]/useEffect/weatherDetailData/validated");

        setWeatherDetails(weatherDetailData);

        updateFromForecastsVm(weatherDetailData);
        // indicator that this location displayed from home tab
        if (weatherDetailData.city.name) {
            displayedToHomeVm(weatherDetailData);
        }
    }, [weatherDetailData]);

    useEffect(() => {
        LOG.info("[useHomeViewController]/useEffect/location");

        if (!location) {
            //Linking.openSettings();
            return;
        }

        LOG.info("[useHomeViewController]/useEffect/location/coordinate", location, triggerFromLocationButton);

        // we will show the home displayed forecast if available
        if (!triggerFromLocationButton && hasHomeDisplayedForecast()) {
            setWeatherDetails(homeDisplayedForecast);
            return;
        };

        if (location) {
            if (hasInterNetConnection()) {
                LOG.info("[useHomeViewController]/useEffect/weatherRequestByCoordinate");
                // request forecast using device location
                weatherRequestByCoordinate(
                    location.latitude,
                    location.longitude
                );
            }
            else {
                LOG.info("[useHomeViewController]/useEffect/loadLocationHomeDisplay");
                let forecastHomeDisplayed = getForecastByCityName(homeDisplayedForecast.city.name)
                setWeatherDetails(forecastHomeDisplayed);
            }
        }
        setUseCurrentLocation(location != null)
        //
        setTriggerFromLocationButton(false);
    }, [location]);

    // this will update every time change in internet connection status
    // user turn off/on the device wifi
    useEffect(() => {
        (async () => {
            let network = await Network.getNetworkStateAsync();
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
        if (!weatherDetailData2.city) return;
        LOG.info("[useHomeViewController]/useEffect/weatherDetailData2/city", weatherDetailData2.city.name);
        //
        // Update the home display status from locations tab
        let data = weatherDetailData2;
        data.homeDisplayed = true;
        //
        setWeatherDetails(data);
        // indicator that this location displayed from home tab
        if (data.city.name) {
            displayedToHomeVm(data);
        }
        //
        if (!data) return;
        if (!data.list) return;
        if (data.list.length == 0) return;
        if (!data.city) return;

        LOG.info("[useHomeViewController]/useEffect/weatherDetailData2/data", data);
        updateFromForecastsVm(data);
    }, [weatherDetailData2]);

    useEffect(() => {
        LOG.info("[useHomeViewController]/useEffect/weatherDetails");
        //
        let savedLocationNames = savedLocations.map((forecast) => forecast.city.name);
        //LOG.info("[useHomeViewController]/Saved-Locations", savedLocationNames);

        if (!hasInterNetConnection()) {
            //setWeatherDetails(homeDisplayedForecast);
            if (weatherDetails.city.name) {
                displayedToHomeVm(weatherDetails);
            }
            return;
        }
        
        if (!weatherDetails) return;
        if (!weatherDetails.list) return;
        if (weatherDetails.list.length == 0) return;
        if (!weatherDetails.city) return;

        LOG.info("[useHomeViewController]/useEffect/weatherDetails/validated");

        let uuid = weatherDetails.uuid;
        let cityDetails = weatherDetails.city;
        let forecasts = weatherDetails.list;
        
        if (savedLocations.length == 0 && uuid.length > 0) {
            addToForecastsVm(weatherDetails);
            LOG.info("[useHomeViewController]/useEffect/Added-First-Location", cityDetails.name);
        }
        else {
            if (!savedLocationNames.includes(cityDetails.name) && uuid.length > 0) {
                LOG.info("[useHomeViewController]/useEffect/Added-Location", cityDetails.name);
                addToForecastsVm(weatherDetails)
            }
            else {
                LOG.info("[useHomeViewController]/useEffect/Existing-Location", cityDetails.name);
                updateFromForecastsVm(weatherDetails);
            }
        }

        if (!hasCurrentLocation()) {
            setUseCurrentLocation(false);
        }

        if (location && useCurrentLocation) {
            setUseCurrentLocation(true);

            let details = new SaveLocationModel(
                location.latitude,
                location.longitude,
                weatherDetails.city.name,
                weatherDetails.uuid);
            setCurrentLocationVm(details);
            
            LOG.info("[useHomeViewController]/useEffect/weatherDetails/Updated-User-Location");
        }
        
    }, [weatherDetails]);

    return {
        cityName,
        detectDeviceLocationHandler,
        error,
        error2,
        forecastDate,
        i18n,
        loading,
        loading2,
        navigateWithRouteParamsHandler,
        refRBSheet,
        refreshHandler,
        searchButton,
        searchLocationsHandler,
        setSnackbarVisible,
        snackbarVisible,
        temperature,
        temperatureUnit,
        temperatureUnitSaved,
        useCurrentLocation,
        weather,
        weatherDetails,
        weatherImage,
    };
};

export default useHomeViewController;