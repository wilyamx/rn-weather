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

        console.log("[getForecastByLocationName]", cityDetails);
        console.log("[getForecastByLocationName]", forecasts.length);

        var dates = [];
        for (let i = 0; i < forecasts.length; i++) {
            let forecast = forecasts[i];
            console.info("[forecast]", forecast.dt_txt);
        }

        response.data.list = [];
    });

    return await client.get(endpoint, params);
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