import { 
    SET_CURRENT_LOCATION,
} from "./locationTypes";

// info: SaveLocationModel
export const setCurrentLocation = (info = {}) => {
    return {
        type: SET_CURRENT_LOCATION,
        payload: info,
    }
};