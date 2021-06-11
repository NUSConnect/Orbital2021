import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function SubmitButton({ goBack, string }) {
    return (
        <TouchableOpacity onPress={goBack} style={styles.container}>
            <Text style={styles.text}>{string}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#79D2E6",
        alignItems: "center",
        height: 50,
        width: 180,
        borderRadius: 30,
    },
    text: {
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: 30,
        lineHeight: 50,
        alignItems: "center",
    },
});