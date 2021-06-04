import React from "react";
import { StyleSheet } from "react-native";
import Background from "../../components/Background";
import Button from "../../components/Button";
import * as Animatable from "react-native-animatable";
import * as firebase from "firebase";

export default function WaitingScreen({ navigation, route, goBack }) {
    const currentUserId = firebase.auth().currentUser.uid;
    var userCategory = route.params.userCategory;
    //console.log(userCategory);

    handleDelete = async () => {
        await firebase
              .firestore()
              .collection("categories")
              .doc(userCategory)
              .collection("people")
              .doc(currentUserId)
              .delete();
        navigation.goBack();
    }

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
            <Button style={styles.stop}
                color="#de1738"
                onPress={handleDelete}>
                Stop searching
            </Button>
        </Background>
    );
}

const styles = StyleSheet.create({
    find: {
        textAlign: "center",
        fontSize: 50,
    },
    stop: {
        marginTop: 120,
    },
});