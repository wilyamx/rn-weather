import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';

function AppActivityIndicator({ visible = false }) {
    if (!visible) return null;

    const theme = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.onBackground }]}>
            <ActivityIndicator
                animating={true}
                color={"red"}
                size={80}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        width: "100%",
        height: "100%",
        opacity: 0.8,
        zIndex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});

export default AppActivityIndicator;