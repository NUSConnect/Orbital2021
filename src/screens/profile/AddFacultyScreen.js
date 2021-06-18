import * as firebase from "firebase";
import React from "react";
import {
    Alert,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    View
} from "react-native";
import { Ionicons } from "react-native-vector-icons";

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

    const oneMajor = (major) => {
        Alert.alert("Thank you!", "Your major has been chosen");
        firebase
            .firestore()
            .collection("users")
            .doc(currentUserId)
            .update({ major:major });
        navigation.goBack();
    }

    const multipleMajors = (screen) => {
        navigation.navigate(screen);
    }

    const ItemView = ({ item }) => {
        return (
            // Flat List Item
            <Text
                style={styles.itemStyle}
                onPress={() => {
                    switch (item.name) {
                        case "College of Humanities and Sciences": {
                            multipleMajors("CHSMajorsScreen");
                            break;
                        }
                        case "Business and Accountancy": {
                            multipleMajors("BusinessMajorsScreen");
                            break;
                        }
                        case "Computing": {
                            multipleMajors("ComputingMajorsScreen");
                            break;
                        }
                        case "Dentistry": {
                            oneMajor("Dentistry");
                            break;
                        }
                        case "Design and Environment": {
                            multipleMajors("DesignMajorsScreen");
                            break;
                        }
                        case "Engineering": {
                            multipleMajors("EngineeringMajorsScreen");
                            break;
                        }
                        case "Law": {
                            oneMajor("Law");
                            break;
                        }
                        case "Medicine": {
                            oneMajor("Medicine");
                            break;
                        }
                        case "Nursing": {
                            oneMajor("Nursing");
                            break;
                        }
                        case "Pharmacy": {
                            oneMajor("Pharmacy");
                            break;
                        }
                        case "Music": {
                            oneMajor("Music");
                            break;
                        }
                        default: {
                            //shouldn't ever be executed
                            Alert.alert("No such faculty");
                        }
                    }
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
            <View style={styles.header}>
                <Ionicons
                                    name="arrow-back"
                                    color="#79D2E6"
                                    size={38}
                                    style={styles.icon}
                                    onPress={() => navigation.goBack()}
                                />
                <Text style={styles.title}> Add your faculty </Text>
                </View>
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