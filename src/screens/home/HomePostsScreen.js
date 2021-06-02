import React from "react";
import {
    Text,
    Image,
    View,
    FlatList,
    SafeAreaView,
    StyleSheet,
    StatusBar,
    RefreshControl,
    TouchableOpacity,
    Alert,
} from "react-native";
import AddPostScreen from "./AddPostScreen";
import CommentScreen from "./CommentScreen";
import ViewProfileScreen from "../profile/ViewProfileScreen";
import PostButton from "../../components/PostButton";
import HomeTopTab from "../../components/HomeTopTab";
import PostCard from "../../components/PostCard";
import GestureRecognizer, { swipeDirections } from "rn-swipe-gestures";

import * as firebase from "firebase";

export default class HomePostsScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUserId: firebase.auth().currentUser.uid,
            data: [],
            refreshing: true,
            deleted: false,
            myText: "Ready to get swiped!",
            gestureName: "none",
        };
    }

    onSwipeUp(gestureState) {
        this.setState({ myText: "You swiped up!" });
    }

    onSwipeDown(gestureState) {
        this.setState({ myText: "You swiped down!" });
    }

    onSwipeLeft(gestureState) {
        this.setState({ myText: "You swiped left!" });
    }

    onSwipeRight(gestureState) {
        this.setState({ myText: "You swiped right!" });
    }

    onSwipe(gestureName, gestureState) {
        const { SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;
        this.setState({ gestureName: gestureName });
        switch (gestureName) {
            case SWIPE_LEFT:
                this.props.navigation.navigate("MessagesScreen");
                console.log(this.state.myText);
                break;
            case SWIPE_RIGHT:
                break;
        }
    }

    componentDidMount() {
        this.fetchPosts();
    }

    fetchPosts = async () => {
        try {
            const following = [];
            await firebase
                .firestore()
                .collection("users")
                .doc(this.state.currentUserId)
                .collection("following")
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        following.push(doc.id);
                    });
                });

            console.log("Following: ", following);
            const list = [];
            this.setState({ refreshing: true });

            for (let i = 0; i < following.length; i++) {
                const followingId = following[i];

                await firebase
                    .firestore()
                    .collection("posts")
                    .doc(followingId)
                    .collection("userPosts")
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            const {
                                userId,
                                postId,
                                post,
                                postImg,
                                postTime,
                                likeCount,
                                commentCount,
                            } = doc.data();
                            list.push({
                                id: doc.id,
                                userId,
                                userName: "Test Name",
                                userImg:
                                    "https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg",
                                postId,
                                postTime: postTime,
                                post,
                                postImg,
                                likeCount,
                                commentCount,
                            });
                        });
                    });
            }

            list.sort(function (x, y) {
                return y.postTime - x.postTime;
            });
            this.setState({ data: list });

            if (this.state.refreshing) {
                this.setState({ refreshing: false });
            }

            console.log("Posts: ", this.state.data);
        } catch (e) {
            console.log(e);
        }
    };

    handleDelete = (postId) => {
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
                    onPress: () => this.deletePost(postId),
                },
            ],
            { cancelable: false }
        );
    };

    deletePost = (postId) => {
        console.log("Current Post Id: ", postId);

        firebase
            .firestore()
            .collection("posts")
            .doc(this.state.currentUserId)
            .collection("userPosts")
            .doc(postId)
            .get()
            .then((documentSnapshot) => {
                if (documentSnapshot.exists) {
                    const { postImg } = documentSnapshot.data();

                    if (postImg != null) {
                        const storageRef = firebase
                            .storage()
                            .refFromURL(postImg);
                        console.log("storageRef", storageRef.fullPath);
                        const imageRef = firebase
                            .storage()
                            .ref(storageRef.fullPath);

                        imageRef
                            .delete()
                            .then(() => {
                                console.log(
                                    `${postImg} has been deleted successfully.`
                                );
                                this.deleteFirestoreData(postId);
                            })
                            .catch((e) => {
                                console.log(
                                    "Error while deleting the image. ",
                                    e
                                );
                            });
                        // If the post image is not available
                    } else {
                        this.deleteFirestoreData(postId);
                    }
                }
            });
    };

    deleteFirestoreData = (postId) => {
        firebase
            .firestore()
            .collection("posts")
            .doc(this.state.currentUserId)
            .collection("userPosts")
            .doc(postId)
            .delete()
            .then(() => {
                Alert.alert(
                    "Post deleted!",
                    "Your post has been deleted successfully!"
                );
                this.setState({ deleted: true });
            })
            .catch((e) => console.log("Error deleting post.", e));
    };

    handleReport = (postId) => {
        Alert.alert(
            "Report Post",
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
                            "Post Reported!",
                            "This post has been reported successfully!"
                        ),
                },
            ],
            { cancelable: false }
        );
    };

    renderItemComponent = (data) => (
        <TouchableOpacity style={styles.container}>
            <Image style={styles.image} source={{ uri: data.item.url }} />
        </TouchableOpacity>
    );

    ItemSeparator = () => (
        <View
            style={{
                height: 2,
                backgroundColor: "rgba(0,0,0,0.5)",
                marginLeft: 10,
                marginRight: 10,
            }}
        />
    );

    handleRefresh = () => {
        this.setState({ refreshing: false }, () => {
            this.fetchPosts();
        });
    };

    navigateProfile = (creatorId, ownNavigation, otherNavigation) => {
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

    render() {
        const { navigation } = this.props;
        const config = {
            velocityThreshold: 0.3,
            directionalOffsetThreshold: 80,
            detectSwipeUp: false,
            detectSwipeDown: false,
        };
        return (
            <SafeAreaView>
                <HomeTopTab
                    onPress={() => navigation.navigate("MessagesScreen")}
                    onPress2={() => navigation.navigate("AddPostScreen")}
                />
                <FlatList
                    data={this.state.data}
                    renderItem={({ item }) => (
                        <PostCard
                            item={item}
                            onViewProfile={this.navigateProfile(
                                item.userId,
                                () => navigation.navigate("Profile"),
                                () =>
                                    navigation.navigate("ViewProfileScreen", {
                                        item,
                                    })
                            )}
                            onDelete={this.handleDelete}
                            onReport={this.handleReport}
                            onEdit={() => navigation.navigate("EditPostScreen", { item })}
                            onPress={() =>
                                navigation.navigate("CommentScreen", { item })
                            }
                        />
                    )}
                    keyExtractor={(item) => item.id}
                    ItemSeparatorComponent={this.ItemSeparator}
                    refreshing={this.state.refreshing}
                    onRefresh={this.handleRefresh}
                    style={{ marginBottom: 40 }}
                />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 300,
        margin: 10,
        backgroundColor: "#FFF",
        borderRadius: 6,
    },
    image: {
        height: "100%",
        borderRadius: 4,
    },
});