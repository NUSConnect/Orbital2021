import React from "react";
import {
    StyleSheet,
    TextInput,
    View,
    Image,
    TouchableOpacity,
} from "react-native";

const SearchBar = ({search, setSearch, searchFilterFunction, resetFilter}) => {

    return (
        <View style={styles.searchBar}>
            <TextInput
                style={styles.textInputStyle}
                onChangeText={(text) => searchFilterFunction(text)}
                value={search}
                placeholder="Search Here"
            />
            {search !== "" ? (
                <TouchableOpacity
                    style={styles.closeButtonParent}
                    onPress={() => {
                        resetFilter();
                        setSearch("");
                    }}
                >
                    <Image
                        style={styles.closeButton}
                        source={require("../assets/close-circle-outline.png")}
                    />
                </TouchableOpacity>
            ) : null}
        </View>
    )
}

export default SearchBar;

const styles = StyleSheet.create({
    textInputStyle: {
        height: 40,
        paddingLeft: 20,
        flex: 1,
    },
    searchBar: {
        flexDirection: "row",
        margin: 5,
        borderColor: "#ff8c00",
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
    },
    closeButtonParent: {
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    closeButton: {
        height: 20,
        width: 20,
    },
});