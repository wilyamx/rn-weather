import { AppContext, AppLanguageContext } from '../auth/AppContextProvider';
import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { DarkTheme, LightTheme } from '../config/Themes';
import LOG from '../utility/logger';

import useSettingsViewModel from '../view_models/useSettingsViewModel';

const useSettingsViewController = () => {
    // view model
    const {
        colorScheme,
        switchToDarkMode,
        switchToLightMode,
        temperatureInFahrenheit,
        temperatureInCelsius,
        temperatureUnit,
    } = useSettingsViewModel();

    // localizations
    const { t, i18n } = useTranslation('settings');
    const config1 = i18n.t('temperatureUnitInFahrenheit', { ns: 'settings'});
    const config2 = i18n.t('darkModeAppearance', { ns: 'settings'});
    const config3 = i18n.t('language', { ns: 'settings'});

    // context
    const { theme, changeTheme } = useContext(AppContext);
    const { locale, changeLocale } = useContext(AppLanguageContext);

    // navigation
    const navigation = useNavigation();

    // ui
    const pickerRef = useRef();
    const [pickerShow, setPickerShow] = useState(false);

    // temperature unit
    const [isSwitchOn1, setIsSwitchOn1] = useState(temperatureUnit === 'celsius' ? true : false);
    // dark mode appearance
    const [isSwitchOn2, setIsSwitchOn2] = useState(colorScheme === 'dark' ? true : false);
    // language (unused)
    const [isSwitchOn3, setIsSwitchOn3] = useState('en');

    // ui data
    // https://static.enapter.com/rn/icons/material-community.html
    const configItems = [
        {
            title: config1,
            icon: "coolant-temperature",
            getState: isSwitchOn1,
            setState: setIsSwitchOn1,
            listItemType: 'ConfigListItem'
        },
        {
            title: config2,
            icon: "format-color-fill",
            getState: isSwitchOn2,
            setState: setIsSwitchOn2,
            listItemType: 'ConfigListItem'
        },
        {
            title: config3,
            icon: "account-voice",
            getState: isSwitchOn3,
            setState: setIsSwitchOn3,
            listItemType: 'LanguageConfigListItem'
        }
    ];

    // actions
    const onClickLanguageHandler = () => {
        LOG.info("[useSettingsViewController]/onClickLanguageHandler");
        setPickerShow(!pickerShow);
    };

    const changeToDarkMode = () => {
        changeTheme(DarkTheme);
        switchToDarkMode();
    };

    const changeToLightMode = () => {
        changeTheme(LightTheme);
        switchToLightMode();
    };

    // hooks
    
    // temperature unit
    useEffect(() => {
        if (isSwitchOn1) {
            temperatureInFahrenheit();
        }
        else {
            temperatureInCelsius();
        }
    }, [isSwitchOn1]);

    // dark mode
    useEffect(() => {
        if (isSwitchOn2) {
            changeToDarkMode();
        }
        else {
            changeToLightMode();
        }
    }, [isSwitchOn2]);

    return {
        changeLocale,
        configItems,
        i18n,
        locale,
        onClickLanguageHandler,
        pickerRef,
        pickerShow,
    }
};

export default useSettingsViewController;