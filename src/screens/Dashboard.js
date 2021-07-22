import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import React, { useEffect } from 'react'
import { Alert } from 'react-native'
import * as Permissions from 'expo-permissions'
import * as Notifications from 'expo-notifications'
import * as firebase from 'firebase'
import { FontAwesome5, MaterialCommunityIcons, Ionicons } from 'react-native-vector-icons'
import {
  ForumScreen,
  FriendsScreen,
  HomeScreen,
  ProfileMasterScreen,
  MatchScreen
} from './'

const Tab = createMaterialBottomTabNavigator()

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return { shouldShowAlert: true }
  }
})

function MyTabs () {
  return (
    <Tab.Navigator
      initialRouteName='Home'
      activeColor='#ffffff'
      labelStyle={{ fontSize: 12 }}
      barStyle={{ backgroundColor: '#ff8c00' }}
    >
      <Tab.Screen
        name='Home'
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name='home'
              color={color}
              size={28}
              style={{ marginTop: -2, marginRight: 1, width: 28 }}
            />
          )
        }}
      />
      <Tab.Screen
        name='Portals'
        component={ForumScreen}
        options={{
          tabBarLabel: 'Portals',
          tabBarIcon: ({ color }) => (
            <Ionicons
              name='aperture'
              color={color}
              size={26}
            />
          )
        }}
      />
      <Tab.Screen
        name='Matching'
        component={MatchScreen}
        options={{
          tabBarLabel: 'Matching',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name='handshake'
              color={color}
              size={26}
            />
          )
        }}
      />
      <Tab.Screen
        name='Friends'
        component={FriendsScreen}
        options={{
          tabBarLabel: 'Friends',
          tabBarIcon: ({ color }) => (
            <FontAwesome5
              name='user-friends'
              color={color}
              size={24}
              style={{ width: 34 }}
            />
          )
        }}
      />
      <Tab.Screen
        name='Profile'
        component={ProfileMasterScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <FontAwesome5
              name='user'
              color={color}
              size={24}
              solid
            />
          )
        }}
      />
    </Tab.Navigator>
  )
}

export default function Dashboard () {
  const registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    )
    let finalStatus = existingStatus

    const currentUserId = firebase.auth().currentUser.uid

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
      finalStatus = status
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      await firebase.firestore().collection('users').doc(currentUserId).update({ pushInit: true })
      return
    }

    try {
      // Get the token that uniquely identifies this device
      const token = await Notifications.getExpoPushTokenAsync()

      // POST the token to your backend server from where you can retrieve it to send push notifications.
      firebase
        .firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .update({
          pushToken: token,
          pushInit: true
        })
    } catch (error) {
      console.log(error)
    }
  }

  const warningAlert = (message) => {
    Alert.alert(
      'Warning',
      message,
      [
        {
          text: 'OK',
          onPress: () => firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).update({ warningUnchecked: false })
        }
      ],
      { cancelable: false }
    )
  }

  useEffect(() => {
    firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).get()
      .then((documentSnapshot) => {
        if (!documentSnapshot.data().pushInit) {
          registerForPushNotificationsAsync()
        }
        if (documentSnapshot.data().warningUnchecked === true) {
          warningAlert(documentSnapshot.data().warningMessage)
        }
      })
  }, [])

  return <MyTabs />
}
