import constants from "../config/constants";

export const getTemperatureUnitSign = (
    forecastUnit,
    unitTemperature,
    debug = false) => {
        
    // forecastUnit - unit of the weather forecast from api response
    // unitTemperature - unit to display from the settings view

    var unit = unitTemperature;
    if (debug) {
        unit = forecastUnit
    }
    
    if (unit == constants.temperatureUnit.celsiusUnit) {
        return constants.temperatureUnitSign.celsiusUnit;
    }
    else if (unit == constants.temperatureUnit.fahrenheitUnit) {
        return constants.temperatureUnitSign.fahrenheitUnit;
    }
    else {
        return constants.temperatureUnitSign.kelvinUnit;
    }
};

export const celsiusToFahrenheit = (celsius) => {
    return (celsius * 9 / 5) + 32;
};

export const fahrenheitToCelsius = (fahrenheit) => {
    return (fahrenheit - 32) * 5 / 9;
};

export const getTemperatureDisplay = (
    reading,
    fromDisplayUnit,
    temperatureUnit,
    withDecimal = false,
    debug = false) => {
    
    // LOG.info("[HomeScreen]/getTemperatureDisplay", reading);
    if (debug) return reading;

    var result = reading;

    // from: metric (celsius), to: metric (celsius)
    if (fromDisplayUnit == constants.temperatureUnit.celsiusUnit &&
        temperatureUnit == constants.temperatureUnit.celsiusUnit) {
            result = reading;
        }
    // from: imperial (fahrenheit), to: imperial (fahrenheit)
    else if (fromDisplayUnit == constants.temperatureUnit.fahrenheitUnit &&
        temperatureUnit == constants.temperatureUnit.fahrenheitUnit) {
            result = reading;
        }
    // from metric (celsius), to: imperial (fahrenheit)
    else if (fromDisplayUnit == constants.temperatureUnit.celsiusUnit &&
        temperatureUnit == constants.temperatureUnit.fahrenheitUnit) {
            result = celsiusToFahrenheit(reading);
        }
    // from imperial (fahrenheit), to: metric (celsius)
    else if (fromDisplayUnit == constants.temperatureUnit.fahrenheitUnit &&
        temperatureUnit == constants.temperatureUnit.celsiusUnit) {
            result = fahrenheitToCelsius(reading);
        }
    return withDecimal ? result.toFixed(2) : Math.round(result);
};

export const getDateComponents = (dt_txt) => {
    // 2024-01-20 03:00:0
    let dateComponents = dt_txt.split(" ");
    return dateComponents
};