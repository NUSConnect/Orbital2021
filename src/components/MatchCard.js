import React, { useState, useEffect } from 'react'
import * as firebase from 'firebase'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Card } from 'react-native-shadow-cards'
import { useNavigation } from '@react-navigation/native'

const MatchCard = ({ item, onPress }) => {
  const currentUserId = firebase.auth().currentUser.uid
  const color = item.success ? '#90EE90' : '#FF7F7F'
  const [otherName, setOtherName] = useState('')
  const [otherId, setOtherId] = useState('')
  const [otherBio, setOtherBio] = useState('')
  const [otherEmail, setOtherEmail] = useState('')
  const [otherCreatedAt, setOtherCreatedAt] = useState('')
  const [groupName, setGroupName] = useState('')
  const [groupImage, setGroupImage] = useState('')
  const [groupDescription, setGroupDescription] = useState('')
  const [groupMembers, setGroupMembers] = useState([])
  const navigation = useNavigation()

  const getOtherName = async () => {
    if (item.isGroup || item.isGroup === undefined) {
      console.log('group or fail')
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

  const getOtherGroup = async () => {
    await firebase
      .firestore()
      .collection('THREADS')
      .doc(item.groupChatThread)
      .get()
      .then(documentSnapshot => {
        setGroupName(documentSnapshot.data().groupName.name)
        setGroupImage(documentSnapshot.data().groupImage)
        setGroupDescription(documentSnapshot.data().groupDescription.description)
        setGroupMembers(documentSnapshot.data().users)
      })
  }

  const navigateGroupChat = () => {
    const chatObj = { id: item.groupChatThread, name: groupName, description: groupDescription, members: groupMembers, isGroup: true, groupImage: groupImage }
    navigation.navigate('ChatScreen', { thread: chatObj })
  }

  const navigateProfile = () => {
    const profileObj = { userId: otherId, name: otherName, bio: otherBio, email: otherEmail, createdAt: otherCreatedAt }
    navigation.navigate('ViewProfileScreen', { item: profileObj })
  }

  const onPressFn = () => {
    if (item.isGroup === undefined) {
      console.log('Failure')
      Alert.alert('Match failed!', 'Sorry, better luck next time :(')
    } else if (item.isGroup) {
      console.log('Group')
      navigateGroupChat()
    } else {
      console.log('Individual, go to view profile')
      navigateProfile()
    }
  }

  useEffect(() => {
    if (item.isGroup) {
      getOtherGroup()
    }
    getOtherName()
  }, [])

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPressFn}>
        <Card style={{ padding: 10, margin: 10, backgroundColor: color, height: 100, borderRadius: 15 }}>
          <Text style={styles.title}>{item.success ? 'Success!' : 'Sorry!'}</Text>
          {item.success
            ? item.isGroup
                ? <Text style={styles.info}>Match successfully completed on {item.timeMatched.toDate().toDateString()}! Tap here to chat with your new group!</Text>
                : <Text style={styles.info}>Match successfully completed on {item.timeMatched.toDate().toDateString()}! Tap here to check out {otherName}{'\'s profile!'}</Text>
            : <Text style={styles.info}>Match failed, better luck next time!</Text>}
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
    fontSize: 16,
    color: '#000000',
    fontWeight: '300'
  }
})

export default MatchCard
