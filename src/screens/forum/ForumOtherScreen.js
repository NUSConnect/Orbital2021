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
import ForumRecommendedScreen from "./ForumRecommendedScreen";
import ForumCreationScreen from "./ForumCreationScreen";

const Stack = createStackNavigator();

const ForumOthersScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <Stack.Navigator
                initialRouteName="ForumRecommendedScreen"
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen
                    name="ForumRecommendedScreen"
                    component={ForumRecommendedScreen}
                />
                <Stack.Screen
                    name="ForumCreationScreen"
                    component={ForumCreationScreen}
                />
            </Stack.Navigator>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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

export default ForumOthersScreen;