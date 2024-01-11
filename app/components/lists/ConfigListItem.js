import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Switch, Text, useTheme, } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Screen from '../Screen';
import colors from '../../config/colors';

function ConfigListItem({ icon, title, getState, setState }) {
    const theme = useTheme();

    return (
    <View style={styles.container}>
        <View style={styles.subContainer}>
            <MaterialCommunityIcons
                name={icon}
                size={25}
                style={styles.icon}
                backgroundColor={theme.colors.primary}
            />
            <Text style={styles.title}>{title}</Text>
        </View>
        <Switch style={styles.switch} value={getState} onValueChange={setState} />
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        flexDirection: "row",
        paddingHorizontal: 0,
        paddingVertical: 10,
    },
    icon: {
        color: colors.white,
        padding: 15,
        borderRadius: 28,
        overflow: "hidden",
        width: 55,
        height: 55,
    },
    title: {
        color: colors.black,
        marginLeft: 15,
    },
    switch: {
        marginRight: 10,
    },
    subContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
});

export default ConfigListItem;