import React from "react";
import { Text, View, Dimensions, StyleSheet, Alert } from "react-native";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import * as firebase from "firebase";

const DeviceWidth = Dimensions.get("window").width;
const squareSide = 0.4 * DeviceWidth;
const groupThreshold = 2;

export default function FindGroupScreen({ navigation }) {
    const currentUserId = firebase.auth().currentUser.uid;

    addToCategory = async (category) => {
        //add uid to corresponding category
        await firebase
            .firestore()
            .collection("categories")
            .doc(category)
            .collection("people")
            .doc(currentUserId)
            .set({});
        //on press calculate number of people in category
        var count;
        await firebase
            .firestore()
            .collection("categories")
            .doc(category)
            .collection("people")
            .onSnapshot((querySnapshot) => {
                count = querySnapshot.size;
                if (count < groupThreshold) {
                    navigation.replace("WaitingScreen");
                } else {
                    Alert.alert("Group found!");
                    navigation.navigate("FindGroupScreen");
                }
            });
    };

    return (
        <View style={styles.center}>
            <Text> Choose a category </Text>
            <View
                style={{
                    flexDirection: "row",
                    backgroundColor: "grey",
                }}
            >
                <View>
                    <View style={styles.square1}>
                        <MaterialCommunityIcons
                            name="run"
                            size={130}
                            style={styles.icon}
                            onPress={() => addToCategory("Sports")}
                        />
                        <Text> Sports </Text>
                    </View>
                    <View style={styles.square2}>
                        <MaterialCommunityIcons
                            name="account-music"
                            size={130}
                            style={styles.icon}
                            onPress={() => addToCategory("Music")}
                        />
                        <Text> Music </Text>
                    </View>
                </View>
                <View>
                    <View style={styles.square1}>
                        <MaterialCommunityIcons
                            name="book-open"
                            size={130}
                            style={styles.icon}
                            onPress={() => addToCategory("Study")}
                        />
                        <Text> Study </Text>
                    </View>
                    <View style={styles.square2}>
                        <MaterialCommunityIcons
                            name="controller-classic"
                            size={130}
                            style={styles.icon}
                            onPress={() => addToCategory("For Fun")}
                        />
                        <Text> For Fun </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    square1: {
        width: squareSide,
        height: squareSide,
        marginBottom: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "powderblue",
    },
    square2: {
        width: squareSide,
        height: squareSide,
        marginBottom: 1,
        marginLeft: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "skyblue",
    },
    icon: {},
});