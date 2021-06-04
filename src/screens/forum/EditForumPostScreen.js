import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    SafeAreaView,
    TouchableOpacity,
    Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "react-native-vector-icons";
import TitleWithBack from "../../components/TitleWithBack";
import CancelButton from "../../components/CancelButton";
import SubmitButton from "../../components/SubmitButton";

import moment from "moment";

import * as firebase from "firebase";

const EditForumPostScreen = ({ navigation, route }) => {
    const currentUserId = firebase.auth().currentUser.uid;
    const { post, forumId } = route.params;
    const [text, setText] = useState(post.postBody);

    const updatePost = async (navigator) => {
        firebase
            .firestore()
            .collection("forums")
            .doc(forumId)
            .collection("forumPosts")
            .doc(post.postId)
            .update({
                postBody: text,
            })
            .then(() => {
                console.log("Post updated!");
                Alert.alert(
                    "Post updated",
                    "Your post text has been successfully updated!",
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
        <SafeAreaView>
            <View style={styles.container}>
                <View style={styles.innerContainer}>
                    <Text style={styles.title}>Edit Your Forum Post</Text>

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
                                text != ''
                                    ? updatePost(() => navigation.goBack())
                                    : Alert.alert(
                                          "Cannot submit an empty comment!",
                                          "Write something into the comment box to post."
                                      );
                            }}
                            string={"Edit"}
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default EditForumPostScreen;

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
        height: 400,
        width: "90%",
        margin: 12,
        borderWidth: 1,
        fontSize: 18,
        padding:10,
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
