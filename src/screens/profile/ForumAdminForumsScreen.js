import * as firebase from 'firebase'
import React, { useState, useEffect } from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import HeaderTopBar from '../../components/HeaderTopBar'
import BackButton from '../../components/BackButton'
import Background from '../../components/Background'
import Button from '../../components/Button'

export default function ForumAdminForumsScreen ({ navigation }) {
  const currentUserId = firebase.auth().currentUser.uid
  const [forums, setForums] = useState(null)

  const getForums = async () => {
    const list = []

    await firebase.firestore().collection('users').doc(currentUserId).collection('forumAdmin').get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          list.push({
            id: doc.id,
            name: doc.data().name
          })
        })
      })

    setForums(list)
  }

  useEffect(() => {
    getForums()

    const _unsubscribe = navigation.addListener('focus', () => getForums())

    return () => {
      _unsubscribe()
    }
  }, [])

  return (
    <View style={styles.bg}>
      <HeaderTopBar
        onPress={() => navigation.goBack()}
        title={'Forums managed by you'}
      />
      <FlatList
        data={forums}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <Button
              style={styles.button}
              onPress={() => navigation.navigate('ForumAdminManagementScreen', { forumId: item.id, forumName: item.name })}
            >
              {item.name}
            </Button>
        )}
      />

    </View>
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
