import React, { useState, useEffect } from 'react'
import * as firebase from 'firebase'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Card } from 'react-native-shadow-cards'

const MatchCard = ({ navigation, item, onPress }) => {
  const currentUserId = firebase.auth().currentUser.uid
  const color = item.success ? '#90EE90' : '#FF7F7F'
  const [otherName, setOtherName] = useState('')
  const [otherId, setOtherId] = useState('')
  const [otherBio, setOtherBio] = useState('')
  const [otherEmail, setOtherEmail] = useState('')
  const [otherCreatedAt, setOtherCreatedAt] = useState('')

  const getOtherName = async () => {
    if (item.isGroup || item.isGroup === undefined) {
      console.log('Group')
    } else {
      const otherId = item.users.filter(x => x !== currentUserId)[0]
      setOtherId(otherId)
      await firebase
        .firestore()
        .collection('users')
        .doc(otherId)
        .get()
        .then(documentSnapshot => {
          const { name, bio, email, createdAt } = documentSnapshot.data()
          setOtherName(name)
          setOtherBio(bio)
          setOtherEmail(email)
          setOtherCreatedAt(createdAt)
        })
    }
  }
  /*
  const concatList = (list) => {
    let str = ''
    list.sort()
    for (let i = 0; i < list.length; i++) {
      str = str + list[i].substring(0, 6)
    }
    return str
  }
*/
  const navigateProfile = async () => {
    const threadObj = { userId: otherId, name: otherName, bio: otherBio, email: otherEmail, createdAt: otherCreatedAt }
    console.log(threadObj)
    navigation.navigate('ViewProfileScreen', { thread: threadObj })
  }

  const onPressFn = () => {
    if (item.isGroup === undefined) {
      console.log('Failure')
    } else if (item.isGroup) {
      console.log('Group')
    } else {
      navigateProfile()
    }
  }

  useEffect(() => {
    getOtherName()
  }, [])

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPressFn}>
        <Card style={{ padding: 10, margin: 10, backgroundColor: color, height: 100 }}>
          <Text style={styles.title}> {item.success ? 'Success!' : 'Sorry!'} </Text>
          {item.success
            ? item.isGroup
                ? <Text style={styles.info}> Match successful! Tap here to chat with your group! </Text>
                : <Text style={styles.info}> Match successful! Tap here to check out {otherName}{'\'s profile'}</Text>
            : <Text style={styles.info}> Match failed, better luck next time! </Text>}
        </Card>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5
  },
  title: {
    fontSize: 22,
    color: '#000000',
    fontWeight: '600'
  },
  info: {
    fontSize: 18,
    color: '#000000',
    fontWeight: '600'
  }
})

export default MatchCard
