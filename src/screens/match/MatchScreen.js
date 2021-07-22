import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import {
  SafeAreaView,
  StatusBar,
  StyleSheet
} from 'react-native'
import FindGroupScreen from './FindGroupScreen'
import MatchMeScreen from './MatchMeScreen'
import WaitingScreen from './WaitingScreen'
import MatchHistoryScreen from './MatchHistoryScreen'
import ChatScreen from '../home/ChatScreen'
import CommentScreen from '../home/CommentScreen'
import ViewProfileScreen from '../profile/ViewProfileScreen'
import FollowingScreen from '../profile/FollowingScreen'
import FollowersScreen from '../profile/FollowersScreen'
import ReportPostScreen from '../home/ReportPostScreen'
import ReportUserScreen from '../friends/ReportUserScreen'
import ReportCommentScreen from '../home/ReportCommentScreen'
import GroupInfoScreen from '../home/GroupInfoScreen'
import EditGroupScreen from '../home/EditGroupScreen'
import EditGroupMembersScreen from '../home/EditGroupMembersScreen'

const Stack = createStackNavigator()
const Tab = createMaterialTopTabNavigator()

function MatchTabs () {
  return (
    <Tab.Navigator
      tabBarOptions={{
        pressColor: '#ffa500',
        pressOpacity: 'ffa500',
        indicatorStyle: { backgroundColor: '#ff8c00' },
        labelStyle: { fontSize: 14 }
      }}
    >
      <Tab.Screen name='Match Me' component={FindGroupScreen} />
      <Tab.Screen name='Match History' component={MatchHistoryScreen} />
    </Tab.Navigator>
  )
}

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Navigator
        initialRouteName='MatchTabs'
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name='MatchTabs' component={MatchTabs} />
        <Stack.Screen name='MatchMeScreen' component={MatchMeScreen} />
        <Stack.Screen name='WaitingScreen' component={WaitingScreen} />
        <Stack.Screen name='ViewProfileScreen' component={ViewProfileScreen} />
        <Stack.Screen name='FollowersScreen' component={FollowersScreen} />
        <Stack.Screen name='FollowingScreen' component={FollowingScreen} />
        <Stack.Screen name='ChatScreen' component={ChatScreen} />
        <Stack.Screen name='CommentScreen' component={CommentScreen} />
        <Stack.Screen name='ReportPostScreen' component={ReportPostScreen} />
        <Stack.Screen name='ReportUserScreen' component={ReportUserScreen} />
        <Stack.Screen name='ReportCommentScreen' component={ReportCommentScreen} />
        <Stack.Screen name='GroupInfoScreen' component={GroupInfoScreen} />
        <Stack.Screen name='EditGroupScreen' component={EditGroupScreen} />
        <Stack.Screen name='EditGroupMembersScreen' component={EditGroupMembersScreen} />
      </Stack.Navigator>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0
  }
})

export default HomeScreen
