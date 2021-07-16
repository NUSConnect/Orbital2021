import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import { deleteUser, logoutUser } from '../../api/auth'
import BackButton from '../../components/BackButton'
import Background from '../../components/Background'
import Button from '../../components/Button'

export default function AccountSettingsScreen ({ navigation }) {
  return (
    <Background style={styles.bg}>
      <BackButton goBack={navigation.goBack} />
      <View style={styles.buttonwrap}>
        <Button
          style={styles.button}
          title='update'
          onPress={() => navigation.navigate('UpdateEmailScreen')}
        >
          {' '}
          Update Email Address{' '}
        </Button>
        <Button
          style={styles.button}
          onPress={() => navigation.navigate('ChangeNameScreen')}
        >
          {' '}
          Change your username
        </Button>
        <Button
          style={styles.button}
          onPress={() => navigation.navigate('ChangePasswordScreen')}
        >
          {' '}
          Change Password{' '}
        </Button>
        <Button
          style={styles.button}
          onPress={() => navigation.navigate('SettingsScreen')}
        >
          {' '}
          User preferences{' '}
        </Button>
        <Button
          style={styles.button}
          onPress={() => navigation.navigate('PrivacySettingsScreen')}
        >
          {' '}
          Privacy Settings{' '}
        </Button>
        <Button
          style={styles.button}
          color='#de1738'
          onPress={deleteUser}
        >
          {' '}
          Delete account{' '}
        </Button>
        <Button
          style={styles.button}
          color='#de1738'
          onPress={logoutUser}
        >
          {' '}
          Logout{' '}
        </Button>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FFFFFF'
  },
  buttonwrap: {
    backgroundColor: '#FFFFFF',
    height: 500,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
