import * as firebase from "firebase";
import {
    Alert
} from 'react-native';

export const logoutUser = () => {
    firebase.auth().signOut();
};

export const signUpUser = async ({
    name,
    email,
    password
}) => {
    try {
        const user = await firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                //Once the user creation has happened successfully, we can add the currentUser into firestore
                //with the appropriate details.
                userCredential.user.sendEmailVerification();

                const currentUserId = firebase.auth().currentUser.uid;

                firebase.auth().currentUser.updateProfile({
                    displayName: name,
                });

                firebase
                    .firestore()
                    .collection("users")
                    .doc(currentUserId)
                    .set({
                        name: name,
                        email: email,
                        createdAt: firebase.firestore.Timestamp.fromDate(
                            new Date()
                        ),
                        userImg: null,
                        bio: "Introduce yourself!",
                    })
                    //ensure we catch any errors at this stage to advise us if something does go wrong
                    .catch((error) => {
                        console.log(
                            "Something went wrong with added user to firestore: ",
                            error
                        );
                    });
                firebase
                    .firestore()
                    .collection("users")
                    .doc(currentUserId)
                    .collection("following")
                    .doc(currentUserId)
                    .set({});
                firebase
                    .firestore()
                    .collection("users")
                    .doc(currentUserId)
                    .collection("following")
                    .doc("H0sH7GW3dyegouLw2cTEE1PoBBt1")
                    .set({});

            });

        alert("Email sent.\nPlease verify your account before signing in.");
        firebase.auth().signOut();

        return {
            user
        };
    } catch (error) {
        return {
            error: error.message,
        };
    }
};

export const loginUser = async ({
    email,
    password
}) => {
    try {
        const user = await firebase
            .auth()
            .signInWithEmailAndPassword(email, password);
        if (firebase.auth().currentUser.emailVerified) {
            return {
                user
            };
        } else {
            Alert.alert(
                "Email is not verified!",
                "Resend verification email?",
                [{
                        text: "Resend",
                        onPress: () => {
                            user.user.sendEmailVerification()
                        },
                    },
                    {
                        text: "Cancel",
                        onPress: () => console.log('cancel')
                    },
                ], {
                    cancelable: false
                }
            );
            firebase.auth().signOut()
            return {
                user
            };
        }

    } catch (error) {
        return {
            error: error.message,
        };
    }
};

export const sendEmailWithPassword = async (email) => {
    try {
        await firebase.auth().sendPasswordResetEmail(email);
        return {};
    } catch (error) {
        return {
            error: error.message,
        };
    }
};

export const deleteUser = () => {
    try {
        const currentUserId = firebase.auth().currentUser.uid;
        Alert.alert(
            "Are you sure?",
            "Deleting your account is permanent",
            [{
                    text: "Delete",
                    onPress: () => {
                        firebase
                            .firestore()
                            .collection("users")
                            .doc(currentUserId)
                            .delete();
                        firebase.auth().currentUser.delete();
                        Alert.alert("Success!", "Your account has been deleted.");
                    }
                },
                {
                    text: "Cancel",
                    onPress: () => console.log('cancel')
                }
            ], {
                cancelable: false
            }
        )
    } catch (error) {
        return {
            error: error.message,
        };
    }
}