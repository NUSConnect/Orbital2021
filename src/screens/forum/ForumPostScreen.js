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
import ForumPostHeader from "../../components/ForumPostHeader";
import ForumPost from "../../components/ForumPost";
import CommentItem from "../../components/CommentItem";
import CreateComment from '../../components/CreateComment';
import moment from "moment";

import * as firebase from "firebase";

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
                    />
                )}
                keyExtractor={(item) => item.id}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                style={{ marginBottom: 40 }}
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