import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    Dimensions,
    ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";

const { width: SCREEN_SIZE } = Dimensions.get("window");

const API_KEY = "597a3d64e6f63699af53ccbb8b80f789";

export default function App() {
    const [city, setCity] = useState("Loading...");
    const [ok, setOk] = useState(true);
    const [days, setDays] = useState([]);

    const getWeather = async () => {
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

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        );
        const json = await response.json();
        setDays(
            json.list.filter((weather) => {
                if (weather.dt_txt.includes("00:00:00")) {
                    return weather;
                }
            })
        );
    };

    useEffect(() => {
        getWeather();
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
                {days.length === 0 ? (
                    <View style={styles.day}>
                        <ActivityIndicator
                            color="white"
                            size="large"
                            style={{ marginTop: 10 }}
                        ></ActivityIndicator>
                    </View>
                ) : (
                    days.map((day, index) => (
                        <View key={index} style={styles.day}>
                            <View
                                style={{
                                    width: "100%",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Text style={styles.temp}>
                                    {parseFloat(day.main.temp).toFixed(1)}
                                </Text>
                            </View>

                            <Text style={styles.description}>
                                {day.weather[0].main}
                            </Text>
                            <Text style={styles.tinyText}>
                                {day.weather[0].description}
                            </Text>
                        </View>
                    ))
                )}
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
        color: "white",
    },
    weather: {},
    day: {
        width: SCREEN_SIZE,
        alignItems: "flex-start",
        paddingHorizontal: 20,
    },
    temp: {
        marginTop: 50,
        fontSize: 100,
        fontWeight: "600",
        color: "white",
    },
    description: {
        width: "100%",
        marginTop: -10,
        fontSize: 30,
        fontWeight: "500",
        color: "white",
    },
    tinyText: {
        width: "100%",
        marginTop: -5,
        fontSize: 25,
        fontWeight: "500",
        color: "white",
    },
});
