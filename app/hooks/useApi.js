import { useState } from 'react';

import LOG from '../utility/logger';

export default useApi = (apiFunc) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [responseStatus, setResponseStatus] = useState(0)

    const request = async (...args) => {
        setResponseStatus(0);
        setLoading(true);
        const response = await apiFunc(...args);
        setLoading(false);

        setError(!response.ok);
        setData(response.data);

        if (response && response.config && response.status) {
            setResponseStatus(response.status);

            LOG.info("[useApi]", response.config.url, response.status.toString())
            //LOG.info("[useApi]", response);
        }
        else {
            LOG.error("[useApi]", response.config.url, response.status.toString());
        }

        return response;
    };

    return { data, error, loading, request, responseStatus };
}