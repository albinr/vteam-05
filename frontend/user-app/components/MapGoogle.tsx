import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Circle, Polygon } from 'react-native-maps';
// @ts-ignore
// import MapView, { Marker, PROVIDER_GOOGLE, Circle, Polygon } from 'react-native-web-maps';


// Custom MapView component for handling platform-specific imports
// import MapView from './MapView'; // Adjust the path to where your MapView.js is located

export default function MapGoogle() {
  return (
    <View style={styles.container}>
      <MapView
        // provider={PROVIDER_GOOGLE} // Specify Google Maps provider
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* <Marker
          coordinate={{ latitude: 37.78825, longitude: -122.4324 }}
          title="Bike"
          description="A bike parked and ready to be rented!"
        />
        <Circle
            center={{ latitude: 37.78825, longitude: -122.4324 }}
            radius={10} // Radius in meters
            fillColor="rgba(0, 255, 0, 0.1)" // Semi-transparent green
            strokeColor="green"
            strokeWidth={2}
        />
        <Polygon
            coordinates={[
                { latitude: 37.8025259, longitude: -122.4351431 },
                { latitude: 37.7896386, longitude: -122.421646 },
                { latitude: 37.7665248, longitude: -122.4161628 },
                { latitude: 37.7734153, longitude: -122.4577787 },
                { latitude: 37.7948605, longitude: -122.4596065 },
            ]}
            fillColor="rgba(255, 0, 0, 0.1)" // Semi-transparent red
            strokeColor="red"
            strokeWidth={2}
        /> */}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
