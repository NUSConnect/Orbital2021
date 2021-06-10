import React, { useState, useEffect } from "react";
import {
    Text,
    View,
    FlatList,
    SafeAreaView,
    StyleSheet,
    StatusBar,
    RefreshControl,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomePostsScreen from "./HomePostsScreen";
import AddPostScreen from "./AddPostScreen";
import EditPostScreen from "./EditPostScreen";
import CommentScreen from "./CommentScreen";
import EditCommentScreen from "./EditCommentScreen";
import ChatScreen from "./ChatScreen";
import MessagesScreen from "./MessagesScreen";
import StartMessagesScreen from "./StartMessagesScreen";
import GroupCreationScreen from "./GroupCreationScreen";
import InitGroupChatScreen from "./InitGroupChatScreen";
import ViewProfileScreen from "../profile/ViewProfileScreen";

const Stack = createStackNavigator();

const HomeScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <Stack.Navigator
                initialRouteName="HomePostsScreen"
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="HomePostsScreen" component={HomePostsScreen} />
                <Stack.Screen name="AddPostScreen" component={AddPostScreen} />
                <Stack.Screen name="EditPostScreen" component={EditPostScreen} />
                <Stack.Screen name="CommentScreen" component={CommentScreen} />
                <Stack.Screen name="EditCommentScreen" component={EditCommentScreen} />
                <Stack.Screen name="ViewProfileScreen" component={ViewProfileScreen} />
                <Stack.Screen name="ChatScreen" component={ChatScreen} />
                <Stack.Screen name="MessagesScreen" component={MessagesScreen} />
                <Stack.Screen name="StartMessagesScreen" component={StartMessagesScreen} />
                <Stack.Screen name="GroupCreationScreen" component={GroupCreationScreen} />
                <Stack.Screen name="InitGroupChatScreen" component={InitGroupChatScreen} />
            </Stack.Navigator>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
    },
    item: {
        backgroundColor: "#ffffff",
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 32,
        color: "#000000",
        borderWidth: 1,
        borderColor: "#000000",
    },
});

export default HomeScreen;