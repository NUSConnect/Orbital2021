import React from "react";
import {
    StyleSheet,
    SafeAreaView,
    FlatList,
    View,
    Image,
    TouchableOpacity,
    TextInput,
} from "react-native";
import ForumIcon from "../../components/ForumIcon";
import * as firebase from "firebase";

export default class ForumSearchScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            refreshing: true,
            search: '',
            filteredData: [],
            filtered: false,
        };
    }

    componentDidMount() {
        this.fetchForums();
        this._unsubscribe = this.props.navigation.addListener('focus', () => this.fetchForums());
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    fetchForums = async () => {
        this.setState({ refreshing: true });
        const list = [];

        await firebase
            .firestore()
            .collection("forums")
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const { forumName, forumImg } = doc.data();
                    list.push({
                        id: doc.id,
                        forumName,
                        forumImg,
                    });
                });
            });

        if (this.state.refreshing) {
            this.setState({ refreshing: false });
        }
        this.setState({ data: list });
        console.log(this.state.data);
    };

    searchFilterFunction = (text) => {
        if (text) {
            const newData = this.state.data.filter(function (item) {
                const itemData = item.forumName
                    ? item.forumName.toUpperCase()
                    : "".toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            this.setState({ filtered: true, filteredData: newData, search: text });
        } else {
            this.setState({ filteredData: this.state.data, search: text });
        }
    };

    ItemSeparator = () => (
        <View
            style={{
                height: 2,
                backgroundColor: "rgba(0,0,0,0.5)",
                marginLeft: 10,
                marginRight: 10,
            }}
        />
    );

    handleRefresh = () => {
        this.setState({ refreshing: false }, () => {
            this.fetchForums();
        });
    };

    render() {
        const { navigation } = this.props;
        return (
            <SafeAreaView>
                <TextInput
                    style={styles.textInputStyle}
                    onChangeText={(text) => this.searchFilterFunction(text)}
                    value={this.state.search}
                    placeholder="Search Here"
                />
                <FlatList
                    numColumns={3}
                    data={this.state.filtered ? this.state.filteredData : this.state.data}
                    renderItem={({ item }) => (
                        <ForumIcon
                            item={item}
                            onPress={() =>
                                navigation.navigate("SubForumScreen", { item })
                            }
                        />
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    ItemSeparatorComponent={this.ItemSeparator}
                    refreshing={this.state.refreshing}
                    onRefresh={this.handleRefresh}
                />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    textInputStyle: {
        height: 40,
        borderWidth: 1,
        paddingLeft: 20,
        margin: 5,
        borderColor: "#ff8c00",
        backgroundColor: "#FFFFFF",
    },
});