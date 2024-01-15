import React from 'react';
import { View, StyleSheet, TouchableHighlight } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../config/colors';
import { GestureHandlerRootView, TouchableWithoutFeedback } from 'react-native-gesture-handler';

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
        <TouchableWithoutFeedback onPress={onPress}>
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
        </TouchableWithoutFeedback>
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