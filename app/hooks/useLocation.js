import { useEffect, useState } from 'react';
import { Alert, Linking } from 'react-native';
import * as Location from 'expo-location';

import { CoordinatesModel } from '../models/GeolocationModel';
import LOG from '../utility/logger';

export default useLocation = () => {
    const [location, setLocation] = useState();
    
    const permissionAlert = () => {
        Alert.alert(
        'Location disabled',
        'You did not allow location permissions.',
        [
            { text: 'Go to Settings', onPress: () => Linking.openSettings()},
            { text: 'Cancel'}
        ]);
    };

    const getLocation = async (allowAlert = false) => {
        LOG.debug("[useLocation]/useEffect/getLocation");
        //
        setLocation(null);
        try {
            const { granted } = await Location.requestForegroundPermissionsAsync();

            if (!granted) {
                LOG.debug("[useLocation]/notAllowed");
                if (allowAlert) {
                    permissionAlert();
                }
                return;
            }

            const {
                coords: { latitude, longitude },
            } = await Location.getLastKnownPositionAsync();

            let locationModel = new CoordinatesModel(latitude, longitude);
            setLocation(locationModel);
            
        } catch (error) {
            LOG.error("[useLocation]/error", error)
        }
    };

    useEffect(() => {
        getLocation();
    }, []);

    //LOG.debug("[useLocation]/Device-Location", location);
    return { location, getLocation };
};