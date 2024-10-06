import { View, Text, StyleSheet, SafeAreaView, Platform } from "react-native";
import React, { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps"; 
import Constants from 'expo-constants';
import * as Location from 'expo-location';

export default function Map() {
    const [location, setLocation] = useState({
        latitude: 65.0800,
        longitude: 25.4800,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
    });

    const [markers, setMarkers] = useState([]); 

    useEffect(() => {
        (async () => {
            await getUserPosition();
        })();
    }, []);

    const getUserPosition = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();

        try {
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }
            const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleLongPress = (event) => {
        const newMarker = event.nativeEvent.coordinate;
        setMarkers([...markers, newMarker]); 
    };

    return (
        <SafeAreaView style={styles.container}>
            <MapView
                style={styles.map}
                region={location}
                onLongPress={handleLongPress} 
            >
                {markers.map((marker, index) => (
                    <Marker
                        key={index}
                        coordinate={marker}
                    />
                ))}
            </MapView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ff0000',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Platform.OS === 'android' ? Constants.statusBarHeight : 0,
    },
    map: {
        height: '100%',
        width: '100%'
    }
});
