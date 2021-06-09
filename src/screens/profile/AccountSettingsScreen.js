import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import BackButton from "../../components/BackButton";
import Background from "../../components/Background";
import Button from "../../components/Button";
import { logoutUser, deleteUser } from "../../api/auth";

export default function AccountSettingsScreen({ navigation }) {
    return (
        <Background style={styles.bg}>
            <BackButton goBack={navigation.goBack} />
            <View style={styles.buttonwrap}>
                <Button
                    style={styles.button}
                    title="update"
                    onPress={() => navigation.navigate("UpdateEmailScreen")}
                >
                    {" "}
                    Update Email Address{" "}
                </Button>
                <Button
                    style={styles.button}
                    onPress={() => navigation.navigate("ChangeNameScreen")}
                >
                    {" "}
                    Change your name
                </Button>
                <Button
                    style={styles.button}
                    onPress={() => navigation.navigate("ChangePasswordScreen")}
                >
                    {" "}
                    Change Password{" "}
                </Button>
                <Button
                    style={styles.button}
                    onPress={() => navigation.navigate("DummyScreen")}
                >
                    {" "}
                    Manage Blocked Accounts{" "}
                </Button>
                <Button
                    style={styles.button}
                    onPress={() => navigation.navigate("DummyScreen")}
                >
                    {" "}
                    Privacy Settings{" "}
                </Button>
                <Button
                    style={styles.button}
                    color="#de1738"
                    onPress={deleteUser}
                >
                    {" "}
                    Delete account{" "}
                </Button>
                <Button
                    style={styles.button}
                    color="#de1738"
                    onPress={logoutUser}
                >
                    {" "}
                    Logout{" "}
                </Button>
            </View>
        </Background>
    );
}

const styles = {
    button: {
        backgroundColor: "#FFFFFF",
    },
    buttonwrap: {
        backgroundColor: "#FFFFFF",
        height: 500,
        alignItems: "center",
    },
};