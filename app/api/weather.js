import client from './client';

import { APP_ID } from '@env';

const endpoint = '/weather'

const getWeather = (
    searchKey,
    units = constants.temperatureUnit.celsiusUnit) => {

    const params = {
        appid: APP_ID,
        q: searchKey,
        units,
    }
    return client.get(endpoint, params);
};

export default {
    getWeather,
}