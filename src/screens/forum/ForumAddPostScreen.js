import * as firebase from "firebase";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CancelButton from "../../components/CancelButton";
import SubmitButton from "../../components/SubmitButton";
import { textChecker } from '../../api/textChecker';

const ForumAddPostScreen = ({ navigation, route, onPress }) => {
    const userID = firebase.auth().currentUser.uid;
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");

    const { forumId } = route.params;

    const submitPost = async (navigator) => {
        const postID = userID + Date.now();

        firebase
            .firestore()
            .collection("forums")
            .doc(forumId)
            .collection("forumPosts")
            .doc(postID)
            .set({
                userId: userID,
                postId: postID,
                postTitle: title,
                postBody: text,
                postTime: firebase.firestore.Timestamp.fromDate(new Date()),
                votes: 0,
                commentCount: 0,
            })
            .then(() => {
                console.log("Post Added!");
                Alert.alert(
                    "Post published!",
                    "Your post has been published successfully!",
                    [
                        {
                            text: "OK",
                            onPress: navigator,
                        },
                    ],
                    { cancelable: false }
                );
                setTitle('');
                setText('');
            })
            .catch((error) => {
                console.log(
                    "Something went wrong with added post to firestore.",
                    error
                );
            });
    };
    return (
        <KeyboardAwareScrollView style={styles.container}>
            <Text style={styles.title}>Create a Forum Post</Text>
            <Text style={styles.subTitle}>Post Title</Text>
            <TextInput
                style={styles.inputTitle}
                returnKeyType="next"
                onChangeText={(title) => setTitle(title)}
                value={title}
                placeholder="Post title"
            />
            <Text style={styles.subTitle}>Post Body</Text>
            <TextInput
                style={styles.inputBody}
                onChangeText={(text) => setText(text)}
                value={text}
                multiline={true}
                placeholder="Post body"
            />
            <View style={styles.buttons}>
                <CancelButton goBack={() => navigation.goBack()} />
                <View style={styles.space} />
                <SubmitButton
                    goBack={() => {
                        if (textChecker(title) && textChecker(text)) {
                            submitPost(() => navigation.goBack());
                        } else {
                            Alert.alert(
                                "Cannot submit an empty post!",
                                "Fill in title and text body to post."
                            );
                        }
                    }}
                    string={"Post"}
                />
            </View>
        </KeyboardAwareScrollView>
    );
};

export default ForumAddPostScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    inputTitle: {
        flex: 0,
        height: 40,
        margin: 12,
        borderWidth: 1,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        paddingLeft: 10,
    },
    inputBody: {
        flex: 0,
        height: 440,
        margin: 12,
        borderWidth: 1,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        textAlignVertical: 'top',
        paddingTop: 10,
        paddingLeft: 10,
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