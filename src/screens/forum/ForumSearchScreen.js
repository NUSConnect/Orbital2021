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
import SearchBar from '../../components/SearchBar'
import { sortByForumName } from '../../api/ranking'

export default class ForumSearchScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      refreshing: true,
      loading: true,
      search: '',
      filteredData: [],
      filtered: false
    }
  }

  componentDidMount () {
    this.fetchForums()
    this._unsubscribe = this.props.navigation.addListener('focus', () =>
      this.fetchForums()
    )
  }

  componentWillUnmount () {
    this._unsubscribe()
  }

    fetchForums = async () => {
      this.setState({ refreshing: true })
      const list = []

      await firebase
        .firestore()
        .collection('forums')
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const { forumName, forumImg } = doc.data()
            list.push({
              id: doc.id,
              forumName,
              forumImg
            })
          })
        })

      if (this.state.refreshing) {
        this.setState({ refreshing: false, loading: false })
      }
      list.sort(sortByForumName)
      this.setState({ data: list })
      console.log(this.state.data)
    };

    searchFilterFunction = (text) => {
      if (text) {
        const newData = this.state.data.filter(function (item) {
          const itemData = item.forumName
            ? item.forumName.toUpperCase()
            : ''.toUpperCase()
          const textData = text.toUpperCase()
          return itemData.indexOf(textData) > -1
        })
        this.setState({
          filtered: true,
          filteredData: newData,
          search: text
        })
      } else {
        this.setState({ filteredData: this.state.data, search: text })
      }
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
            ? (
              <View style={{ flex: 1 }}>
                <SearchBar
                  search={this.state.search}
                  setSearch={(text) => this.setState({ search: text })}
                  searchFilterFunction={this.searchFilterFunction}
                  resetFilter={() => this.setState({ filteredData: this.state.data })}
                />
                <Text />
                <FlatList
                  numColumns={3}
                  data={
                        this.state.filtered
                          ? this.state.filteredData
                          : this.state.data
                    }
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
                />
              </View>)
            : this.state.loading
              ? (
                <View style={styles.postMessage}>
                  <ActivityIndicator size='large' color='#0000ff' />
                </View>
                )
              : (
                <View style={styles.postMessage}>
                  <Text style={styles.postsDescription}>
                    There are currently no portals.{'\n'}Try opening one!
                  </Text>
                </View>)}
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
    width: '90%',
    textAlign: 'center'
  }
})
