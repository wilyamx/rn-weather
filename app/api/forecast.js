import client from './client';
import LOG from '../utility/logger';

var endpoint = '/forecast';

const getForecastByLocationName = async (searchKey) => {

    const params = {
        appid: "368b07291c6814df232003d0f78f47b9",
        q: searchKey,
        units: "standard",
    }

    // client.addAsyncRequestTransform(async (response) => {
    //     //console.log("[getForecastByLocationName]", response.data)

    //     // if (!response.data.city) return;

    //     let cityDetails = response.data.city
    //     let forecasts = response.data.list

    //     console.log("[getForecastByLocationName]", cityDetails);
    //     console.log("[getForecastByLocationName]", forecasts.length);

    //     // var dates = []

    //     for (let forecast in forecasts) {
    //         let dtTxt = forecast.main.temp;
    //         LOG.info(dtTxt)
    //     }

    // });

    // const get = client.get;
    // client.get = async (endpoint, params) => {
    //     console.log("0000");
    //     const response = await get(endpoint, params);

    //     let forecasts = response.data.list
    //     for (let forecast in forecasts) {
    //         console.log(forecast)
    //     }
    //     if (response.ok) {
    //         console.log("1111")
    //         return response;
    //     }

    //     const defaultData = { info: "no-data"}
    //     return data ? { ok: true, defaultData } : response;
    // }
    
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