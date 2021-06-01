import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TextInput,
    SafeAreaView,
    FlatList,
    Button,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import TitleWithBack from "../../components/TitleWithBack";
import HomePostsScreen from "./HomePostsScreen";
import moment from "moment";

import {
    UserInfo,
    UserImg,
    UserName,
    UserInfoText,
    PostTime,
    PostImg,
    Divider,
} from "../../styles/FeedStyles";

import * as firebase from "firebase";

const MainPostScreen = ({ navigation, route, onPress }) => {
    const currentUserId = firebase.auth().currentUser.uid;
    const [userData, setUserData] = useState(null);
    const [userLiked, setUserLiked] = useState(null);
    const [likeNumber, setLikeNumber] = useState(null);

    const { item } = route.params;

    if (item.comments == 1) {
        commentText = "1 Comment";
    } else if (item.comments > 1) {
        commentText = item.comments + " Comments";
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
                    console.log("User Data", documentSnapshot.data());
                    setUserData(documentSnapshot.data());
                }
            });
    };

    const checkLiked = async () => {
        await firebase
            .firestore()
            .collection("posts")
            .doc(item.postId)
            .collection("likes")
            .doc(currentUserId)
            .onSnapshot((snapshot) => {
                if (snapshot.exists) {
                    setUserLiked(true);
                } else {
                    setUserLiked(false);
                }
            });
    };

    const likePost = async () => {
        console.log("Post ID: " + item.postId);
        if (userLiked) {
            item.likeCount = item.likeCount - 1;
            firebase
                .firestore()
                .collection("posts")
                .doc(item.postId)
                .collection("likes")
                .doc(currentUserId)
                .delete();
            firebase
                .firestore()
                .collection("posts")
                .doc(item.postId)
                .update({ likeCount: item.likeCount });
            console.log("Dislike");
            setLikeNumber(item.likeCount);
            setUserLiked(false);
        } else {
            item.likeCount = item.likeCount + 1;
            firebase
                .firestore()
                .collection("posts")
                .doc(item.postId)
                .collection("likes")
                .doc(currentUserId)
                .set({});
            firebase
                .firestore()
                .collection("posts")
                .doc(item.postId)
                .update({ likeCount: item.likeCount });
            console.log("Like");
            setLikeNumber(item.likeCount);
            setUserLiked(true);
        }
    };

    useEffect(() => {
        getUser();
        checkLiked();
        setLikeNumber(item.likeCount);
    }, []);

    return (
        <SafeAreaView>
            <View style={styles.container}>
                <TitleWithBack
                    onPress={() => navigation.navigate("HomePostsScreen")}
                />

                <View style={styles.postInfo}>
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
                    <Text style={styles.postText}>{item.post}</Text>
                    {item.postImg != null ? (
                        <Image
                            source={{ uri: item.postImg }}
                            style={styles.image}
                            resizeMode="contain"
                        />
                    ) : (
                        <Divider />
                    )}

                    <TouchableOpacity
                        active={userLiked}
                        onPress={likePost}
                        style={styles.like}
                    >
                        <Ionicons
                            name={userLiked ? "heart" : "heart-outline"}
                            size={40}
                            color={userLiked ? "#dc143c" : "#333"}
                        />
                        <Text style={styles.likeText} active={userLiked}>
                            {likeNumber === 0
                                ? "Like"
                                : likeNumber === 1
                                ? "1 Like"
                                : "Likes"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default MainPostScreen;

const styles = StyleSheet.create({
    container: {
        flex: 0,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    postInfo: {
        width: "100%",
    },
    postText: {
        width: "100%",
        margin: 12,
        fontSize: 16,
    },
    image: {
        width: "100%",
        aspectRatio: 1,
    },
    like: {
        paddingLeft: 10,
        flexDirection: "row",
        alignItems: "center",
    },
    likeText: {
        fontSize: 16,
        paddingLeft: 10,
    },
});