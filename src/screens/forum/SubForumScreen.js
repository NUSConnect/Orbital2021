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
            .collection("forum")
            .doc(item.id)
            .collection("posts")
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
    };

    useEffect(() => {
        getUser();
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