import * as React from "react";
import { Text, View } from "react-native";
import BackButton from "../../components/BackButton";

export default function UpdateEmailScreen({ navigation }) {
    return (
        <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
            <BackButton goBack={navigation.goBack} />
            <Text>Change password</Text>
        </View>
    );
}