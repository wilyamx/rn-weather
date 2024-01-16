import { 
    SWITCH_TO_DARK_MODE,
    SWITCH_TO_LIGHT_MODE 
} from "./themeTypes";

const initialState = {
    colorScheme: "light"
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
        default:
            return state
    }
}

export default themeReducer;