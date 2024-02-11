import { create } from 'apisauce';

import LOG from '../utility/logger';

const API_BASE_URL = process.env.API_BASE_URL;
LOG.debug("[client]/API_BASE_URL", API_BASE_URL);

const apiClient = create({
    baseURL: API_BASE_URL
});

export default apiClient;