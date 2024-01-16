import { 
    SWITCH_TO_DARK_MODE,
    SWITCH_TO_LIGHT_MODE, 
    TEMPERATURE_IN_CELSIUS,
    TEMPERATURE_IN_FAHRENHEIT
} from "./themeTypes";

const initialState = {
    colorScheme: "light",
    temperatureUnit: "celsius",
}

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
                temperatureUnit: "celsius"
            }
        case TEMPERATURE_IN_FAHRENHEIT:
            return {
                ...state,
                temperatureUnit: "fahrenheit"
            }
        default:
            return state
    }
}

export default themeReducer;