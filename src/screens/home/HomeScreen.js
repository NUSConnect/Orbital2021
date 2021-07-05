import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import {
  SafeAreaView,
  StatusBar,
  StyleSheet
} from 'react-native'
import ViewProfileScreen from '../profile/ViewProfileScreen'
import FollowingScreen from '../profile/FollowingScreen'
import FollowersScreen from '../profile/FollowersScreen'
import AddPostScreen from './AddPostScreen'
import ChatScreen from './ChatScreen'
import CommentScreen from './CommentScreen'
import EditCommentScreen from './EditCommentScreen'
import EditGroupScreen from './EditGroupScreen'
import EditPostScreen from './EditPostScreen'
import GroupCreationScreen from './GroupCreationScreen'
import GroupInfoScreen from './GroupInfoScreen'
import HomePostsScreen from './HomePostsScreen'
import InitGroupChatScreen from './InitGroupChatScreen'
import MessagesScreen from './MessagesScreen'
import StartMessagesScreen from './StartMessagesScreen'
import ReportPostScreen from './ReportPostScreen'
import ReportCommentScreen from './ReportCommentScreen'

const Stack = createStackNavigator()

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Navigator
        initialRouteName='HomePostsScreen'
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name='HomePostsScreen' component={HomePostsScreen} />
        <Stack.Screen name='AddPostScreen' component={AddPostScreen} />
        <Stack.Screen name='EditPostScreen' component={EditPostScreen} />
        <Stack.Screen name='CommentScreen' component={CommentScreen} />
        <Stack.Screen name='EditCommentScreen' component={EditCommentScreen} />
        <Stack.Screen name='ViewProfileScreen' component={ViewProfileScreen} />
        <Stack.Screen name='FollowersScreen' component={FollowersScreen} />
        <Stack.Screen name='FollowingScreen' component={FollowingScreen} />
        <Stack.Screen name='ChatScreen' component={ChatScreen} />
        <Stack.Screen name='MessagesScreen' component={MessagesScreen} />
        <Stack.Screen name='StartMessagesScreen' component={StartMessagesScreen} />
        <Stack.Screen name='GroupCreationScreen' component={GroupCreationScreen} />
        <Stack.Screen name='InitGroupChatScreen' component={InitGroupChatScreen} />
        <Stack.Screen name='GroupInfoScreen' component={GroupInfoScreen} />
        <Stack.Screen name='EditGroupScreen' component={EditGroupScreen} />
        <Stack.Screen name='ReportPostScreen' component={ReportPostScreen} />
        <Stack.Screen name='ReportCommentScreen' component={ReportCommentScreen} />
      </Stack.Navigator>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0
  },
  item: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16
  },
  title: {
    fontSize: 32,
    color: '#000000',
    borderWidth: 1,
    borderColor: '#000000'
  }
})

export default HomeScreen
