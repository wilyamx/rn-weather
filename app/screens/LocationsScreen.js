import React from 'react';
import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Searchbar, Text } from 'react-native-paper';

import Screen from '../components/Screen';

function LocationsScreen(props) {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <Screen style={styles.container}>
            <Text style={styles.title} variant='titleLarge'>Pick Locations</Text>
            <Text style={styles.subtitle} variant='titleSmall'>
                Find the city that you want to know{'\n'} the detailed weather into at this time.
            </Text>
            <Searchbar
                placeholder="Search for a city"
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchBar}
            />
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    searchBar: {
        
    },
    subtitle: {
        padding: 10,
        textAlign: "center"
    },
    title: {
        textAlign: "center",
    },
});

export default LocationsScreen;