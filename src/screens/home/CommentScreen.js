import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TextInput,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "react-native-vector-icons";
import TitleWithBack from "../../components/TitleWithBack";
import moment from "moment";

import * as firebase from "firebase";

const CommentScreen = ({ navigation, route, onPress }) => {
    const currentUserId = firebase.auth().currentUser.uid;
    const [userData, setUserData] = useState(null);
    const [comments, setComments] = useState([]);
    const [postId, setPostId] = useState("");
    const [text, setText] = useState("");
    const [refreshing, setRefreshing] = useState(true);

    const { item } = route.params;

    const getUser = async () => {
        await firebase
            .firestore()
            .collection("users")
            .doc(item.userId)
            .get()
            .then((documentSnapshot) => {
                if (documentSnapshot.exists) {
                    console.log("User Data", documentSnapshot.data());
                    setUserData(documentSnapshot.data());
                }
            });
    };

    const matchUserToComment = async (comments) => {
        for (let k = 0; k < comments.length; k++) {
            const commenterId = comments[k].creator;

            await firebase
                .firestore()
                .collection("users")
                .doc(commenterId)
                .get()
                .then((doc) => {
                    if (doc.exists) {
                        comments[k].user = doc.data().name;
                    } else {
                        comments[k].user = "anon";
                    }
                });
        }
        setComments(comments);
        console.log("Comments: ", comments);
    };

    const fetchComments = async () => {
        const list = [];
        setRefreshing(true);
        console.log("fetching comments...");

        await firebase
            .firestore()
            .collection("posts")
            .doc(item.userId)
            .collection("userPosts")
            .doc(item.postId)
            .collection("comments")
            .orderBy("postTime", "asc")
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const { creator, postTime, text } = doc.data();
                    list.push({
                        id: doc.id,
                        creator: creator,
                        postTime: postTime,
                        text: text,
                    });
                });
            });

        matchUserToComment(list);

        if (refreshing) {
            setRefreshing(false);
        }
    };

    const onCommentSend = () => {
        firebase
            .firestore()
            .collection("posts")
            .doc(item.userId)
            .collection("userPosts")
            .doc(item.postId)
            .collection("comments")
            .add({
                creator: currentUserId,
                postTime: firebase.firestore.Timestamp.fromDate(new Date()),
                text,
            })
            .then(() => {
                console.log("Comment added");
                Alert.alert(
                    "Comment published!",
                    "Your comment has been published successfully!"
                );
                fetchComments();
                setRefreshing(false);
                setText("");
            });

        item.commentCount = item.commentCount + 1;
        firebase
            .firestore()
            .collection("posts")
            .doc(item.userId)
            .collection("userPosts")
            .doc(item.postId)
            .update({ commentCount: item.commentCount });
    };

    const handleDelete = (commentId) => {
        Alert.alert(
            "Delete post",
            "Are you sure?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed!"),
                    style: "cancel",
                },
                {
                    text: "Confirm",
                    onPress: () => deleteComment(commentId),
                },
            ],
            { cancelable: false }
        );
    };

    const deleteComment = (commentId) => {
        console.log("Current Comment Id: ", commentId);

        firebase
            .firestore()
            .collection("posts")
            .doc(item.userId)
            .collection("userPosts")
            .doc(item.postId)
            .collection("comments")
            .doc(commentId)
            .delete()
            .then(() => {
                Alert.alert(
                    "Comment deleted",
                    "Your comment has been deleted successfully!"
                );
                fetchComments();
                setRefreshing(false);
            })
            .catch((e) => console.log("Error deleting comment.", e));

        item.commentCount = item.commentCount - 1;
        firebase
            .firestore()
            .collection("posts")
            .doc(item.userId)
            .collection("userPosts")
            .doc(item.postId)
            .update({ commentCount: item.commentCount });
    };

    const handleReport = (postId) => {
        Alert.alert(
            "Report Comment",
            "Are you sure?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed!"),
                    style: "cancel",
                },
                {
                    text: "Confirm",
                    onPress: () =>
                        Alert.alert(
                            "Comment Reported!",
                            "This comment has been reported successfully!"
                        ),
                },
            ],
            { cancelable: false }
        );
    };

    const ItemSeparator = () => (
        <View
            style={{
                height: 2,
                backgroundColor: "#dcdcdc",
                marginLeft: 10,
                marginRight: 10,
            }}
        />
    );

    const handleRefresh = () => {
        setRefreshing(false);
        fetchComments();
        setRefreshing(false);
    };

    useEffect(() => {
        getUser();
        fetchComments();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <TitleWithBack onPress={() => navigation.goBack()} />
            <View style={styles.commentContainer}>
                <View style={styles.postInfo}>
                    <View style={styles.userComment}>
                        <Text style={styles.username}>
                            {userData
                                ? userData.name + ":" || "Anonymous User:"
                                : "Anonymous User:"}
                        </Text>
                        <Text style={styles.comment}>{item.post}</Text>
                    </View>
                    <Text style={styles.time}>
                        {" "}
                        {moment(item.postTime.toDate()).fromNow()}{" "}
                    </Text>
                </View>
            </View>
            <View
                style={{
                    height: 2,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    marginLeft: 10,
                    marginRight: 10,
                }}
            />
            <FlatList
                numColumns={1}
                horizontal={false}
                data={comments}
                renderItem={({ item }) => (
                    <View style={styles.commentContainer}>
                        <View style={styles.textContainer}>
                            <View style={styles.userComment}>
                                <Text style={styles.username}>{item.user}</Text>
                                <Text style={styles.comment}>{item.text}</Text>
                            </View>
                            <Text style={styles.time}>
                                {" "}
                                {moment(item.postTime.toDate()).fromNow()}{" "}
                            </Text>
                        </View>
                        {currentUserId === item.creator ? (
                            <TouchableOpacity
                                onPress={() => handleDelete(item.id)}
                                style={styles.deleter}
                            >
                                <Ionicons name="md-trash-bin" size={25} />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                onPress={() => handleReport(item.id)}
                                style={styles.deleter}
                            >
                                <MaterialIcons
                                    name="report-problem"
                                    size={25}
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                )}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={ItemSeparator}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                style={{ width: "100%", marginBottom: 2 }}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Comment..."
                    onChangeText={(text) => setText(text)}
                    style={styles.inputBox}
                    multiline={true}
                />
                <TouchableOpacity
                    onPress={() => {
                        if (text != '') {
                            onCommentSend();
                        } else {
                            Alert.alert(
                            "Cannot submit an empty comment!",
                            "Fill in comment body to post."
                            );
                        }
                    }}
                    style={styles.sendButton}
                >
                    <Ionicons name={"send-sharp"} size={25} color={"#79D2E6"} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default CommentScreen;

const styles = StyleSheet.create({
    container: {
        flex: 0,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 40,
    },
    commentContainer: {
        flexDirection: "row",
        width: "100%",
        padding: 10,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    postInfo: {
        justifyContent: "flex-start",
        alignItems: "flex-start",
    },
    userComment: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
    },
    username: {
        fontSize: 16,
        fontWeight: "bold",
        marginRight: 5,
    },
    commentText: {
        fontSize: 16,
    },
    time: {
        fontSize: 14,
        color: "#666",
    },
    textContainer: {
        width: "90%",
    },
    deleter: {},
    inputContainer: {
        width: "100%",
        height: 50,
        flexDirection: "row",
        backgroundColor: "white",
        marginBottom: 40,
        alignItems: "center",
    },
    inputBox: {
        width: "90%",
        paddingLeft: 15,
    },
});