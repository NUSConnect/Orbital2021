import * as firebase from 'firebase'
import React from 'react'
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native'
import MatchCard from '../../components/MatchCard'

export default class MatchHistoryScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      refreshing: true,
      userId: firebase.auth().currentUser.uid,
      otherName: '',
      otherBio: '',
      otherEmail: '',
      otherCreatedAt: ''
    }
  }

  componentDidMount () {
    this.fetchMatchHistory()
    this._unsubscribe = this.props.navigation.addListener('focus', () =>
      this.fetchMatchHistory()
    )
  }

  componentWillUnmount () {
    this._unsubscribe()
  }

    fetchMatchHistory = async () => {
      try {
        const list = []
        this.setState({ refreshing: true })

        await firebase
          .firestore()
          .collection('users')
          .doc(this.state.userId)
          .collection('matchHistory')
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              const {
                groupChatThread,
                isGroup,
                success,
                timeMatched,
                users
              } = doc.data()
              list.push({
                id: doc.id,
                groupChatThread,
                isGroup,
                success,
                timeMatched,
                users
              })
            })
          })

        this.setState({ data: list })
        console.log(this.state.data)

        if (this.state.refreshing) {
          this.setState({ refreshing: false })
        }
      } catch (e) {
        console.log(e)
      }
    }

      getOtherInfo = async () => {
        if (this.state.data.isGroup || this.state.data.isGroup === undefined) {
          console.log('Group')
        } else {
          const otherId = this.state.data.users.filter(x => x !== firebase.auth().currentUser.uid)[0]
          await firebase
            .firestore()
            .collection('users')
            .doc(otherId)
            .get()
            .then(documentSnapshot => {
              const { name, bio, email, createdAt } = documentSnapshot.data()
              this.setState({ otherName: name, otherBio: bio, otherEmail: email, otherCreatedAt: createdAt })
            })
        }
      }

      navigateProfile = async () => {
        this.getOtherInfo()
        const userObj = {
          userId: this.state.otherId,
          name: this.state.otherName,
          bio: this.state.otherBio,
          email: this.state.otherEmail,
          createdAt: this.state.otherCreatedAt
        }
        console.log(userObj)
        this.props.navigation.navigate('ViewProfileScreen', { userObj })
      }

    renderItemComponent = (data) => (
      <TouchableOpacity style={styles.container} />
    );

    ItemSeparator = () => (
      <View
        style={{
          height: 20,
          backgroundColor: '#eeeeee',
          marginLeft: 10,
          marginRight: 10
        }}
      />
    );

    handleRefresh = () => {
      this.setState({ refreshing: false }, () => {
        this.fetchMatchHistory()
      })
    };

    render () {
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <FlatList
            data={this.state.data}
            renderItem={({ item }) => (
              <MatchCard
                item={item}
                onPress={() => this.navigateProfile()}
              />
            )}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={this.ItemSeparator}
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh}
            style={{ width: '100%', paddingBottom: 40 }}
          />
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
  image: {
    height: '100%',
    borderRadius: 4
  }
})
