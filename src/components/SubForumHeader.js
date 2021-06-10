import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "react-native-vector-icons";

export default function SubForumHeader({
    title,
    style,
    goBack,
    onPress,
    isSubscribed,
    subscribe,
}) {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.button}
                activeOpacity={0.4}
                onPress={goBack}
            >
                <Ionicons
                    name="arrow-back"
                    color="#79D2E6"
                    size={38}
                    style={styles.icon}
                />
            </TouchableOpacity>
            <View style={styles.title}>
                <Text style={styles.text}>{title}</Text>
                <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.4}
                    onPress={subscribe}
                >
                    <Ionicons
                        name="star"
                        color={isSubscribed ? 'gold' : 'darkgray'}
                        size={26}
                        style={styles.star}
                    />
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                style={styles.button}
                activeOpacity={0.4}
                onPress={onPress}
            >
                <Ionicons
                    name="add"
                    color="#79D2E6"
                    size={38}
                    style={styles.icon}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 60,
        flexDirection: "row",
        backgroundColor: "#ffffff",
        borderColor: "#dcdcdc",
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    button: {
        width: "15%",
        paddingLeft: 12,
    },
    title: {
        flex: 1,
        flexDirection: 'row',
        width: "85%",
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 30,
    },
    text: {
        color: "#ff7f50",
        fontSize: 30,
        textAlign: "center",
    },
    icon: {},
});