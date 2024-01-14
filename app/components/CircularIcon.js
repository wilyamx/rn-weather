import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../config/colors';

function CircularIcon({
    image,
    backgroundColor = colors.black,
    color = colors.white,
    size = 30
}) {
    return (
        <View style={[styles.container, { backgroundColor, color }]}>
            <MaterialCommunityIcons
                name={image}
                size={size}
                color={color}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        borderRadius: 25,
        justifyContent: "center",
        width: 50,
        height: 50,
        backgroundColor: "orange"
    }
});

export default CircularIcon;