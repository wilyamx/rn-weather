import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { BottomNavigation, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';

import SettingsScreen from '../screens/SettingsScreen';
import LocationsScreen from '../screens/LocationsScreen';
import HomeScreen from '../screens/HomeScreen';

const Tab = createBottomTabNavigator();

function AppNavigator(props) {
    const theme = useTheme();

    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={{
                    tabBarActiveTintColor: theme.colors.primary,
                    tabBarLabelStyle: {
                        fontSize: 13,
                        fontWeight: "bold",
                    },
                    tabBarStyle: {
                        backgroundColor: theme.colors.background,
                    }
                }}
            >
                <Tab.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ 
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="home" color={color} size={size} />
                    }}
                />
                <Tab.Screen
                    name="Locations"
                    component={LocationsScreen}
                    options={{ 
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="map-marker" color={color} size={size} />
                    }}
                />
                <Tab.Screen
                    name="Settings"
                    component={SettingsScreen}
                    options={{ 
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="account" color={color} size={size} />
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {

    }
});

export default AppNavigator;