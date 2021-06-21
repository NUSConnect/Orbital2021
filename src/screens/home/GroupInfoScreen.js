import * as firebase from 'firebase'
import React, { useEffect, useState } from 'react'
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import TitleWithBack from '../../components/TitleWithBack'
import {
  Card, TextSection, UserImg, UserImgWrapper, UserInfo, UserInfoText, UserName
} from '../../styles/MessageStyles'

const GroupInfoScreen = ({ navigation, route, onPress }) => {
  const currentUserId = firebase.auth().currentUser.uid
  const [members, setMembers] = useState([])
  const { item } = route.params

  const getMembers = async () => {
    const list = []
    for (const memberId of item.members) {
      await firebase.firestore().collection('users').doc(memberId).get()
        .then((doc) => {
          const { name, userImg, bio } = doc.data()
          list.push({ userId: doc.id, name, userImg, bio })
        })
    }
    setMembers(list)
  }

  const viewProfile = (user) => {
    if (user.userId === currentUserId) {
      navigation.navigate('Profile')
    } else {
      navigation.navigate('ViewProfileScreen', { item: user })
    }
  }

  useEffect(() => {
    getMembers()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <TitleWithBack onPress={() => navigation.goBack()} />
      <View style={styles.profileContainer}>
        <Image
          source={{
            uri: item.avatar
          }}
          style={styles.profilePic}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.name}>
            {' '}
            {item.name}{' '}
          </Text>
          <Text style={styles.userInfo}>
            {' '}
            Description: {item.description}{' '}
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('EditGroupScreen', { item })}
            >
              <Text style={styles.text}>Edit Group</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View
        style={{
          height: 2,
          backgroundColor: 'rgba(0,0,0,0.5)',
          marginLeft: 10,
          marginRight: 10
        }}
      />
      <FlatList
        numColumns={1}
        horizontal={false}
        data={members}
        ListHeaderComponent={
          <View style={{ width: '100%' }}>
            <Text style={styles.memberHeader}>
              Members
            </Text>
            <View
              style={{
                height: 2,
                backgroundColor: 'rgba(0,0,0,0.5)',
                marginLeft: 10,
                marginRight: 10
              }}
            />
          </View>
                }
        ListHeaderComponentStyle={styles.headerComponentStyle}
        renderItem={({ item }) => (
          <Card
            onPress={() => viewProfile(item)}
          >
            <UserInfo>
              <UserImgWrapper>
                <UserImg source={{ uri: item.userImg }} />
              </UserImgWrapper>
              <TextSection>
                <UserInfoText>
                  <UserName>{item.name}</UserName>
                </UserInfoText>
                <Text style={styles.bio}>{item.bio}</Text>
              </TextSection>
            </UserInfo>
          </Card>

        )}
        keyExtractor={(item) => item.userId}
        style={{ width: '100%', marginBottom: 40 }}
      />
    </SafeAreaView>
  )
}

export default GroupInfoScreen

const styles = StyleSheet.create({
  container: {
    flex: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileContainer: {
    backgroundColor: '#DCDCDC',
    width: '100%',
    height: 130,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row'
  },
  profileInfo: {},
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'white',
    margin: 5
  },
  name: {
    fontSize: 18,
    color: '#000000',
    fontWeight: '600',
    paddingTop: 10
  },
  userInfo: {
    fontSize: 14,
    color: '#778899',
    fontWeight: '600',
    flexWrap: 'wrap',
    paddingLeft: 4,
    width: 280
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingLeft: 10
  },
  button: {
    height: 40,
    width: 120,
    backgroundColor: '#87cefa',
    borderRadius: 20,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  memberHeader: {
    fontSize: 20,
    paddingLeft: 10,
    height: 50,
    paddingVertical: 10
  },
  text: {
    fontSize: 16,
    color: 'white'
  },
  bio: {
    fontSize: 16,
    color: 'black'
  }
})
