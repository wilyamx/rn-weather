import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import HomeScreen from '../screens/HomeScreen';
import LocationsScreen from '../screens/LocationsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import LOG from '../utility/logger';

const Tab = createBottomTabNavigator();

function AppNavigator(props) {

    // localizations
    const { t, i18n } = useTranslation('common');

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
                    name={i18n.t('homeTab', { ns: 'common'})}
                    component={HomeScreen}
                    options={{ 
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="home" color={color} size={size} />
                    }}
                    listeners={({ navigation }) => ({ tabPress: () => {
                        LOG.info("[AppNavigator]/tabPress", "HomeScreen");
                        navigation.setParams({
                            cityId: 0,
                            locationId: "",
                            name: ""})
                        }})
                    }
                />
                <Tab.Screen
                    name={i18n.t('locationsTab', { ns: 'common'})}
                    component={LocationsScreen}
                    options={{ 
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="map-marker" color={color} size={size} />
                    }}
                />
                <Tab.Screen
                    name={i18n.t('settingsTab', { ns: 'common'})}
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