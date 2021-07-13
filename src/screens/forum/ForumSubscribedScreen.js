import * as firebase from 'firebase'
import React from 'react'
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  View,
  StyleSheet,
  Text
} from 'react-native'
import ForumIcon from '../../components/ForumIcon'

export default class ForumFavouritesScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      currentUserId: firebase.auth().currentUser.uid,
      data: [],
      refreshing: true,
      loading: true
    }
  }

  componentDidMount () {
    this.fetchForums()
    this._unsubscribe = this.props.navigation.addListener('focus', () => this.fetchForums())
  }

  componentWillUnmount () {
    this._unsubscribe()
  }

    fetchForums = async () => {
      this.setState({ refreshing: true })
      const subscribed = []
      await firebase
        .firestore()
        .collection('users')
        .doc(this.state.currentUserId)
        .collection('subscribedForums')
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            subscribed.push(doc.id)
          })
        })

      const list = []
      this.setState({ refreshing: true })

      for (let i = 0; i < subscribed.length; i++) {
        const forumId = subscribed[i]

        await firebase
          .firestore()
          .collection('forums')
          .doc(forumId)
          .get()
          .then((doc) => {
            const { forumName, forumImg } = doc.data()
            list.push({
              id: doc.id,
              forumName,
              forumImg
            })
            console.log(list)
          })
      }

      list.sort(function (x, y) {
        return y.forumName - x.forumName
      })
      this.setState({ data: list })

      if (this.state.refreshing) {
        this.setState({ refreshing: false, loading: false })
      }
      console.log('Subscribed Forums', this.state.data)
    };

    ItemSeparator = () => (
      <View
        style={{
          height: 2,
          marginLeft: 10,
          marginRight: 10
        }}
      />
    );

    handleRefresh = () => {
      this.setState({ refreshing: false }, () => {
        this.fetchForums()
      })
    };

    render () {
      const { navigation } = this.props
      return (
        <SafeAreaView style={{ flex: 1 }}>
          {this.state.data.length !== 0 && !this.state.loading
            ? (<FlatList
                numColumns={3}
                data={this.state.data}
                renderItem={({ item }) => (
                  <ForumIcon
                    item={item}
                    onPress={() =>
                      navigation.navigate('SubForumScreen', { item })}
                  />
                )}
                keyExtractor={(item) => item.id.toString()}
                ItemSeparatorComponent={this.ItemSeparator}
                refreshing={this.state.refreshing}
                onRefresh={this.handleRefresh}
               />)
            : this.state.loading
              ? (
                <View style={styles.postMessage}>
                  <ActivityIndicator size='large' color='#0000ff' />
                </View>
                )
              : (
                <View style={styles.postMessage}>
                  <Text style={styles.postsDescription}>
                    You have no favourited portals.
                  </Text>
                  <Text style={styles.postsDescription}>
                    Try favouriting by tapping the star on any portal header!
                  </Text>
                </View>
                )}
        </SafeAreaView>
      )
    }
}

const styles = StyleSheet.create({
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
