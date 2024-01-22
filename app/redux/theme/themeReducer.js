import { 
    SWITCH_TO_DARK_MODE,
    SWITCH_TO_LIGHT_MODE, 
    TEMPERATURE_IN_CELSIUS,
    TEMPERATURE_IN_FAHRENHEIT
} from "./themeTypes";

const initialState = {
    colorScheme: "light",
    temperatureUnit: "metric",
}

// temperatureUnit = standard (Kelvin)
// temperatureUnit = metric (Celsius) (Default)
// temperatureUnit = imperial (Fahrenheit)
const themeReducer = (state = initialState, action) => {
    switch (action.type) {
        case SWITCH_TO_DARK_MODE: 
            return {
                ...state,
                colorScheme: "dark"
            }
        case SWITCH_TO_LIGHT_MODE: 
            return {
                ...state,
                colorScheme: "light"
            }
        case TEMPERATURE_IN_CELSIUS:
            return {
                ...state,
                temperatureUnit: "metric"
            }
        case TEMPERATURE_IN_FAHRENHEIT:
            return {
                ...state,
                temperatureUnit: "imperial"
            }
        default:
            return state
    }
};

export default themeReducer;