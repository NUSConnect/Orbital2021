import * as firebase from "firebase";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const CommentItem = ({ route, item, onViewProfile, onPressHandle }) => {
    const currentUserId = firebase.auth().currentUser.uid;
    const [userData, setUserData] = useState(null);

    const getUser = async () => {
        await firebase
            .firestore()
            .collection("users")
            .doc(item.userId)
            .get()
            .then((documentSnapshot) => {
                if (documentSnapshot.exists) {
                    setUserData(documentSnapshot.data());
                }
            });
    };

    useEffect(() => {
        getUser();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.headerLeft}>
                    <Text style={styles.regularFont}>{"Posted by "}</Text>
                    <Text
                        style={styles.username}
                        onPress={() => onViewProfile(currentUserId)}
                        testID='username'
                    >
                        {userData
                            ? userData.name || "Anonymous User"
                            : "Anonymous User"}
                    </Text>
                    <Text style={styles.regularFont} testID='time'>
                        {" ·"} {moment(item.postTime.toDate()).fromNow()}
                    </Text>
                </View>
                <View style={styles.headerRight}></View>
            </View>

            <Text style={styles.text} onPress={onPressHandle} testID='comment'>
                {item.commentBody}
            </Text>
        </View>
    );
};

export default CommentItem;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        width: "100%",
        marginBottom: 20,
        borderRadius: 10,
    },
    headerContainer: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        paddingLeft: 10,
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    headerRight: {},
    centerAlign: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "33%",
    },
    text: {
        fontSize: 16,
        padding: 5,
        paddingLeft: 10,
        marginBottom: 10,
    },
    regularFont: {
        fontSize: 14,
    },
    username: {
        fontSize: 14,
        color: "blue",
    },
});