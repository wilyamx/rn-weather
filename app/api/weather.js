import client from './client';

const endpoint = '/weather'

const getWeather = (units = constants.temperatureUnit.celsiusUnit) => {
    const params = {
        appid: "368b07291c6814df232003d0f78f47b9",
        q: "cebu city",
        units,
    }
    return client.get(endpoint, params);
};

export default {
    getWeather,
}