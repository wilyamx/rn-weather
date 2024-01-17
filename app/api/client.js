import { create } from 'apisauce';

const apiClient = create({
    baseURL: "http://api.openweathermap.org/data/2.5"
});

export default apiClient;