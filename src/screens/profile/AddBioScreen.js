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
import CancelButton from "../../components/CancelButton";
import SubmitButton from "../../components/SubmitButton";

export default class AddBioScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: null,
        };
    }

    submitPost = async (navigator) => {
        console.log("Bio: ", this.state.text);

        firebase
            .firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .update({
                bio: this.state.text,
            })
            .then(() => {
                console.log("Bio updated!");
                Alert.alert(
                    "Bio updated",
                    "Your bio has been successfully updated!",
                    [
                        {
                            text: "OK",
                            onPress: navigator,
                        },
                    ],
                    { cancelable: false }
                );
                this.setState({ text: null });
            })
            .catch((error) => {
                console.log(
                    "Something went wrong when updating bio to firestore.",
                    error
                );
            });
    };

    render() {
        const { navigation } = this.props;
        return (
            <SafeAreaView>
                <View style={styles.container}>
                    <View style={styles.innerContainer}>
                        <Text style={styles.title}>Tell us about yourself</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Type here (maximum 100 characters)"
                            onChangeText={(text) => this.setState({ text })}
                            value={this.state.text}
                            multiline={true}
                            maxLength={100}
                        />

                        <View style={styles.buttons}>
                            <CancelButton goBack={() => navigation.goBack()} />
                            <View style={styles.space} />
                            <SubmitButton
                                goBack={() => {
                                    this.state.text != null
                                        ? this.submitPost(
                                            () => navigation.goBack()
                                          )
                                        : Alert.alert(
                                              "Your new bio is empty!",
                                              "Write something into the text box to post."
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
        //    alignItems: 'center',
        //    justifyContent: 'center',
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
        height: 100,
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
});
