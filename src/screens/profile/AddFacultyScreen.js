import React, { useState, useEffect } from "react";
import {
    SafeAreaView,
    Text,
    StyleSheet,
    View,
    FlatList,
    TextInput,
    ActivityIndicator,
    StatusBar,
    Alert,
} from "react-native";
import * as firebase from "firebase";

export default function AddFacultyScreen({ props, navigation, goBack }) {
    const currentUserId = firebase.auth().currentUser.uid;

    const faculties = [
        { name: "College of Humanities and Sciences" },
        { name: "Business and Accountancy" },
        { name: "Computing" },
        { name: "Dentistry" },
        { name: "Design and Environment" },
        { name: "Engineering" },
        { name: "Law" },
        { name: "Medicine" },
        { name: "Nursing" },
        { name: "Pharmacy" },
        { name: "Music" },
    ];

    const ItemView = ({ item }) => {
        return (
            // Flat List Item
            <Text
                style={styles.itemStyle}
                onPress={() => {
                    firebase
                        .firestore()
                        .collection("users")
                        .doc(currentUserId)
                        .update({ faculty: item.name });
                    Alert.alert("Thank you for sharing your faculty!");
                    navigation.goBack();
                }}
            >
                {item.name}
            </Text>
        );
    };

    const ItemSeparatorView = () => {
        return (
            // Flat List Item Separator
            <View
                style={{
                    height: 0.5,
                    width: "100%",
                    backgroundColor: "#C8C8C8",
                }}
            />
        );
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <Text style={styles.title}> Which faculty are you from? </Text>
                <FlatList
                    data={faculties}
                    ItemSeparatorComponent={ItemSeparatorView}
                    renderItem={ItemView}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex: 1,
    },
    itemStyle: {
        padding: 10,
        fontSize: 20,
    },
    textInputStyle: {
        height: 40,
        borderWidth: 1,
        paddingLeft: 20,
        margin: 5,
        borderColor: "#ff8c00",
        backgroundColor: "#FFFFFF",
    },
    title: {
        height: 60,
        lineHeight: 60,
        width: "100%",
        backgroundColor: "#ff8c00",
        color: "#ffffff",
        fontSize: 30,
        paddingLeft: 15,
        marginBottom: 10,
    },
});