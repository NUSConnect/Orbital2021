import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TextInput,
    SafeAreaView,
    TouchableOpacity,
    Alert,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CancelButton from "../../components/CancelButton";
import SubmitButton from "../../components/SubmitButton";
import * as ImagePicker from "expo-image-picker";

import * as firebase from 'firebase';


export default class ForumCreationScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nameText: "",
            descriptionText: "",
            reasonText: "",
            image: 'https://firebasestorage.googleapis.com/v0/b/orbital2021-a4766.appspot.com/o/forum%2FWELCOME.png?alt=media&token=eb0f815b-0e18-4eca-b5a6-0cc170b0eb51',
        };
    }

    choosePhotoFromLibrary = async () => {
        let permissionResult =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }

        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
        });
        console.log(pickerResult);

        if (pickerResult.cancelled === true) {
            return;
        }

        this.setState({ image: pickerResult.uri });
    };

    submitPost = async (goBack) => {
        Alert.alert(
            "Submit request for creation of forum",
            "Are you sure?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed!"),
                    style: "cancel",
                },
                {
                    text: "Confirm",
                    onPress: () => this.handleSubmit(goBack),
                },
            ],
            { cancelable: false }
        );
    };

    handleSubmit = async (navigator) => {
        const imageUrl = await this.uploadImage();

        const postID = firebase.auth().currentUser.uid + Date.now();

        firebase
            .firestore()
            .collection("forums")
            .add({
                forumImg: imageUrl,
                forumName: this.state.nameText,
                forumDescription: this.state.descriptionText,
                reason: this.state.reasonText,
            })
            .then(() => {
                Alert.alert(
                    "Forum created!",
                    "The forum has been created successfully! It will be reviewed by the moderators shortly",
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
                    "Something went wrong with added post to firestore.",
                    error
                );
            });
    };

    uploadImage = async () => {
        if (this.state.image == null) {
            return null;
        }
        const uploadUri = this.state.image;
        const response = await fetch(uploadUri);
        const blob = await response.blob();

        let filename = uploadUri.substring(uploadUri.lastIndexOf("/") + 1);

        // Add timestamp to File Name
        const extension = filename.split(".").pop();
        const name = this.state.nameText + '_'
        filename = name + Date.now() + "." + extension;

        const storageRef = firebase.storage().ref(`forum/${filename}`);
        const task = storageRef.put(blob);

        try {
            await task;

            const url = await storageRef.getDownloadURL();

            return url;
        } catch (e) {
            console.log(e);
            return null;
        }
    };

    render() {
        const { navigation } = this.props;
        return (
            <KeyboardAwareScrollView
                style={styles.container}
                resetScrollToCoords={{ x: 0, y: 0 }}
                scrollEnabled={true}
            >
                <Text style={styles.title}>Create a new Forum</Text>
                <Text style={styles.subTitle}>Forum Image</Text>
                <TouchableOpacity style={styles.imageContainer} onPress={this.choosePhotoFromLibrary}>
                    <Image
                        source={{
                            uri: this.state.image
                        }}
                        style={styles.image}
                    />
                </TouchableOpacity>
                <Text style={styles.subTitle}>Forum Name</Text>
                <TextInput
                    style={styles.nameInput}
                    returnKeyType="next"
                    onChangeText={(nameText) => this.setState({ nameText })}
                    value={this.state.nameText}
                    placeholder="Enter a name"
                />
                <Text style={styles.subTitle}>Forum Description</Text>
                <TextInput
                    style={styles.descriptionInput}
                    onChangeText={(descriptionText) =>
                        this.setState({ descriptionText })
                    }
                    value={this.state.descriptionText}
                    placeholder="Enter a description"
                    multiline={true}
                />
                <Text style={styles.subTitle}>Reason for new Forum</Text>
                <TextInput
                    style={styles.reasonInput}
                    onChangeText={(reasonText) => this.setState({ reasonText })}
                    value={this.state.reasonText}
                    placeholder="Give a few reasons why this is different from existing forums"
                    multiline={true}
                />
                <View style={styles.buttons}>
                    <CancelButton goBack={() => navigation.goBack()} />
                    <View style={styles.space} />
                    <SubmitButton
                        goBack={() => {
                            if (this.state.nameText != '' && this.state.descriptionText != '' &&
                                this.state.reasonText != '') {
                                this.submitPost(() => navigation.goBack());
                            } else {
                                Alert.alert(
                                    "Missing information",
                                    "Please fill in all text boxes."
                                );
                            }
                        }}
                        string={"Create"}
                    />
                </View>
            </KeyboardAwareScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
    },
    title: {
        height: 60,
        lineHeight: 60,
        width: "100%",
        backgroundColor: "#ff8c00",
        color: "#ffffff",
        fontSize: 30,
        paddingLeft: 15,
    },
    subTitle: {
        fontSize: 16,
        color: "#000000",
        paddingTop: 10,
        paddingLeft: 20,
    },
    nameInput: {
        flex: 0,
        height: 40,
        margin: 12,
        borderWidth: 1,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        paddingLeft: 10,
    },
    descriptionInput: {
        flex: 0,
        height: 60,
        margin: 12,
        borderWidth: 1,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        textAlignVertical: 'top',
        padding: 10,
    },
    reasonInput: {
        flex: 0,
        height: 100,
        margin: 12,
        borderWidth: 1,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        textAlignVertical: 'top',
        padding: 10,
    },
    buttons: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 30,
    },
    space: {
        width: 20,
    },
    imageContainer: {
        alignItems: 'center',
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: "black",
    },
});