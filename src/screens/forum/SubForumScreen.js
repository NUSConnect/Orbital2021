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
import SubForumHeader from "../../components/SubForumHeader";
import ForumPost from "../../components/ForumPost";
import moment from "moment";

import * as firebase from "firebase";

const SubForumScreen = ({ navigation, route, onPress }) => {
    const currentUserId = firebase.auth().currentUser.uid;
    const [posts, setPosts] = useState([]);
    const [userData, setUserData] = useState(null);
    const [userLiked, setUserLiked] = useState(null);
    const [likeNumber, setLikeNumber] = useState(null);
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

    const fetchPosts = async () => {
        const list = [];
        setRefreshing(true);

        await firebase
            .firestore()
            .collection("forums")
            .doc(item.id)
            .collection("forumPosts")
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const { postTitle, postBody, userId, postTime, votes, commentCount } = doc.data();
                    list.push({
                        forumId: item.id,
                        postId: doc.id,
                        postTitle,
                        postBody,
                        userId,
                        postTime: postTime,
                        votes,
                        commentCount,
                    });
                });
            });

        if (refreshing) {
            setRefreshing(false);
        }

        setPosts(list);
        console.log('Subforum Posts: ', posts)
    };

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
        fetchPosts();
        setRefreshing(false);
    };

    useEffect(() => {
        getUser();
        fetchPosts();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <SubForumHeader
                goBack={() => navigation.goBack()}
                onPress={() =>
                    navigation.navigate("ForumPostScreen", { forumId: item.id })
                }
                title={item.forumName}
            />
            <FlatList
                data={posts}
                renderItem={({ item }) => (
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
                )}
                keyExtractor={(item) => item.id}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                style={{ marginBottom: 40 }}
            />
        </SafeAreaView>
    );
};

export default SubForumScreen;

const styles = StyleSheet.create({
    container: {
        flex: 0,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 40,
    },
});