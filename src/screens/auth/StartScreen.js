import React from "react";
import Background from "../../components/Background";
import Logo from "../../components/Logo";
import Header from "../../components/Header";
import Button from "../../components/Button";
import Paragraph from "../../components/Paragraph";
import { StyleSheet } from "react-native";

export default function StartScreen({ navigation }) {
    return (
        <Background>
            <Logo />
            <Header>Portal.io</Header>
            <Paragraph>A new way to connect.</Paragraph>
            <Button
                style={styles.login}
                mode="contained"
                onPress={() => navigation.navigate("LoginScreen")}
            >
                Login
            </Button>
            <Button
                style={styles.signup}
                mode="contained"
                onPress={() => navigation.navigate("RegisterScreen")}
            >
                Sign Up
            </Button>
        </Background>
    );
}

const styles = StyleSheet.create({
    login: {
        backgroundColor: "#ff8c00",
    },
    signup: {
        backgroundColor: "#79D2E6",
    },
});