import * as firebase from 'firebase'
import React from 'react'
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import ModalSelector from 'react-native-modal-selector'
import { MaterialCommunityIcons } from 'react-native-vector-icons'
import { sortByLatest, sortByTrending } from '../../api/ranking'
import HomeTopTab from '../../components/HomeTopTab'
import PostCard from '../../components/PostCard'

export default class HomePostsScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      currentUserId: firebase.auth().currentUser.uid,
      data: [],
      refreshing: true,
      deleted: false,
      sortedBy: null,
      sortingOptions: [
        { key: 0, section: true, label: 'Sort posts by:' },
        { key: 1, label: 'Latest' },
        { key: 2, label: 'Trending' }
      ],
      haveNewMessage: false
    }
  }

  componentDidMount () {
    this.getUser()
    this.fetchHaveNewMessage()
    this.fetchPosts()
    this._unsubscribe = this.props.navigation.addListener('focus', () =>
      this.fetchPosts()
    )
  }

  componentWillUnmount () {
    this._unsubscribe()
  }

    fetchHaveNewMessage = () => {
      firebase
        .firestore()
        .collection('users')
        .doc(this.state.currentUserId)
        .onSnapshot((documentSnapshot) => this.setState({ haveNewMessage: documentSnapshot.data().haveNewMessage }))
      console.log(this.state.haveNewMessage)
    }

    getUser = async () => {
      await firebase
        .firestore()
        .collection('users')
        .doc(this.state.currentUserId)
        .get()
        .then((documentSnapshot) => {
          if (documentSnapshot.data().preferredSorting != null) {
            this.setState({
              sortedBy: documentSnapshot.data().preferredSorting
            })
          } else {
            this.setState({ sortedBy: 'Latest' })
          }
        })
    };

    fetchPosts = async () => {
      try {
        const following = []
        await firebase
          .firestore()
          .collection('users')
          .doc(this.state.currentUserId)
          .collection('following')
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              following.push(doc.id)
            })
          })

        // console.log("Following: ", following);
        const list = []
        this.setState({ refreshing: true })

        for (let i = 0; i < following.length; i++) {
          const followingId = following[i]

          await firebase
            .firestore()
            .collection('posts')
            .doc(followingId)
            .collection('userPosts')
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const {
                  userId,
                  postId,
                  post,
                  postImg,
                  postTime,
                  likeCount,
                  commentCount
                } = doc.data()
                list.push({
                  id: doc.id,
                  userId,
                  userName: 'Test Name',
                  userImg:
                                    'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg',
                  postId,
                  postTime: postTime,
                  post,
                  postImg,
                  likeCount,
                  commentCount
                })
              })
            })
        }

        switch (this.state.sortedBy) {
          case 'Latest':
            list.sort(sortByLatest)
            break
          case 'Trending':
            list.sort(sortByTrending)
            break
          default:
            list.sort(sortByLatest)
        }
        this.setState({ data: list })

        if (this.state.refreshing) {
          this.setState({ refreshing: false })
        }

        //            console.log("Posts: ", this.state.data);
      } catch (e) {
        console.log(e)
      }
    };

    changeSorting = async (sorter) => {
      this.setState({ sortedBy: sorter })
      await firebase
        .firestore()
        .collection('users')
        .doc(this.state.currentUserId)
        .update({
          preferredSorting: sorter
        })
      this.fetchPosts()
    };

    handleDelete = (postId) => {
      Alert.alert(
        'Delete post',
        'Are you sure?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed!'),
            style: 'cancel'
          },
          {
            text: 'Confirm',
            onPress: () => this.deletePost(postId)
          }
        ],
        { cancelable: false }
      )
    };

    deletePost = (postId) => {
      // console.log("Current Post Id: ", postId);

      firebase
        .firestore()
        .collection('posts')
        .doc(this.state.currentUserId)
        .collection('userPosts')
        .doc(postId)
        .get()
        .then((documentSnapshot) => {
          if (documentSnapshot.exists) {
            const { postImg } = documentSnapshot.data()

            if (postImg != null) {
              const storageRef = firebase
                .storage()
                .refFromURL(postImg)
              // console.log("storageRef", storageRef.fullPath);
              const imageRef = firebase
                .storage()
                .ref(storageRef.fullPath)

              imageRef
                .delete()
                .then(() => {
                  console.log(
                                    `${postImg} has been deleted successfully.`
                  )
                  this.deleteFirestoreData(postId)
                })
                .catch((e) => {
                  console.log(
                    'Error while deleting the image. ',
                    e
                  )
                })
              // If the post image is not available
            } else {
              this.deleteFirestoreData(postId)
            }
          }
        })
    };

    deleteFirestoreData = (postId) => {
      firebase
        .firestore()
        .collection('posts')
        .doc(this.state.currentUserId)
        .collection('userPosts')
        .doc(postId)
        .delete()
        .then(() => {
          Alert.alert(
            'Post deleted!',
            'Your post has been deleted successfully!'
          )
          this.setState({ deleted: true })
          this.fetchPosts()
        })
        .catch((e) => console.log('Error deleting post.', e))
    };

    handleReport = (postId, userId) => {
      Alert.alert(
        'Report Post',
        'Are you sure?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed!'),
            style: 'cancel'
          },
          {
            text: 'Confirm',
            onPress: () =>
              this.props.navigation.navigate('ReportPostScreen', { postId: postId, userId: userId })
          }
        ],
        { cancelable: false }
      )
    };

    renderItemComponent = (data) => (
      <TouchableOpacity style={styles.container}>
        <Image style={styles.image} source={{ uri: data.item.url }} />
      </TouchableOpacity>
    );

    ItemSeparator = () => (
      <View
        style={{
          height: 2,
          backgroundColor: 'rgba(0,0,0,0.5)',
          marginLeft: 10,
          marginRight: 10
        }}
      />
    );

    handleRefresh = () => {
      this.setState({ refreshing: false }, () => {
        this.fetchPosts()
      })
    };

    navigateProfile = (creatorId, ownNavigation, otherNavigation) => {
      return (currUserId) => {
        // console.log("Current User: ", currUserId);
        // console.log("Creator User: ", creatorId);
        if (currUserId === creatorId) {
          ownNavigation()
        } else {
          otherNavigation()
        }
      }
    };

    render () {
      const { navigation } = this.props
      return (
        <SafeAreaView>
          {!this.state.haveNewMessage
            ? (
              <HomeTopTab
                onPress={() => navigation.navigate('MessagesScreen')}
                onPress2={() => navigation.navigate('AddPostScreen')}
                icon='chatbubbles-outline'
                color='#79D2E6'
              />
              )
            : (
              <HomeTopTab
                onPress={() => navigation.navigate('MessagesScreen')}
                onPress2={() => navigation.navigate('AddPostScreen')}
                icon='alert-circle-outline'
                color='#ff7f50'
              />
              )}
          {this.state.data.length !== 0
            ? (<FlatList
                data={this.state.data}
                ListHeaderComponent={
                  <View style={styles.sortBar}>
                    <MaterialCommunityIcons
                      name='sort'
                      color='blue'
                      size={26}
                    />
                    <Text style={styles.text}>{'Sorted by: '}</Text>
                    <ModalSelector
                      data={this.state.sortingOptions}
                      initValue={this.state.sortedBy}
                      onChange={(option) =>
                        this.changeSorting(option.label)}
                      animationType='fade'
                      backdropPressToClose
                      overlayStyle={{
                        flex: 1,
                        padding: '5%',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0,0,0,0.9)'
                      }}
                      sectionTextStyle={{ fontSize: 20 }}
                      cancelTextStyle={{
                        color: 'crimson',
                        fontSize: 20
                      }}
                      cancelText='Cancel'
                      optionTextStyle={{ fontSize: 20 }}
                    >
                      <TextInput
                        style={styles.pickerText}
                        editable={false}
                        placeholder={this.state.sortedBy}
                        value={this.state.sortedBy}
                      />
                    </ModalSelector>
                  </View>
                    }
                ListHeaderComponentStyle={styles.headerComponentStyle}
                renderItem={({ item }) => (
                  <PostCard
                    item={item}
                    onViewProfile={this.navigateProfile(
                      item.userId,
                      () => navigation.navigate('Profile'),
                      () =>
                        navigation.navigate('ViewProfileScreen', {
                          item
                        })
                    )}
                    onDelete={this.handleDelete}
                    onReport={this.handleReport}
                    onEdit={() =>
                      navigation.navigate('EditPostScreen', { item })}
                    onPress={() =>
                      navigation.navigate('CommentScreen', { item })}
                  />
                )}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={this.ItemSeparator}
                refreshing={this.state.refreshing}
                onRefresh={this.handleRefresh}
                style={{ marginBottom: 40 }}
               />)
            : (
              <View style={styles.postMessage}>
                <Text style={styles.postsDescription}>
                  No posts here!{'\n'}Follow someone or make a post yourself.
                </Text>
              </View>
              )}
        </SafeAreaView>
      )
    }
}

const styles = StyleSheet.create({
  container: {
    height: 300,
    margin: 10,
    backgroundColor: '#FFF',
    borderRadius: 6
  },
  sortBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10
  },
  text: {
    fontSize: 16
  },
  pickerText: {
    fontSize: 16,
    color: 'blue',
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: 'gray'
  },
  headerComponentStyle: {
    marginVertical: 7
  },
  image: {
    height: '100%',
    borderRadius: 4
  },
  postMessage: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '50%'
  },
  postsDescription: {
    fontSize: 18,
    color: 'darkslategrey',
    width: '90%'
  }
})
