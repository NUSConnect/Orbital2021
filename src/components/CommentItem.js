import * as firebase from 'firebase'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { MaterialIcons } from 'react-native-vector-icons'
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu'

const CommentItem = ({ route, item, onViewProfile, onEdit, onDelete, onReport }) => {
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
      <View style={styles.comment}>
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

        <Text style={styles.text} testID='comment'>
          {item.commentBody}
        </Text>
      </View>
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
          <Menu style={styles.centerAlign}>
            <MenuTrigger>
              <MaterialIcons name='more-vert' size={26} color='darkgray' />
            </MenuTrigger>
            <MenuOptions>
              <MenuOption onSelect={() => onReport()}>
                <View style={styles.menuItems}>
                  <MaterialIcons name='report' size={26} color='gray' />
                  <Text style={styles.menuText}>Report</Text>
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
          )}
    </View>
  )
}

export default CommentItem

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: '100%',
    marginBottom: 2,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  comment: {
    width: '90%'
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
