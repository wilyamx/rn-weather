import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Switch, Text, } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Screen from '../Screen';
import colors from '../../config/colors';

function ConfigListItem({ icon, title, getState, setState }) {
  return (
    <Screen>
        <View style={styles.container}>
            <MaterialCommunityIcons
                name={icon}
                size={30}
                color={colors.danger}
                style={styles.icon}
            />
            <Text style={styles.title}>{title}</Text>
            <Switch style={styles.switch} value={getState} onValueChange={setState} />
        </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    icon: {
        padding: 15,
        backgroundColor: colors.dark,
        borderRadius: 30,
        overflow: "hidden"
    },
    title: {
        color: colors.black,
        marginLeft: 15,
        width: "50%"
    },
    switch: {
        marginRight: 20,
    },
});

export default ConfigListItem;