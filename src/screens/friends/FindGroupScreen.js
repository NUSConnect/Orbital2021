import * as firebase from "firebase";
import React, { useEffect } from "react";
import { Alert, Dimensions, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "react-native-vector-icons";

const DeviceWidth = Dimensions.get("window").width;
const squareSide = 0.4 * DeviceWidth;
const groupThreshold = 2;

export default function FindGroupScreen({ navigation }) {
    const currentUserId = firebase.auth().currentUser.uid;

    useEffect(() => {
        const subscriber = firebase
            .firestore()
            .collection("users")
            .doc(currentUserId)
            .onSnapshot((documentSnapshot) => {
                if (documentSnapshot.data().finding) {
                    calculateGroup(documentSnapshot.data().groupCategory);
                    console.log('checking at ' + new Date())
                }
            });

        return () => subscriber();
    }, []);

    function getDifferenceInHours(date1, date2) {
        const diffInMs = Math.abs(date2 - date1);
        return diffInMs / (1000 * 60 * 60);
    }

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
                    .update({ finding: true, groupCategory: category });
                firebase
                    .firestore()
                    .collection("categories")
                    .doc(category)
                    .set({
                        lastJoinedAt: firebase.firestore.Timestamp.fromDate(
                            new Date()
                        ),
                    });
            });
    };

    const stopFinding = async (userId) => {
        // unused** this is also in clearUsers
        await firebase
            .firestore()
            .collection("users")
            .doc(userId)
            .update({ finding: false, groupCategory: null });
        // maybe send notification to users here that group is found/no groups matched
    }

    const concatList = (list) => {
        let str = "";
        list.sort()
        for (let i = 0; i < list.length; i++) {
            str = str + list[i].substring(0, 6)
        }
        return str;
    };

    const clearUsers = async (success, category) => {
        console.log('Function called');
        const list = [];
        await firebase
            .firestore()
            .collection("categories")
            .doc(category)
            .collection("people")
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((documentSnapshot) => {
                    list.push(documentSnapshot.id)
                    documentSnapshot.ref.delete();
                });
            });
        if (success) {
            const groupId = category + concatList(list);
            firebase.firestore().collection("groups").doc(groupId).set({ category: category })
            for (let i = 0; i < list.length; i++) {
                firebase.firestore().collection("groups").doc(groupId).collection("members").doc(list[i]).set({})
                firebase.firestore().collection("users").doc(list[i]).collection('groups').doc(groupId).set({});
            }
        }

        for (let i = 0; i < list.length; i++) {
            // turn off finding
            firebase.firestore().collection("users").doc(list[i]).update({ finding: false, groupCategory: null });
        }
    }

    const calculateGroup = async (category) => {
        var count;
        var lastJoinedAt;
        console.log('Logged at ' + new Date())
        await firebase.firestore().collection("categories").doc(category).get().then(doc => lastJoinedAt = doc.data().lastJoinedAt);

        const unsubscribe = firebase
            .firestore()
            .collection("categories")
            .doc(category)
            .collection("people")
            .onSnapshot((querySnapshot) => {
                count = querySnapshot.size;
                if (count === 0) {
                    navigation.navigate("FindGroupScreen");
                    unsubscribe();
                }
                else if (count >= groupThreshold || getDifferenceInHours(new Date(), lastJoinedAt.toDate()) >= 6) {
                    //hit threshold, handle logic to form a group. currently only an alert.
                    Alert.alert("Group found!");
                    const successfulFinding = count >= 2;
                    clearUsers(successfulFinding, category);
                    navigation.navigate("FindGroupScreen");
                    unsubscribe();
                } else {
                    //not enough people to form group, send to waiting screen.
                    navigation.navigate("WaitingScreen", {
                        groupCategory: category,
                    });
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