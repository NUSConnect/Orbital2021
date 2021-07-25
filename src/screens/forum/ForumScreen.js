import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import * as React from 'react'
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native'
import ViewProfileScreen from '../profile/ViewProfileScreen'
import {
  EditForumCommentScreen,
  EditForumPostScreen,
  ForumAddPostScreen,
  ForumCreationScreen,
  ForumOthersScreen,
  ForumPostScreen,
  ForumSearchScreen,
  ForumSubscribedScreen,
  SubForumScreen,
  ReportForumPostScreen,
  ReportForumCommentScreen,
  SubforumReportsListScreen,
  SubforumViewReportScreen,
  SubForumInfoScreen,
  EditSubforumInfoScreen
} from './'
import ForumAdminManagementScreen from '../profile/ForumAdminManagementScreen'
import ReportDetailScreen from '../profile/viewReports/ReportDetailScreen'
import HandleReportActionsScreen from '../profile/HandleReportActionsScreen'
import UnrestrictedViewProfileScreen from '../profile/viewReports/UnrestrictedViewProfileScreen'
import ChatScreen from '../home/ChatScreen'
import CommentScreen from '../home/CommentScreen'
import FollowingScreen from '../profile/FollowingScreen'
import FollowersScreen from '../profile/FollowersScreen'

const Stack = createStackNavigator()
const TopTab = createMaterialTopTabNavigator()

function ForumTabs () {
  return (
    <TopTab.Navigator
      tabBarOptions={{
        pressColor: '#ffa500',
        pressOpacity: 'ffa500',
        indicatorStyle: { backgroundColor: '#ff8c00' },
        labelStyle: { fontSize: 14 }
      }}
    >
      <TopTab.Screen name='Favourites' component={ForumSubscribedScreen} />
      <TopTab.Screen name='Search' component={ForumSearchScreen} />
      <TopTab.Screen name='Open Portal' component={ForumOthersScreen} />
    </TopTab.Navigator>
  )
}

export default function ForumScreen () {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='ForumTabs' component={ForumTabs} />
        <Stack.Screen name='ForumCreationScreen' component={ForumCreationScreen} />
        <Stack.Screen name='SubForumScreen' component={SubForumScreen} />
        <Stack.Screen name='ForumAddPostScreen' component={ForumAddPostScreen} />
        <Stack.Screen name='ForumPostScreen' component={ForumPostScreen} />
        <Stack.Screen name='EditForumPostScreen' component={EditForumPostScreen} />
        <Stack.Screen name='EditForumCommentScreen' component={EditForumCommentScreen} />
        <Stack.Screen name='ViewProfileScreen' component={ViewProfileScreen} />
        <Stack.Screen name='ReportForumPostScreen' component={ReportForumPostScreen} />
        <Stack.Screen name='ReportForumCommentScreen' component={ReportForumCommentScreen} />
        <Stack.Screen name='SubforumReportsListScreen' component={SubforumReportsListScreen} />
        <Stack.Screen name='SubforumViewReportScreen' component={SubforumViewReportScreen} />
        <Stack.Screen name='ForumAdminManagementScreen' component={ForumAdminManagementScreen} />
        <Stack.Screen name='ReportDetailScreen' component={ReportDetailScreen} />
        <Stack.Screen name='HandleReportActionsScreen' component={HandleReportActionsScreen} />
        <Stack.Screen name='UnrestrictedViewProfileScreen' component={UnrestrictedViewProfileScreen} />
        <Stack.Screen name='SubForumInfoScreen' component={SubForumInfoScreen} />
        <Stack.Screen name='ChatScreen' component={ChatScreen} />
        <Stack.Screen name='EditSubforumInfoScreen' component={EditSubforumInfoScreen} />
        <Stack.Screen name='CommentScreen' component={CommentScreen} />
        <Stack.Screen name='FollowingScreen' component={FollowingScreen} />
        <Stack.Screen name='FollowersScreen' component={FollowersScreen} />
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
