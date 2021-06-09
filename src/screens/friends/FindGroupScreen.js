import React, { useEffect, useState } from "react";
import { Text, View, Dimensions, StyleSheet, Alert } from "react-native";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import * as firebase from "firebase";

const DeviceWidth = Dimensions.get("window").width;
const squareSide = 0.4 * DeviceWidth;
const groupThreshold = 2;

export default function FindGroupScreen({ navigation }) {
    const currentUserId = firebase.auth().currentUser.uid;

    useEffect(() => {
        firebase
            .firestore()
            .collection("users")
            .doc(currentUserId)
            .onSnapshot((documentSnapshot) => {
                if (documentSnapshot.data().finding) {
                    calculateGroup(documentSnapshot.data().groupCategory);
                }
            });
    }, []);

    const addToCategory = async (category) => {
        //add uid to corresponding category
        await firebase
            .firestore()
            .collection("categories")
            .doc(category)
            .collection("people")
            .doc(currentUserId)
            .set({})
            .then(() => {
                firebase
                    .firestore()
                    .collection("users")
                    .doc(currentUserId)
                    .update({ finding: true, groupCategory:category });
                firebase
                    .firestore()
                    .collection("categories")
                    .doc(category)
                    .set({
                         lastJoinedAt: firebase.firestore.Timestamp.fromDate(new Date()),
                     });
            });
    };

    const calculateGroup = async (category) => {
        var count;
        var unsubscribe = await firebase
            .firestore()
            .collection("categories")
            .doc(category)
            .collection("people")
            .onSnapshot((querySnapshot) => {
                count = querySnapshot.size;
                if (count < groupThreshold) {
                    //not enough people to form group, send to waiting screen.
                    navigation.navigate("WaitingScreen", {
                        groupCategory: category
                    });
                } else {
                    //hit threshold, handle logic to form a group. currently only an alert.
                    firebase
                        .firestore()
                        .collection("users")
                        .doc(currentUserId)
                        .update({ finding: false, groupCategory:null });
                    firebase
                        .firestore()
                        .collection("categories")
                        .doc(category)
                        .collection("people")
                        .get()
                        .then(querySnapshot => {
                            querySnapshot.forEach(documentSnapshot => {
                                documentSnapshot.ref.delete();
                            })
                        });
                    Alert.alert("Group found!");
                    navigation.navigate("FindGroupScreen");
                }
            });
            unsubscribe();
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