import * as firebase from "firebase";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import {
    Bubble,
    GiftedChat,
    Send,
    SystemMessage
} from "react-native-gifted-chat";
import { IconButton } from "react-native-paper";
import { Ionicons } from "react-native-vector-icons";
import { sendPushNotification } from '../../api/notifications';

export default function ChatScreen({ route, onPress, navigation }) {
    const [messages, setMessages] = useState([]);
    const { thread } = route.params;
    const currentUser = firebase.auth().currentUser.uid;
    const currentUserName = firebase.auth().currentUser.displayName;
    const [userImg, setUserImg] = useState(null);

    const getUser = async () => {
        await firebase
            .firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((documentSnapshot) => {
                if (documentSnapshot.exists) {
                    setUserImg(documentSnapshot.data().userImg)
                }
            });
    };

    const sendNotifications = async (text) => {
        const sender = thread.isGroup ? (thread.name + ' - ' + currentUserName) : currentUserName;

        if (thread.isGroup) {
            const users = thread.members;
            for (let i = 0; i < users.length; i++) {
                if (users[i] != firebase.currentUser) {
                    await firebase.firestore().collection('users').doc(users[i]).get()
                        .then((doc) => {
                            console.log('Checking if pushToken available');
                            if (doc.data().pushToken != null) {
                                sendPushNotification(doc.data().pushToken.data, sender, text)
                            }
                        })
                }
            }
        } else {
            const user = thread.otherId;

            await firebase.firestore().collection('users').doc(user).get()
                .then((doc) => {
                    console.log('Checking if pushToken available');
                    if (doc.data().pushToken != null) {
                        sendPushNotification(doc.data().pushToken.data, sender, text)
                    }
                })
        }
    };

    const haveNewMessage = () => {
        const lastSent = new Date().getTime();
            firebase
                .firestore()
                .collection("users")
                .doc(currentUser)
                .collection("openChats")
                .get()
                .then(querySnapshot => {
                    const threadsList = [];
                    querySnapshot.forEach(documentSnapshot => threadsList.push(documentSnapshot.id) );
                    //console.log(threadsList);
                    threadsList.forEach(threadId => {
                        firebase
                            .firestore()
                            .collection("THREADS")
                            .doc(threadId)
                            .get()
                            .then(documentSnapshot => {
                                const latestMessageTime = documentSnapshot.data().latestMessage.createdAt;
                                console.log(latestMessageTime);
                                console.log(lastSent);
                                if (latestMessageTime > lastSent && currentUser !== thread.otherId) {
                                    //new message came in after last time message screen was opened
                                    firebase
                                        .firestore()
                                        .collection("users")
                                        .doc(thread.otherId)
                                        .update({ haveNewMessage:true });
                                }
                            });
                    });
                    //finished checking all openChats, no new messages came in
                    firebase
                        .firestore()
                        .collection("users")
                        .doc(thread.otherId)
                        .update({ haveNewMessage:false });
                })
    }

    async function handleSend(messages) {
        const text = messages[0].text;
        const threadRef = await firebase.firestore().collection('THREADS').doc(thread.id)

        const doc = await threadRef.get();
        if (doc.exists) {
            threadRef
                .collection("MESSAGES")
                .add({
                    text,
                    createdAt: new Date().getTime(),
                    user: {
                        _id: currentUser,
                        avatar: userImg,
                    },
                });

            haveNewMessage();

            threadRef
                .set(
                    {
                        latestMessage: {
                            text,
                            createdAt: new Date().getTime(),
                        },
                    },
                    { merge: true }
                );

            sendNotifications(text);

        } else {
            handleFirstSend(messages);
        }
    }

    async function handleFirstSend(messages) {
        const text = messages[0].text;
        const threadRef = await firebase.firestore().collection('THREADS').doc(thread.id)
        threadRef
            .collection("MESSAGES")
            .add({
                text,
                createdAt: new Date().getTime(),
                user: {
                    _id: currentUser,
                    avatar: userImg,
                },
            });

        threadRef
            .set(
                {
                    latestMessage: {
                        text,
                        createdAt: new Date().getTime(),
                    },
                    users: thread.users
                },
                { merge: true }
            );

        const users = thread.isGroup ? thread.members : [currentUser, thread.otherId];

        for (let i = 0; i < users.length; i++) {
            firebase
                .firestore()
                .collection('users')
                .doc(users[i])
                .collection('openChats')
                .doc(thread.id)
                .set({})
        }

        sendNotifications(text);
    }

    useEffect(() => {
        getUser();
        const messagesListener = firebase
            .firestore()
            .collection("THREADS")
            .doc(thread.id)
            .collection("MESSAGES")
            .orderBy("createdAt", "desc")
            .onSnapshot((querySnapshot) => {
                const messages = querySnapshot.docs.map((doc) => {
                    const firebaseData = doc.data();

                    const data = {
                        _id: doc.id,
                        text: "",
                        createdAt: new Date().getTime(),
                        avatar: userImg,
                        ...firebaseData,
                    };

                    if (!firebaseData.system) {
                        data.user = {
                            ...firebaseData.user,
                        };
                    }

                    return data;
                });

                setMessages(messages);
            });

        // Stop listening for updates whenever the component unmounts
        return () => messagesListener();
    }, []);

    function renderBubble(props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: "#ff8c00",
                    },
                    left: {
                        backgroundColor: "#ffffff",
                    },
                }}
                textStyle={{
                    right: {
                        color: "#fff",
                    },
                }}
            />
        );
    }

    function renderLoading() {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ff8c00" />
            </View>
        );
    }

    function renderSend(props) {
        return (
            <Send {...props}>
                <View style={styles.sendingContainer}>
                    <IconButton icon="send-circle" size={35} color="#ff8c00" />
                </View>
            </Send>
        );
    }

    function scrollToBottomComponent() {
        return (
            <View style={styles.bottomComponentContainer}>
                <IconButton
                    icon="chevron-double-down"
                    size={36}
                    color="#ff8c00"
                />
            </View>
        );
    }

    function renderSystemMessage(props) {
        return (
            <SystemMessage
                {...props}
                wrapperStyle={styles.systemMessageWrapper}
                textStyle={styles.systemMessageText}
            />
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.4}
                    onPress={() => navigation.goBack(null)}
                >
                    <Ionicons
                        name="arrow-back"
                        color="#79D2E6"
                        size={38}
                        style={styles.icon}
                    />
                </TouchableOpacity>
                <Text
                    style={styles.text}
                    onPress={() => thread.isGroup
                                ?  navigation.navigate('GroupInfoScreen', { item: thread })
                                :  navigation.navigate('ViewProfileScreen', { item: { userId: thread.otherId }})}
                >
                    {thread.name}
                </Text>
            </View>
            <GiftedChat
                messages={messages}
                onSend={handleSend}
                user={{ _id: firebase.auth().currentUser.uid }}
                placeholder="Type your message here..."
                alwaysShowSend
                showUserAvatar={true}
                showAvatarForEveryMessage={true}
                scrollToBottom
                renderBubble={renderBubble}
                renderLoading={renderLoading}
                renderSend={renderSend}
                scrollToBottomComponent={scrollToBottomComponent}
                renderSystemMessage={renderSystemMessage}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    sendingContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    bottomComponentContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    systemMessageWrapper: {
        backgroundColor: "#6646ee",
        borderRadius: 4,
        padding: 5,
    },
    systemMessageText: {
        fontSize: 14,
        color: "#fff",
        fontWeight: "bold",
    },
    container: {
        height: 60,
        flexDirection: "row",
        backgroundColor: "#ffffff",
        borderColor: "#dcdcdc",
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        flex: 1,
        width: "85%",
        color: "#ff7f50",
        fontSize: 24,
        paddingRight: 64,
        textAlign: "center",
        paddingLeft: 0,
    },
    icon: {},
    button: {
        width: "15%",
        paddingLeft: 12,
    },
});