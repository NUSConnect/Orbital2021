import * as firebase from "firebase";
import React, { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";
import ModalSelector from 'react-native-modal-selector';
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { sortByLatestForum, sortByTrendingForum } from '../../api/ranking';
import ForumPost from "../../components/ForumPost";
import SubForumHeader from "../../components/SubForumHeader";

const SubForumScreen = ({ navigation, route, onPress }) => {
    const currentUserId = firebase.auth().currentUser.uid;
    const [posts, setPosts] = useState([]);
    const [userLiked, setUserLiked] = useState(null);
    const [likeNumber, setLikeNumber] = useState(null);
    const [refreshing, setRefreshing] = useState(true);
    const [subscribed, setSubscribed] = useState(null);
    const [sortedBy, setSortedBy] = useState(null);

    const { item } = route.params;
    const forumId = item.id;
    const forumName = item.forumName;
    const sortingOptions = [{ key:0, section: true, label: 'Sort posts by:'}, { key: 1, label: 'Latest'}, { key: 2, label: 'Trending' }]

    const getUser = async () => {
        await firebase
            .firestore()
            .collection("users")
            .doc(currentUserId)
            .get()
            .then((documentSnapshot) => {
                if (documentSnapshot.data().preferredSorting != null) {
                    setSortedBy(documentSnapshot.data().preferredSorting);
                } else {
                    setSortedBy("Latest");
                }
            });
    };

    const getSubscribed = async () => {
        await firebase
            .firestore()
            .collection("users")
            .doc(currentUserId)
            .collection("subscribedForums")
            .doc(forumId)
            .onSnapshot((snapshot) => {
                if (snapshot.exists) {
                    setSubscribed(true);
                } else {
                    setSubscribed(false);
                }
            });
    };

    const subscribe = () => {
        if (subscribed) {
            firebase
                .firestore()
                .collection("users")
                .doc(currentUserId)
                .collection("subscribedForums")
                .doc(forumId)
                .delete();
            setSubscribed(false);
        } else {
            firebase
                .firestore()
                .collection("users")
                .doc(currentUserId)
                .collection("subscribedForums")
                .doc(forumId)
                .set({});
            setSubscribed(true);
        }
    };

    const fetchPosts = async () => {
        var sorter;
        await firebase
            .firestore()
            .collection("users")
            .doc(currentUserId)
            .get()
            .then((documentSnapshot) => {
                sorter = documentSnapshot.data().preferredSorting;
            });
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

        switch(sorter) {
            case "Latest":
                console.log('sort by latest')
                list.sort(sortByLatestForum);
                break;
            case "Trending":
                console.log('sort by trending')
                list.sort(sortByTrendingForum);
                break;
            default:
                console.log('default sort')
                list.sort(sortByLatestForum);
        }
        setPosts(list);
    };

    const handleEdit = (post) => {
        Alert.alert(
            "Edit post",
            "Are you sure?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed!"),
                    style: "cancel",
                },
                {
                    text: "Confirm",
                    onPress: () => navigation.navigate('EditForumPostScreen', { post, forumId, goBack: () => navigation.goBack() }),
                },
            ],
            { cancelable: false }
        );
    };

    const handleDelete = (post) => {
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
                    onPress: () => deletePost(post),
                },
            ],
            { cancelable: false }
        );
    };

    const deletePost = (post) => {
        console.log("Current Post Id: ", post.postId);

        firebase
            .firestore()
            .collection("forums")
            .doc(forumId)
            .collection("forumPosts")
            .doc(post.postId)
            .delete()
            .then(() => {
                Alert.alert(
                    "Post deleted",
                    "Your post has been deleted successfully!"
                );
                fetchPosts();
                setRefreshing(false);
            })
            .catch((e) => console.log("Error deleting post.", e));
    };

    const handleReport = (post) => {
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

    const changeSorting = async (sorter) => {
        setSortedBy(sorter);
        await firebase
            .firestore()
            .collection("users")
            .doc(currentUserId)
            .update({
                 preferredSorting: sorter,
             })
        fetchPosts();
        setRefreshing(false);
    }

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
        getSubscribed();
        fetchPosts();
        const _unsubscribe = navigation.addListener('focus', () => fetchPosts());

        return () => {
            _unsubscribe();
        }
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <SubForumHeader
                goBack={() => navigation.goBack()}
                onPress={() =>
                    navigation.navigate("ForumAddPostScreen", { forumId })
                }
                isSubscribed={subscribed}
                subscribe={subscribe}
                title={item.forumName}
            />
            <FlatList
                data={posts}
                ListHeaderComponent={
                     <View style={styles.sortBar}>
                        <MaterialCommunityIcons
                            name="sort"
                            color={'blue'}
                            size={26}
                        />
                        <Text style={styles.text}>
                            {'Sorted by: '}
                        </Text>
                        <ModalSelector
                            data={sortingOptions}
                            initValue={sortedBy}
                            onChange={(option) => changeSorting(option.label)}
                            animationType={'fade'}
                            backdropPressToClose={true}
                            overlayStyle={{ flex: 1, padding: '5%', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.9)' }}
                            sectionTextStyle={{ fontSize: 20 }}
                            cancelTextStyle={{ color: 'crimson', fontSize: 20 }}
                            cancelText={'Cancel'}
                            optionTextStyle={{ fontSize: 20 }}
                        >
                            <TextInput
                                style={styles.pickerText}
                                editable={false}
                                placeholder={sortedBy}
                                value={sortedBy}
                            />
                        </ModalSelector>
                     </View>
                }
                ListHeaderComponentStyle={styles.headerComponentStyle}
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
                        onPress={() => navigation.navigate("ForumPostScreen", { item, forumId, forumName })}
                        onEdit={() => handleEdit(item)}
                        onDelete={() => handleDelete(item)}
                        onReport={() => handleReport(item)}
                    />
                )}
                keyExtractor={(item) => item.postId}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                style={{ marginBottom: 10, width: '100%' }}
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

    },
    sortBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
    },
    text: {
        fontSize: 16,
    },
    pickerText: {
        fontSize: 16,
        color: 'blue',
        paddingLeft: 10,
        paddingRight: 10,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: 'gray',
    },
    headerComponentStyle: {
        marginVertical: 7,
    },
});