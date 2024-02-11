module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ["module:react-native-dotenv"]
    ],
    env: {
      test: {
        plugins: ["transform-remove-console"],     //removing consoles.log from app during release (production) versions
      },
      production: {
        plugins: ["transform-remove-console"],     //removing consoles.log from app during release (production) versions
      },
    },
  };
};
