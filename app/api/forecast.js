import client from './client';
import LOG from '../utility/logger';

var endpoint = '/forecast';

const getForecastByLocationName = async (searchKey) => {

    const params = {
        appid: "368b07291c6814df232003d0f78f47b9",
        q: searchKey,
        units: "standard",
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

            let latestForecast = forecastsByDate[forecastsByDate.length - 1];
            filteredForecasts.push(latestForecast)
        }

        // update the response using the validated forecasts
        response.data.list = filteredForecasts;
    });

    return await client.get(endpoint, params);
};

const getDateComponents = (dt_txt) => {
    // 2024-01-20 03:00:0
    let dateComponents = dt_txt.split(" ");
    return dateComponents
};

const getForecastByCoordinate = () => {
    const params = {
        appid: "368b07291c6814df232003d0f78f47b9",
        lat: "10.38888494832551",
        lon: "123.79170276199301",
        units: "standard",
    }
    return client.get(endpoint, params);
};

export default {
    getForecastByLocationName,
    getForecastByCoordinate,
}