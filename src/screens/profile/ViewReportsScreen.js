import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import BackButton from '../../components/BackButton'
import Background from '../../components/Background'
import Button from '../../components/Button'

export default function ViewReportsScreen ({ navigation }) {
  return (
    <Background style={styles.bg}>
      <BackButton goBack={navigation.goBack} />
      <View style={styles.buttonwrap}>
        <Button
          style={styles.button}
          onPress={() => navigation.navigate('ReportsListScreen', { category: 'users' })}
        >
          users
        </Button>
        <Button
          style={styles.button}
          onPress={() => navigation.navigate('ReportsListScreen', { category: 'userPosts' })}
        >
          user posts
        </Button>
        <Button
          style={styles.button}
          onPress={() => navigation.navigate('ReportsListScreen', { category: 'userComments' })}
        >
          user comments
        </Button>
        <Button
          style={styles.button}
          onPress={() => navigation.navigate('ReportsListScreen', { category: 'forumPosts' })}
        >
          forum posts
        </Button>
        <Button
          style={styles.button}
          onPress={() => navigation.navigate('ReportsListScreen', { category: 'forumComments' })}
        >
          forum comments
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
