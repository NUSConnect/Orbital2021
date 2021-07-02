import React, { useState, useEffect } from 'react'
import * as firebase from 'firebase'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Card } from 'react-native-shadow-cards'

const MatchCard = ({ navigation, route, item, onPress }) => {
  const currentUserId = firebase.auth().currentUser.uid
  const color = item.success ? '#90EE90' : '#FF7F7F'
  const [otherName, setOtherName] = useState('')

  const getOtherName = async () => {
    if (item.isGroup || item.isGroup === undefined) {
      console.log('Group')
    } else {
      const otherId = item.users.filter(x => x !== currentUserId)[0]
      await firebase
        .firestore()
        .collection('users')
        .doc(otherId)
        .get()
        .then(documentSnapshot => setOtherName(documentSnapshot.data().name))
    }
  }

  useEffect(() => {
    getOtherName()
  }, [])

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => console.log('pressed')}>
        <Card style={{ padding: 10, margin: 10, backgroundColor: color, height: 120 }}>
          <Text style={styles.title}> {item.success ? 'Success!' : 'Sorry!'} </Text>
          {item.success
            ? item.isGroup
                ? <Text style={styles.info}> Match successful! Tap here to chat with group </Text>
                : <Text style={styles.info}> Match successful! Tap here to chat with {otherName}</Text>
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
