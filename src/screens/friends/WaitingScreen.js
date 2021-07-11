import React, { useEffect, useState } from 'react'
import { Text, StyleSheet } from 'react-native'
import Background from '../../components/Background'
import Button from '../../components/Button'
import * as Animatable from 'react-native-animatable'
import * as firebase from 'firebase'

export default function WaitingScreen ({ navigation, route, goBack }) {
  const currentUserId = firebase.auth().currentUser.uid
  const [size, setSize] = useState(0)
  const userCategory = route.params.groupCategory

  const checkGroupSize = async (category) => {
    await firebase
      .firestore()
      .collection('categories')
      .doc(category)
      .collection('people')
      .onSnapshot((querySnapshot) => {
        setSize(querySnapshot.size)
      })
  }

  const handleDelete = async () => {
    await firebase
      .firestore()
      .collection('categories')
      .doc(userCategory)
      .collection('people')
      .doc(currentUserId)
      .delete()
    await firebase
      .firestore()
      .collection('users')
      .doc(currentUserId)
      .update({ finding: false, groupCategory: null })
    navigation.navigate('FindGroupScreen')
  }

  useEffect(() => {
    checkGroupSize(userCategory)
    const _unsubscribe = navigation.addListener('focus', () => checkGroupSize(userCategory))

    return () => {
      _unsubscribe()
    }
  }, [])

  return (
    <Background>
      <Animatable.Text
        animation='tada'
        easing='ease-out'
        iterationCount='infinite'
        style={styles.find}
      >
        Finding you a friend...️
      </Animatable.Text>
      <Text style={styles.text}>
        {'Feel free to go, we\'ll inform you when your friend is found :)'}
      </Text>
      <Button
        style={styles.stop}
        color='#de1738'
        onPress={handleDelete}
      >
        Stop searching
      </Button>
    </Background>
  )
}

const styles = StyleSheet.create({
  find: {
    textAlign: 'center',
    fontSize: 50
  },
  stop: {
    marginTop: 30
  },
  text: {
    marginTop: 70,
    fontSize: 18,
    alignItems: 'center'
  }
})
