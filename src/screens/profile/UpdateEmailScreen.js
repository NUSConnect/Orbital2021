import * as firebase from "firebase";
import React from "react";
import {
    Alert,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";
import { logoutUser } from "../../api/auth";
import CancelButton from "../../components/CancelButton";
import SubmitButton from "../../components/SubmitButton";
import { emailValidator } from "../../helpers/auth/emailValidator";

export default class UpdateEmailScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: null,
        };
    }

    submitEmail = async (navigator, email) => {
        var list = [];

        if (firebase.auth().currentUser.email === email) {
            Alert.alert("This is your current email!");
            return;
        }
        if (emailValidator(email)) {
            Alert.alert("This is an invalid email, please try again.");
            return;
        }

        await firebase
            .firestore()
            .collection("users")
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    list.push(doc.data().email);
                });
                console.log(list);
            });

        if (list.includes(email)) {
            Alert.alert("This email is currently in use!");
            return;
        }

        await firebase
            .auth()
            .currentUser.updateEmail(email)
            .then(() => {
                Alert.alert(
                    "Email successfully changed",
                    "Please login again",
                    [
                        {
                            text: "OK",
                            onPress: navigator,
                        },
                    ],
                    { cancelable: false }
                );
            }).catch(err => {
                Alert.alert("Your login credentials have expired.", "Please login and try again.");
                logoutUser();
            });
    };

    render() {
        const { navigation } = this.props;
        return (
            <SafeAreaView>
                <View style={styles.container}>
                    <View style={styles.innerContainer}>
                        <Text style={styles.title}>Update your email</Text>
                        <Text style={styles.current}>
                            Current email: {firebase.auth().currentUser.email}
                        </Text>
                        <View style={styles.wordspace} />
                        <Text style={styles.current}>
                            Enter your new email here:
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
                                        ? this.submitEmail(
                                              () => logoutUser(),
                                              this.state.text
                                          )
                                        : Alert.alert(
                                              "Can't update with no email!",
                                              "Enter the new email you want to use."
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