import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import colors from '../config/colors';

function YourLocation({ marginBottom }) {

    // localizations
    const {t, i18n} = useTranslation('common');

    return (
        <View style={[styles.container, { marginBottom }]}>
            <Text variant='labelMedium' style={styles.text}>
                {i18n.t('yourLocation', { ns: 'common'})}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.danger,
        padding: 3,
        width: 150,
        borderRadius: 20,
    },
    text: {
        color: colors.white,
        textAlign: "center",
    },
});

export default YourLocation;