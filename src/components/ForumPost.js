import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Ionicons, MaterialIcons } from "react-native-vector-icons";

import ProgressiveImage from "./ProgressiveImage";

import moment from "moment";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as firebase from "firebase";

const ForumPost = ({
    route,
    item,
    onDelete,
    onPress,
    onReport,
    onEdit,
}) => {
    const currentUserId = firebase.auth().currentUser.uid;
    const [userData, setUserData] = useState(null);
    const [upvoted, setUpvoted] = useState(null);
    const [downvoted, setDownvoted] = useState(null);
    const [votes, setVotes] = useState(null);

    var commentText;

    if (item.commentCount == 1) {
        commentText = "1 Comment";
    } else if (item.commentCount > 1) {
        commentText = item.commentCount + " Comments";
    } else {
        commentText = "Comment";
    }

    const getUser = async () => {
        await firebase
            .firestore()
            .collection("users")
            .doc(item.userId)
            .get()
            .then((documentSnapshot) => {
                if (documentSnapshot.exists) {
                    setUserData(documentSnapshot.data());
                }
            });
    };

    const checkVoted = async () => {
        await firebase
            .firestore()
            .collection("forums")
            .doc(item.forumId)
            .collection("forumPosts")
            .doc(item.postId)
            .collection("votes")
            .doc(currentUserId)
            .onSnapshot((snapshot) => {
                if (snapshot.exists) {
                    const { voted } = snapshot.data();
                    if (voted == 1) {
                        setUpvoted(true);
                        setDownvoted(false);
                    } else {
                        setUpvoted(false);
                        setDownvoted(true);
                    }

                } else {
                    setUpvoted(false);
                    setDownvoted(false);
                }
            });
    };

    const upVote = async () => {
        if (downvoted) {
            item.votes = item.votes + 2;
        } else {
            item.votes = item.votes + 1;
        }
        firebase
            .firestore()
            .collection("forums")
            .doc(item.forumId)
            .collection("forumPosts")
            .doc(item.postId)
            .collection("votes")
            .doc(currentUserId)
            .set({ voted: 1 });
        firebase
            .firestore()
            .collection("forums")
            .doc(item.forumId)
            .collection("forumPosts")
            .doc(item.postId)
            .update({ votes: item.votes });
        setVotes(item.votes);
        setUpvoted(true);
        setDownvoted(false);
    };

    const downVote = async () => {
        if (upvoted) {
            item.votes = item.votes - 2;
        } else {
            item.votes = item.votes - 1;
        }
        firebase
            .firestore()
            .collection("forums")
            .doc(item.forumId)
            .collection("forumPosts")
            .doc(item.postId)
            .collection("votes")
            .doc(currentUserId)
            .set({ voted: -1 });
        firebase
            .firestore()
            .collection("forums")
            .doc(item.forumId)
            .collection("forumPosts")
            .doc(item.postId)
            .update({ votes: item.votes });
        setVotes(item.votes);
        setUpvoted(false);
        setDownvoted(true);
    };

    const unVote = async () => {
        if (upvoted) {
            item.votes = item.votes - 1;
        } else {
            item.votes = item.votes + 1;
        }
        firebase
            .firestore()
            .collection("forums")
            .doc(item.forumId)
            .collection("forumPosts")
            .doc(item.postId)
            .collection("votes")
            .doc(currentUserId)
            .delete();
        firebase
            .firestore()
            .collection("forums")
            .doc(item.forumId)
            .collection("forumPosts")
            .doc(item.postId)
            .update({ votes: item.votes });
        setVotes(item.votes);
        setUpvoted(false);
        setDownvoted(false);
    };

    useEffect(() => {
        getUser();
        checkVoted();
        setVotes(item.votes);
    }, []);

    return (
        <Card key={item.id}>
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() => onViewProfile(currentUserId)}
                    style={styles.user}
                >
                    <UserInfo>
                        <UserImg
                            source={{
                                uri: userData
                                    ? userData.userImg ||
                                      "https://firebasestorage.googleapis.com/v0/b/orbital2021-a4766.appspot.com/o/profile%2Fplaceholder.png?alt=media&token=8050b8f8-493f-4e12-8fe3-6f44bb544460"
                                    : "https://firebasestorage.googleapis.com/v0/b/orbital2021-a4766.appspot.com/o/profile%2Fplaceholder.png?alt=media&token=8050b8f8-493f-4e12-8fe3-6f44bb544460",
                            }}
                        />
                        <UserInfoText>
                            <UserName>
                                {userData
                                    ? userData.name || "Anonymous User"
                                    : "Anonymous User"}
                            </UserName>
                            <PostTime>
                                {moment(item.postTime.toDate()).fromNow()}
                            </PostTime>
                        </UserInfoText>
                    </UserInfo>
                </TouchableOpacity>
                {currentUserId == item.userId ? (
                    <TouchableOpacity
                        style={styles.button}
                        activeOpacity={0.4}
                        onPress={onEdit}
                    >
                        <MaterialIcons name="edit" size={25} />
                    </TouchableOpacity>
                ) : null}
            </View>
            <PostText>{item.post}</PostText>
            {item.postImg != null ? (
                <ProgressiveImage
                    defaultImageSource={require("../assets/default-img.jpg")}
                    source={{ uri: item.postImg }}
                    style={{ width: "100%", height: 350 }}
                    resizeMode="contain"
                />
            ) : (
                <Divider />
            )}

            <InteractionWrapper>
                <Interaction onPress={likePost}>
                    <Ionicons
                        name={userLiked ? "heart" : "heart-outline"}
                        size={25}
                        color={userLiked ? "#dc143c" : "#333"}
                    />
                    <InteractionText>
                        {likeNumber === 0
                            ? "Like"
                            : likeNumber === 1
                            ? "1 Like"
                            : likeNumber + " Likes"}
                    </InteractionText>
                </Interaction>
                <Interaction onPress={onPress}>
                    <Ionicons name="md-chatbubble-outline" size={25} />
                    <InteractionText>{commentText}</InteractionText>
                </Interaction>
                {currentUserId == item.userId ? (
                    <Interaction onPress={() => onDelete(item.id)}>
                        <Ionicons name="md-trash-bin" size={25} />
                    </Interaction>
                ) : (
                    <Interaction onPress={() => onReport(item.id)}>
                        <MaterialIcons name="report-problem" size={25} />
                    </Interaction>
                )}
            </InteractionWrapper>
        </Card>
    );
};

export default PostCard;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
    },
    user: {
        width: 360,
    },
    button: {},
});
