import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Searchbar, Text } from 'react-native-paper';

import AppActivityIndicator from '../components/AppActivityIndicator';
import ListItemDeleteAction from '../components/lists/ListItemDeleteAction';
import LocationListItem from '../components/lists/LocationListItem';
import Screen from '../components/Screen';

import useLocationsViewController from '../view_controllers/useLocationsViewController';

function LocationsScreen({ navigation }) {

    const {
        handleDelete,
        handlePullToRefresh,
        handleSelectedForecast,
        handleSubmitSearchKey,
        i18n,
        loading,
        refreshing,
        savedCurrentLocation,
        savedLocationsFiltered,
        searchQuery,
        setSearchQuery,
    } = useLocationsViewController();

    return (
        <>
        <AppActivityIndicator visible={loading} />
        <Screen style={styles.container}>
            <Text style={styles.title} variant='titleLarge'>{i18n.t('pickLocations', { ns: 'locations' })}</Text>
            <Text style={styles.subtitle} variant='titleSmall'>
                {i18n.t('instructions', { ns: 'locations' })}
            </Text>
            <Searchbar
                placeholder={i18n.t('searchForAPlace', { ns: 'locations' })}
                autoCorrect={false}
                value={searchQuery}
                style={styles.searchBar}
                onChangeText={setSearchQuery}
                onSubmitEditing={() => handleSubmitSearchKey(searchQuery)}
            />

            <FlatList
                data={savedLocationsFiltered}
                keyExtractor={item => item.uuid.toString()}
                renderItem={({ item }) => 
                    <LocationListItem
                        currentLocation={savedCurrentLocation}
                        location={item}
                        onPress={() => handleSelectedForecast(item)}
                        renderRightActions={() => 
                            <ListItemDeleteAction onPress={() => handleDelete(item)}/>
                        }
                    />
                }
                refreshing={refreshing}
                onRefresh={handlePullToRefresh}
            />
        </Screen>
        </>
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
        fontWeight: "bold",
    },
});

export default LocationsScreen;