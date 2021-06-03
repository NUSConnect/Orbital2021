import * as React from "react";
import { Text, View, Dimensions, StyleSheet } from "react-native";

const DeviceWidth = Dimensions.get('window').width;
const squareSide = 0.4 * DeviceWidth;

export default function FindGroupScreen({ navigation }) {

    return (
        <View style={styles.center}>
            <View style={{
              flexDirection: 'row',
              backgroundColor: "grey"}}>
              <View>
                <View style={styles.squareLeft} />
                <View style={styles.squareRight} />
              </View>
              <View>
                <View style={styles.squareLeft} />
                <View style={styles.squareRight} />
              </View>
            </View>
          </View>
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    squareLeft: {
        width: squareSide,
        height: squareSide,
        marginBottom:1,
        backgroundColor: 'powderblue',
    },
    squareRight: {
        width: squareSide,
        height: squareSide,
        marginBottom:1,
        marginLeft: 1,
        backgroundColor: 'skyblue',
    },
});