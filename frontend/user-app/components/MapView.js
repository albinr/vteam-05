import { Platform } from 'react-native';

const MapView = Platform.select({
  web: require('react-native-web-maps').default, // Use web-based maps for the web platform
  default: require('react-native-maps').default, // Use native maps for mobile platforms
});

export default MapView;
