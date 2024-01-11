import React from 'react';
import { useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Searchbar, Text } from 'react-native-paper';

import ListItemSeparator from '../components/lists/ListItemSeparator';
import LocationListItem from '../components/lists/LocationListItem';
import Screen from '../components/Screen';

const initialLocations = [
    {
        id: 1,
        name: "Cebu City",
        main: {
            temp: 292.55,
            humidity: 70
        },
        weather: [{
            id: 803,
            main: "Clouds",
            description: "broken clouds",
            icon: "04d"
        }]
    },
    {
        id: 2,
        name: "Lapu Lapu City",
        main: {
            temp: 279.13,
            humidity: 50
        },
        weather: [{
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01d"
        }]
    },
    {
        id: 3,
        name: "Manila",
        main: {
            temp: 299.03,
            humidity: 65
        },
        weather: [{
            id: 500,
            main: "Rain",
            description: "light rain",
            icon: "10d"
        }]
    }
];

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
            <FlatList
                data={initialLocations}
                keyExtractor={item => item.name}
                renderItem={({ item }) => 
                    <LocationListItem location={item}/>
                }
                // ItemSeparatorComponent={ListItemSeparator}
            />
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    searchBar: {
        marginBottom: 15,
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