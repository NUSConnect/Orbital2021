import * as firebase from 'firebase'
import React, { useState } from 'react'
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  CheckBox
} from 'react-native'
import GroupCreationTopTab from '../../components/GroupCreationTopTab'
import CheckList from  '../../components/CheckList'

export default function MatchMeScreen ({ props, route, navigation }) {
  const currentUserId = firebase.auth().currentUser.uid

  const interests = ['Eat', 'Sleep', 'Drink']

  const selectItem = (key) => {
    const selectedUsers = users
    for (const item of selectedUsers) {
      if (item.otherId === key) {
        item.isSelected = (item.isSelected == null) ? true : !item.isSelected
        if (item.isSelected) {
          setMembers(oldArray => [...oldArray, { userId: item.otherId, name: item.name }])
        } else {
          setMembers(members.filter(mem => mem.userId !== item.otherId))
        }
        setItemChecked((prevState) => !prevState)
        break
      }
    }
    setUsers(selectedUsers)
  }

  return (
    <View style={styles.container}>
      <GroupCreationTopTab
        text='Match Me!'
        onBack={() => navigation.goBack()} onPress={() => console.log('done')}
      />
      {interests.map((value, i) => {
        return (
          <CheckList
            key={i}
            item={value}
            //select items = {..}
            id={i}
          />
        );
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1
  },
  collapsible: {
    backgroundColor: 'darkorange'
  },
  collapsibleTitle: {
    color: 'darkorange'
  },
})
