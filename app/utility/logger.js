import { consoleTransport, logger } from "react-native-logs";

const defaultConfig = {
    levels: {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    },
    severity: "debug",
    transport: consoleTransport,
    transportOptions: {
      colors: {
        info: "blueBright",
        warn: "yellowBright",
        error: "redBright",
      },
    },
    async: true,
    dateFormat: "time",
    printLevel: true,
    printDate: true,
    enabled: (process.env.NODE_ENV === 'development') ? true : false,
  };

const LOG = logger.createLogger(defaultConfig);

export default LOG;