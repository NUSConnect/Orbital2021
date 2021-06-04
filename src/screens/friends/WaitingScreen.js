import React from "react";
import { StyleSheet } from "react-native";
import Background from "../../components/Background";
import * as Animatable from "react-native-animatable";

export default function WaitingScreen({ navigation }) {
    return (
        <Background>
            <Animatable.Text
                animation="tada"
                easing="ease-out"
                iterationCount="infinite"
                style={styles.find}
            >
                Finding you a group...️
            </Animatable.Text>
        </Background>
    );
}

const styles = StyleSheet.create({
    find: {
        textAlign:"center",
        fontSize:50,
    },
});
