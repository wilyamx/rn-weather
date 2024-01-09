import React from 'react';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { BottomNavigation, Text } from 'react-native-paper';

import Screen from '../components/Screen';
import SettingsScreen from '../screens/SettingsScreen';

const HomeScreen = () => <Screen><Text>Home</Text></Screen>;
const LocationsScreen = () => <Screen><Text>Locations</Text></Screen>;
// const SettingsScreen = () => <Screen><Text>Settings</Text></Screen>;

function AppNavigator(props) {
    const [index, setIndex] = useState(2);
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
        <BottomNavigation
            navigationState={{ index, routes }}
            onIndexChange={setIndex}
            renderScene={renderScene}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        
    }
});

export default AppNavigator;