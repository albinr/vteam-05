import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, Alert } from 'react-native';
import { MapView } from '@netizen-teknologi/react-native-maps-leaflet';
import * as Location from 'expo-location';

export default function Map() {
  const [location, setLocation] = useState({
    latitude: 59.3293, // Default longitude (Karlskrona)
    longitude: 18.0686, // Default latitude (Karlskrona)
  });

  const [bikes ,setBikes] = useState([]);

  useEffect(() => {
    const fetchLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    };

    const fetchBikes = async () => {
        console.log(process.env.EXPO_PUBLIC_API_URL);
        const response = await fetch(process.env.EXPO_PUBLIC_API_URL + '/bikes');
        console.log(response);
        const data = await response.json();
        setBikes(data);
    }

    fetchLocation();
    // fetchBikes();
  }, []);


  return (
    <View style={styles.container}>
        {/* List of bikes */}
        {/* <View>
            {bikes.map((bike: any) => (
                <Text key={bike.bike_id}>{bike.bike_id}</Text>
            ))}
        </View> */}

      {/* Map Section */}
      <View style={styles.mapContainer}>
        <MapView
            center={[location.latitude, location.longitude]}
            // markers={[
            //     {
            //     latitude: location.latitude,
            //     longitude: location.longitude,
            //     icon: 'https://cdn-icons-png.flaticon.com/512/61/61168.png', // You can use a custom icon URL
            //     size: [32, 32],
            //     },
            // ]}
            zoom={15}

        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
  },
  toggleText: {
    fontSize: 16,
  },
  mapContainer: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
});
