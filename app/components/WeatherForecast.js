import React from 'react';
import moment, { now } from "moment/moment";
import { FlatList, View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import CircularIcon from './CircularIcon';
import ListItemSeparator from './lists/ListItemSeparator';
import WeatherListItem from './lists/WeatherListItem';

// forecast - list of weather forecast
function WeatherForecast({ forecast, temperatureUnit, onRefresh, onDismiss }) {

    // localizations
    const {t, i18n} = useTranslation('home');

    // ui
    const theme = useTheme();

    const timeAgo = () => {
        let momentDate = moment(forecast.dt * 1000);
        let momentDate2 = moment(forecast.dt_txt);
        
        return momentDate2.fromNow();
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.onSecondary }]}>
            <View style={styles.header}>
                <View>
                    <Text variant='titleLarge' style={styles.title}>
                        {forecast.length} {i18n.t('dayForecasts', { ns: 'home' })}
                    </Text>
                    <Text variant='titleSmall' style={{color: theme.colors.secondary}}>
                        Updated {timeAgo()}
                    </Text>
                </View>
                <View style={styles.actions}>
                    <CircularIcon
                        image={"refresh"}
                        backgroundColor={theme.colors.secondary}
                        onPress={onRefresh}
                    />
                    <CircularIcon
                        image={"close"}
                        backgroundColor={theme.colors.secondary}
                        onPress={onDismiss}
                    />
                </View>
            </View>

            <ListItemSeparator />

            <View style={styles.forecastContainer} >
                <FlatList
                    horizontal={true}
                    data={forecast}
                    keyExtractor={item => item.dt.toString()}
                    renderItem={({ item }) => 
                        <WeatherListItem forecast={item} temperatureUnit={temperatureUnit} />
                    }
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    actions: {
        flexDirection: "row",
        gap: 10,
    },
    container: {
        width: "100%",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
        paddingHorizontal: 20,
        paddingTop: 20
    },
    forecastContainer: {
        padding: 20,
    },
    title: {
        fontWeight: "600",
    },
    weather: {
        
    },
});

export default WeatherForecast;