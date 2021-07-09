import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import BackButton from '../../components/BackButton'
import Background from '../../components/Background'
import Button from '../../components/Button'

export default function ForumAdminViewReportsScreen ({ navigation }) {
  return (
    <Background style={styles.bg}>
      <BackButton goBack={navigation.goBack} />
      <View style={styles.buttonwrap}>
        <Button
          style={styles.button}
          onPress={() => navigation.navigate('ForumReportsListScreen', { category: 'forumPosts' })}
        >
          forum posts
        </Button>
        <Button
          style={styles.button}
          onPress={() => navigation.navigate('ForumReportsListScreen', { category: 'forumComments' })}
        >
          forum comments
        </Button>
        <Button
          style={styles.button}
          onPress={() => navigation.navigate('ForumAdminForumsScreen')}
        >
          manage forum admins
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
    alignItems: 'center',
    justifyContent: 'center'
  }
})
