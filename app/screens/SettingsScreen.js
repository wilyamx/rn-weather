import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Text } from 'react-native-paper';
import { View } from 'react-native';

import ConfigListItem from '../components/lists/ConfigListItem';
import LanguageConfigListItem from '../components/lists/LanguageConfigListItem';
import ListItemSeparator from '../components/lists/ListItemSeparator';
import Screen from '../components/Screen';

import useSettingsViewController from '../view_controllers/useSettingsViewController';

function SettingsScreen(props) {
    // view controller
    const {
        configItems,
        changeLocale,
        i18n,
        locale,
        onClickLanguageHandler,
        pickerRef,
        pickerShow,
    } = useSettingsViewController();

    return (
        <>
        <Screen style={styles.container}>
            <Text style={styles.title} variant='titleLarge'>
                {i18n.t('configurations', { ns: 'settings' })}
            </Text>
            
            <FlatList
                data={configItems}
                keyExtractor={item => item.title}
                renderItem={({ item }) => 
                    (item.listItemType === 'ConfigListItem') ? 
                        <ConfigListItem
                            icon={item.icon}
                            getState={item.getState}
                            setState={item.setState}
                            title={item.title}
                        /> :
                        <LanguageConfigListItem style={styles.language}
                            icon={item.icon}
                            title={item.title}
                            getLocaleState={locale}
                            onPress={onClickLanguageHandler}
                        />
                }
                ItemSeparatorComponent={ListItemSeparator}
            />
        </Screen>

        { pickerShow &&
            <View >
            <Picker
                ref={pickerRef}
                selectedValue={locale}
                onValueChange={(itemValue, itemIndex) =>
                    changeLocale(itemValue)
                }>
                <Picker.Item label="English" value="en" />
                <Picker.Item label="French" value="fr" />
                <Picker.Item label="Arabic" value="ar" />
            </Picker>
            </View>
        }
        </>
    );
}           

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    language: {
        backgroundColor: "yellow",
        height: 50,
    },
    title: {
        textAlign: "center",
        fontWeight: "bold",
    },
});

export default SettingsScreen;