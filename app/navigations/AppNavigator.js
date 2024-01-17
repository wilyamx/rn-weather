import React from 'react';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { BottomNavigation, Text } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';

import SettingsScreen from '../screens/SettingsScreen';
import LocationsScreen from '../screens/LocationsScreen';
import HomeScreen from '../screens/HomeScreen';

function AppNavigator(props) {
    const [index, setIndex] = useState(1);
    const [routes] = useState([
        { key: "home", title: "Home", focusedIcon: "home", unfocusedIcon: "home-outline"},
        { key: "locations", title: "Locations", focusedIcon: "map-marker", unfocusedIcon: "map-marker-outline"},
        { key: "settings", title: "Settings", focusedIcon: "account", unfocusedIcon: "account-outline"},
    ]);

    const renderScene = BottomNavigation.SceneMap({
        home: HomeScreen,
        locations: LocationsScreen,
        settings: SettingsScreen,
    });
    
    return (
        <NavigationContainer>
            <BottomNavigation
                navigationState={{ index, routes }}
                onIndexChange={setIndex}
                renderScene={renderScene}
            />
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {

    }
});

export default AppNavigator;