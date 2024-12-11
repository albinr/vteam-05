import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HomeScreen = () => {
    return (
    <View style={styles.container}>
        <Text style={styles.header}>Welcome to the Home Screen!</Text>
    </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
        header: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default HomeScreen;
