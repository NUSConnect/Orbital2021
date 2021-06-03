import * as React from "react";
import { Text, View, SafeAreaView, StyleSheet, StatusBar } from "react-native";
import SearchBar from "../../components/SearchBar";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import {
    ForumFavouritesScreen,
    ForumSubscribedScreen,
    ForumOthersScreen,
    ForumCreationScreen,
    SubForumScreen,
    ForumPostScreen,
} from "./";
import ViewProfileScreen from "../profile/ViewProfileScreen";

const Stack = createStackNavigator();
const TopTab = createMaterialTopTabNavigator();

function ForumTabs() {
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
                name="Favourites"
                component={ForumFavouritesScreen}
            />
            <TopTab.Screen
                name="Subscribed"
                component={ForumSubscribedScreen}
            />
            <TopTab.Screen name="Others" component={ForumOthersScreen} />
        </TopTab.Navigator>
    );
}

export default function ForumScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="ForumTabs" component={ForumTabs} />
                <Stack.Screen name="ForumCreationScreen" component={ForumCreationScreen} />
                <Stack.Screen name="SubForumScreen" component={SubForumScreen} />
                <Stack.Screen name="ForumPostScreen" component={ForumPostScreen} />
                <Stack.Screen name="ViewProfileScreen" component={ViewProfileScreen} />
            </Stack.Navigator>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
    },
});