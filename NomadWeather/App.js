import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View, Dimensions } from "react-native";
import * as Location from "expo-location";

const { width: SCREEN_SIZE } = Dimensions.get("window");

export default function App() {
    const [city, setCity] = useState("Loading...");
    const [location, setLocation] = useState();
    const [ok, setOk] = useState(true);

    const ask = async () => {
        const { granted } = await Location.requestForegroundPermissionsAsync();
        if (!granted) {
            setOk(false);
        }

        const {
            coords: { latitude, longitude },
        } = await Location.getCurrentPositionAsync({ accuracy: 5 });
        const location = await Location.reverseGeocodeAsync(
            { latitude, longitude },
            { useGoogleMaps: false }
        );
        setCity(location[0].city);
    };

    useEffect(() => {
        ask();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.city}>
                <Text style={styles.cityName}>{city}</Text>
            </View>
            <ScrollView
                pagingEnabled
                horizontal
                // indicatorStyle="white"
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.weather}
            >
                <View style={styles.day}>
                    <Text style={styles.temp}>27</Text>
                    <Text style={styles.description}>Sunny</Text>
                </View>

                <View style={styles.day}>
                    <Text style={styles.temp}>27</Text>
                    <Text style={styles.description}>Sunny</Text>
                </View>

                <View style={styles.day}>
                    <Text style={styles.temp}>27</Text>
                    <Text style={styles.description}>Sunny</Text>
                </View>

                <View style={styles.day}>
                    <Text style={styles.temp}>27</Text>
                    <Text style={styles.description}>Sunny</Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "tomato",
    },
    city: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    cityName: {
        fontSize: 48,
        fontWeight: "600",
    },
    weather: {},
    day: {
        width: SCREEN_SIZE,
        alignItems: "center",
    },
    temp: {
        marginTop: 50,
        fontSize: 178,
    },
    description: {
        marginTop: -30,
        fontSize: 60,
    },
});
