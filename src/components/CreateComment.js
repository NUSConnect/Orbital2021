import React from "react";
import { TextInput, View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "react-native-vector-icons";

const CreateComment = ({ onPress, setComment, comment, setIsFocused }) => {
    const textInputRef = React.useRef()

    return (
        <View style={styles.container}>
            <TextInput style={styles.textInput}
                ref={textInputRef}
                placeholder="Add a comment"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChangeText={setComment}
                maxLength={2000}
                autoCorrect={false}
                value={comment}
                multiline={true}
            />
            <TouchableOpacity
                onPress={() => {
                    textInputRef.current.blur()
                    onPress()
                }}
            >
                <Ionicons name='send' size={25} color={"#79D2E6"} />
            </TouchableOpacity>
        </View>
    );
}

export default CreateComment;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: "#ffffff",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
        paddingHorizontal: 5,
        elevation: 3,
        marginBottom: 40,
    },
    textInput: {
        flex: 1,
        margin: 5,
        height: 40,
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize:16,
    },
});