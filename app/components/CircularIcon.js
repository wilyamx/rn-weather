import React from 'react';
import { View, StyleSheet, TouchableHighlight } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GestureHandlerRootView, TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';

import colors from '../config/colors';

function CircularIcon({
    image = "lock-question",
    backgroundColor = colors.black,
    color = colors.white,
    size = 30,
    onPress
}) {
    const containerSize = size + 20;
    const borderRadius = containerSize / 2;

    return (
        <GestureHandlerRootView>
        <TouchableOpacity onPress={onPress}>
            <View style={[
                styles.container,
                { 
                    backgroundColor,
                    color,
                    width: containerSize,
                    height: containerSize,
                    borderRadius: borderRadius
                }
            ]}>
                <MaterialCommunityIcons
                    name={image}
                    size={size}
                    color={color}
                />
            </View>
        </TouchableOpacity>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
    }
});

export default CircularIcon;