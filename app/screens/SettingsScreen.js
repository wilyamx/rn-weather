import React, { useContext, useEffect, useRef, useState } from 'react';
import { AppContext, AppLanguageContext } from '../auth/AppContextProvider';
import { FlatList, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import {
    switchToDarkMode,
    switchToLightMode,
    temperatureInCelsius,
    temperatureInFahrenheit,
} from '../redux/theme/themeActions';
import { DarkTheme, LightTheme } from '../config/Themes';

import ConfigListItem from '../components/lists/ConfigListItem';
import LanguageConfigListItem from '../components/lists/LanguageConfigListItem';
import ListItemSeparator from '../components/lists/ListItemSeparator';
import Screen from '../components/Screen';

function SettingsScreen(props) {

    // localizations
    const { t, i18n } = useTranslation('settings');
    const config1 = i18n.t('temperatureUnitInFahrenheit', { ns: 'settings'});
    const config2 = i18n.t('darkModeAppearance', { ns: 'settings'});
    const config3 = i18n.t('language', { ns: 'settings'});

    // redux
    const temperatureUnit = useSelector(state => state.theme.temperatureUnit);
    const colorScheme = useSelector(state => state.theme.colorScheme);
    const dispatch = useDispatch();

    // context
    const { theme, changeTheme } = useContext(AppContext);
    const { locale, changeLocale } = useContext(AppLanguageContext);

    // UI
    // temperature unit
    const [isSwitchOn1, setIsSwitchOn1] = useState(temperatureUnit === 'celsius' ? true : false);
    // dark mode appearance
    const [isSwitchOn2, setIsSwitchOn2] = useState(colorScheme === 'dark' ? true : false);
    // language (unused)
    const [isSwitchOn3, setIsSwitchOn3] = useState('en');

    const pickerRef = useRef();
    const [pickerShow, setPickerShow] = useState(false);
    
    // https://static.enapter.com/rn/icons/material-community.html
    const configItems = [
        {
            title: config1,
            icon: "coolant-temperature",
            getState: isSwitchOn1,
            setState: setIsSwitchOn1,
            listItemType: 'ConfigListItem'
        },
        {
            title: config2,
            icon: "format-color-fill",
            getState: isSwitchOn2,
            setState: setIsSwitchOn2,
            listItemType: 'ConfigListItem'
        },
        {
            title: config3,
            icon: "account-voice",
            getState: isSwitchOn3,
            setState: setIsSwitchOn3,
            listItemType: 'LanguageConfigListItem'
        }
    ];

    // actions
    const toogleLanguageHandler = () => {
        console.log("[SettingsScreen]/toogleLanguageHandler");
        setPickerShow(!pickerShow);
    }

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
        <>
        <Screen style={styles.container}>
            <Text style={styles.title} variant='titleLarge'>
                {i18n.t('configurations', { ns: 'settings' })}
            </Text>
            
            <FlatList
                data={configItems}
                keyExtractor={item => item.title}
                renderItem={({ item }) => 
                    (item.listItemType === 'ConfigListItem') ? 
                        <ConfigListItem
                            icon={item.icon}
                            getState={item.getState}
                            setState={item.setState}
                            title={item.title}
                        /> :
                        <LanguageConfigListItem style={styles.language}
                            icon={item.icon}
                            title={item.title}
                            getLocaleState={locale}
                            onPress={toogleLanguageHandler}
                        />
                }
                ItemSeparatorComponent={ListItemSeparator}
            />
        </Screen>

        { pickerShow &&
            <View >
            <Picker
                ref={pickerRef}
                selectedValue={locale}
                onValueChange={(itemValue, itemIndex) =>
                    changeLocale(itemValue)
                }>
                <Picker.Item label="English" value="en" />
                <Picker.Item label="French" value="fr" />
                <Picker.Item label="Arabic" value="ar" />
            </Picker>
            </View>
        }
        </>
    );
}           

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    language: {
        backgroundColor: "yellow",
        height: 50,
    },
    title: {
        textAlign: "center",
        fontWeight: "bold",
    },
});

export default SettingsScreen;