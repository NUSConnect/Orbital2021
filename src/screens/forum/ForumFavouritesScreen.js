import React from "react";
import {
    StyleSheet,
    SafeAreaView,
    FlatList,
    View,
    Image,
    TouchableOpacity,
} from "react-native";
import ForumIcon from "../../components/ForumIcon";
import * as firebase from "firebase";

export default class ForumFavouritesScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            refreshing: true,
        };
    }

    componentDidMount() {
        this.fetchForums();
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
                <FlatList
                    numColumns={3}
                    data={this.state.data}
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
    container: {
        height: 300,
        margin: 10,
        backgroundColor: "#FFF",
        borderRadius: 6,
    },
    image: {
        height: "100%",
        borderRadius: 4,
    },
});