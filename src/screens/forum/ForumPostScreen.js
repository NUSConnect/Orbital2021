import * as firebase from "firebase";
import React, { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    SafeAreaView,
    StyleSheet,
    View
} from "react-native";
import CommentItem from "../../components/CommentItem";
import CreateComment from '../../components/CreateComment';
import ForumPost from "../../components/ForumPost";
import ForumPostHeader from "../../components/ForumPostHeader";

const ForumPostScreen = ({ navigation, route, onPress }) => {
    const currentUserId = firebase.auth().currentUser.uid;
    const [comments, setComments] = useState([]);
    const [refreshing, setRefreshing] = useState(true);
    const [comment, setComment] = useState('');
    const [isFocused, setIsFocused] = useState(null);

    const { item, forumId, forumName } = route.params;

    const fetchComments = async () => {
        const list = [];
        setRefreshing(true);

        await firebase
            .firestore()
            .collection("forums")
            .doc(forumId)
            .collection("forumPosts")
            .doc(item.postId)
            .collection('comments')
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const { userId, postTime, commentBody } = doc.data();
                    list.push({
                        postId: item.postId,
                        commentId: doc.id,
                        userId,
                        postTime: postTime,
                        commentBody,
                    });
                });
            });

        if (refreshing) {
            setRefreshing(false);
        }

        setComments(list);
        console.log('Post comments: ', comments)
    };

    const onCommentSend = () => {
        firebase
            .firestore()
            .collection("forums")
            .doc(forumId)
            .collection("forumPosts")
            .doc(item.postId)
            .collection("comments")
            .add({
                userId: currentUserId,
                postTime: firebase.firestore.Timestamp.fromDate(new Date()),
                commentBody: comment,
            })
            .then(() => {
                console.log("Comment added");
                Alert.alert(
                    "Comment published!",
                    "Your comment has been published successfully!"
                );
                fetchComments();
                setRefreshing(false);
                setComment("");
            });

        item.commentCount = item.commentCount + 1;
        firebase
            .firestore()
            .collection("forums")
            .doc(forumId)
            .collection("forumPosts")
            .doc(item.postId)
            .update({ commentCount: item.commentCount });
    }

    const navigateProfile = (creatorId, ownNavigation, otherNavigation) => {
        return (currUserId) => {
            console.log("Current User: ", currUserId);
            console.log("Creator User: ", creatorId);
            if (currUserId == creatorId) {
                ownNavigation();
            } else {
                otherNavigation();
            }
        };
    };

    const onPressComment = (comment) => {
        console.log(currentUserId);
        console.log(comment.userId);
        if (currentUserId == comment.userId) {
            Alert.alert(
                "Your comment has been selected",
                "What do you want to do with it?",
                [
                    {
                        text: "Cancel",
                        onPress: () => console.log("cancel pressed"),
                    },
                    {
                        text: "Delete",
                        onPress: () => handleDelete(comment),
                    },
                    {
                        text: "Edit",
                        onPress: () => navigation.navigate('EditForumCommentScreen', { comment, forumId }),
                    },
                ],
                { cancelable: true }
            );
        } else {
            Alert.alert(
                "Report comment",
                "Are you sure?",
                [
                    {
                        text: "Cancel",
                        onPress: () => console.log("cancel pressed"),
                    },
                    {
                        text: "OK",
                        onPress: () => handleReport(comment),
                    },

                ],
                { cancelable: true }
            );
        }
    }

    const handleDelete = (comment) => {
        Alert.alert(
            "Delete comment",
            "Are you sure?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed!"),
                    style: "cancel",
                },
                {
                    text: "Confirm",
                    onPress: () => deleteComment(comment),
                },
            ],
            { cancelable: false }
        );
    };

    const deleteComment = (comment) => {
        console.log("Current Comment Id: ", comment.commentId);

        firebase
            .firestore()
            .collection("forums")
            .doc(forumId)
            .collection("forumPosts")
            .doc(comment.postId)
            .collection("comments")
            .doc(comment.commentId)
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
            .collection("forums")
            .doc(forumId)
            .collection("forumPosts")
            .doc(comment.postId)
            .update({ commentCount: item.commentCount });
    };

    const handleReport = (comment) => {
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
        fetchComments();
        const _unsubscribe = navigation.addListener('focus', () => fetchComments());

        return () => {
            _unsubscribe();
        }
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ForumPostHeader
                goBack={() => navigation.goBack()}
                title={forumName}
            />
            <FlatList
                data={comments}
                ListHeaderComponent={
                    <ForumPost
                        item={item}
                        onViewProfile={navigateProfile(
                             item.userId,
                             () => navigation.navigate("Profile"),
                             () =>
                                 navigation.navigate("ViewProfileScreen", {
                                     item,
                                 })
                        )}
                    />
                }
                ListHeaderComponentStyle={styles.headerComponentStyle}
                renderItem={({ item }) => (
                    <CommentItem
                        item={item}
                        onViewProfile={navigateProfile(
                             item.userId,
                             () => navigation.navigate("Profile"),
                             () =>
                                 navigation.navigate("ViewProfileScreen", {
                                     item,
                                 })
                        )}
                        onPressHandle={() => onPressComment(item)}
                    />
                )}
                keyExtractor={(item) => item.commentId}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                style={{ marginBottom: 40, width: '100%' }}
            />
            <CreateComment
                onPress={() => {
                    if (comment != '') {
                        onCommentSend();
                    } else {
                        Alert.alert(
                        "Cannot submit an empty comment!",
                        "Fill in comment body to post."
                        );
                    }
                }}
                setComment={setComment}
                setIsFocused={setIsFocused}
                comment={comment}
            />
        </SafeAreaView>
    );
};

export default ForumPostScreen;

const styles = StyleSheet.create({
    container: {
        flex: 0,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 40,
    },
    headerComponentStyle: {
        marginVertical: 7,
    },
});