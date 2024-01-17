import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

import colors from '../../config/colors';

function ListItemSeparator(props) {
    const theme = useTheme();

    return (
        <View style={[styles.separator, { backgroundColor: theme.colors.outline }]} />
    );
}

const styles = StyleSheet.create({
    separator: {
        width: "100%",
        height: 1,
        opacity: 0.25,
    }
});

export default ListItemSeparator;