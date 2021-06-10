import * as ImagePicker from "expo-image-picker";
import * as firebase from 'firebase';
import React, { useState } from "react";
import {
    Alert, Image,
    StyleSheet, Text,


    TextInput,

    TouchableOpacity
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import GroupCreationTopTab from '../../components/GroupCreationTopTab';



export default function InitGroupChatScreen({ route, navigation}) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('https://firebasestorage.googleapis.com/v0/b/orbital2021-a4766.appspot.com/o/forum%2FWELCOME.png?alt=media&token=eb0f815b-0e18-4eca-b5a6-0cc170b0eb51');

    const { users } = route.params;

    const choosePhotoFromLibrary = async () => {
        let permissionResult =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }

        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
        });
        console.log(pickerResult);

        if (pickerResult.cancelled === true) {
            return;
        }

        setImage(pickerResult.uri);
    };

    const submitPost = async (goBack) => {
        Alert.alert(
            "Submit request for creation of forum",
            "Are you sure?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed!"),
                    style: "cancel",
                },
                {
                    text: "Confirm",
                    onPress: () => handleSubmit(goBack),
                },
            ],
            { cancelable: false }
        );
    };

    const concatList = (list) => {
        let str = "";
        list.sort()
        for (let i = 0; i < list.length; i++) {
            str = str + list[i].substring(0, 6)
        }
        return str;
    };

    const checkSubmit = () => {
        if (name != '' & description != '') {
            handleSubmit(() => navigation.navigate('MessagesScreen'))
        } else {
            Alert.alert(
                "Missing information",
                "Please fill in all text boxes."
            )
        }
    }

    const handleSubmit = async (navigator) => {
        const threadId = concatList(users);

        const imageUrl = await uploadImage(threadId);

        for (let i = 0; i < users.length; i++) {
            firebase
                .firestore()
                .collection('users')
                .doc(users[i])
                .collection('openChats')
                .doc(threadId)
                .set({})
        }

        const threadRef = await firebase.firestore().collection('THREADS').doc(threadId)

        threadRef
            .set({
                latestMessage: {
                    text: 'New group created',
                    createdAt: new Date().getTime(),
                },
                users: users,
                group: true,
                groupImage: imageUrl,
                groupName: name,
                groupDescription: description,
            }, { merge: true })
            .then(() => {
                Alert.alert(
                    "Group created!",
                    "The group has been created successfully!",
                    [
                        {
                            text: "OK",
                            onPress: navigator,
                        },
                    ],
                    { cancelable: false }
                );
            })
            .catch((error) => {
                console.log(
                    "Something went wrong with added post to firestore.",
                    error
                );
            });
    };

    const uploadImage = async (name) => {
        if (image == null) {
            return null;
        }
        const uploadUri = image;
        const response = await fetch(uploadUri);
        const blob = await response.blob();

        // Add timestamp to File Name
        let filename = name + ".jpg";

        const storageRef = firebase.storage().ref(`groups/${filename}`);
        const task = storageRef.put(blob);

        try {
            await task;

            const url = await storageRef.getDownloadURL();

            return url;
        } catch (e) {
            console.log(e);
            return null;
        }
    };

    return (
        <KeyboardAwareScrollView
            style={styles.container}
            resetScrollToCoords={{ x: 0, y: 0 }}
            scrollEnabled={true}
        >
            <GroupCreationTopTab
                text={'Create a group'}
                onBack={() => navigation.goBack()}
                onPress={() => checkSubmit()} />
            <Text style={styles.subTitle}>Group Image</Text>
            <TouchableOpacity style={styles.imageContainer} onPress={choosePhotoFromLibrary}>
                <Image
                    source={{
                        uri: image
                    }}
                    style={styles.image}
                />
            </TouchableOpacity>
            <Text style={styles.subTitle}>Group Name</Text>
            <TextInput
                style={styles.nameInput}
                returnKeyType="next"
                onChangeText={(name) => setName({ name })}
                value={name}
                placeholder="Enter a name"
            />
            <Text style={styles.subTitle}>Group Description</Text>
            <TextInput
                style={styles.descriptionInput}
                onChangeText={(description) => setDescription({ description })}
                value={description}
                placeholder="Enter a description"
                multiline={true}
            />
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
    },
    title: {
        height: 60,
        lineHeight: 60,
        width: "100%",
        backgroundColor: "#ff8c00",
        color: "#ffffff",
        fontSize: 30,
        paddingLeft: 15,
    },
    subTitle: {
        fontSize: 16,
        color: "#000000",
        paddingTop: 10,
        paddingLeft: 20,
    },
    nameInput: {
        flex: 0,
        height: 40,
        margin: 12,
        borderWidth: 1,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        paddingLeft: 10,
    },
    descriptionInput: {
        flex: 0,
        height: 100,
        margin: 12,
        borderWidth: 1,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        textAlignVertical: 'top',
        padding: 10,
    },
    imageContainer: {
        alignItems: 'center',
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: "black",
    },
});