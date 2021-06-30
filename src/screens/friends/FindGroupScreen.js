import * as firebase from 'firebase'
import React, { useEffect } from 'react'
import { Alert, Dimensions, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { MaterialCommunityIcons } from 'react-native-vector-icons'

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
    if (success) {
      const groupId = category + concatList(list)
      firebase.firestore().collection('groups').doc(groupId).set({ category: category })
      for (let i = 0; i < list.length; i++) {
        firebase.firestore().collection('groups').doc(groupId).collection('members').doc(list[i]).set({})
        firebase.firestore().collection('users').doc(list[i]).collection('groups').doc(groupId).set({})
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
              Alert.alert('Group found!')
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

  return (
    <View style={styles.center}>
      <Text style={styles.header}> Choose a category </Text>
      <View
        style={{
          flexDirection: 'row',
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
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MatchMeScreen')}>
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
    borderRadius: 25,
  },
  buttonText: {
    fontSize: 30,
    color: 'white'
  },
  icon: {
    color: 'orange'
  }
})
