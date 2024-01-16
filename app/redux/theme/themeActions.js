import { 
    SWITCH_TO_DARK_MODE,
    SWITCH_TO_LIGHT_MODE,
    TEMPERATURE_IN_CELSIUS,
    TEMPERATURE_IN_FAHRENHEIT, 
} from "./themeTypes";

export const switchToDarkMode = () => {
    return {
        type: SWITCH_TO_DARK_MODE,
    }
};
export const switchToLightMode = () => {
    return {
        type: SWITCH_TO_LIGHT_MODE,
    }
}

export const temperatureInFahrenheit = () => {
    return {
        type: TEMPERATURE_IN_FAHRENHEIT,
    }
};
export const temperatureInCelsius = () => {
    return {
        type: TEMPERATURE_IN_CELSIUS,
    }
};