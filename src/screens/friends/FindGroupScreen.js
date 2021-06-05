import React, { useEffect, useState } from "react";
import { Text, View, Dimensions, StyleSheet, Alert } from "react-native";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import * as firebase from "firebase";

const DeviceWidth = Dimensions.get("window").width;
const squareSide = 0.4 * DeviceWidth;
const groupThreshold = 2;

export default function FindGroupScreen({ navigation }) {
    const currentUserId = firebase.auth().currentUser.uid;
    var userCategory;

    useEffect(() => {
        firebase
            .firestore()
            .collection("users")
            .doc(currentUserId)
            .onSnapshot((documentSnapshot) => {
                console.log(documentSnapshot.data().finding);
                if (documentSnapshot.data().finding) {
                    calculateGroup(userCategory);
                }
            });
    }, []);

    const addToCategory = async (category) => {
        userCategory = category;
        //add uid to corresponding category
        await firebase
            .firestore()
            .collection("categories")
            .doc(category)
            .collection("people")
            .doc(currentUserId)
            .set({})
            .then(() =>
                firebase
                    .firestore()
                    .collection("users")
                    .doc(currentUserId)
                    .update({ finding: true })
            );
        //handle logic for group size
        calculateGroup(category);
    };

    const calculateGroup = async (category) => {
        var count;
        await firebase
            .firestore()
            .collection("categories")
            .doc(category)
            .collection("people")
            .onSnapshot((querySnapshot) => {
                count = querySnapshot.size;
                if (count < groupThreshold) {
                    //not enough people to form group, send to waiting screen.
                    navigation.navigate("WaitingScreen", {
                        userCategory: category
                    });
                } else {
                    //hit threshold, handle logic to form a group. currently only an alert.
                    firebase
                        .firestore()
                        .collection("users")
                        .doc(currentUserId)
                        .update({ finding: false });
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