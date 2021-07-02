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
      userId: firebase.auth().currentUser.uid
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

        if (this.state.refreshing) {
          this.setState({ refreshing: false })
        }
      } catch (e) {
        console.log(e)
      }
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
