import * as firebase from 'firebase'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

const CommentItem = ({ route, item, onViewProfile, onPressHandle }) => {
  const currentUserId = firebase.auth().currentUser.uid
  const [userData, setUserData] = useState(null)

  const getUser = async () => {
    await firebase
      .firestore()
      .collection('users')
      .doc(item.userId)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          setUserData(documentSnapshot.data())
        }
      })
  }

  useEffect(() => {
    getUser()
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <Text
            style={styles.username}
            onPress={() => onViewProfile(currentUserId)}
            testID='username'
          >
            {userData
              ? userData.name || 'Deleted User'
              : 'Deleted User'}
          </Text>
          <Text style={styles.moments} testID='time'>
            {' ·'} {moment(item.postTime.toDate()).fromNow()}
          </Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      <Text style={styles.text} onPress={onPressHandle} testID='comment'>
        {item.commentBody}
      </Text>
    </View>
  )
}

export default CommentItem

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: '100%',
    marginBottom: 2,
    borderRadius: 10
  },
  headerContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingLeft: 10
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerRight: {},
  text: {
    fontSize: 16,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 5,
    marginBottom: 10
  },
  username: {
    fontSize: 16,
    color: 'blue'
  },
  moments: {
    fontSize: 14,
    color: 'gray'
  }
})
