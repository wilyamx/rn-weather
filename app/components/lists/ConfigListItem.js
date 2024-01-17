import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Switch, Text, useTheme, } from 'react-native-paper';

import CircularIcon from '../CircularIcon';
import colors from '../../config/colors';

function ConfigListItem({ icon, title, getState, setState }) {
    const theme = useTheme();

    return (
        <View style={styles.container}>
            <View style={styles.subContainer}>
                <CircularIcon
                    image={icon}
                    backgroundColor={theme.colors.primary}
                    color={theme.colors.white}
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
    title: {
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