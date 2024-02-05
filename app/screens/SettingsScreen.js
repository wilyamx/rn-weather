import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../auth/AppContextProvider';
import { FlatList, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import {
    switchToDarkMode,
    switchToLightMode,
    temperatureInCelsius,
    temperatureInFahrenheit,
} from '../redux/theme/themeActions';

import ConfigListItem from '../components/lists/ConfigListItem';
import ListItemSeparator from '../components/lists/ListItemSeparator';
import Screen from '../components/Screen';
import { DarkTheme, LightTheme } from '../config/Themes';

function SettingsScreen(props) {

    // localizations
    const { t, i18n } = useTranslation('settings');
    const config1 = i18n.t('temperatureUnitInFahrenheit', { ns: 'settings'});
    const config2 = i18n.t('darkModeAppearance', { ns: 'settings'});

    // redux
    const temperatureUnit = useSelector(state => state.theme.temperatureUnit);
    const colorScheme = useSelector(state => state.theme.colorScheme);
    const dispatch = useDispatch();

    // temperature unit
    const [isSwitchOn1, setIsSwitchOn1] = useState(temperatureUnit === 'celsius' ? true : false);
    // dark mode appearance
    const [isSwitchOn2, setIsSwitchOn2] = useState(colorScheme === 'dark' ? true : false);

    // context
    const { theme, changeTheme } = useContext(AppContext);

    // https://static.enapter.com/rn/icons/material-community.html
    const configItems = [
        {
            title: config1,
            icon: "coolant-temperature",
            getState: isSwitchOn1,
            setState: setIsSwitchOn1
        },
        {
            title: config2,
            icon: "format-color-fill",
            getState: isSwitchOn2,
            setState: setIsSwitchOn2
        }
    ];

    // temperature unit
    useEffect(() => {
        if (isSwitchOn1) {
            dispatch(temperatureInFahrenheit());
        }
        else {
            dispatch(temperatureInCelsius())
        }
    }, [isSwitchOn1]);

    // dark mode
    useEffect(() => {
        if (isSwitchOn2) {
            changeTheme(DarkTheme);
            dispatch(switchToDarkMode());
        }
        else {
            changeTheme(LightTheme);
            dispatch(switchToLightMode());
        }
    }, [isSwitchOn2]);

    return (
        <Screen style={styles.container}>
            <Text style={styles.title} variant='titleLarge'>{i18n.t('configurations', { ns: 'settings' })}</Text>
            <FlatList
                data={configItems}
                keyExtractor={item => item.title}
                renderItem={({ item }) => 
                    <ConfigListItem
                        icon={item.icon}
                        getState={item.getState}
                        setState={item.setState}
                        title={item.title}
                    />
                }
                ItemSeparatorComponent={ListItemSeparator}
            />
        </Screen>
    );
}           

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    title: {
        textAlign: "center",
        fontWeight: "bold",
    },
});

export default SettingsScreen;