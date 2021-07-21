import * as firebase from 'firebase'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { MaterialIcons } from 'react-native-vector-icons'
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu'
import * as Haptics from 'expo-haptics'

const ForumPost = ({
  route,
  item,
  onViewProfile,
  onDelete,
  onPress,
  onReport,
  onEdit
}) => {
  const currentUserId = firebase.auth().currentUser.uid
  const [vibrate, setVibrate] = useState(true)
  const [votes, setVotes] = useState(0)
  const [userData, setUserData] = useState(null)
  const [upvoted, setUpvoted] = useState(null)
  const [downvoted, setDownvoted] = useState(null)

  const getUser = async () => {
    await firebase
      .firestore()
      .collection('users')
      .doc(item.userId)
      .onSnapshot((documentSnapshot) => {
        if (documentSnapshot.exists) {
          setUserData(documentSnapshot.data())
          if (typeof documentSnapshot.data().enableVibration !== 'undefined') {
            setVibrate(documentSnapshot.data().enableVibration)
          }
        }
      })
  }

  const getVotes = async () => {
    await firebase
      .firestore()
      .collection('forums')
      .doc(item.forumId)
      .collection('forumPosts')
      .doc(item.postId)
      .onSnapshot((documentSnapshot) => {
        if (documentSnapshot.exists) {
          setVotes(documentSnapshot.data().votes)
        }
      })
  }

  const checkVoted = async () => {
    await firebase
      .firestore()
      .collection('forums')
      .doc(item.forumId)
      .collection('forumPosts')
      .doc(item.postId)
      .collection('votes')
      .doc(currentUserId)
      .onSnapshot((snapshot) => {
        if (snapshot.exists) {
          const { voted } = snapshot.data()
          if (voted === 1) {
            setUpvoted(true)
            setDownvoted(false)
          } else {
            setUpvoted(false)
            setDownvoted(true)
          }
        } else {
          setUpvoted(false)
          setDownvoted(false)
        }
      })
  }

  const upVote = async () => {
    let incrementer = 1
    if (downvoted) { incrementer = 2 }
    firebase
      .firestore()
      .collection('forums')
      .doc(item.forumId)
      .collection('forumPosts')
      .doc(item.postId)
      .collection('votes')
      .doc(currentUserId)
      .set({ voted: 1 })
    firebase
      .firestore()
      .collection('forums')
      .doc(item.forumId)
      .collection('forumPosts')
      .doc(item.postId)
      .update({ votes: firebase.firestore.FieldValue.increment(incrementer) })
    setUpvoted(true)
    setDownvoted(false)
    if (vibrate) { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium) }
  }

  const downVote = async () => {
    let incrementer = -1
    if (upvoted) { incrementer = -2 }
    firebase
      .firestore()
      .collection('forums')
      .doc(item.forumId)
      .collection('forumPosts')
      .doc(item.postId)
      .collection('votes')
      .doc(currentUserId)
      .set({ voted: -1 })
    firebase
      .firestore()
      .collection('forums')
      .doc(item.forumId)
      .collection('forumPosts')
      .doc(item.postId)
      .update({ votes: firebase.firestore.FieldValue.increment(incrementer) })
    setUpvoted(false)
    setDownvoted(true)
    if (vibrate) { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium) }
  }

  const unVote = async () => {
    let incrementer = 1
    if (upvoted) { incrementer = -1 }
    firebase
      .firestore()
      .collection('forums')
      .doc(item.forumId)
      .collection('forumPosts')
      .doc(item.postId)
      .collection('votes')
      .doc(currentUserId)
      .delete()
    firebase
      .firestore()
      .collection('forums')
      .doc(item.forumId)
      .collection('forumPosts')
      .doc(item.postId)
      .update({ votes: firebase.firestore.FieldValue.increment(incrementer) })
    setUpvoted(false)
    setDownvoted(false)
  }

  useEffect(() => {
    getUser()
    getVotes()
    checkVoted()
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <Text style={styles.regularFont}>{'Posted by '}</Text>
          <Text
            style={styles.username}
            onPress={() => onViewProfile(currentUserId)}
            testID='username'
          >
            {userData
              ? userData.name || 'Anonymous User'
              : 'Anonymous User'}
          </Text>
          <Text style={styles.regularFont} testID='time'>
            {' ·'} {moment(item.postTime.toDate()).fromNow()}
          </Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      <Text style={styles.title} onPress={onPress} testID='title'>
        {item.postTitle}
      </Text>
      <Text style={styles.text} onPress={onPress} testID='body'>
        {item.postBody}
      </Text>

      <View style={styles.bottomContainer}>
        <View style={styles.voteContainer}>
          <TouchableOpacity
            onPress={() => (upvoted ? unVote() : upVote())}
          >
            <MaterialIcons
              name='arrow-upward'
              size={32}
              color={upvoted ? 'lightgreen' : 'darkgray'}
            />
          </TouchableOpacity>
          <Text
            style={[styles.score, { color: upvoted ? 'darkseagreen' : downvoted ? 'red' : 'darkgray' }]}
            testID='votes'
          >
            {votes}
          </Text>
          <TouchableOpacity
            onPress={() => (downvoted ? unVote() : downVote())}
          >
            <MaterialIcons
              name='arrow-downward'
              size={32}
              color={downvoted ? 'crimson' : 'darkgray'}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.centerAlign}
          activeOpacity={0.7}
          onPress={onPress}
          testID='commentIcon'
        >
          <MaterialIcons
            name='messenger-outline'
            size={26}
            color='darkgray'
          />
          <Text style={styles.commentText} testID='comments'>{item.commentCount}</Text>
        </TouchableOpacity>
        {currentUserId === item.userId
          ? (
            <Menu style={styles.centerAlign}>
              <MenuTrigger>
                <MaterialIcons name='more-vert' size={26} color='darkgray' />
              </MenuTrigger>
              <MenuOptions>
                <MenuOption onSelect={() => onEdit()}>
                  <View style={styles.menuItems}>
                    <MaterialIcons name='edit' size={26} color='gray' />
                    <Text style={styles.menuText}>Edit</Text>
                  </View>
                </MenuOption>
                <MenuOption onSelect={() => onDelete()}>
                  <View style={styles.menuItems}>
                    <MaterialIcons name='delete' size={26} color='gray' />
                    <Text style={styles.menuText}>Delete</Text>
                  </View>
                </MenuOption>
                <MenuOption onSelect={() => console.log('cancel')}>
                  <View style={styles.menuItems}>
                    <MaterialIcons name='cancel' size={26} color='gray' />
                    <Text style={styles.menuText}>Cancel</Text>
                  </View>
                </MenuOption>
              </MenuOptions>
            </Menu>
            )
          : (
            <TouchableOpacity
              style={styles.centerAlign}
              activeOpacity={0.7}
              onPress={onReport}
              testID='report'
            >
              <MaterialIcons
                name='report'
                size={26}
                color='darkgray'
              />
            </TouchableOpacity>
            )}
      </View>
    </View>
  )
}

export default ForumPost

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: '100%',
    marginBottom: 20,
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
  bottomContainer: {
    flexDirection: 'row'
  },
  voteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '33%'
  },
  centerAlign: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '33%'
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '33%',
    paddingRight: 10
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingLeft: 10
  },
  text: {
    fontSize: 16,
    paddingLeft: 10,
    paddingRight: 15
  },
  score: {
    fontSize: 16,
    paddingLeft: 4,
    paddingRight: 4
  },
  commentText: {
    fontSize: 16,
    paddingLeft: 4,
    color: 'darkgray'
  },
  regularFont: {
    fontSize: 14
  },
  username: {
    fontSize: 14,
    color: 'blue'
  },
  menuText: {
    fontSize: 16,
    color: 'black',
    paddingLeft: 4
  },
  menuItems: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})
