import React from 'react';
import { useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

import Screen from '../components/Screen';
import ConfigListItem from '../components/lists/ConfigListItem';
import ListItemSeparator from '../components/lists/ListItemSeparator';

function SettingsScreen(props) {
    const [isSwitchOn1, setIsSwitchOn1] = useState(false);
    const [isSwitchOn2, setIsSwitchOn2] = useState(false);

    // https://static.enapter.com/rn/icons/material-community.html
    const configItems = [
        {
            title: "Temperature\nin Celsius",
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

    const theme = useTheme();

    return (
        <Screen style={styles.container}>
            <Text style={styles.title} variant='titleLarge'>Configurations</Text>
            <FlatList
                data={configItems}
                keyExtractor={configItems => configItems.title}
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
    },
});

export default SettingsScreen;