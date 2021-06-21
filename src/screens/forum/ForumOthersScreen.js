import React from 'react'
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'

export default class ForumOthersScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      refreshing: true
    }
  }

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
        this.fetchCats()
      })
    };

    render () {
      const { navigation } = this.props
      return (
        <SafeAreaView>
          <Text style={styles.createForum}>
            Can't find what you're looking for?
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() =>
                navigation.navigate('ForumCreationScreen')}
            >
              <Text style={styles.buttonText}>
                OPEN A NEW PORTAL
              </Text>
            </TouchableOpacity>
          </View>
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
  createForum: {
    fontSize: 20,
    color: '#000000',
    paddingLeft: 20,
    paddingTop: 10
  },
  image: {
    height: '100%',
    borderRadius: 4
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
    paddingTop: 4
  },
  buttonStyle: {
    height: 50,
    backgroundColor: '#79D2E6',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    borderRadius: 50
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
    padding: 10
  }
})
