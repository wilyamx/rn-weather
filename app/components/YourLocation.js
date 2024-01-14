import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

import colors from '../config/colors';

function YourLocation(props) {
    return (
        <View style={styles.container}>
            <Text variant='labelMedium' style={styles.text}>Your Location</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.danger,
        padding: 3,
        width: 110,
        borderRadius: 20,
    },
    text: {
        color: colors.white,
        textAlign: "center",
    },
});

export default YourLocation;