import * as firebase from 'firebase'
import React, { useState, useEffect } from 'react'
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { Divider } from 'react-native-paper'
import GroupCreationTopTab from '../../components/GroupCreationTopTab'
import SearchBar from '../../components/SearchBar'
import {
  TextSection,
  UserImg,
  UserImgWrapper,
  UserInfo,
  UserInfoText,
  UserName
} from '../../styles/MessageStyles'
import { sortByName } from '../../api/ranking'

export default function ForumAdminSelectionScreen ({ props, route, navigation }) {
  const currentUserId = firebase.auth().currentUser.uid
  const [filteredDataSource, setFilteredDataSource] = useState([])
  const [search, setSearch] = useState('')
  const [filtered, setFiltered] = useState(false)

  const { name, userId } = route.params
  const [forums, setForums] = useState(null)
  const [itemChecked, setItemChecked] = useState(false)
  const [currentlyAdmin, setCurrentlyAdmin] = useState(null)
  const [selectedForums, setSelectedForums] = useState([])

  const getAllForums = async () => {
    const adminOf = []
    const adminForumIds = {}
    await firebase.firestore().collection('users').doc(userId).collection('forumAdmin').get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          adminOf.push({
            id: doc.id,
            name: doc.data().name
          })
          adminForumIds[doc.id] = true
        })
      })
    setSelectedForums(adminOf)
    setCurrentlyAdmin(adminForumIds)

    const list = []

    await firebase.firestore().collection('forums').get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const { forumName, forumImg, forumDescription } = doc.data()
          const selected = adminForumIds[doc.id]
          list.push({
            id: doc.id,
            name: forumName,
            img: forumImg,
            description: forumDescription,
            isSelected: selected
          })
        })
      })
    list.sort(sortByName)
    setForums(list)
  }

  const searchFilterFunction = (text) => {
    if (text) {
      const newData = forums.filter(function (item) {
        const itemData = item.name
          ? item.name.toUpperCase()
          : ''.toUpperCase()
        const textData = text.toUpperCase()
        return itemData.indexOf(textData) > -1
      })
      setFiltered(true)
      setFilteredDataSource(newData)
      setSearch(text)
    } else {
      setFilteredDataSource(forums)
      setSearch(text)
    }
  }

  const selectItem = (key) => {
    const list = forums
    for (const item of list) {
      if (item.id === key) {
        item.isSelected = (item.isSelected == null) ? true : !item.isSelected
        if (item.isSelected) {
          setSelectedForums(oldArray => [...oldArray, { id: item.id, name: item.name }])
        } else {
          setSelectedForums(selectedForums.filter(forum => forum.id !== item.id))
        }
        setItemChecked((prevState) => !prevState)
        break
      }
    }
    setForums(list)
  }

  const changeForumAdminStatus = async () => {
    if (selectedForums.length === 0) {
      firebase.firestore().collection('users').doc(userId).update({ forumAdmin: false })
      firebase.firestore().collection('users').doc(userId).collection('forumAdmin').get()
        .then(querySnapshot => {
          querySnapshot.forEach(documentSnapshot => {
            removeAdmin(documentSnapshot.id)
            documentSnapshot.ref.delete()
          })
        })
    } else {
      const added = {}
      for (let i = 0; i < selectedForums.length; i++) {
        firebase.firestore().collection('users').doc(userId).update({ forumAdmin: true })

        const forumId = selectedForums[i].id
        const name = selectedForums[i].name
        firebase.firestore().collection('users').doc(userId).collection('forumAdmin').doc(forumId)
          .set({ name: name })
        addAdmin(forumId)
        added[forumId] = true
      }

      const keys = Object.keys(currentlyAdmin)
      keys.forEach((key, index) => {
        if (added[key] != true) {
          firebase.firestore().collection('users').doc(userId).collection('forumAdmin').doc(key).delete()
          removeAdmin(key)
        }
      })
    }

    navigation.goBack()
  }

  const addAdmin = (forumId) => {
    firebase.firestore().collection('forums').doc(forumId).collection('admins').doc(userId).set({})
  }

  const removeAdmin = (forumId) => {
    firebase.firestore().collection('forums').doc(forumId).collection('admins').doc(userId).delete()
  }

  useEffect(() => {
    getAllForums()
  }, [])

  return (
    <View style={styles.container}>
      <GroupCreationTopTab
        text={name}
        onBack={() => navigation.goBack()} onPress={() => changeForumAdminStatus()}
      />
      <View style={styles.selected}>
        <Text style={styles.subHeader}>
          Managed Forums
        </Text>
        <FlatList
          numColumns={3}
          data={selectedForums}
          renderItem={({ item }) => (
            <Text style={styles.selected}>
              {item.name}
            </Text>
          )}
          keyExtractor={(item) => item.name}
          extraData={itemChecked}
        />
      </View>
      <SearchBar
        search={search}
        setSearch={setSearch}
        searchFilterFunction={searchFilterFunction}
        resetFilter={() => setFilteredDataSource(threads)}
      />
      <FlatList
        data={filtered ? filteredDataSource : forums}
        keyExtractor={(item) => item.name}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => selectItem(item.id)}
            style={{ width: '100%', backgroundColor: item.isSelected ? '#DDD' : '#FFF' }}
          >
            <UserInfo>
              <UserImgWrapper>
                <UserImg source={{ uri: item.img }} />
              </UserImgWrapper>
              <TextSection>
                <UserInfoText>
                  <UserName>{item.name}</UserName>
                </UserInfoText>
                <Text style={styles.text}>{item.description}</Text>
              </TextSection>
            </UserInfo>
          </TouchableOpacity>
        )}
        extraData={itemChecked}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1
  },
  subHeader: {
    color: 'black',
    fontSize: 20,
    paddingLeft: 8
  },
  listTitle: {
    fontSize: 22
  },
  listDescription: {
    fontSize: 16
  },
  header: {
    fontSize: 35,
    textAlign: 'right',
    backgroundColor: '#ff8c00',
    padding: 10,
    color: '#ffffff'
  },
  text: {
    color: 'black',
    fontSize: 14
  },
  selected: {
    color: 'black',
    fontSize: 16,
    paddingLeft: 8,
    paddingRight: 8
  }
})
