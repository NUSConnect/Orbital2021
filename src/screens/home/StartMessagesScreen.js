import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Text,
} from "react-native";
import { List, Divider } from "react-native-paper";
import { FontAwesome5 } from "react-native-vector-icons";
import StartMessageTopTab from "../../components/StartMessageTopTab";
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

export default function StartMessagesScreen({ navigation }) {
    const currentUserId = firebase.auth().currentUser.uid;
    var currentUserCreatedAt;
    const [threads, setThreads] = useState([]);

    useEffect(() => {
        getUsers();
        const _unsubscribe = navigation.addListener('focus', () => getUsers());

        return () => {
            _unsubscribe();
        }
    }, []);

    const concatList = (list) => {
        let str = "";
        list.sort()
        for (let i = 0; i < list.length; i++) {
            str = str + list[i].substring(0, 6)
        }
        return str;
    };

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

    const getUsers = async () => {
        // Get curr user info
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

        // Get thread info
        const friendsArr = [];
        await firebase
            .firestore()
            .collection("users")
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.id !== currentUserId) {
                        const { name, createdAt, userImg } = doc.data();

                        const users = [currentUserId, doc.id];
                        const threadID = concatList(users);

                        console.log("ThreadID: ", threadID);
                        friendsArr.push({
                            id: threadID,
                            name,
                            createdAt,
                            userImg,
                            users: users,
                        });
                    }
                });
            });
        console.log(friendsArr);
        setThreads(friendsArr);
    };

    return (
        <View style={styles.container}>
            <StartMessageTopTab onBack={() => navigation.goBack()} />
            <FlatList
                data={threads}
                keyExtractor={(item) => item.name}
                ItemSeparatorComponent={() => <Divider />}
                ListHeaderComponent={
                    <Card
                        onPress={() => alert('create group')}
                    >
                        <UserInfo>
                            <FontAwesome5
                                name='plus'
                                size={40}
                                color="#79D2E6"
                                style={{ paddingLeft: 24, paddingTop: 8, marginRight: 8, }}
                            />
                            <TextSection>
                                <UserInfoText>
                                    <UserName>{'Create a new group'}</UserName>
                                </UserInfoText>
                            </TextSection>
                        </UserInfo>
                    </Card>
                }
                ListHeaderComponentStyle={styles.headerComponentStyle}
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
                                </UserInfoText>
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
});