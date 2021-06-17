import * as firebase from "firebase";
import React, { useState } from "react";
import {
    Alert,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CancelButton from "../../components/CancelButton";
import SubmitButton from "../../components/SubmitButton";
import { textChecker } from '../../api/textChecker';

const EditForumCommentScreen = ({ navigation, route }) => {
    const currentUserId = firebase.auth().currentUser.uid;
    const { comment, forumId } = route.params;
    const [text, setText] = useState(comment.commentBody);

    const updatePost = async (navigator) => {
        firebase
            .firestore()
            .collection("forums")
            .doc(forumId)
            .collection("forumPosts")
            .doc(comment.postId)
            .collection('comments')
            .doc(comment.commentId)
            .update({
                commentBody: text,
            })
            .then(() => {
                console.log("Comment updated!");
                Alert.alert(
                    "Comment updated",
                    "Your comment has been successfully updated!",
                    [
                        {
                            text: "OK",
                            onPress: navigator,
                        },
                    ],
                    { cancelable: false }
                );
            })
            .catch((error) => {
                console.log(
                    "Something went wrong when updating post to firestore.",
                    error
                );
            });
    };

    return (
        <KeyboardAwareScrollView
                    style={styles.container}
                    contentContainerStyle={styles.innerContainer}
                    resetScrollToCoords={{ x: 0, y: 0 }}
                    scrollEnabled={true}
                >
                    <Text style={styles.title}>Edit Your Forum Comment</Text>

                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => setText(text)}
                        value={text}
                        multiline={true}
                    />

                    <View style={styles.buttons}>
                        <CancelButton goBack={() => navigation.goBack()} />
                        <View style={styles.space} />
                        <SubmitButton
                            goBack={() => {
                                textChecker(text)
                                    ? updatePost(() => navigation.goBack())
                                    : Alert.alert(
                                          "Cannot submit an empty comment!",
                                          "Write something into the comment box to post."
                                      );
                            }}
                            string={"Edit"}
                        />
            </View>
        </KeyboardAwareScrollView>
    );
};

export default EditForumCommentScreen;

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
        height: 400,
        width: "90%",
        margin: 12,
        borderWidth: 1,
        fontSize: 18,
        padding: 10,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        textAlignVertical: 'top',
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
