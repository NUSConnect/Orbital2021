import * as ImagePicker from 'expo-image-picker'
import * as firebase from 'firebase'
import React from 'react'
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { logoutUser } from '../../api/auth'
import Button from '../../components/Button'
import { theme } from '../../core/theme'

export default class ProfilePersonalScreen extends React.Component {
    state = {
      currentUserId: firebase.auth().currentUser.uid,
      defaultUri:
            'https://firebasestorage.googleapis.com/v0/b/orbital2021-a4766.appspot.com/o/profile%2Fplaceholder.png?alt=media&token=8050b8f8-493f-4e12-8fe3-6f44bb544460',
      userData: null,
      uploaded: false,
      status: '',
      imageURL: '',
      bio: '',
      major: null,
      following: 0,
      followers: 0
    };

    static navigationOptions = {
      header: null
    };

    handleChooseImagePress = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1]
      })

      if (!result.cancelled) {
        const userId = this.state.currentUSerId
        const imagePath = 'profile/' + userId

        this.uploadImage(result.uri, imagePath)
          .then(async () => {
            console.log('Success')
            const url = await firebase
              .storage()
              .ref()
              .child(imagePath)
              .getDownloadURL()
            firebase
              .firestore()
              .collection('users')
              .doc(this.state.currentUserId)
              .update({ userImg: url })
            this.getUser()
          })
          .catch((error) => {
            console.log(error)
          })
      }
    };

    uploadImage = async (uri, imagePath) => {
      const response = await fetch(uri)
      const blob = await response.blob()

      const ref = firebase.storage().ref(imagePath)

      return ref.put(blob)
    };

    getUser = async () => {
      await firebase
        .firestore()
        .collection('users')
        .doc(this.state.currentUserId)
        .get()
        .then((documentSnapshot) => {
          if (documentSnapshot.exists) {
            console.log('User Data', documentSnapshot.data())
            this.setState({ userData: documentSnapshot.data() })
            this.setState({ bio: documentSnapshot.data().bio })
            this.setState({ major: documentSnapshot.data().major })
          }
        })
    };

    getFollowing = async () => {
      await firebase
        .firestore()
        .collection('users')
        .doc(this.state.currentUserId)
        .collection('following')
        .onSnapshot(querySnapshot => {
          this.setState({ following: querySnapshot.size - 1 })
        })
    }

    getFollowers = async () => {
      await firebase
        .firestore()
        .collection('users')
        .doc(this.state.currentUserId)
        .collection('followers')
        .onSnapshot(querySnapshot => {
          this.setState({ followers: querySnapshot.size })
        })
    }

    componentDidMount () {
      this.getUser()
      this.getFollowing()
      this.getFollowers()
      this._unsubscribe = this.props.navigation.addListener('focus', () => this.getUser())
    }

    componentWillUnmount () {
      this._unsubscribe()
    }

    render () {
      return (
        <SafeAreaView>
          <View style={styles.container}>
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <TouchableOpacity onPress={this.handleChooseImagePress}>
                  <Image
                    source={{
                      uri: this.state.userData
                        ? this.state.userData.userImg ||
                                              this.state.defaultUri
                        : this.state.defaultUri
                    }}
                    style={styles.avatar}
                  />
                </TouchableOpacity>
                <Text style={styles.name}>
                  {firebase.auth().currentUser.displayName}
                </Text>
                <Text style={styles.userInfo}>
                  Major: {this.state.major ? this.state.major : 'Undeclared'}
                </Text>
                <Text style={styles.userInfo}>
                  {this.state.bio}
                </Text>
                <View style={styles.following}>
                  <View>
                    <TouchableOpacity
                      style={styles.innerFollowing}
                      onPress={() => this.props.navigation.navigate('FollowersScreen', { userId: this.state.currentUserId })}
                    >
                      <Text style={styles.followWord}> {this.state.followers} </Text>
                      <Text style={styles.userInfo}> {this.state.followers === 1 ? 'Follower' : 'Followers'} </Text>
                    </TouchableOpacity>
                  </View>
                  <View>
                    <TouchableOpacity
                      style={styles.innerFollowing}
                      onPress={() => this.props.navigation.navigate('FollowingScreen', { userId: this.state.currentUserId })}
                    >
                      <Text style={styles.followWord}> {this.state.following} </Text>
                      <Text style={styles.userInfo}> Following </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.body}>
              <Button
                style={styles.accountset}
                onPress={() =>
                  this.props.navigation.navigate('AddBioScreen')}
              >
                Update Bio
              </Button>
              <Button
                style={styles.accountset}
                onPress={() =>
                  this.props.navigation.navigate('AddFacultyScreen')}
              >
                Add your major
              </Button>
              <Button
                style={styles.accountset}
                onPress={() =>
                  this.props.navigation.navigate(
                    'AccountSettingsScreen'
                  )}
              >
                Account Settings
              </Button>
              <Button
                style={styles.button}
                color='#de1738'
                onPress={logoutUser}
              >
                {' '}
                Logout{' '}
              </Button>
            </View>
          </View>
        </SafeAreaView>
      )
    }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface
  },
  header: {
    backgroundColor: '#DCDCDC'
  },
  headerContent: {
    padding: 30,
    alignItems: 'center'
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: 'white',
    marginBottom: 10
  },
  name: {
    fontSize: 22,
    color: '#000000',
    fontWeight: '600'
  },
  userInfo: {
    fontSize: 16,
    color: '#778899',
    fontWeight: '600'
  },
  body: {
    backgroundColor: '#FFFFFF',
    height: 500,
    alignItems: 'center'
  },
  item: {
    flexDirection: 'row'
  },
  infoContent: {
    flex: 1,
    alignItems: 'flex-start',
    paddingLeft: 5
  },
  iconContent: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 5
  },
  icon: {
    width: 30,
    height: 30,
    marginTop: 20
  },
  info: {
    fontSize: 18,
    marginTop: 20,
    color: '#FFFFFF'
  },
  accountset: {
    backgroundColor: '#FFFFFF'
  },
  logout: {
    backgroundColor: '#add8e6'
  },
  following: {
    flexDirection: 'row',
    marginTop: 10
  },
  innerFollowing: {
    alignItems: 'center',
    paddingRight: 25,
    paddingLeft: 25
  },
  followWord: {
    fontSize: 20,
    color: '#000000',
    fontWeight: '600'
  }
})
