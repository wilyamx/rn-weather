import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName} from './app.json'

// needs to be bundled
import './i18next';

AppRegistry.registerComponent(appName, () => App);