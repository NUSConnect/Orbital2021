import React, { useEffect, useState } from 'react'
import * as firebase from 'firebase'
import { View, Switch, Text } from 'react-native'
import BackButton from '../../components/BackButton'
import Background from '../../components/Background'
import Button from '../../components/Button'

export default function PrivacySettingsScreen ({ navigation }) {
  const currentUserId = firebase.auth().currentUser.uid
  const [isEnabled, setIsEnabled] = useState(false)

  const getUserInfo = async () => {
    await firebase.firestore().collection('users').doc(currentUserId).get()
      .then((doc) => {
        if (doc.data().isPrivate !== null) {
          setIsEnabled(doc.data().isPrivate)
        }
      })
  }

  const handlePrivateSwitch = () => {
    const newValue = !isEnabled
    setIsEnabled(newValue)
    firebase.firestore().collection('users').doc(currentUserId)
      .update({ isPrivate: newValue })
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
            Private Account?
          </Text>
          <Switch
            style={styles.switchFlip}
            onValueChange={handlePrivateSwitch}
            value={isEnabled}
            testID='switch'
          />
        </View>
        <Button
          style={styles.button}
          color='#de1738'
          onPress={() => console.log('blocked pressed')}
        >
          <Text style={styles.switchText}>
            Manage Blocked Users
          </Text>
        </Button>
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
    fontSize: 20
  },
  switchFlip: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
  },
  buttonWrap: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'flex-start'
  }
}
