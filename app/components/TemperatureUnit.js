import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

function TemperatureUnit({ temperature, fontSize = 100 }) {
    const unitFontSize = fontSize / 2;

    return (
        <View style={styles.container}>
            <Text style={[styles.temperature, { fontSize }]}>{temperature}</Text>
            <Text style={{ fontSize: unitFontSize }}>°C</Text>
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