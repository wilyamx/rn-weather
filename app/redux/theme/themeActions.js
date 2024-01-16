import { 
    SWITCH_TO_DARK_MODE,
    SWITCH_TO_LIGHT_MODE 
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