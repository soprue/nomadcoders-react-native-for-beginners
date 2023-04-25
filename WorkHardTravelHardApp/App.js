import { StatusBar } from "expo-status-bar";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TouchableHighlight,
    TouchableWithoutFeedback,
    TextInput,
    ScrollView,
} from "react-native";
import { theme } from "./colors";
import { useState } from "react";

export default function App() {
    const [working, setWorking] = useState(true);
    const [text, setText] = useState("");
    const [toDos, setToDos] = useState({});

    const addToDo = () => {
        if (text === "") {
            return;
        }

        const newToDos = { ...toDos, [Date.now()]: { text, working } };
        setToDos(newToDos);
        setText("");
    };

    const travel = () => {
        setWorking(false);
    };
    const work = () => {
        setWorking(true);
    };

    const onChangeText = (payload) => setText(payload);

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

            <View>
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
                                <Text style={styles.toDoText}>
                                    {toDos[key].text}
                                </Text>
                            </View>
                        ) : null
                    )}
                </ScrollView>
            </View>
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
    },
    toDoText: {
        color: "white",
        fontSize: 16,
        fontWeight: "500",
    },
});
