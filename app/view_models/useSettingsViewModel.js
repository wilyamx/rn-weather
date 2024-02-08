import { useSelector, useDispatch } from 'react-redux';

import {
    switchToDarkMode,
    switchToLightMode,
    temperatureInCelsius,
    temperatureInFahrenheit,
} from '../redux/theme/themeActions';

const useSettingsViewModel = () => {
    // redux
    const temperatureUnit = useSelector(state => state.theme.temperatureUnit);
    const colorScheme = useSelector(state => state.theme.colorScheme);
    const dispatch = useDispatch();

    return {
        colorScheme,
        temperatureInFahrenheit: () => dispatch(temperatureInFahrenheit()),
        temperatureInCelsius: () => dispatch(temperatureInCelsius()),
        temperatureUnit,
        switchToDarkMode: () => dispatch(switchToDarkMode()),
        switchToLightMode: () => dispatch(switchToLightMode())
    }
};

export default useSettingsViewModel;