import client from './client';
import constants from '../config/constants';
import uuid from 'react-native-uuid';

import { APP_ID } from '@env';

var endpoint = '/forecast';

const getForecastByLocationName = async (
    searchKey,
    units = constants.temperatureUnit.celsiusUnit) => {

    const params = {
        appid: APP_ID,
        q: searchKey,
        units
    }

    client.addAsyncResponseTransform(async (response) => {

        let cityDetails = response.data.city
        let forecasts = response.data.list

        if (!forecasts) return;
        if (!cityDetails) return;

        var dates = [];
        var filteredForecasts = [];

        // extract the unique forecast dates
        for (let i = 0; i < forecasts.length; i++) {
            let forecast = forecasts[i];

            let dateComponents = getDateComponents(forecast.dt_txt);
            let date = dateComponents[0];
            let time = dateComponents[1];
            
            if (dates.includes(date)) {
                //console.info("[forecast]", date, time);
                continue;
            }
            else {
                //console.info("[forecast]", date, time, "**");
                dates.push(date);
            }
        }

        //console.log("[forecast]/dates", dates);

        // get the latest forecast date for each day
        for (let i = 0; i < dates.length; i++) {
            let forecastsByDate = forecasts.filter((forecast) => {
                let dateComponents2 = getDateComponents(forecast.dt_txt);
                let date2 = dateComponents2[0];

                return date2 == dates[i];
            });

            // let filteredDates = forecastsByDate.map((item) => item.dt_txt);
            // console.log("filteredDates", filteredDates);

            let latestForecast = forecastsByDate[0];
            filteredForecasts.push(latestForecast)
        }

        // update the response using the validated forecasts
        response.data.list = filteredForecasts;

        // new keys
        response.data.temperatureUnit = units;
        // Cebu City and Mandaue have same city.id
        response.data.uuid = uuid.v4();
    });

    return await client.get(endpoint, params);
};

const getDateComponents = (dt_txt) => {
    // 2024-01-20 03:00:0
    let dateComponents = dt_txt.split(" ");
    return dateComponents
};

const getForecastByCoordinate = async (
    latitude,
    longitude,
    units = constants.temperatureUnit.celsiusUnit) => {

    const params = {
        appid: APP_ID,
        lat: latitude,
        lon: longitude,
        units
    }

    client.addAsyncResponseTransform(async (response) => {

        let cityDetails = response.data.city
        let forecasts = response.data.list

        if (!forecasts) return;
        if (!cityDetails) return;

        var dates = [];
        var filteredForecasts = [];

        // extract the unique forecast dates
        for (let i = 0; i < forecasts.length; i++) {
            let forecast = forecasts[i];

            let dateComponents = getDateComponents(forecast.dt_txt);
            let date = dateComponents[0];
            let time = dateComponents[1];
            
            if (dates.includes(date)) {
                //console.info("[forecast]", date, time);
                continue;
            }
            else {
                //console.info("[forecast] **", date, time);
                dates.push(date);
            }
        }

        //console.log("dates", dates);

        // get the latest forecast date for each day
        for (let i = 0; i < dates.length; i++) {
            let forecastsByDate = forecasts.filter((forecast) => {
                let dateComponents2 = getDateComponents(forecast.dt_txt);
                let date2 = dateComponents2[0];

                return date2 == dates[i];
            });

            // let filteredDates = forecastsByDate.map((item) => item.dt_txt);
            // console.log("filteredDates", filteredDates);

            let latestForecast = forecastsByDate[0];
            filteredForecasts.push(latestForecast)
        }

        // update the response using the validated forecasts
        response.data.list = filteredForecasts;

        // new keys
        response.data.temperatureUnit = units;
        // Cebu City and Mandaue have same city.id
        response.data.uuid = uuid.v4();
    });
    
    return await client.get(endpoint, params);
};

export default {
    getForecastByLocationName,
    getForecastByCoordinate,
}