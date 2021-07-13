import React, { useEffect, useState } from 'react'
import * as firebase from 'firebase'
import * as Notifications from 'expo-notifications'
import { View, Switch, Text } from 'react-native'
import BackButton from '../../components/BackButton'
import Background from '../../components/Background'

export default function SettingsScreen ({ navigation }) {
  const currentUserId = firebase.auth().currentUser.uid
  const [enableVibration, setEnableVibration] = useState(true)
  const [enableNotifications, setEnableNotifications] = useState(false)

  const getUserInfo = async () => {
    await firebase.firestore().collection('users').doc(currentUserId).get()
      .then((doc) => {
        if (typeof doc.data().enableVibration !== 'undefined') {
          console.log(doc.data().enableVibration)
          setEnableVibration(doc.data().enableVibration)
        }
        if (doc.data().pushToken) {
          setEnableNotifications(true)
        }
      })
  }

  const handleNotificationSwitch = async () => {
    const newValue = !enableNotifications
    setEnableNotifications(newValue)

    if (newValue) {
      const token = await Notifications.getExpoPushTokenAsync()
      firebase.firestore().collection('users').doc(currentUserId)
        .update({ pushToken: token })
    } else {
      firebase.firestore().collection('users').doc(currentUserId)
        .update({ pushToken: firebase.firestore.FieldValue.delete() })
    }
  }

  const handleHapticFeedbackSwitch = () => {
    const newValue = !enableVibration
    setEnableVibration(newValue)
    firebase.firestore().collection('users').doc(currentUserId)
      .update({ enableVibration: newValue })
  }

  useEffect(() => {
    getUserInfo()
  }, [])

  return (
    <Background style={styles.bg}>
      <BackButton goBack={navigation.goBack} />
      <View style={styles.buttonWrap}>
        <View style={styles.flip}>
          <Text style={styles.switchText}>
            Enable Push Notifications?
          </Text>
          <Switch
            style={styles.switchFlip}
            onValueChange={handleNotificationSwitch}
            value={enableNotifications}
            testID='switch'
          />
        </View>
        <View style={styles.flip}>
          <Text style={styles.switchText}>
            Enable in App Vibration?
          </Text>
          <Switch
            style={styles.switchFlip}
            onValueChange={handleHapticFeedbackSwitch}
            value={enableVibration}
            testID='switch'
          />
        </View>
      </View>
    </Background>
  )
}

const styles = {
  button: {
    backgroundColor: '#FFFFFF'
  },
  flip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30
  },
  switchText: {
    fontSize: 20,
    paddingRight: 5
  },
  buttonWrap: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'flex-start'
  }
}
