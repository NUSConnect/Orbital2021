import * as firebase from 'firebase'
import React, { useEffect } from 'react'
import { Alert, Dimensions, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { MaterialCommunityIcons } from 'react-native-vector-icons'
import { createGroupChat } from '../../api/matching'
import { sendPushNotification } from '../../api/notifications'
import * as Haptics from 'expo-haptics'

const DeviceWidth = Dimensions.get('window').width
const squareSide = 0.38 * DeviceWidth
const groupThreshold = 2

export default function FindGroupScreen ({ navigation }) {
  const currentUserId = firebase.auth().currentUser.uid

  useEffect(() => {
    const subscriber = firebase
      .firestore()
      .collection('users')
      .doc(currentUserId)
      .onSnapshot((documentSnapshot) => {
        if (documentSnapshot.data().finding) {
          calculateGroup(documentSnapshot.data().groupCategory)
          console.log('checking at ' + new Date())
        }
      })

    return () => subscriber()
  }, [])

  function getDifferenceInHours (date1, date2) {
    const diffInMs = Math.abs(date2 - date1)
    return diffInMs / (1000 * 60 * 60)
  }

  const addToCategory = async (category) => {
    // add uid to corresponding category
    await firebase
      .firestore()
      .collection('categories')
      .doc(category)
      .collection('people')
      .doc(currentUserId)
      .set({})
      .then(() => {
        firebase
          .firestore()
          .collection('users')
          .doc(currentUserId)
          .update({ finding: true, groupCategory: category })
        firebase
          .firestore()
          .collection('categories')
          .doc(category)
          .set({
            lastJoinedAt: firebase.firestore.Timestamp.fromDate(
              new Date()
            )
          })
      })
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
  }

  //  const stopFinding = async (userId) => {
  //    // unused** this is also in clearUsers
  //    await firebase
  //      .firestore()
  //      .collection('users')
  //      .doc(userId)
  //      .update({ finding: false, groupCategory: null })
  //    // maybe send notification to users here that group is found/no groups matched
  //  }

  const concatList = (list) => {
    let str = ''
    list.sort()
    for (let i = 0; i < list.length; i++) {
      str = str + list[i].substring(0, 6)
    }
    return str
  }

  const clearUsers = async (success, category) => {
    console.log('Function called')
    const list = []
    await firebase
      .firestore()
      .collection('categories')
      .doc(category)
      .collection('people')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((documentSnapshot) => {
          list.push(documentSnapshot.id)
          documentSnapshot.ref.delete()
        })
      })
    const matchingId = Date.now().toString()
    const completionTime = new Date()

    if (success) {
      if (list.length > 2) {
        const threadId = category + concatList(list) + matchingId
        const groupName = category + completionTime.toLocaleDateString()

        createGroupChat(category, threadId, groupName, list, completionTime.toLocaleDateString())

        for (let i = 0; i < list.length; i++) {
          const userId = list[i]

          firebase.firestore().collection('users').doc(userId).collection('openChats').doc(threadId).set({})

          firebase.firestore().collection('users').doc(userId).collection('matchHistory').doc(category + matchingId)
            .set({
              success: true,
              timeMatched: firebase.firestore.Timestamp.fromDate(completionTime),
              users: list,
              isGroup: true,
              groupChatThread: threadId
            })

          firebase.firestore().collection('users').doc(userId).get()
            .then((doc) => {
              console.log('Checking if pushToken available')
              if (doc.data().pushToken != null) {
                sendPushNotification(doc.data().pushToken.data, 'Matching Successful',
                  'Check your matching results under your profile page now!')
              }
            })
        }
      } else {
        for (let k = 0; k < list.length; k++) {
          const userId = list[k]

          firebase.firestore().collection('users').doc(userId).collection('matchHistory').doc(category + matchingId)
            .set({
              success: true,
              timeMatched: firebase.firestore.Timestamp.fromDate(completionTime),
              users: list,
              isGroup: false
            })

          firebase.firestore().collection('users').doc(userId).get()
            .then((doc) => {
              console.log('Checking if pushToken available')
              if (doc.data().pushToken != null) {
                sendPushNotification(doc.data().pushToken.data, 'Matching Successful',
                  'Check your matching results under your profile page now!')
              }
            })
        }
      }
    } else {
      for (let i = 0; i < list.length; i++) {
        const userId = list[i]

        firebase.firestore().collection('users').doc(userId).collection('matchHistory').doc(matchingId)
          .set({ success: false, timeMatched: firebase.firestore.Timestamp.fromDate(completionTime) })

        firebase.firestore().collection('users').doc(userId).get()
          .then((doc) => {
            console.log('Checking if pushToken available')
            if (doc.data().pushToken != null) {
              sendPushNotification(doc.data().pushToken.data, 'Matching Failed',
                'We are sad to inform you that we are unable to match you this time :(')
            }
          })
      }
    }

    for (let i = 0; i < list.length; i++) {
      // turn off finding
      firebase.firestore().collection('users').doc(list[i]).update({ finding: false, groupCategory: null })
    }
  }

  const calculateGroup = async (category) => {
    let count
    let lastJoinedAt
    console.log('Logged at ' + new Date())
    await firebase.firestore().collection('categories').doc(category).get().then(doc => { lastJoinedAt = doc.data().lastJoinedAt })

    const unsubscribe = firebase
      .firestore()
      .collection('categories')
      .doc(category)
      .collection('people')
      .onSnapshot((querySnapshot) => {
        count = querySnapshot.size
        if (count === 0) {
          navigation.navigate('FindGroupScreen')
          unsubscribe()
        } else if (count >= groupThreshold || getDifferenceInHours(new Date(), lastJoinedAt.toDate()) >= 6) {
          // hit threshold, handle logic to form a group. currently only an alert.

          const successfulFinding = count >= groupThreshold
          clearUsers(successfulFinding, category)
          const loggedInListener = firebase.auth().onAuthStateChanged(user => {
            if (user) {
              navigation.navigate('FindGroupScreen')
              Alert.alert('Friend found!', 'Congratulations! Find your new friend on your profile page, under Matches.')
              loggedInListener()
            }
          })
          unsubscribe()
        } else {
          // not enough people to form group, send to waiting screen.
          navigation.navigate('WaitingScreen', {
            groupCategory: category
          })
        }
      })
  }

  const _handleMatchMe = async () => {
    let inPool = false
    await firebase.firestore().collection('matchingPool').doc(currentUserId).get()
      .then((doc) => {
        if (doc.exists) {
          inPool = true
        }
      })

    if (inPool) {
      Alert.alert(
        'You already have an existing matching request',
        'Do you want to delete it?',
        [
          {
            text: 'No',
            onPress: () => console.log('Nothing done')
          },
          {
            text: 'Yes',
            onPress: () => _handleDeletePoolEntry()
          }
        ],
        { cancelable: false }
      )
    } else {
      navigation.navigate('MatchMeScreen')
    }
  }

  const _handleDeletePoolEntry = () => {
    firebase
      .firestore()
      .collection('matchingPool')
      .doc(currentUserId)
      .delete()
      .then(() => {
        Alert.alert(
          'Your previous matching request has been deleted',
          'Create a new matching request?',
          [
            {
              text: 'No',
              onPress: () => console.log('Nothing done')
            },
            {
              text: 'Yes',
              onPress: () => navigation.navigate('MatchMeScreen')
            }
          ],
          { cancelable: false }
        )
      })
      .catch((e) => console.log('Error deleting post.', e))
  }
  return (
    <View style={styles.center}>
      <Text style={styles.header}> Find a friend! </Text>
      <View
        style={{
          flexDirection: 'row'
        }}
      >
        <View style={{ marginBottom: 50 }}>
          <TouchableOpacity style={styles.circle} onPress={() => addToCategory('Sports')}>
            <MaterialCommunityIcons
              name='run'
              size={80}
              style={styles.icon}
            />
            <Text style={styles.name}> Sports </Text>
          </TouchableOpacity>
          <View style={styles.space} />
          <TouchableOpacity style={styles.circle} onPress={() => addToCategory('Music')}>
            <MaterialCommunityIcons
              name='account-music'
              size={80}
              style={styles.icon}
            />
            <Text style={styles.name}> Music </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.space} />
        <View>
          <TouchableOpacity style={styles.circle} onPress={() => addToCategory('Study')}>
            <MaterialCommunityIcons
              name='book-open'
              size={80}
              style={styles.icon}
            />
            <Text style={styles.name}> Study </Text>
          </TouchableOpacity>
          <View style={styles.space} />
          <TouchableOpacity style={styles.circle} onPress={() => addToCategory('For Fun')}>
            <MaterialCommunityIcons
              name='controller-classic'
              size={80}
              style={styles.icon}
            />
            <Text style={styles.name}> For Fun </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.header}> Nothing suits you? </Text>
      <TouchableOpacity style={styles.button} onPress={() => _handleMatchMe()}>
        <Text style={styles.buttonText}> Match Me! </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    fontSize: 24,
    marginBottom: 10
  },
  circle: {
    width: squareSide,
    height: squareSide,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: squareSide / 2
  },
  space: {
    height: DeviceWidth * 0.02,
    width: DeviceWidth * 0.03
  },
  name: {
    fontSize: 20
  },
  button: {
    width: DeviceWidth * 0.8,
    height: squareSide / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'darkorange',
    borderRadius: 25
  },
  buttonText: {
    fontSize: 30,
    color: 'white'
  },
  icon: {
    color: 'orange'
  }
})
