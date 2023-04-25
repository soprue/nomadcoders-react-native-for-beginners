import { StatusBar } from "expo-status-bar";
import { AntDesign, Fontisto, MaterialIcons } from "@expo/vector-icons";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TouchableHighlight,
    TouchableWithoutFeedback,
    TextInput,
    ScrollView,
    Alert,
} from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "./colors";

const STORAGE_KEY = "@toDos";
const STORAGE_TYPE = "@type";

export default function App() {
    const [working, setWorking] = useState(true);
    const [text, setText] = useState("");
    const [toDos, setToDos] = useState({});

    useEffect(() => {
        loadToDos();
    }, []);

    const travel = async () => {
        setWorking(false);
        const newType = { ["type"]: false };
        await AsyncStorage.setItem(STORAGE_TYPE, JSON.stringify(newType));
    };
    const work = async () => {
        setWorking(true);
        const newType = { ["type"]: true };
        await AsyncStorage.setItem(STORAGE_TYPE, JSON.stringify(newType));
    };

    const onChangeText = (payload) => setText(payload);

    const addToDo = async () => {
        if (text === "") {
            return;
        }

        const newToDos = {
            ...toDos,
            [Date.now()]: { text, working, complete: false },
        };
        setToDos(newToDos);
        await saveToDos(newToDos);
        setText("");
    };
    const saveToDos = async (toSave) => {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    };
    const loadToDos = async () => {
        let typePayload = await AsyncStorage.getItem(STORAGE_TYPE);
        let toDoPayload = await AsyncStorage.getItem(STORAGE_KEY);
        try {
            console.log(toDoPayload);
            typePayload = JSON.parse(typePayload);
            setWorking(toDoPayload != null ? typePayload.type : true);

            return toDoPayload != null
                ? setToDos(JSON.parse(toDoPayload))
                : null;
        } catch (e) {
            console.error(e);
        }
    };
    const deleteToDos = async (key) => {
        Alert.alert("Delete To Do", "Are you sure?", [
            { text: "Cancel" },
            {
                text: "I'm Sure",
                style: "destructive",
                onPress: async () => {
                    const newToDos = { ...toDos };
                    delete newToDos[key];
                    setToDos(newToDos);
                    await saveToDos(newToDos);
                },
            },
        ]);
        return;
    };
    const completeToDos = async (key) => {
        const newToDos = { ...toDos };
        newToDos[key].complete = !newToDos[key].complete;
        setToDos(newToDos);
        await saveToDos(newToDos);
    };

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <View style={styles.header}>
                <TouchableOpacity onPress={work}>
                    <Text
                        style={{
                            ...styles.btnText,
                            color: working ? "white" : theme.gray,
                        }}
                    >
                        Work
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={travel}>
                    <Text
                        style={{
                            ...styles.btnText,
                            color: !working ? "white" : theme.gray,
                        }}
                    >
                        Travel
                    </Text>
                </TouchableOpacity>
            </View>

            <TextInput
                onSubmitEditing={addToDo}
                onChangeText={onChangeText}
                returnKeyType="done"
                value={text}
                placeholder={
                    working ? "Add a To Do" : "Where do you want to go?"
                }
                style={styles.input}
            />

            <ScrollView>
                {Object.keys(toDos).map((key) =>
                    toDos[key].working === working ? (
                        <View style={styles.toDo} key={key}>
                            <View style={styles.toDoInner}>
                                <TouchableOpacity
                                    onPress={() => completeToDos(key)}
                                >
                                    <AntDesign
                                        name={
                                            toDos[key].complete
                                                ? "checksquare"
                                                : "checksquareo"
                                        }
                                        size={18}
                                        color="white"
                                    />
                                </TouchableOpacity>
                                <Text
                                    style={{
                                        ...styles.toDoText,
                                        textDecorationLine: toDos[key].complete
                                            ? "line-through"
                                            : "none",
                                    }}
                                >
                                    {toDos[key].text}
                                </Text>
                            </View>

                            <View style={styles.toDoInner}>
                                <TouchableOpacity
                                    onPress={() => deleteToDos(key)}
                                    style={{ marginLeft: 5 }}
                                >
                                    <Fontisto
                                        name="trash"
                                        size={18}
                                        color={theme.gray}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : null
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.bg,
        paddingHorizontal: 20,
    },
    header: {
        justifyContent: "space-between",
        flexDirection: "row",
        marginTop: 100,
    },
    btnText: {
        fontSize: 38,
        fontWeight: "600",
        color: "white",
    },
    input: {
        backgroundColor: "white",
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginVertical: 20,
        fontSize: 18,
    },
    toDo: {
        backgroundColor: theme.toDoBg,
        marginBottom: 10,
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    toDoInner: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    toDoText: {
        color: "white",
        fontSize: 16,
        fontWeight: "500",
        marginLeft: 10,
    },
});
