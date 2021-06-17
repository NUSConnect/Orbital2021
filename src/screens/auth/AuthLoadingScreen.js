import firebase from "firebase/app";
import React from "react";
import { ActivityIndicator } from "react-native";
import Background from "../../components/Background";
import { theme } from "../../core/theme";

export default function AuthLoadingScreen({ navigation }) {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is logged in
            if (user.emailVerified) {
            // User is verified
                console.log('Verified')
                navigation.reset({
                    index: 0,
                    routes: [{ name: "Dashboard" }],
                });
            } else {
            // Force logout
                navigation.reset({
                    index: 0,
                    routes: [{ name: "StartScreen" }],
                });
                firebase.auth().signOut();
            }

        } else {
            // User is not logged in: reset stack & reset navigation to start page
            navigation.reset({
                index: 0,
                routes: [{ name: "StartScreen" }],
            });
        }
    });

    return (
        <Background>
            <ActivityIndicator size="large" color={theme.colors.primary} />
        </Background>
    );
}