import React, { useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import {
    switchToDarkMode,
    switchToLightMode,
    temperatureInCelsius,
    temperatureInFahrenheit,
} from '../redux/theme/themeActions';
import ConfigListItem from '../components/lists/ConfigListItem';
import ListItemSeparator from '../components/lists/ListItemSeparator';
import Screen from '../components/Screen';

function SettingsScreen(props) {
    // redux
    const temperatureUnit = useSelector(state => state.theme.temperatureUnit);
    const colorScheme = useSelector(state => state.theme.colorScheme);
    const dispatch = useDispatch();

    // temperature unit
    const [isSwitchOn1, setIsSwitchOn1] = useState(temperatureUnit === 'celsius' ? true : false);
    // dark mode appearance
    const [isSwitchOn2, setIsSwitchOn2] = useState(colorScheme === 'dark' ? true : false);

    // https://static.enapter.com/rn/icons/material-community.html
    const configItems = [
        {
            title: "Temperature Unit\nin Celsius",
            icon: "coolant-temperature",
            getState: isSwitchOn1,
            setState: setIsSwitchOn1
        },
        {
            title: "Dark Mode\nAppearance",
            icon: "format-color-fill",
            getState: isSwitchOn2,
            setState: setIsSwitchOn2
        }
    ];

    // temperature unit
    useEffect(() => {
        console.log("temperature-unit-effect", isSwitchOn1);

        if (isSwitchOn1) {
            dispatch(temperatureInCelsius());
        }
        else {
            dispatch(temperatureInFahrenheit())
        }
    }, [isSwitchOn1]);

    // dark mode
    useEffect(() => {
        if (isSwitchOn2) {
            dispatch(switchToDarkMode());
        }
        else {
            dispatch(switchToLightMode());
        }
    }, [isSwitchOn2]);

    return (
        <Screen style={styles.container}>
            <Text style={styles.title} variant='titleLarge'>Configurations</Text>
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
            <View>
                <Text variant='titleLarge'>isLightMode? {colorScheme}</Text>
                <Button icon="camera" onPress={() => dispatch(switchToDarkMode())}>Dark Mode</Button>
                <Button icon="camera" onPress={() => dispatch(switchToLightMode())}>Light Mode</Button>
            </View>
        </Screen>
    );
}           

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    title: {
        textAlign: "center",
    },
});

export default SettingsScreen;