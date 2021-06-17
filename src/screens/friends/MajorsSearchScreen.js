import * as firebase from "firebase";
import React, { useEffect, useState } from "react";
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    Image,
} from "react-native";

export default function MajorsSearchScreen({ props, navigation }) {
    const currentUserId = firebase.auth().currentUser.uid;
    const [search, setSearch] = useState("");
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtered, setFiltered] = useState(false);

    const majors = [
        { name: "Business Administration (Accountancy)" },
        { name: "Business Administration" },
        { name: "Data Science and Economics" },
        { name: "Food Science and Technology" },
        { name: "Humanities and Sciences" },
        { name: "Pharmaceutical Science" },
        { name: "Philosophy, Politics, Economics" },
        { name: "Business Analytics" },
        { name: "Computer Science" },
        { name: "Information Security" },
        { name: "Information Systems" },
        { name: "Computer Engineering" },
        { name: "Architecture" },
        { name: "Industrial Design" },
        { name: "Landscape Architecture" },
        { name: "Project and Facilities Management" },
        { name: "Real Estate" },
        { name: "Biomedical Engineering" },
        { name: "Chemical Engineering" },
        { name: "Civil Engineering" },
        { name: "Engineering Science" },
        { name: "Environmental Engineering" },
        { name: "Electrical Engineering" },
        { name: "Industrial and System Engineering" },
        { name: "Material Science and Engineering" },
        { name: "Mechanical Engineering" },
        { name: "Dentistry" },
        { name: "Law" },
        { name: "Medicine" },
        { name: "Nursing" },
        { name: "Pharmacy" },
        { name: "Music" },
    ];

    const searchFilterFunction = (text) => {
        if (text) {
            const newData = masterDataSource.filter(function (item) {
                const itemData = item.name
                    ? item.name.toUpperCase()
                    : "".toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setFiltered(true);
            setFilteredDataSource(newData);
            setSearch(text);
        } else {
            setFilteredDataSource(masterDataSource);
            setSearch(text);
        }
    };

    const ItemView = ({ item }) => {
        return (
            // Flat List Item
            <Text
                style={styles.itemStyle}
                onPress={() =>
                    navigation.navigate("FilteredMajorScreen", {
                        major: item.name,
                    })
                }
            >
                {item.name}
            </Text>
        );
    };

    const ItemSeparatorView = () => {
        return (
            // Flat List Item Separator
            <View
                style={{
                    height: 0.5,
                    width: "100%",
                    backgroundColor: "#C8C8C8",
                }}
            />
        );
    };

    useEffect(() => {
        setMasterDataSource(majors);
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
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
                                setFilteredDataSource(masterDataSource);
                                setSearch("");
                            }}
                        >
                            <Image
                                style={styles.closeButton}
                                source={require("../../assets/close-circle-outline.png")}
                            />
                        </TouchableOpacity>
                    ) : null}
                </View>
                <FlatList
                    data={filtered ? filteredDataSource : masterDataSource}
                    keyExtractor={(item, index) => index.toString()}
                    ItemSeparatorComponent={ItemSeparatorView}
                    renderItem={ItemView}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex: 1,
    },
    itemStyle: {
        padding: 10,
        fontSize: 20,
    },
    textInputStyle: {
        height: 40,
        borderWidth: 1,
        paddingLeft: 20,
        margin: 5,
        borderColor: "#ff8c00",
        backgroundColor: "#FFFFFF",
        flex: 1,
    },
    searchBar: {
        flexDirection: "row",
    },
    closeButtonParent: {
        justifyContent: "flex-end",
        alignItems: "flex-end",
        marginRight: 10,
    },
    closeButton: {
        height: 16,
        width: 16,
    },
});