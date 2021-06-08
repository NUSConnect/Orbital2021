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
    Alert
} from "react-native";
import * as firebase from "firebase";

export default function ComputingMajorsScreen({ props, navigation, goBack }) {
    const currentUserId = firebase.auth().currentUser.uid;

    const majors = [
        { name: "Business Analytics" },
        { name: "Computer Science" },
        { name: "Information Security" },
        { name: "Information Systems" },
        { name: "Computer Engineering" },
    ];

    const returnToPersonal = () => {
        navigation.goBack();
        navigation.goBack();
    }

    const ItemView = ({ item }) => {
            return (
                <Text
                    style={styles.itemStyle}
                    onPress={() => {
                        firebase
                            .firestore()
                            .collection("users")
                            .doc(currentUserId)
                            .update({ major: item.name });
                        Alert.alert("Thank you!", "Your major has been chosen");
                        returnToPersonal();
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
                        <Text style={styles.title}> Which major are you from? </Text>
                        <FlatList
                            data={majors}
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