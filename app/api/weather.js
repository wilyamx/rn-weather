import client from './client';

const endpoint = '/weather'

const getWeather = () => {
    const params = {
        appid: "368b07291c6814df232003d0f78f47b9",
        q: "cebu city",
        units: "standard",
    }
    return client.get(endpoint, params);
};

export default {
    getWeather,
}