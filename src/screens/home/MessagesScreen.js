import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Text,
    TextInput
} from "react-native";
import { List, Divider } from "react-native-paper";
import moment from "moment";
import MessageTopTab from "../../components/MessageTopTab";
import * as firebase from "firebase";
import {
    Card,
    UserInfo,
    UserImgWrapper,
    UserImg,
    UserInfoText,
    UserName,
    PostTime,
    MessageText,
    TextSection,
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
            await firebase.firestore().collection("THREADS").doc(threadId).get()
                .then((doc) => {
                    users = doc.data().users
                    threads[k].latest = doc.data().latestMessage.createdAt
                    threads[k].message = doc.data().latestMessage.text
                });

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
                                threads[k].userImg = doc.data().userImg;
                            } else {
                                threads[k].name = "anon";
                                threads[k].userImg = null;
                            }
                        });
                }
            }
        }
        threads.sort((x, y) => {
            return y.latest - x.latest
        })
        setThreads(threads);
        console.log("Threads: ", threads);
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
                                <UserImg source={{ uri: item.userImg }} />
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