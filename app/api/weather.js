import client from './client';

import LOG from '../utility/logger';

const endpoint = '/weather'

const APP_ID = process.env.APP_ID;
LOG.debug("[weather]/APP_ID", APP_ID);

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