
const weatherImages = [
    {
        main: "Clouds",
        icon: "04n",
        image: require("../../assets/cloudy.png"),
    },
    {
        main: "Rain",
        icon: "10d",
        image: require("../../assets/rainy.png"),
    },
    {
        main: "Default",
        icon: "0",
        image: require("../../assets/rainbow.png"),
    }
];

export const getWeatherImage = (main = "Default") => {
    let weatherImage = weatherImages.filter((detail) => detail.main == main);
    return weatherImage[0].image;
};
