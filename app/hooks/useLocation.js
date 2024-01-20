import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import LOG from '../utility/logger';

export default useLocation = () => {
    const [location, setLocation] = useState();

    const getLocation = async () => {
        try {
            const { granted } = await Location.requestForegroundPermissionsAsync();
            if (!granted) {
                LOG.debug("[useLocation] Permission to access location was denied");
                return;
            }
            const {
                coords: { latitude, longitude },
            } = await Location.getLastKnownPositionAsync();
            setLocation({ latitude, longitude });
        } catch (error) {
            LOG.error("[useLocation]", error)
        }
    };

    useEffect(() => {
        getLocation();
    }, []);

    return location;
};