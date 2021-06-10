import * as ImagePicker from "expo-image-picker";
import * as firebase from "firebase";
import React from "react";
import {
    ActivityIndicator,
    Alert,
    Animated,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";
import ActionButton from "react-native-action-button";
import Icon from "react-native-vector-icons/Ionicons";
import CancelButton from "../../components/CancelButton";
import SubmitButton from "../../components/SubmitButton";

// Action button fix
ActionButton.prototype.animateButton = function (animate = true) {
    if (this.state.active) return this.reset();

    if (animate) {
        Animated.spring(this.anim, {
            toValue: 1,
            useNativeDriver: false,
        }).start();
    } else {
        this.anim.setValue(1);
    }

    this.setState({ active: true, resetToken: this.state.resetToken });
};

ActionButton.prototype.reset = function (animate = true) {
    if (this.props.onReset) this.props.onReset();

    if (animate) {
        Animated.spring(this.anim, {
            toValue: 0,
            useNativeDriver: false,
        }).start();
    } else {
        this.anim.setValue(0);
    }

    setTimeout(() => {
        if (this.mounted) {
            this.setState({ active: false, resetToken: this.state.resetToken });
        }
    }, 250);
};

export default class AddPostScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            image: null,
            blob: null,
            uploading: false,
            transferred: 0,
            text: null,
        };
    }

    takePhotoFromCamera = async () => {
        let permissionResult = await ImagePicker.getCameraPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("Permission to access camera on device is required!");
            return;
        }

        let pickerResult = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
        });
        console.log(pickerResult);

        if (pickerResult.cancelled === true) {
            return;
        }

        this.setState({ image: pickerResult.uri });
        //    this.setState({ blob: pickerResult.base64 })
    };

    choosePhotoFromLibrary = async () => {
        let permissionResult =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }

        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
        });
        console.log(pickerResult);

        if (pickerResult.cancelled === true) {
            return;
        }

        this.setState({ image: pickerResult.uri });
        //    this.setState({ blob: pickerResult.uri.blob() })
    };

    submitPost = async (navigator) => {
        const imageUrl = await this.uploadImage();
        console.log("Image Url: ", imageUrl);
        console.log("Post: ", this.state.text);

        const postID = firebase.auth().currentUser.uid + Date.now();
        const userID = firebase.auth().currentUser.uid;

        firebase
            .firestore()
            .collection("posts")
            .doc(userID)
            .collection("userPosts")
            .doc(postID)
            .set({
                userId: userID,
                postId: postID,
                post: this.state.text,
                postImg: imageUrl,
                postTime: firebase.firestore.Timestamp.fromDate(new Date()),
                likeCount: 0,
                commentCount: 0,
            })
            .then(() => {
                console.log("Post Added!");
                Alert.alert(
                    "Post published!",
                    "Your post has been published successfully!",
                    [
                        {
                            text: "OK",
                            onPress: navigator,
                        },
                    ],
                    { cancelable: false }
                );
                this.setState({ text: null });
            })
            .catch((error) => {
                console.log(
                    "Something went wrong with added post to firestore.",
                    error
                );
            });
    };

    uploadImage = async () => {
        if (this.state.image == null) {
            return null;
        }
        const uploadUri = this.state.image;
        const response = await fetch(uploadUri);
        const blob = await response.blob();

        let filename = uploadUri.substring(uploadUri.lastIndexOf("/") + 1);

        // Add timestamp to File Name
        const extension = filename.split(".").pop();
        const name = filename.split(".").slice(0, -1).join(".");
        filename = name + Date.now() + "." + extension;

        this.setState({ uploading: true });
        this.setState({ transferred: 0 });

        const storageRef = firebase.storage().ref(`photos/${filename}`);
        const task = storageRef.put(blob);

        // Set transferred state
        task.on("state_changed", (taskSnapshot) => {
            console.log(
                `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`
            );

            this.setState({
                transferred:
                    Math.round(
                        taskSnapshot.bytesTransferred / taskSnapshot.totalBytes
                    ) * 100,
            });
        });

        try {
            await task;

            const url = await storageRef.getDownloadURL();

            this.setState({ uploading: false });
            this.setState({ image: null });
            this.setState({ blob: null });

            return url;
        } catch (e) {
            console.log(e);
            return null;
        }
    };

    render() {
        const { navigation } = this.props;
        return (
            <SafeAreaView>
                <View style={styles.container}>
                    <View style={styles.innerContainer}>
                        <Text style={styles.title}>Add a Post</Text>

                        {this.state.image != null ? (
                            <Image
                                style={styles.image}
                                source={{ uri: this.state.image }}
                                resizeMode="contain"
                            />
                        ) : null}

                        <TextInput
                            style={styles.input}
                            placeholder="What's on your mind?"
                            onChangeText={(text) => this.setState({ text })}
                            value={this.state.text}
                            multiline={true}
                        />

                        {this.state.uploading ? (
                            <View
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Text>
                                    {" "}
                                    {this.state.transferred} % completed!{" "}
                                </Text>
                                <ActivityIndicator
                                    size="large"
                                    color="0000ff"
                                />
                            </View>
                        ) : (
                            <View style={styles.buttons}>
                                <CancelButton
                                    goBack={() => navigation.goBack()}
                                />
                                <View style={styles.space} />
                                <SubmitButton
                                    goBack={() => {
                                        this.state.text != null
                                            ? this.submitPost(() =>
                                                  navigation.goBack()
                                              )
                                            : Alert.alert(
                                                  "Cannot submit an empty post!",
                                                  "Write something into the text box to post."
                                              );
                                    }}
                                    string={"Post"}
                                />
                            </View>
                        )}
                    </View>
                </View>
                <ActionButton buttonColor="#2e64e5" style={styles.actionButton}>
                    <ActionButton.Item
                        buttonColor="#9b59b6"
                        title="Take Photo"
                        onPress={this.takePhotoFromCamera}
                    >
                        <Icon
                            name="camera-outline"
                            style={styles.actionButtonIcon}
                        />
                    </ActionButton.Item>
                    <ActionButton.Item
                        buttonColor="#3498db"
                        title="Choose Photo"
                        onPress={this.choosePhotoFromLibrary}
                    >
                        <Icon
                            name="md-images-outline"
                            style={styles.actionButtonIcon}
                        />
                    </ActionButton.Item>
                </ActionButton>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 0,
        //    alignItems: 'center',
        //    justifyContent: 'center',
        flexDirection: "row",
    },
    innerContainer: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        height: 60,
        lineHeight: 60,
        width: "100%",
        backgroundColor: "#ff8c00",
        color: "#ffffff",
        fontSize: 30,
        paddingLeft: 15,
        marginBottom: 10,
    },
    image: {
        width: "100%",
        height: "50%",
        marginBottom: 15,
    },
    input: {
        flex: 0,
        height: 100,
        width: "90%",
        margin: 12,
        borderWidth: 1,
        fontSize: 18,
        paddingLeft: 10,
        justifyContent: "flex-start",
        alignItems: "flex-start",
    },
    buttons: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
    },
    space: {
        width: 20,
    },
    actionButton: {
        position: "absolute",
        bottom: -300,
        right: -10,
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: "white",
    },
});
