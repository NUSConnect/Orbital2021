import React, { useEffect, useState, useContext } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TextInput,
    SafeAreaView,
    Alert,
    ActivityIndicator,
    Platform,
    Animated,
} from "react-native";
import SubmitButton from "../../components/SubmitButton";
import CancelButton from "../../components/CancelButton";
import { FIREBASE_CONFIG } from "../../core/config";
import { logoutUser } from "../../api/auth";
import { nameValidator } from "../../helpers/auth/nameValidator";
import * as firebase from "firebase";

export default class ChangeNameScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            text: null,
        };
    }

    updateName = (name) => {
        firebase.auth().currentUser.updateProfile({ displayName:name });
            firebase
                .firestore()
                .collection("users")
                .doc(firebase.auth().currentUser.uid)
                .update({ name:name });
            Alert.alert("Username changed successfully!");
    }

    submitName = async (navigator, name) => {
        const list = [];
        if (firebase.auth().currentUser.displayName === name) {
            Alert.alert("This is your current username!", "Please choose something else");
            return;
        }
        if (nameValidator(name)) {
            Alert.alert("Can't update with no input!", "Enter the new username you want to use.");
            return;
        }
        firebase
            .firestore()
            .collection("users")
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {
                    list.push(documentSnapshot.data().name);
                });
                if (list.indexOf(name) <= -1) {
                    this.updateName(name);
                    navigator();
                } else {
                    Alert.alert("Someone else already has this username!", "Please choose another username");
                }
            });

    };

    render() {
        const { navigation } = this.props;
        return (
            <SafeAreaView>
                <View style={styles.container}>
                    <View style={styles.innerContainer}>
                        <Text style={styles.title}>Enter your new username</Text>
                        <View style={styles.wordspace} />
                        <Text style={styles.current}>
                            Enter your new username here:
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Type here..."
                            onChangeText={(text) => this.setState({ text })}
                            value={this.state.text}
                            multiline={false}
                        />

                        <View style={styles.buttons}>
                            <CancelButton goBack={() => navigation.goBack()} />
                            <View style={styles.space} />
                            <SubmitButton
                                goBack={() => {
                                    this.state.text != null
                                        ? this.submitName(
                                              () => this.props.navigation.goBack(),
                                              this.state.text
                                          )
                                        : Alert.alert(
                                              "Can't update with no input!",
                                              "Enter the new username you want to use."
                                          );
                                }}
                                string={"Update"}
                            />
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 0,
        flexDirection: "row",
    },
    innerContainer: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
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
    input: {
        flex: 0,
        height: 60,
        width: "90%",
        margin: 12,
        borderWidth: 1,
        fontSize: 18,
        paddingLeft: 10,
        justifyContent: "flex-start",
        alignItems: "flex-start",
    },
    buttons: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
    },
    space: {
        width: 20,
    },
    current: {
        fontSize: 20,
    },
    wordspace: {
        height: 30,
    },
});