import * as firebase from "firebase";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
    FlatList, StyleSheet,


    Text,
    TextInput, View
} from "react-native";
import { Divider } from "react-native-paper";
import MessageTopTab from "../../components/MessageTopTab";
import {
    Card,





    PostTime,

    TextSection, UserImg, UserImgWrapper, UserInfo,


    UserInfoText,
    UserName
} from "../../styles/MessageStyles";

export default function MessagesScreen({ navigation }) {
    const currentUserId = firebase.auth().currentUser.uid;
    var currentUserCreatedAt;
    const [threads, setThreads] = useState([]);
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [search, setSearch] = useState("");
    const [filtered, setFiltered] = useState(false);

    useEffect(() => {
        getThreads();
        const _unsubscribe = navigation.addListener('focus', () => getThreads());

        return () => {
            _unsubscribe();
        }
    }, []);

    const getUserInfo = async () => {
        await firebase
            .firestore()
            .collection("users")
            .doc(currentUserId)
            .get()
            .then((documentSnapshot) => {
                if (documentSnapshot.exists) {
                    const { createdAt } = documentSnapshot.data();
                    currentUserCreatedAt = createdAt;
                }
            });
    };

    const matchUserToThreads = async (threads) => {
        for (let k = 0; k < threads.length; k++) {
            const threadId = threads[k].id

            var users;
            var isGroup;
            await firebase.firestore().collection("THREADS").doc(threadId).get()
                .then((doc) => {
                    users = doc.data().users
                    threads[k].latest = doc.data().latestMessage.createdAt
                    threads[k].message = doc.data().latestMessage.text
                    isGroup = doc.data().group
                });

            if (isGroup) {
                await firebase.firestore().collection("THREADS").doc(threadId).get()
                    .then((doc) => {
                        threads[k].name = doc.data().groupName.name;
                        threads[k].avatar = doc.data().groupImage;
                        threads[k].description = doc.data().groupDescription.description;
                        threads[k].members = doc.data().users;
                        threads[k].isGroup = true;
                    })
            } else {
                for (let i = 0; i < users.length; i++) {
                    if (users[i] != currentUserId) {
                        await firebase
                            .firestore()
                            .collection("users")
                            .doc(users[i])
                            .get()
                            .then((doc) => {
                                if (doc.exists) {
                                    threads[k].name = doc.data().name;
                                    threads[k].avatar = doc.data().userImg;
                                    threads[k].otherId = users[i]
                                } else {
                                    threads[k].name = "anon";
                                    threads[k].avatar = null;
                                }
                            });
                    }
                }
            }
        }
        threads.sort((x, y) => {
            return y.latest - x.latest
        })
        setThreads(threads);
//        console.log("Threads: ", threads);
    };

    const getThreads = async () => {
        // Get open threads
        const openThreads = [];
        await firebase
            .firestore()
            .collection("users")
            .doc(currentUserId)
            .collection("openChats")
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    openThreads.push({ id: doc.id });
                });
            });

        matchUserToThreads(openThreads);
    };

    const searchFilterFunction = (text) => {
        if (text) {
            const newData = threads.filter(function (item) {
                const itemData = item.name
                    ? item.name.toUpperCase()
                    : "".toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setFiltered(true);
            setFilteredDataSource(newData);
            setSearch(text);
        } else {
            setFilteredDataSource(threads);
            setSearch(text);
        }
    };

    return (
        <View style={styles.container}>
            <MessageTopTab onBack={() => navigation.goBack()} onPress={() => navigation.navigate('StartMessagesScreen')} />
            <TextInput
                style={styles.textInputStyle}
                onChangeText={(text) => searchFilterFunction(text)}
                value={search}
                placeholder="Search Here"
            />
            <FlatList
                data={filtered ? filteredDataSource : threads}
                keyExtractor={(item) => item.name}
                ItemSeparatorComponent={() => <Divider />}
                renderItem={({ item }) => (
                    <Card
                        onPress={() =>
                            navigation.navigate("ChatScreen", { thread: item })
                        }
                    >
                        <UserInfo>
                            <UserImgWrapper>
                                <UserImg source={{ uri: item.avatar }} />
                            </UserImgWrapper>
                            <TextSection>
                                <UserInfoText>
                                    <UserName>{item.name}</UserName>
                                    <PostTime>
                                        {moment(item.latest).fromNow()}
                                    </PostTime>
                                </UserInfoText>
                                <Text style={styles.text}>{item.message}</Text>
                            </TextSection>
                        </UserInfo>
                    </Card>
                )}
                style={{ marginBottom: 40, }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ffffff",
        flex: 1,
    },
    textInputStyle: {
        height: 40,
        borderWidth: 1,
        paddingLeft: 20,
        margin: 5,
        borderColor: "#ff8c00",
        backgroundColor: "#FFFFFF",
    },
    listTitle: {
        fontSize: 22,
    },
    listDescription: {
        fontSize: 16,
    },
    header: {
        fontSize: 35,
        textAlign: "right",
        backgroundColor: "#ff8c00",
        padding: 10,
        color: "#ffffff",
    },
    text: {
        color: 'black',
        fontSize: 16,
    }
});