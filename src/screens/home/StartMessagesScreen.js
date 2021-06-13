import * as firebase from "firebase";
import React, { useEffect, useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";
import { Divider } from "react-native-paper";
import { FontAwesome5 } from "react-native-vector-icons";
import StartMessageTopTab from "../../components/StartMessageTopTab";
import {
    Card,
    TextSection,
    UserImg,
    UserImgWrapper,
    UserInfo,
    UserInfoText,
    UserName
} from "../../styles/MessageStyles";

export default function StartMessagesScreen({ navigation }) {
    const currentUserId = firebase.auth().currentUser.uid;
    var currentUserCreatedAt;
    const [threads, setThreads] = useState([]);
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [search, setSearch] = useState("");
    const [filtered, setFiltered] = useState(false);

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
                        const { name, bio, userImg } = doc.data();

                        const users = [currentUserId, doc.id];
                        const threadID = concatList(users);

//                        console.log("ThreadID: ", threadID);
                        friendsArr.push({
                            id: threadID,
                            otherId: doc.id,
                            name,
                            avatar: userImg,
                            users: users,
                            bio,
                        });
                    }
                });
            });
//        console.log(friendsArr);
        friendsArr.sort((x, y) => {
            if (x.name < y.name) { return -1; }
            if (x.name > y.name) { return 1; }
            return 0;
        });
        setThreads(friendsArr);
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
            <StartMessageTopTab onBack={() => navigation.goBack()} />
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
                ListHeaderComponent={
                    <Card
                        onPress={() => navigation.navigate("GroupCreationScreen", { threads })}
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
                                <UserImg source={{ uri: item.avatar }} />
                            </UserImgWrapper>
                            <TextSection>
                                <UserInfoText>
                                    <UserName>{item.name}</UserName>
                                </UserInfoText>
                                <Text style={styles.text}>{item.bio}</Text>
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
        fontSize: 14,
    }
});