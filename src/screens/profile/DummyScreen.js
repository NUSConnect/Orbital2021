import * as React from "react";
import { Text, View } from "react-native";
import BackButton from "../../components/BackButton";

export default function DummyScreen({ navigation }) {
    return (
        <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
            <BackButton goBack={navigation.goBack} />
            <Text>Work In Progress</Text>
        </View>
    );
}