import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "react-native-vector-icons";

export default function AddMajorTopTab({ onPress }) {
    return (
        <View style={styles.header}>
            <Ionicons
                name="arrow-back"
                color="#79D2E6"
                size={38}
                style={styles.icon}
                onPress={onPress}
            />
            <Text style={styles.title}> Add your major </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        height: 60,
        lineHeight: 60,
        width: "100%",
        backgroundColor: "#ffffff",
        color: "#ff8c00",
        fontSize: 30,
        paddingLeft: 15,
        marginBottom: 10,
    },
    header: {
        flexDirection: "row",
    },
    icon: {
        marginTop: 10,
    },
});