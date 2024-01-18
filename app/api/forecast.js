import client from './client';

const endpoint = '/forecast'

const getForecastByLocationName = (searchKey) => {
    const params = {
        appid: "368b07291c6814df232003d0f78f47b9",
        q: searchKey,
        units: "standard",
    }
    return client.get(endpoint, params);
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