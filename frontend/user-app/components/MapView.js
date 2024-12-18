// MapView.js
import { Platform } from 'react-native';

// Use the correct library depending on the platform
// @ts-ignore
const MapView = Platform.OS === 'web' ? require('react-native-web-maps').default : require('react-native-maps').default;

export default MapView;
