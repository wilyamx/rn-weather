import React from 'react';
import Constants from 'expo-constants';
import { View, StyleSheet } from 'react-native';
import { Snackbar, Text, useTheme } from 'react-native-paper';
import { useNetInfo } from '@react-native-community/netinfo';
import Screen from './Screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function OfflineNotice(props) {
    // hooks
    const netInfo = useNetInfo();

    // ui
    const theme = useTheme();

    if (netInfo.type !== "unknown" && netInfo.isInternetReachable === false) {
        return (
            <SafeAreaProvider>
            <Snackbar
                visible={true}
                //onDismiss={}
            >
                No internet connection
            </Snackbar>
            </SafeAreaProvider>
            // <View style={styles.container}>
            //     <Text variant='titleMedium' style={styles.text}>No Internet Connection</Text>
            // </View>
        );
    }

    return null;
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "red",
        height: 40,
        position: "absolute",
        zIndex: 1,
        width: "100%",
        top: Constants.statusBarHeight,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        color: "white",
    },
});

export default OfflineNotice;