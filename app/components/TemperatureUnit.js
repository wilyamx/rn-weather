import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

import constants from '../config/constants';

function TemperatureUnit({
    color = "black",
    temperature,
    fontSize = 100,
    unit = constants.temperatureUnitSign.celsiusUnit
}) {
    const unitFontSize = fontSize * 0.6;

    return (
        <View style={styles.container}>
            <Text style={[styles.temperature, { fontSize }]}>{temperature}</Text>
            <Text style={{ color, fontSize: unitFontSize }}>°{unit}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center"
    },
    temperature: {
        textAlign: "center",
    },
});

export default TemperatureUnit;