import { 
    SET_CURRENT_LOCATION,
} from "./locationTypes";

// {
//     latitude: location.latitude,
//     longitude: location.longitude,
//     place: weatherDetails.city.name,
//     uuid: weatherDetails.uuid,
// }
export const setCurrentLocation = (info = {}) => {
    return {
        type: SET_CURRENT_LOCATION,
        payload: info,
    }
};