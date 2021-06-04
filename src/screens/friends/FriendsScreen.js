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
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import FriendSearchScreen from "./FriendSearchScreen";
import CommentScreen from "../home/CommentScreen";
import ChatScreen from "../home/ChatScreen";
import ViewProfileScreen from "../profile/ViewProfileScreen";
import WaitingScreen from "./WaitingScreen";
import FindGroupScreen from './FindGroupScreen';

const Stack = createStackNavigator();
const TopTab = createMaterialTopTabNavigator();

function GroupStack() {
    return (
        <Stack.Navigator initialRouteName="FriendSearchScreen"
        screenOptions={{
            headerShown: false,
            }}>
            <Stack.Screen name="FindGroupScreen" component={FindGroupScreen} />
            <Stack.Screen name="WaitingScreen" component={WaitingScreen} />
        </Stack.Navigator>
    );
}

function FriendsTabs() {
    return (
        <TopTab.Navigator
            tabBarOptions={{
                pressColor: "#ffa500",
                pressOpacity: "ffa500",
                indicatorStyle: { backgroundColor: "#ff8c00" },
                labelStyle: { fontSize: 14 },
            }}
        >
            <TopTab.Screen
                name="Search"
                component={FriendSearchScreen}
            />
            <TopTab.Screen
                name="Find A Group"
                component={GroupStack}
            />
        </TopTab.Navigator>
    );
}

const FriendsScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <Stack.Navigator
                initialRouteName="FriendSearchScreen"
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen
                    name="Tabs"
                    component={FriendsTabs}
                />
                <Stack.Screen
                    name="ViewProfileScreen"
                    component={ViewProfileScreen}
                />
                <Stack.Screen name="ChatScreen" component={ChatScreen} />
                <Stack.Screen name="CommentScreen" component={CommentScreen} />
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

export default FriendsScreen;