import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, useTheme, } from 'react-native-paper';

import CircularIcon from '../CircularIcon';

function LanguageConfigListItem({ icon, title, getLocaleState, onPress }) {
    const theme = useTheme();
    const [language, setLanguage] = useState('en');
    
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
            <Button mode="contained" onPress={onPress}>
                {getLocaleState}
            </Button>
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

export default LanguageConfigListItem;